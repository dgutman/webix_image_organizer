import utils from "../../utils/utils";
import constants from "../../constants";

class ResponsiveWindows {
	constructor() {
		this.views = {};
	}

	addWindow(id, view) {
		this.views[id] = view;
		this.resizeWindows();
	}

	removeWindow(id) {
		delete this.views[id];
	}

	isEmpty() {
		return utils.isObjectEmpty(this.views);
	}

	clearModel() {
		this.views = {};
	}

	resizeWindows() {
		const windows = Object.values(this.views);
		windows.forEach((view) => {
			const minWidth = Math.min(view.$width, constants.WINDOW_SIZE.WIDTH, window.innerWidth - 30);
			const possibleMinWidth = Math.max(minWidth, constants.WINDOW_SIZE.MIN_WIDTH);

			const minHeight = Math.min(view.$height, constants.WINDOW_SIZE.HEIGHT, window.innerHeight - 30);
			const possibleMinHeight = Math.max(minHeight, constants.WINDOW_SIZE.MIN_HEIGHT);

			view.define("width", possibleMinWidth);
			view.define("height", possibleMinHeight);
			view.resize();
		});
	}
}

export default new ResponsiveWindows();
