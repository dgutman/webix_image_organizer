import ajax from "../services/ajaxActions";

export default class imageWindowViewModel {
	constructor(imageWindowView) {
		this._imagesWindowView = imageWindowView;
		this.layouts = [{
			id: "1",
			type: "layer",
			fillColor: "#00FF00",
			strokeColor: "#000000",
			value: "Default Layer",
			open: true
		}];
		this.treeannotations = [{
			id: "1",
			type: "layer",
			fillColor: "#00FF00",
			strokeColor: "#000000",
			// checked: true,
			value: "Default Layer",
			open: true,
			data: []
		}];
		this.layer = null;
		this.slide = null;
		this.currentLayerId = "1";
		this.currentShape = "";
		this.table = null;
		this.selectedData = null;
		this.isReloadData = false;
		this.annotationsLength = 0;
		this.isAnnotationAdd = false;
		this.lastLabelNumber = 0;

		this.newAnnotation = ((model, view) => {
			return (evt) => {
				let idArray = [];
				let annotationLabelNumber;
				const annotationsArray = window.annotationLayer.annotations();
				for (let i = 0; i < annotationsArray.length; i++) {
					if (annotationsArray[i].id() !== evt.annotation.id()) {
						idArray.push(annotationsArray[i].id());
					}
				}
	
				if (idArray.length !== 0) {
					const lastId = Math.max(...idArray);
					let currentLayerIndex = 0;
					model.treeannotations.some((treeannotation, treeannotationIndex) => {
						if (treeannotation.id === model.currentLayerId) {
							currentLayerIndex = treeannotationIndex;
							treeannotation.data.some((data) => {
								if (data.geoid === lastId && data.hasOwnProperty("labelId")) {
									annotationLabelNumber = data.labelId + 1;
									return true;
								}
								return false;
							});
							if (!annotationLabelNumber
									&& treeannotation.data.length !== 0
									&& treeannotation.data[treeannotation.data.length - 1].hasOwnProperty("labelId")) {
								annotationLabelNumber = view
									.treeannotations[currentLayerIndex]
									.data[treeannotation.data.length - 1]
									.labelId + 1
							}
						}
						if (annotationLabelNumber) {
							return true;
						}
						return false;
					});
					if (!annotationLabelNumber
						&& model.treeannotations[currentLayerIndex].data.length !== 0) {
						annotationLabelNumber = idArray[idArray.length - 1] + 1;
					}
					else if (!annotationLabelNumber) {
						annotationLabelNumber = 1;
					}
				}
				else {
					annotationLabelNumber = 1;
				}
				if (model.lastLabelNumber < annotationLabelNumber) {
					model.lastLabelNumber = annotationLabelNumber;
				}
				else model.lastLabelNumber += 1;

				document.querySelector("#geojs .geojs-layer").style.pointerEvents = "none";

				let newAnnotationTree = {
					id: `${model.currentLayerId}.${annotationLabelNumber}`,
					labelId: annotationLabelNumber,
					geoid: evt.annotation.id(),
					value: `${evt.annotation.type()[0].toUpperCase() + evt.annotation.type().substring(1)} ${model.lastLabelNumber}`,
					type: evt.annotation.type(),
					fillColor: "#00FF00",
					checked: true,
					fillOpacity: evt.annotation.options("style").fillOpacity,
					strokeColor: "#000000",
					strokeOpacity: evt.annotation.options("style").strokeOpacity,
					strokeWidth: evt.annotation.options("style").strokeWidth
				};
	
				evt.annotation.label(`${evt.annotation.type()[0].toUpperCase() + evt.annotation.type().substring(1)} ${model.lastLabelNumber}`);
				for (let i = 0; i < model.treeannotations.length; i++) {
					if (model.treeannotations[i].id === model.currentLayerId) {
						model.treeannotations[i].data.push(newAnnotationTree);
					}
				}
				let updateStringArray = JSON.stringify(model.treeannotations);
				let tempJSONArray = JSON.parse(updateStringArray);
				view.app.callEvent("annotationTableParse", [tempJSONArray]);
				view.app.callEvent("changeRichselectData", [model.treeannotations]);
				model.treeCheckBoxesClicked("", "", null, model.treeannotations);
				model.updateGirderWithAnnotationData();
				model.toggleLabel(window.switchLabel);
				model.isAnnotationAdd = true;
			};
		})(this, this._imagesWindowView);
	}

