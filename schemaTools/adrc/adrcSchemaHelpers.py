import re
import brain_region_maps

## Go through each year... note I am adding code to ignore folders that are not numeric
unknownStainTags = [] ### I am making this global so I can access it whenever..
unmatchedFileNames = []

def evaluateNPSchema( npMeta,debug=False):
    ### This expects a dictionary of metadata for a case.. it should consist of
    ## blockID, stainID, caseID and controlSlide
    ## First version should just check and see if the stainID is a valid name...
    if debug:
        print(npMeta)
    stainAliasDict =     { 'PTDP':'pTDP', 'ptdp':'pTDP', 'pTDP':'pTDP','pTDP (2)':'pTDP','ptdp-001':'ptdp','ptdp-002':'ptdp','ptdp-003':'ptdp',
                          'HE':'HE','H&E':'HE','HE (2)':'HE',
                          'AB':'aBeta','ABETA':'aBeta','Ab':'aBeta','aBeta':'aBeta',
                          'ubiq':'Ubiq','UBIQ':'Ubiq','Ubiq':'Ubiq',
                          'TAU':'Tau','Tau':'Tau','tau':'Tau','tau (2)':'tau','TAU (2)':'Tau','TAU-001':'Tau',
                          'BIELS':'Biels','biels':'Biels','Biels':'Biels','Biels (2)': 'Biels','Biels (3)': 'Biels',
                          'SYN':'Syn','Syn':'Syn','syn':'Syn',
                         'p62':'p62','P62':'p62',
                          'LFB-PAS':'LFB', 'LFB':'LFB','LFB PAS':'LFB'
                         }
    if 'stainID' in npMeta:
        stain = npMeta['stainID']
        if stain not in stainAliasDict:
            unknownStainTags.append(stain)
        else:
            npMeta['stainID'] = stainAliasDict[stain]   

    caseID = npMeta['caseID'].replace("A","E")  ## I have standardized everything to use an E not an A
    blockID = npMeta['blockID']

    if caseID in brain_region_maps.MAP:
        brm = brain_region_maps.MAP[caseID]
        npMeta['regionName'] = brm.get(blockID,"Not Mapped")

    return npMeta

def getADRCcollection( gc,rootCollectionName='Emory_ADRC',debug=False,pullSlideList=False):
    ## Given the collection name, pull all the items
    npSlideDict = {}

    ## Get the ID for the ADRC Collection
    rawColList = gc.get('collection?text=%s' % rootCollectionName)
    adrcCollection = [x for x in rawColList if x['name']==rootCollectionName][0]

    for yr in gc.listFolder(adrcCollection['_id'],parentFolderType='collection'):
        year = yr['name']
        if not year.isnumeric():
            continue
        else:
            if debug: print(year)
        for subj in gc.listFolder(yr['_id']):
            ### To do.. generate number of slides under each subject
            #### And in the future also validate the metadata!!
            subjItemSet = gc.listResource('resource/%s/items?type=folder' % subj['_id'])
            if pullSlideList:
                slideList = [x for x in subjItemSet if ('svs' in x['name'] or 'ndpi' in  x['name'])]
            else:
                slideList = []
            
            if debug: print("\t%s\t%s" % (subj['name'],len(slideList)))
            npSlideDict["%s_%s" % (year,subj['name'])] = {'slideList': slideList, 'rootFolderInfo': subj}
            
    return npSlideDict





    ## Will shim to the preferred alias
stainAliasDict = { 'PTDP':'pTDP', 'HE':'HE','AB':'aBeta','AB':'AB','ptdp':'pTDP','ubiq':'Ubiq','H&E':'HE' }

## For control slides I make the region Control  and also set the controlSlide Flag... not sure what to do about the
## slideName..
def validateSlide( slideInfo, patientId,debug=False):
    ## This will be a cleanup function that either validates data is meta.npSc,hema is available
    ## or tries to populate it from the existing and likely dirty metadata from either parsing the slide name
    ## or if meta.region or meta.stain are already populated..
    meta = slideInfo['meta']
    
    ## Will clean up the region and remove the a's
    ## Remove the A's if it happens to have been encoded in the region but only if it's not a 1A.. HMM
    
    if 'npSchema' in meta:
        pass
    else:
        ### First try and validate the region
        if 'region' in meta:
            blockID = meta['region']
            if blockID.startswith('A'):
                blockID = blockID.replace("A","")
            if debug: print(blockID)

            if 'subject' in meta:
                subject = meta['subject']
            else:
                subject = 'Unknown'

            if 'stain' in meta:
                stain = meta['stain']
            else:
                stain = 'Unknown'

            return ({'region':meta['region'],'blockID':blockID, 'subject':subject,'stain':stain, 'filename':slideInfo['name']})
        else:
            return ({'filename':slideInfo['name']})
            
#             print(meta['region'],meta['subject'])
#origPattern '(?P<caseID>.*)_(?P<blockID>\d+).(?P<stainID>.*)\.[svs|ndpi]'
#(?P<caseID>.*)_(?P<blockID>\w+).(?P<stainID>.*)\.[svs|ndpi]'    )
#    (?#P<caseID>.*?)_(?P<blockID>\w+).(?P<stainID>.*)\.[svs|ndpi]'

adrcNamePattern = re.compile('(?P<caseID>E*A*\d+-\d+)_(?P<blockID>A*\d+).(?P<stainID>.*)\.[svs|ndpi]')    
    

def scanMetadata(gc,fldrInfo,updateGirder=False,rescanNpSchema=True,debug=False):
    ### Given a folderID, this will pull all of the slides under it recursively
    
    ### This will push things to the npSchema key...
    slidesProcessed = 0
    slidesToUpdate = 0
    slidesUpdated = 0
    subjItemSet = gc.listResource('resource/%s/items?type=folder' % fldrInfo['_id'])
    slideList = [x for x in subjItemSet if ('svs' in x['name'] or 'ndpi' in  x['name'])]

    for s in slideList:
        ### See if there's any metadata .. anywhere
        slidesProcessed+=1
        if rescanNpSchema:
            ### MEans I can add some metadata if I can find any... we haven't set anything yet
            slideName = s['name']
            m=  adrcNamePattern.search(slideName)
            if m:
                validatedNPData = evaluateNPSchema(m.groupdict(),debug=False)
                try:
                    currentNpSchema = s['meta']['npSchema']
                except KeyError:
                    currentNpSchema = {}

                if currentNpSchema != validatedNPData:
                    slidesToUpdate +=1
                    if updateGirder:
                        gc.addMetadataToItem(s['_id'],{'npSchema':validatedNPData})
                        slidesUpdated+=1  

            elif 'CON' in slideName.upper():
                ###  Probably a control slide!!
                if updateGirder:
                    gc.addMetadataToItem(s['_id'],{'npSchema':{'controlSlide':'Yes'}})
            else:
                unmatchedFileNames.append(s['name'])
                #print("This slidename failed to match and is not a control",s['name'])
    return {'Processed':slidesProcessed, 'girderUpdates': slidesUpdated, 'slidesToUpdate':slidesToUpdate}, unmatchedFileNames