import geo from "geojs";

export default class ImageTemplateEventsService {
	constructor(imageWindowView, imageWindowViewModel) {
		this._imageWindowView = imageWindowView;
		this._imageWindowViewModel = imageWindowViewModel;
	}

	init() {
		this._attachControlsEvents();
	}

	_attachControlsEvents() {
		this._imageWindowView.on(this._imageWindowView.app, "treecheckboxesClicked", (annTable, labelsBool) => {
			this._imageWindowViewModel.treeCheckBoxesClicked(annTable, labelsBool);
		});

		/* 	CALLED WHERE WE DELETED LAYER OR ADDED NEW LAYER */
		this._imageWindowView.on(this._imageWindowView.app, "changeTreeannotations", (newLayer) => {
			if (newLayer) {
				newLayer.id =
					Number(this._imageWindowViewModel.treeannotations[this._imageWindowViewModel.treeannotations.length - 1].id) + 1;
				this._imageWindowViewModel
					.treeannotations[this._imageWindowViewModel.treeannotations.length] = newLayer;
				this._imageWindowViewModel.currentLayerId = newLayer.id;
				this._imageWindowViewModel.updateGirderWithAnnotationData();
				this._imageWindowView.app.callEvent("setLayer", [this._imageWindowViewModel.currentLayerId, newLayer]);
			}
			else {
				this._imageWindowView.app.callEvent("setLayer", []);
			}
		});

		this._imageWindowView.on(this._imageWindowView.app, "imageLoad", (array) => {
			if (!array) {
				this._imageWindowView.getRoot().queryView({name: "imageTemplate"}).refresh();
				return;
			}
			this._imageWindowViewModel.setItem(array);
			this._imageWindowView.getRoot().queryView({name: "imageTemplate"}).parse(array);
		});

		this._imageWindowView.on(this._imageWindowView.app, "clearImageTemplate", () => {
			this._imageWindowViewModel.setItem({});
			this._imageWindowView.getRoot().queryView({name: "imageTemplate"}).parse({});
		});

		this._imageWindowView.on(this._imageWindowView.app, "drawFigure", (figure) => {
			this._imageWindowViewModel.isAnnotationAdd = false;
			if (window.annotationLayer) {
				this._imageWindowViewModel.annotationsLength = window.annotationLayer.annotations().length;
			}
			this._imageWindowViewModel.draw(figure);
		});

		this._imageWindowView.on(this._imageWindowView.app, "setSlide", (sd, boolValue) => {
			this._imageWindowView.app.callEvent("refreshLayersRichselect", []);
			this._imageWindowViewModel.slide = sd;
			this._imageWindowViewModel.resetDataStructures(boolValue);
			let params = geo.util.pixelCoordinateParams("#geojs", sd.tiles.sizeX, sd.tiles.sizeY, sd.tiles.tileWidth, sd.tiles.tileHeight);
			params.map.clampZoom = false;
			params.map.clampBoundsX = false;
			params.map.clampBoundsY = false;
			window.map = geo.map(params.map);
			window.map.autoResize(true);
			this._imageWindowViewModel.layer = window.map.createLayer("annotation");
			window.annotationLayer = this._imageWindowViewModel.layer;
			window.map.interactor().options({actions: []});
			this._imageWindowViewModel.lastLabelNumber = 0;
			let openSeadragonViewer = this._imageWindowView.getOSDViewer();
			// add handlers to tie navigation events together
			openSeadragonViewer.addHandler("open", this._imageWindowViewModel.setBounds, openSeadragonViewer);
			openSeadragonViewer.addHandler("animation", this._imageWindowViewModel.setBounds, openSeadragonViewer);
			window.map.geoOn(geo.event.annotation.state, this._imageWindowViewModel.newAnnotation);

			// get metadata to load existing annotations
			if (boolValue) {
				if (this._imageWindowView.geoJSON && this._imageWindowViewModel.treeannotations.length !== 0) {
					this._imageWindowViewModel.layer.geojson(this._imageWindowView.geoJSON, "update");
				}
				this._imageWindowViewModel.treeCheckBoxesClicked("", "", true);
				let fullPageButton = document.querySelector(".fullpageButton");
				if (fullPageButton && fullPageButton.style.display === "inline-block") {
					document.querySelector("#geojs .geojs-layer").style.pointerEvents = "auto";
				}
				return;
			}
			this._imageWindowViewModel.getMetadataAndLoadAnnotations();
		});

		this._imageWindowView.on(this._imageWindowView.app, "toggleLabel", (newValue) => {
			this._imageWindowViewModel.toggleLabel(newValue);
		});

		this._imageWindowView.on(this._imageWindowView.app, "richselectChanged", (newValue) => {
			this._imageWindowViewModel.currentLayerId = newValue;
		});

		this._imageWindowView.on(this._imageWindowView.app, "deleteAnnotation", (curAnnotationToDelete, item, annTable) => {
			this._imageWindowViewModel.table = annTable;
			if (item.type === "layer") {
				let annotation = this._imageWindowViewModel.layer.annotationById(curAnnotationToDelete.geoid);
				this._imageWindowViewModel.layer.removeAnnotation(annotation);
				this._imageWindowViewModel.propertiesEdited("deleteAnnotation", curAnnotationToDelete.geoid, "", "", annTable, item.type);
			}
			else {
				let annotation = this._imageWindowViewModel.layer.annotationById(item.geoid);
				this._imageWindowViewModel.layer.removeAnnotation(annotation);
				this._imageWindowViewModel.propertiesEdited("deleteAnnotation", item.geoid, "", "", annTable);
			}
		});

		this._imageWindowView.on(this._imageWindowView.app, "deleteLayer", (item, table) => {
			this._imageWindowViewModel.table = table;
			this._imageWindowViewModel.propertiesEdited("deleteLayer", item.id, "", "", table);
		});

		this._imageWindowView.on(this._imageWindowView.app, "editFigureParametrs", (item, column, val) => {
			let annotation = this._imageWindowViewModel.layer.annotationById(item.geoid);
			let opt = annotation.options("style");
			opt[column] = val;
			annotation.options({style: opt}).draw();
			this._imageWindowViewModel.propertiesEdited(column, item.geoid, val, "");
		});

		this._imageWindowView.on(this._imageWindowView.app, "afterEditStop", (item, editor, state) => {
			if (!item) return;
			let annotation = this._imageWindowViewModel.layer.annotationById(item.geoid);
			if (!annotation && item.type === "layer") {
				let layer;
				for (let i = 0; i < this._imageWindowViewModel.treeannotations.length; i++) {
					if (this._imageWindowViewModel.treeannotations[i].id === item.id) {
						this._imageWindowViewModel.treeannotations[i].value = item.value;
						this._imageWindowViewModel.treeannotations[i][editor.column] = state.value;
						layer = this._imageWindowViewModel.treeannotations[i];
						break;
					}
				}
				this._imageWindowView.app.callEvent("changeRichselectData", [this._imageWindowViewModel.treeannotations]);
				this._imageWindowViewModel.updateGirderWithAnnotationData("", item);

				if (layer && editor.column !== "value") {
					for (let i = 0; i < layer.data.length; i++) {
						let childAnnotation = this._imageWindowViewModel.layer.annotationById(layer.data[i].geoid);
						let options = childAnnotation.options("style");
						if (childAnnotation) {
							if (options) {
								options[editor.column] = layer[editor.column];
								childAnnotation.options({style: options}).draw();
							}

							this._imageWindowViewModel.propertiesEdited("annotationStyleChange", layer.data[i].geoid, layer[editor.column], editor.column);
						}
					}
				}
				return;
			}
			else if (item.type !== "layer" && editor.column === "value" && item.hasOwnProperty("$parent")) {
				for (let i = 0; i < this._imageWindowViewModel.treeannotations.length; i++) {
					if (this._imageWindowViewModel.treeannotations[i].id === item.$parent) {
						let layerShapes = this._imageWindowViewModel.treeannotations[i].data;
						for (let j = 0; j < layerShapes.length; j++) {
							if (layerShapes[j].id === item.id) {
								layerShapes[j].value = state.value;

								let evt = this._imageWindowViewModel.layer.annotationById(item.geoid);
								if (evt) {
									evt.label(state.value);
								}
								this._imageWindowViewModel.updateGirderWithAnnotationData("", item);
								window.map.draw();
								break;
							}
						}
						break;
					}
				}
				return;
			}

			let opt = annotation.options("style");

			if (editor.column === "name") {
				// Name edit to  Geo JSON
				annotation.name(state.value);
				window.map.draw();
			}
			else {
				// Color (Stroke & Fill) edits to  Geo JSON
				opt[editor.column] = state.value;
				annotation.options({style: opt}).draw();
			}
			this._imageWindowViewModel.propertiesEdited("annotationStyleChange", item.geoid, state.value, editor.column);
		});

		this._imageWindowView.on(this._imageWindowView.app, "disabledDrawingPointer", () => {
			if (document.querySelector("#geojs .geojs-layer")) document.querySelector("#geojs .geojs-layer").style.pointerEvents = "none";
			this._imageWindowViewModel.currentShape = "";
		});

		this._imageWindowView.on(this._imageWindowView.app, "setBounds", () => {
			this._imageWindowViewModel.setBounds(this._imageWindowView.getOSDViewer());
			this._imageWindowView.isSetBounds = true;
		});

		this._imageWindowView.on(this._imageWindowView.app, "changeRichselectData", (treeannotation) => {
			this._imageWindowViewModel.layouts = treeannotation;
			let richselect = this._imageWindowView.getRoot().queryView({ view: "richselect" });
			let list = richselect.getList();
			list.clearAll();
			list.parse(this._imageWindowViewModel.layouts);
			richselect.setValue(list.getFirstId());
			richselect.refresh();
		});

		this._imageWindowView.on(this._imageWindowView.app, "setLayer", (layerId) => {
			let richselect = this._imageWindowView.getRoot().queryView({view: "richselect"});
			if (!layerId) {
				layerId = richselect.getList().getFirstId();
			}
			richselect.setValue(layerId);
		});

		this._imageWindowView.on(this._imageWindowView.app, "treecheckboxesClickedLabelsChecked", (table, checkedId) => {
			let switchElement = this._imageWindowView.getRoot().queryView({switch: "label"});
			let value = switchElement.getValue();
			this._imageWindowView.app.callEvent("treecheckboxesClicked", [table, value, checkedId]);
		});
	}
}
