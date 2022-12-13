import re
import json

# jsonSchema docs are here: https://python-jsonschema.readthedocs.io/en/stable/
import jsonschema

# girder_client docs are here: https://girder.readthedocs.io/en/stable/python-client.html#the-python-client-library
import girder_client

import brain_region_maps

import pandas as pd

server = "candygram"
apiUrl = f"http://{server}.neurology.emory.edu:8080/api/v1"

# initializing connection with server via girder_client
gc = girder_client.GirderClient(apiUrl=apiUrl)

# authenticating connection to server
gc.authenticate(interactive=True)

folderID, parentType = "638e2da11f75016b81fda12f", "collection"

schemaPath = "adrcNpSchema.json"

yearsToScan = ["2020"]


def updateMetadata(folderID, parentType, yearsToScan=None):

    folderGen = gc.listFolder(folderID, parentFolderType=parentType)

    if yearsToScan is not None:
        folderGen = [folder for folder in folderGen if folder["name"] in yearsToScan]

    for folder in folderGen:
        print(f"============= YEAR: {folder['name']} =================")
        # Get the subfolders..
        for subfolder in gc.listFolder(folder["_id"]):

            urlExtension = f"resource/{subfolder['_id']}/items?type=folder"
            # hlprs.scanMetadata(gc,sf,updateGirder=True)
            # This is where we can modify the scanMetadata file .. if we bundle in the validateNPJson function
            # then we can ONLY update npSchema with valid data, and if the data is NOT valid we probably keep the data
            # but stick it on like  rawSlideMetadata or whatever key you decide you like
            for item in gc.listResource(urlExtension):
                if "meta" in item:

                    isValid = validateNPJson(item["meta"])

                    if not isValid[0]:

                        errorDict = isValid[1]
                        message, problemVal, instance = (
                            errorDict["message"],
                            errorDict["path"][-1],
                            errorDict["instance"],
                        )

                        if "not a Valid Value" not in instance:
                            instance = f"{instance} is not a Valid Value for this Field"

                        item["meta"]["npSchema"][problemVal] = instance
                        gc.addMetadataToItem(item["_id"], item["meta"])
                        gc.addMetadataToItem(item["_id"], {"npWorking": {problemVal: message}})

                else:
                    # need to call populateMetadataFromFileName() here but not sure the arguments since it seems to act at a higher level (i.e. folder)
                    # and only need to do this for a single file name in this context (or file by file as the case may be)
                    pass


def validateNPJson(schemaPath, jsonData):

    # Additional properties https://support.riverbed.com/apis/steelscript/reschema/jsonschema.html
    with open(schemaPath, "r") as fp:
        dsaNpSchema = json.load(fp)

    # jsonSchema docs: https://python-jsonschema.readthedocs.io/en/stable/
    try:
        jsonschema.validate(instance=jsonData, schema=dsaNpSchema)
    except jsonschema.exceptions.ValidationError as err:
        return (False, err._contents())
    return (True,)


adrcNamePattern = re.compile("(?P<caseID>E*A*\d+-\d+)_(?P<blockID>A*\d+).(?P<stainID>.*)\.[svs|ndpi]")

unknownStainTags = []  # I am making this global so I can access it whenever..
unmatchedFileNames = []
noBrainMap = set()
brainMapNoBlockMap = {}

#  NOTE: multiple different stainAliasDicts below
stainList = ["pTDP", "HE", "aBeta", "Ubiq", "Tau", "Biels", "Syn", "p62", "LFB"]


