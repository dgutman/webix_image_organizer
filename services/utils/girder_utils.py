import girder_client
from PIL import Image
from io import BytesIO
import numpy as np
from math import ceil
from imageio import imwrite
from json import dumps

API_URLS = dict(
    CB='http://computablebrain.emory.edu:8080/api/v1',
    Transplant='http://transplant.digitalslidearchive.emory.edu:8080/api/v1',
    Candygram='http://candygram.neurology.emory.edu:8080/api/v1'
)


def get_user_by_id(gc, user_id):
    """Get DSA user info from user id.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client
    user_id : str
        DSA id of user
    Return
    ------
    user : str
        DSA user information
    """
    user = gc.get(f'user/{user_id}')
    return user


def login(api_url=None, username=None, password=None, dsa=None):
    """Login to a girder client session.
    Parameters
    ----------
    api_url : str, optional
        DSA instance to use (hint: url ends with api/v1 most of the time), will be ignored if dsa is not None
    username : str, optional
        if both username and password are given, then client is authenticated non-interactively
    password : str, optional
        if both username and password are given, then client is authenticated non-interactively
    dsa : str, optional
        alternative to the api_url parameters, pass in CB for computablebrain, Transplant for transplant, candygram for
        candygram
    Returns
    -------
    gc : girder_client.GirderClient
        authenticated instance
    """
    if dsa is not None:
        try:
            api_url = API_URLS[dsa]
        except KeyError:
            raise Exception('dsa key not found: {}'.format(dsa))
    elif api_url is None:
        raise Exception("api_url and dsa parameters can't both be None")

    gc = girder_client.GirderClient(apiUrl=api_url)

    if username is not None and password is not None:
        gc.authenticate(username=username, password=password)
    else:
        gc.authenticate(interactive=True)
    return gc


def get_item_image(gc, item_id, image_type, width=256, return_type='PIL'):
    """Get an associated image for a large image compatible item (thumbnail, label, macro)
    Parameters
    ----------
    gc : girder_client.GirderClient
        instance of girder client
    item_id : str
        item id
    image_type : str
        the associated image to get, options include thumbnail, label, macro
    width : int (optional)
        the width of the returned image, the height will be adjusted to keep the original aspect ratio
    return_type : str (optional)
        return type of the image, either 'PIL' or 'Array' for numpy array
    Return
    ------
    image : PIL image
        RGB image
    """
    url = 'item/{}/tiles/images/{}?width={}&encoding=JPEG'

    content = gc.get(url.format(item_id, image_type, width), jsonResp=False).content
    image = Image.open(BytesIO(content))

    if return_type == 'Array':
        image = np.array(image)
    elif return_type != 'PIL':
        print('could not recognize return_type {}, returning in PIL format'.format(return_type))
    return image


def get_recursive_items(gc, parent_id, parent_type='folder'):
    """Get all items under a folder or collection, recursively. Note that this will not work for virtual folders.
    Parameters
    ---------
    gc: girder_client.GirderClient
        an authenticated girder client session
    parent_id: str
        DSA id for parent folder to recursively search for items
    parent_type: str (Default: 'folder')
        set to 'collection' if the parent_id is a collection
    Returns
    -------
    items : list
        DSA items found under parent folder/collection
    """
    items = gc.get('resource/{}/items?type={}&limit=0&sort=_id&sortdir=1'.format(parent_id, parent_type))
    return items


def get_region_im(gc, item_id, region):
    """Get a region of a DSA WSI image item as a numpy array. You can get a thumbnail of the image by not specifying
    left, top, bottom, or right in the region parameters but providing a magnification parameter.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client
    item_id : str
        item id
    region : dict
        {'left': int, 'right': int, 'bottom': int, 'top': int, 'width': int, 'height': int, 'magnification' float or
        int}. You only need to give width and height OR right and bottom. If all four are given the right and bottom
        will be ignored and a new right and bottom will obtained from left + width and top + height. If magnification
        is not given the native magnification will be used.
    Return
    ------
    im : numpy.ndarray
        RGB(A) region image
    """
    # if width and height is given then get the right and bottom coordinates
    if 'width' in region and 'height' in region:
        region['right'] = region['left'] + region['width']
        region['bottom'] = region['top'] + region['height']

    if 'magnification' not in region:
        region['magnification'] = gc.get('item/{}/tiles'.format(item_id))['magnification']

    if 'right' not in region and 'left' not in region and 'top' not in region and 'bottom' not in region:
        url = 'item/{}/tiles/region?units=base_pixels&magnification={}&exact=false&encoding=PNG&jpegQuality=' \
              '100&jpegSubsampling=0'
        content = gc.get(url.format(item_id, region['magnification']), jsonResp=False).content
    else:
        url = 'item/{}/tiles/region?left={}&top={}&right={}&bottom={}&units=base_pixels&magnification={}' + \
              '&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
        content = gc.get(url.format(item_id, region['left'], region['top'], region['right'], region['bottom'],
                                    region['magnification']), jsonResp=False).content
    image = np.array(Image.open(BytesIO(content)))
    return image


