import ajaxActions from "../services/ajaxActions";
import constants from "../constants";
import webixViews from "./webixViews";

class EditableFoldersModel {
	constructor() {
		this.folderAccessLvls = {};
	}

	isFolderEditable(id) {
		const lvl = this.getFolderAccessLvl(id);
		return lvl >= constants.EDIT_ACCESS_LEVEL;
	}

	getFolderAccessLvl(id) {
		const finderView = webixViews.getFinderView();
		if (typeof this.folderAccessLvls[id] !== "number") {
			const folder = finderView.find(obj => obj._id === id, true);
			this.folderAccessLvls[id] = folder ? folder._accessLevel : -1;
		}
		return this.folderAccessLvls[id];
	}

	getFolderFromServer(id) {
		webixViews.getMainView().showProgress();
		return ajaxActions.getFolderById(id)
			.then((folder) => {
				this.folderAccessLvls[id] = folder._accessLevel;
				return this.isFolderEditable(id);
			})
			.finally(() => {
				webixViews.getMainView().hideProgress();
			});
	}
}
const instance = new EditableFoldersModel();

export default instance;
