import matplotlib.pyplot as plt
import random
import cv2, os
import numpy as np
from matplotlib.patches import Rectangle
from ipywidgets import interact, FloatSlider, IntSlider, interactive, HBox, VBox, fixed
from PIL import Image
from io import BytesIO

def plotGrid(w, h, x1, y1, theta, imgId,annotationElements,gc,thumbCache):
    # Draws a grid of width w and height h starting at x1,y1 with a rotation of theta degrees
 
    annotationElements.clear()#  = [] ### Reset the array
    ### Need to think through this and cache the image(s) locally so I don't have to pull it from the server
    ## Every single time.. I guess just stick everything in a .cache directory..
    ### Check the array for the imgID
    # if baseImage not in 
    if imgId not in thumbCache:
        print('uncached image')
        tileInfo = gc.get('item/%s/tiles' % imgId)
        itemInfo = gc.get('item/%s' % imgId)
        imgThumb = gc.get("item/%s/tiles/region?units=base_pixel&magnification=%s" % (imgId, 0.625),jsonResp=False)
        baseImage= np.array(Image.open(BytesIO(imgThumb.content)))
        thumbCache[imgId] = {'tileInfo':tileInfo, 'itemInfo':itemInfo, 'baseImage':baseImage}

    else:
        tileInfo = thumbCache[imgId]['tileInfo']
        itemInfo = thumbCache[imgId]['itemInfo']
        baseImage = thumbCache[imgId]['baseImage']
        print("Using Ca•che :-)")
#    imgThumb = gc.get("item/%s/tiles/region?units=base_pixel&magnification=%s" % (imgId, 0.625),jsonResp=False)

    ## Will cache this...for now though.. I won't :-)
    #baseImage= np.array(Image.open(BytesIO(imgThumb.content)))

    sf = 32  # Scale Factor
    rowLabels = itemInfo['meta']['rowLabels']
    colLabels = itemInfo['meta']['colLabels']

    ### Depending how the rowLabels are entered into the DSA, they may not show up as an array... monkey patch
    if "," in rowLabels:
        rowLabels = rowLabels.split(",")
    if "," in colLabels:
        colLabels = colLabels.split(",")


    cmap = get_cmap(len(colLabels) * len(rowLabels))
    # print()
    plt.rcParams["figure.figsize"] = (15, 15)
    plt.imshow(baseImage)
    for i, c in enumerate(colLabels):
        #print("Row: %s" % r)
        for j, r in enumerate(rowLabels):  # j is the index, c is the rowLabel
            # print("\t",r,c)
            x = w*i+x1
            y = h*j+y1
            (xc, yc) = rotate((x, y), (x1, y1), theta)
            # Compute the corrected coordinated after rotation
            
            aec = cmap(i*len(colLabels)+j) ## Annotation Element Color
            
            annotationElements.append({'fillColor': 'rgba(0, 0, 0, 0)',
                                       'label': {"value": "%s%s" % (r, c)},
                                       'lineColor': 'rgba(%d,%d,%d,%d)' % (aec[0]*255,aec[1]*255,aec[2]*255,aec[3]),


                                       'lineWidth': 1,
                                       'type': 'rectangle',
                                       'center': [(xc+w/2)*sf, (yc+h/2)*sf, 0],
                                       'width': w*sf,
                                       'height': h*sf,
                                       })

            plt.gca().add_patch(Rectangle((xc, yc), w, h,
                                          angle=theta,
                                          #                         edgecolor=cmap( random.randint(0,len(colLabels) * len(rowLabels))),
                                          edgecolor=cmap(i*len(colLabels)+j),
                                          facecolor='none',
                                          lw=2))

    print(len(annotationElements))

    # plot fiducial for upper left
    plt.plot(x1, y1, marker='v', color="red")
    # For debugging below, also extract a sample TMA Core
    # tmaCore = region_im[y1:(y1+h),x1:(x1+w),:]

