"""
Functions for dealing with HistomicsUI annotations.

clean_annotation_documents
get_annotations_documents
get_document_access
update_document_access
save_roi_with_labelmask
contours_to_dsa_element
backup_annotations
make_roi_point_mask
blank_gt_codes
dsa_element_to_contours

"""
import numpy as np
from .girder_utils import get_region, get_tile_metadata, get_items, get_item_path
from histomicstk.annotations_and_masks.annotation_and_mask_utils import (
    _get_coords_from_element, scale_slide_annotations
)
import cv2
from pandas import DataFrame
from imageio import imwrite
from tqdm import tqdm
from pickle import dump, HIGHEST_PROTOCOL
from copy import deepcopy

from os import makedirs
from os.path import join, splitext


def clean_annotation_documents(documents):
    """A utility function that will go through a list of annotation documents and remove any documents and / or elements
    that are missing keys of interest - mainly each document must have the annotation key, the annotation dictionary
    should have elements and each element must have a group key.

    * If you run this function before interacting with annotation documents then your code can be a lot cleaner!

    Parameters
    ----------
    documents : list
        list of annotation documents in the HistomicsUI format

    Return
    ------
    new_docs : list
        list of annotations documents, after filtering out elements / documents that are missing critical data

    """
    new_docs = []

    for document in documents:
        if 'annotation' not in document:
            continue

        annotation = document['annotation']

        # if name not in annotation key then add it as blank
        if 'name' not in annotation:
            annotation['name'] = ''

        if 'elements' not in annotation:
            continue  # removing a document that has not elements associated

        new_elements = []

        for element in annotation['elements']:
            if 'group' in element:  # note that we do not keep elements that have no groups in clean mode
                new_elements.append(element)

        # if there where no elements then this document can be ignored
        if not len(new_elements):
            continue

        # add the new document with the checked elements, dictionary referencing is being used for cleaner code
        annotation['elements'] = new_elements

        new_docs.append(document)

    return new_docs


def get_annotations_documents(gc, item_id, clean=True):
    """Get item annotations.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    item_id : str
        the id of the item to check for annotations
    clean : bool (default: True)
        if True then annotation documents will be cleaned

    Return
    ------
    annotations : list
        annotation documents

    """
    # returns a list, each index is all the information for an annotation document
    annotations = gc.get(f'annotation/item/{item_id}')

    if clean:
        annotations = clean_annotation_documents(annotations)

    return annotations


def get_document_access(gc, document_id):
    """Get the access list of a specific annotation document.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    document_id : str
        the id of the annotation document

    Return
    ------
    access_list : dict
        dictionary contains two keys for groups and users that have permissions for this document

    """
    access_list = gc.get(f'annotation/{document_id}/access')

    return access_list


def update_document_access(gc, document_id, access_dict):
    """Update the access of an anotation document.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    document_id : str
        the id of the annotation document
    access_dict : dict
        the access dictionary to udpate to

    Return
    ------
    response : dict
        the girder response to the put call

    """
    # make sure there are not repeated users in the access dict
    users = []
    if 'user' in access_dict:
        for user in access_dict['users']:
            if user['_id'] in users:
                raise Exception('There are repeated user entries in the access dictionary')
            else:
                users.append(user['_id'])
    
    # convert the access dictionary to string format ready for put call
    doc_access = str(access_dict).replace("'", '"')

    response = gc.put(f'annotation/{document_id}/access?access={doc_access}')

    return response


