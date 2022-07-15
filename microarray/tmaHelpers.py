import matplotlib.pyplot as plt
import random
import cv2
import numpy as np
from matplotlib.patches import Rectangle

def plotGrid( w, h, x1, y1, theta, baseImage,colLabels, rowLabels ):
    ### Draws a grid of width w and height h starting at x1,y1 with a rotation of theta degrees
    cmap = get_cmap( len(colLabels) * len(rowLabels))


    plt.rcParams["figure.figsize"] = (15,15)
    plt.imshow(baseImage)
    for i,c in enumerate(colLabels):
    #print("Row: %s" % r)
        for j,r in enumerate(rowLabels):## j is the index, c is the rowLabel
        #print("\t",r,c)

            x = w*i+x1
            y = h*j+y1
            
            (xc,yc) = rotate((x,y),(x1,y1),theta)
            ### Compute the corrected coordinated after rotation
            
            plt.gca().add_patch(Rectangle((xc,yc),w,h,
                        angle=theta,
#                         edgecolor=cmap( random.randint(0,len(colLabels) * len(rowLabels))),
                        edgecolor=cmap( i*len(colLabels)+j),
                        facecolor='none',
                        lw=2))
            
    #plot fiducial for upper left 
    plt.plot(x1,y1, marker='v', color="red")

    ## For debugging below, also extract a sample TMA Core
    
    # tmaCore = region_im[y1:(y1+h),x1:(x1+w),:]    


def calculateImgCentroid( img, thr, useOTSU=True,useBlur=True):
    """Expects an image as a numpy array and a threshold T and computes the centroid of the image
    This also uses OTSU thresholding and a gaussian blur prior to computing the centroid by default
    
    """
    ## To do is first check if image is gray scale or single channel or not..
       
    
    if len(img.shape)<3:
        gray = img
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


    blurred = cv2.GaussianBlur(gray, (7, 7), 0)

    if useOTSU and useBlur:

        ret,threshImg  = cv2.threshold(gray,127,255,0)
    else:
        ret,threshImg  = cv2.threshold(gray,127,255,0)
    


    M = cv2.moments(threshImg)
    try:
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
    except:
        print("Centroid calc failed")
        cX=0
        cY=0

    return cX, cY



def rotate(point, origin, degrees):
    radians = np.deg2rad(degrees)
    x,y = point
    offset_x, offset_y = origin
    adjusted_x = (x - offset_x)
    adjusted_y = (y - offset_y)
    cos_rad = np.cos(radians)
    sin_rad = np.sin(radians)
    qx = offset_x + cos_rad * adjusted_x + sin_rad * adjusted_y
    qy = offset_y + -sin_rad * adjusted_x + cos_rad * adjusted_y
    return qx, qy



def generate_random_color():
    ### Will return a string like rgba with 3 random ints between 0 and 255..
    r = random.randint(0,255)
    g = random.randint(0,255)
    b = random.randint(0,255)
    return 'rgb(%d,%d,%d)' % (r,g,b)   

def get_cmap(n, name='hsv'):
    '''Returns a function that maps each index in 0, 1, ..., n-1 to a distinct 
    RGB color; the keyword argument name must be a standard mpl colormap name.'''
    return plt.cm.get_cmap(name, n)


def get_annotation_region(gc, item_id, annotationElement,mag=None):
    #left=None, top=None, height=None, width=None, right=None, bottom=None, mag=None, rgb=True, pad=None):
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

    if ( aeType == 'rectangle'):

        print(annotationElement)
        ### For a rectangle, we have to compute the left as we are just given the center coord
        left = annotationElement['center'][0] - annotationElement['width'] /2
        top = annotationElement['center'][1] - annotationElement['height'] /2

        right = annotationElement['center'][0] + annotationElement['width'] /2
        bottom = annotationElement['center'][1] + annotationElement['height'] /2



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
    print(get_url)
    
    resp_content = gc.get('item/' + get_url, jsonResp=False).content
    #region_im = np.array(Image.open(BytesIO(resp_content)))

    return resp_content