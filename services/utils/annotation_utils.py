"""
Set of functions used when dealing with HistomicsUI style annotations, with Opencv integration.
format_aperio_annotations
scale_annotations
draw_annotations
format_element
get_element_centers
scale_contours
push_annotations_as_doc
get_annotation_mask
annotation_info
format_gt_codes
get_annotation_mask_and_image
get_element_bounding_regions
annotation_report
"""
#import xmltodict
import collections
from PIL import ImageDraw, Image
import numpy as np
from cv2 import moments, contourArea
from pandas import DataFrame
from copy import deepcopy

from os.path import join
from os import makedirs

from .girder_utils import get_recursive_items, get_user_by_id

from histomicstk.annotations_and_masks.masks_to_annotations_handler import get_annotation_documents_from_contours
from histomicstk.annotations_and_masks.annotations_to_masks_handler import get_image_and_mask_from_slide
from histomicstk.annotations_and_masks.annotation_and_mask_utils import (
    get_scale_factor_and_appendStr, scale_slide_annotations, get_bboxes_from_slide_annotations
)


# def format_aperio_annotations(xml_path, min_points=5, verbose=0):
#     """Format Aperio XML annotation files into an accessible format.
#     Parameters
#     ----------
#     xml_path : str
#         path to xml file with Aperio annotations
#     min_points : int (optional)
#         minimum number of points in an annotation to be included
#     verbose : int (optional)
#         set 0 for full output, or 1 to suppress
#     Returns
#     -------
#     rois : dict
#         contains positive region rois in positive key, and negative region rois in negative keys. ROIs are
#         formatted as a list of tuples [(x1, y1), (x2, y2), ... , (xn, yn)]
#     """
#     with open(xml_path, "r") as fp:
#         xml_data = fp.read()

#     try:
#         xml_data = xmltodict.parse(xml_data)["Annotations"]["Annotation"]
#     except KeyError:
#         print("could not find annotations in xml file ({})".format(xml_path))
#         return None

#     if type(xml_data) is collections.OrderedDict:
#         xml_data = [xml_data]

#     rois = {'positive': [], 'negative': []}
#     for layer in xml_data:
#         if "Region" in layer["Regions"]:
#             layer_regions = layer["Regions"]["Region"]

#             if type(layer_regions) is collections.OrderedDict:
#                 layer_regions = [layer_regions]

#             for region in layer_regions:
#                 vertices = [(int(float(v["@X"])), int(float(v["@Y"]))) for v in region["Vertices"]["Vertex"]]
#                 if len(vertices) > min_points:
#                     if region["@NegativeROA"] == "1":
#                         rois['negative'].append(vertices)
#                     else:
#                         rois['positive'].append(vertices)
#                 else:
#                     if not verbose:
#                         print('skipping annotations with {} vertices'.format(len(vertices)))
#     return rois


def scale_annotations(annotations, orig_mag, target_mag):
    """Scale annotations given a different magnification.
    Parameters
    ----------
    annotations : dict
        contains positive region rois in positive key, and negative region rois in negative keys. ROIs are
        formatted as a list of tuples [(x1, y1), (x2, y2), ... , (xn, yn)]
    orig_mag : float
        original magnification of annotation image
    target_mag : float
        target magnification for the annotations
    Return
    ------
    new_annotations : dict
        scaled annotation parameter
    """
    factor = target_mag / orig_mag
    new_annotations = {}
    for key, val in annotations.items():
        new_annotations[key] = []
        for v in val:
            new_annotations[key].append([(int(xy[0] * factor), int(xy[1] * factor)) for xy in v])
    return new_annotations


def draw_annotations(im, annotations):
    """Draw annotations on a colored image.
    Source: https://stackoverflow.com/questions/43971259/how-to-draw-polygons-with-python/53756148
    Parameters
    ----------
    im : numpy.ndarray
        RGB image to draw annotation
    annotations : dict
        contains positive region rois in positive key, and negative region rois in negative keys. ROIs are
        formatted as a list of tuples [(x1, y1), (x2, y2), ... , (xn, yn)]
    Return
    ------
    image : numpy.ndarray
        copy of im parameter with drawn annotation, positive annotations are drawn in red, negative annotations
        are drawn in blue
    """
    image = Image.fromarray(im)
    draw = ImageDraw.Draw(image)

    for ann in annotations['positive']:
        draw.line(ann, fill=(255, 0, 0), width=9)
    for ann in annotations['negative']:
        draw.line(ann, fill=(0, 0, 255), width=9)
    return np.array(image)


