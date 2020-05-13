import {JetView} from "webix-jet";
import projectMetadata from "../../../../models/projectMetadata";
import utils from "../../../../utils/utils";
import "../../../components/editableTemplate";

let projectKeys;
const collapsedTemplatesCollection = new webix.DataCollection();

export default class ProjectMetadataWindow extends JetView {
	config() {
		const projectMetadataWindow = {
			view: "window",
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
						template: "Project metadata",
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
					{
						view: "editabletemplate",
						name: "projectMetadataTemplateName",
						css: {overflow: "auto"},
						editable: true,
						editor: "text",
						editaction: "click",
						template: (obj) => {
							if (!utils.isObjectEmpty(obj)) {
								let stringToReturn = "";
								projectKeys.forEach((key) => {
									if (Array.isArray(obj[key])) {
										const validationValues = obj[key].map((value, index) => `<p data-edit=${key}-${index}>${value}</p>`).join("");
										const showedOrHiddenCssClass = this.getShowedOrHiddenCssClass(key);
										stringToReturn += `<div class="collapssible-accordion ${key} project-metadata-window-collapser ${showedOrHiddenCssClass}" id=${key}>
														<span class="collpaser-text">${key}</span>
													</div>
													<div class="validation-values-template ${key}" style="">${validationValues}</div>\n`;
									}
								});
								return stringToReturn;
							}
						},
						onClick: {
							"collapssible-accordion": (e, id, element) => {
								projectKeys.forEach((key) => {
									if (element.className.indexOf(key) !== -1) {
										utils.showOrHideTemplateCollapsedViews(key, element);
										if (element.className.indexOf("showed-views") !== -1) {
											collapsedTemplatesCollection.add(element);
										}
										else {
											collapsedTemplatesCollection.remove(key);
										}
									}
								});
							}
						}
					}
				]
			}
		};
		return projectMetadataWindow;
	}

	showWindow() {
		this.projectMetadataTemplate = this.getProjectMetadataTemplate();
		const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
		const projectMetadataFolder = projectMetadataCollection.getItem(projectMetadataCollection.getFirstId());
		if (projectMetadataFolder instanceof Object && projectMetadataFolder.hasOwnProperty("meta") && projectMetadataFolder.meta.hasOwnProperty("schema")) {
			const projectSchema = projectMetadataFolder.meta.schema;
			projectKeys = Object.keys(projectSchema);
			this.projectMetadataTemplate.parse(projectSchema);
			this.projectMetadataTemplate.attachEvent("onAfterRender", () => {
				collapsedTemplatesCollection.find((elementNode) => {
					const key = elementNode.id;
					utils.showOrHideTemplateCollapsedViews(key, elementNode);
				});
			});
			this.getRoot().show();
		}
		else {
			webix.alert({
				title: "Error",
				type: "alert-error",
				text: "There is no metadata validation rules in .ProjectMetadata folder!"
			});
		}
	}

	getProjectMetadataTemplate() {
		return this.getRoot().queryView({name: "projectMetadataTemplateName"});
	}

	getShowedOrHiddenCssClass(key) {
		const templatesToShow = collapsedTemplatesCollection.find(elementNode => elementNode.id === key);
		if (templatesToShow.length !== 0) {
			return "showed-views";
		}
		return "hidden-views";
	}

	close() {
		this.projectMetadataTemplate.detachEvent("onAfterRender");
		this.getRoot().hide();
	}
}
