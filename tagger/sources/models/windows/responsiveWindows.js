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
			const {WIDTH, HEIGHT, MIN_WIDTH, MIN_HEIGHT} = constants.WINDOW_SIZE;
			const minWidth = Math.min(view.$width, WIDTH, window.innerWidth - 30);
			const possibleMinWidth = Math.max(minWidth, MIN_WIDTH);

			const minHeight = Math.min(view.$height, HEIGHT, window.innerHeight - 30);
			const possibleMinHeight = Math.max(minHeight, MIN_HEIGHT);

			view.define("width", possibleMinWidth);
			view.define("height", possibleMinHeight);
			view.resize();
		});
	}
}

export default new ResponsiveWindows();
