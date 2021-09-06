import {JetView} from "webix-jet";
import "../../../../../components/datatableCounter";

export default class AnnotationView extends JetView {
	constructor(app, name) {
		super(app, name);
		this.isDeleteButtonClicked = true;
		this.unclickableCss = "webix_unclickable_delete_icon";
	}

	config() {
		const popup = {
			view: "window",
			height: 500,
			width: 1050,
			position: "center",
			move: true,
			head: {
				view: "toolbar",
				borderless: true,
				padding: 20,
				cols: [
					{view: "label", label: "Annotations".toUpperCase(), inputWidth: 155, width: 155, inputHeight: 50, css: "annotation_label"},
					{
						view: "button",
						type: "iconButton",
						icon: "fa fa-plus",
						label: "ADD NEW LAYER",
						css: "login_button white_button",
						inputWidth: 170,
						height: 50,
						width: 200,
						click: () => {
							const inputBox = this.getRoot().queryView({name: "inputBox"});
							window.showAttentionPopup(() => {
								if (!inputBox.isVisible()) {
									inputBox.show();
								}
							});
						}
					},
					{width: 20},
					{
						cols: [
							{
								view: "text",
								inputWidth: 300,
								width: 300,
								label: "New Layer",
								name: "newLayerName",
								validate: webix.rules.isNotEmpty
							},
							{
								view: "button",
								type: "icon",
								icon: "fa fa-plus",
								hotkey: "enter",
								tooltip: "Add",
								inputWidth: 50,
								width: 50,
								click: () => {
									let textInput = this.getRoot().queryView({name: "inputBox"}).queryView({name: "newLayerName"});
									if (!textInput.getValue().trim()) {
										textInput.setValue("");
										webix.message({type: "error", text: "Incorrect layer name format."});
										webix.UIManager.setFocus(textInput.config.id);
										return;
									}
									if (textInput.validate()) {
										const newLayer = {
											value: textInput.getValue(),
											type: "layer",
											open: true,
											fillColor: "#00FF00",
											strokeColor: "#000000",
											data: []
										};

										this.app.callEvent("changeTreeannotations", [newLayer]);
										textInput.setValue("");
										textInput.refresh();
										let inputBox = this.getRoot().queryView({name: "inputBox"});
										if (inputBox.isVisible()) inputBox.hide();
									}
								}
							}
						],
						on: {
							onViewShow: () => {
								const textInput = this.getRoot().queryView({name: "inputBox"}).queryView({name: "newLayerName"});
								webix.UIManager.setFocus(textInput.config.id);
							}
						},
						hidden: true,
						name: "inputBox"
					},
					{},
					{
						view: "icon",
						icon: "fa fa-times",
						width: 40,
						click: () => {
							let inputBox = this.getRoot().queryView({name: "inputBox"});
							if (inputBox.isVisible()) inputBox.hide();
							this.hidePopup();
						}
					}
				]
			},
			body: {
				view: "datatableCounter",
				threeState: true,
				css: "datatableCounter",
				rowHeight: 40,
				editable: true,
				tooltip: "#value#",
				editaction: "click",
				select: true,
				columns: [
					{template: "<i class='fa fa-times-circle annotation_delete_icon'></i>", width: 47, id: "deleteButton", header: ""},
					{id: "id", width: 60, header: "ID"},
					{id: "value", header: "Name", width: 200, template: "{common.space()}{common.treecheckbox()}{common.icon()}#value#", editor: "text"},
					{id: "type", header: "Type", fillspace: true},
					{
						id: "fillColor",
						header: "Fill color",
						editor: "color",
						template: (obj) => {
							if (obj.fillColor) {
								return `
										<span class="color_preview" style="background-color: ${obj.fillColor};">
										</span>${obj.fillColor}`;
							}
							return "<i class=\"fa fa-eyedropper\" aria-hidden=\"true\"></i>";
						}
					},

					{
						id: "strokeColor",
						header: "Stroke color",
						width: 120,
						editor: "color",
						template: (obj) => {
							if (obj.strokeColor) {
								return `
										<span class="color_preview" style="background-color:${obj.strokeColor};">
										</span>${obj.strokeColor}`;
							}
							return "<i class=\"fa fa-eyedropper\" aria-hidden=\"true\"></i>";
						}
					},
					{
						id: "strokeOpacity",
						header: "Stroke opacity",
						template: (obj, common) => {
							return (obj.type === "layer") ? "" : `<div class='datatable-counter__counter'>${common.strokeOpacity(obj, common)}</div>`;
						},
						width: 120,
						height: 38
					},
					{
						id: "fillOpacity",
						header: "Fill opacity",
						template: (obj, common) => {
							return (obj.type === "layer") ? "" : `<div class='datatable-counter__counter'>${common.fillOpacity(obj, common)}</div>`;
						},
						width: 120,
						height: 38
					},
					{
						id: "strokeWidth",
						header: "Stroke width",
						template: (obj, common) => {
							return (obj.type === "layer") ? "" : `<div class='datatable-counter__counter'>${common.strokeWidth(obj, common)}</div>`;
						},
						width: 120,
						height: 38
					}
				],
				scheme: {
					$init: (obj) => {
						if (obj.type === "layer") {
							obj.open = true;
						}
					}
				},
				type: {
					fillOpacity: function (obj, common) {
						return `<div class='webix_el_box'>
							<div role='spinbutton' class='webix_el_group'>
								<button class='decrease_button'>-</button><!--
								--><input class='counter_value' type='text' max='0.95' min='0.05' name='${obj.id}_fillOpacity' value='${obj.fillOpacity ? obj.fillOpacity : 0.05}'><!--
								--><button class='increase_button'>+</button>
							</div>
						</div>`;
					},
					strokeOpacity: function (obj, common) {
						return `<div class='webix_el_box'>
							<div class='webix_el_group'>
								<button class='decrease_button'>-</button><!--
								--><input class='counter_value' type='text' max='1' min='0' name='${obj.id}_strokeOpacity' value='${obj.strokeOpacity ? obj.strokeOpacity : 0}'><!--
								--><button class='increase_button'>+</button>
							</div>
						</div>`;
					},
					strokeWidth: function (obj, common) {
						return `<div class='webix_el_box'>
							<div role='spinbutton' aria-label aria-valuemin='0.1' aria-valuemax='1' aria-valuenow='0.9' class='webix_el_group'>
								<button class='decrease_button'>-</button><!--
								--><input class='counter_value' type='text' max='3' min='0' name='${obj.id}_strokeWidth' value='${obj.strokeWidth ? obj.strokeWidth : 0}'><!--
								--><button class='increase_button'>+</button>
							</div>
						</div>`;
					}
				},
				onClick: {
					"fa-times-circle": (ev, id) => {
						if (!this.isDeleteButtonClicked) return false;
						const curFunc = () => {
							let table = this.getRoot().queryView({view: "datatableCounter"});
							let item = table.getItem(id.row);
							if (item.type === "layer") {
								let curAnnotationToDeleteID = table.getFirstChildId(item.id);
								while (curAnnotationToDeleteID) {
									let curAnnotationToDelete = table.getItem(curAnnotationToDeleteID);
									table.remove(curAnnotationToDelete.id);
									this.app.callEvent("deleteAnnotation", [curAnnotationToDelete, item, table]);
									curAnnotationToDeleteID = table.getFirstChildId(item.id);
								}
								this.app.callEvent("deleteLayer", [item, table]);
								this.app.callEvent("changeTreeannotations", []);
							}
							else {
								table.remove(item.id);
								this.app.callEvent("deleteAnnotation", ["", item, table]);
							}
						};
						window.showAttentionPopup(curFunc);
						return false;
					},
					"counter_value": () => {
						window.showAttentionPopup();
						return false;
					},
					"decrease_button" : function(ev, id) {
						window.showAttentionPopup();
						const operation = "subtraction";
						this.$scope.updateCounterValue(id, operation);
					},
					"increase_button" : function(ev, id) {
						window.showAttentionPopup();
						const operation = "addition";
						this.$scope.updateCounterValue(id, operation);
					}
				},
				on: {
					onItemCheck: () => {
						let table = this.getRoot().queryView({view: "datatableCounter"});
						this.app.callEvent("treecheckboxesClickedLabelsChecked", [table]);
					},
					onBeforeEditStop: (values, editor) => {
						window.showAttentionPopup(() => {
							if (editor.column === "value" && values.value === "") values.value = values.old;
						});
					},
					onAfterEditStop: (state, editor) => {
						let table = this.getRoot().queryView({view: "datatableCounter"});
						let item = table.getItem(editor.row);
						this.app.callEvent("afterEditStop", [item, editor, state]);
					},
					onAfterRender: () => {
						if (this.getRoot()) {
							let datatableCounter = this.getRoot().queryView({view: "datatableCounter"});
							const firstRow = datatableCounter.getFirstId();
							let itemNode;
							if (firstRow) itemNode = datatableCounter.getItemNode(firstRow);

							if (datatableCounter.count() === 1 && itemNode && itemNode.querySelector("i")) {
								this.isDeleteButtonClicked = false;
								itemNode.querySelector("i").classList.toggle(this.unclickableCss, true);
							}
							else if (itemNode && itemNode.querySelector("i")) {
								this.isDeleteButtonClicked = true;
								itemNode.querySelector("i").classList.toggle(this.unclickableCss, true);
							}
							// add event handlers to counters
							if (this && this.getRoot()) {
								let counterValues = this.getRoot().getNode().querySelectorAll(".counter_value");
								if (counterValues) {
									for (let i = 0, counterValuesLength = counterValues.length;
										i < counterValuesLength;
										i++) {
										if (counterValues[i]) {
											counterValues[i].addEventListener("change", ((ref) => {
												return function(event) {
													let table = ref.getRoot().queryView({view: "datatableCounter"});
													let value = event.target.value;
													const [row, column] = ref.parseInputCounterName(this.name);
													if (!/^[0-9\.]+$/.test(value) || value > this.max || value < this.min) {
														this.value = event.target.defaultValue;
														return;
													}
													const item = table.getItem(row);
													ref.app.callEvent("editFigureParametrs", [item, column, value]);
												};
											})(this));
										}
									}
								}
							}
						}
					}
				}
			}
		};

		return popup;
	}