def populateMetadataFromFileName(folderID, parentType, updateGirder=False):

    slidesProcessed = 0
    slidesToUpdate = 0
    slidesUpdated = 0

    for folder in gc.listFolder(folderID, parentFolderType=parentType):
        for subfolder in gc.listFolder(folder["_id"]):

            urlExtension = f"resource/{subfolder['_id']}/items?type=folder"
            subjItemSet = gc.listResource(urlExtension)

            fileTypes = ["svs", "ndpi"]
            slideList = [x for x in subjItemSet if any([val in x["name"] for val in fileTypes])]

            for slide in slideList:
                # See if there's any metadata .. anywhere
                slidesProcessed += 1

                # Means I can add some metadata if I can find any... we haven't set anything yet
                slideName = slide["name"]
                metadata = adrcNamePattern.search(slideName)

                if metadata:
                    metadata = metadata.groupdict()
                    validatedNPData = validateInitialMetadata(metadata, debug=False)

                    hasNPSchema = slide["meta"].get("npSchema")

                    if hasNPSchema is None:
                        currentNpSchema = {}
                    else:
                        currentNpSchema = slide["meta"]["npSchema"]

                    if currentNpSchema != validatedNPData:

                        if updateGirder:
                            updateData = {"npSchema": validatedNPData}
                            gc.addMetadataToItem(slide["_id"], updateData)
                            slidesUpdated += 1

                        slidesToUpdate += 1

                elif "CON" in slideName.upper():
                    #  Probably a control slide!!
                    stainInString = [val for val in stainList if val.lower() in slideName.lower()]
                    stain = stainInString[0] if stainInString else "No Stain Identified"

                    if updateGirder:
                        updateData = {"npSchema": {"controlSlide": "Yes", "stainID": stain}}
                        gc.addMetadataToItem(slide["_id"], updateData)
                else:
                    unmatchedFileNames.append(slide["name"])
                    # print("This slidename failed to match and is not a control",slide['name'])

            if noBrainMap:
                print(f"Needs Brain Map: {noBrainMap}")
                noBrainMap.clear()

            if brainMapNoBlockMap:
                print(f"Needs Block Map: {brainMapNoBlockMap}")
                brainMapNoBlockMap.clear()

            return {
                "Processed": slidesProcessed,
                "girderUpdates": slidesUpdated,
                "slidesToUpdate": slidesToUpdate,
            }, unmatchedFileNames


def validateInitialMetadata(npMeta, debug=False):
    # This expects a dictionary of metadata for a case.. it should consist of
    # blockID, stainID, caseID and controlSlide
    # First version should just check and see if the stainID is a valid name...
    if debug:
        print(npMeta)

    stainAliasDict = {
        "PTDP": "pTDP",
        "ptdp": "pTDP",
        "pTDP": "pTDP",
        "pTDP (2)": "pTDP",
        "ptdp-001": "pTDP",
        "ptdp-002": "pTDP",
        "ptdp-003": "pTDP",
        "HE": "HE",
        "H&E": "HE",
        "HE (2)": "HE",
        "AB": "aBeta",
        "ABETA": "aBeta",
        "Ab": "aBeta",
        "AB (2)": "aBeta",
        "aBeta": "aBeta",
        "ubiq": "Ubiq",
        "UBIQ": "Ubiq",
        "Ubiq": "Ubiq",
        "TAU": "Tau",
        "Tau": "Tau",
        "tau": "Tau",
        "tau (2)": "Tau",
        "TAU (2)": "Tau",
        "TAU-001": "Tau",
        "BIELS": "Biels",
        "biels": "Biels",
        "Biels": "Biels",
        "Biels (2)": "Biels",
        "Biels (3)": "Biels",
        "SYN": "Syn",
        "Syn": "Syn",
        "syn": "Syn",
        "p62": "p62",
        "P62": "p62",
        "LFB-PAS": "LFB",
        "LFB": "LFB",
        "LFB PAS": "LFB",
    }

    if "stainID" in npMeta:

        stain = npMeta["stainID"]
        stainInString = [val for val in stainList if val.lower() in stain.lower()]

        if stain not in stainAliasDict and not stainInString:
            unknownStainTags.append(stain)
        elif stainInString:
            npMeta["stainID"] = stainInString[0]
        else:
            npMeta["stainID"] = stainAliasDict[stain]

    #  I have standardized everything to use an E not an A
    caseID = npMeta["caseID"].replace("A", "E")
    blockID = npMeta["blockID"]

    if caseID in brain_region_maps.MAP:
        brm = brain_region_maps.MAP[caseID]

        #  Block id does not have mapping -- generally due to typo or other oversight
        if brm.get(blockID) is None:
            npMeta["regionName"] = "Not Mapped"

            if brainMapNoBlockMap.get(caseID) is None:
                brainMapNoBlockMap[caseID] = {blockID: 1}

            elif brainMapNoBlockMap[caseID].get(blockID) is None:
                brainMapNoBlockMap[caseID][blockID] = 1

            else:
                brainMapNoBlockMap[caseID][blockID] += 1

        else:
            npMeta["regionName"] = brm[blockID]

    #  Case id fails to map in brain mapping -- generally due to typo
    else:
        noBrainMap.add(caseID)

    return npMeta


