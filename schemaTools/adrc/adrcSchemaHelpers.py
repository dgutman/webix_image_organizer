

## Go through each year... note I am adding code to ignore folders that are not numeric

def getADRCcollection( gc):
    npSlideDict = {}

    for yr in gc.listFolder(adrcCollection['_id'],parentFolderType='collection'):
        year = yr['name']
        if not year.isnumeric():
            continue
        else:
            print(year)
        for subj in gc.listFolder(yr['_id']):
            ### To do.. generate number of slides under each subject
            #### And in the future also validate the metadata!!
            subjItemSet = gc.listResource('resource/%s/items?type=folder' % subj['_id'])
            slideList = [x for x in subjItemSet if (x['name'].endswith('.ndpi') or x['name'].endswith('svs'))]
            
            print("\t%s\t%s" % (subj['name'],len(slideList)))
            npSlideDict["%s_%s" % (year,subj['name'])] = slideList
    return npSlideDict