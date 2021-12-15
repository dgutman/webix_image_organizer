import cv2

from colors import COLORS
import numpy as np

def get_image_sticker_colors(image):
    image = cv2.resize(image, (224, 224), interpolation=cv2.INTER_CUBIC)

    stickers = []
    if image is not None:
        height, width, dep = image.shape
        size = width * height
        print(image.shape)
        for (key, color) in COLORS.items():

            masks = []

            for range in color:
                masks.append(cv2.inRange(image, np.array(range[0]), np.array(range[1])))

            merged_mask = masks[0]
            for mask in masks:
                merged_mask = merged_mask | mask

            _, thresh = cv2.threshold(merged_mask, 40, 255, 0)
            contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
            print(contours)
            if len(contours):
                c = max(contours, key=cv2.contourArea)

                if cv2.contourArea(c) > 0.015 * size:
                    stickers.append(key)

    return stickers

