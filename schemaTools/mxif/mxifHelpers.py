import tqdm 
import io, csv
import pandas as pd

### Helpers for MxIF data loading for Vanderbilt data to use the multiplex image viewer
def checkForLargeImage( i):
    ## Given a girder item, see if it has a largeImage tag
    ## If it does, also check it the image has frames... if not try and force it to be recreated
    if 'largeImage' in i:
        ### Check and see if the item has frames
        ## Scan for gdal here as well
        
        tileInfo = gc.get("/item/%s/tiles" % i['_id']) 
        if 'frames' not in tileInfo:
            ## found a single frame image... should check and see if the tile source is gdal
            ### Maybe add ioparams info that image was reconverted?
            gc.delete("item/%s/tiles" % i['_id'])
            gc.addMetadataToItem(i['_id'],{'ioparams':{"forceLargeImage":True}})
            gc.post("/item/%s/tiles?force=true" % i['_id'])
            print("Recreating large image for", i['name'])        
            

## Since the metadata files are relatively small, I'm just going to iterate through the directory, and read each CSV into a dictionary
## And then in a second function apply the metadata to any matched items

def generateVandyMetadataDict( metadataFolderId, gc, zeroIndexed=False):
    ## Iterate through all the items in the metadata folder
    vandyMetadataDict = {} 
    ## This will return a dictionary that has each image Filename as the key, and then an array 
    
    
    ## Deal with Zero and One Indexed Frames
    
    for i in tqdm.tqdm( gc.listItem ( metadataFolderId)):
        ## Each item is then associated with (hopefully only) one csv file
        ## Note in Girder, an item can consist of one or more files
        for f in gc.listFile(i['_id']):
        ## Only want files that end in  _metadata.csv for Vanderbilt data
            if f['name'].endswith("_metadata.csv"):
                fn = f['name']
                slideName = fn.replace("_metadata.csv","")
                fio = io.BytesIO() ### File like object to store the CSV File
                ### Note the jsonResp = False ... downloading CSV contents and making it into a useful format
                m =gc.get("file/%s/download?contentDisposition=inline"% f['_id'],jsonResp=False)
                csvraw = m.content.decode('utf-8')

                cr = csv.reader(csvraw.splitlines(), delimiter=',')
                my_list = list(cr)
                df = pd.DataFrame(my_list[1:],columns=my_list[0])

                csvDict = df.to_dict(orient='records')


                if slideName not in vandyMetadataDict:
                    vandyMetadataDict[slideName] = df.to_dict(orient='records')
                else:
                    print("Import Error.. seems to be more than one metadata file for", slideName)
    return vandyMetadataDict
                
