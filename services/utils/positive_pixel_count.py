from collections import namedtuple
import numpy as np
import cv2
from histomicstk.preprocessing.color_conversion import rgb_to_hsi
import large_image
from os import makedirs
from os.path import join, splitext
from PIL import Image
from tqdm import tqdm
from imageio import imwrite
import hashlib
import json

from .annotation_utils import get_annotation_mask
from .girder_utils import get_region_im

Image.MAX_IMAGE_PIXELS = None


class Parameters(
    namedtuple('Parameters', [
        'hue_value',
        'hue_width',
        'saturation_minimum',
        'intensity_upper_limit',
        'intensity_weak_threshold',
        'intensity_strong_threshold',
        'intensity_lower_limit',
    ]),
):
    """Parameters(hue_value, hue_width, saturation_minimum,
    intensity_upper_limit, intensity_weak_threshold,
    intensity_strong_threshold, intensity_lower_limit)
    Attributes
    ----------
    hue_value:
      Center of the hue range in HSI space for the positive color, in
      the range [0, 1]
    hue_width:
      Width of the hue range in HSI space
    saturation_minimum:
      Minimum saturation of positive pixels in HSI space, in the range
      [0, 1]
    intensity_upper_limit:
      Intensity threshold in HSI space above which a pixel is
      considered negative, in the range [0, 1]
    intensity_weak_threshold:
      Intensity threshold in HSI space that separates weak-positive
      pixels (above) from plain positive pixels (below)
    intensity_strong_threshold:
      Intensity threshold in HSI space that separates plain positive
      pixels (above) from strong positive pixels (below)
    intensity_lower_limit:
      Intensity threshold in HSI space below which a pixel is
      considered negative
    """


OutputTotals = namedtuple('OutputTotals', [
    'TotalPixels',
    'NumberWeakPositive',
    'NumberPositive',
    'NumberStrongPositive',
    'IntensitySumWeakPositive',
    'IntensitySumPositive',
    'IntensitySumStrongPositive',
])


def _combine(results):
    """Combine the OutputTotals for each group of tiles by summing the fields"""
    return OutputTotals._make(sum(r[i] for r in results) for i in range(len(OutputTotals._fields)))


def _count_tiles(slide_path, params, kwargs, position, count):
    """Run positive pixel count (ppc) on a group of tiles with binary mask denoting the regions that should be anlayzed
    """
    ts = large_image.getTileSource(slide_path)

    lpotf = len(OutputTotals._fields)
    total = [0] * lpotf

    for tile_pos in range(position, position + count):
        tile = ts.getSingleTile(tile_position=tile_pos, **kwargs)
        tile_im = tile['tile']

        # ppc on the tile
        subtotal, _ = _count_image(tile_im, params)

        # keep a running sum of the ppc results
        for k in range(lpotf):
            total[k] += subtotal[k]

    return OutputTotals._make(total)


def _count_image(image, params, mask=None):
    """Run positive pixel count (ppc) on an image, subject to binary mask for pixels analyzed"""
    # if no mask given, make a dummy mask of ones to make code streamlined
    if mask is None:
        mask = np.ones((image.shape[0], image.shape[1])).astype(np.bool)

    # remove alpha channel
    im = image[:, :, :3].copy()

    # remove any areas of pure white as non-tissue
    white_mask = _create_white_mask(im)
    mask = (mask & white_mask).astype(np.bool)

    tp = np.count_nonzero(mask)  # total pixels to count

    p = params

    # identify all pixels that fall in any positive category
    image_hsi = rgb_to_hsi(im / 255)
    mask_all_positive = (
            (np.abs((image_hsi[..., 0] - p.hue_value + 0.5 % 1) - 0.5) <= p.hue_width / 2) &
            (image_hsi[..., 1] >= p.saturation_minimum) &
            (image_hsi[..., 2] < p.intensity_upper_limit) &
            (image_hsi[..., 2] >= p.intensity_lower_limit)
    )

    # zero out pixels not in tissue mask
    mask_all_positive = (mask_all_positive & mask).astype(np.bool)

    # intensity of all positive pixels
    all_positive_i = image_hsi[mask_all_positive, 2]

    # apply Aperio's ppc algorithm to group positive pixels into weak, positive, and strong positive categories
    # get a count of each category and intensity sum
    mask_weak = all_positive_i >= p.intensity_weak_threshold
    nw, iw = np.count_nonzero(mask_weak), np.sum(all_positive_i[mask_weak])
    mask_strong = all_positive_i < p.intensity_strong_threshold
    ns, is_ = np.count_nonzero(mask_strong), np.sum(all_positive_i[mask_strong])
    mask_pos = ~(mask_weak | mask_strong)
    np_, ip = np.count_nonzero(mask_pos), np.sum(all_positive_i[mask_pos])

    total = OutputTotals(
        TotalPixels=tp,
        NumberWeakPositive=nw,
        NumberPositive=np_,
        NumberStrongPositive=ns,
        IntensitySumWeakPositive=iw,
        IntensitySumPositive=ip,
        IntensitySumStrongPositive=is_,
    )
    return total, (mask_all_positive, mask_weak, mask_pos, mask_strong, mask)