def format_element(element, scale_factor=1.):
    """Format a HistomicsUI element into opencv format to be available to use in opencv functions.
    Parameters
    ----------
    element : dict
        an HistomicsUI annotation element
    scale_factor : float (optional)
        scale the points in the elements by this factor
    """
    element_type = element['type']
    if element_type == 'polyline':
        # polyline format is a list containing 3-length lists of (x, y, z) coordinates
        points = element['points']
        contour = np.zeros((len(points), 1, 2), dtype=np.int32)
        for i in range(len(points)):
            contour[i][0] = [points[i][0] * scale_factor, points[i][1] * scale_factor]
        return contour
    else:
        print('element type {} not supported'.format(element_type))
    return None


def get_element_centers(gc, item_id, group_names=None, annotation_doc_names=None, scale_factor=1.):
    """Get the center of annotation elements of polyline type. Currently other element types not supported.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client for private items
    item_id : str
        DSA image item id
    group_names : list (optional)
        list of element group names to include, if None then all element group names will be included
    annotation_doc_names : list (optional)
        list of annotation docs to include, if None then all annotation docs will be included
    scale_factor : float (optional)
        scale the coordinates of the element centers by this factor, default is the base magnification coordinates
    Return
    ------
    element_centers : list
        x, y coordinates of the element centers
    """
    element_centers = []

    # loop through the annotation documents
    for annotation_doc_info in gc.get('/annotation/item/' + item_id):
        # check that annotation doc has a name, otherwise exclude
        if 'name' not in annotation_doc_info['annotation']:
            continue

        # if a list of annotation doc names was given, check that this annotation doc is one of them
        if annotation_doc_names is not None:
            flag = True
            for ann_name in annotation_doc_names:
                if annotation_doc_info['annotation']['name'].startswith(ann_name):
                    flag = False
            if flag:
                continue

        # get all elements in annotation doc
        annotation_doc = gc.get('annotation/{}?sort=_id&sortdir=1'.format(annotation_doc_info['_id']))

        for element in annotation_doc['annotation']['elements']:
            # check group name, exclude if not in list
            if group_names is None or element['group'] in group_names:
                # format element to opencv format
                cv2_element = format_element(element, scale_factor=scale_factor)

                # get the center of the element from its moment
                element_moment = moments(cv2_element)
                center_x = int(element_moment["m10"] / element_moment["m00"])
                center_y = int(element_moment["m01"] / element_moment["m00"])
                element_centers.append([center_x, center_y])

    return element_centers


def scale_contours(contours, scale_factor):
    """Scale contours in the opencv format by a scale factor.
    Parameters
    ----------
    contours : list
        list of numpy arrays containing the contours
    scale_factor : float
        scale factor to scale contours by
    Return
    ------
    scaled_contours : list
        scaled contours
    """
    scaled_contours = []
    for contour in contours:
        scaled_contours.append((contour * scale_factor).astype(np.int32))
    return scaled_contours


