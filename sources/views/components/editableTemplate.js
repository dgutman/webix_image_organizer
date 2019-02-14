// Editable template.
// To determine which node acts as value editor we use "data-edit" attribute, which value contains
// name of the property of the data object, that should be edited
//
import ajaxActions from "../../services/ajaxActions";
import projectMetadata from "../../models/projectMetadata";
import dataViews from "../../models/dataViews";

if (!webix.ui.editabletemplate) {
	webix.protoUI({
		name: "editabletemplate",
		$init() {
			let evs = [
				webix.event(this.getNode(), "click", this._trackItemNodeEvents, {bind: this}),
				webix.event(this.getNode(), "dblclick", this._trackItemNodeEvents, {bind: this})
			];
			this.attachEvent("onDestruct", () => evs.forEach(evId => webix.detachEvent(evId)));
		},
		_trackItemNodeEvents(e) {
			let target = e.target;
			while (target !== this.getNode()) {
				if (target.hasAttribute("data-edit")) {
					let eventToCall = null;
					if (e.type === "dblclick") eventToCall = "onItemDblClick";
					else if (e.type === "click") eventToCall = "onItemClick";

					if (eventToCall) {
						this.callEvent(eventToCall, [
							target.getAttribute("data-edit"),
							e,
							e.target
						]);
					}

					break;
				}
				target = target.parentNode;
			}
		},
		getItem(id) {
			const [objectKey, valueIndex] = id.split("-");
			return {value: this.data[objectKey][valueIndex]};
		},
		showItem(id) {
			let itemNode = this.getItemNode(id);
			if (itemNode) {
				itemNode.scrollIntoView();
			}
		},
		getItemNode(id) {
			return this.getNode().querySelector(`[data-edit="${id}"]`);
		},
		updateItem(id, value) {
			const [objectKey, valueIndex] = id.split("-");
			const previousValues = webix.copy(this.data);
			const projectFolderMetadataCollection = projectMetadata.getProjectFolderMetadata();
			const projectSchemaFolder = projectFolderMetadataCollection.getItem(projectFolderMetadataCollection.getLastId());
			const newMetadata = projectSchemaFolder.meta;
			const folderId = projectSchemaFolder._id;
			const mainView = dataViews.getMainView();

			webix.extend(mainView, webix.ProgressBar);
			this.data[objectKey][valueIndex] = value.value;
			this.setValues(this.data, true);

			mainView.showProgress();
			ajaxActions.updateFolderMetadata(folderId, newMetadata)
				.then(() => {
					webix.message("Project schema was successfully updated");
					mainView.hideProgress();
				})
				.fail(() => {
					this.setValues(previousValues, true);
					mainView.hideProgress();
				});
		},
		editNext() {
			this.editStop();
		}
	}, webix.EditAbility, webix.ui.template);
}