def save_roi_with_labelmask(gc, itemid, roi_groups, annotation_groups, save_loc='', mag=None):
    """Pull all rectangle ROI annotations and create a label mask based on the annotation groups inside. The ROI image
    and label mask are saved to file and a dataframe is return with the information. If the ROI is rotated then the
    smallest bounding box is taken and the label mask uses 0 for the non-ROI region. 1 is used as the background (i.e.
    pixels that are in the ROI but don't fall in any annotation).

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    itemid : str
        the id of the item to check for annotations
    roi_groups : list
        annotation groups that if of rectangle type will be considered ROI regions
    annotation_groups : list
        annotation groups to check inside each ROI. The labels assigned are 2 for the first group, 3 for the second and
        so on. The 0 label is given for pixels outside of the ROI if the ROI was rotated and the smallest bounding
        region was pulled and 1 label is given for pixels inside the ROI but not part of an annotation (background).
    mag : float (default: None)
        the magnification to pull the regions at, if None then the magnification scanned at will be used (read from
        tile source metadata)
    save_loc : str (default: '')
        the location to save images and masks for the ROIs to, default option will save in the current directory. Images
         are saved as PNGs and masks as npy files with the same name as the DSA item but with ROI and MASK appended to
         it as well as the x,y location

    Return
    ------
    df : pandas.DataFrame
        contains information about each ROI saved (filepaths, location in WSI, magnification)

    """
    # create saving location
    if save_loc:
        makedirs(save_loc, exist_ok=True)

    # get the item name for saving path
    item_name, ext = splitext(gc.getItem(itemid)['name'])

    # create the label map for the annotation groups
    annotation_map = {group: i+2 for i, group in enumerate(annotation_groups)}

    # dict used to build the DataFrame
    data = {'filename': [], 'roi_filepath': [], 'mask_filepath': [], 'x': [], 'y': [], 'mag': [], 'roi_width': [],
            'roi_height': [], 'roi_group': []}

    roi_elements = []
    annotation_elements = []

    ann_docs = get_annotations_documents(gc, itemid)

    scan_mag = get_tile_metadata(gc, itemid)['magnification']

    if mag is not None:
        # scale annotations to matched magnification desired
        sf = mag / scan_mag
        ann_docs = scale_slide_annotations(ann_docs, sf=sf)
    else:
        mag = scan_mag
        sf = 1

    for ann_doc in ann_docs:
        # ignore annotation documents with no annotations
        if 'annotation' not in ann_doc or 'elements' not in ann_doc['annotation']:
            continue

        for element in ann_doc['annotation']['elements']:
            # ignore annotations with no assigned annotation group
            if 'group' not in element:
                continue
            group = element['group']

            if group in roi_groups and element['type'] == 'rectangle':
                roi_elements.append(element)
            elif group in annotation_groups:
                annotation_elements.append(element)

    # loop through each ROI
    for i, roi_element in enumerate(roi_elements):
        print(f'{item_name} - saving ROI {i + 1} / {len(roi_elements)}')
        data['filename'].append(item_name + ext)

        # get the four corners of the ROI (works with rotated ROIs)
        roi_corners = _get_coords_from_element(roi_element)

        # calculate the minimum / maximum x and y for the ROI
        scaled_roi_minx, scaled_roi_miny = np.min(roi_corners, axis=0)
        scaled_roi_maxx, scaled_roi_maxy = np.max(roi_corners, axis=0)

        # get the coordinates at scan magnification
        roi_minx, roi_miny = int(scaled_roi_minx / sf), int(scaled_roi_miny / sf)
        roi_maxx, roi_maxy = int(scaled_roi_maxx / sf), int(scaled_roi_maxy / sf)

        # get the smallest bounding region for the ROI
        roi_im = get_region(
            gc, itemid, {'left': roi_minx, 'right': roi_maxx, 'top': roi_miny, 'bottom': roi_maxy}, mag=mag
        )[:, :, :3]

        # get a blank label mask of the same size as the ROI image
        label_mask = np.ones(roi_im.shape[:-1], dtype=np.uint8)

        h, w = label_mask.shape

        # for each annotation element
        for element in annotation_elements:
            element_type = element['type']
            group = element['group']

            # get the coordinates and shift by the ROI location
            coordinates = _get_coords_from_element(element) - [scaled_roi_minx, scaled_roi_miny]

            # if point type then draw the point on the label mask
            if element_type == 'point':
                x, y = coordinates[0]
                if 0 <= x < w and 0 <= y < h:
                    label_mask[y, x] = annotation_map[group]
            else:
                label_mask = cv2.drawContours(label_mask, [coordinates], 0, annotation_map[group], thickness=cv2.FILLED)

        # pixels outside of ROI should be zero - only valid in rotated ROIs
        if roi_element['rotation'] != 0:
            # create a mask with the bounding box
            bounding_box_mask = np.zeros(roi_im.shape[:-1], dtype=np.uint8)
            bounding_box_mask = cv2.drawContours(bounding_box_mask, [roi_corners - [scaled_roi_minx, scaled_roi_miny]],
                                                 -1, 1, thickness=cv2.FILLED)
            # change the pixels in the label mask to 0 when not inside the ROI box
            label_mask[bounding_box_mask == 0] = 0

        # save the image and mask - using the x and y of the not-scaled region location
        roi_filepath = join(save_loc, f'{item_name}-ROI_left-{roi_minx}_top-{roi_miny}.png')
        mask_filepath = join(save_loc, f'{item_name}-MASK_left-{roi_minx}_top-{roi_miny}.png')
        imwrite(roi_filepath, roi_im)
        imwrite(mask_filepath, label_mask)

        data['roi_filepath'].append(roi_filepath)
        data['mask_filepath'].append(mask_filepath)
        data['x'].append(roi_minx)
        data['y'].append(roi_miny)
        data['mag'].append(mag)
        data['roi_width'].append(w)
        data['roi_height'].append(h)
        data['roi_group'].append(roi_element['group'])

    df = DataFrame(data)
    return df


