import {JetView} from "webix-jet";
import ajaxActions from "../../../../services/ajaxActions";
import "../../../components/activeList";
import webixViews from "../../../../models/webixViews";

let parsedData = [];
let largeImageButton;

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
			value: "Save",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				const largeImagePromises = [];
				const galleryDataview = webixViews.getGalleryDataview();
				this.view.showProgress();
				parsedData = [];
				this.windowList.data.each((obj) => {
					if (obj.markListCheckbox) largeImagePromises.push(ajaxActions.makeLargeImage(obj._id));
					else parsedData.push(obj);
				});

				Promise.all(largeImagePromises)
					.then((data) => {
						const itemPromises = [];
						data.forEach((largeImage) => {
							if (largeImage.meta) {
								const itemId = largeImage.meta.itemId;
								itemPromises.push(ajaxActions.getItem(itemId));
							}
						});
						Promise.all(itemPromises)
							.then((items) => {
								items.forEach((item) => {
									galleryDataview.find((galleryItem) => {
										if (galleryItem._id === item._id) {
											galleryDataview.updateItem(galleryItem.id, item);
										}
									});
								});

								if (!parsedData.length) {
									largeImageButton.hide();
									this.close();
								}
								else {
									this.windowList.clearAll();
									this.windowList.parse(parsedData);
								}

								this.view.hideProgress();
							});
					})
					.catch(() => this.view.hideProgress());
			}
		};

		const windowActiveList = {
			view: "activeList",
			borderless: true,
			name: "makeLargeImageWindowActiveListName",
			activeContent: {
				markListCheckbox: {
					view: "checkbox",
					css: "checkbox-ctrl",
					width: 20,
					height: 20,
					// on: {
					// 	onItemClick: (id) => {
					// 		const checkBox = $$(id);
					// 		const listItemId = checkBox.config.$masterId;
					// 		const listItem = this.windowList.getItem(listItemId);
					// 		const value = checkBox.getValue();
					// 		console.log(listItem);
					// 		if (!value) {
					// 			let itemIndex = parsedData.findIndex((parsedObject) => {
					// 				if (parsedObject._id === listItem._id) {
					// 					return parsedObject;
					// 				}
					// 			});
					// 			parsedData.splice(itemIndex, 1);
					// 		}
					// 		else {
					// 			let itemIndex = parsedData.findIndex((parsedObject) => {
					// 				if (parsedObject._id === listItem._id) {
					// 					return parsedObject;
					// 				}
					// 			});
					// 			if (itemIndex === -1) {
					// 				parsedData.push(listItem);
					// 			}
					// 		}
					// 	}
					// }
				}
			},
			template: (obj, common) => `<div title='${obj.name}' class='large-image-window'>
						<div class='image-window-checkbox'>${common.markListCheckbox(obj, common)}</div>
 						<div class='image-window-list-name'>${obj.name}</div>
					</div>`
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
						icon: "fas fa-times",
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
					{height: 10},
					{
						cols: [
							{},
							saveButton,
							{width: 10},
							cancelButton,
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

	showWindow(data, button) {
		parsedData = data;
		largeImageButton = button;
		parsedData.forEach((dataObject) => {
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
