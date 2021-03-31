import ajaxActions from "../ajaxActions";
import constants from "../../constants";
import FolderNav from "../folderNav";
import DatatableService from "./datatableService";
import UploaderService from "./uploaderService";
import ImageWindow from "../../views/subviews/gallery/windows/imageWindow/index";
import PdfViewerWindow from "../../views/subviews/gallery/windows/pdfViewerWindow";
import LoadingWindow from "../../views/uploadMetadata/windows/loadingWindow";
import CompareMetadataWindow from "../../views/uploadMetadata/windows/compareWindow";

class MetadataUploadService {
	constructor(view) {
		this._view = view;
		this._itemsHash = {};
		this._itemsCollection = new webix.DataCollection({
			scheme: {
				$init: (obj) => {
					this._itemsHash[obj.name] = obj;
				}
			}
		});
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		// child views
		const scope = this._view.$scope;
		this._uploader = scope.uploader;
		this._uploadMetadataView = scope.uploadMetadataView;
		this._sidebarTree = scope.sidebarTree;
		this._filesDropDown = scope.filesDropDown;
		this._metaDatatable = scope.metaDatatable;
		this._rootInput = scope.rootInput;
		this._acceptButton = scope.acceptButton;
		this._imageWindow = scope.ui(ImageWindow);
		this._pdfWindow = scope.ui(PdfViewerWindow);
		this._loadingWindow = scope.ui(LoadingWindow);
		this._compareWindow = scope.ui(CompareMetadataWindow);

		this._hostBox = scope.headerScope.getHostBox();
		this._collectionBox = scope.headerScope.getCollectionBox();

		this._folderNav = new FolderNav(scope, this._sidebarTree);

		this._datatableService = new DatatableService({
			datatable: this._metaDatatable,
			rootInput: this._rootInput,
			itemsCollection: this._itemsCollection,
			itemsHash: this._itemsHash,
			imageWindow: this._imageWindow,
			pdfWindow: this._pdfWindow,
			loadingWindow: this._loadingWindow,
			compareWindow: this._compareWindow,
			view: this._view
		});
		this._uploaderService = new UploaderService(
			this._uploader,
			this._filesDropDown,
			this._uploadMetadataView,
			this._view
		);

		this._attachTreeEvents();

		// setting onChange event for collection
		this._view.$scope.on(this._view.$scope.app, "collectionChange", (id, collectionItem) => {
			if (!this.pendingCollectionChange) this._collectionChangeHandler(collectionItem);
		});
		if (!this._sidebarTree.count() && !this.pendingCollectionChange) {
			const collectionId = this._collectionBox.getValue();
			const collection = this._collectionBox.getList().getItem(collectionId);
			if (collection) this._collectionChangeHandler(collection);
		}

		this._filesDropDown.attachEvent("onChange", (id) => {
			const list = this._filesDropDown.getList();
			this._metaDatatable.clearAll();
			const metaItem = list.getItem(id);

			metaItem.meta.fields = metaItem.meta.fields
				.filter(field => field !== constants.ITEM_NAME_COLUMN);
			metaItem.meta.fields.unshift(constants.ITEM_NAME_COLUMN);

			const columnConfig = this._datatableService.getColumnConfig(metaItem.meta.fields);

			this._metaDatatable.refreshColumns(columnConfig);

			this._datatableService.setValidItems(metaItem.data);
			this._metaDatatable.parse(metaItem.data);

			this._metaDatatable.validate();
		});

		this._acceptButton.attachEvent("onItemClick", () => {
			this._datatableService.acceptAllMetadata();
		});
	}

	// URL-NAV get host and collection from URL params and select it
	_urlChange() {
		this._folderNav.openFirstFolder();
	}

	_collectionChangeHandler(collection) {
		this.pendingCollectionChange = true;
		this._view.showProgress();
		return ajaxActions.getFolders("collection", collection._id, 0, 0)
			.then((folders) => {
				this._sidebarTree.clearAll();
				this._sidebarTree.parse(folders);
				this._view.hideProgress();
				this.pendingCollectionChange = false;
				this._folderNav.openFirstFolder();
			})
			.catch(() => {
				this._view.hideProgress();
				this.pendingCollectionChange = false;
			});
	}

	_attachTreeEvents() {
		this._sidebarTree.attachEvent("onBeforeOpen", (id) => {
			this._sidebarTree.select(id);
		});

		this._sidebarTree.attachEvent("onBeforeSelect", (id) => {
			const item = this._sidebarTree.getItem(id);
			if (item._modelType !== "folder") {
				this._sidebarTree.select(item.$parent);
				return false;
			}
		});

		this._sidebarTree.attachEvent("onAfterSelect", (id) => {
			const item = this._sidebarTree.getItem(id);
			this._selectFolder(id, item);
		});
	}

	_selectFolder(id, item) {
		if (item.hasOpened) {
			this._sidebarTree.blockEvent();
			this._sidebarTree.open(id);
			this._sidebarTree.unblockEvent();
			this._folderNav.openNextFolder(item);

			this._filterItemsByFolder(item);
			this._metaDatatable.validate();
		}
		else {
			this._view.showProgress();
			ajaxActions.getFolders("folder", item._id, 0, 0)
				.then((folders) => {
					this._sidebarTree.parse({
						data: folders,
						parent: id
					});

					item.hasOpened = true;
					return ajaxActions.getItems(item._id);
				})
				.then((items) => {
					if (items.length) {
						this._sidebarTree.parse({
							data: [{
								_modelType: "item-count",
								_itemsCount: items.length,
								name: "&lt;items&gt;"
							}],
							parent: id
						});
					}

					this._itemsCollection.parse(items);
					this._filterItemsByFolder(item);

					this._sidebarTree.blockEvent();
					this._sidebarTree.open(id);
					this._sidebarTree.unblockEvent();

					this._sidebarTree.updateItem(item.id, {_itemsCount: items.length});
					this._folderNav.openNextFolder(item);
					this._datatableService.setValidItems(this._metaDatatable.data.serialize());
					this._metaDatatable.validate();

					this._view.hideProgress();
				})
				.catch(() => {
					this._view.hideProgress();
				});
		}
	}

	_filterItemsByFolder(folder) {
		this._itemsCollection.filter(item => (folder ? item.folderId === folder._id : false));
	}
}

export default MetadataUploadService;
