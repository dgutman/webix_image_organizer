define([
	"app",
	"constants",
	"libs/socket.io-client/dist/socket.io.min",
	"models/edit_form",
	"helpers/ajax"
], function(
	app,
	constants,
	socketIO,
	Form,
	ajax
) {
	const socketStream = window.ss;
	const socketConnect = socketIO.connect('/backend');

	socketConnect.on('message', function(msg, folderName, collectionName) {
		app.callEvent("uploaderList:loadingActions", [msg, folderName, collectionName]);
	});

	socketConnect.on('finishLoading', function(folderName) {
		app.callEvent("editForm:finishLoading", [folderName, constants.FOLDER_TREE_ACTION.upload]);
		app.callEvent("approvedMetadata:loadData");
		app.callEvent("approvedFacet:loadApprovedFacetData");
	});

	socketConnect.on('finishDelete', function(folderName) {
		app.callEvent("editForm:finishLoading", [folderName, constants.FOLDER_TREE_ACTION.delete]);
		app.callEvent("approvedMetadata:loadData");
		app.callEvent("approvedFacet:loadApprovedFacetData");
	});

	socketConnect.on('updateUploadedResources', function() {
		app.callEvent("deleteResource:clearAfterDelete");
	});

	socketConnect.on("data", function(data) {
		Form.setItemsData(data);
	});

	socketConnect.on('finishResync', function() {
		app.callEvent("editForm:finishResync");
	});

	const uploadJSONFile = function(file) {
		socketConnect.on('message', function(msg, folderName) {
			// app.callEvent("uploaderList:loadingActions", [{title: data}]);
			app.callEvent("uploaderList:loadingActions", [msg, folderName]);
		});

		let size = 0;
		const uploadStream = socketStream.createStream();
		const blobStream = socketStream.createBlobReadStream(file.file);

		file.status = 'transfer';
		socketStream(socketConnect).emit('file', uploadStream, {name: file.name, host: ajax.getHostApiUrl()});

		blobStream.on('data', function(chunk) {
			size += chunk.length;
			const percent = Math.floor(size / file.size * 100);

			if (percent !== 100) {
				file.percent = percent;
			} else {
				file.percent = 0;
				file.status = 'server';
			}
		});

		blobStream.pipe(uploadStream);
	};

	const getImagesFromGirderFolder = function(host, folderId, folderName, token) {
		socketStream(socketConnect).emit('loadGirderFolder', {host, id: folderId, name: folderName, token});
	};

	const getImagesFromGirderCollection = function(host, collectionId, collectionName, token) {
		socketStream(socketConnect).emit('loadGirderCollection', {host, id: collectionId, name: collectionName, token});
	};

	const resyncImagesFromGirder = (token) => {
		const host = ajax.getHostApiUrl();
		socketStream(socketConnect).emit('resyncUploadedData', {host, token});
	};

	const deleteResource = function(folderId, host, token, name, type) {
		socketStream(socketConnect).emit('deleteResource', {host, id: folderId, token, name, type});
	};

	socketStream(socketConnect).on("error", (err, folderName) => {
		app.callEvent("editForm:finishLoading", [folderName, null, JSON.stringify(err)]);
		webix.message({
			type: "message",
			text: "server: Something went wrong!"
		});
	});

	return {
		uploadJSONFile,
		getImagesFromGirderFolder,
		getImagesFromGirderCollection,
		resyncImagesFromGirder,
		deleteResource
	};
});
