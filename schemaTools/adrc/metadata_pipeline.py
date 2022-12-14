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

# this is the folderID of the ADRC Collection
folderID, parentType = "638e2da11f75016b81fda12f", "collection"

# .ProjectMetadata collection seems to have a copy of the json schema as its metadata
# perhaps in the future we just pull that and load it as the schema, so that we don't need it locally
schemaPath = "adrcNpSchema.json"

yearsToScan = ["2020"]

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

stainList = ["pTDP", "HE", "aBeta", "Ubiq", "Tau", "Biels", "Syn", "p62", "LFB"]

# accepts only a single collectionID at a time
def getCollectionContents(collectionID, parentType="collection", contentIDsOnly=True):
    """Returns either all metadata for folders in the specified collection, or just the IDs thereof"""
    contents = [
        (item if not contentIDsOnly else item["_id"])
        for item in gc.listFolder(collectionID, parentFolderType=parentType)
    ]
    return contents


# may take either a single folderID or an iterable thereof
def getFolderContents(folderID):
    """Returns details of all items in the specified folder(s)"""
    urlExtension = "resource/*/items?type=folder"

    if isinstance(folderID, str):
        folderID = [folderID]

    contents = [item for ID in folderID for item in gc.listResource(urlExtension.replace("*", ID))]
    return contents


def populateMetadata(collectionID=None, folderID=None, outputFailed=False):
    """Accepts a single collectionID or folderID(s)"""

    fileTypes = ["svs", "ndpi"]

    if collectionID is not None:
        folderID = getCollectionContents(collectionID)

    itemsToEvaluate = getFolderContents(folderID)
    itemsToEvaluate = {
        item["_id"]: {"name": item["name"], "meta": item.get("meta")}
        for item in itemsToEvaluate
        if any([item["name"].endswith(val) for val in fileTypes])
    }

    updateDict, failedDict = extractMetadataFromFileName(itemsToEvaluate)

    if outputFailed:
        print(failedDict)

    updateMetadata(updateDict)


adrcNamePattern = re.compile("(?P<caseID>E*A*\d+-\d+)_(?P<blockID>A*\d+).(?P<stainID>.*)\.[svs|ndpi]")


def extractMetadataFromFileName(slideData, matchPattern=adrcNamePattern):

    updateDict = {}
    failedDict = {}

    for ID, data in slideData.items():

        # Means I can add some metadata if I can find any... we haven't set anything yet
        slideName = data["name"]
        metadata = matchPattern.search(slideName)

        if metadata:
            metadata = metadata.groupdict()
            cleanedNPData = cleanInitialMetadata(metadata, debug=False)
            validatedNPData = validateMetadata(cleanedNPData)

            currentNpSchema = data["meta"].get("npSchema")

            if currentNpSchema != validatedNPData:
                updateDict[ID] = {"npSchema": validatedNPData}

        # NOTE: why a completely different process for control? we should aim to generalize if possible
        elif "CON" in slideName.upper():
            #  Probably a control slide!!
            stainInString = [val for val in stainList if val.lower() in slideName.lower()]
            stain = stainInString[0] if stainInString else "No Stain Identified"

            updateData = {"npSchema": {"controlSlide": "Yes", "stainID": stain}}
            updateDict[ID] = updateData

        else:
            failedDict[ID] = data

    return updateDict, failedDict


def cleanInitialMetadata(npMeta, debug=False, outputFailed=False):
    # This expects a dictionary of metadata for a case.. it should consist of
    # blockID, stainID, caseID and controlSlide
    # First version should just check and see if the stainID is a valid name...
    if debug:
        print(npMeta)

    unknownStainTags, noBrainMap, brainMapNoBlockMap = [], set(), {}

    stain = npMeta.get("stainID")

    if stain is not None:

        stainLookUp = stainAliasDict.get(stain)

        if stainLookUp is not None:
            npMeta["stainID"] = stainLookUp

        else:
            stainInString = [val for val in stainList if val.lower() in stain.lower()]

            if stainInString:
                npMeta["stainID"] = stainInString[0]
            else:
                unknownStainTags.append(stain)

    #  I have standardized everything to use an E not an A
    caseID = npMeta["caseID"].replace("A", "E")
    blockID = npMeta["blockID"]

    brm = brain_region_maps.MAP.get(caseID)

    if brm is not None:

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

    if outputFailed:
        print(
            f"Unknown Stain Tags: {unknownStainTags}\n\nNo Brain Map: {noBrainMap}\n\nBrain Map Without Block Map: {brainMapNoBlockMap}"
        )

    return npMeta