def push_annotations_as_doc(gc, item_id, contours, doc_name='Default', group_name='default', color='rgb(255,0,0)',
                            opacity=0.2):
    """Given a list of opencv contours, push them as annotations to DSA HistomicsUI viewer.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client if private item
    item_id : str
        image item id
    contours : list
        list of contours in opencv format to push as annotations
    doc_name : str (optional)
        prefix of the document to push annoations as, default-# will be appended at the end. Mulitple documents may be
        pushed if enough contours are present.
    group_name : str (optional)
        group name to assign to annotations
    color : str (optional)
        rgb color to use for annoations
    opacity : float (optional)
        set the opacity to use for the annotation
    Return
    ------
    contours_df : pandas.DataFrame
        dataframe used to create the annotation document
    """
    # seed the dict to create dataframe
    data = {'group': [], 'color': [], 'ymin': [], 'ymax': [], 'xmin': [], 'xmax': [], 'has_holes': [],
            'touches_edge-top': [], 'touches_edge-left': [], 'touches_edge-bottom': [], 'touches_edge-right': [],
            'coords_x': [], 'coords_y': []}

    # for each contour convert the x, y coordinates to string if 'x1,x2,...,xn' and 'y1,y2,...,yn'
    for contour in contours:
        # append the values that don't change between contour
        data['color'].append(color)
        data['group'].append(group_name)
        data['has_holes'].append(0.0)
        data['touches_edge-top'].append(0.0)
        data['touches_edge-left'].append(0.0)
        data['touches_edge-bottom'].append(0.0)
        data['touches_edge-right'].append(0.0)

        # based on the contours, get the min and max of each axis
        xmin, ymin = np.min(contour, axis=0)[0]
        xmax, ymax = np.max(contour, axis=0)[0]
        data['xmin'].append(xmin)
        data['ymin'].append(ymin)
        data['xmax'].append(xmax)
        data['ymax'].append(ymax)

        # do the conversion to string format of x and y coordinates
        xs, ys = [], []
        for xy in contour:
            xs.append(str(xy[0, 0]))
            ys.append(str(xy[0, 1]))

        data['coords_x'].append(','.join(xs))
        data['coords_y'].append(','.join(ys))

    # build dataframe form dict
    contours_df = DataFrame(data)

    # convert dataframe to an annotation doc
    annprops = {'X_OFFSET': 0, 'Y_OFFSET': 0, 'opacity': opacity, 'lineWidth': 4.0}

    annotation_docs = get_annotation_documents_from_contours(
        contours_df.copy(), separate_docs_by_group=False, annots_per_doc=100, docnamePrefix=doc_name, annprops=annprops,
        verbose=False, monitorPrefix=''
    )

    # get current annotations documents from item
    existing_annotations = gc.get('/annotation/item/' + item_id)

    # delete annotation documents starting with the same prefix as about to be pushed
    for ann in existing_annotations:
        # some annotations may not have a name, handle this case
        annotation = ann['annotation']
        if 'name' in annotation:
            current_doc_name = annotation['name']
            if current_doc_name.startswith(doc_name):
                gc.delete('/annotation/%s' % ann['_id'])

    # post the annotation documents you created
    for annotation_doc in annotation_docs:
        resp = gc.post(
            "/annotation?itemId=" + item_id, json=annotation_doc)

    return contours_df


def get_annotation_mask(gc, item_id, roi_group_name, roi_doc_name=None, scale_factor=.03125):
    """Return a binary mask of annotations in a DSA WSI item using annotations saved for that image.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client for private images
    item_id : str
        image item id
    roi_group_name : str or list
        element group name(s) to use to draw mask
    roi_doc_name : str (optional)
        specify a annotation document to use, note that all documents which name starts with this parameter will be
        included
    scale_factor : float (optional)
        scale factor to create binary image at, for memory purposes it is recommended to not use scale factor 1 or above
    """
    contours = []
    if roi_group_name is not None:
        # if roi group name was a string, then make it a list of length one so code works
        if isinstance(roi_group_name, str):
            roi_group_name = [roi_group_name]

        # get item annotation doc info
        existing_annotations = gc.get('/annotation/item/' + item_id)

        for ann in existing_annotations:
            # some annotations may not have a name, handle this case
            annotation = ann['annotation']
            if 'name' in annotation:
                # filter by annotation document if provided, otherwise continue
                current_doc_name = annotation['name']
                if roi_doc_name is None or current_doc_name.startswith(roi_doc_name):
                    for element in ann['annotation']['elements']:
                        # check that group name matches
                        if 'group' in element and element['group'] in roi_group_name:
                            # format the elements into opencv format
                            contours.append(format_element(element, scale_factor=scale_factor))
    return contours


def annotation_info(gc, item_id, magnification=None):
    """Get item HistomicsUI annotations and element information.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client
    item_id : str
        item id
    magnification : float (optional)
        if give, annotatiosn will be scaled to match
    Returns
    -------
    annotations : list
        annotation documents information
    element_info : DataFrame
        annotation element information
    """
    # get item annotations
    annotations = gc.get('/annotation/item/' + item_id)

    if magnification is not None:
        # get factor for scaling annotations to given magnification
        mask_mag_factor, _ = get_scale_factor_and_appendStr(gc=gc, slide_id=item_id, MAG=magnification)

        # scale annotations
        annotations = scale_slide_annotations(annotations, sf=mask_mag_factor)

    # get annotation element information (i.e. centers)
    element_info = get_bboxes_from_slide_annotations(annotations)

    return annotations, element_info


