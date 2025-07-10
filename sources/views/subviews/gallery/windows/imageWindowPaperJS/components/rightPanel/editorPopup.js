const ITEM_TYPES = {
	ANNOTATION: "annotation",
	GROUP: "group",
	FEATURE: "feature",
};

Object.freeze(ITEM_TYPES);

function getConfig(item, type, list) {
	let value;

	switch (type) {
		case ITEM_TYPES.ANNOTATION:
			value = item.annotation.name || "Annotation Name";
			break;
		case ITEM_TYPES.GROUP:
			value = item.name;
			break;
		case ITEM_TYPES.FEATURE:
			value = item.name;
			break;
		default:
			break;
	}
	const nameEditor = {
		view: "text",
		value,
		name: "edit-name",
		placeholder: "name",
		on: {
			onFocus() {
				const inputNode = this.getInputNode();
				inputNode.select();
			}
		}
	};
	const descriptionEditor = type === ITEM_TYPES.ANNOTATION
		? {
			view: "textarea",
			value: item.annotation.description || "",
			placeholder: "description",
		}
		: {height: 1};

	const saveAnnotationHandler = function() {
		const editPopup = this.getTopParentView();
		const name = editPopup.queryView({view: "text"}).getValue();
		const description = editPopup.queryView({view: "textarea"}).getValue();
		item.annotation.name = name;
		item.annotation.description = description;
		list.updateItem(item.id, item);
	};

	const saveGroupHandler = function () {
		const editPopup = this.getTopParentView();
		const name = editPopup.queryView({view: "text"}).getValue();
		item.name = name;
		list.updateItem(item.id, item);
		item.group.displayName = name;
	};

	const saveFeatureHandler = function () {
		const editPopup = this.getTopParentView();
		const name = editPopup.queryView({view: "text"}).getValue();
		item.name = name;
		list.updateItem(item.id, item);
		item.feature.displayName = name;
	};

	return {
		view: "popup",
		body: {
			rows: [
				nameEditor,
				descriptionEditor,
				{
					view: "button",
					value: "Save",
					click() {
						switch (type) {
							case ITEM_TYPES.ANNOTATION:
								saveAnnotationHandler.call(this);
								break;
							case ITEM_TYPES.GROUP:
								saveGroupHandler.call(this);
								break;
							case ITEM_TYPES.FEATURE:
								saveFeatureHandler.call(this);
								break;
							default:
								break;
						}
						const editPopup = this.getTopParentView();
						editPopup.destructor();
					},
				},
			]
		},
		on: {
			onShow() {
				const textEditor = this.queryView({name: "edit-name"});
				textEditor.focus();
			}
		}
	};
}

export default {
	ITEM_TYPES,
	getConfig,
};
