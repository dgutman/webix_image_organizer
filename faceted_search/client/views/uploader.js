define([
    "app",
    "models/upload"
], function (app, Upload) {
    var uploaderTypeName = "uploader_type_name",
        addButtonId = "add_button",
        uploaderListId = "uploader_list",
        uploadButtonId = "upload_button",
        uploaderViewId = "uploader_view";

    var doOnUploadBtnClick = function () {
        var file, id = $$(addButtonId).files.getFirstId();
        if (id) {
            $$(uploadButtonId).disable();
            $$(addButtonId).disable();
            file = $$(addButtonId).files.getItem(id);
            Upload.uploadFile(file);
        } else {
            webix.message("Add Some File To Upload It");
        }
    };

    var getId = function () {
        return uploaderViewId;
    };

    var ui = {
        id: uploaderViewId,
        padding: 5,
        view: "form",
        type: "line",
        rows: [
            {
                view: 'uploader',
                multiple: false,
                id: addButtonId,
                height: 37,
                align: "center",
                type: "iconButton",
                icon: "plus-circle",
                label: "Add file",
                autosend: false,
                link: uploaderListId
            },
            {
                borderless: true,
                view: "list",
                id: uploaderListId,
                type: uploaderTypeName,
                autoheight: true,
                minHeight: 50,
                template: function (f) {
                    return "<div class='overall'>" +
                        "<div class='name'>" + f.name + "</div>" +
                        "<div class='status'>" +
                        "<div class='progress " + f.status + "' " +
                        "style='width:" + (f.status == 'transfer' || f.status == 'server' ? f.percent + '%' : '0px') + "'></div>" +
                        "<div class='message " + f.status + "'>" + Upload.getFileStatus(f) + "</div>" +
                        "</div>" +
                        "<div class='size'>" + f.sizetext + "</div>" +
                        "</div>";
                },
                height: 35
            },
            {
                cols: [
                    {
                        id: uploadButtonId,
                        view: "button",
                        label: "Upload",
                        type: "iconButton",
                        icon: "upload",
                        click: doOnUploadBtnClick,
                        align: "center"
                    },
                    {width: 5}
                ]
            }
        ]
    };

    app.attachEvent("uploader:clearAfterSave", function() {
        $$(uploadButtonId).enable();
        $$(addButtonId).enable();
        $$(uploaderListId).clearAll();
    });

    return {
        $ui: ui,
        getId: getId
    }
});