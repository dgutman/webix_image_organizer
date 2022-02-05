# This will sync metadata for the MVP image set for the DSA HTAN image portal
import girder_utils as gu
import girder_client
import secrets as s
import sys
import os
import json
import time
import tqdm
import urllib.parse
# Adding girder_utils path

updateMetadata = False

sys.path.insert(0, "../loadBucketData")

gc = girder_client.GirderClient(apiUrl=s.apiUrl)
gc.authenticate(apiKey=s.dsaApiKey)

MVPCollectionId = '604a39fa8dfee73ac067d126'

# source/%s/items?type=folder" % ("604a544f8dfee73ac067d126"))
itemSet = gu.listChildItems(
    gc, "resource/%s/items?type=collection" % (MVPCollectionId))


def createDefaultThumbUrl(itemInfo):
    # This will use a heuristic to set a spiffy thumbnail url for a mltichannel image

    simpleThumb = {'bands': [
        {'frame': 0, 'palette': ['#000000', '#0000ff'],
            'min': 'auto', 'max': 'auto'},
        {'frame': 1, 'palette': ['#000000', '#00ff00'], 'max': 'auto'},
        {'frame': 2, 'palette': ['#000000', '#ff0000'], 'max': 'auto'}]}
    return simpleThumb


itemData = []

hasThumbnailUrl = 0
hasGroupSets = 0
hasBoth = 0


def createThumbUrlFromDSASceneSet(dsaItem):
    # Given the dsaItem there should be a field in dsaItem.meta.DSAGroupSet ... take the longest one

    print(dsaItem['meta'].keys())
    if 'DSAGroupSet' in dsaItem['meta']:
        DSAGroupSet = dsaItem['meta']['DSAGroupSet']
        print(len(DSAGroupSet))

        styleInfo = {"bands": []}
        
        
        if len(DSAGroupSet) > 0:

            for c in DSAGroupSet[0]['channels']:
                # print(c)
                styleInfo['bands'].append({"min": c['min'],
                                        "max": c['max'],
                                        "palette": ["rgb(0,0,0)", c['color']],
                                        "frame": c["index"]})

        return(styleInfo)
    #     styleInfo.bands.push({
    #       min: c.min,
    #       max: c.max,
    #       palette: ["rgb(0,0,0)", c.color],
    #       frame: c.index,
    #     });
    #   });


for i in tqdm.tqdm(itemSet):
    itemData.append(i)

    hasDefaultThumb = False
    hasCuratedSceneSet = False

    if 'thumbnailUrl' in i['meta']['ioparams']:
        # print(i['meta']['ioparams']['thumbnailUrl'])
        hasThumbnailUrl += 1
        hasDefaultThumb = True
    if 'DSAGroupSet' in i['meta']:
        hasGroupSets += 1
        hasCuratedSceneSet = True
        print(i['name'], i['meta']['htanMeta']['HTAN_Center'],
              i['meta']['htanMeta']['Imaging_Assay_Type'])

        #print(urllib.parse.unquote(i['meta']['ioparams']['thumbnailUrl']))

    ioparams = i['meta']['ioparams']

    if ('frameCount' in ioparams and ioparams['frameCount'] >= 3):
        print(hasDefaultThumb, hasCuratedSceneSet,
              ioparams['frameCount'], i['name'])

        if hasCuratedSceneSet:
            # Going to update the defaultThumbURL because i

            sceneData = createThumbUrlFromDSASceneSet(i)
            thumbnailString = urllib.parse.quote_plus(json.dumps(sceneData))
            #print(thumbnailString)

            ## Only update the metadata if theres a new scene defintion
            if ('thumbnailUrl' not in ioparams) or (ioparams['thumbnailUrl'] != thumbnailString):

                ioparams['thumbnailUrl'] = thumbnailString
                gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})
        else:
        ## Set the default thumb using the other funct
            simpleSceneData = createDefaultThumbUrl(i)
            thumbnailString = urllib.parse.quote_plus(json.dumps(simpleSceneData))
            if ('thumbnailUrl' not in ioparams) or (ioparams['thumbnailUrl'] != thumbnailString):

                ioparams['thumbnailUrl'] = thumbnailString
                gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})
        # break

print(hasThumbnailUrl, "has Group Sets", hasGroupSets)

# Imaging_Assay_Type  HTAN_Center


# 		if 'ioparams' not in i['meta']:
# 			gc.addMetadataToItem(i['_id'], {'ioparams': {"Place": "Holder"}})

# 			print("Analyizing %s %s" % (i['name'], i['_id']))
# 			ioparams = {}
# 			tileMetadata = gc.get("item/%s/tiles" % i['_id'])
# #			print(tileMetadata)
# 			if 'frames' not in tileMetadata:
# 				ioparams['frameCount'] = 0
# 			else:
# 				ioparams['frameCount'] = len(tileMetadata['frames'])

# 			if 'channelmap' in tileMetadata:
# 				ioparams['channelmap'] = tileMetadata['channelmap']

# #			print("Now trying to get the histogram... for ",i['name'],i['_id'])
# 			hist = gc.get("item/%s/tiles/histogram?frame=0" % i['_id'])[0]
# #			print("hist returned")

# 			ioparams['min'] = hist['min']
# 			ioparams['max'] = hist['max']
# 			ioparams['range'] = hist['range']
# 			ioparams['hist'] = hist
# 			if updateMetadata: gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})

# 		else:
# 			# So we have an ioparams let's check the default thumburl?
# 			# print("Found ioparams...")
# 			ioparams = i['meta']['ioparams']
# 			# print(ioparams['max'],ioparams['frameCount'])
# 			if ('frameCount' in ioparams and ioparams['frameCount'] > 3):

# #			if(ioparams['frameCount']>3):
# 				# print("Multichannel...")
# 				thumbSettings = createDefaultThumbUrl(ioparams)
# 				thumbnailString = urllib.parse.quote_plus(json.dumps(thumbSettings))

# 				ioparams['thumbnailUrl'] = thumbnailString
# 				# print(ioparams['thumbnailUrl'])
# 				if updateMetadata: gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})

# 		if 'omeSceneDescription' not in i['meta']:

# 			try:
# 				tileMetadata = gc.get("item/%s/tiles" % i['_id'])
# 				md = formatChannelData(tileMetadata)
# 				if md:
# 					print("Got some frame data!")
# 					if updateMetadata: gc.addMetadataToItem(i['_id'], {'omeSceneDescription': md})
# 			except:
# 				problemItems.append(i)
# 				print("Could not load metadata for %s" % i['_id'])
# Clearing largeimage and regenerating
# gc.delete("item/%s/tiles" % i['_id'])
# time.sleep(0.5)
# gc.post("item/%s/tiles" % i['_id'])

# print(tileMetadata)
#			break

# print("Creating large image for %d images and added metadata to %d images" %
#       (needsLargeImage, addedMeta))


dsaRootUrl = "https://imaging.htan.dev/girder/api/v1/"


# Pushing over the thumbnail data as an array
# with open("mvpImageData.thumbnailV2.json", "w") as fp:
# 	json.dump(itemData, fp)
