import {JetView} from "webix-jet";
import projectMetadata from "../../../models/projectMetadata";
import helpingFunctions from "../../../models/helpingFunctions";

let projectKeys;

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
						template: "Project Metadata",
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
					{
						view: "template",
						name: "projectMetadataTemplateName",
						css: {"overflow": "auto"},
						template: (obj) => {
							if (!helpingFunctions.isObjectEmpty(obj)) {
								let stringToReturn = "";
								projectKeys.forEach((key) => {
									let validationValues = obj.projectSchema[key].join("<br>");
									stringToReturn+=`<div class="collapssible-accordion ${key} hidden-views project-metadata-window-collapser">
														<span class="collpaser-text">${key}</span>
													</div>
													<div class="validation-values-template ${key}" style="">${validationValues}</div>\n`;
								});
								return stringToReturn;
							}
						},
						onClick: {
							"collapssible-accordion": (e, id, element) => {
								projectKeys.forEach((key) => {
									if (element.className.indexOf(key) !== -1) {
										helpingFunctions.showOrHideTemplateCollapsedViews(key, element);
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
		const projectMetadataTemplate = this.getProjectMetadataTemplate();
		const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
		const projectMetadataFolder = projectMetadataCollection.getItem(projectMetadataCollection.getFirstId());
		if (projectMetadataFolder instanceof Object && projectMetadataFolder.hasOwnProperty("meta")) {
			const projectSchema = projectMetadataFolder.meta.projectSchema;
			projectKeys = Object.keys(projectSchema);
			projectMetadataTemplate.parse({
				projectSchema: projectSchema,
			});
			this.getRoot().show();
		} else {
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

	close() {
		this.getRoot().hide();
	}

}