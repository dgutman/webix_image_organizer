define([
    "app",
    "libs/socket.io-client/dist/socket.io.min",
    "models/admin_form",
    "helpers/ajax"
], function(app, socketIO, Form, ajax) {
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

    const getImagesFromGirder = function(host, folderId, folderName, token) {
        socketStream(socketConnect).emit('loadGirderFolder', {host, id: folderId, name: folderName, token});
    };

    const resyncImagesFromGirder = (token) => {
        const host = ajax.getHostApiUrl();
        socketStream(socketConnect).emit('resyncUploadedData', {host, token});
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
        getImagesFromGirder,
        resyncImagesFromGirder
    };
});
