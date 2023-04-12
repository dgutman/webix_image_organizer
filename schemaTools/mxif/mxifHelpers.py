import girder_client
import io, csv
import pandas as pd

def processImageMetadataFile(gc, itemId,csvFileName="CONTENTS.csv"):
    """ The metadata for the folder should be a csv file with the name CONTENTS.csv
    I then need to read the file contents of the itemID, assuming the first file associated with the item is the
    appropriate CSV file """
    for f in gc.listFile(itemId):
        ## Only want files that end in  _metadata.csv for Vanderbilt data
        if f['name'].endswith(csvFileName):
            fn = f['name']
            # slideName = fn.replace("_metadata.csv","")
            fio = io.BytesIO() ### File like object to store the CSV File
            # print(f['_id'])
            
            m =gc.get("file/%s/download?contentDisposition=inline"% f['_id'],jsonResp=False)
            fio.seek(0)
            csvraw = m.content.decode('utf-8')

            cr = csv.reader(csvraw.splitlines(), delimiter=',')
            my_list = list(cr)
            ## Assumes first row is the column headers.. will add a check
            df = pd.DataFrame(my_list[1:],columns=my_list[0])
            return df


def processVandyImageFolder( gc, folderId):
    """ This expects the folder to have a CONTENTS.csv file which is where I get all the metadata
     I also need to get the internal girder ID for each of the image files for additional processing
    """
    itemSet = gc.listItem(folderId)
    ## Process the itemSet and also look for the CONTENTS.csv file
    itemDict = {}
    
    for i in itemSet:
        itemDict[i['name']] = i
        if i['name'] == "CONTENTS.csv":
            metadataItemId = i['_id']


    df = processImageMetadataFile(gc, metadataItemId)
    print(df)


    return df

