RUN:

`$ docker build -t=yourname .`<br>
`$ docker run -p 5050:5000 yourname`

## I am changing the port since I have some other services running on 5000

Default user/pass:` webix/xbsxbs` <br>
Default api url: `http://dermannotator.org:8080/api/v1`

API: 

1. URL: `/label?ids=id1,id2…` <br>
 Descr: label recognition <br>
  Return: array of statuses and results of ocr <br>
  ` [{id: 'id1', status: 'ok', results: {}, ocrRawText: 'string result'}, {id: 'id2', status: 'error', error: 'error decr.'}]`
2. URL:` /marker?ids=id1,id2` <br>
Descr: detection of markers l <br>
Note: Color of image marker is fixed. For images with same marker but different colors algorithm should be updated by adding colors.
Return: array of statuses and results<br>
`[{id: 'id1', status: 'ok', results: true },{id: 'id2', status: 'error', error: 'error decr.'}]`

3. URL `/sticker?ids=id1,id2..`
Descr: detection of stickers on image<br>
Note: same as in 2.<br>
Return: array of statuses and results<br>
`[{id: 'id1', status: 'ok', results: ['red', 'blue', 'green', 'azure', 'orange', 'violet', 'yellow', 'gray'] },
	 {id: 'id2', status: 'error', error: 'error decr.'}]`
	
	


##https://www.pyimagesearch.com/2018/09/17/opencv-ocr-and-text-recognition-with-tesseract/


###https://cloud.google.com/vision/docs/ocr
