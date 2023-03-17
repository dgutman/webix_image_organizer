import {JetView} from "webix-jet";

import projectMetadata from "../../../../models/projectMetadata";
import ajaxActions from "../../../../services/ajaxActions";
import utils from "../../../../utils/utils";

import "../../../components/editableTemplate";

let projectKeys;
const collapsedTemplatesCollection = new webix.DataCollection();

export default class ProjectMetadataWindow extends JetView {
	config() {
		const projectMetadataWindow = {
			view: "window",
			width: 500,
			height: 600,
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
					/*
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
										const validationValues = obj[key].map((value, index) => `<p data-edit=${key}-${index}>${value}</p>`)
											.join("");
										const showedOrHiddenCssClass = this.getShowedOrHiddenCssClass(key);
										stringToReturn += `<div class="collapssible-accordion ${key} project-metadata-window-collapser ${showedOrHiddenCssClass}" id=${key}>
														<span class="collpaser-text">${key}</span>
													</div>
													<div class="validation-values-template ${key}" style="">${validationValues}</div>\n`;
									}
								});
								return stringToReturn;
							}
							return "";
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
					},
					 */
					{
						name: "validationSchemasForm",
						view: "form",
						value: "",
						elements: [
							{
								view: "select",
								name: "selectFolder",
								label: "Folder"
							}
						],
						rules: {
							"selectFolder": webix.rules.isNotEmpty
						}
					},

					{
						view: "list",
						name: "schemasList",
						type: {
							markCheckbox: function (obj) {
								const html = `<input style='float: right;' class='check' type='checkbox' ${obj.markedCheckbox ? "checked" : ""}>`;
								return html;
							}
						},
						onClick: {
							"check": function (e, id) {
								const item = this.getItem(id);
								item.markedCheckbox = item.markedCheckbox ? 0 : 1;
								this.updateItem(id, item);
							}
						},
						template: "{common.markCheckbox()} #name#"
					},
					{
						cols: [
							{
								view: "button",
								label: "Save",
								type: "form",
								click: () => {
									this.saveForm();
								}
							}
						]
					},
					{
						view: "datatable",
						name: "validationSchemasMappingList",
						headerRowHeight: 30,
						columns: [
							{
								id: "folderName",
								header: "Folder Name",
								width: 200,
								template: function(obj) {
									return obj.folderName ? obj.folderName : "[Choose folder]";
								}
							},
							{
								id: "schemas",
								header: "Film title",
								template: function(obj) {
									return obj.schemas.length > 0 ? obj.schemas.join(", ") : "[Choose schemas]";
								},
								fillspace: true
							}
						],
						tooltip: true,
						select: true,
						on: {
							onAfterSelect: (id) => {
								const validationSchemas = projectMetadata.getValidationSchemas();
								const validationSchemasMappingList = this.getValidationSchemasMappingList();
								const selectedMapping = validationSchemasMappingList.getItem(id);
								const schemasListData = validationSchemas.map((schema) => {
									const schemaData = {};
									schemaData.markedCheckbox = selectedMapping.schemas.includes(schema.$id) ? 1 : 0;
									schemaData.name = schema.$id;
									return schemaData;
								});
								const schemasList = this.getSchemasList();
								schemasList.clearAll();
								schemasList.parse(schemasListData);
								schemasList.refresh();
								const folderSelect = this.getFolderSelect();
								folderSelect.setValue(selectedMapping.folderName);
								folderSelect.refresh();
							}
						}
					},
					{
						cols: [
							{
								view: "button",
								name: "addMappingButton",
								value: "Add",
								click: () => {
									const validationSchemasMappingList = this.getValidationSchemasMappingList();
									validationSchemasMappingList.add({folderName: "", schemas: []});
								}
							},
							{
								view: "button",
								name: "deleteMappingButton",
								value: "Delete",
								click: () => {
									const validationSchemasMappingList = this.getValidationSchemasMappingList();
									const selectedId = validationSchemasMappingList.getSelectedId();
									if (selectedId) {
										validationSchemasMappingList.remove(selectedId);
										validationSchemasMappingList.refresh();
									}
									else {
										webix.alert("You should select item from the list");
									}
								}
							}
						]
					}
				]
			}
		};
		return projectMetadataWindow;
	}

	showWindow() {
		/* this.projectMetadataTemplate = this.getProjectMetadataTemplate();
		const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
		const projectMetadataFolder = projectMetadataCollection
			.getItem(projectMetadataCollection.getFirstId());

		const fieldName = this.getProjectMetadataSchemaField(projectMetadataFolder);
		if (projectMetadataFolder instanceof Object && fieldName) {
			const projectSchema = projectMetadataFolder.meta[fieldName];
			projectKeys = Object.keys(projectSchema);
			this.projectMetadataTemplate.parse(projectSchema);
			this.projectMetadataTemplate.attachEvent("onAfterRender", () => {
				// eslint-disable-next-line array-callback-return
				collapsedTemplatesCollection.find((elementNode) => {
					const key = elementNode.id;
					utils.showOrHideTemplateCollapsedViews(key, elementNode);
				});
			});
			// this.getRoot().show();
		}
		else {
			this.projectMetadataTemplate.define("hidden", true);
			webix.alert({
				title: "Error",
				type: "alert-error",
				text: "There is no metadata validation rules in .ProjectMetadata folder!"
			});
		} */

		const folderAndSchemasMapping = projectMetadata.getFolderAndSchemasMapping();
		if (folderAndSchemasMapping.size !== 0) {
			// folders
			const validationSchemasMappingList = this.getValidationSchemasMappingList();
			const folderAndSchemaMappingData = Array.from(
				folderAndSchemasMapping,
				([folderName, schemas]) => ({
					folderName,
					schemas
				})
			);
			validationSchemasMappingList.parse(folderAndSchemaMappingData);
		}

		const folderSelect = this.getFolderSelect();
		const collectionFolders = projectMetadata.getCollectionFolders();
		const folderSelectOptions = collectionFolders.map(folder => folder.name);
		folderSelect.define("options", folderSelectOptions);

		this.getRoot().show();
	}

	getProjectMetadataSchemaField(projectMetadataFolder) {
		const names = ["schema", "ProjectSchema", "projectSchema"];
		return projectMetadataFolder.meta && names.find(
			name => projectMetadataFolder.meta.hasOwnProperty(name)
		);
	}

	getProjectMetadataTemplate() {
		return this.getRoot()
			.queryView({name: "projectMetadataTemplateName"});
	}

	getShowedOrHiddenCssClass(key) {
		const templatesToShow = collapsedTemplatesCollection.find(
			elementNode => elementNode.id === key
		);
		if (templatesToShow.length !== 0) {
			return "showed-views";
		}
		return "hidden-views";
	}

	getValidationSchemasForm() {
		return this.getRoot()
			.queryView({name: "validationSchemasForm"});
	}

	getFolderSelect() {
		return this.getRoot().queryView({name: "selectFolder"});
		// return document.getElementById(SELECT_FOLDER_ID);
	}

	getSchemasList() {
		return this.getRoot().queryView({name: "schemasList"});
		// return document.getElementsByClassName()
	}

	getValidationSchemasMappingList() {
		return this.getRoot()
			.queryView({name: "validationSchemasMappingList"});
	}

	saveForm() {
		const folderSelect = this.getFolderSelect();
		const folder = folderSelect.getValue();
		const foldersAndSchemasMapping = projectMetadata.getFolderAndSchemasMapping();
		if (foldersAndSchemasMapping.has(folder)) {
			webix.alert({
				title: "Error",
				type: "alert-error",
				text: "This folder already exist in mapping list"
			});
		}
		else {
			const schemasList = this.getSchemasList();
			const checkedSchemas = schemasList.serialize()
				.filter(schema => schema.markedCheckbox)
				.map(
					schema => (schema.name)
				);
			const validationSchemasMappingList = this.getValidationSchemasMappingList();
			foldersAndSchemasMapping.set(folder, checkedSchemas);
			const selectedItemId = validationSchemasMappingList.getSelectedId();
			validationSchemasMappingList
				.updateItem(selectedItemId, {folderName: folder, schemas: checkedSchemas});
		}
	}

	saveToServer() {
		const validationSchemasFolder = projectMetadata.getProjectValidationSchemasFolder();
		const folderId = validationSchemasFolder._id;
		const folderMetadata = validationSchemasFolder.meta;
		const newFolderMetadata = Object.assign({}, folderMetadata);
		const folderAndSchemasMappingData = this.getFolderAndSchemasMappingData()
		newFolderMetadata.folderAndSchemasMapping = folderAndSchemasMappingData;
		let status;
		ajaxActions.updateFolderMetadata(folderId, JSON.parse(JSON.stringify(newFolderMetadata)))
			.then(() => {
				webix.message("Folder and validation schemas mapping successfully updated");
				status = true;
			})
			.catch(() => {
				status = false;
			});
		return status;
	}

	updateFolderAndSchemasMapping() {
		const folderAndSchemasMapping = projectMetadata.getFolderAndSchemasMapping();
		const folderAndSchemasMappingData = this.getFolderAndSchemasMappingData();
		projectMetadata.clearFolderAndSchemasMapping();
		folderAndSchemasMappingData.forEach((map) => {
			folderAndSchemasMapping.set(map.folderName, map.schemas);
		});
	}

	getFolderAndSchemasMappingData() {
		const validationSchemasMappingList = this.getValidationSchemasMappingList();
		const folderAndSchemaMappingData = validationSchemasMappingList
			.serialize()
			.map(map => ({folderName: map.folderName, schemas: map.schemas}));
		return folderAndSchemaMappingData;
	}

	close() {
		// this.projectMetadataTemplate.detachEvent("onAfterRender");
		this.saveToServer();
		this.updateFolderAndSchemasMapping();
		const validationSchemasMappingList = this.getValidationSchemasMappingList();
		validationSchemasMappingList.clearAll();
		this.getRoot().hide();
	}
}
