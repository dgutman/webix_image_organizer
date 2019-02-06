import {JetView} from "webix-jet";
import constants from "../../constants";
import format from "../../utils/formats";
import AddMetadataWindow from "./windows/addMetadataWindow";
import helpingFunctions from "../../models/helpingFunctions";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import ajaxActions from "../../services/ajaxActions";
import dataViews from "../../models/dataViews";

let itemId;
const mainPropertiesClassName = constants.MAIN_PROPERTIES_CLASS_NAME;
const metadataPropertiesClassName = constants.METADATA_PROPERTIES_CLASS_NAME;

export default class MetadataTemplateView extends JetView {

	config() {

		const showAddMetadataWindowButton = {
			view: "button",
			name: "showAddMetadataWindowButtonName",
			type: "icon",
			icon: "plus",
			hidden: true,
			disable: true,
			height: 30,
			width: 120,
			label: "Add metadata",
			click: () => {
				this.addMetadataWindow.showWindow(itemId);
			}
		};

		const templateView = {
			view: "template",
			name: "templateViewName",
			css: "metadata-template",
			width: 350,
			template: (obj) => {
				this.jsonEditor.set(obj.meta);
				this.jsonEditor.setName("Metadata Properties");
				this.jsonEditor.collapseAll();
				itemId = obj._id;
				let template = `<div class="templateMain">
									<div class="templateName">Metadata</div>
									<div class="listTemplate">
										<p>_id: ${obj._id || ""}</p>
										<div class="collapssible-accordion ${mainPropertiesClassName} hidden-views metadata-template-collpaser">
											<span class="collpaser-text">Main Properties</span>
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
						helpingFunctions.showOrHideTemplateCollapsedViews(mainPropertiesClassName, element);
					} else if (element.className.indexOf(metadataPropertiesClassName) !== -1) {
						helpingFunctions.showOrHideTemplateCollapsedViews(metadataPropertiesClassName, element);
					}
				}
			}
		};

		return {
			id: constants.SCROLL_VIEW_METADATA_ID,
			name: "metadataViewClass",
			rows: [
				templateView,
				{
					css: {"border-left": "1px solid #DDDDDD"},
					rows: [
						showAddMetadataWindowButton
					]
				}
			]
		};

	}

	ready() {
		this.addMetadataWindow = this.ui(AddMetadataWindow);
		const metadataTemplate = this.getTemplateView();
		webix.extend(metadataTemplate, webix.ProgressBar);

		this.jsonEditor = new JSONEditor(metadataTemplate.getNode(), {
			navigationBar: false,
			mainMenuBar: false,
			debounceInterval: 1000,
			onChangeJSON: (updatedMetadata) => {
				const itemId = metadataTemplate.getValues()._id;

				metadataTemplate.showProgress();
				ajaxActions.updateItemMetadata(itemId, updatedMetadata)
					.then(() => {
						webix.message("Metadata was successfully updated!");
						metadataTemplate.hideProgress();
					})
					.fail(() => {
						const previousItemMetadata = metadataTemplate.getValues().meta;
						this.jsonEditor.set(previousItemMetadata);
						webix.message("Something went wrong!");
						metadataTemplate.hideProgress();
					});
			}
		});

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
