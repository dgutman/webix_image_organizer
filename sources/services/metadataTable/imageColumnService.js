import constants from "../../constants";
import metadataTableModel from "../../models/metadataTableModel";
import authService from "../authentication";

const buttonMinusIcon = "fas fa-minus";
const buttonPlusIcon = "fas fa-plus";

export default class ImageColumnService {
	constructor(root) {
		this.root = root;
		this.newColumnsLayout = root.$scope.getLayoutForNewColumns();
		this.newColumnsForm = root.$scope.getFormForNewColumns();
		this.mainForm = root.$scope.getWindowForm();
	}

	getFormElementForImageColumn(isAdded, columnConfig) {
		const config = columnConfig || constants.METADATA_TABLE_IMAGE_COLUMN_CONFIG;

		return {
			cols: [
				{
					view: "select",
					css: "select-field",
					columnConfig: config,
					options: constants.METADATA_TABLE_IMAGES_TYPES,
					value: config.imageType,
					disabled: isAdded,
					name: "imageTypeSelect",
					height: 20
				},
				{width: 10},
				{
					view: "select",
					css: "select-field",
					options: constants.METADATA_TABLE_IMAGES_SIZES,
					value: config.imageSize,
					disabled: isAdded,
					name: "imageSizeSelect",
					height: 20
				},
				{
					view: "button",
					type: "icon",
					actionButtonName: "-image-button",
					icon: isAdded ? buttonMinusIcon : buttonPlusIcon,
					width: 30,
					click: () => {
						const actionButton = this.root.queryView({actionButtonName: "-image-button"});
						const imageSizeSelect = this.root.queryView({name: "imageSizeSelect"});
						const imageTypeSelect = this.root.queryView({name: "imageTypeSelect"});

						if (actionButton.config.icon === buttonMinusIcon) {
							this.removeImageColumnFromConfig(columnConfig.id);
							actionButton.define("icon", buttonPlusIcon);
							actionButton.refresh();
							imageSizeSelect.enable();
							imageTypeSelect.enable();
						}
						else if (actionButton.config.icon === buttonPlusIcon) {
							config.imageSize = imageSizeSelect.getValue();
							config.imageType = imageTypeSelect.getValue();
							this.addImageColumnToConfig(config);
							actionButton.define("icon", buttonMinusIcon);
							actionButton.refresh();
							imageSizeSelect.disable();
							imageTypeSelect.disable();
						}
					}
				}
			]
		};
	}

	removeImageColumnFromConfig(id) {
		const userInfo = authService.getUserInfo();
		let existedColumns = metadataTableModel.getLocalStorageColumnsConfig() || metadataTableModel.getInitialColumnsForDatatable();

		existedColumns = existedColumns.filter(config => config.id !== id);
		metadataTableModel.putInLocalStorage(existedColumns, userInfo._id);
	}

	addImageColumnToConfig(columnConfig) {
		const userInfo = authService.getUserInfo();
		const existedColumns = metadataTableModel.getLocalStorageColumnsConfig() || metadataTableModel.getInitialColumnsForDatatable();

		columnConfig.$height = columnConfig.imageSize;
		columnConfig.width = 80;
		existedColumns.unshift(columnConfig);
		metadataTableModel.putInLocalStorage(existedColumns, userInfo._id);
	}
}
