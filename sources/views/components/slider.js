import {JetView} from "webix-jet";


export default class Slider extends JetView {
	get _sliderViewId() {
		return "sliderViewId";
	}

	constructor(app, config) {
		super(app, config);

		this._cnf = config;
		this._currentValue = null;
		this._sliderView = null;
	}

	config() {
		const events = this._cnf.on || {};
		return {
			...this._cnf,
			on: {
				...events,
				onSliderDrag() {
					const value = this.getValue();
					if (this._currentValue !== value) {
						this._currentValue = value;
						this.callEvent("onSliderDragging", [value]);
					}
				}
			},
			view: "slider",
			localId: this._sliderViewId
		};
	}

	$slider() {
		if (!this._sliderView) {
			this._sliderView = this.$$(this._sliderViewId);
		}
		return this._sliderView;
	}
}