def image_items_mosaic(gc, items, n_cols=6, im_size=(256, 256), save_path=None):
    """Given a list of image item information, either a list of item ids or a list of item dicts, get thumbnails for
    each image and concatentate them into a mosaic of images. The images are all grabbed at the same resolution and
    are padded with white pixels to keep the aspect ratio of original image. The number of rows images is determined
    by the n_cols parameters.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client if working with private images
    items : list
        list of item ids or list of items dicts, both will work
    n_cols : int (optional)
        number of images in each row, will determine how many rows the mosaic will have
    im_size : tuple (optional)
        size of each image, padded with white to preserve aspect ratio
    save_path : str (optional)
        file path with filename used to save the mosaic image to, as PNG or similar format
    Return
    ------
    mosaic : np.ndarray
        mosaic image in RGB form (alpha channel will not be maintained)
    """
    # save n_cols images accros, get the number of rows needed
    n_rows = ceil(len(items) / n_cols)

    # create the mosaic array
    mosaic = np.zeros((im_size[0] * n_rows, im_size[1] * n_cols, 3), dtype=np.uint8)

    for i, item in enumerate(items):
        # get the thumbnail - pad with white space to conserve apsect ratio
        try:
            content = gc.get('item/{}/tiles/thumbnail?width={}&height={}&fill=%23FFFFFF&encoding=PNG'.format(
                item['_id'], im_size[0], im_size[1]), jsonResp=False).content
        except:
            content = gc.get('item/{}/tiles/thumbnail?width={}&height={}&fill=%23FFFFFF&encoding=PNG'.format(
                item, im_size[0], im_size[1]), jsonResp=False).content
        image = np.array(Image.open(BytesIO(content)))[:, :, :3]

        # find location to put image into mosaic array
        mosaic[
        int(i / n_cols) * im_size[0]:int(i / n_cols) * im_size[0] + im_size[0],
        (i % n_cols) * im_size[0]:(i % n_cols) * im_size[0] + im_size[0], :] = image

    if save_path is not None:
        # save the image
        imwrite(save_path, mosaic)
    return mosaic


def get_collection_id(gc, collection_name):
    """Get the id of a collection by name.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client for private collections
    collection_name : str
        name of collection
    Return
    ------
    collection_id : str
        id of the collection, returns None if no collections with given name
    """
    item_id = None
    for collection in gc.listCollection():
        if collection['name'] == collection_name:
            item_id = collection['_id']
            break
    return item_id


def create_virtual_folder(gc, source_collection_name, target_fld_id, metadata_key):
    """Create a virtual folder using single metadata key.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated client
    source_collection_name : str
        name of collection to use as source, all items in this collection will be searched to populate the virtual folder
    target_fld_id : str
        id of the virtual folder, must be previously created
    metadata_key : str
        metadata key to use to populate the virtual folder
    Return
    ------
    fld_ids : list
        list of created virtual folders
    """
    # unique values for metadata in source collection
    unique_values = set()
    collection_id = get_collection_id(gc, source_collection_name)
    for item in get_recursive_items(gc, collection_id, parent_type='collection'):
        if 'meta' in item:
            meta = item['meta']
            if metadata_key in meta:
                unique_values.add(meta[metadata_key])

    fld_ids = []
    for value in unique_values:
        # set parameters for virtual folder post for this value folder
        params = {"parentType": "folder", "parentId": target_fld_id, "reuseExisting": True, "name": value,
                  "isVirtual": True,
                  "virtualItemsQuery": dumps(
                      {"meta.{}".format(metadata_key): value, 'baseParentId': {"$oid": collection_id}})}

        # post the new virtual folder
        fld_ids.append(gc.post("folder", parameters=params)['_id'])

    return fld_ids