import {JetView} from "webix-jet";
import constants from "../../constants";

const maxEdgeFor8BitId = 1;
const maxEdgeFor16BitId = 2;

export default class RangeSwitch extends JetView {
	constructor(app, config = {}, maxRange, rangeSlider) {
		super(app, config);

		this._cnf = config;
		this._maxRange = maxRange;
		this._rangeSlider = rangeSlider;
	}

	ready() {
		this._maxRangeRadio = this.$$("max-range-radio-id");
		if (this._maxRange > constants.MAX_EDGE_FOR_8_BIT) {
			this._maxRangeRadio.setValue(maxEdgeFor16BitId);
		}
		else {
			this._maxRangeRadio.setValue(maxEdgeFor8BitId);
		}
		this._maxRangeRadio.attachEvent("onChange", (id) => {
			this._rangeSlider.setEdges(0, this._maxRangeRadio.getOption(id).edge);
		});
	}

	config() {
		return {
			...this._cnf,
			id: this._rootId,
			rows: [
				{
					view: "radio",
					localId: "max-range-radio-id",
					label: "",
					vertical: false,
					options: [
						{
							id: maxEdgeFor8BitId,
							value: "8bit",
							edge: constants.MAX_EDGE_FOR_8_BIT
						},
						{
							id: maxEdgeFor16BitId,
							value: "16bit",
							edge: constants.MAX_EDGE_FOR_16_BIT
						}
					]
				}
			]
		};
	}

	setMaxRange(maxRange) {
		if (maxRange > constants.MAX_EDGE_FOR_8_BIT) {
			this._maxRangeRadio.setValue(maxEdgeFor16BitId);
		}
		else {
			this._maxRangeRadio.setValue(maxEdgeFor8BitId);
		}
	}
}