def format_gt_codes(data):
    """Return a DataFrame with annotation information (GT Codes) used in HistomicsTK mask and annotations module.
    Parameter
    ---------
    data : list
        list of dictionaries, each dict should have a group key. You can also specify the overlay_order, GT_code,
        is_roi, is_background_class, color. Optional keys are infered if not given in order in the list. Group key
        is the element group name.
        overlay_order is infered from list order (1, 2, 3, ...)
        GT_code is infered form list order (1, 2, 3, ...)
        is_roi is set to 0
        is_background_class is set to 0
        color is set to (rgb(0, 0, 1), rgb(0, 0, 2), rgb(0, 0, 3) ...)
        comments are left blank
    Return
    ------
    gt_codes : DataFrame
        dataframe containing annotions information, used in annotation and masks module in HistomicsTK
    """
    data = deepcopy(data)
    gt_data = {'group': [], 'overlay_order': [], 'GT_code': [], 'is_roi': [], 'is_background_class': [], 'color': [],
               'comments': []}

    for i, group_data in enumerate(data):
        gt_data['group'].append(group_data['group'])

        if 'overlay_order' not in group_data:
            gt_data['overlay_order'].append(i + 1)
        else:
            gt_data['overlay_order'].append(group_data['overlay_order'])

        if 'GT_code' not in group_data:
            gt_data['GT_code'].append(i + 1)
        else:
            gt_data['GT_code'].append(group_data['GT_code'])

        if 'is_roi' not in group_data:
            gt_data['is_roi'].append(0)
        else:
            gt_data['is_roi'].append(group_data['is_roi'])

        if 'is_background_class' not in group_data:
            gt_data['is_background_class'].append(0)
        else:
            gt_data['is_background_class'].append(group_data['is_backgroun_class'])

        if 'color' not in group_data:
            gt_data['color'].append(f'rgb(0, 0, {i + 1})')
        else:
            gt_data['color'].append(group_data['color'])

        if 'comments' not in group_data:
            gt_data['comments'] = ''
        else:
            gt_data['comments'].append(group_data['comments'])

    # format the DataFrame to have an group row as second row
    gt_codes = DataFrame(gt_data)
    gt_codes.index = gt_codes.loc[:, 'group']

    return gt_codes


def get_annotation_mask_and_image(gc, item_id, mode, gt_codes, element_infos, magnification=None, groups_to_get=None,
                                  bounds=None):
    """Wrapper around HistomicsTK get_image_and_mask_from_slide(..) function. Allows retrieval of labeled masks of
    annotations from an image.
    """
    # mode must be "manual_bounds" or "wsi"
    if mode not in ('manual_bounds', 'wsi'):
        raise Exception('mode must be either manual bounds or wsi')

    # if magnification is not specified, get the scan magnification
    if magnification is None:
        magnification = gc.get(f'item/{magnification}/tiles')['magnification']

    # format key-word arguments
    get_roi_mask_kwargs = {'crop_to_roi': True}
    get_contours_kwargs = {'groups_to_get': groups_to_get, 'get_roi_contour': False,
                           'discard_nonenclosed_background': True, 'MIN_SIZE': 0}
    get_kwargs = {'gc': gc, 'slide_id': item_id, 'GTCodes_dict': gt_codes.T.to_dict(), 'MPP': None,
                  'MAG': magnification, 'get_contours_kwargs': get_contours_kwargs, 'bounds': bounds,
                  'element_infos': element_infos, 'get_roi_mask_kwargs': get_roi_mask_kwargs}

    # get label mask and RGB image
    output = get_image_and_mask_from_slide(mode=mode, **get_kwargs)
    rgb_im = output['rgb']
    label_im = output['ROI']
    return rgb_im, label_im


def get_element_bounding_regions(gc, item_id, element_infos, shape, groups=None):
    """Given a DataFrame of element info, return a list of bounding regions centered around the element of a given size.
    """
    # to avoid returning bounding regions that go over image edge, get width and height of image
    image_info = gc.get(f'item/{item_id}/tiles')
    width = image_info['sizeX']
    height = image_info['sizeY']

    regions = []
    for i, r in element_infos.iterrows():
        # if groups was given (list), check that element is one of the approved groups
        if groups is None or r['group'] in groups:
            # calculate element center
            xcenter = (r['xmax'] + r['xmin']) // 2
            ycenter = (r['ymax'] + r['ymin']) // 2

            # get the edge bounds
            half_width = shape[0] // 2
            half_height = shape[1] // 2
            right = xcenter + half_width
            left = xcenter - half_width
            top = ycenter - half_height
            bottom = ycenter + half_height

            # if right is over edge, shift
            if right > width:
                rigth = width
                left = width - shape[0]
            # if top is over edge shift
            if top > height:
                top = height
                bottom = height - shape[1]

            # append this region
            regions.append({'left': left, 'right': right, 'top': top, 'bottom': bottom})

    return regions


