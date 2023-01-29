import re
import json

# jsonSchema docs are here: https://python-jsonschema.readthedocs.io/en/stable/
import jsonschema

# girder_client docs are here: https://girder.readthedocs.io/en/stable/python-client.html#the-python-client-library
import girder_client
import brain_region_maps
import pandas as pd

import time

# from functools import cache

# TODO: add record of all seen collectionIDs and fileIDs so as to reduce number of things examined
# ideally hash their content, etc. to make 1: 1 validation faster, etc.

# TODO: add TQDM where relevant

# TODO: add "staticMetadata" tag or something similar which indicates a file has had metadata validated and shouldn't be altered


stainAliasDict = {
    "PTDP": "pTDP",
    "ptdp": "pTDP",
    # "pTDP": "pTDP",
    "pTDP (2)": "pTDP",
    "_pTDP": "pTDP",
    "ptdp-001": "pTDP",
    "ptdp-002": "pTDP",
    "ptdp-003": "pTDP",
    # "HE": "HE",
    "H&E": "HE",
    "H&E_v1": "HE",
    "_H&E": "HE",
    "H&E-001": "HE",
    "H&E-002": "HE",
    "HE (2)": "HE",
    "US_AB": "aBeta",
    "US-AB": "aBeta",
    "us-ab": "aBeta",
    "_AB": "aBeta",
    "_Ab": "aBeta",
    "_AB-001": "aBeta",
    "AB-001": "aBeta",
    "AB": "aBeta",
    "ABETA": "aBeta",
    "Ab": "aBeta",
    "ab": "aBeta",
    "AB (2)": "aBeta",
    # "aBeta": "aBeta",
    "ubiq": "Ubiq",
    "Ubig": "Ubiq",
    "UBIQ": "Ubiq",
    # "Ubiq": "Ubiq",
    "TAU": "Tau",
    # "Tau": "Tau",
    "tau": "Tau",
    "tau (2)": "Tau",
    "TAU (2)": "Tau",
    "TAU-001": "Tau",
    "BIEL": "Biels",
    "_BIEL": "Biels",
    "_Biel": "Biels",
    "US_Biel": "Biels",
    "BIELS": "Biels",
    "Biel": "Biels",
    "biels": "Biels",
    # "Biels": "Biels",
    "Biels (2)": "Biels",
    "Biels (3)": "Biels",
    "SYN": "Syn",
    # "Syn": "Syn",
    "syn": "Syn",
    # "p62": "p62",
    "P62": "p62",
    "LFB-PAS": "LFB",
    # "LFB": "LFB",
    "LFB PAS": "LFB",
    "RBFUS": "FUS",
    "TDP": "TDP-43",
    "_TDP43": "TDP-43",
    "US-TDP": "TDP-43",
    "_TDP43_ProtTech": "TDP-43",
}

# NOTE: If you alter the below, be sure to update the schema to match!
stainList = ["pTDP", "HE", "aBeta", "Ubiq", "Tau", "Biels", "Syn", "p62", "LFB", "FUS", "TDP-43", "GFAP"]

patternList = [
    "(?P<caseID>E*A*\d+-\d+)_(?P<blockID>A*\d+).(?P<stainID>.*)\.[svs|ndpi]",
    "(?P<caseID>E*A*\d+-\d+)_(?P<stainID>.*)_(?P<blockID>\d+)\.[svs|ndpi]",
    "(?P<caseID>E*A*\d+-\d+)_(?P<stainID>.*)_(?P<blockID>\d+\w)\.[svs|ndpi]",
]
adrcNamePatterns = [re.compile(pattern) for pattern in patternList]


def blankMetadata(gc, collectionID=None, folderID=None):
    """Completely removes metadata; Accepts a single collectionID or folderID(s)"""

    fileTypes = ["svs", "ndpi"]

    if collectionID is not None:
        folderID = getCollectionContents(collectionID)

    itemsToEvaluate = getFolderContents(folderID)

    itemsToEvaluate = {
        item["_id"]: {"npSchema": None, "npWorking": None}
        for item in itemsToEvaluate
        if any([item["name"].endswith(val) for val in fileTypes]) and item["meta"]
    }

    updateMetadata(gc, itemsToEvaluate)


