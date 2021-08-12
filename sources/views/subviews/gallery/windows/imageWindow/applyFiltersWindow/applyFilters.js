import {JetView} from "webix-jet";

export default class ApplyFiltersView extends JetView {
	constructor(app, name) {
		super(app, name);
		this.defaultValues = {
			blur: 0,
			brightness: 100,
			contrast: 100,
			grayscale: 0,
			hue_rotate: 0,
			invert: 0,
			saturate: 100
		};
		this.slidesFilter = {};
	}

	config() {
		const popup = {
			view: "window",
			height: 500,
			width: 400,
			position: "center",
			move: true,
			head: {
				view: "toolbar",
				borderless: true,
				padding: 10,
				cols: [
					{view: "label", label: "Slide Filters"},
					{
						view: "icon",
						icon: "fa fa-times",
						click: () => {
							this.hideWindow();
						}
					}
				]
			},
			body: {
				view: "form",
				elements: [
					{
						view: "slider",
						name: "contrast",
						label: "Contrast",
						value: 100,
						max: 100,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Brightness",
						name: "brightness",
						value: 100,
						max: 100,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Saturation",
						name: "saturate",
						value: 100,
						max: 100,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Hue Rotate",
						name: "hue_rotate",
						value: 0,
						max: 360,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Invert",
						name: "invert",
						value: 0,
						max: 100,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Blur",
						value: 0,
						name: "blur",
						max: 10,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "slider",
						label: "Grayscale",
						name: "grayscale",
						value: 0,
						max: 100,
						title: webix.template("Selected: #value#"),
						on: {
							onSliderDrag: () => {
								this.apply();
							},
							onChange: () => {
								this.apply();
							}
						}
					},
					{
						view: "button",
						value: "Reset All",
						click: () => {
							this.reset();
						}
					}
				]
			}
		};

		return popup;
	}

	setItemId(id) {
		this.itemId = id;
	}

	getItemId() {
		return this.itemId;
	}

	init() {
		this.on(this.app, "setFilters", (id) => {
			this.setItemId(id);
			this.reset();
			if (!this.slidesFilter.hasOwnProperty(`${id}`)) {
				this.reset();
			}
			else if (this.slidesFilter.hasOwnProperty(`${id}`)) {
				const form = this.getRoot().queryView({view: "form"});
				form.setValues(this.slidesFilter[id]);
			}
		});
	}

	hideWindow() {
		if (this.getItemId()) {
			const form = this.getRoot().queryView({view: "form"});
			const values = form.getValues();
			this.slidesFilter[this.getItemId()] = values;
		}
		this.getRoot().hide();
	}

	showWindow() {
		this.getRoot().show();
		const form = this.getRoot().queryView({view: "form"});
		this.refreshSliders(form.getChildViews());
	}

	apply() {
		const form = this.getRoot().queryView({view: "form"});
		let values = form.getValues();
		const css = `
						contrast(${values.contrast}%) 
						brightness(${values.brightness}%) 
						hue-rotate(${values.hue_rotate}deg) 
						saturate(${values.saturate}%) 
						invert(${values.invert}%) 
						grayscale(${values.grayscale}%) 
						blur(${values.blur}px)`;
		const openseadragonCanvas = document.querySelector(".openseadragon-canvas");
		openseadragonCanvas.style.webkitFilter = css;
	}

	refreshSliders(array) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].config.view === "slider") {
				array[i].refresh();
			}
		}
	}

	reset() {
		const form = this.getRoot().queryView({view: "form"});
		form.setValues(this.defaultValues);
	}
}
