import {JetView} from "webix-jet";
import constants from "../../../../constants";
import ajax from "../../../../services/ajaxActions";
import webixViews from "../../../../models/webixViews";
import recognizedItemsModel from "../../../../models/recognizedItems";

const MAX_ITEMS_PER_REQUEST = 100;
let errorsArray = [];

export default class RecognitionServiceWindow extends JetView {
	config() {
		const recognitionServiceWindow = {
			view: "window",
			name: "recognitionServiceWindow",
			position: "center",
			move: true,
			modal: true,
			head: {
				height: 35,
				cols: [
					{
						view: "label",
						css: "window-header-label",
						name: "recognitionServiceWindowHead",
						label: "Choose recognition options"
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				rows: [
					{
						borderless: true,
						view: "form",
						name: "recognitionServiceWindowForm",
						elements: this.getOptions(),
						elementsConfig: {
							labelWidth: 100
						}
					},
					{
						padding: 10,
						cols: [
							{},
							{
								view: "button",
								name: "recognizeButton",
								width: 90,
								css: "btn",
								value: "Recognize",
								click: () => this.handleRecognizeBtnClick()
							}
						]
					}
				]}
		};

		return recognitionServiceWindow;
	}

	init(view) {
		this._view = view;
		this.form = this.getForm();
		webix.extend(this._view, webix.ProgressBar);
	}

	getPopup() {
		return this.getRoot();
	}

	getForm() {
		return this.getRoot().queryView({name: "recognitionServiceWindowForm"});
	}

	showWindow(finder, finderFolder, dataview, statusTemplate) {
		this._finder = finder;
		this._finderFolder = finderFolder;
		this._dataview = dataview;
		this._statusTemplate = statusTemplate;
		this.getRoot().show();
	}

	closeWindow() {
		this.getRoot().hide();
	}

	checkVisibility() {
		const popup = this.getInfoPopup();
		return popup.isVisible();
	}

	toggleVisibility() {
		if (this.checkVisibility()) {
			this.closeWindow();
		}
		else {
			this.showWindow();
		}
	}

	getOptions() {
		const options = Object.values(constants.RECOGNITION_OPTION_IDS);
		const checkboxes = options.map((option) => {
			let name;
			let value;
			switch (option) {
				case constants.RECOGNITION_OPTION_IDS.MARKER: {
					name = constants.RECOGNITION_OPTION_IDS.MARKER;
					value = "marker";
					break;
				}
				case constants.RECOGNITION_OPTION_IDS.STICKER: {
					name = constants.RECOGNITION_OPTION_IDS.STICKER;
					value = "sticker";
					break;
				}
				case constants.RECOGNITION_OPTION_IDS.LABEL: {
					name = constants.RECOGNITION_OPTION_IDS.LABEL;
					value = "label";
					break;
				}
				default:
					break;
			}
			option = {
				view: "checkbox",
				name,
				label: name,
				css: "checkbox-ctrl",
				value,
				uncheckValue: false,
				checkValue: value
			};
			return option;
		});
		return checkboxes;
	}

	handleRecognizeBtnClick() {
		let message;
		this.validOptions = this.getValidOptions();
		recognizedItemsModel.setValidOptions(this.validOptions);
		const items = this.images || [];
		if (this._finderFolder && !this._finder.isBranchOpen(this._finderFolder.id)) {
			message = "You have to open folder before running";
		}
		if (!items.length) {
			message = "There are no images to recognize in";
		}
		else if (!this.validOptions.length) {
			message = "You have to choose at least one option";
		}
		else {
			const itemIds = items.map(item => item._id);
			recognizedItemsModel.clearProcessedItems();
			this.runRecognizeService(this.validOptions, itemIds);
			return;
		}
		webix.alert({
			text: message,
			type: "alert-warning"
		});
	}

	sliceItemIds(itemIds, start, end) {
		let slicedIds;
		if (itemIds.length > MAX_ITEMS_PER_REQUEST) {
			slicedIds = itemIds.slice(start || 0, end || MAX_ITEMS_PER_REQUEST);
		}
		else {
			slicedIds = itemIds;
		}
		return slicedIds;
	}

	setItemsToRecognize(items) {
		if (!Array.isArray(items)) {
			items = [items];
		}
		this.images = items.map(image => webix.copy(image));
	}

	runRecognizeService(options, itemIds) {
		const recognizeButton = this.getRoot().queryView({name: "recognizeButton"});
		const statuses = constants.LOADING_STATUSES;
		let slicedItemIds = this.sliceItemIds(itemIds);
		statuses.IN_PROGRESS.count = this.images.length;
		statuses.IN_PROGRESS.recognized = this.images.length - itemIds.length;
		this.setTemplateStatus(statuses.IN_PROGRESS);
		recognizeButton.disable();
		this.closeWindow();
		webix.promise.all(options.map(option => ajax.recognizeOption(slicedItemIds, option)))
			.then((data) => {
				const itemsModel = webixViews.getItemsModel();
				const itemsWithMeta = this.parseDataFromService(data, slicedItemIds);
				itemsModel.updateItems(itemsWithMeta);
				recognizedItemsModel.addProcessedItems(itemsWithMeta);
				if (slicedItemIds.length < itemIds.length) {
					itemIds = itemIds.slice(MAX_ITEMS_PER_REQUEST);
					this.runRecognizeService(options, itemIds);
				}
				else {
					statuses.WARNS.errors = errorsArray;
					statuses.WARNS.errorsCount = errorsArray.length;
					const finalStatus = errorsArray.length ? statuses.WARNS : statuses.DONE;
					recognizeButton.enable();
					this.setTemplateStatus(finalStatus);
					errorsArray = [];
				}
			})
			.catch((xhr) => {
				statuses.ERROR.text = xhr.responseText || "Unidentified error";
				recognizeButton.enable();
				this.setTemplateStatus(statuses.ERROR);
			});
	}

	parseDataFromService(data, itemIds) {
		const itemsModel = webixViews.getItemsModel();
		const dataCollection = itemsModel.getDataCollection();
		const items = itemIds.map((itemId) => {
			let foundedItem = dataCollection.find(item => itemId === item._id, true) || this.images.find(item => itemId === item._id);
			return webix.copy(foundedItem);
		});
		data.forEach((resultsArray, i) => {
			switch (this.validOptions[i]) {
				case "sticker":
					this.parseSingleDataArray(resultsArray, items, "stickers");
					break;
				case "marker":
					this.parseSingleDataArray(resultsArray, items, "marker");
					break;
				case "label":
					this.parseSingleDataArray(resultsArray, items, "label");
					break;
				default:
					break;
			}
		});
		return items;
	}

	parseSingleDataArray(array, items, option) {
		array
			.forEach((item) => {
				if (item.status === "ok") {
					const foundedItem = items
						.find(image => item.id === image._id);
					if (foundedItem) {
						if (!foundedItem.meta) {
							foundedItem.meta = {};
						}
						if (option === "label") {
							foundedItem.meta.ocrRawText = unescape(item.results);
						}
						else {
							foundedItem.meta[option] = item.results;
						}
					}
				}
				else {
					errorsArray.push({option, data: item});
				}
			});
	}

	setTemplateStatus(status) {
		this._statusTemplate.setValues(status);
		this._statusTemplate.show();
	}

	getValidOptions() {
		const formValues = this.form.getValues();
		const optionValues = Object.values(formValues);
		return optionValues.filter(option => option);
	}
}
