import pymongo, bson, json
from bson.objectid import ObjectId

con = pymongo.MongoClient("localhost:27017")

taggerdb = con.taggerdb

taskList = taggerdb.tasks.find()

## TO DO.. add a parameter to figure out which tasks I want to export

taskOutput = {}

for t in taskList:
    print(t['name'],len(t['imageIds']))

    imagesForTask = taggerdb.images.find({"taskId":ObjectId(t['_id'])})
    imageCount = 0
    taskOutput[t['name']]= []
    for i in imagesForTask:
        if i['isReviewed']:
            taskOutput[t['name']].append(i)
        imageCount+=1
    print(imageCount)
## Now query the image status for each task..
## fields are name, status, and userId which is a list of names


with open("taggerOutputData.json", "w") as fp:
    json.dump(taskOutput,fp,indent=4,default=str)