def contours_to_dsa_element(contours, group, color, fillcolor=None, linewidth=3, xy_shift=None, sf=1.0):
    """Convert a list of opencv contours into Polygon style DSA elements.

    Parameters
    ----------
    contours : list
        opencv contours as obtained from the cv2.findContours function
    group : str
        annotation group to give to each element in the contours
    color : str
        color for annotation elements in format 'rgb(num, num, num).
    fillcolor : str
        a four-length tuple representing the RGBa to use as the fill of the annotation, the alpha value should be from 0
        to 1 representing opacity of the fill. If None then there will be no fill
    linewidth : int
        the thickness of the line in the annotations
    xy_shift : tuple
        if contour coordinates need to shift (shift is applied after scaling)
    sf : float
        scaling factor for coordinates - note that you usually are pushing these as annotations to the image so scale
        to match native magnification (shift is applied after scaling)

    Return
    ------
    elements : list
        a list of DSA style elements in the polyline format

    """
    if xy_shift is None:
        xy_shift = (0, 0)

    elements = []

    for contour in contours:
        points = []
        for i in range(contour.shape[0]):
            points.append([int(contour[i][0][0] * sf) + xy_shift[0], int(contour[i][0][1] * sf) + xy_shift[1], 0])

        element = {"lineColor": color, "lineWidth": linewidth, "type": "polyline", "closed": True,
                   'label': {'value': group}, 'group': group}

        if fillcolor is not None:
            element['fillColor'] = fillcolor
        else:
            element['fillColor'] = 'rgba(0,0,0,0)'

        element['points'] = points

        elements.append(element)

    return elements


def backup_annotations(gc, parent_id, savepath):
    """Save annotation information for all items in a folder / collection. The annotations are saved in a pickle format
    with keys being the item id but also containing the item name and DSA item path. Note that this appends all the
    annotation information into one variable which could lead to memory limits if you have very large amounts of
    annotation data. As an addition the metadata on the item is also saved. The annotation information is saved in
    annotation document format so it can be restored if lost.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    parent_id : str
        id of parent folder / collection
    savepath : str
        the filepath to the save annotations to, should be a json extension

    Return
    ------
    annotation_data : dict
        this dict is saved into pickle file, contains item ids as keys and the annotations, item name, item DSA path,
        and the metadata for the item. Items are included if they have annotation or metadata, excluded if they are
        missing both.

    """
    if not savepath.endswith(('.p', '.pickle', '.pkl')):
        raise Exception('Save filename must be of pickle extension (.p, .pickle, .pkl)')

    annotation_data = {}

    # loop through all items in this parent location
    items = get_items(gc, parent_id)
    print('Checking for annotations...')

    for item in tqdm(items):
        # check if there are any annotation docs
        ann_docs = get_annotations_documents(gc, item['_id'])

        # check metadata
        meta = item['meta'] if 'meta' in item else None

        # include item if it has annotations and / or has metadata
        if len(ann_docs) or meta is not None:
            itempath = get_item_path(gc, item['_id'])

            # add this item to the dictionary
            annotation_data[item['_id']] = {'itemname': item['name'], 'itempath': itempath}
            if len(ann_docs):
                annotation_data[item['_id']]['annotation_docs'] = ann_docs
            if meta is not None:
                annotation_data[item['_id']]['meta'] = meta

    # save the results to file and return them
    print('\nSaving annotations to file...')
    with open(savepath, 'wb') as fp:
        dump(annotation_data, fp, protocol=HIGHEST_PROTOCOL)

    return annotation_data


