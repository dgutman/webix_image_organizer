import {JetView, plugins} from "webix-jet";
import UploadMetadataService from "../../services/uploadMetadata/rootService";
import Sidebar from "./sidebar";
import utils from "../../utils/utils";
import constants from "../../constants";

export default class UploadMetadataView extends JetView {
	config() {
		const uploader = {
			view: "uploader",
			autosend: false,
			value: "Upload file",
			multiple: true
		};

		const filesDropDown = {
			view: "richselect",
			tooltip: () => this.filesDropDown.getText(),
			icon: utils.getSelectIcon(),
			name: "filesDropDown",
			css: "select-field ellipsis-text",
			label: "Files",
			labelWidth: 70,
			disabled: true,
			width: 300,
			options: {
				body: {
					template: obj => `<span title='${obj.name}'>${obj.name}</span>`,
					data: []
				}
			}
		};

		const uploaderLayout = {
			name: "uploaderLayout",
			padding: 10,
			width: 500,
			height: 100,
			cols: [
				{
					rows: [
						filesDropDown
					]
				},
				{width: 40},
				{
					rows: [
						uploader,
						{}
					]
				}
			]
		};

		const backButton = {
			view: "button",
			name: "backButton",
			css: "btn",
			label: "Back",
			type: "icon",
			icon: "fas fa-arrow-left",
			inputWidth: 100,
			height: 30,
			width: 100,
			click: () => {
				this.app.show(`${constants.APP_PATHS.MAIN}/${this.getParam("folders") || ""}`);
			}
		};

		const datatable = {
			view: "datatable",
			name: "metaDatatable",
			select: "row",
			navigation: false,
			editable: true,
			editaction: "custom",
			css: "upload-metadatatable",
			resizeColumn: true,
			tooltip: true,
			borderless: true,
			data: []
		};

		const rootInput = {
			view: "text",
			css: "text-field",
			name: "rootInput",
			width: 350,
			labelWidth: 110,
			inputHeight: 35,
			label: "Metadata root",
			placeholder: "Choose the metadata root",
			invalidMessage: "Invalid root path"
		};

		const acceptButton = {
			view: "button",
			css: "btn",
			height: 35,
			width: 80,
			name: "acceptButton",
			value: "Accept all"
		};

		const bottomForm = {
			view: "form",
			name: "bottomForm",
			type: "clean",
			height: 60,
			elements: [
				{},
				{
					cols: [
						rootInput,
						{},
						{
							rows: [
								{},
								acceptButton,
								{}
							]
						}
					]
				},
				{}
			],
			rules: {
				rootInput: (val) => {
					const regex = new RegExp(constants.PATTERN_ITEM_FIELDS, "g");
					const result = val.match(regex);
					return !webix.rules.isNotEmpty(val) || result && val === result[0];
				}
			}
		};

		const mainView = {
			name: "uploadMetadataView",
			paddingX: 10,
			rows: [
				{
					cols: [
						{
							rows: [
								{},
								backButton,
								{}
							]
						},
						{},
						uploaderLayout
					]
				},
				{
					gravity: 5,
					rows: [
						datatable
					]
				},
				bottomForm
			]
		};

		const accordion = {
			view: "accordion",
			borderless: true,
			type: "clean",
			cols: [
				{
					header: "Folders",
					body: {$subview: Sidebar, name: "sidebarView"}
				},
				mainView
			]
		};

		return accordion;
	}

	ready(view) {
		// URL-NAV enable URL params with /
		this.use(plugins.UrlParam, ["folders"]);
		this._service = new UploadMetadataService(view);
	}

	// URL-NAV
	urlChange(...args) {
		if (this._service) {
			this._service._urlChange(...args);
		}
	}

	get uploader() {
		return this.getRoot().queryView({view: "uploader"});
	}

	get uploaderLayout() {
		return this.getRoot().queryView({name: "uploaderLayout"});
	}

	get sidebarScope() {
		return this.getSubView("sidebarView");
	}

	get sidebarTree() {
		return this.sidebarScope.getTreeView();
	}

	get uploadMetadataView() {
		return this.getRoot().queryView({name: "uploadMetadataView"});
	}

	get filesDropDown() {
		return this.getRoot().queryView({name: "filesDropDown"});
	}

	get metaDatatable() {
		return this.getRoot().queryView({name: "metaDatatable"});
	}

	get headerScope() {
		return this.getRoot().getTopParentView().queryView({name: "headerClass"}).$scope;
	}

	get rootInput() {
		return this.getRoot().queryView({name: "rootInput"});
	}

	get acceptButton() {
		return this.getRoot().queryView({name: "acceptButton"});
	}

	get bottomForm() {
		return this.getRoot().queryView({name: "bottomForm"});
	}
}
