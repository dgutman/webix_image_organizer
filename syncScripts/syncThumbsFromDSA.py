import girder_client
import os,sys,json	


CB_MAIN_URL = "https://computablebrain.emory.edu/girder/api/v1"
gc = girder_client.GirderClient(apiUrl=CB_MAIN_URL)
gc.authenticate(apiKey=adrc_apiKey)

class LinePrinter():
    """
    Print things to stdout on one line dynamically
    """
    def __init__(self,data):
        sys.stdout.write("\r\x1b[K"+data.__str__())
        sys.stdout.flush()


cacheBaseDir = '/localRaid/ADRC_Thumbs/'
totalProcessed = 0
batchSize = 500


DataSetList = [{'name':"EmoryADRC", "_id": '5f4ad0e0239fccd2dfc30887'}]
for dsl in DataSetList:
    print("Checking cache for",dsl['name']    )
    curBatchProcessed = 0
    dataSetImageList = gc.get( ("resource/%s/items?type=collection&limit=%d&offset=%d" % ( dsl['_id'],batchSize, batchSize*curBatchProcessed)))
    while dataSetImageList:
        for img in dataSetImageList:
            totalProcessed +=1
            #print img['name']
            output = "Total Processed: %d: Processing %d out of %d; File %s" % (totalProcessed, curBatchProcessed, batchSize, img['name'])
            LinePrinter(output)
            imgTargetDir = os.path.join(cacheBaseDir,dsl['name'],img['name'])
            if not os.path.isdir(imgTargetDir):
                os.makedirs(imgTargetDir)

            imgLocalFileName = os.path.join(imgTargetDir,img['name']+'_thumb.jpg')  #may want to check the image header..

            if not os.path.isfile(imgLocalFileName):
                print("Creating %s %s" % ( imgLocalFileName,img['_id']))
            sys.exit()


##  I need to get a region.. not a file!! 
#GET /item/{itemId}/tiles/thumbnai#            if not os.path.isfile(imgLocalFileName):
#                imgFile = gc.get('image/%s/download' % img['_id'],jsonResp=False)
#                with open(imgLocalFileName,"wb") as fpi:
#                    fpi.write( imgFile.content)
            

        curBatchProcessed+=1 
        getStr = "image?limit=%d&offset=%d&datasetId=%s" % ( batchSize, (int(batchSize)*int(curBatchProcessed)), dsl['_id'])
        dataSetImageList = gc.get(getStr )

