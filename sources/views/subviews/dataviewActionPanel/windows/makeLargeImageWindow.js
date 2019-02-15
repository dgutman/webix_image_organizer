import {JetView} from "webix-jet";
import ajaxActions from "../../../../services/ajaxActions";
import "../../../components/activeList";
import webixViews from "../../../../models/webixViews";

let parsedData = [];

export default class MakeLargeImageWindow extends JetView {
	config() {

		const cancelButton = {
			view: "button",
			css: "btn-contour",
			name: "cancelButton",
			value: "Close",
			height: 30,
			width: 100,
			click: () => this.close()
		};

		const saveButton = {
			view: "button",
			name: "saveButton",
			value: "Okay",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				let arrayOfResolvedPromisses = [];
				this.view.showProgress();
				parsedData.forEach((parsedObject) => {
					arrayOfResolvedPromisses.push(ajaxActions.makeLargeImage(parsedObject._id));
				});
				webix.promise.all(arrayOfResolvedPromisses)
					.then(() => {
						webixViews.getGalleryDataview().refresh();
						this.view.hideProgress();
					})
					.fail((error) => {
						webix.message(error);
						this.view.hideProgress();
					});
			}
		};

		const windowActiveList = {
			view: "activeList",
			borderless: true,
			tooltip: (obj) => obj.name,
			name: "makeLargeImageWindowActiveListName",
			activeContent: {
				markListCheckbox: {
					view: "checkbox",
					css: "checkbox-ctrl",
					width: 20,
					height: 20,
					on: {
						onItemClick: (id) => {
							const checkBox = $$(id);
							let listItemId = checkBox.config.$masterId;
							let listItem = this.windowList.getItem(listItemId);
							let value = checkBox.getValue();
							if (!value) {
								let itemIndex = parsedData.findIndex((parsedObject) => {
									if (parsedObject._id === listItem._id) {
										return parsedObject;
									}
								});
								parsedData.splice(itemIndex, 1);
							} else {
								let itemIndex = parsedData.findIndex((parsedObject) => {
									if (parsedObject._id === listItem._id) {
										return parsedObject;
									}
								});
								if (itemIndex === -1) {
									parsedData.push(listItem);
								}
							}
						}
					}
				}
			},
			template: (obj, common) => {
				return `<div class='large-image-window'>
						<div class='image-window-checkbox'>${common.markListCheckbox(obj, common)}</div>
 						<div class='image-window-list-name'>${obj.name}</div>
					</div>`;
			},
		};

		const makeLargeImageWindow = {
			view: "window",
			css: "metadata-window-body",
			paddingX: 35,
			width: 300,
			height: 400,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplate",
						template: "Make large images",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "times",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: {
				borderless: true,
				rows: [
					windowActiveList,
					{height: 5},
					{
						cols: [
							{},
							cancelButton,
							{width: 10},
							saveButton,
							{width: 20}
						]
					},
					{height: 5}
				]
			}
		};
		return makeLargeImageWindow;
	}

	init(view) {
		this.view = view;
		this.windowList = this.getWindowList();
		webix.extend(this.view, webix.ProgressBar);
	}

	getWindowList() {
		return this.getRoot().queryView({name: "makeLargeImageWindowActiveListName"});
	}

	showWindow(data) {
		parsedData = data;
		data.forEach((dataObject) => {
			dataObject.markListCheckbox = true;
			this.windowList.parse(dataObject);
		});
		this.getRoot().show();
	}

	close() {
		this.windowList.clearAll();
		this.getRoot().hide();
	}

}