	setItem(item) {
		this.item = item;
	}

	getItem() {
		return this.item;
	}

	draw(type) {
		this.currentShape = type;
		document.querySelector("#geojs .geojs-layer").style.pointerEvents = "auto";
		this.layer.mode(this.currentShape);
	}

	setBounds() {
		let openSeadragonViewer = window.viewer;
		if (openSeadragonViewer) {
			let bounds = openSeadragonViewer
				.viewport
				.viewportToImageRectangle(openSeadragonViewer.viewport.getBounds(true));
			window.map.bounds({
				left: bounds.x,
				right: bounds.x + bounds.width,
				top: bounds.y,
				bottom: bounds.y + bounds.height
			});
		}
		if (window.imageZoom && openSeadragonViewer && window.imageZoomChange) {
			openSeadragonViewer.viewport.zoomTo(window.imageZoom);
			window.imageZoom = null;
			window.imageZoomChange = false;
		}
		if (this.isSetBounds && openSeadragonViewer) {
			openSeadragonViewer.viewport.goHome(true);
			this.isSetBounds = false;
		}
	}

	toggleLabel(switchValue) {
		for (let i = 0; i < this.treeannotations.length; i++) {
			for (let j = 0; j < this.treeannotations[i].data.length; j++) {
				let annotation = this.layer.annotationById(this.treeannotations[i].data[j].geoid);
				if (!switchValue) {
					annotation.options("showLabel", switchValue);
				}
				else if (this.treeannotations[i].data[j].checked) {
					annotation.options("showLabel", switchValue);
				}
				else {
					annotation.options("showLabel", false);
				}
				window.map.draw();
			}
		}
	}

	resetDataStructures(boolValue) {
		if (this.layer != null) {
			this.reinitializeTreeLayers(boolValue);
			this.layer.removeAllAnnotations();
			this.layer.geojson({}, true);
			window.map.draw();
		}
	}

	getMetadataAndLoadAnnotations() {
		let url = `${ajax.getHostApiUrl()}/item/${this.item._id}`;
		webix.ajax().get(url, (text) => {
			this.resetDataStructures();
			this.currentSlide = JSON.parse(text);
			if (typeof this.currentSlide !== "undefined"
				&& typeof this.currentSlide.meta !== "undefined") {
				let allShapesLength = 0;
				if (typeof this.currentSlide.meta.dsalayers !== "undefined"
					&& !this.isEmpty(this.currentSlide.meta.dsalayers)
					&& this.currentSlide.meta.dsalayers.length > 0) {
					this.treeannotations.length = 0;
					this.dsalayers = this.currentSlide.meta.dsalayers;
					this.treeannotations = this.currentSlide.meta.dsalayers;
					for (let i = 0; i < this.dsalayers.length; i++) {
						allShapesLength += this.dsalayers[i].data.length;
					}
					let geoIdArray = [];
					let labelId = [];
					for (let i = 0; i < this.dsalayers.length; i++) {
						for (let j = 0; j < this.dsalayers[i].data.length; j++) {
							geoIdArray.push(this.dsalayers[i].data[j].geoid);
							if (this.dsalayers[i].data[j].labelId) {
								labelId.push(this.dsalayers[i].data[j].labelId);
							}
						}
					}
					if (labelId.length !== 0) {
						labelId = labelId.sort();
						this.lastLabelNumber = labelId[labelId.length - 1];
					}
					else if (geoIdArray.length !== 0) {
						this.lastLabelNumber = Math.max(...geoIdArray);
					}
					else this.lastLabelNumber = 0;
					if (this.dsalayers) {
						this.reloadAnnotationsTable();
					}
				}
				else {
					this.reinitializeTreeLayers();
				}
				// Reload existing annotations.
				if (this.currentSlide.meta.hasOwnProperty("geojslayer") 
					&& !this.isEmpty(this.currentSlide.meta.geojslayer)
					&& this.currentSlide.meta.geojslayer.features
					&& !this.isEmpty(this.currentSlide.meta.geojslayer.features)) {
					let features = this.currentSlide.meta.geojslayer.features;
					if (allShapesLength > features.length) {
						this.dsalayers = this.dsalayers.filter((dsalayer) => {
							dsalayer.data = dsalayer.data.filter((data) => {
								let count = 0;
								features.forEach((feature) => {
									if (data.geoid !== feature.properties.annotationId) {
										count++;
									}
								});
								return count !== features.length;
							});
							return dsalayer.data.length !== 0;
						});
					}
					let geojsJSON = this.currentSlide.meta.geojslayer;
					this.geoJSON = this.currentSlide.meta.geojslayer;
					this.layer.geojson(geojsJSON, "update");
				}
				else {
					this.geoJSON = {};
					this.layer.geojson(this.geoJSON, "update");
				}
			}
			else {
				this.geoJSON = {};
				this.layer.geojson({}, "update");
			}
			this.treeCheckBoxesClicked();
		});
	}