# entry point/main function to call when populating metadata from file name
def populateMetadata(gc, collectionID=None, folderID=None, outputFailed=False):
    """Accepts a single collectionID or folderID(s)"""

    fileTypes = ["svs", "ndpi"]

    if collectionID is not None:
        folderID = getCollectionContents(gc, collectionID)

    itemsToEvaluate = getFolderContents(gc, folderID)
    itemsToEvaluate = {
        item["_id"]: {"name": item["name"], "meta": item.get("meta")}
        for item in itemsToEvaluate
        if any([item["name"].endswith(val) for val in fileTypes])
    }

    updateDict, failedDict = extractMetadataFromFileName(itemsToEvaluate)

    updateMetadata(gc, updateDict)

    if outputFailed:
        return failedDict


# accepts only a single collectionID at a time
# @cache
def getCollectionContents(gc, collectionID, parentType="collection", contentIDsOnly=True):
    """Returns either all metadata for folders in the specified collection, or just the IDs thereof"""

    folderList = gc.listFolder(collectionID, parentFolderType=parentType)
    contents = ((item if not contentIDsOnly else item["_id"]) for item in folderList)

    return contents


# may take either a single folderID or an iterable thereof
# @cache
def getFolderContents(gc, folderID):
    """Returns details of all items in the specified folder(s)"""

    urlExtension = "resource/*/items?type=folder"

    if isinstance(folderID, str):
        folderID = [folderID]

    contents = [item for ID in folderID for item in gc.listResource(urlExtension.replace("*", ID))]

    return contents


def updateMetadata(gc, data):
    dataLen = len(data)
    for count, (key, val) in enumerate(data.items(), 1):
        print(f"Updating {key} ({count} of {dataLen}) with: {val}")
        gc.addMetadataToItem(key, val)


def extractMetadataFromFileName(slideData, matchPatterns=adrcNamePatterns, referenceDoc=None):

    updateDict = {}
    failedDict = {}

    for ID, data in slideData.items():

        slideName = data["name"]
        metadata = False

        for matchPattern in matchPatterns:
            metadata = matchPattern.search(slideName)

            if metadata:
                break

        currentNpSchema = data["meta"]

        if metadata:
            metadata = metadata.groupdict()
            cleanedNPData = cleanInitialMetadata(metadata, debug=False)
            _, validatedNPData = validateMetadata(cleanedNPData)

            if currentNpSchema != validatedNPData:

                if validatedNPData.get("npWorking") is None:
                    validatedNPData["npWorking"] = None

                updateDict[ID] = validatedNPData

        # branch for case where there is an external document provided to pull metadata from instead
        # not certain if this is the level it should be referenced, or if it should supplement the
        # if metadata branch, since caseID, which is extracted from file name,
        # will likely be required to reference entries, at least in the provided document
        elif referenceDoc is not None:
            pass

        # NOTE: why a completely different process for control? we should aim to generalize if possible
        elif "CON" in slideName.upper():
            #  Probably a control slide!!
            stainInString = [val for val in stainList if val.lower() in slideName.lower()]
            updateData = {"npSchema": {"controlSlide": "Yes"}}

            if stainInString:
                updateData["npSchema"]["stainID"] = stainInString[0]

            if currentNpSchema != updateData:
                updateDict[ID] = updateData

        else:
            updateData = {"npWorking": {"Metadata Error": f"File name {slideName} failed to parse"}}

            if currentNpSchema != updateData:
                updateDict[ID] = updateData

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
            # npMeta["regionName"] = "Not Mapped"

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

    return {"npSchema": npMeta}


def validateMetadata(metadata):

    isValid = validateNPJson("./adrcNpSchema.json", metadata)

    if not isValid[0]:
        errorDict = isValid[1]
        problemVal = errorDict["path"][-1]
        message, instance = (
            errorDict["message"],
            errorDict["instance"],
        )

        if "not a Valid Value" in instance:
            instance = " ".join(instance.split(" ")[:-8])

        metadata["npSchema"][problemVal] = instance
        metadata["npWorking"] = {problemVal: message}

        return False, metadata

    return True, metadata


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