def annotation_report(gc, source_id, element_group_types):
    """Generate annotation reports (CSV files) for images in a DSA collection / folder. The source location is searched
    recursively for all image items for elements of groups provided in the element_group_types parameter and creates
    reports for each unique username (as well as all users combined). The report gives information about the number of
    elements in each element group, from how many unique images they came from, and the total area (in pixels)
    annotated.
    Note - that the area will only mean something if all images are of the same magnification.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client
    source_id : str
        DSA id of the collection / folder to search for image items
    element_group_types: dict
        keys are the element group names and the value is either point, polyline, or rectangle
    Returns
    -------
    report : dict
        keys are the username of annotators, or all for the combined annotations. Values are DataFrames containing the
        annotation information
    mismatch_elements : list
        string information about elements that did not match the type of annotation given in element_group_types
        parameter
    """
    n = len(element_group_types)
    groups = list(element_group_types.keys())
    report_template = {'group': groups, 'number of annotations': [0] * n, 'unique_slides': [0] * n,
                       'area (px)': [0] * n}
    report = {'all': deepcopy(report_template)}

    # mismatched element types
    mismatch_elements = []

    # get all the items recursively in source id
    try:
        items = get_recursive_items(gc, source_id, parent_type='collection')
    except:
        items = get_recursive_items(gc, source_id, parent_type='folder')

    num_items = len(items)
    for i, item in enumerate(items):
        item_id = item['_id']
        print(f'item {i + 1} of {num_items} ({item["name"]})')
        unique_flags = [True] * n

        # loop through all annoation documents for this item
        for annotation_doc in gc.get(f'/annotation/item/{item_id}'):
            # get user that created annotation doc
            username = get_user_by_id(gc, annotation_doc['creatorId'])['login']

            # loop through each element in annotation doc
            for element in annotation_doc['annotation']['elements']:
                # skipping for bad annotation with no group name associated
                if 'group' not in element:
                    continue

                group = element['group']
                if group in element_group_types:
                    # check type of element group
                    group_type = element_group_types[group]

                    # check that element type matches the provided type
                    # - globals.json contains element group name and the type of annotation it should be (point,
                    # - rectangle, poly). If this does not match then print out information about the annotation
                    # - so it can be followed up on.
                    element_type = element['type']
                    if element_type != group_type:
                        mismatch_elements.append(
                            f'item_id: {item_id}, document_id: {annotation_doc["_id"]}, element_id: {element["id"]}, '
                            f'element type is {element_type}, should be {group_type}'
                        )

                    # seed username if not already in report
                    if username not in report:
                        report[username] = deepcopy(report_template)

                    # get index of this group in dataframe report
                    index = groups.index(group)

                    if group_type == 'rectangle':
                        # calculate the area based height and width
                        area = element['height'] * element['width']

                        # add the area
                        report['all']['area (px)'][index] += area
                        report[username]['area (px)'][index] += area

                        # add to count
                        report['all']['number of annotations'][index] += 1
                        report[username]['number of annotations'][index] += 1

                        # add to unique_slide value if True
                        if unique_flags[index]:
                            report['all']['unique_slides'][index] += 1
                            report[username]['unique_slides'][index] += 1
                            unique_flags[index] = False

                    elif group_type == 'polyline':
                        # format element into opencv format to get area quick
                        area = int(contourArea(format_element(element)))

                        # add the area
                        report['all']['area (px)'][index] += area
                        report[username]['area (px)'][index] += area

                        # add to count
                        report['all']['number of annotations'][index] += 1
                        report[username]['number of annotations'][index] += 1

                        # add to unique slide value if True
                        if unique_flags[index]:
                            report['all']['unique_slides'][index] += 1
                            report[username]['unique_slides'][index] += 1
                            unique_flags[index] = False

                    elif group_type == 'point':
                        # only counts one per slide
                        if unique_flags[index]:
                            report['all']['number of annotations'][index] += 1
                            report['all']['unique_slides'][index] += 1
                            report[username]['number of annotations'][index] += 1
                            report[username]['unique_slides'][index] += 1

    # convert the report values to DataFrames
    for key, data in report.items():
        report[key] = DataFrame(data, dtype=int)
    return report, mismatch_elements