	reloadAnnotationsTable() {
		let updateStringArray = JSON.stringify(this.treeannotations);
		let tempJSONArray = JSON.parse(updateStringArray);
		this._imagesWindowView.app.callEvent("annotationTableParse", [tempJSONArray]);
		this._imagesWindowView.app.callEvent("changeRichselectData", [this.treeannotations]);
	}


	updateGirderWithAnnotationData(table, item) {
		let updateStringArray = JSON.stringify(this.treeannotations);
		let tempJSONArray = JSON.parse(updateStringArray);
		if (item) {
			this._imagesWindowView.app.callEvent("annotationUpdateItem", [item]);
		}
		else {
			this._imagesWindowView.app.callEvent("annotationTableParse", [tempJSONArray]);
		}
		this._imagesWindowView.app.callEvent("changeRichselectData", [this.treeannotations]);

		let annots = this.layer.annotations();
		let geojsannotations = [];
		for (let i = 0; i < annots.length; i++) {
			let anno = {
				type: annots[i].type(),
				features: annots[i].features()
			};
			geojsannotations[i] = anno;
		}

		const geojsonParams = [
			undefined,
			undefined,
			undefined,
			true
		];

		let geojsonObj = this.layer.geojson(...geojsonParams);

		let metaInfo = {
			dsalayers: this.treeannotations,
			geojslayer: geojsonObj
		};

		this.geoJSON = geojsonObj;
		this.dsalayers = metaInfo.dsalayers;

		let url = `${ajax.getHostApiUrl()}/item/${this.item._id}`;

		webix.ajax().put(url, {metadata: metaInfo})
			.then(() => {
				webix.message("Changes are successfully saved");
			})
			.fail((err) => {
				const responseText = JSON.parse(err.responseText);
				const errMessage = responseText.message;
				webix.message({
					type: "debug",
					text: errMessage
				});
			});
	}

