import utils from "../utils/utils";

export default class FolderNav {
	constructor(scope, finder) {
		this.scope = scope;
		this.finder = finder;
		this.inProgress = false;
		this.urlFolderNames = [];

		this.setWaitDataPromise();

		this.finder.attachEvent("onSelectChange", () => {
			this.setFoldersIntoUrl();
		});

		this.finder.data.attachEvent("onStoreUpdated", () => {
			if (!this.finder.count()) {
				this.setWaitDataPromise();
			}
		});
	}

	setWaitDataPromise() {
		this.waitData = new Promise((resolve) => {
			this.finder.attachEvent("onAfterLoad", () => {
				resolve();
			});
		});
	}

	openFirstFolder() {
		if (!this.inProgress) {
			this.inProgress = true;
			const paramFolders = this.scope.getParam("folders");
			if (paramFolders) {
				const folderNames = paramFolders.split(",");
				this.urlFolderNames = folderNames;
			}
			else {
				this.urlFolderNames = [];
			}

			this.waitData.then(() => {
				this.openSingleFolder(this.urlFolderNames[0]);
			});
		}
	}

	openNextFolder(folder) {
		const nextFolderName = this.urlFolderNames[folder.$level];
		if (this.inProgress && nextFolderName) {
			this.openSingleFolder(nextFolderName);
		}
		else {
			this.inProgress = false;
		}
	}

	openSingleFolder(folderName) {
		const folder = this.findFolderByName(folderName);
		if (folder) {
			if (!folder.hasOpened || !folder.open || this.isLastFolderToSelect(folder)) {
				this.finder.select(folder.id);
				this.finder.showItem(folder.id);
			}
			else {
				this.openNextFolder(folder);
			}
		}
		else {
			this.setFoldersIntoUrl();
			this.inProgress = false;
		}
	}

	isLastFolderToSelect(folder) {
		// check if folder is last in URL folder names and if it has selected child items
		const compareNames = utils.compareURLStrings(folder.name, this.urlFolderNames[this.urlFolderNames.length - 1]);
		const selectedItem = this.finder.getSelectedItem();
		let selectedItemQualifier = true;
		if (selectedItem) {
			const isFolder = selectedItem._modelType === "folder";
			const isFolderHasSelectedItem = !isFolder && +selectedItem.$parent === folder.id;
			selectedItemQualifier = selectedItem.id !== folder.id && !isFolderHasSelectedItem;
		}
		
		return selectedItemQualifier && compareNames;
	}

	findFolderByName(name) {
		return this.finder.find(item => item._modelType === "folder" && utils.compareURLStrings(item.name, name), true);
	}

	setFoldersIntoUrl() {
		const folders = [];
		let selectedFolderId = this.finder.getSelectedId();
		if (selectedFolderId) {
			let parentId = this.finder.getParentId(selectedFolderId);
			do {
				const folder = this.finder.getItem(selectedFolderId);
				if (folder._modelType === "folder") folders.unshift(folder.name);
				selectedFolderId = parentId;
				parentId = selectedFolderId ? this.finder.getParentId(selectedFolderId) : null;
			}
			while (selectedFolderId);
		}
		const foldersString = decodeURI(folders.join(","));
		if (foldersString !== this.scope.getParam("folders")) {
			this.scope.setParam("folders", decodeURI(folders.join(",")), true);
		}
	}
}
