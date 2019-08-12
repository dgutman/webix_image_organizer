import {JetView} from "webix-jet";
import constants from "../../../constants";
import format from "../../../utils/formats";
import AddMetadataWindow from "./window/addMetadataWindow";
import utils from "../../../utils/utils";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import ajaxActions from "../../../services/ajaxActions";
import webixViews from "../../../models/webixViews";

let item;
const mainPropertiesClassName = constants.MAIN_PROPERTIES_CLASS_NAME;
const metadataPropertiesClassName = constants.METADATA_PROPERTIES_CLASS_NAME;

export default class MetadataPanelClass extends JetView {
	config() {
		const showAddMetadataWindowButton = {
			view: "button",
			name: "showAddMetadataWindowButtonName",
			type: "icon",
			icon: "fas fa-plus",
			hidden: true,
			disable: true,
			height: 32,
			label: "Add metadata",
			click: () => {
				this.addMetadataWindow.showWindow(item, this.metadataTemplate);
			}
		};

		const templateView = {
			view: "template",
			name: "templateViewName",
			css: "metadata-template",
			width: 350,
			template: (obj) => {
				if (this.jsonEditor) {
					this.jsonEditor.set(obj.meta);
					this.jsonEditor.setName("Metadata properties");
					this.jsonEditor.collapseAll();
				}
				item = obj;
				let template = `<div class="templateMain">
									<div class="templateName">Metadata</div>
									<div class="listTemplate">
										<p>_id: ${obj._id || ""}</p>
										<div class="collapssible-accordion ${mainPropertiesClassName} hidden-views metadata-template-collpaser">
											<span class="collpaser-text">Main properties</span>
										</div>
										<div class=${mainPropertiesClassName} style="display: none">
											<p>name: ${obj.name || ""}</p>
											<p>_modelType: ${obj._modelType || ""}</p>
											<p>baseParentId: ${obj.baseParentId || ""}</p>
											<p>baseParentType: ${obj.baseParentType || ""}</p>
											<p>created: ${format.formatDateString(obj.created) || ""}</p>
											<p>creatorId: ${obj.creatorId || ""}</p>
											<p>folderId: ${obj.folderId || ""}</p>
											<p>size: ${obj.size || "0"} B</p>
											<p>updated: ${format.formatDateString(obj.updated) || ""}</p>
										</div>
									</div>
							</div>`;
				return template;
			},
			onClick: {
				"collapssible-accordion": (e, id, element) => {
					if (element.className.indexOf(mainPropertiesClassName) !== -1) {
						utils.showOrHideTemplateCollapsedViews(mainPropertiesClassName, element);
					}
					else if (element.className.indexOf(metadataPropertiesClassName) !== -1) {
						utils.showOrHideTemplateCollapsedViews(metadataPropertiesClassName, element);
					}
				}
			}
		};

		return {
			id: constants.SCROLL_VIEW_METADATA_ID,
			name: "metadataPanelClass",
			rows: [
				templateView,
				{
					borderless: true,
					css: "button-icon-button",
					rows: [
						showAddMetadataWindowButton
					]
				}
			]
		};
	}

	ready() {
		this.addMetadataWindow = this.ui(AddMetadataWindow);
		this.metadataTemplate = this.getTemplateView();
		webix.extend(this.metadataTemplate, webix.ProgressBar);

		this.jsonEditor = new JSONEditor(this.metadataTemplate.getNode(), {
			navigationBar: false,
			mainMenuBar: false,
			onChangeJSON: (updatedMetadata) => {
				if (!updatedMetadata.hasOwnProperty("")) {
					const itemId = this.metadataTemplate.getValues()._id;
					const itemGalleryDataviewId = this.metadataTemplate.getValues().id;
					this.metadataTemplate.showProgress();
					ajaxActions.updateItemMetadata(itemId, updatedMetadata)
						.then((item) => {
							const galleryDataview = webixViews.getGalleryDataview();
							galleryDataview.updateItem(itemGalleryDataviewId, item);
							this.metadataTemplate.hideProgress();
						})
						.fail(() => {
							const previousItemMetadata = this.metadataTemplate.getValues().meta;
							this.jsonEditor.set(previousItemMetadata);
							this.metadataTemplate.hideProgress();
						});
				}
			}
		});

		// set debounce interval for onChangeValue
		this.jsonEditor.node.__proto__.DEBOUNCE_INTERVAL = 2000;
		this.metadataTemplate.parse({});
	}

	getScrollView() {
		return this.getRoot();
	}

	getTemplateView() {
		return this.getRoot().queryView({name: "templateViewName"});
	}

	getShowAddMetadataWindowButton() {
		return this.getRoot().queryView({name: "showAddMetadataWindowButtonName"});
	}
}
