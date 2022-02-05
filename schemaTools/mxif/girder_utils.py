import girder_client

#Coded by Mohammed
#Modified by Juan Carlos Vizcarra
#Last updated: 10/10/2017

def listChildItems(gc, path, params=None, limit=None, offset=None,pageSize=1000):
    """
    This is a generator that will yield records using the given path and
    params until exhausted. Paging of the records is done internally, but
    can be overriden by manually passing a ``limit`` value to select only
    a single page. Passing an ``offset`` will work in both single-page and
    exhaustive modes.
    """
    params = dict(params or {})
    params['offset'] = offset or 0
    params['limit'] = pageSize
    while True:
        recordSet = gc.get(path, params)
        for r in recordSet:
            yield(r)
        n = len(recordSet)

        if limit or n < params['limit']:
            # Either a single slice was requested, or this is the last page
            break
        params['offset'] += pageSize




def recurseGetItems(client, folderID, parentType='folder'):
    '''
    Returns a list of json objects representing the items inside the folderID given in the appropriate api
    This algorithm implements recursion method
    
    INPUTS
    client - a girder client object
    folderId - a string id of the folder or collection
    parentType - only needs to be modified if your folderId is for a collection (see above)
        
    OUTPUT
    items - an array containing slide info
    '''
    folders = []
    folders.extend(client.listFolder(folderID, parentFolderType=parentType))
    items = []
    try:
        items.extend(client.listItem(folderID))
    except:
        items = []
        
    if len(folders) is not 0:
        for fld in folders:
            items.extend(recurseGetItems(client, fld['_id']))
    return items


def lookupItemByName( girderClient, parentFolderID, itemName):
    """Sees if an item of FOO already exists in folder BAR"""
    gc = girderClient
    try:
        itemData = gc.get('/item?folderId=%s&name=%s&limit=50&offset=0&sort=lowerName&sortdir=1' % (parentFolderID,itemName ))
        return itemData
    except:
        ### no item found
        return False


def getFolderID_for_FolderName_in_ParentFolder( girderClient, folderName, parentFolderID, parentType='folder'):
    """Since a folder name may (or may not) be unique across a collection, or across girder
    This will search for folder FOO in the folder BAR, and will create a folder if it doesn't exist yet"""
    gc = girderClient
    
    try:
        folderData = gc.createFolder(parentFolderID , folderName, parentType=parentType)
    except:
        requestUrl = 'folder?parentType=%s&parentId=%s&name=%s&limit=50&sort=lowerName&sortdir=1' % (parentType, parentFolderID, folderName)
        folderData = gc.getResource(requestUrl)[0]
        
    return folderData['_id']


def copySlideToCuratedFolder( girderClient, itemData, metaData, curatedFolderID, patientID):
    '''
    Two level copying a slide to a folder. This is tailored to work with a patient ID top level and a stain type nested folder
    level. It also puts slides in an unknown subfolder if a condition is met (see below)
    
    INPUTS
    giderClient: initiated to the right api
    itemData: the girder client dictionary containign the name and _id of slide (plus metadata is available)
    metaData: contains the metadata or None if the slide should go in the unknown folder
    curatedFolderID: id of the destination folder
    patientID: id of the patient, TOP level folder identifier (e.g. ADRCXX-XX)
    '''
    #if the slide was bad, metaData was passed as None
    gc= girderClient
    
    ## Refactor this to maybe just have it uses those keys in a list or something?
    if metaData is None:
        #Here is the logic for when you want to put the slide into the uknown folder. I need to check if the folder
        #for this patient exists. It doesn't I should create a subfolder named unknown (similar to how the stain type and
        #patient folder are made
        firstBranchName = patientID
        secondBranchName = 'unknown'
    else:
        ## This could maybe recurse based on splitting the namingScheme, but may become hard to read
        firstBranchName = patientID
        secondBranchName = metaData['stainType']
        
    firstBranch_FolderID = getFolderID_for_FolderName_in_ParentFolder( gc,firstBranchName,curatedFolderID)
    ### The parent folder for the second branch is what's returned from the previous staement
    secondBranch_FolderID = getFolderID_for_FolderName_in_ParentFolder( gc,secondBranchName,firstBranch_FolderID)
    ### Check if item already exists in the targetFolder
    if not lookupItemByName( gc, secondBranch_FolderID, itemData['name']):
        print ("Moving the folder to %s / %s " %  ( patientID, secondBranchName ))
        try:
            gc.post("item/" + itemData['_id'] + '/copy', {"folderId": secondBranch_FolderID})
        except:
            pass
        

def validateSlideMetaData( slideMetaData, validStainTypes ):
    '''
    Checks to see if the stain type of the metadata matches one of the designated stain types. Also checks that the 
    metadata contains a patient ID tag. Also it checks that the blockID of the metadata is not too long, which would
    indicate an error
    
    INPUTS:
    slideMetaData: dictionary containing the metadata
    validStainTypes: an array containing the valid stain types
    
    OUTPUTS:
    returns an array containing error information of why the slide does not match the pattern (either patientID missing,
        block ID too long, or stain type not valid. It also returns True is slide is good (passed all tests) or False if
        it failed one or more
    '''
    
    errors = []
    
    if slideMetaData['stainType'] not in validStainTypes:
        errors.append(('StainType',slideMetaData['stainType']))
    
    if not slideMetaData['patientID']:
         errors.append(('InvalidPatientID',slideMetaData['patientID']))
            
    if len(slideMetaData['blockID']) > 4: #correction from DG, previously !=2
         errors.append(('InvalidBlockID',slideMetaData['blockID']))
    
    
    if len(errors) > 0:
        return (False, errors)
    else:
        return (True, [])
    

