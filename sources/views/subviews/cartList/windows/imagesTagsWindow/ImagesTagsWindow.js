import {JetView} from "webix-jet";
import "../../../../components/activeList";
import ajaxActions from "../../../../../services/ajaxActions";
import iconsPopup from "./iconsPopup";

const minTagValuesCount = 2;
const newTagName = "newTagName";
const popupIconButtonName = "popupIconButtonName";
const spacerHeightForPlusButtonFirstElement = 34;
const spacerHeightForPlusMinusButtons = 3;
const spacerHeightForPlusButtonOtherElements = 11;
let newTagsData = [];
let tagsItem;

export default class ImagesTagsWindow extends JetView {
	config() {
		const saveButton = {
			view: "button",
			name: "saveButtonName",
			value: "Save",
			css: "btn",
			height: 30,
			width: 100
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
			template: (obj, common) => {
				return `<div>
						<div class='active-list-delete-button'>${common.deleteButton(obj, common)}</div>
 						<div class='active-list-name'>${obj.value} <span class="webix_icon fas fa-${obj.tagIcon}"></span></div>
					</div>`
			}

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
								template: obj => `<span class='list-of-tags-template'>${obj.name}</span>`,
								name: "activeListTopTemplateName",
								height: 30,
								borderless: true
							},
							{
								name: "addTagButtonLayoutName",
								cols: [
									{
										view: "button",
										css: "btn",
										height: 25,
										width: 100,
										value: "Add tag",
										click: () => {
											let listTagValue;
											let listTagIcon;
											let foundTag;
											if (this.formView.validate()) {
												const formValues = this.formView.getValues();
												for (let valueKey in formValues) {
													if (valueKey === newTagName) {
														foundTag = this.listOfTagsToAdd.find(obj => obj.value === formValues[valueKey], true);
														if (!Array.isArray(foundTag)) {
															break;
														}
														newTagsData.push({
															[formValues[valueKey]]: []
														});
														listTagValue = formValues[valueKey];
													} else {
														newTagsData.find((newTag) => {
															if (newTag && newTag instanceof Object) {
																if (newTag.hasOwnProperty(formValues[newTagName])) {
																	let newTagObject;
																	if (valueKey === popupIconButtonName) {
																		listTagIcon = formValues[valueKey];
																		newTagObject = {
																			tagIcon: formValues[valueKey]
																		};
																	} else {
																		newTagObject = {
																			value: formValues[valueKey]
																			// id: newTag[formValues[newTagName]].length - 1
																		};
																	}
																	newTag[formValues[newTagName]].push(newTagObject);
																	return true;
																}
															}
														});
													}
												}

												if (Array.isArray(foundTag)) {
													this.listOfTagsToAdd.parse({
														value: listTagValue || "",
														//tagIcon: listTagIcon || ""
													});
												} else {
													this.showWebixAlert("You have already added tag with that name!");
												}
											} else {
												this.showWebixAlert("Fill the form fields, please!");
											}
										}
									},
									{width: 18}
								]
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
						template: obj => obj.name,
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
					const [elementOptions, tagIcon] = this.getElementOptionsAndIcon(tagsItem, key);
					const element = {
						cols: [
							{
								view: "richselect",
								css: "select-field",
								icon: "fas fa-chevron-down",
								name: `${key}-selectName`,
								labelWidth: 150,
								label: key,
								//tagIcon: tagIcon,
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
										//add item to active tag list
										const tagSelectList = tagSelect.getList();
										const itemId = tagSelect.getValue();
										const selectedItem = tagSelectList.getItem(itemId);
										const listObjectData =  `${key}: ${selectedItem.value}`;
										const listObjectId = `${key}:${itemId}`;
										const tagSelectListCount = tagSelectList.count();
										//const tagIcon = tagSelect.config.tagIcon;

										const foundMatches = this.listOfTagsToAdd.find((obj) => {
											if ((obj.id === listObjectId) || (obj.id.indexOf(key) !== -1 && tagSelectListCount <= 2)) {
												return obj;
											}
										}, true);

										if (foundMatches.length === 0) {
											const listObjectToParse = {
												value: listObjectData,
												id: listObjectId,
												//tagIcon: tagIcon
											};

											this.listOfTagsToAdd.parse(listObjectToParse);
										} else {
											//show needed alert text
											let alertText =  tagSelectListCount > 2
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
		} else {
			webix.message("Wrong data to add");
			this.closeWindow();
		}
	}

	getPlusButtonTopSpacerHeight(count) {
		if (Number.isInteger(count)) {
			return count === 0 ? spacerHeightForPlusButtonFirstElement : spacerHeightForPlusButtonOtherElements;
		} else {
			return spacerHeightForPlusMinusButtons;
		}
	}

	getTagValueElement(count) {
		let tagValueLabel = count === 0 ? "NEW TAG VALUES" : "";
		let tagValueLabelPosition = tagValueLabel.length > 0 ? "top" : "";
		let hiddenMinusButton = Number.isInteger(count);
		let nameCount = Number.isInteger(count) ? count : this.formView.getChildViews().length - 1;
		const tagValueTextName = `tagValueName-${nameCount}`;

		const newTagValueElement = {
			cols: [
				{
					view: "text",
					css: "text-field",
					validate: webix.rules.isNotEmpty,
					invalidMessage: "Tag value field should not be empty",
					labelPosition: tagValueLabelPosition,
					label: tagValueLabel,
					name: tagValueTextName
				},
				{width: 10},
				{
					rows: [
						{height: this.getPlusButtonTopSpacerHeight(count)},
						{
							view: "button",
							css: "btn image-tag-window-form-icon-button",
							label: "+",
							width: 16,
							height: 16,
							click: () => {
								const newTagValueElement = this.getTagValueElement();
								this.formView.addView(newTagValueElement);
							}
						},
						{height: 3},
						{
							view: "button",
							css: "btn image-tag-window-form-icon-button",
							label: "-",
							hidden: hiddenMinusButton,
							textViewName: tagValueTextName,
							width: 16,
							height: 16,
							click: (id) => {
								const minusButton = $$(id);
								const textViewName = minusButton.config.textViewName;
								const textView = this.getFormTextView(textViewName);
								const layoutToRemove = textView.getParentView();
								const layoutToRemoveId = layoutToRemove.config.id;
								this.formView.removeView(layoutToRemoveId);
							}
						}
					]
				}
			]
		};

		return newTagValueElement;
	}

	createNewFormElements() {
		let elements = [];
		//const iconsPopupId = this.iconsPopupView.config.id;

		const newNameTagElement = {
			rows: [
				{
					cols: [
						{
							template: "NEW TAG NAME",
							width: 130,
							css: "new-tag-name-template",
							autoheight: true,
							borderless: true
						},
						{},
						{
							template: "<span class='link clear-tag-form'>Clear tag form</span>",
							autoheight: true,
							width: 100,
							borderless: true,
							onClick: {
								"clear-tag-form": () => {
									this.formView.clear();

								}
							}
						},
						//{width: 21}
					]
				},
				{
					cols: [
						{
							view: "text",
							name: newTagName,
							css: "text-field",
							validate: webix.rules.isNotEmpty,
							invalidMessage: "Tag name field should not be empty",
						},
						// {
						// 	css: "icon-popup-button-layout",
						// 	name: "iconButtonLayoutName",
						// 	rows: [
						// 		{
						// 			view: "button",
						// 			type: "icon",
						// 			name: "popupIconButtonName",
						// 			icon: "font-awesome",
						// 			value: "font-awesome",
						// 			tooltip: "Select tag icon",
						// 			width: 25,
						// 			height: 25,
						// 			popup: iconsPopupId
						// 		}
						// 	]
						// }
					]
				}
			]

		};

		elements.push(newNameTagElement);
		for (let count = 0; count < minTagValuesCount; count++) {
			const tagValueElement = this.getTagValueElement(count);
			elements.push(tagValueElement);
		}
		webix.ui(elements, this.formView);
	}

	getListOfTagsToAdd() {
		return this.getRoot().queryView({view: "activeList"});
	}

	getFormOfTags() {
		return this.getRoot().queryView({view: "form"});
	}

	getSaveButton() {
		return this.getRoot().queryView({name: "saveButtonName"});
	}

	getTagsRichselect(tagKey) {
		return this.getRoot().queryView({name: `${tagKey}-selectName`});
	}

	getFormTextView(textViewName) {
		return this.getRoot().queryView({name: textViewName});
	}

	getPopupIconButton() {
		return this.getRoot().queryView({name: "popupIconButtonName"});
	}

	getAddTagButtonLayout() {
		return this.getRoot().queryView({name: "addTagButtonLayoutName"});
	}

	getElementOptionsAndIcon(tagsItem, tagKey) {
		let options = [];
		let tagIcon;
		if (Array.isArray(tagsItem[tagKey])) {
			tagsItem[tagKey].forEach((tagItem) => {
				if (tagItem) options.push(tagItem);
				// if (tagItem && tagItem instanceof Object){
				// 	if (tagItem.hasOwnProperty("value")) {
				// 		options.push(tagItem);
				// 	}
				// 	//else if (tagItem.hasOwnProperty("tagIcon")) {
				// 	//	tagIcon = tagItem.tagIcon;
				// 	//}
				// }
			});
		}
		return [options, tagIcon || ""];
	}

	getWindowHeaderTemplate() {
		return this.getRoot().queryView({name: "headerTemplateName"});
	}

	getListTopTemplate() {
		return this.getRoot().queryView({name: "activeListTopTemplateName"});
	}

	getIconButtonLayout() {
		return this.getRoot().queryView({name: "iconButtonLayoutName"});
	}

	saveButtonSetAction() {
		if (this.$scope.listOfTagsToAdd.count() > 0) {
			let itemTagData = [];
			let updatePromises = [];

			for (let key in tagsItem) {
				this.$scope.listOfTagsToAdd.find((obj) => {
					if (obj.id.indexOf(key) !== -1) {
						const splittedId = obj.id.split(":");
						const tagId = splittedId[splittedId.length - 1];

						if (tagsItem[key].length < 3) {
							itemTagData.push({
								[key]: tagId
							});
						} else {
							const itemTagIndex = itemTagData.findIndex(obj => obj.hasOwnProperty(key));
							if (itemTagIndex !== -1) {
								itemTagData[itemTagIndex][key].push(tagId);
							} else {
								itemTagData.push({
									[key]: [tagId]
								});
							}
						}
					}

				});
			}

			this.$scope.cartList.data.each((item) => {
				itemTagData.forEach((tag) => {
					if (!item.hasOwnProperty("meta") || typeof item.meta !== "object") {
						item.meta = {};
					}
					item.meta = Object.assign(item.meta, tag);
				});

				updatePromises.push(ajaxActions.updateItemMetadata(item._id, item.meta));
			});

			this.$scope.view.showProgress();
			webix.promise.all(updatePromises)
				.then(() => {
					webix.message("Tags were successfully added to items");
					this.$scope.view.hideProgress();
					this.closeWindow();
				})
				.fail(() => {
					this.$scope.view.hideProgress();
					this.closeWindow();
				});
		} else {
			this.showWebixAlert("Add new tag to the list before saving!");
		}
	}

	saveButtonCreateAction() {
		if (newTagsData.length > 0) {
			this.$scope.imagesTagsCollection.find((tagsItem) => {
				newTagsData.forEach((newTag) => {
					tagsItem = Object.assign(newTag, tagsItem);
					this.$scope.imagesTagsCollection.updateItem(tagsItem.id, tagsItem);
				});
			});
			newTagsData = [];
			this.$scope.closeWindow();
		} else {
			this.showWebixAlert("Add new tag to the list before saving!");
		}

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
		this.saveButton = this.getSaveButton();
		this.formView = this.getFormOfTags();
		this.windowHeaderTemplate = this.getWindowHeaderTemplate();
		this.listTopTemplate = this.getListTopTemplate();
		// this.iconsPopupView = this.ui(iconsPopup.getIconsPopupConfig());
		// this.iconsPopupTemplate = this.iconsPopupView.getBody();
		this.addTagButtonLayout = this.getAddTagButtonLayout();

		let windowHeaderName;
		let saveButtonAction;
		let listTemplateName;

		if (windowAction === "create") {
			windowHeaderName = "Create new image tags";
			listTemplateName = "List of new tags to create";
			saveButtonAction = this.saveButtonCreateAction;

			this.addTagButtonLayout.show();
			this.createNewFormElements();
			// this.iconsPopupTemplate.define("onClick", {
			// 	"webix_icon": (e, id, element) => {
			// 		const iconName = id ? id : element.id;
			// 		const iconButton = this.getPopupIconButton();
			// 		const iconButtonLayout = this.getIconButtonLayout();
			// 		webix.html.removeCss(iconButtonLayout.getNode(), "icon-popup-button-layout");
			// 		iconButton.define("icon", iconName);
			// 		iconButton.define("value", iconName);
			// 		iconButton.refresh();
			// 		this.iconsPopupView.hide();
			// 		webix.html.addCss(iconButtonLayout.getNode(), "icon-popup-button-layout");
			// 	}
			// });
		} else if (windowAction === "set") {
			windowHeaderName = "Set new image tags";
			listTemplateName = "List of new tags to set";
			saveButtonAction = this.saveButtonSetAction;
			this.addTagButtonLayout.hide();
			this.createSetFormElements();
		}
		this.saveButton.define("click", saveButtonAction);

		this.windowHeaderTemplate.parse({
			name: windowHeaderName
		});

		this.listTopTemplate.parse({
			name: listTemplateName
		});

		this.getRoot().show();
	}

	closeWindow() {
		this.listOfTagsToAdd.clearAll();
		this.formView.clear();
		this.getRoot().hide();
	}

}