def updateMetadata(data):
    for key, val in data.items():
        print(f"Updating {key} with: {val}")
        gc.addMetadataToItem(key, val)


def validateMetadata(metadata):

    isValid = validateNPJson(metadata)

    if not isValid[0]:

        errorDict = isValid[1]
        message, problemVal, instance = (
            errorDict["message"],
            errorDict["path"][-1],
            errorDict["instance"],
        )

        if "not a Valid Value" not in instance:
            instance = f"{instance} is not a Valid Value for this Field"

        metadata["npSchema"][problemVal] = instance
        metadata["npWorking"][problemVal] = message

    return metadata


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


# def auditMetadata(folderID, parentType, outputRecords=False):
#     """Used to generate summaries of existing values in metadata in order to remediate persistent errors"""

#     # building a list of all folders in the specified folder/collection
#     folders = [folder for folder in gc.listFolder(folderID, parentFolderType=parentType)]

#     #  mapping of select items seen returned from girder_client api calls

#     #  _id: internal mongo id
#     #  _modelType: object type (folder, item, or collection -- also annotations but not so relevant)
#     #  baseParentId: collection the item is in
#     #  baseParentType: parent object type (folder, item, or collection -- also annotations but not so relevant)
#     #  created: date created
#     #  creatorId: id of individual who created the item
#     #  description: description of the item
#     #  meta: dictionary of meta data pertaining to item
#     #  name: item name (may be a year, patient id, or other folder/file names)
#     #  parentCollection: *unclear, but told to ignore*
#     #  parentId: id of parent collection
#     #  public: whether item is public or not
#     #  size: size in bytes (or other unit) -- folders show as 0
#     #  updated: datetime of last update

#     urlExtension = "resource/*/items?type=folder&limit=1000"

#     # getting npSchema for all items with npSchema in all subfolders for all folders in folders
#     # notice how urlExtension is just the extension required to perform the intended action
#     # presumably, it is being used with the apiUrl already provided above
#     itemSet = [
#         item["meta"]["npSchema"]
#         for folder in folders
#         for subFolder in gc.listFolder(folder["_id"])
#         for item in gc.getResource(urlExtension.replace("*", subFolder["_id"]))
#         if item["meta"].get("npSchema") is not None
#     ]

#     allVals = {}

#     # iterating over all npSchemas in itemSet
#     for item in itemSet:
#         # iterating over key: value pairs in each npSchema
#         for (key, val) in item.items():
#             # aggregating all possible values for a given key, from the provided data set
#             if allVals.get(key) is None:
#                 allVals[key] = [val]
#             elif val not in allVals[key]:
#                 allVals[key].append(val)

#     # determining the number of None values to append to make it possible to convert this to a dataframe
#     lens = [len(val) for val in allVals.values()]
#     lens = [max(lens) - length for length in lens]

#     # for pandas to make df from dict, columns must be of equal length, so adding "val" number of Nones
#     for key, val in zip(allVals.keys(), lens):
#         if val:
#             allVals[key].extend([None] * val)

#     # making data frame of all values observed
#     df = pd.DataFrame.from_dict(allVals)

#     # creating a column of stainIDs which have been made lowercase while retaining originals in stainID column
#     df["lowerStainID"] = df["stainID"].str.lower()

#     # TODO: replace these values with the correct capitalizations or provide mapping for that
#     stainList = ["ptdp", "he", "abeta", "ubiq", "tau", "biels", "syn", "p62", "lfb"]
#     # stainList = ["pTDP", "HE", "aBeta", "Ubiq", "Tau", "Biels", "Syn", "p62", "LFB"]

#     # below filter says: True if the lowercase stainID isn't in the stainList and it is not None
#     filt = (~df["lowerStainID"].isin(stainList)) & (df["lowerStainID"].notna())
#     mappable = df.loc[filt, "stainID"].unique().tolist()

#     mappable = {key: val for key in mappable for val in stainList if val in key.lower()}
#     df["stainID"].replace(mappable, inplace=True)

#     # dropping temp columns
#     df.drop(columns=["lowerStainID"], inplace=True)

#     # outputting value count for each column -- summarizes all values in a column
#     for col in df.columns:
#         counted = df[col].value_counts()
#         counted.name = "Count"
#         counted.index.name = col

#         if outputRecords:
#             counted.to_csv(f"./{col}_vals_counted.csv")
#         else:
#             print(counted.head(counted.shape[0]))

#     df["stainID"] = df["stainID"].drop_duplicates()

#     if outputRecords:
#         df.to_csv("./all_vals.csv", index=False)
#     else:
#         print(df.head(df.shape[0]))