def create_curated_folder(girderClient, FolderToCurate_ID, TargetFolder_ID, stain_Types, make_unknown=True, ommit=[]):
    """
    A routine that takes in a starting folder in the API and a destination folder, and reorganizes the data
    to match a speficied format. In short, it creates a folder structure that is grouped by desired metadata found in the 
    slide files (e.g. group by patient ID followed by grouping by stainType
    
    INPUTS:
        girderClient: initialized outside the function and must be the desired api (e.g. ADRC)
        FolderToCurate_ID: id of the folder that currently has the slides
        TargetFolder_ID: id of the destination folder (does not have to be empty but must be created beforehand)
        stain_Types: an array of strings corresponding to the stain types that should be recognized
    OPTIONAL_INPUTS:
        make_unknown: default is True and results in slides that don't match the stain type given to be put in their own
            unkown subfolder. If False
        ommit: if you know there is a folder(s) you don't want include, then pass that string name in ommit array
    OUTPUT:
        stats: dictionary with two keys. SlidesThatFailed contains the name of the slides that did not match the format. 
            Errors contains info on why the slides specifically failed
    """
    gc = girderClient
    SlidesThatFailed = [] 
    allerrors = []
    
    for folder in gc.listFolder(FolderToCurate_ID): #list all folders, one level down from collection
        if folder['name'] not in ommit:
            #the folders also have the patient ID, so could get these via regex to deal with the unknown cases
            patientID = folder['name'] #from folder name, NOT metadata
        
            curPatientData = recurseGetItems(gc,folder['_id']) #get all the slides in each folder
            for cpd in curPatientData: #for each slide
                if cpd['name'].endswith(('ndpi','svs')) : #these are the valid slides, so for each slide
                    ### let's figure out what metadata keys we need in order to be happy about the slide
                    try:
                        (metaDataGood,errors) =  validateSlideMetaData( cpd['meta'] , stain_Types)
                        if len(errors) != 0:
                            allerrors.append(errors)
                    except:
                        print("No metadata for", cpd['name'])
                        continue
                    if metaDataGood: #only true if it passed the above
                        copySlideToCuratedFolder(gc, cpd, cpd['meta'], TargetFolder_ID, patientID)
                    else:
                        if make_unknown: 
                            copySlideToCuratedFolder(gc, cpd, None, TargetFolder_ID, patientID)
                        SlidesThatFailed.append(cpd['name'])
        else:
            print('Skipping folder name:',folder['name'])
    stats = dict([('SlidesThatFailed',SlidesThatFailed),('Errors', allerrors)])
    return stats

'''
def recurseGetItems(client, folderId, parentType='folder', printLog=False):
    
    JCV: This function was modified to handle cases when the folder id corresponds to a collection instead of a folder
    In this case it requires an optional parameter (parentType) to be set to collection
    
    INPUTS
    client - a girder client object
    folderId - a string id of the folder or collection
    parentType - only needs to be modified if your folderId is for a collection (see above)
    printLog - set to True to informative output to be printed (only works for collection Ids)
    
    OUTPUT
    slideDict - when dealing with collections it returns a dictionary with the slides info in a folder structure
    items - an array containing slide info
    
    
    if parentType=='collection':
        topLevelFolders = client.listFolder(folderId, parentFolderType=parentType)
        slideDict = {} #Dict where the top level key is the folder name, and below are the slides in that folder
        
        for tlf in topLevelFolders:
            slidesInFolder = recurseGetItems(client, tlf['_id'])
            if printLog:
                print "Retrieving slides in",tlf['name'],";", len(slidesInFolder),"files are in the current folder"
            slideDict[tlf['name']] = slidesInFolder    
        return slideDict
    else:        
        items = list(recurseGetResource(client, folderId, 'item'))
        folders = recurseGetResource(client, folderId, 'folder')

        for folder in folders:
            tmp = recurseGetItems(client, folder["_id"])
            items += list(tmp)

        return items

def recurseGetResource(client, parentId, resourceType, parentType='folder'):


    ### The recursion logic is broken here...
    """
    Recurse below the parent(indicated by parentId) and generate a list of all
    resources of type resourceType that existed under the parent.
    :param parentId: Id of the collection or folder to be searched.
    :type parentId: ObjectId
    :param resourceType: Either 'item' or 'folder'. Indicates whether nested
    folder data or item data should be collected.
    :type resourceType: str
    :param parentType: Either 'folder' or 'collection'. Indicates whether
    the parentId is a collection id or a folder id.
    :type parentType: str
    :returns: A list of all folders or items below parentId.
    :rtype: list of dict
    """
    # now get all folders
    resourceList = []

    try:
        folders = client.listFolder(parentId, parentFolderType=parentType)
    except girder_client.HttpError as err:
        print err
#        print HttpError(err)
        return []

    #The line below is commented and moved below because this is an iterator and 
    #it consume the list only once, you will ending extending resourceList to None
    #folderIdList = getField(folders, '_id')

    if resourceType is 'item' and parentType is not 'collection':
        try:
            data = client.listItem(parentId)
            resourceList.extend(data)
        except girder_client.HttpError as err:
            print "HTTP Error thrown"

#            print HttpError(err)
            print err
            return []
    elif resourceType is 'folder':
        resourceList.extend(folders)
    elif resourceType is not 'item' or resourceType is not 'folder':
        raise Exception('Invalid resourceType: %s' % resourceType)

    #folderIdList is an iterator and can only be consumed once. Do not move it up in the function
    folderIdList = getField(folders, '_id')

    ### The recursion does NOT work if you start with a collection.. probably iwll work if it's a folder.
    for folderId in folderIdList:
        #if re
        resourceList.extend(recurseGetResource(client, folderId, resourceType))

    return resourceList

def getField(data, strKey):
    return [i[strKey] for i in data]
'''
