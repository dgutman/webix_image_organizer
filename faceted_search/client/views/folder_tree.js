
define([
	"app",
	"constants",
	"helpers/authentication",
	"helpers/ajax", 
	"models/upload"
], function(app, constants, auth, ajax, Upload) {
	const uploadButtonId = "upload-btn";
	const resyncButtonId = "resync-btn";
	const statusTempateId = "status-template";

	const treeView = {
		view: "tree",
		width: 320,
		id: constants.FOLDER_TREE_ID,
		select: true,
		scroll: "auto",
		type: "lineTree",
		oncontext: {},
		template: (obj, common) => {
			return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name}</span>`;
		},
		scheme: {
			$init(obj) {
				if (obj._modelType === "folder" || obj._modelType === "collection") {
					obj.webix_kids = true;
				}
			}
		}
	};

	const statusTemplate = {
		template: (obj) => obj.title || "",
		borderless: true,
		id: statusTempateId,
		height: 50
	};

	const resyncButton = {
		view: "button",
		type: "icon",
		css: "icon-btn",
		tooltip: "Resync uploaded images",
		icon: "mdi mdi-sync",
		id: resyncButtonId,
		width: 45
	};

	const uploadButton = {
		view: "button",
		id: uploadButtonId,
		value: "Upload items from folder",
		disabled: true
	};
	
	return {
		$ui: {
			rows: [
				treeView,
				statusTemplate,
				{
					cols: [
						uploadButton,
						resyncButton
					]
				}
			]
		},
		$oninit: () => {
			const tree = $$(constants.FOLDER_TREE_ID);
			const uploadButton = $$(uploadButtonId);
			const resyncButton = $$(resyncButtonId);
			webix.extend(tree, webix.ProgressBar);
			tree.showProgress();
			ajax.getCollection()
				.then((data) => {
					tree.parse(data);
				})
				.finally(() => {
					tree.hideProgress();
				});
			
			tree.attachEvent("onDataRequest", (id) => {
				const item = tree.getItem(id);
				tree.showProgress();
				ajax.getFolder(item._modelType, item._id)
					.then((data) => {
						tree.parse({parent: id, data});
					})
					.finally(() => {
						tree.hideProgress();
					});
			});

			function toggleUploadButtonState(treeItem) {
				if (treeItem && treeItem._modelType === "folder") {
					uploadButton.enable();
				} else {
					uploadButton.disable();
				}
			}

			tree.attachEvent("onAfterSelect", (id) => {
				const item = tree.getItem(id);
				toggleUploadButtonState(item);
			});

			uploadButton.attachEvent("onItemClick", () => {
				const folder = tree.getSelectedItem();
				const token = auth.getToken();

				tree.showProgress();
				uploadButton.disable();
				Upload.getImagesFromGirder(ajax.getHostApiUrl(), folder._id, folder.name, token);
			});

			resyncButton.attachEvent("onItemClick", () => {
				const token = auth.getToken();
				tree.showProgress();
				resyncButton.disable();
				Upload.resyncImagesFromGirder(token);
			});

			app.attachEvent("editForm:finishLoading", function(data) {
				const tree = $$(constants.FOLDER_TREE_ID);
				tree.hideProgress();

				const selectedItem = tree.getSelectedItem();
				toggleUploadButtonState(selectedItem);
				resyncButton.enable();

				$$(statusTempateId).setValues(data || {title: "Done!"});
			});

			app.attachEvent("uploaderList:loadingActions", function(data) {
				$$(statusTempateId).setValues(data);
			});
		
			app.attachEvent("uploaderList:clearAfterSave", function() {
				$$(statusTempateId).setValues({title: "Done!"});
			});
		}
    };
});

