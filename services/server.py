import importlib
import cv2
import marker_search
import sticker_search
import ocr
import utils.positive_pixel_count as ppc


importlib.import_module('colors')

from flask import Flask, jsonify, request
from  flask_cors import CORS

import girder_client
import numpy as np

app = Flask(__name__)
CORS(app)



# set up parameters to use for PPC
params = ppc.Parameters(
    hue_value=0.05,
    hue_width=0.15,
    saturation_minimum=0.05,
    intensity_upper_limit=0.95,
    intensity_weak_threshold=0.65,
    intensity_strong_threshold=0.35,
    intensity_lower_limit=0.05,
)
roi_size = 500

def get_image(gc, _id, width=256, height=256, array=False, label=False):
    """get_label_image()
    Given a girder id, get the label image if it exists otherwise throws error.

    INPUTS
    ------
    gc : girder_client.GirderClient
        Girder client connected to a girder API.
    _id : str (item)
        Girder id of item to get label for.
    width : int (default 256)
        Width to return label image.
    height : int (default 256)
        Height to return label image.
    array : bool (default False)
        True to return label image in ndarray form, False to return PIL image.

    RETURNS
    -------
    image : PIL image or ndarray
        Label image.
    """

    url = 'item/%s/tiles/images/label?encoding=JPEG&width=256'  if label else 'item/%s/tiles/thumbnail'

    content = gc.get(url % (_id), jsonResp=False)
    img_array = np.fromstring(content.content, dtype=np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return image

def login(private=True):
    """login()
    Connects to chosen girder API.

    INPUTS
    ------
    api_url : str
        Url to the API to connect to (i.e. servername/api/v1).
    private : bool
        True to interactively authenticate (to access private items)
        or False if accessing public items.

    RETURNS
    -------
    gc : girder_client.GirderClient
        Girder client connected to a girder API.
    """
    gc = girder_client.GirderClient(apiUrl=request.args.get('apiUrl'))
    if private:
        gc.setToken(request.headers.get('girder-token'))
    return gc

@app.route("/label")
def label_ocr():
    gc = login()
    ids = request.args.get('ids')
    override = request.args.get('override')
    print("override was set to",override)

    status = []
    if ids:
        ids = ids.split(',')
        for id in ids:
            try:
                item = gc.getItem(id)
                image = get_image(gc, item['_id'],label=True)
                results, ocrRawText = ocr.set_metatags(image, item, gc)
                status.append({'status': 'ok', 'id': id, 'results': results, 'ocrRawText': ocrRawText})
            except Exception as e:
                status.append({'status': 'error', 'id': id, 'error': str(e)})
                continue
    print(status)
    return jsonify(status)


@app.route("/sticker")
def get_stickers():
    gc = login()
    ids = request.args.get('ids')
    ids = ids.split(',')

    status = []
    for id in ids:
        try:
            item = gc.getItem(id)
            image = get_image(gc, item['_id'])

            results = sticker_search.get_image_sticker_colors(image)

            gc.addMetadataToItem(item['_id'], {'stickers': results})  # uncomment to have this push metadata
            status.append({'status': 'ok', 'id': item['_id'], 'results': results})
        except Exception as e:
            status.append({'status': 'error', 'id': id, 'error': str(e)})
            continue
    return jsonify(status)


@app.route("/marker")
def get_marker():
    gc = login()
    ids = request.args.get('ids')
    ids = ids.split(',')
    status = []
    for id in ids:

        try:
            item = gc.getItem(id)
            image = get_image(gc, item['_id'])
            results = marker_search.haveImageMarker(image)
            gc.addMetadataToItem(item['_id'], {'marker': results})  # uncomment to have this push metadata
            status.append({'status': 'ok', 'id': id, 'results': results})
        except Exception as e:
            status.append({'status': 'error', 'id': id, 'error': str(e)})
            continue

    return jsonify(status)


def get_center_roi(gc, imid, roi_size=500):
    # get a square region from WSI in the center of WSI
    tileinfo = gc.get(f'item/{imid}/tiles')
    
    # get coords of rectangle centered around center
    xc, yc = tileinfo['sizeX'] / 2, tileinfo['sizeY'] / 2

    xmin, ymin = int(xc - roi_size / 2), int(yc - roi_size / 2)

    # set up the region dictionary
    region = dict(
        left=xmin, top=ymin, width=roi_size, height=roi_size
    )
    
    return region           
    
@app.route("/ppc")
def run_ppc():
    gc = login()
    ids = request.args.get('ids')
    ids = ids.split(',')
    status = []
    for id in ids:

        try:
            item = gc.getItem(id)
            # get coords for image center ROI
            region = get_center_roi(gc, item['_id'], roi_size=roi_size)
            # run ppc on image
            output = ppc.count_image(gc, item['_id'], params, region, tile_dim=roi_size, metadata_key='testppcio', save_dir='TEST')
            
            status.append({'status': 'ok', 'id': id, 'results': output})
        except Exception as e:
            status.append({'status': 'error', 'id': id, 'error': str(e)})
            continue

    return jsonify(status)
