import re

import cv2
import imutils
import numpy as np
from pytesseract import pytesseract

regexFormat1 = '.*?(?P<BrainID>FOX\d{1,2}[A-Z])? ?' + \
               '(?P<Hemi>(LH MID|LH FRONTAL|LH FRONT|LH POST FRONTAL|CAUDAL|LH MISC|MISC|LH CAUDAL|LH))? ?' + \
               'COL (?P<Column>\d{1,2}) S? ?(?P<Section>(\d{1,3}|MISC [A-Z])) ' + \
               '(?P<Stain>(SILVER|NISSL|1:20K AVP|OXT 1:5000)) ' + \
               '(?P<StainDate>(\d{1,2}/\d{1,2}/\d{1,2}|\d{1,2}/\d{1,2}))'

metadataTags = [  # Metadata tags to capture (FOX_DATA example)
    'BrainID', 'Column', 'Hemi',
    'Section', 'Stain', 'StainDate']

regex1 = re.compile(regexFormat1)


def remove_shadows(img):
    """Remove shadows of an image via opencv method, source:
    https://stackoverflow.com/questions/44752240/how-to-remove-shadow-from-scanned-images-using-opencv"""
    rgb_planes = cv2.split(img)

    result_planes = []
    result_norm_planes = []
    for plane in rgb_planes:
        dilated_img = cv2.dilate(plane, np.ones((7, 7), np.uint8))
        bg_img = cv2.medianBlur(dilated_img, 21)
        diff_img = 255 - cv2.absdiff(plane, bg_img)
        norm_img = cv2.normalize(diff_img, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
        result_planes.append(diff_img)
        result_norm_planes.append(norm_img)

    result = cv2.merge(result_planes)

    return result


def check_scheme(string, scheme):
    """Checks if regex matched and returns a dict of results."""
    m = scheme.search(string.upper())
    if m:  # If regex was successful.
        m = m.groupdict()
    return m


def clean_ocr_output(raw_string):
    # Remove non alpha-numeric character (backslash and colon are exceptions).
    # Replaces multiple white spaces and new line characters with single space.
    # Converts to all upper case.
    clean_string = re.sub(r'[^A-Za-z\d//:\s]+', '', raw_string)
    clean_string = re.sub(r'\n', ' ', clean_string)
    clean_string = re.sub('\s{2,}', ' ', clean_string)

    print(clean_string)
    return clean_string.upper()


def robust_ocr(img, scheme):
    """Performs a multitude of preprocessing of the image (different angle
    skewness, removing shadows, horizontal stretching) and tests OCR+Regex
    results. It will stop when regex captures output or when it exhausts
    all attempts."""
    angles = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5]
    goodResults = {}  # Output
    for a in angles:  # for each angle
        # Rotate
        rotated = imutils.rotate(img, a)
        results = clean_ocr_output(pytesseract.image_to_string(rotated))  # Check OCR

        m = check_scheme(results, scheme)
        if m:
            goodResults = m
            break
        # Remove shadows
        rotatedShadowless = remove_shadows(rotated)

        results = clean_ocr_output(pytesseract.image_to_string(rotatedShadowless))  # Check OCR

        m = check_scheme(results, scheme)
        if m:
            goodResults = m
            break
        # With original rotated image, stretch.
        stretched = cv2.resize(rotated, None, fx=2, fy=1)
        results = clean_ocr_output(pytesseract.image_to_string(stretched))  # Check OCR
        m = check_scheme(results, scheme)
        if m:
            goodResults = m
            break
        # Remove shadows from stretched.
        stretchedShadowless = remove_shadows(stretched)
        results = clean_ocr_output(pytesseract.image_to_string(stretchedShadowless))  # Check OCR
        m = check_scheme(results, scheme)
        if m:
            goodResults = m
            break
    return goodResults


def clean_m(dict_input, tags):
    # Pulls out the keys in regex results that need to be updated/added.
    # Also gets rid of None value results.
    dict_output = {}
    for t in tags:
        if t in dict_input:
            dict_output[t] = dict_input[t]
        else:
            dict_output[t] = ''

    return dict_output


def set_metatags(image, item, gc, override=False):
    results = robust_ocr(image, regex1)
    metadata = {} if 'meta' not in item else item['meta']
    if override:
        tags = metadataTags  # replace all tags if possible
    else:
        # Replace only missing tags (or if they are empty).
        tags = [t for t in metadataTags if t not in metadata or metadata[t] == '']
    if override or len(tags) > 0:
        m = clean_m(results, tags)
        gc.addMetadataToItem(item['_id'], m)  # uncomment to have this push metadata
    return results
