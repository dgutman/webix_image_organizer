import {JetView} from "webix-jet";
import constants from "../../constants";
import format from "../../utils/formats";
import AddMetadataWindow from "./windows/addMetadataWindow";
import helpingFunctions from "../../models/helpingFunctions";

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
			width: 350,
			template: (obj) => {
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
										<div style="display: ${this.displayMetadataProperties(obj)}">
											<div class="collapssible-accordion ${metadataPropertiesClassName} hidden-views metadata-template-collpaser">
												<span class="collpaser-text">Metadata Properties</span>
											</div>
											<div class="${metadataPropertiesClassName} metadata-info-template">
												meta: ${JSON.stringify(obj.meta, null, 2)}
											</div>
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

	displayMetadataProperties(obj) {
		if (!helpingFunctions.isObjectEmpty(obj) && obj.hasOwnProperty("meta")) {
			return "block";
		} else {
			return "none";
		}
	}

}
