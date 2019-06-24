import cv2

from marker import MARKER
import numpy as np


def isContoursClose(cnt1, cnt2, size):
    for i in range(0, len(cnt1)):
        for j in range(0, len(cnt2)):
            dist = np.linalg.norm(cnt1[i] - cnt2[j])
            if dist < 0.25 * size:
                return True
    return  False


def haveImageMarker(img):

    img = cv2.resize(img, (224, 224), interpolation=cv2.INTER_CUBIC)
    # img = cv2.blur(img, (3,3))
    color = MARKER

    masks = []
    for r in color:
        masks.append(cv2.inRange(img, np.array(r[0]), np.array(r[1])))

    merged_mask = masks[0]
    for mask in masks:
        merged_mask = merged_mask | mask

    img = cv2.bitwise_and(img, img, mask=merged_mask)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(gray, 30, 255, 0)
    _, contours, hier = cv2.findContours(thresh, cv2.RETR_EXTERNAL, 2)

    LENGTH = len(contours)

    if LENGTH != 0:
        groups = np.zeros((LENGTH, 1))

        for i in range(0, len(contours)):
            for j in range(0, len(contours)):

                if isContoursClose(contours[i], contours[j], img.shape[0]):
                    if groups[i] != 0 and groups[j] != 0:
                        val = min(groups[i], groups[j])[0]
                        maximum = max(groups[i], groups[j])[0]
                        groups[j] = groups[i] = val
                        groups[groups == maximum] = val
                    elif groups[i] != 0:
                        groups[j] = groups[i]
                    elif groups[j] != 0:
                        groups[i] = groups[j]
                    else:
                        groups[i] = groups[j] = max(groups)[0] + 1


        maximum = int(max(groups)[0])

        unified = []

        for i in range(1, maximum + 1):
            pos = np.where(groups == i)[0]
            if pos.size != 0:
                cont = np.vstack(contours[i] for i in pos)
                hull = cv2.convexHull(cont)
                unified.append(hull)
        if unified:
            c = max(unified, key=cv2.contourArea)
            area = cv2.contourArea(c)
            if area/(img.shape[0] * img.shape[1]) > 0.05:
                return True

    return False