def make_roi_point_mask(roi_element, point_elements, point_groups):
    """Given an ROI annotation and a list of point annotations create an int mask representation. The int value of -1
    is used for pixels that do not fall in the ROI (only present if the ROI is angled), int values from 1 to n is used
    for point groups found (the map for these int values is returned as dict, but can also be passed to force it). Int
    value of 0 is used for pixels that fall in the ROI but are not of a point group.

    This function is compatible with cleaned elements, will error if elements don't have group key.

    Parameters
    ----------
    roi_element : dict
        the ROI element to use
    point_elements : list
        list of point elements, note that only point elements will be used, all others are ignored
    point_groups : dict
        specify which point annotation groups should be included, the value should be the int to populate int mask

    Returns
    -------
    int_mask : array-like
        numpy mask of type uint8, -1 is for pixels not in ROI, 0 is values in ROI and values 1 to n designate pixels
        that are point annotation of specific annotation groups
    point_counts : dict
        counts of point annotations of each group type

    """
    # get the coordinates of the ROI element
    # NOTE: this will fail if element is not of rectangular type, and will change it to a polyline type
    roi_corners = _get_coords_from_element(deepcopy(roi_element))

    # get coordinates for the corners of the smallest bounding box on the ROI annotation
    roi_minx, roi_miny = np.min(roi_corners, axis=0)
    roi_maxx, roi_maxy = np.max(roi_corners, axis=0)

    # mask with / height is calculated from corner coords
    width = roi_maxx - roi_minx
    height = roi_maxy - roi_miny

    # shift the roi corners by location of smallest bounding box (wsi coords vs bounding box coords)
    roi_corners = roi_corners - [roi_minx, roi_miny]

    # create int mask with -1 as fill values
    int_mask = np.full((height, width), -1, dtype=np.int8)

    # draw the ROI inside with 1 fill values
    int_mask = cv2.drawContours(int_mask, [roi_corners], -1, 0, thickness=cv2.FILLED)

    # loop through each point element
    point_counts = {k: 0 for k in point_groups.keys()}
    for point_element in point_elements:
        # skip non-point elements and elements of group not of interest
        if point_element['type'] != 'point':
            continue

        if point_element['group'] not in point_groups:
            continue

        # shift point
        x, y = int(point_element['center'][0] - roi_minx), int(point_element['center'][1] - roi_miny)

        # check pixel value (catch exception when point does not fall in smallest bounding box)
        try:
            pixel = int_mask[y, x]
        except IndexError:
            continue

        if pixel == 0:
            # this point falls in this ROI - add the value to mask and increase the counts tally
            int_mask[y, x] = point_groups[point_element['group']]
            point_counts[point_element['group']] += 1

    return int_mask, point_counts


def blank_gt_codes(group_names):
    """Return a blank data frame for use in the GT codes parameters of HistomicsTK annotation to masks modules.

    Parameter
    ---------
    group_names : list
        list of names matching the annotation groups of interest

    Return
    ------
    gt_codes : dataframe
        blank dataframe with columns needed for the GT codes parameter

    """
    gt_data = [
        [group_name, 1, i + 1, 0, 0, f'rgb(0, 0, {i})', ''] for i, group_name in enumerate(group_names)
    ]
    gt_codes = DataFrame(
        columns=['group', 'overlay_order', 'GT_code', 'is_roi', 'is_background_class', 'color', 'comments'],
        data=gt_data,
        index=range(len(group_names)))
    gt_codes.index = gt_codes.loc[:, 'group']

    return gt_codes