def calculateImgCentroid(img, thr, useOTSU=True, useBlur=True):
    """Expects an image as a numpy array and a threshold T and computes the centroid of the image
    This also uses OTSU thresholding and a gaussian blur prior to computing the centroid by default
    """
    # To do is first check if image is gray scale or single channel or not..
    if len(img.shape) < 3:
        gray = img
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (7, 7), 0)

    if useOTSU and useBlur:
        ret, threshImg = cv2.threshold(gray, 127, 255, 0)
    else:
        ret, threshImg = cv2.threshold(gray, 127, 255, 0)

    M = cv2.moments(threshImg)
    try:
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
    except:
        print("Centroid calc failed")
        cX = 0
        cY = 0
    return cX, cY

def rotate(point, origin, degrees):
    radians = np.deg2rad(degrees)
    x, y = point
    offset_x, offset_y = origin
    adjusted_x = (x - offset_x)
    adjusted_y = (y - offset_y)
    cos_rad = np.cos(radians)
    sin_rad = np.sin(radians)
    qx = offset_x + cos_rad * adjusted_x + sin_rad * adjusted_y
    qy = offset_y + -sin_rad * adjusted_x + cos_rad * adjusted_y
    return qx, qy

def generate_random_color():
    # Will return a string like rgba with 3 random ints between 0 and 255..
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    return 'rgb(%d,%d,%d)' % (r, g, b)

def get_cmap(n, name='hsv'):
    '''Returns a function that maps each index in 0, 1, ..., n-1 to a distinct 
    RGB color; the keyword argument name must be a standard mpl colormap name.'''
    return plt.cm.get_cmap(name, n)

def get_annotation_region(gc, item_id, annotationElement, mag=None):
    # left=None, top=None, height=None, width=None, right=None, bottom=None, mag=None, rgb=True, pad=None):
    """Get a region of a WSI image from an annotation element that is stored in the DSA...

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
        any extra channels - so only works for RGB images."""

    aeType = annotationElement['type']

    if (aeType == 'rectangle'):
        #print(annotationElement)
        # For a rectangle, we have to compute the left as we are just given the center coord
        left = annotationElement['center'][0] - annotationElement['width'] / 2
        top = annotationElement['center'][1] - annotationElement['height'] / 2

        right = annotationElement['center'][0] + annotationElement['width'] / 2
        bottom = annotationElement['center'][1] + \
            annotationElement['height'] / 2
    else:
        print("Annotation element type %s is not supported currently for export" % aeType)

    encoding = 'TILED'
    if mag is None:
        get_url = f'{item_id}/tiles/region?left={left}&top={top}&right={right}&bottom={bottom}&units=base_pixels' \
            f'&exact=false&encoding={encoding}&jpegQuality=100&jpegSubsampling=0'
    else:
        get_url = f'{item_id}/tiles/region?left={left}&top={top}&right={right}&bottom={bottom}&units=base_pixels' \
            f'&magnification={mag}&exact=false&encoding={encoding}&jpegQuality=100&jpegSubsampling=0'
    # else:
    #     raise Exception('You must pass width / height or right / bottom parameters to get a region')
    #print(get_url)
    resp_content = gc.get('item/' + get_url, jsonResp=False).content
    #region_im = np.array(Image.open(BytesIO(resp_content)))
    return resp_content

    # def plotGrid( w, h, x1, y1, theta, baseImage ):
#     ### Draws a grid of width w and height h starting at x1,y1 with a rotation of theta degrees

#     plt.rcParams["figure.figsize"] = (15,15)
#     plt.imshow(baseImage)
#     for i,c in enumerate(colLabels):
#     #print("Row: %s" % r)
#         for j,r in enumerate(rowLabels):## j is the index, c is the rowLabel
#         #print("\t",r,c)

#             x = w*i+x1
#             y = h*j+y1

#             (xc,yc) = tma.rotate((x,y),(x1,y1),theta)
#             ### Compute the corrected coordinated after rotation

#             plt.gca().add_patch(Rectangle((xc,yc),w,h,
#                         angle=theta,
# #                         edgecolor=cmap( random.randint(0,len(colLabels) * len(rowLabels))),
#                         edgecolor=cmap( i*len(colLabels)+j),
#                         facecolor='none',
#                         lw=2))

#     #plot fiducial for upper left
#     plt.plot(x1,y1, marker='v', color="red")

#     ## For debugging below, also extract a sample TMA Core