	init() {
		this.on(this.app, "annotationTableParse", (treeannotation) => {
			const datatableCounter = this.getRoot().queryView({view: "datatableCounter"});
			if (treeannotation) {
				datatableCounter.clearAll();
				datatableCounter.parse(treeannotation);
			}
		});
		this.on(this.app, "annotationUpdateItem", (item) => {
			const datatableCounter = this.getRoot().queryView({view: "datatableCounter"});
			if (item) {
				datatableCounter.updateItem(item.id, item);
			}
		});
	}

	showPopup() {
		this.getRoot().show();
		this.app.callEvent("annotationTableParse", []);
	}

	hidePopup() {
		this.getRoot().hide();
	}

	updateCounterValue(id, operation) {
		window.showAttentionPopup();
		const column = id.column;
		const item = this.getItem(id);
		const oldValue = +item[column];
		let newValue = null;
		let value = null;
		let min = null;
		let max = null;
		let step = null;
		if (column === "strokeWidth") {
			min = 0;
			max = 3;
			step = 0.2;
		}
		else if (column === "strokeOpacity") {
			min = 0;
			max = 1;
			step = 0.1;
		}
		else if (column === "fillOpacity") {
			min = 0.05;
			max = 0.95;
			step = 0.1;
		}
		if (operation === "subtraction") {
			newValue = oldValue - step;
		}
		else if (operation === "addition") {
			newValue = oldValue + step;
		}
		if (!/^[0-9\.]+$/.test(newValue) || newValue > max || newValue < min) {
			return;
		}
		else {
			item[column] = newValue.toFixed(1);
			value = newValue.toFixed(1);
		}
		this.app.callEvent("editFigureParametrs", [item, column, value]);
	}

	parseInputCounterName(name) {
		const row = name.slice(0, name.indexOf("_"));
		const column = name.slice(name.indexOf("_") + 1);
		return [row, column];
	}
}