	treeCheckBoxesClicked(table, labelsBool, checkedIds, treeannotations) {
		if (table) {
			checkedIds = table.getChecked();
			this.selectedData = checkedIds;
			for (let i = 0; i < this.treeannotations.length; i++) {
				for (let j = 0; j < this.treeannotations[i].data.length; j++) {
					if (checkedIds.includes(this.treeannotations[i].id)) {
						this.treeannotations[i].checked = true;
					}
					else {
						this.treeannotations[i].checked = false;
					}
					let annotation = this.layer.annotationById(this.treeannotations[i].data[j].geoid);
					if (checkedIds.includes(this.treeannotations[i].data[j].id)) {
						this.treeannotations[i].data[j].checked = true;
						annotation.options("showLabel", labelsBool);
						if (this.treeannotations[i].data[j].type === "line") {
							annotation.style({strokeOpacity: 1});
						}
						else {
							annotation.style({fill: true, stroke: true});
						}
					}
					else {
						this.treeannotations[i].data[j].checked = false;
						annotation.options("showLabel", false);
						if (this.treeannotations[i].data[j].type === "line") {
							annotation.style({strokeOpacity: 0});
						}
						else {
							annotation.style({fill: false, stroke: false});
						}
					}
					window.map.draw();
				}
			}
		}
		else if (checkedIds) {
			for (let i = 0; i < this.treeannotations.length; i++) {
				for (let j = 0; j < this.treeannotations[i].data.length; j++) {
					let annotation = this.layer.annotationById(this.treeannotations[i].data[j].geoid);
					if (this.treeannotations[i].data[j].checked) {
						annotation.options("showLabel", window.switchLabel);
						if (this.treeannotations[i].data[j].type === "line") {
							annotation.style({strokeOpacity: 1});
						}
						else {
							annotation.style({fill: true, stroke: true});
						}
					}
					else {
						annotation.options("showLabel", false);
						if (this.treeannotations[i].data[j].type === "line") {
							annotation.style({strokeOpacity: 0});
						}
						else {
							annotation.style({fill: false, stroke: false});
						}
					}
					window.map.draw();
				}
			}
		}
		else if (treeannotations) {
			for (let i = 0; i < this.treeannotations.length; i++) {
				let count = 0;
				for (let j = 0; j < this.treeannotations[i].data.length; j++) {
					if (this.treeannotations[i].data[j].checked) {
						count++;
					}
				}
				if (count === this.treeannotations[i].data.length) {
					this.treeannotations[i].checked = true;
				}
				else {
					this.treeannotations[i].checked = false;
				}
			}
		}
		else {
			for (let i = 0; i < this.treeannotations.length; i++) {
				for (let j = 0; j < this.treeannotations[i].data.length; j++) {
					const annotation = this.layer.annotationById(this.treeannotations[i].data[j].geoid);
					this.treeannotations[i].data[j].checked = false;
					annotation.options("showLabel", false);
					if (this.treeannotations[i].data[j].type === "line") {
						annotation.style({strokeOpacity: 0});
					}
					else {
						annotation.style({fill: false, stroke: false});
					}
					window.map.draw();
				}
				this.treeannotations[i].checked = false;
			}
			this.reloadAnnotationsTable();
		}
	}

	reinitializeTreeLayers(boolValue) {
		if (boolValue) return;
		this.treeannotations.length = 0;
		this.treeannotations = [{
			id: "1",
			value: "Default Layer",
			// "checked": true,
			type: "layer",
			fillColor: "#00FF00",
			strokeColor: "#000000",
			open: true,
			data: []
		}];
		this.reloadAnnotationsTable();
		this.treeCheckBoxesClicked(this.table);
	}

	propertiesEdited(property, geoid, value, editorcolumn, table, type) {
		let found = false;
		let visibleAnnotationsChanged = false;
		let item = null;
		for (let i = 0; i < this.treeannotations.length; i++) {
			if (property === "deleteLayer") {
				if (this.treeannotations[i].id === geoid) {
					this.treeannotations.splice(i, 1);
					visibleAnnotationsChanged = true;
					this.reloadAnnotationsTable();

					if (this.treeannotations.length === 0) {
						webix.message("All the layers were deleted. Initializing it to default layer...");
						this.reinitializeTreeLayers();
						this.lastLabelNumber = 0;
					}
					break;
				}
			}
			else {
				for (let j = 0; j < this.treeannotations[i].data.length; j++) {
					if (this.treeannotations[i].data[j].geoid === geoid) {
						item = this.treeannotations[i].data[j];
						switch (property) {
							case "strokeWidth":
								this.treeannotations[i].data[j].strokeWidth = value;
								break;
							case "fillOpacity":
								this.treeannotations[i].data[j].fillOpacity = value;
								break;
							case "strokeOpacity":
								this.treeannotations[i].data[j].strokeOpacity = value;
								break;
							case "deleteAnnotation":
								this.treeannotations[i].data.splice(j, 1);
								item = null;
								visibleAnnotationsChanged = true;
								break;
							case "annotationStyleChange":
								switch (editorcolumn) {
									case "fillColor":
										this.treeannotations[i].data[j].fillColor = value;
										break;
									case "strokeColor":
										this.treeannotations[i].data[j].strokeColor = value;
										break;
									case "name":
										this.treeannotations[i].data[j].value = value;
										break;
									default:
										break;
								}
								break;
							default:
								break;
						}
						found = true;
						break;
					}
				}
				if (found) {
					break;
				}
			}
		}
		if (!type) {
			this.updateGirderWithAnnotationData(table, item);
		}

		if (visibleAnnotationsChanged) {
			this.treeCheckBoxesClicked(table);
		}
	}

	isEmpty(obj) {
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return JSON.stringify(obj) === JSON.stringify({});
	}
}
