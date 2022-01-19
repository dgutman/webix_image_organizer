import metadataTableModel from "../../models/metadataTableModel";
import constants from "../../constants";

const buttonDeleteIcon = "fas fa-times";
const buttonPlusIcon = "fas fa-plus";

export default class NewColumnsClass {
	constructor(root, userInfo) {
		this.root = root;
		this.newColumnsLayout = root.$scope.getLayoutForNewColumns();
		this.newColumnsForm = root.$scope.getFormForNewColumns();
		this.mainForm = root.$scope.getWindowForm();
		this.userInfo = userInfo;
	}

	createFormElementForNewColumns(columnConfig) {
		const element = {
			view: "form",
			id: columnConfig.id,
			type: "clean",
			borderless: true,
			rules: {
				itemField: (value) => {
					const regex = new RegExp(constants.PATTERN_ITEM_FIELDS, "g");
					const result = value.match(regex);

					const currentFieldForm = $$(columnConfig.id);
					const newFieldsForms = this.newColumnsForm.queryView({view: "form"}, "all");
					const isNotUnique = newFieldsForms.find(form => form.getValues().itemField === value && form !== currentFieldForm);
					const initialColumnIds = Object.values(constants.INITIAL_COLUMNS_IDS);
					return result && result[0] === value &&
						!metadataTableModel.metadataDotObject.hasOwnProperty(value) &&
						!isNotUnique && !initialColumnIds.includes(value);
				},
				columnName: webix.rules.isNotEmpty
			},
			cols: [
				{
					view: "text",
					name: "itemField",
					placeholder: "e.g. clinicalData.person.age",
					css: "text-field",
					columnConfig,
					height: 27,
					on: {
						onChange: (val) => {
							const newColumnForm = webix.$$(columnConfig.id);
							const dotNotation = val.split(".");
							const header = dotNotation.pop();

							newColumnForm.setValues({
								itemField: val,
								columnName: header
							});
						}
					}
				},
				{width: 10},
				{
					view: "text",
					name: "columnName",
					placeholder: "e.g. age (read only)",
					css: "text-field",
					readonly: true,
					height: 20
				},
				{
					view: "button",
					type: "icon",
					icon: buttonDeleteIcon,
					width: 30,
					click: () => {
						this.removeNewColumn(columnConfig.id);
					}
				}
			]
		};
		return element;
	}

	addNewColumn() {
		const columnConfig = metadataTableModel.getConfigForNewColumn();
		const newElement = this.createFormElementForNewColumns(columnConfig);
		const elementsLength = this.newColumnsForm.getChildViews().length;
		this.newColumnsForm.addView(newElement, elementsLength);
		const scrollview = this.root.queryView({view: "scrollview"});
		this.showOrHideNewColumnsLayout();
		// scroll to bottom
		scrollview.scrollTo(0, (this.newColumnsLayout.$height + this.mainForm.$height) - scrollview.$height);
	}

	removeNewColumn(columnId) {
		this.newColumnsForm.removeView(columnId);
		this.showOrHideNewColumnsLayout();
	}

	addNewColumnsFromLS() {
		let newItemFields = metadataTableModel.getLocalStorageNewItemFields();
		if (newItemFields) {
			newItemFields = newItemFields.filter((item) => {
				if (metadataTableModel.metadataDotObject.hasOwnProperty(item)) {
					return false;
				}
				metadataTableModel.metadataDotObject[item] = "";
				return item;
			});
			metadataTableModel.putNewItemFieldsToStorage(newItemFields, this.userInfo._id);
		}
	}

	saveNewColumns() {
		const idsToDelete = {};

		const localNewItemFields = metadataTableModel.getLocalStorageNewItemFields() || [];
		const newItemFields = this.newColumnsForm.queryView({view: "form"}, "all")
			.filter((view) => {
				const field = view.getValues().itemField;
				if (view.validate() && !localNewItemFields.includes(field)) {
					idsToDelete[field] = view.config.id;
					return true;
				}
				return false;
			})
			.map(view => view.getValues().itemField);

		metadataTableModel.putNewItemFieldsToStorage(localNewItemFields.concat(newItemFields), this.userInfo._id);

		const itemFieldsConfig = newItemFields.map((field) => {
			const dotNotation = field.split(".");
			const header = dotNotation.map(text => ({text}));

			this.removeNewColumn(idsToDelete[field]);
			delete idsToDelete[field];

			return this.root.$scope.createFormElement({id: field, header}, buttonPlusIcon);
		});

		if (itemFieldsConfig.length && !$$("users-section")) {
			this.mainForm.addView({type: "section", template: "USER'S COLUMNS", id: "users-section"}, 0);
		}
		itemFieldsConfig.forEach((config) => {
			this.mainForm.addView(config, 1);
		});
	}

	showOrHideNewColumnsLayout() {
		const formCount = this.newColumnsForm.queryView({view: "form"}, "all").length;
		if (formCount) {
			this.newColumnsLayout.show();
		}
		else {
			this.newColumnsLayout.hide();
		}
	}

	clearNewColumnsForm() {
		this.newColumnsForm.queryView({view: "form"}, "all")
			.map(view => view.config.id)
			.forEach((id) => {
				this.removeNewColumn(id);
			});
	}
}
