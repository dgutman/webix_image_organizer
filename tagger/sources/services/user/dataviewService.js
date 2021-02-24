import constants from "../../constants";
import windowParts from "../../views/windows/windowParts";
import DataviewService from "../dataview/dataviewService";

export default class UserDataViewService extends DataviewService {
	constructor(dataview, dataviewStore, pager, imageSizeSelect) {
		super(dataview, pager);
		this.dataviewStore = dataviewStore;
		this.imageSizeSelect = imageSizeSelect;

		const sizeValue = windowParts.getImageMultiplierId();
		this.imageSizeSelect.setValue(sizeValue);
	}

	changeImageSize(id) {
		windowParts.setImageMultiplierId(id);
		this.setImageSize(id);
	}
}
