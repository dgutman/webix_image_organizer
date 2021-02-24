import state from "../models/state";

class GlobalEvents {
	constructor() {
		this._attachBeforeUnloadEvent();
	}

	_attachBeforeUnloadEvent() {
		window.addEventListener("beforeunload", (e) => {
			e = e || window.event;
			if (state.unsavedData) {
				const returnValue = state.unsavedData;
				// For IE and Firefox prior to version 4
				if (e) {
					e.returnValue = state.unsavedData;
				}

				// For Safari
				return returnValue;
			}
		});
	}
}

const globalEvents = new GlobalEvents();

export default globalEvents;
