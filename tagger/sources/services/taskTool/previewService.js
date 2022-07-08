import auth from "../authentication";
import DataviewService from "../user/dataviewService";
import CustomDataPull from "../../models/customDataPullClass";
import globalEvents from "../globalEvents";
import imageWindow from "../../views/windows/imageWindow";
import UpdatedImagesService from "../user/updateImageService";
import constants from "../../constants";
import InfoPopup from "../../views/windows/infoPopup";
import hotkeysFactory from "../user/hotkeys";
import state from "../../models/state";
import UserService from "../user/userService";

export default class previewService extends UserService {
	constructor(view, iconsTemplateService) {
		super(view, iconsTemplateService);
		this._view = view;
		this._iconsTemplateService = iconsTemplateService;
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		const scope = this._view.$scope;
		// child views
		this._dataview = scope.getUserDataview();
		this._dataviewStore = new CustomDataPull(this._dataview);
		this._pager = scope.getDataviewPager();
		this._imageSizeSelect = scope.getSelectImageSize();
		this._tagSelect = scope.getTagSelect();
		this._valueSelect = scope.getValueSelect();
		this._imageWindow = scope.ui(imageWindow);
		this._tagInfoTemplate = scope.getTagInfoTemplate();
		this._hotkeyInfoTemplate = scope.getHotkeysInfoTemplate();
		this._tagInfoPopup = scope.ui(new InfoPopup(scope.app, "tag", "Tag help"));
		this._hotkeysInfoPopup = scope.ui(new InfoPopup(scope.app, "hotkeys", "Hot-keys"));
		this._itemMetadataPopup = scope.ui(new InfoPopup(scope.app, "metadata", "Metadata", true));

		this._dataviewService = new DataviewService(this._dataview,	this._dataviewStore, this._pager, this._imageSizeSelect);

		this._attachViewEvents();

		if (auth.isLoggedIn() && auth.isAdmin()) {
			this._loggedInUserService();
		}
	}

	_attachViewEvents() {
		this._attachDataviewEvents();
		this._view.$scope.on(this._view.$scope.app, "windowResize", () => {
			this._setPopupsPosition();
			this._resizeDataview();
		});

		this._imageSizeSelect.attachEvent("onChange", (val) => {
			this._dataviewService.changeImageSize(val);
			this._resizeDataview();
		});

		this._view.attachEvent("onViewShow", () => {
			state.app.callEvent("toggleVisibilityOfBackButton", [true]);
			state.app.callEvent("toggleVisibilityOfCancelButton", [false]);
			const sizeValue = this._imageSizeSelect.getValue();
			this._dataviewService.changeImageSize(sizeValue);
			setTimeout(() => {
				this._resizeDataview();
			});
		});

		this._view.$scope.on(state.app, "BackButtonClick", () => {
			this._hotkeysInfoPopup.closeWindow();
			this._tagInfoPopup.closeWindow();
			this._itemMetadataPopup.closeWindow();
			this._view.getParentView().back();
			state.app.callEvent("toggleVisibilityOfCancelButton", [true]);
			document.querySelector(".main-header-admin a").innerHTML = '<span class="webix_icon wxi-angle-left"></span> Cancel';
			state.app.callEvent("toggleVisibilityOfBackButton", [false]);
		});
	}

	_loggedInUserService() {
		this._updatedImagesService = new UpdatedImagesService(
			this._dataview,
			this._dataviewStore,
			this._tagSelect,
			this._valueSelect
		);

		this._hotkeysService = hotkeysFactory.createService(
			this._dataview,
			this._dataviewStore,
			this._tagSelect,
			this._valueSelect,
			this._updatedImagesService,
			this._dataviewService
		);

		const tagList = this._tagSelect.getList();
		const valuesList = this._valueSelect.getList();

		this._tagSelect.attachEvent("onChange", (id, oldId, preselectedValue) => {
			valuesList.clearAll();
			this._valueSelect.setValue();
			this._tagInfoTemplate.setValues({description: this.taskDescription || ""});
			if (id) {
				const tag = tagList.getItem(id);
				valuesList.parse(tag.values);

				this._tagInfoTemplate.setValues(tag);

				if (this._tagInfoPopup.isVisible()) {
					const obj = this._tagInfoTemplate.getValues() || {description: this.taskDescription || ""};
					this._tagInfoPopup.setNewData(obj);
				}

				let preselectedId = preselectedValue ? preselectedValue.id : valuesList.getFirstId();
				if (!preselectedValue && tag.type === constants.TAG_TYPES.MULTI_WITH_DEFAULT) {
					const defaultValue = valuesList.find(value => value.default, true);
					preselectedId = defaultValue ? defaultValue.id : preselectedId;
					valuesList.updateItem(preselectedId, {default: true});
				}
				this._valueSelect.setValue(preselectedId);
			}
		});

		this._hotkeyInfoTemplate.define("onClick", {
			"info-template-icon": () => {
				this._showInfoPopup(this._hotkeyInfoTemplate, this._hotkeysInfoPopup);
			}
		});

		this._tagInfoTemplate.define("onClick", {
			"info-template-icon": () => {
				this._showInfoPopup(this._tagInfoTemplate, this._tagInfoPopup);
			}
		});
	}

	parseImages(images) {
		this._dataviewStore.clearAll();
		this._dataviewStore.parseItems(images);
		this._toggleVisibilityOfHiddenViews(true);
		this._resizeDataview();
	}

	parseTagsAndValues(task) {
		this.taskDescription = task.description;
		const tagList = this._tagSelect.getList();
		tagList.clearAll();

		const tags = task.tags.map((tag) => {
			tag._id = webix.uid();
			tag.values = Object.values(tag.values);
			return tag;
		});

		tagList.parse(tags);
		const firstId = tagList.getFirstId();
		if (firstId) {
			this._tagSelect.setValue(firstId);
		}

		this._updatedImagesService.collectValueHotkeys();
		this._parseHotkeysInfoTemplateData();
		this._hotkeysService.selectNewScope(task.name, this._updatedImagesService.hotkeys);
	}

	_getNotLoadedItemIndex() {
		const pData = this._pager.data;
		const offset = pData.size * pData.page;
		const last = offset + pData.size;
		const items = this._dataview.data.serialize();
		const pageItems = items.slice(offset, last);
		const pageIndex = pageItems.findIndex(item => !item);
		const index = pageIndex + offset;
		const limit = pData.size - pageIndex;

		return {index, pageIndex, limit};
	}

	_setDataviewOverLay() {
		const count = this._dataview.count();
		this._dataviewService.setDataviewState(count, "No items to review");
	}
}
