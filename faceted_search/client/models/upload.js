define([
	"app",
	"constants",
	"libs/socket.io-client/dist/socket.io.min",
	"models/admin_form",
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

	socketConnect.on('message', function(data) {
		app.callEvent("uploaderList:loadingActions", [{title: data}]);
	});

	socketConnect.on('finishLoading', function() {
		app.callEvent("editForm:finishLoading", []);
		app.callEvent("approvedMetadata:loadData");
		app.callEvent("approvedFacet:loadApprovedFacetData");
	});

	socketConnect.on('updateUploadedResources', function() {
		app.callEvent("deleteResource:clearAfterDelete");
	});

	const uploadJSONFile = function(file) {
		socketConnect.on('message', function(data) {
			app.callEvent("uploaderList:loadingActions", [{title: data}]);
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

	const getImagesFromGirderCollection = function(host, collectionId, token) {
		socketStream(socketConnect).emit('loadGirderCollection', {host, id: collectionId, token});
	};

	const resyncImagesFromGirder = (token) => {
		const host = ajax.getHostApiUrl();
		socketStream(socketConnect).emit('resyncUploadedData', {host, token});
	};

	const deleteResource = function(folderId, host, token) {
		socketStream(socketConnect).emit('deleteResource', {host, id: folderId, token});
	};

	socketStream(socketConnect).on("error", (err) => {
		app.callEvent("editForm:finishLoading", [{title: "Error!"}]);
		webix.message({
			type: "message",
			text: "Something went wrong!"
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