def auditMetadata(folderID, parentType, outputRecords=False):

    # building a list of all folders in the specified folder/collection
    folders = [folder for folder in gc.listFolder(folderID, parentFolderType=parentType)]

    #  mapping of select items seen returned from girder_client api calls

    #  _id: internal mongo id
    #  _modelType: object type (folder, item, or collection -- also annotations but not so relevant)
    #  baseParentId: collection the item is in
    #  baseParentType: parent object type (folder, item, or collection -- also annotations but not so relevant)
    #  created: date created
    #  creatorId: id of individual who created the item
    #  description: description of the item
    #  meta: dictionary of meta data pertaining to item
    #  name: item name (may be a year, patient id, or other folder/file names)
    #  parentCollection: *unclear, but told to ignore*
    #  parentId: id of parent collection
    #  public: whether item is public or not
    #  size: size in bytes (or other unit) -- folders show as 0
    #  updated: datetime of last update

    urlExtension = "resource/*/items?type=folder&limit=1000"

    # getting npSchema for all items with npSchema in all subfolders for all folders in folders
    # notice how urlExtension is just the extension required to perform the intended action
    # presumably, it is being used with the apiUrl already provided above
    itemSet = [
        item["meta"]["npSchema"]
        for folder in folders
        for subFolder in gc.listFolder(folder["_id"])
        for item in gc.getResource(urlExtension.replace("*", subFolder["_id"]))
        if item["meta"].get("npSchema") is not None
    ]

    allVals = {}

    # iterating over all npSchemas in itemSet
    for item in itemSet:
        # iterating over key: value pairs in each npSchema
        for (key, val) in item.items():
            # aggregating all possible values for a given key, from the provided data set
            if allVals.get(key) is None:
                allVals[key] = [val]
            elif val not in allVals[key]:
                allVals[key].append(val)

    # determining the number of None values to append to make it possible to convert this to a dataframe
    lens = [len(val) for val in allVals.values()]
    lens = [max(lens) - length for length in lens]

    # for pandas to make df from dict, columns must be of equal length, so adding "val" number of Nones
    for key, val in zip(allVals.keys(), lens):
        if val:
            allVals[key].extend([None] * val)

    # making data frame of all values observed
    df = pd.DataFrame.from_dict(allVals)

    # creating a column of stainIDs which have been made lowercase while retaining originals in stainID column
    df["lowerStainID"] = df["stainID"].str.lower()

    # TODO: replace these values with the correct capitalizations or provide mapping for that
    stainList = ["ptdp", "he", "abeta", "ubiq", "tau", "biels", "syn", "p62", "lfb"]
    # stainList = ["pTDP", "HE", "aBeta", "Ubiq", "Tau", "Biels", "Syn", "p62", "LFB"]

    # below filter says: True if the lowercase stainID isn't in the stainList and it is not None
    filt = (~df["lowerStainID"].isin(stainList)) & (df["lowerStainID"].notna())
    mappable = df.loc[filt, "stainID"].unique().tolist()

    mappable = {key: val for key in mappable for val in stainList if val in key.lower()}
    df["stainID"].replace(mappable, inplace=True)

    # dropping temp columns
    df.drop(columns=["lowerStainID"], inplace=True)

    # outputting value count for each column -- summarizes all values in a column
    for col in df.columns:
        counted = df[col].value_counts()
        counted.name = "Count"
        counted.index.name = col

        if outputRecords:
            counted.to_csv(f"./{col}_vals_counted.csv")
        else:
            print(counted.head(counted.shape[0]))

    df["stainID"] = df["stainID"].drop_duplicates()

    if outputRecords:
        df.to_csv("./all_vals.csv", index=False)
    else:
        print(df.head(df.shape[0]))


print(populateMetadataFromFileName(folderID, parentType, updateGirder=True))
