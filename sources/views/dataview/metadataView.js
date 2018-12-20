import {JetView} from "webix-jet";
import constants from "../../constants";
import format from "../../utils/formats";
import AddMetadataWindow from "./windows/addMetadataWindow";

let itemId;

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

		const templateInfo = (obj) => {
			itemId = obj._id;
			let template = `<div class='templateMain'>
								<div class='templateName'>Metadata</div>
								<div class='listTemplate'>
									<p>_id: ${obj._id || ""}</p>
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
							</div>`;
			return template;
		};

		const templateView = {
			view: "template",
			name: "templateViewName",
			autoheight: true,
			template: templateInfo
		};

		const scrollView = {
			view: "scrollview",
			name: "scrollviewName",
			scroll: "xy",
			width: 350,
			body: templateView
		};

		return {
			id: constants.SCROLL_VIEW_METADATA_ID,
			name: "metadataViewClass",
			rows: [
				scrollView,
				showAddMetadataWindowButton
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

}
