import {JetView} from "webix-jet";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import constants from "../../constants";
import format from "../../utils/formats";
import utils from "../../utils/utils";
import projectMetadata from "../../models/projectMetadata";

const wrongMetadataCollection = projectMetadata.getWrongMetadataCollection();
const mainPropertiesClassName = constants.MAIN_PROPERTIES_CLASS_NAME;
const metadataPropertiesClassName = constants.METADATA_PROPERTIES_CLASS_NAME;

const METADATA_TEMPLATE_ID = "metadata-json-viewer-template-id";

export default class MetadataPanelClass extends JetView {
	constructor(app, config, editorConfig) {
		super(app, config);
		this._cnf = config || {};
		this._editorConfig = editorConfig || {};
	}

	config() {
		const templateView = {
			view: "template",
			localId: METADATA_TEMPLATE_ID,
			css: "metadata-template",
			borderless: true,
			template: (obj) => {
				if (this._jsonEditor) {
					this._jsonEditor.set(obj.meta);
					this._jsonEditor.setName("Metadata properties");
				}
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
			...this._cnf,
			rows: [
				{
					css: "lines-layout",
					rows: [
						templateView
					]
				}
			]
		};
	}

	ready() {
		const metadataTemplate = this.$templateView();
		webix.extend(metadataTemplate, webix.ProgressBar);

		this._jsonEditor = new JSONEditor(metadataTemplate.getNode(), {
			...this._editorConfig,
			navigationBar: false,
			mainMenuBar: false,
			onClassName: ({path}) => {
				let highlight;
				const itemId = metadataTemplate.getValues()._id;
				const invalidItem = wrongMetadataCollection.getItem(itemId);
				if (invalidItem && invalidItem.incorrectKeys.find(key => key === path.join("."))) {
					highlight = "invalid-field";
				}
				return highlight;
			}
		});

		// set debounce interval for onChangeValue
		// eslint-disable-next-line no-proto
		this._jsonEditor.node.__proto__.DEBOUNCE_INTERVAL = 2000;
		metadataTemplate.parse({});
	}

	$templateView() {
		return this.$$(METADATA_TEMPLATE_ID);
	}

	setItem(item) {
		this.$templateView().setValues(item);
	}
}
