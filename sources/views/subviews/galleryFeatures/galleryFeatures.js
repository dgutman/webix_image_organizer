import {JetView} from "webix-jet";
import constants from "../../../constants";
import utils from "../../../utils/utils";

let hiddenViews = true;

export default class GalleryFeatures extends JetView {
	config() {
		const galleryFeaturesTemplate = {
			height: 27,
			width: 140,
			view: "template",
			borderless: true,
			name: "galleryFeaturesTemplateName",
			css: `collapssible-accordion ${utils.getCssCollapsedClass(hiddenViews)}`,
			template: "Gallery features",
			onClick: {
				"collapssible-accordion": () => {
					utils.collapseViews(this.galleryFeaturesTemplate, this.galleryFeaturesViews, hiddenViews);
					hiddenViews = !hiddenViews;
				}
			}
		};

		const dataviewYCountSelction = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			css: "select-field",
			// hidden: true,
			id: constants.ID_GALLERY_RICHSELECT,
			name: "dataviewYCountSelctionName",
			width: 330,
			labelWidth: 100,
			label: "Choose size",
			height: 36,
			placeholder: "Select image size",
			value: utils.getDataviewSelectionId(),
			options: [
				constants.THREE_DATAVIEW_COLUMNS,
				constants.FIVE_DATAVIEW_COLUMNS,
				constants.DEFAULT_DATAVIEW_COLUMNS
			]
		};

		const makeLargeImagesButton = {
			view: "button",
			css: "transparent-button",
			name: "makeLargeImagesButtonName",
			width: 150,
			hidden: true,
			value: "Make large images"
		};


		const filterBySelection = {
			view: "richselect",
			css: "select-field",
			icon: utils.getSelectIcon(),
			name: "filterBySelectionName",
			width: 330,
			label: "Filter gallery",
			labelWidth: 100,
			placeholder: "Select file type",
			value: "all",
			options: {
				body: {
					template: (obj) => {
						if (obj.value) {
							if (obj.value === "folders") {
								return `Show ${obj.value.toUpperCase()}`;
							}
							return `Show ${obj.value.toUpperCase()} files`;
						}
					},
					data: [{id: "all", value: "all"}, {id: "folders", value: "folders"}]
				}
			}
		};

		const filterByName = {
			view: "search",
			css: "search-field",
			name: "filterByNameView",
			placeholder: "Type file name",
			width: 330,
			labelWidth: 100,
			label: "Search files"
		};

		const galleryImageViewer = {
			view: "richselect",
			css: "select-field",
			icon: utils.getSelectIcon(),
			name: "galleryImageViewerName",
			width: 355,
			label: "Choose type",
			value: constants.THUMBNAIL_DATAVIEW_IMAGES,
			labelWidth: 100,
			options: [
				constants.THUMBNAIL_DATAVIEW_IMAGES,
				constants.LABEL_DATAVIEW_IMAGES,
				constants.MACRO_DATAVIEW_IMAGES
			]
		};

		return {
			name: "galleryFeaturesClass",
			padding: 5,
			rows: [
				{
					cols: [
						{width: 30},
						galleryFeaturesTemplate,
						{}
					]
				},
				{
					padding: 3,
					name: "galleryFeaturesViews",
					hidden: hiddenViews,
					cols: [
						{width: 45},
						galleryImageViewer,
						{},
						dataviewYCountSelction,
						{},
						makeLargeImagesButton,
						{},
						filterBySelection,
						{},
						filterByName,
						{},
						{width: 45}
					]
				}
			]
		};
	}

	ready() {
		this.galleryFeaturesTemplate = this.getGalleryFeaturesTemplate();
		this.galleryFeaturesViews = this.getGalleryFeaturesViews();
	}


	getDataviewYCountSelection() {
		return this.getRoot().queryView({name: "dataviewYCountSelctionName"});
	}

	getFilterBySelectionView() {
		return this.getRoot().queryView({name: "filterBySelectionName"});
	}

	getFilterByNameView() {
		return this.getRoot().queryView({name: "filterByNameView"});
	}

	getMakeLargeImageButton() {
		return this.getRoot().queryView({name: "makeLargeImagesButtonName"});
	}

	getGalleryFeaturesTemplate() {
		return this.getRoot().queryView({name: "galleryFeaturesTemplateName"});
	}

	getGalleryFeaturesViews() {
		return this.getRoot().queryView({name: "galleryFeaturesViews"});
	}

	getGalleryImageViewer() {
		return this.getRoot().queryView({name: "galleryImageViewerName"});
	}
}