def auditMetadata(gc, collectionID=None, folderID=None, outputRecords=False):
    """Used to generate summaries of existing values in metadata in order to remediate persistent errors"""

    fileTypes = ["svs", "ndpi"]

    if collectionID is not None:
        folderID = getCollectionContents(gc, collectionID)

    itemsToEvaluate = getFolderContents(gc, folderID)

    itemsToEvaluate = [item for item in itemsToEvaluate if any([item["name"].endswith(val) for val in fileTypes])]
    blankMetadata = [item["name"] for item in itemsToEvaluate if item["meta"].get("npSchema") is None]

    itemsToEvaluate = [
        item["meta"]["npSchema"]
        for item in itemsToEvaluate
        if (item["name"] not in blankMetadata) and (item["meta"].get("npWorking") is not None)
    ]

    allVals = {"blankMetadata": blankMetadata}

    # iterating over all npSchemas in itemSet
    for item in itemsToEvaluate:
        # iterating over key: value pairs in each npSchema
        for (key, val) in item.items():
            # aggregating all possible values for a given key, from the provided data set
            if "not a Valid Value" in val:
                val = " ".join(val.split(" ")[:-8])

            if allVals.get(key) is None:
                allVals[key] = [val]
            else:
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

    # outputting value count for each column -- summarizes all values in a column
    for col in df.columns:
        counted = df[col].value_counts()
        counted.name = "Count"
        counted.index.name = col

        if outputRecords:
            counted.to_csv(f"{col}_vals_counted.csv")
        else:
            print(counted.head(counted.shape[0]))

    df["stainID"] = df["stainID"].drop_duplicates()

    if outputRecords:
        df.to_csv("all_vals.csv", index=False)
    else:
        print(df.head(df.shape[0]))


def getSummaryStats(gc, collectionID=None, folderID=None):

    if collectionID is not None:
        folders = getCollectionContents(gc, collectionID, parentType="collection", contentIDsOnly=False)
        folders = [folder for folder in folders if folder["name"].isdigit()]

    # if isinstance(folderID, str):
    #     folderID = [val["_id"] for val in folderID]
    #     folderName = [val["name"] for val in folderID]

    valid = 0
    invalid = 0
    toReview = []
    control = 0

    for folder in folders:
        folderContents = gc.listFolder(folder["_id"])
        year = folder["name"]

        for contents in folderContents:

            name = contents["name"]
            files = getFolderContents(gc, contents["_id"])

            for file in files:

                fileName = file["name"]
                fileTypes = ["svs", "ndpi"]

                if any([fileName.endswith(val) for val in fileTypes]):

                    if "npWorking" in file["meta"] or "npSchema" not in file["meta"]:
                        invalid += 1
                        file["state"] = "invalid"
                        file["year"], file["folder_name"] = year, name
                        toReview.append(file)

                    elif "controlSlide" in file["meta"]["npSchema"]:
                        control += 1
                        file["state"] = "control"
                        file["year"], file["folder_name"] = year, name
                        toReview.append(file)

                    else:
                        isValid, data = validateMetadata(file["meta"])

                        if isValid:
                            valid += 1
                            file["state"] = "valid"
                            file["year"], file["folder_name"] = year, name
                            toReview.append(file)

                        else:
                            invalid += 1
                            data["state"] = "invalid"
                            data["year"], data["folder_name"] = year, name

                            toReview.append(data)

    df = pd.DataFrame(toReview)
    df = df[["_id", "baseParentId", "baseParentType", "year", "folderId", "folder_name", "lowerName", "state", "meta"]]
    df.to_csv("summaryStats.csv", index=False)

    folders = pd.DataFrame(df.value_counts(subset=["folder_name", "year", "state"]))
    folders.reset_index(inplace=True)
    print(folders.head())

    stateList = ["valid", "invalid", "control"]

    folders[stateList] = None
    folders["uid"] = folders["folder_name"] + folders["year"]

    folders.rename(columns={0: "count"}, inplace=True)

    uids = folders["uid"].unique().tolist()

    for uid in uids:
        baseFilt = folders["uid"] == uid

        for state in stateList:
            filt = baseFilt & (folders["state"] == state)
            if filt.any():
                folders.loc[baseFilt, state] = folders.loc[filt, "count"].item()

    folders.drop_duplicates(subset=(stateList + ["uid"]), inplace=True)
    folders.drop(columns=["state", "count", "uid"], inplace=True)
    folders.to_csv("stateCounts.csv", index=False)

    print(f"Valid Count {valid}\n\nInvalid Count: {invalid}\n\nControl Count: {control}")


if __name__ == "__main__":
    server = "candygram"
    apiUrl = f"http://{server}.neurology.emory.edu:8080/api/v1"

    # initializing connection with server via girder_client
    gc = girder_client.GirderClient(apiUrl=apiUrl)

    # authenticating connection to server
    gc.authenticate(interactive=True)

    # this is the folderID of the ADRC Collection
    folderID, parentType = "638e2da11f75016b81fda12f", "collection"

    # NOTE: .ProjectMetadata collection seems to have a copy of the json schema as its metadata
    # perhaps in the future we just pull that and load it as the schema, so that we don't need it locally
    schemaPath = "adrcNpSchema.json"
# blankMetadata(collectionID=folderID)
# populateMetadata(collectionID=folderID)
# auditMetadata(collectionID=folderID, outputRecords=True)


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
