import responsiveWindows from "../models/windows/responsiveWindows";
import state from "../models/state";

class GlobalEvents {
	constructor() {
		this._resizeCallbacks = [];
		this._beforeUnloadCallbacks = {};
		this.addCallback(responsiveWindows.resizeWindows.bind(responsiveWindows), "resize");
		this._attachResizeEvent();
		this._attachFocusEvents();
	}

	addCallback(cb, type, key) {
		switch (type) {
			case "resize": {
				this._resizeCallbacks.push(cb);
				break;
			}
			case "unload": {
				this._beforeUnloadCallbacks[key] = cb;
				break;
			}
			default: {
				break;
			}
		}
	}

	clearCallbacks(type) {
		switch (type) {
			case "resize": {
				this._resizeCallbacks = [];
				break;
			}
			case "unload": {
				this._beforeUnloadCallbacks = {};
				break;
			}
			default: {
				this._beforeUnloadCallbacks = {};
				this._resizeCallbacks = [];
				break;
			}
		}
	}

	_attachResizeEvent() {
		window.addEventListener("resize", () => {
			if (state.app && state.app.callEvent) {
				state.app.callEvent("windowResize");
				this._resizeCallbacks.forEach((cb) => {
					cb();
				});
			}
		});
	}

	_attachFocusEvents() {
		if (document.hasFocus()) {
			document.body.classList.add("focused");
		}
		window.addEventListener("focus", () => {
			if (!document.body.classList.contains("focused")) {
				document.body.classList.add("focused");
			}
		});

		window.addEventListener("blur", () => {
			document.body.classList.remove("focused");
		});
	}
}

const globalEvents = new GlobalEvents();

export default globalEvents;