def dsa_element_to_contours(elements, xy_shift=None, sf=1.0):
    """Convert a list of DSA elements to opencv style contours: (num_points, 1, 2) shape with x,y format. Note that
    there are different type of DSA elements - point, polygon, and rectangular. This function will only work with
    polygon types and in the future rectangular types but will never work with point annotations..

    INPUTS
    ------
    elements : list
        list of DSA elements, if you only have one then just enclose the element dict in a list
    xy_shift : tuple (default: None)
        if contour coordinates need to shift (shift is applied after scaling)
    sf : float  (default 1.0)
        scaling factor for coordinates (shift is applied after scaling)

    RETURNS
    -------
    contours : list
        list of opencv style contours
    groups : list
        DSA group of each contour, indices matches the contours return parameter

    """
    if xy_shift is None:
        xy_shift = (0, 0)

    contours = []
    groups = []

    for element in elements:
        element_type = element['type']
        if element_type == 'polyline':
            contour = []
            for point in element['points']:
                contour.append([int(sf * point[0] - xy_shift[0]), int(sf * point[1] - xy_shift[1])])
            contour = np.array(contour)
            contour = np.expand_dims(contour, axis=1)
            contours.append(contour)
        elif element_type == 'rectangular':
            print("Ignoring element because it is of rectangular type - this type will be supported in future update!")
            continue
        else:
            print(f'Ignoring element because "{element_type}" type is not supported')
            continue

        groups.append(element['group'])

    return contours, groups


def rotate_point_list(point_list, rotation, center=(0, 0)):
    """Rotate a list of x, y points around a center location.

    Adapted from: https://github.com/DigitalSlideArchive/HistomicsTK/blob/master/histomicstk/annotations_and_masks/annotation_and_mask_utils.py

    INPUTS
    ------
    point_list : list
        list of x, y coordinates
    rotation : int or float
        rotation in radians
    center : list
        x, y location of center of rotation

    RETURN
    ------
    point_list_rotated : list
        list of x, y coordinates after rotation around center

    """
    point_list_rotated = []

    for point in point_list:
        cos, sin = np.cos(rotation), np.sin(rotation)
        x = point[0] - center[0]
        y = point[1] - center[1]

        point_list_rotated.append((int(x * cos - y * sin + center[0]), int(x * sin + y * cos + center[1])))

    return point_list_rotated


def get_rectangle_element_coords(element):
    """Get the corner coordinate from a rectangle element, can handle rotated elements.

    Adapted from: https://github.com/DigitalSlideArchive/HistomicsTK/blob/master/histomicstk/annotations_and_masks/annotation_and_mask_utils.py

    INPUTS
    ------
    element : dict
        rectangle element, in HistomicsUI format

    RETURN
    ------
    corner_coords : array
        array of shape [4, 2] for the four corners of the rectangle in (x, y) format

    """
    # element is a dict so prevent referencing
    element = deepcopy(element)

    # check that element is rectangle type otherwise throw exception
    if element['type'] != 'rectangle':
        raise Exception('Element is not of rectangle type!')

    # calculate the corner coordinates, assuming no rotation
    center_x, center_y = element['center'][:2]
    h, w = element['height'], element['width']
    x_min = center_x - w // 2
    x_max = center_x + w // 2
    y_min = center_y - h // 2
    y_max = center_y + h // 2
    corner_coords = [(x_min, y_min), (x_max, y_min), (x_max, y_max), (x_min, y_max)]

    # if there is rotation rotate
    if element['rotation']:
        corner_coords = rotate_point_list(corner_coords, rotation=element['rotation'], center=(center_x, center_y))

    corner_coords = np.array(corner_coords, dtype=np.int32)

    return corner_coords


def del_anndocs_by_elements(gc, itemid, groups):
    """Delete all annotation documents in an image that strictly have only elements of the provided groups.
    
    INPUTS
    ------
    gc : girder_client.GirderClient
        authenticated girder client instance
    itemid : str
        image DSA id
    groups : list
        list of groups that must be in group to delete, if there is one element that is not in this list then the document will not be deleted
        
    """
    if type(groups) is not list:
        raise Exception('groups parameter must be of type list')
    
    # get annotations docs
    for anndoc in get_annotations_documents(gc, itemid):
        delflag = False
        
        # loop through elements
        for element in anndoc['annotation']['elements']:
            # switch flag to True for deleting doc IF all elements fall in the group list
            if element['group'] in groups:
                delflag = True
            else:
                break
                
        # delete doc if flag is True     
        if delflag:
            print(f"Deleting document named {anndoc['annotation']['name']} for image id {itemid}")
            gc.delete(f'/annotation/{anndoc["_id"]}')
