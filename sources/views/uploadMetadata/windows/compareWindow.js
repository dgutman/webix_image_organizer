
import {JetView} from "webix-jet";
import dot from "dot-object";
import utils from "../../../utils/utils";
import "../../components/jsonViewer";

let action = "";

function getJsonViewerColumnConfig(viewerName, header) {
	return {
		css: "compare-metadata-column",
		rows: [
			{
				template: header,
				css: {
					"text-align": "center",
					"font-weight": 600,
					"font-size": "16px"
				},
				borderless: true,
				autoheight: true,
				width: 200
			},
			{
				view: "json-viewer",
				name: viewerName,
				borderless: true,
				height: 400
			}
		]
	};
}

export default class CompareMetadataWindow extends JetView {
	config() {
		const existedMetadataViewerCol = getJsonViewerColumnConfig("existedMetadataViewer", "Existing metadata:");
		const newMetadataViewerCol = getJsonViewerColumnConfig("newMetadataViewer", "New metadata:");

		const checkbox = {
			view: "checkbox",
			name: "checkbox",
			css: "checkbox-ctrl",
			width: 500,
			labelWidth: 0,
			labelRight: "Apply to all similar cases and don't ask me anymore in ongoing upload",
			value: 0
		};

		const confirmButton = {
			view: "button",
			css: "btn-contour",
			name: "confirmButton",
			value: "Yes",
			height: 30,
			width: 100
		};

		const cancelButton = {
			view: "button",
			css: "btn",
			name: "cancelButton",
			value: "No",
			height: 30,
			width: 100
		};

		const window = {
			view: "window",
			css: "metadata-uploading-window",
			paddingX: 35,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: obj => obj.name,
						borderless: true
					}
				]
			},
			body: {
				paddingX: 10,
				rows: [
					{
						template: "Are you sure you want to substitute existing data with the new one?",
						css: {
							"text-align": "center",
							"font-weight": 500,
							"font-size": "17px"
						},
						height: 30,
						width: 550,
						borderless: true
					},
					{
						paddingY: 10,
						cols: [
							existedMetadataViewerCol,
							{minWidth: 50},
							newMetadataViewerCol
						]
					},
					{
						margin: 10,
						cols: [
							checkbox,
							{height: 30},
							confirmButton,
							cancelButton
						]
					},
					{height: 10}
				]
			}
		};

		return window;
	}

	ready(view) {
		this.currentJob = Promise.resolve(false);
		this.headerTemplate = view.queryView({name: "headerTemplateName"});
		this.existedMetadataViewer = view.queryView({name: "existedMetadataViewer"});
		this.newMetadataViewer = view.queryView({name: "newMetadataViewer"});
		this.checkbox = view.queryView({name: "checkbox"});
	}

	showWindow(obj) {
		if (this.checkbox.getValue() && action) {
			const meta = action === "skip" ? obj.partialMetaToUpdate : obj.metaToUpdate;
			return Promise.resolve({meta, itemId: obj.id, metaId: obj.metaId});
		}

		const confirmButton = this.getRoot().queryView({name: "confirmButton"});
		const cancelButton = this.getRoot().queryView({name: "cancelButton"});
		this.headerTemplate.setValues(obj);
		this.existedMetadataViewer.setValue(obj.exMetadata);
		this.newMetadataViewer.setValue(obj.newMetadata);
		if (!this.getRoot().isVisible()) this.getRoot().show();

		let confirmID;
		let cancelID;
		return new Promise((resolve) => {
			confirmID = confirmButton.attachEvent("onItemClick", () => {
				if (this.checkbox.getValue()) action = "update";
				resolve({meta: obj.metaToUpdate, itemId: obj.id, metaId: obj.metaId});
			});
			cancelID = cancelButton.attachEvent("onItemClick", () => {
				if (this.checkbox.getValue()) action = "skip";
				resolve({meta: obj.partialMetaToUpdate, itemId: obj.id, metaId: obj.metaId});
			});
		})
			.finally(() => {
				this.closeWindow();
				confirmButton.detachEvent(confirmID);
				cancelButton.detachEvent(cancelID);
			});
	}

	closeWindow() {
		this.getRoot().hide();
	}

	compareMetadata(item, meta, rootValue, metaId) {
		const {rootKey, itemRoot} = this.getItemRoot(rootValue, item);

		const itemFieldsToCompare = {};
		const dottedMeta = dot.dot(meta);
		let newFieldsToCompare = dottedMeta;
		let notExistedNewFields = dottedMeta;

		notExistedNewFields = {};
		if (rootKey && !utils.isObject(itemRoot)) {
			itemFieldsToCompare[rootKey] = itemRoot;
		}
		else {
			newFieldsToCompare = {};
			Object.keys(dottedMeta).forEach((field) => {
				const value = dot.pick(field, item.meta || {});
				if (value !== undefined && value !== dottedMeta[field]) {
					itemFieldsToCompare[field] = value;
					newFieldsToCompare[field] = dottedMeta[field];
				}
				else notExistedNewFields[field] = dottedMeta[field];
			});
		}

		const {metaToUpdate, partialMetaToUpdate} = this.getMetaToUpdate(item.meta, rootKey, dot.object(dottedMeta), dot.object(notExistedNewFields));

		// if item already has similar fields with different data, add item to compare data
		if (Object.keys(itemFieldsToCompare).length) {
			const obj = {
				exMetadata: dot.object(itemFieldsToCompare),
				newMetadata: dot.object(newFieldsToCompare),
				partialMetaToUpdate,
				metaToUpdate,
				id: item.id,
				metaId,
				name: item.name
			};
			return this.addItem(obj);
		}
		return Promise.resolve({meta: metaToUpdate, itemId: item.id, metaId});
	}

	getMetaToUpdate(itemMeta, rootKey, fullMeta, newNotExisted) {
		const mainRootKey = rootKey ? rootKey.split(".")[0] : "";
		if (mainRootKey) {
			const existedMeta = utils.isObject(itemMeta[mainRootKey]) ? webix.copy(itemMeta[mainRootKey]) : itemMeta[mainRootKey];

			const metaToUpdate = utils.mergeDeep({[mainRootKey]: existedMeta}, fullMeta);
			const partialMetaToUpdate = utils.isObject(existedMeta) ? utils.mergeDeep({[mainRootKey]: existedMeta}, newNotExisted) : {[mainRootKey]: existedMeta};
			return {metaToUpdate, partialMetaToUpdate};
		}
		return {metaToUpdate: fullMeta, partialMetaToUpdate: newNotExisted};
	}

	getItemRoot(rootKey, item) {
		const itemRoot = rootKey ? dot.pick(rootKey, item.meta || {}) : item.meta || {};
		if (!itemRoot) return this.getItemRoot(rootKey.replace(/(\.[A-Za-z0-9_]+|[A-Za-z0-9_]+)$/, ""), item);
		return {itemRoot, rootKey};
	}

	addItem(obj) {
		if (this.checkbox.getValue() && action) {
			const meta = action === "skip" ? obj.partialMetaToUpdate : obj.metaToUpdate;
			return Promise.resolve({meta, itemId: obj.id, metaId: obj.metaId});
		}
		return this.addJobToQueue(this.showWindow.bind(this), obj);
	}

	addJobToQueue(fn, ...args) {
		this.currentJob = this.currentJob.then(() => fn(...args));
		return this.currentJob;
	}

	loadingEnded() {
		this.closeWindow();
		this.checkbox.setValue(0);
		action = "";
		this.currentJob = Promise.resolve(false);
	}
}
