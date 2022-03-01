import os
import dsautils.girder_utils
import cv2

def getLabeledImages( gc, itemId, modelMetaTag='yolo-test',labelsToGrad='all',confidence_min=0,exportDir="thumbnailCache/",output='files',debug=False,tileSize=256):
    ### Grab either all of the images, or can choose a specific tag... 
    ### The data should be stored on the DSA under item.meta.modelMetaTag
    ### This should then be an array ordered by
    ## lblTag, lbLeft, lblTop, lblBottom, lblRight, lblConfidence  where TAG is the class name, left,top,bottom, right are coordinates
    ## in absolute pixels and Confidence is the models outputted confidence level
    
    ## This can also generate a giant mosaic image... eventually
    
    
    if not os.path.isdir(exportDir):
        os.makedirs(exportDir)
        
    item = gc.getItem(itemId)
    
    if modelMetaTag in item['meta']:
        labelData = item['meta'][modelMetaTag]
        if debug: print(len(labelData),'predictions found for %s' % modelMetaTag)
        for l in labelData:
            (lbl,lblLeft,lblTop,lblRight,lblBottom,lblConf) = l
            ### Check if this is a label I want to output
            outputFileName = "%s.%s.%s.%s.%s.%s.%s.png" % (item['name'],modelMetaTag,lbl,lblLeft,lblTop,lblRight,lblBottom)
            

            outputFile = os.path.join(os.getcwd(),exportDir,outputFileName)
            imgData = dsautils.girder_utils.get_region(gc,itemId,left=lblLeft-tileSize/2,top=lblTop-tileSize/2, bottom=lblBottom+tileSize/2, right=lblRight+tileSize/2)
            cv2.imwrite(outputFile,imgData)
            

    else:
        print("No model outputs found for this image %s %s" % itemId['_id'],itemId['name'])