def _create_white_mask(im, lower=np.array([0, 7, 0]), upper=np.array([255, 255, 255])):
    """Use HSV color space lower and upper thresholding to create binary mask of non-white region of image """
    hsv_im = cv2.cvtColor(im, cv2.COLOR_RGB2HSV)
    mask = cv2.inRange(hsv_im, lower, upper)

    # clean mask
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    # return a mask as dtype np.uint8
    return mask


def _grab_mask_region(region, mask, width, height):
    """grab the corresponding mask region for the associated full resolution region
    width and height are the full resolution image width and height
    """
    # transform coordinates of region to mask coordinates (high res -> low res)
    x_factor = mask.shape[1] / width
    y_factor = mask.shape[0] / height
    y_min = int(region["top"] * y_factor)
    y_max = int(region["top"] * y_factor + region["height"] * y_factor)
    x_min = int(region["left"] * x_factor)
    x_max = int(region["left"] * x_factor + region["width"] * x_factor)

    # if width/height of region at low res is not at least 1, make it 1
    if y_min == y_max:
        y_max = y_min + 1
    if x_min == x_max:
        x_max = x_min + 1

    # grab mask region
    submask = mask[y_min:y_max, x_min:x_max]
    return submask


def _format_output(output):
    """Convert the count_image output to dictionary format, calculate the percent of each count using the number of
    pixels in the roi region as the denominator.
    """
    new_output = {
        'roi_count': output.TotalPixels,
        'weak_pos_count': output.NumberWeakPositive,
        'pos_count': output.NumberPositive,
        'strong_pos_count': output.NumberStrongPositive,
    }
    new_output['all_pos_count'] = new_output['weak_pos_count'] + new_output['pos_count'] + new_output[
        'strong_pos_count']

    if new_output['roi_count'] == 0:
        raise Exception('Zero pixels found in region of interest.')

    new_output['percent_weak_pos'] = new_output['weak_pos_count'] * 100 / new_output['roi_count']
    new_output['percent_pos'] = new_output['pos_count'] * 100 / new_output['roi_count']
    new_output['percent_strong_pos'] = new_output['strong_pos_count'] * 100 / new_output['roi_count']
    new_output['percent_all_pos'] = new_output['all_pos_count'] * 100 / new_output['roi_count']

    return new_output


