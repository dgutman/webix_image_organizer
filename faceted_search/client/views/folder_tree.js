define([
	"app",
	"constants",
	"helpers/authentication",
	"helpers/ajax",
	"models/upload",
	"models/applied_filters",
	"models/approved_facet"
], function(
	app,
	constants,
	auth,
	ajax,
	Upload,
	AppliedFilters,
	ApprovedFacets
) {
	const uploadButtonId = "upload-btn";
	const resyncButtonId = "resync-btn";
	const statusTabViewId = "status-tab-view-id";
	const deleteButtonId = "delete-btn";
	const localApi = constants.LOCAL_API;
	const statusTabId = constants.STATUS_TAB_ID;
	const resyncTabId = constants.RESYNC_ID;
	const downloadedResources = [];
	let isItemUnselected = false;

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
			return `${common.icon(obj, common) + common.folder(obj, common)}<span class="folder-tree__name">${obj.name}</span> ${downloadedResourceIcon} ${deleteResourceIcon}`;
		},
		scheme: {
			$init(obj) {
				if (obj._modelType === "folder" || obj._modelType === "collection") {
					obj.webix_kids = true;
				}
			}
		},
		tooltip: {
			template: (obj) => `${obj.name}`, 
			dx: 10, dy: 0,
			delay: 100
		},
	};

	const statusTemplate = {
		view: "tabview",
		id: statusTabViewId,
		height: 100,
		tabbar: {
			close: true,
			optionWidth: 280
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
		if (tabView && !tabView.$destructed) {
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
		}
	};

	/**
	 * 
	 * @param {boolean} value 
	 */
	function changeIsItemSelectedFlag(value) {
		isItemUnselected = value;
	}

	function getIsItemSelectedFlag() {
		return isItemUnselected;
	}

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
				if (treeItem?._modelType === "folder" || treeItem?._modelType === "collection") {
					if (!uploadButton.$destructed) {
						uploadButton?.enable();
					}
				} else {
					if (!uploadButton.$destructed) {
						uploadButton?.disable();
					}
				}
			}

			tree.attachEvent("onAfterSelect", (id) => {
				try {
					if (getIsItemSelectedFlag()) {
						tree.unselect(id);
					}
					else {
						const item = tree.getItem(id);
						toggleUploadButtonState(item);
					}
				} catch (e) {
					console.error(e);
				} finally {
					changeIsItemSelectedFlag(false);
				}
			});

			tree.attachEvent("onItemClick", (id, ev) => {
				if (tree.isSelected(id)) {
					changeIsItemSelectedFlag(true);
					tree.unselect(id);
					uploadButton?.disable();
				}
			});

			uploadButton?.attachEvent("onItemClick", async () => {
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
					Upload.getImagesFromGirderCollection(ajax.getHostApiUrl(), collection._id, collection.name, token);
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
							.then(async (results) => {
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
								await ajax.getDownloadedResources()
									.then((data) => {
										downloadedResources.length = 0;
										if (Array.isArray(data)) {
											downloadedResources.push(...data);
										}
										// tree.refresh();
										tree.render();
									});
								AppliedFilters.clearFilters();
								ApprovedFacets.clearApprovedFacets();
								app.callEvent("approvedMetadata:loadData");
								app.callEvent("approvedFacet:loadApprovedFacetData");
								tree.hideProgress();
							}, (err) => {
								webix.message({type: "error", text: `${err.responseText}`, expire: 10000});
								tree.hideProgress();
							});
							app.callEvent("editForm:loadDataForFilters");
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

			app.attachEvent("editForm:finishResync", function() {
				const resyncButton = $$(resyncButtonId);
				if (resyncButton && !resyncButton.$destructed) {
					resyncButton.enable();
				}
			});

			app.attachEvent("editForm:finishLoading", function(folderName, operation, errorMessage) {
				const resyncButton = $$(resyncButtonId);
				const tree = $$(constants.FOLDER_TREE_ID);
				ajax.getDownloadedResources()
					.then((resourceData) => {
						downloadedResources.length = 0;
						if(Array.isArray(resourceData)) {
							downloadedResources.push(...resourceData);
						}
						if (!tree.$destructed) {
							// tree.refresh();
							tree.render();
						}
					});
				if (resyncButton && !resyncButton.$destructed) {
					resyncButton.enable();
				}
				const tabView = $$(statusTabViewId);
				if (tabView && !tabView.$destructed) {
					let cell = tabView && !tabView.$destructed
						? tabView.getMultiview().queryView({id: `${folderName}-cell`})
						: null;
					if (!cell) {
						addNewTab(folderName);
						cell = tabView && !tabView.$destructed
							? tabView.getMultiview().queryView({id: `${folderName}-cell`})
							: null;
					}
					if (errorMessage) {
						cell?.define("template", `[Error]: ${errorMessage}`);
					}
					else {
						switch(operation) {
							case constants.FOLDER_TREE_ACTION.upload:
								cell?.define("template", "[Upload]: Done!");
								break;
							case constants.FOLDER_TREE_ACTION.delete:
								cell?.define("template", "[Delete]: Done");
								break;
						}
					}
					cell?.refresh();
				}
				tree?.hideProgress();
			});

			app.attachEvent("uploaderList:loadingActions", function(msg, folderName, collectionName) {
				if (!folderName) return;
				const name = collectionName ?? folderName;
				const tabView = $$(statusTabViewId);
				if (tabView && !tabView.$destructed) {
					let cell = tabView?.getMultiview()?.queryView({id: `${name}-cell`});
					if (cell) {
						cell.define("template", msg);
					}
					else {
						addNewTab(name);
						cell = tabView?.getMultiview()?.queryView({id: `${name}-cell`});
						cell?.define("template", msg);
					}
					cell?.refresh();
				}
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
				try {
					if (tree && !tree.$destructed) tree.showProgress();
					const resourceData = await ajax.getDownloadedResources();
					downloadedResources.length = 0;
					if(Array.isArray(resourceData)) {
						downloadedResources.push(...resourceData);
					}
				}
				catch (error) {
					console.error(error);
				}
				finally {
					if (tree && !tree.$destructed) {
						tree.hideProgress();
						tree.render();
					}
				}
			});

			tree.on_click.delicon = async function(e, id, trg) {
				try {
					const obj = tree.getItem(id);
					const token = auth.getToken();
					const host = ajax.getHostApiUrl();
					Upload.deleteResource(obj._id, host, token, obj.name, obj._modelType);
				}
				catch (error) {
					console.error(error);
				}
				finally {
					// tree.refresh();
					if (tree && !tree.$destructed) {
						tree.render();
					}
				}
			};
		}
	};
});

