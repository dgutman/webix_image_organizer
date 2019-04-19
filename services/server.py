import importlib
import cv2
import json

import marker_search
import sticker_search
import ocr


with open('config.json') as config_data:
    config = json.load(config_data)

importlib.import_module('colors')
from flask import Flask, jsonify, request, g, render_template, send_from_directory, send_file
from  flask_cors import CORS

import girder_client
import numpy as np


app = Flask(__name__)
CORS(app)

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

    url = 'item/%s/tiles/images/label?encoding=JPEG' if label else 'item/%s/tiles/thumbnail'

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
    gc = girder_client.GirderClient(apiUrl=config['apiUrl'])
    if private:
        gc.authenticate(username=config['USER'], password=config['PASSWORD'])
    return gc


gc = login(config['apiUrl'])




@app.route("/label")
def label_ocr():
    ids = request.args.get('ids')

    status = []
    if ids:
        ids = ids.split(',')
        for id in ids:
            try:
                item = gc.getItem(id)
                image = get_image(gc, item['_id'])
                results, ocrRawText = ocr.set_metatags(image, item, gc)
                status.append({'status': 'ok', 'id': id, 'results': results, 'ocrRawText': ocrRawText})
            except Exception as e:
                status.append({'status': 'error', 'id': id, 'error': str(e)})
                continue

    return jsonify(status)


@app.route("/sticker")
def get_stickers():
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
