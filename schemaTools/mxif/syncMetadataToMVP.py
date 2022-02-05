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

with open("./testData/image-rel1-metadata-20210426-153033.json", "r") as fp:
	htanMeta = json.load(fp)


htanMetaToFile = {os.path.basename(m['Bucket_url']): m for m in htanMeta}


def createDefaultThumbUrl(itemInfo):
	# This will use a heuristic to set a spiffy thumbnail url for a mltichannel image

	simpleThumb = {'bands': [
		{'frame': 0, 'palette': ['#000000', '#0000ff'], 'min': 100, 'max': 5000},
		{'frame': 1, 'palette': ['#000000', '#00ff00'], 'max': 5000},
		{'frame': 2, 'palette': ['#000000', '#ff0000'], 'max': 5000}]}
	return simpleThumb


def createLargeImage(gc, itemId, force=True):
	# Hit the endpoint to create a largeImage, this defaults
	# To using the force option to transcode images
	# https://imaging.htan.dev/girder/api/v1/item/604ffde157d3801bcf839f97/tiles?force=true&notify=true&tileSize=256&quality=90
	gc.post("item/%s/tiles?force=%s" % (itemId, force))


needsLargeImage = 0
createLargeImages = False
addedMeta = 0
# I may not want to try and generate largeImages for every file
# and/or I may want to add additional logic to detect failed files


def formatChannelData(internal_metadata):
	# Reformmating internal channel metadata for the omeSceneDescription tag
	# that the DSA uses for rendering scenes
	if 'frames' in internal_metadata or 'channelmap' in internal_metadata:
		imgChannelList = []

		for f in internal_metadata['frames']:
			if 'Name' in f:
				name = f['Name']
			else:
				name = f['Frame']

			fd = {'channel_name': f['Frame'],
					'channel_number': f['Frame'],
				   'label': name,
					'marker_name': name}
			imgChannelList.append(fd)

		return imgChannelList
	return None


problemItems = []
itemData = []


for i in tqdm.tqdm(itemSet):
	itemData.append(i)
	if 'largeImage' not in i:
		needsLargeImage += 1
		if createLargeImages: createLargeImage(gc, i['_id'])
	else:
		if 'htanMeta' not in i['meta']:
			if i['name'] in htanMetaToFile:
				if updateMetadata: gc.addMetadataToItem(i['_id'], {'htanMeta': htanMetaToFile[i['name']]})
				addedMeta += 1
		if 'ioparams' not in i['meta']:
			gc.addMetadataToItem(i['_id'], {'ioparams': {"Place": "Holder"}})

			print("Analyizing %s %s" % (i['name'], i['_id']))
			ioparams = {}
			tileMetadata = gc.get("item/%s/tiles" % i['_id'])
#			print(tileMetadata)
			if 'frames' not in tileMetadata:
				ioparams['frameCount'] = 0
			else:
				ioparams['frameCount'] = len(tileMetadata['frames'])

			if 'channelmap' in tileMetadata:
				ioparams['channelmap'] = tileMetadata['channelmap']

#			print("Now trying to get the histogram... for ",i['name'],i['_id'])
			hist = gc.get("item/%s/tiles/histogram?frame=0" % i['_id'])[0]
#			print("hist returned")

			ioparams['min'] = hist['min']
			ioparams['max'] = hist['max']
			ioparams['range'] = hist['range']
			ioparams['hist'] = hist
			if updateMetadata: gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})

		else:
			# So we have an ioparams let's check the default thumburl?
			# print("Found ioparams...")
			ioparams = i['meta']['ioparams']
			# print(ioparams['max'],ioparams['frameCount'])
			if ('frameCount' in ioparams and ioparams['frameCount'] > 3):

#			if(ioparams['frameCount']>3):
				# print("Multichannel...")
				thumbSettings = createDefaultThumbUrl(ioparams)
				thumbnailString = urllib.parse.quote_plus(json.dumps(thumbSettings))

				ioparams['thumbnailUrl'] = thumbnailString
				# print(ioparams['thumbnailUrl'])
				if updateMetadata: gc.addMetadataToItem(i['_id'], {'ioparams': ioparams})

		if 'omeSceneDescription' not in i['meta']:

			try:
				tileMetadata = gc.get("item/%s/tiles" % i['_id'])
				md = formatChannelData(tileMetadata)
				if md:
					print("Got some frame data!")
					if updateMetadata: gc.addMetadataToItem(i['_id'], {'omeSceneDescription': md})
			except:
				problemItems.append(i)
				print("Could not load metadata for %s" % i['_id'])
				# Clearing largeimage and regenerating
				# gc.delete("item/%s/tiles" % i['_id'])
				# time.sleep(0.5)
				# gc.post("item/%s/tiles" % i['_id'])

		# print(tileMetadata)
#			break

print("Creating large image for %d images and added metadata to %d images" %
      (needsLargeImage, addedMeta))


dsaRootUrl = "https://imaging.htan.dev/girder/api/v1/"


dsaCrossWalk = {x['meta']['htanMeta']['SynapseID']: {'dsaId': x['_id'],
		'dsaSmallThumbUrl': dsaRootUrl + "item/" + x['_id'] + "/tiles/thumbnail"} for x in itemData}

with open("mvpImageData.working.json", "w") as fp:
	json.dump(dsaCrossWalk, fp)

## Pushing over the thumbnail data as an array
with open("mvpImageData.thumbnail.json", "w") as fp:
	json.dump(itemData, fp)