def count_image(gc, item_id, params, region, metadata_key=None, save_dir=None, tile_dim=5000, color_map=None, 
                file_path=None):
    """Modified version of histomicsTK positive pixel count.
    This version analyzes the image directly from a DSA item and does not require a locally saved image.
    The WSI is analyzed in large tiles. Each pixel in the image is labeled as negative, weak positive, positive, or
    strong positive.
    HistomicsUI annotations can be used to define the ROI.
    It is possible to also set save_dir to a directory and save output images to later build a TIFF from.
    Parameters
    ----------
    gc : girder_client.GirderClient
        authenticated girder client, for private images
    item_id : str
        the image item id to pull the tiles from
    params : Parameters
        see Parameters class - parameters used in algorithm to determine pixel label
    region : dict
        contains left, top, width and height of a rectangular region to apply ppc on
    metadata_key : str (optional)
        if passed then the results will be pushed as ppc_results-metadata_key key, in dict format
    save_dir: str (optional)
        dir to save output images as npy files, if None then images are not saved
    tile_dim: int (optional)
        image is analyzed in large square regions (tiles), this parameters controls the dimension of the tile.
    color_map: dict (optional)
        color map to use for labeled images, should contain keys negative, weak_pos, pos, and strong_pos with a
        array of length three for each denoting the RGB color. If left as None then default colors are used.
    file_path : str (optional)
        file path + filename of the file locally stored, if this is passed then the image regions will be pulled locally
        which is faster than getting them from the DSA server
    """
    # create hash for files saved for this run
    hashobject = {'params': params, 'item_id': item_id, 'region': region, 'tile_dim': tile_dim, 'color_map': color_map}
    _hash = hashlib.md5(str(hashobject).encode()).hexdigest() 

    with open(join(save_dir, f'{_hash}.PPC.json'), 'w') as fp:
        json.dump(hashobject, fp)

    if save_dir is not None: 
        makedirs(save_dir, exist_ok=True)
        
    # get the item name for saving images
    item = gc.getItem(item_id)
    filename = splitext(item['name'])[0]

    # set up color map parameter if not specified
    if color_map is None:
        color_map = {'negative': [0, 255, 0], 'weak_pos': [235, 235, 52], 'pos': [235, 164, 52],
                     'strong_pos': [255, 0, 0]}
    # WSI image info
    im_info = gc.get('item/{}/tiles'.format(item_id))

    # use 1.25 magnification for ROI binary mask
    scale_factor = 1.25 / im_info['magnification']

    # get full image width and height
    width = im_info['sizeX']
    height = im_info['sizeY']

    # create low res binary mask of region to apply ppc to
    roi_mask = np.zeros((int(height * scale_factor), int(width * scale_factor)), dtype=np.uint8)
    xmin, ymin = int(region['left'] * scale_factor), int(region['top'] * scale_factor)
    xmax, ymax = int(xmin + region['width'] * scale_factor), int(ymin + region['height'] * scale_factor)
    roi_mask[ymin:ymax, xmin:xmax] = 255
    
    # get the minimum bounding coordinates to loop through image (speeds up process)
    # - these are grabbed from low resolution mask but must be scaled back to full res
    roi_rows, roi_cols = np.where(roi_mask)
    left = int(min(roi_cols) * 1 / scale_factor)
    right = int(max(roi_cols) * 1 / scale_factor)
    top = int(min(roi_rows) * 1 / scale_factor)
    bottom = int(max(roi_rows) * 1 / scale_factor)

    # output is formatted as named tuple - instantiating the total count variable for the analysis
    lpotf = len(OutputTotals._fields)
    total = [0] * lpotf

    if file_path is not None:
        # get local large image tile source
        ts = large_image.getTileSource(file_path)
        kwargs = {'format': large_image.tilesource.TILE_FORMAT_NUMPY}

    # start counting the image in tiles
    xys = [(y,tile_top,x,tile_left) for y, tile_top in enumerate(range(top, bottom, tile_dim)) 
           for x, tile_left in enumerate(range(left, right, tile_dim))]
    
    for xy in tqdm(xys):
        y, tile_top, x, tile_left = xy
    
        if save_dir is not None:
            # save tile labeled image
            # im_savepath = join(save_dir, '{}_left_{}_top_{}-rowInd_{}_colInd_{}-im.png'.format(filename, left, top, y, x))
            # output_savepath = join(save_dir, '{}_left_{}_top_{}-rowInd_{}_colInd_{}-output.png'.format(filename, left, top, y, x))
            im_savepath = join(save_dir, f'{_hash}.IMG.png')
            output_savepath = join(save_dir, f'{_hash}.PPC.png')

        # region to get
        region = {'left': tile_left, 'top': tile_top, 'width': tile_dim, 'height': tile_dim}

        # get the roi mask region, it should grab it at low resolution
        mask_reg = _grab_mask_region(region, roi_mask, width, height)

        # grab the image
        if file_path is None:
            # get image tile from DSA request
            im = get_region_im(gc, item_id, region)[:, :, :3]
        else:
            # get image tile from local tilesource
            kwargs['region'] = region
            im = ts.getRegion(**kwargs)[0][:, :, :3]

        # count if at least 1 pixel in mask is not zero
        if np.count_nonzero(mask_reg):
            # resize the mask to match the image
            resized_mask = cv2.resize(mask_reg, (im.shape[1], im.shape[0]))
            resized_mask = (resized_mask > 0).astype(np.uint8) * 255

            # count image
            subtotal, masks = _count_image(im, params, mask=resized_mask)

            # keep a running sum of the ppc results
            for k in range(lpotf):
                total[k] += subtotal[k]

            if save_dir is not None:
                # create the output tile image from the masks to save as local PNG
                # use masks to change value in tile mask to correct values
                # mask is initially all negative (1)
                # first - change non-roi pixels to zero
                # second - change weak pos to 2, pos to 3, strong pos to 4
                mask_all_positive, mask_weak, mask_pos, mask_strong, _roi_mask = masks

                # turn all roi pixels to black
                roi_inds = np.argwhere(_roi_mask)
                output_tile = np.copy(im)
                output_tile[roi_inds[:, 0], roi_inds[:, 1], :] = color_map['negative']

                # turn each mask pixels into unique colors
                ind = np.argwhere(mask_all_positive)
                if np.count_nonzero(mask_weak):
                    weak_ind = ind[mask_weak, :]
                    output_tile[weak_ind[:, 0], weak_ind[:, 1]] = color_map['weak_pos']
                if np.count_nonzero(mask_pos):
                    pos_ind = ind[mask_pos, :]
                    output_tile[pos_ind[:, 0], pos_ind[:, 1]] = color_map['pos']
                if np.count_nonzero(mask_strong):
                    strong_ind = ind[mask_strong, :]
                    output_tile[strong_ind[:, 0], strong_ind[:, 1]] = color_map['strong_pos']

                # save npy file of output tile image
                # np.save(save_path, output_tile)
                imwrite(output_savepath, output_tile)
                imwrite(im_savepath, im)

    # make the total and formatted to dict to return
    output = OutputTotals._make(total)
    metadata = _format_output(output)

    if metadata_key is not None:
        # push the output as metadata
        _ = gc.addMetadataToItem(item_id, {metadata_key: metadata})
    return output
