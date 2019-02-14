import {JetView} from "webix-jet";
import "../../components/activeList";
import ajaxActions from "../../../services/ajaxActions";

let tagsItem;

export default class SetImagesTagsWindow extends JetView {
	config() {
		const saveButton = {
			view: "button",
			name: "saveButton",
			value: "Save",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				let itemTagData = {};

				for (let key in tagsItem) {
					this.listOfTagsToAdd.find((obj) => {
						if (obj.id.indexOf(key) !== -1) {
							const splittedId = obj.id.split(":");
							const tagId = splittedId[splittedId.length - 1];

							if (tagsItem[key].length <= 3) {
								itemTagData[key] = tagId;
							} else {
								if (itemTagData.hasOwnProperty(key)) {
									itemTagData[key].push(tagId);
								} else {
									itemTagData[key] = [tagId];
								}
							}

						}
					});
				}

				const itemTagDataToUpdate = JSON.stringify(itemTagData);

				let updatePromises = [];
				this.cartList.data.each((obj) => {
					updatePromises.push(ajaxActions.updateItemTag(obj._id, itemTagDataToUpdate));
				});

				this.view.showProgress();
				webix.promise.all(updatePromises)
					.then(() => {
						webix.message("Tags were successfully added to items");
						this.view.hideProgress();
						this.closeWindow();
					})
					.fail(() => {
						this.view.hideProgress();
						this.closeWindow();
					})
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

		const formOfTags = {
			view: "form",
			borderless: true,
			elements: []
		};

		const listOfTagsToAdd = {
			view: "activeList",
			name: "listOfTagsToAddName",
			css: "images-tags-active-list",
			autoheight: true,
			activeContent: {
				deleteButton: {
					view: "button",
					type: "icon",
					css: "delete-icon-button",
					icon: "times",
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
 						<div class='active-list-name'>${obj.value} <span class="webix_icon fa-${obj.tagIcon}"></span></div>
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
							formOfTags
						]
					},
					{
						template: "<span class='list-of-tags-template'>List of tags to add</span>",
						height: 30,
						borderless: true
					},
					listOfTagsToAdd
				]
			}
		};

		const imagesTagsWindow = {
			view: "window",
			scroll: true,
			// paddingX: 35,
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
						template: () => {
							return "Set images tags";
						},
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "times",
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

	createTagsFormElements() {
		const formOfTags = this.getFormOfTags();
		let elements = [];
		const tagsItemId = this.imagesTagsCollection.getLastId();
		tagsItem = this.imagesTagsCollection.getItem(tagsItemId);
		if (tagsItem && tagsItem instanceof Object) {
			for (let key in tagsItem) {
				if (key !== "id") {
					const [elementOptions, tagIcon] = this.getElementOptionsAndIcon(tagsItem, key);
					const element = {
						cols: [
							{
								view: "richselect",
								css: "select-field",
								name: `${key}-selectName`,
								labelWidth: 150,
								label: key,
								tagIcon: tagIcon,
								options: elementOptions,
								validate: webix.rules.isNotEmpty,
								invalidMessage: "Value should not be empty"
							},
							{
								view: "button",
								type: "icon",
								icon: "plus",
								id: key,
								width: 30,
								click: (id) => {
									const tagSelect = this.getTagsRichselect(id);

									if (tagSelect.validate()) {
										//add item to active tag list
										const tagSelectList = tagSelect.getList();
										const itemId = tagSelect.getValue();
										const selectedItem = tagSelectList.getItem(itemId);
										const listObjectData =  `${key}: ${selectedItem.value}`;
										const listObjectId = `${key}:${itemId}`;
										const tagSelectListCount = tagSelectList.count();
										const tagIcon = tagSelect.config.tagIcon;

										const foundMatches = this.listOfTagsToAdd.find((obj) => {
											if ((obj.id === listObjectId) || (obj.id.indexOf(key) !== -1 && tagSelectListCount <= 2)) {
												return obj;
											}
										}, true);

										if (foundMatches.length === 0) {
											const listObjectToParse = {
												value: listObjectData,
												id: listObjectId,
												tagIcon: tagIcon
											};

											this.listOfTagsToAdd.parse(listObjectToParse);
										} else {
											//show needed alert text
											let alertText =  tagSelectListCount > 2
												? "You already added this tag!"
												: `You only can add one ${key} tag!`;

											webix.alert({
												type: "alert-error",
												text: alertText
											});
										}
									}
								}
							}
						]
					};
					elements.push(element);
				}
			}
			webix.ui(elements, formOfTags);
		} else {
			webix.message("Wrong data to add");
			this.closeWindow();
		}
	}


	showWindow(imagesTagsCollection, cartList) {
		this.cartList = cartList;
		this.imagesTagsCollection = imagesTagsCollection;
		this.listOfTagsToAdd = this.getListOfTagsToAdd();
		this.createTagsFormElements();
		this.getRoot().show();
	}

	closeWindow() {
		this.getRoot().hide();
	}

	getListOfTagsToAdd() {
		return this.getRoot().queryView({name: "listOfTagsToAddName"});
	}

	getFormOfTags() {
		return this.getRoot().queryView({view: "form"});
	}

	getTagsRichselect(tagKey) {
		return this.getRoot().queryView({name: `${tagKey}-selectName`});
	}

	getElementOptionsAndIcon(tagsItem, tagKey) {
		let options = [];
		let tagIcon;
		if (Array.isArray(tagsItem[tagKey])) {
			tagsItem[tagKey].forEach((tagItem) => {
				if (tagItem && tagItem instanceof Object){
					if (tagItem.hasOwnProperty("value")) {
						options.push(tagItem);
					} else if (tagItem.hasOwnProperty("tagIcon")) {
						tagIcon = tagItem.tagIcon;
					}
				}
			});
		}
		return [options, tagIcon || ""];
	}

}