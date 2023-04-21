import girder_client
import io, csv, yaml, os
import pandas as pd
from collections import OrderedDict

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


def generateDSA_yamlFile(gc, metadataItem):
    """
    This accepts the item from Girder, which should be a CONTENTS.csv file, it then grab the contents of this file
    and also figures out the parent folder

    channelInfo_df: pandas dataframe
    Generate a yaml file that describes the layers and naming convention to use"""

    ## I am also going to check the folder with the CONTENTS.csv file and grab all the individual images
    ## I am going to generate the YAML file using the file ID, not the file name
    imageName = gc.getFolder(metadataItem['folderId'])['name']
    ## The parent folder name should also be the name of the image bundle

    folderItemSet = list(gc.listItem(metadataItem['folderId']))
    
    ## I need to now make sure each file name references in the channel info, is actually in the target directory
    ## and then get the ID
    fileSetDict = {}
    for f in folderItemSet:
        fileSetDict[f['name']] = f
        ## SOMETIMES IT SEEMS LIKE THE IMAGE IS MISSINGS ITS EXTENSION, SO I AM GENERATING TWO POSSIBLE KEY MATCHES
        fileNoExt = os.path.splitext(f['name'])[0]
        fileSetDict[fileNoExt] = f


    yamlText = f'''---\r\nname: {imageName}\r\nsources:\r\n'''


    imageMeta_df = processImageMetadataFile(gc,metadataItem['_id'])

    for r in imageMeta_df.to_dict(orient="records"):
        if r['TYPE'] == 'IMAGE':
            ## Make sure the image referenced in the image list exists
            if r['FILE'] in fileSetDict:
                channelImageId = fileSetDict[r['FILE']]['_id']

                channelName = r['DESCRIPTION']

                yamlText += f'  - path: girder://{channelImageId}\r\n    channel: {channelName}\r\n    z: 0\r\n'


    return yamlText, imageName


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



    # print(fileSetDict.keys())
    # yml_dict = OrderedDict()
    # yml_dict['name'] = imageName
    # yml_dict['sources'] = []


    # return (
    # f'---\r\n'
    # f'width: {mcWidth}\r\n'
    # f'height: {mcHeight}\r\n'
    # 'sources:\r\n'
    # f'  - path: girder://{imgIdOne}\r\n'
    # f'    z: 0\r\n'
    # f'    position:\r\n'
    # f'      x: 0\r\n'
    # f'      y: 0\r\n'
    # f'  - path: girder://{imgIdTwo}\r\n'
    # f'    z: 0\r\n'
    # f'    position:\r\n'
    # f'      x: {imgOneTs["sizeX"]}\r\n'
    # f'      y: 0\r\n'
    # )
