import {JetView} from "webix-jet";

const MAX_SLIDER_ID = "slider-max";
const MIN_SLIDER_ID = "silder-min";

export default class RangeSlider extends JetView {
	constructor(app, config = {}, max, min) {
		super(app, config);

		this._cnf = config;
		this._pickerTemplate = null;
		this._range = {
			max,
			min
		};
	}

	config() {
		return {
			...this._cnf,
			rows: [
				{
					view: "slider",
					name: "max",
					localId: MAX_SLIDER_ID,
					title: () => `Max: ${this._maxSlider.getValue()}`,
					value: this._range.max,
					min: this._range.min + 1,
					max: this._range.max
				},
				{
					view: "slider",
					name: "min",
					localId: MIN_SLIDER_ID,
					title: () => `Min: ${this._minSlider.getValue()}`,
					value: this._range.min,
					min: this._range.min,
					max: this._range.max - 1
				}
			]
		};
	}

	init() {
		this._maxSlider = this.$$(MAX_SLIDER_ID);
		this._minSlider = this.$$(MIN_SLIDER_ID);

		this.on(this._minSlider, "onChange", (val) => {
			const maxValue = this._maxSlider.getValue();
			if (maxValue < val) {
				this._maxSlider.setValue(val + 1);
			}
		});

		this.on(this._maxSlider, "onChange", (val) => {
			const minValue = this._minSlider.getValue();
			if (minValue > val) {
				this._minSlider.setValue(val - 1);
			}
		});
	}

	setEdges(min, max) {
		this._range = {min, max};
		const maxValue = this._maxSlider.getValue();
		const minValue = this._minSlider.getValue();

		this._maxSlider.define("max", max);
		this._maxSlider.define("min", min + 1);
		this._minSlider.define("max", max - 1);
		this._minSlider.define("min", min);

		if (minValue > max || minValue < min) {
			this._minSlider.setValue(min);
		}
		if (maxValue > max || maxValue < min) {
			this._maxSlider.setValue(max);
		}
		this._maxSlider.refresh();
		this._minSlider.refresh();
	}
}
