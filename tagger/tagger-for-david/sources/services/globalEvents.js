import responsiveWindows from "../models/windows/responsiveWindows";
import state from "../models/state";

class GlobalEvents {
	constructor() {
		this._attachResizeEvent();
		this._callbacks = [];
		this.addCallback(responsiveWindows.resizeWindows.bind(responsiveWindows));
	}

	addCallback(cb) {
		this._callbacks.push(cb);
	}

	_attachResizeEvent() {
		window.addEventListener("resize", () => {
			state.app.callEvent("windowResize");
			this._callbacks.forEach((cb) => {
				cb();
			});
		});
	}
}

const globalEvents = new GlobalEvents();

export default globalEvents;
