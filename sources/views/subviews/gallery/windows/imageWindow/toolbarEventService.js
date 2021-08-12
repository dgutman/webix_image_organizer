export default class ToolbarEventServices {
	constructor(imageWindowView, toolbarView, imageWindowViewModel) {
		this._imageWindowView = imageWindowView;
		this._toolbarView = toolbarView;
		this._imageWindowViewModel = imageWindowViewModel;
	}

	init() {
		this._attachControlsEvents();
	}

	_attachControlsEvents() {
		this._imageWindowView.on(this._imageWindowView.app, "refreshLayersRichselect", () => {
			const richselectList = this._imageWindowView.getRoot().queryView({view: "richselect"}).getList();
			richselectList.clearAll();
			this._imageWindowView.layouts = [{
				id: "1",
				type: "layer",
				fillColor: "#00FF00",
				strokeColor: "#000000",
				value: "Default Layer",
				open: true
			}];
			richselectList.parse(this._imageWindowView.layouts);
			const firstItemId = this._imageWindowView.getRoot().queryView({view: "richselect"}).getList().getFirstId();
			this._imageWindowView.getRoot().queryView({view: "richselect"}).setValue(firstItemId);
		});

		this._imageWindowView.on(this._imageWindowView.app, "unselectFigureButton", (shape) => {
			this._imageWindowView.organizeButtonsAction(shape);
		});

		this._imageWindowView.on(this._imageWindowView.app, "enableButtons", (value, isTCGACollection) => {
			let topToolbar = this._imageWindowView.getRoot().queryView({name: "top_toolbar"});
			let drawingToolbar = this._imageWindowView.getRoot().queryView({name: "drawing_toolbar"});
			this._imageWindowView.getRoot().queryView({switch: "drawing"}).setValue(false);
			if (value) {
				topToolbar.enable();
				drawingToolbar.enable();
			}
			else {
				topToolbar.disable();
				drawingToolbar.disable();
			}

			if (!isTCGACollection && isTCGACollection !== undefined) {
				if (!topToolbar.isEnabled()) {
					topToolbar.enable();
					drawingToolbar.enable();
				}
			}

			let childs = topToolbar.getChildViews();
			const tabsState = process.env.TABSTATE;
			for (let i = 0; i < childs.length; i++) {
				if (tabsState) {
					if (tabsState[childs[i].config.name] === "disable") {
						if (childs[i].isEnabled()) {
							childs[i].disable();
						}
					}
					else if (tabsState[childs[i].config.name] === "enable") {
						if (!childs[i].isEnabled()) {
							childs[i].enable();
						}
					}
				}
			}
		});

		this._imageWindowView.on(this._imageWindowView.app, "imageLoad", (item) => {
			this._imageWindowViewModel.setItem(item);
		});

		this._imageWindowView.on(this._imageWindowView.app, "hidePopup", () => {
			this._pathologyPopup.hideWindow();
			this._metadataPopup.hideWindow();
			this._annotationPopup.hidePopup();
			this._applyFiltersPopup.hideWindow();
		});
	}
}
