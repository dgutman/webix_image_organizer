import {JetView} from "webix-jet";
import "../../../../components/activeList";
import ajaxActions from "../../../../../services/ajaxActions";
import webixViews from "../../../../../models/webixViews";
import utils from "../../../../../utils/utils";

let tagsItem;

export default class ImagesTagsWindow extends JetView {
	config() {
		const saveButton = {
			view: "button",
			name: "saveButtonName",
			value: "Save",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				if (this.listOfTagsToAdd.count() === 0) {
					return this.showWebixAlert("Add new tag to the list before saving!");
				}

				let itemTagData = [];
				let updatePromises = [];

				for (let key in tagsItem) {
					this.listOfTagsToAdd.find((obj) => {
						if (obj.id.indexOf(key) !== -1) {
							const splittedId = obj.id.split(":");
							const tagId = splittedId[splittedId.length - 1];

							if (tagsItem[key].length < 3) {
								itemTagData.push({
									[key]: tagId
								});
							}
							else {
								const itemTagIndex = itemTagData.findIndex(obj => obj.hasOwnProperty(key));
								if (itemTagIndex !== -1) {
									itemTagData[itemTagIndex][key].push(tagId);
								}
								else {
									itemTagData.push({
										[key]: [tagId]
									});
								}
							}
						}
					});
				}

				this.cartList.data.each((item) => {
					itemTagData.forEach((tag) => {
						if (!item.hasOwnProperty("meta") || typeof item.meta !== "object") {
							item.meta = {};
						}
						item.meta = Object.assign(item.meta, tag);
					});

					updatePromises.push(ajaxActions.updateItemMetadata(item._id, item.meta));
				});

				this.view.showProgress();
				webix.promise.all(updatePromises)
					.then((items) => {
						const metadataTemplate = webixViews.getMetadataTemplate();
						const metadataTemplateValues = metadataTemplate.getValues();
						const metadataItemId = metadataTemplateValues._id;
						const updatedItem = items.find(item => item._id === metadataItemId);

						if (updatedItem) metadataTemplate.parse(updatedItem);
						webix.message("Tags were successfully added to items");
						this.view.hideProgress();
						this.closeWindow();
					})
					.catch(() => {
						this.view.hideProgress();
						this.closeWindow();
					});
			}
		};

		const cancelButton = {
			view: "button",
			name: "cancelButton",
			css: "btn-contour",
			value: "Cancel",
			height: 30,
			width: 100,
			click: () => this.closeWindow()
		};

		const windowForm = {
			view: "form",
			borderless: true,
			elements: []
		};

		const listOfTagsToAdd = {
			view: "activeList",
			name: "listOfTagsToAddName",
			autoheight: true,
			css: "images-tags-active-list",
			activeContent: {
				deleteButton: {
					view: "button",
					type: "icon",
					css: "delete-icon-button",
					icon: "fas fa-times",
					width: 25,
					height: 25,
					click: (id) => {
						const deleteButton = $$(id);
						let listItemId = deleteButton.config.$masterId;
						this.listOfTagsToAdd.remove(listItemId);
					}
				}
			},
			template: (obj, common) => `<div>
						<div class='active-list-delete-button'>${common.deleteButton(obj, common)}</div>
 						<div class='active-list-name'>${obj.value}</div>
					</div>`

		};

		const scrollView = {
			view: "scrollview",
			borderless: true,
			body: {
				rows: [
					{
						margin: 10,
						type: "clean",
						cols: [
							windowForm
						]
					},
					{
						paddingY: 7,
						cols: [
							{
								template: "<span class='list-of-tags-template'>List of new tags to set</span>",
								name: "activeListTopTemplateName",
								height: 30,
								borderless: true
							}
						]
					},
					listOfTagsToAdd
				]
			}
		};

		const imagesTagsWindow = {
			view: "window",
			scroll: true,
			width: 400,
			height: 450,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: "Set new image tags",
						borderless: true
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
					scrollView,
					{height: 15},
					{
						cols: [
							{},
							saveButton,
							{width: 15},
							cancelButton,
							{width: 15}
						]
					},
					{height: 15}
				]
			}
		};

		return imagesTagsWindow;
	}

	ready(view) {
		this.view = view;
		webix.extend(this.view, webix.ProgressBar);
	}

	createSetFormElements() {
		let elements = [];
		const tagsItemId = this.imagesTagsCollection.getLastId();
		tagsItem = this.imagesTagsCollection.getItem(tagsItemId);
		if (tagsItem && tagsItem instanceof Object) {
			for (let key in tagsItem) {
				if (key !== "id") {
					const elementOptions = this.getElementOptions(tagsItem, key);
					const element = {
						cols: [
							{
								view: "richselect",
								css: "select-field",
								icon: utils.getSelectIcon(),
								name: `${key}-selectName`,
								labelWidth: 150,
								label: key,
								// tagIcon: tagIcon,
								options: elementOptions,
								validate: webix.rules.isNotEmpty,
								invalidMessage: "Value should not be empty"
							},
							{
								view: "button",
								type: "icon",
								icon: "fas fa-plus",
								id: key,
								width: 30,
								click: (id) => {
									const tagSelect = this.getTagsRichselect(id);

									if (tagSelect.validate()) {
										// add item to active tag list
										const tagSelectList = tagSelect.getList();
										const itemId = tagSelect.getValue();
										const selectedItem = tagSelectList.getItem(itemId);
										const listObjectData = `${key}: ${selectedItem.value}`;
										const listObjectId = `${key}:${itemId}`;
										const tagSelectListCount = tagSelectList.count();
										// const tagIcon = tagSelect.config.tagIcon;

										const foundMatches = this.listOfTagsToAdd.find((obj) => {
											if (obj.id === listObjectId || obj.id.indexOf(key) !== -1 && tagSelectListCount <= 2) {
												return obj;
											}
										});

										if (foundMatches.length === 0) {
											const listObjectToParse = {
												value: listObjectData,
												id: listObjectId
												// tagIcon: tagIcon
											};

											this.listOfTagsToAdd.parse(listObjectToParse);
										}
										else {
											// show needed alert text
											let alertText = tagSelectListCount > 2
												? "You already added this tag!"
												: `You only can add one ${key} tag!`;

											this.showWebixAlert(alertText);
										}
									}
								}
							}
						]
					};
					elements.push(element);
				}
			}
			webix.ui(elements, this.formView);
		}
		else {
			webix.message("Wrong data to add");
			this.closeWindow();
		}
	}

	getListOfTagsToAdd() {
		return this.getRoot().queryView({view: "activeList"});
	}

	getFormOfTags() {
		return this.getRoot().queryView({view: "form"});
	}

	getTagsRichselect(tagKey) {
		return this.getRoot().queryView({name: `${tagKey}-selectName`});
	}

	getElementOptions(tagsItem, tagKey) {
		let options = [];
		if (Array.isArray(tagsItem[tagKey])) {
			tagsItem[tagKey].forEach((tagItem) => {
				if (tagItem) options.push(tagItem);
			});
		}
		return options;
	}

	showWebixAlert(alertText) {
		webix.alert({
			type: "alert-warning",
			text: alertText
		});
	}

	showWindow(windowAction, imagesTagsCollection, cartList) {
		this.cartList = cartList;
		this.imagesTagsCollection = imagesTagsCollection;
		this.listOfTagsToAdd = this.getListOfTagsToAdd();
		this.formView = this.getFormOfTags();

		this.createSetFormElements();
		this.getRoot().show();
	}

	closeWindow() {
		this.listOfTagsToAdd.clearAll();
		this.formView.clear();
		this.getRoot().hide();
	}
}
