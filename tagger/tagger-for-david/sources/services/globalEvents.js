import responsiveWindows from "../models/windows/responsiveWindows";

class GlobalEvents {
	constructor() {
		this._attachResizeEvent();
	}

	_attachResizeEvent() {
		window.addEventListener("resize", () => {
			responsiveWindows.resizeWindows();
		});
	}
}

const globalEvents = new GlobalEvents();

export default {
	globalEvents
};
