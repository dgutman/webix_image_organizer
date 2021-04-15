define([
    "app",
    "libs/socket.io-client/dist/socket.io.min",
    "models/admin_form",
    "helpers/ajax"
], function (app, socketIO, Form, ajax) {
    var socketStream = window.ss,
        socketConnect = socketIO.connect('/backend'),
        uploadStream;

    var getFileStatus = function (file) {
        var messages = {
            server: "Done",
            error: "Error",
            client: "Ready",
            transfer: file.percent + "%"
        };

        return messages[file.status];
    };

    var uploadFile = function (file) {
        socketConnect.on('message', function (data) {
            app.callEvent("uploaderList:loadingActions", [{title: data}]);
        });
        socketConnect.on('data', function (data) {
            Form.setItemsData(data);
            // app.callEvent("adminMode:fileUploader:changeFormView", []);
        });

        var size = 0,
            uploadStream = socketStream.createStream(),
            blobStream = socketStream.createBlobReadStream(file.file);
        
        file.status = 'transfer';
        socketStream(socketConnect).emit('file', uploadStream, {name: file.name});

        blobStream.on('data', function (chunk) {
            var percent;
            size += chunk.length;
            percent = Math.floor(size / file.size * 100);

            if (percent !== 100) {
                file.percent = percent;
            }
            else {
                file.percent = 0;
                file.status = 'server';
            }
            app.callEvent("uploader:progressChange", [file]);
        });

        blobStream.pipe(uploadStream);
    };

    var uploadJSONFile = function (file) {
        socketConnect.on('message', function (data) {
            app.callEvent("uploaderList:loadingActions", [{title: data}]);
        });
        socketConnect.on('data', function (data) {
            // Form.setItemsData(data);
            // app.callEvent("adminMode:fileUploader:changeFormView", []);
        });

        var size = 0,
            uploadStream = socketStream.createStream(),
            blobStream = socketStream.createBlobReadStream(file.file);
        
        file.status = 'transfer';
        socketStream(socketConnect).emit('file', uploadStream, {name: file.name, host: ajax.getHostApiUrl()});

        blobStream.on('data', function (chunk) {
            var percent;
            size += chunk.length;
            percent = Math.floor(size / file.size * 100);

            if (percent !== 100) {
                file.percent = percent;
            }
            else {
                file.percent = 0;
                file.status = 'server';
            }
            app.callEvent("uploader:progressChange", [file]);
        });

        blobStream.pipe(uploadStream);
    };

    var getImagesFromGirder = function (host, folderId, folderName, token) {
        socketConnect.on('message', function (data) {
            app.callEvent("uploaderList:loadingActions", [{title: data}]);
        });

        socketConnect.on('finishLoading', function () {
            app.callEvent("editForm:finishLoading", []);
            app.callEvent("editForm:loadDataForFilters", []);
        });

        socketStream(socketConnect).emit('loadGirderFolder', {host, id: folderId, name: folderName, token});
    };

    socketStream(socketConnect).on("error", (err) => {
        app.callEvent("editForm:finishLoading", [{title: "Error!"}]);
        webix.message({
            type: "message",
            text: "File was not uploaded"
        });
    })

    return {
        getFileStatus: getFileStatus,
        uploadFile: uploadFile,
        uploadJSONFile: uploadJSONFile,
        getImagesFromGirder: getImagesFromGirder
    }
});