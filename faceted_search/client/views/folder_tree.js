define([
	"app",
	"constants",
	"helpers/authentication",
	"helpers/ajax",
	"models/upload"
], function(app, constants, auth, ajax, Upload) {
	const uploadButtonId = "upload-btn";
	const resyncButtonId = "resync-btn";
	const statusTabViewId = "status-tab-view-id";
	const deleteButtonId = "delete-btn";
	const localApi = constants.LOCAL_API;
	const statusTabId = constants.STATUS_TAB_ID;
	const resyncTabId = constants.RESYNC_ID;
	const downloadedResources = [];

	const treeView = {
		view: "tree",
		width: 320,
		id: constants.FOLDER_TREE_ID,
		select: true,
		scroll: "auto",
		type: "lineTree",
		oncontext: {},
		template: (obj, common) => {
			const [downloadedResourceIcon, deleteResourceIcon] = downloadedResources.includes(obj._id)
				? [`<span class="webix_icon wxi-check dwnicon"></span>`, `<span class="webix_icon wxi-close-circle delicon"></span>`]
				: [``, ``];
			return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name}</span> ${downloadedResourceIcon} ${deleteResourceIcon}`;
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
		view: "tabview",
		id: statusTabViewId,
		height: 100,
		tabbar: {
			close: true
		},
		cells: [
			{
				hidden: true,
				id: statusTabId,
				body: {
					id: resyncTabId,
					template: ""
				}
			}
		]
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

	const deleteButton = {
		view: "button",
		id: deleteButtonId,
		value: "Clear database"
	};

	const addNewTab = function(tabId) {
		const tabView = $$(statusTabViewId);
		const cell = tabView.getMultiview().queryView({id: `${tabId}-cell`});
		if (!cell) {
			const newTab = {
				header: tabId,
				body: {
					id: `${tabId}-cell`,
					template: `Status for ${tabId}`
				}
			};
			tabView.addView(newTab);
			tabView.getMultiview().setValue(`${tabId}-cell`);
		}
	};

	return {
		$ui: {
			rows: [
				treeView,
				statusTemplate,
				{
					rows: [
						{
							cols: [
								uploadButton,
								resyncButton
							]
						},
						{
							cols: [
								deleteButton
							]
						}
					]
				}
			]
		},
		$oninit: () => {
			const tree = $$(constants.FOLDER_TREE_ID);
			const uploadButton = $$(uploadButtonId);
			const resyncButton = $$(resyncButtonId);
			const deleteButton = $$(deleteButtonId);
			webix.extend(tree, webix.ProgressBar);
			tree.showProgress();
			ajax.getDownloadedResources()
				.then((data) => {
					downloadedResources.length = 0;
					if (Array.isArray(data)) {
						downloadedResources .push(...data);
					}
				});

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
				ajax.getSubFolders(item._modelType, item._id)
					.then((data) => {
						tree.parse({parent: id, data});
					})
					.finally(() => {
						tree.hideProgress();
					});
			});

			function toggleUploadButtonState(treeItem) {
				const uploadButton = $$(uploadButtonId);
				if (treeItem?._modelType === "folder" || treeItem?._modelType === "collection") {
					uploadButton.enable();
				} else {
					uploadButton.disable();
				}
			}

			tree.attachEvent("onAfterSelect", (id) => {
				const item = tree.getItem(id);
				toggleUploadButtonState(item);
			});

			uploadButton.attachEvent("onItemClick", async () => {
				const uploadButton = $$(uploadButtonId);
				const selectedItem = tree.getSelectedItem();
				addNewTab(selectedItem.name);
				const folder = selectedItem._modelType === "folder" ? selectedItem : null;
				const collection = selectedItem._modelType === "collection" ? selectedItem : null;
				const token = auth.getToken();

				uploadButton.disable();
				if (folder) {
					Upload.getImagesFromGirderFolder(ajax.getHostApiUrl(), folder._id, folder.name, token);
				} else if (collection) {
					Upload.getImagesFromGirderCollection(ajax.getHostApiUrl(), collection._id, token);
				}
			});

			deleteButton.attachEvent("onItemClick", async () => {
				webix.confirm({title: "Clear database", text: "Confirm action"})
					.then(function(result) {
						tree.showProgress();
						const promises = [
							webix.ajax().del(`${localApi}/facets/approved-facets`),
							webix.ajax().del(`${localApi}/facets/approved-metadata`),
							webix.ajax().del(`${localApi}/facets/images`),
							webix.ajax().del(`${localApi}/facets/filters`),
							webix.ajax().del(`${localApi}/resources/downloaded-resources`)
						];
						Promise.all(promises)
							.then((results) => {
								let hasAllResults = true;
								if(results) {
									results.forEach((result) => {
										if (!result) {
											hasAllResults = false;
										}
									});
								} else {
									hasAllResults = false;
								}
								if(hasAllResults) {
									webix.message({type: "message", text: "Database has been cleared", expire: 10000});
								} else {
									webix.message({type: "error", text: `Internal Error`, expire: 10000});
								}
								ajax.getDownloadedResources()
									.then((data) => {
										downloadedResources.length = 0;
										if (Array.isArray(data)) {
											downloadedResources.push(...data);
										}
								});
								// tree.refresh();
								tree.render();
								tree.hideProgress();
							}, (err) => {
								webix.message({type: "error", text: `${err.responseText}`, expire: 10000});
								tree.hideProgress();
							});
					})
					.fail(function() {});
			});

			resyncButton.attachEvent("onItemClick", () => {
				const resyncButton = $$(resyncButtonId);
				const token = auth.getToken();
				tree.showProgress();
				resyncButton.disable();
				Upload.resyncImagesFromGirder(token);
			});

			app.attachEvent("editForm:finishLoading", function(folderName) {
				const resyncButton = $$(resyncButtonId);
				const tree = $$(constants.FOLDER_TREE_ID);

				const selectedItem = tree.getSelectedItem();
				if (selectedItem) {
					toggleUploadButtonState(selectedItem);
					resyncButton.enable();

					ajax.getDownloadedResources()
						.then((resourceData) => {
							downloadedResources.length = 0;
							if(Array.isArray(resourceData)) {
								downloadedResources.push(...resourceData);
							}
							tree.unselectAll();
							toggleUploadButtonState();
							// tree.refresh();
							tree.render();
						});
				}

				const tabView = $$(statusTabViewId);
				let cell = tabView.getMultiview().queryView({id: `${folderName}-cell`});
				if (cell) {
					cell.define("template", "Done!");
				}
				else {
					addNewTab(folderName);
					cell = tabView.getMultiview().queryView({id: `${folderName}-cell`});
					cell?.define("template", "Done!");
				}
				cell?.refresh();
				tree.hideProgress();
			});

			app.attachEvent("uploaderList:loadingActions", function(msg, folderName) {
				const tabView = $$(statusTabViewId);
				let cell = tabView?.getMultiview()?.queryView({id: `${folderName}-cell`});
				if (cell) {
					cell.define("template", msg);
				}
				else {
					addNewTab(folderName);
					cell = tabView?.getMultiview()?.queryView({id: `${folderName}-cell`});
					cell?.define("template", msg);
				}
				cell.refresh();
			});

			app.attachEvent("uploaderList:clearAfterSave", function(tabId) {
				const currentId = tabId ? tabId : resyncTabId;
				const tabView = $$(statusTabViewId);
				let cell = tabView?.getMultiview()?.queryView({id: `${currentId}-cell`});
				if (cell) {
					cell.define("Done!");
				}
				else {
					addNewTab(resyncTabId);
					cell = tabView?.getMultiview()?.queryView({id: `${currentId}-cell`});
					cell?.define("template", "Done!");
				}
				cell?.refresh();
			});

			app.attachEvent("deleteResource:clearAfterDelete", async function() {
				// tree.refresh();
				tree.showProgress();
				const resourceData = await ajax.getDownloadedResources();
				downloadedResources.length = 0;
				if(Array.isArray(resourceData)) {
					downloadedResources.push(...resourceData);
				}
				tree.hideProgress();
				tree.render();
			});

			tree.on_click.delicon = async function(e, id, trg) {
				tree.showProgress();
				const obj = tree.getItem(id);
				const token = auth.getToken();
				const host = ajax.getHostApiUrl();
				Upload.deleteResource(obj._id, host, token, obj.name);
				// tree.refresh();
				tree.render();
			};
		}
    };
});

