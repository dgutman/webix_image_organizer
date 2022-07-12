import matplotlib.pyplot as plt
import random

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