#     tmaCore = region_im[y1:(y1+h),x1:(x1+w),:]
# x=1
# y=1
# x1 = int(tmaWidth*x+topLeft[0])
# y1 = int(tmaHeight*y+topLeft[1])
# w =  int(tmaWidth)
# h = int(tmaHeight)
# print(x1,y1,w,h)
# plt.imshow(region_im[y1:(y1+h),x1:(x1+w),:])

# tmaCore = region_im[y1:(y1+h),x1:(x1+w),:]


def updateAutoTMA(imgId, annotationElements, gc, replaceExisting=False):
    """This will update the autoTMA I am generating in jupyter notebooks
    and optionally delete the older version"""
    tmaAe = {
    "name": "autoTMA",              # Non-empty string.  Optional
    "description": "This is a description",  # String.  Optional
    "elements": annotationElements                           # A list.  Optional.
                                            # See below for valid elements.
    }
    gc.post('annotation?itemId=%s' % imgId,json=tmaAe)

def generateTMAcontrols(rowLabels, colLabels, baseImage):
    # Generates several ipywidgets to control the width, height, theta, x1/y1
    # which are used to create an interactive ipywidget

    maxTmaWidth = baseImage.shape[1] / len(colLabels)
    maxTmaHeight = baseImage.shape[0] / len(rowLabels)
    tmaWidth_s = IntSlider(min=0, max=maxTmaWidth, step=1,
                           value=100, continuous_update=False)
    tmaHeight_s = IntSlider(min=0, max=maxTmaHeight,
                            step=1, value=100, continuous_update=False)
    theta_s = FloatSlider(min=-10, max=10, step=0.2,
                          value=0, continuous_update=False)
    leftX_s = IntSlider(min=0, max=maxTmaWidth*2, step=1,
                        value=10, continuous_update=False)
    leftY_s = IntSlider(min=0, max=maxTmaHeight*2, step=1,
                        value=10, continuous_update=False)


    return (tmaWidth_s, tmaHeight_s, theta_s, leftX_s, leftY_s)


def getAutoTMAcoreInfo( gc, imgId, tmaAnnotationName='autoTMA'):
    ### This will find and return the latest autoTMA record associated with a given image
    i = gc.get('item/%s' % imgId)
    fileRoot = i['meta']['slideNumber']
    
    ## Get autoTMA documents for this item
    tmaDocs=  gc.get('annotation?itemId=%s&name=%s' % (imgId, tmaAnnotationName))
    print(len(tmaDocs),'autoTMA annotations found... will use the most recent one')
    
    if tmaDocs:
        ae = gc.get('annotation/%s' % tmaDocs[-1]['_id']) ## Grab the last one... assume that's the most recent.. may need to check
        print(len(ae['annotation']['elements']),'total ROIs to export')
    else:
        ae = None
        print("No tma cores found for this image..")
    
    return ae

def export_tma_cores( gc, imgId, roiUploadDir, tmaAnnotationName='autoTMA'):
    ### This will save cropped regions from the itemID... will pass it the annotation ID as well
    i = gc.get('item/%s' % imgId)
    fileRoot = i['meta']['slideNumber']
    
    roiNames = []

    ## Get autoTMA documents for this item
    tmaDocs=  gc.get('annotation?itemId=%s&name=%s' % (imgId, tmaAnnotationName))
    print(len(tmaDocs),'autoTMA annotations found... will use the most recent one and'),
    
    ae = gc.get('annotation/%s' % tmaDocs[-1]['_id']) ## Grab the last one... assume that's the most recent.. may need to check
    print(len(ae['annotation']['elements']),'total ROIs to export')
    
    roiDir = 'ROI_Export'
    if not os.path.isdir(roiDir):
        os.mkdir(roiDir)

    for roi in ae['annotation']['elements']:
        roiFileName = "%s.%s.%d.%d.tiff" % (fileRoot,roi['label']['value'],roi['center'][0],roi['center'][1])
        roiFilePath = "%s/%s" % (roiDir,roiFileName)
        roiNames.append(roiFileName)

        if roiFileName not in roiUploadDir:
            if not os.path.isfile(roiFilePath):
                r= get_annotation_region(gc,imgId,roi)        
                with open(roiFilePath,"wb") as fpi:
                    fpi.write(r)
    return roiNames