"""
Girder utils contains wrappers around girder calls that are not default options in the girder_client Python library and
don't fall under other module categories.

get_items
get_region
get_item_path
get_tile_metadata
"""
from girder_client import HttpError
from PIL import Image
from io import BytesIO
import numpy as np


def get_items(gc, parent_id):
    """Recursively gets items in a collection or folder parent location.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    parent_id : str
        the id of the collection / folder to get all items under

    Return
    ------
    items : list
        list of all items under the parent location

    """
    try:
        items = gc.get(f'resource/{parent_id}/items?type=collection&limit=0&sort=_id&sortdir=1')
    except HttpError:
        items = gc.get(f'resource/{parent_id}/items?type=folder&limit=0&sort=_id&sortdir=1')

    return items


def get_region(gc, item_id, left, top, height=None, width=None, right=None, bottom=None, mag=None, rgb=True, pad=None):
    """Get a region of a WSI image. Specify width and height or alternative give the right and bottom coordinate. Always
    give the left and top coordinate. Don't mix and match height / width with right / bottom.

    Parameters
    ----------
    gc : girder_client.GirderClient
        an authenticated girder client session
    item_id : str
        WSI DSA item id
    left : int
        left or minimum x coordinate of region in the wsi at native mag
    top : int
        top or minimum y coordinate of region in the wsi at native mag
    height : int (default: None)
        height of region to extract
    width : int (default: None)
        width of region to extract
    right : int (default: None)
        right or maximum x coordinate of region in the wsi at native mag
    bottom : int (default: None)
        bottom or maximum y coordinate of region in the wsi at native mag
    mag : float (default: None)
        magnification to pull region in
    rgb : bool (default: True)
        if True then the image will be returned as an RGB, removing any extra channels if present. Note that if less
        then three channels are present then the function will fail
    pad : int (default: None)
        if not None then image will be padded to match size given (helps pad regions overlapping edge of wsi). Pass an
        int from 0 (black) to 255 (white) with intermediate values being a hue of gray. Note that padding always removes
        any extra channels - so only works for RGB images.

    Return
    ------
    region_im : ndarray
        region image

    """
    # width and height but both be not None else right and bottom must be both not None otherwise exception
    if width is not None and height is not None:
        w, h = width, height

        if mag is None:
            get_url = f'{item_id}/tiles/region?left={left}&top={top}&regionWidth={width}&regionHeight={height}&units' \
                      f'=base_pixels&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
        else:
            get_url = f'{item_id}/tiles/region?left={left}&top={top}&regionWidth={width}&regionHeight={height}&units' \
                      f'=base_pixels&magnification={mag}&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
    elif right is not None and bottom is not None:
        w, h = right - left, top - bottom

        if mag is None:
            get_url = f'{item_id}/tiles/region?left={left}&top={top}&right={right}&bottom={bottom}&units=base_pixels' \
                      f'&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
        else:
            get_url = f'{item_id}/tiles/region?left={left}&top={top}&right={right}&bottom={bottom}&units=base_pixels' \
                      f'&magnification={mag}&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
    else:
        raise Exception('You must pass width / height or right / bottom parameters to get a region')
    print(get_url)

    resp_content = gc.get('item/' + get_url, jsonResp=False).content
    region_im = np.array(Image.open(BytesIO(resp_content)))

    if pad is not None:
        region_im = region_im[:, :, :3]
        x_pad = w - region_im.shape[1]
        y_pad = h - region_im.shape[0]
        if x_pad != 0 or y_pad != 0:
            region_im = np.pad(region_im, ((0, y_pad), (0, x_pad), (0, 0)), 'constant', constant_values=pad)
        return region_im
    if rgb:
        return region_im[:, : , :3]
    else:
        return region_im


def get_item_path(gc, itemid):
    """Return the path of an item in the DSA instance.

    Parameters
    ----------
    gc : girder_client.GirderClient
        an authenticated girder client session
    itemid : str
        id of item

    Return
    ------
    path : str
        DSA path of item

    """
    path = gc.get(f'resource/{itemid}/path?type=item')

    return path


def get_tile_metadata(gc, itemid):
    """Get the tile source metadata for an item with a large image associated with it.

    Parameters
    ----------
    gc : girder_client.GirderClient
        an authenticated girder client session
    itemid : str
        WSI DSA item id

    Return
    ------
    metadata : dict
        the metadata for large image associated
    
    """
    metadata = gc.get(f'item/{itemid}/tiles')

    return metadata


def get_user_id(gc, username):
    """Get the id of a user by its login.

    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client instance
    username : str
        the username

    Return
    ------
    userid : str
        the id of the user

    """
    userid = gc.get(f'resource/lookup?path=user%2F{username}')['_id']

    return userid


def get_thumbnail(gc, itemid, mag):
    """Get a thumbnail of an image item at specified magnification.
    
    INPUTS
    ------
    gc : girder client
    itemid : str
    mag : float
    
    RETURN
    ------
    thumbnail : array-like
    
    """
    get_url = f'item/{itemid}/tiles/region?units=base_pixels&magnification={mag}&exact=false&encoding=PNG&jpegQuality=100&jpegSubsampling=0'
    resp_content = gc.get(get_url, jsonResp=False).content
    thumbnail = np.array(Image.open(BytesIO(resp_content)))
    return thumbnail
