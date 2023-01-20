import {JetView} from "webix-jet";
import ColorPicker from "../../../components/colorPicker";
import RangeSlider from "../../../components/rangeSlider";
import tilesCollection from "../../../../models/imageTilesCollection";
import ajaxActions from "../../../../services/ajaxActions";
import stateStore from "../../../../models/multichannelView/stateStore";
import TimedOutBehavior from "../../../../utils/timedOutBehavior";
import constants from "../../../../constants";
import RangeSwitch from "../../../components/rangeSwitch";
import HistogramChart from "../../../components/histogramChart";
import ScaleTypeToggle from "../../../components/scaleTypeToggle";

const FORM_ID = `color-form-${webix.uid()}`;
const HISTOGRAM_CHART_ID = `histogram-chart-${webix.uid()}`;
const HISTOGRAM_FORM_ID = `histogram-form-${webix.uid()}`;
const chartOverlay = "<div class='chart-overlay'></div>";

export default class ColorPickerWindow extends JetView {
	constructor(app) {
		super(app);

		this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
		const initialMaxEdge = stateStore.bit === constants.EIGHT_BIT ?
			constants.MAX_EDGE_FOR_8_BIT : constants.MAX_EDGE_FOR_16_BIT;
		this._rangeSlider = new RangeSlider(app, {}, 65000, 0);
		this._rangeSlider = new RangeSlider(app, {}, initialMaxEdge, 0);
		this._rangeSwitch = new RangeSwitch(app, {hidden: true}, initialMaxEdge, this._rangeSlider);
		this._histogramChart = new HistogramChart(this.app, {width: 330, height: 210, localId: HISTOGRAM_CHART_ID});
		this._histogramSlider = new RangeSlider(app, {}, initialMaxEdge, 0);
		this._scaleTypeToggle = new ScaleTypeToggle(
			app,
			{value: constants.LINEAR_SCALE_VALUE}
		);
	}

	config() {
		const colorPopup = {
			view: "window",
			css: "color-picker-popup",
			move: true,
			modal: false,
			width: 700,
			height: 850,
			body: {
				cols: [
					{
						view: "form",
						localId: HISTOGRAM_FORM_ID,
						elements: [
							this._histogramChart,
							this._histogramSlider,
							this._scaleTypeToggle
						]
					},
					{
						view: "form",
						localId: FORM_ID,
						elements: [
							this._colorPicker,
							this._rangeSlider,
							this._rangeSwitch,
							{
								cols: [
									{
										view: "button",
										css: "btn-contour",
										label: "Cancel",
										click: () => {
											this.getForm().setValues(this._initValues);
											this.applyChanges();
											this.savePosition();
											this.closeWindow();
										}
									},
									{},
									{
										view: "button",
										css: "btn",
										label: "Apply",
										click: () => {
											this.applyChanges();
											this.savePosition();
											this.closeWindow();
										}
									}
								]
							}
						]
					}
				]
			}
		};

		return colorPopup;
	}

	ready() {
		const chart = this._histogramChart.getRoot();
		webix.extend(chart, webix.OverlayBox);

		const form = this.getForm();
		this.on(this._colorPicker.$pickerTemplate(), "onColorChange", () => {
			this.getRoot().callEvent("colorChanged", [form.getValues()]);
		});

		const debounce = new TimedOutBehavior(200);
		this.on(form, "onChange", async () => {
			const values = this.getForm().getValues();
			this.getRoot().callEvent("colorChanged", [values]);
			debounce.execute(this.updateHistorgamHandler, this);
		});

		const toggleRangeSwitchVisibility = () => {
			const rangeSwitchRoot = this._rangeSwitch.getRoot();
			const isVisible = rangeSwitchRoot.isVisible();
			if (isVisible) {
				rangeSwitchRoot.hide();
			}
			else {
				rangeSwitchRoot.show();
			}
			return false;
		};
		this.on(this.getRoot(), "onShow", () => {
			webix.UIManager.addHotKey("Shift+S", toggleRangeSwitchVisibility);
		});
		this.on(this.getRoot(), "onHide", () => {
			webix.UIManager.removeHotKey("Shift+S", toggleRangeSwitchVisibility);
		});
		const histogramForm = this.getHistogramForm();
		histogramForm.attachEvent("onChange", async () => {
			debounce.execute(this.updateHistorgamHandler, this);
		});
	}

	showWindow(initValues, node, pos = "left") {
		try {
			this._initValues = webix.copy(initValues);
			const currentWindowPosition = webix.storage.cookie.get("colorPickerWindowPosition");
			if (currentWindowPosition) {
				this.getRoot().setPosition(currentWindowPosition.left, currentWindowPosition.top);
				this.getRoot().show();
			}
			else {
				this.getRoot().show(node, {pos});
			}
			this.getForm().setValues(initValues);

			this._histogramChart.getRoot().showOverlay(chartOverlay);
			this._getHistogramInfo()
				.then(([histogram]) => {
					this.setHistogramValues(histogram);
					this.setMinAndMaxValuesByHistogram(histogram);
				})
				.finally(() => {
					this._histogramChart.getRoot().hideOverlay();
				});
		}
		catch (err) {
			console.error(JSON.stringify(err.stack));
		}
	}

	savePosition() {
		const top = this.getRoot().$view.offsetTop;
		const left = this.getRoot().$view.offsetLeft;
		webix.storage.cookie.put("colorPickerWindowPosition", {top, left});
	}

	closeWindow() {
		this.getForm().clear();
		this.getRoot().hide();
	}

	applyChanges() {
		const form = this.getForm();
		this.getRoot().callEvent("applyColorChange", [form.getValues()]);
	}

	updateHistorgamHandler() {
		this._histogramChart.getRoot().showOverlay(chartOverlay);
		this._getHistogramInfo().then(([histogram]) => {
			this.setHistogramValues(histogram);
		})
			.finally(() => {
				this._histogramChart.getRoot().hideOverlay();
			});
	}

	setHistogramValues(histogram) {
		this._histogram = histogram;
		const yScale = this._scaleTypeToggle.getValue();
		const chartValues = histogram.hist.map((value, i) => {
			// xValue: i, yValue: value
			const bitMaxEdge = histogram.bin_edges[i + 1];
			const name = typeof bitMaxEdge === "number" ? bitMaxEdge.toFixed(2) : bitMaxEdge;
			return {value, name};
		});
		this._histogramChart.makeChart(chartValues, yScale);
	}

	setMinAndMaxValuesByHistogram({min, max}) {
		this._rangeSlider.setEdges(min, max);
		this._histogramSlider.setEdges(min, max);
		this._rangeSwitch.setMaxRange(max);
	}

	async _getHistogramInfo() {
		if (!this._image || !this._channel) {
			return;
		}
		const {min, max} = this.getHistogramForm().getValues();
		const tileInfo = await tilesCollection.getImageTileInfo(this._image);
		const binSettings = {
			width: tileInfo.sizeX,
			height: tileInfo.sizeY,
			rangeMin: min,
			rangeMax: max
		};

		return ajaxActions
			.getImageTilesHistogram(this._image._id, this._channel.index, binSettings);
	}

	getHistogramChart() {
		return this.$$(HISTOGRAM_CHART_ID);
	}

	getForm() {
		return this.$$(FORM_ID);
	}

	getHistogramForm() {
		return this.$$(HISTOGRAM_FORM_ID);
	}

	get _image() {
		return stateStore.image;
	}

	get _channel() {
		return stateStore.adjustedChannel;
	}
}
