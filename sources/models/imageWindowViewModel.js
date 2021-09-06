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
		this.newAnnotation = this.makeNewAnnotationFunc(this, imageWindowView);
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

	makeNewAnnotationFunc(model, view) {
		return (evt) => {
			let idArray = [];
			let annotationLabelNumber;
			const annotationsArray = window.annotationLayer.annotations();
			const evtAnnotationId = evt.annotation.id();
			annotationsArray.forEach((annotation) => {
				if (annotation.id() !== evtAnnotationId) {
					idArray.push(annotation.id());
				}
			});

			if (idArray.length !== 0) {
				const lastId = Math.max(...idArray);
				let currentLayerIndex = 0;
				model.treeannotations.some((treeannotation, treeannotationIndex) => {
					if (treeannotation.id === model.currentLayerId) {
						currentLayerIndex = treeannotationIndex;
						treeannotation.data.some((treeannotationItem) => {
							if (treeannotationItem.geoid === lastId && treeannotationItem.hasOwnProperty("labelId")) {
								annotationLabelNumber = treeannotationItem.labelId + 1;
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
								.labelId + 1;
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
			model.treeannotations.forEach((treeannotation) => {
				if (treeannotation.id === model.currentLayerId) {
					treeannotation.data.push(newAnnotationTree);
				}
			});
			let updateStringArray = JSON.stringify(model.treeannotations);
			let tempJSONArray = JSON.parse(updateStringArray);
			view.app.callEvent("annotationTableParse", [tempJSONArray]);
			view.app.callEvent("changeRichselectData", [model.treeannotations]);
			model.treeCheckBoxesClicked("", "", null, model.treeannotations);
			model.updateGirderWithAnnotationData();
			model.toggleLabel(window.switchLabel);
			model.isAnnotationAdd = true;
		};
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
		this.treeannotations.forEach((treeannotation) => {
			treeannotation.data.forEach((treeannotationItem) => {
				let annotation = this.layer.annotationById(treeannotationItem.geoid);
				if (!switchValue || treeannotationItem.checked) {
					annotation.options("showLabel", switchValue);
				}
				else {
					annotation.options("showLabel", false);
				}
			});
		});
		window.map.draw();
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
			if (this.currentSlide && this.currentSlide.meta) {
				let allShapesLength = 0;
				if (this.currentSlide.meta.dsalayers
					&& !this.isEmpty(this.currentSlide.meta.dsalayers)
					&& this.currentSlide.meta.dsalayers.length > 0) {
					this.treeannotations.length = 0;
					this.dsalayers = this.currentSlide.meta.dsalayers;
					this.treeannotations = this.currentSlide.meta.dsalayers;
					this.dsalayers.forEach((dsalayer) => {
						allShapesLength += dsalayer.data.length;
					});
					let geoIdArray = [];
					let labelId = [];
					this.dsalayers.forEach((dsalayer) => {
						dsalayer.data.forEach((dsalayerData) => {
							geoIdArray.push(dsalayerData.geoid);
							if (dsalayerData.labelId) {
								labelId.push(dsalayerData.labelId);
							}
						});
					});
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
							dsalayer.data = dsalayer.data.filter((dsalayerData) => {
								let count = 0;
								features.forEach((feature) => {
									if (dsalayerData.geoid !== feature.properties.annotationId) {
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
		annots.forEach((annotate, index) => {
			geojsannotations[index] = {
				type: annotate.type(),
				features: annotate.features()
			};
		});

		const [geojson, clear, gcs, includeCrs] = [undefined, false, undefined, true];
		let geojsonObj = this.layer.geojson(geojson, clear, gcs, includeCrs);

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
			this.treeannotations.forEach((treeannotation) => {
				treeannotation.data.forEach((treeannotationItem) => {
					let annotation = this.layer.annotationById(treeannotationItem.geoid);
					if (checkedIds.includes(treeannotationItem.id)) {
						treeannotationItem.checked = true;
						annotation.options("showLabel", labelsBool);
						if (treeannotationItem.type === "line") {
							annotation.style({strokeOpacity: 1});
						}
						else {
							annotation.style({fill: true, stroke: true});
						}
					}
					else {
						treeannotationItem.checked = false;
						annotation.options("showLabel", false);
						if (treeannotationItem.type === "line") {
							annotation.style({strokeOpacity: 0});
						}
						else {
							annotation.style({fill: false, stroke: false});
						}
					}
				});
			});
			window.map.draw();
		}
		else if (checkedIds) {
			this.treeannotations.forEach((treeannotation) => {
				treeannotation.data.forEach((treeannotationItem) => {
					let annotation = this.layer.annotationById(treeannotationItem.geoId);
					if (treeannotationItem.checked) {
						annotation.option("showLabel", window.switchLabel);
						if (treeannotationItem.type === "line") {
							annotation.style({strokeOpacity: 1});
						}
						else {
							annotation.style({fill: true, stroke: true});
						}
					}
					else {
						annotation.options("showLabel", false);
						if (treeannotationItem.type === "line") {
							annotation.style({strokeOpacity: 0});
						}
						else {
							annotation.style({fill: false, stroke: false});
						}
					}
				});
			});
			window.map.draw();
		}
		else if (treeannotations) {
			this.treeannotations.forEach((treeannotation) => {
				let count = 0;
				treeannotation.data.forEach((treeannotationItem) => {
					if (treeannotationItem.checked) {
						count++;
					}
				});
				if (count === treeannotation.data.length) {
					treeannotation.checked = true;
				}
				else {
					treeannotation.checked = false;
				}
			});
		}
		else {
			this.treeannotations.forEach((treeannotation) => {
				treeannotation.data.forEach((treeannotationItem) => {
					const annotation = this.layer.annotationById(treeannotationItem.geoid);
					treeannotationItem.checked = false;
					annotation.options("showLabel", false);
					if (treeannotationItem.type === "line") {
						annotation.style({strokeOpacity: 0});
					}
					else {
						annotation.style({fill: false, stroke: false});
					}
				});
			});
			window.map.draw();
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
		this.treeannotations.some((treeannotation, treeannotationIndex) => {
			if (property === "deleteLayer" && treeannotation.id === geoid) {
				this.treeannotations.splice(treeannotationIndex, 1);
				visibleAnnotationsChanged = true;
				this.reloadAnnotationsTable();
				if (this.treeannotations.length === 0) {
					webix.message("All the layers were deleted. Initializing it to default layer...");
					this.reinitializeTreeLayers();
					this.lastLabelNumber = 0;
				}
			}
			else {
				treeannotation.data.some((treeannotationItem, treeannotationItemIndex) => {
					if (treeannotationItem.geoid === geoid) {
						item = treeannotationItem;
						switch (property) {
							case "strokeWidth":
								treeannotationItem.strokeWidth = value;
								break;
							case "fillOpacity":
								treeannotationItem.fillOpacity = value;
								break;
							case "strokeOpacity":
								treeannotationItem.strokeOpacity = value;
								break;
							case "deleteAnnotation":
								treeannotation.data.splice(treeannotationItemIndex, 1);
								item = null;
								visibleAnnotationsChanged = true;
								break;
							case "annotationStyleChange":
								switch (editorcolumn) {
									case "fillColor":
										treeannotationItem.fillColor = value;
										break;
									case "strokeColor":
										treeannotationItem.strokeColor = value;
										break;
									case "name":
										treeannotationItem.value = value;
										break;
									default:
										break;
								}
								break;
							default:
								break;
						}
						found = true;
						return found; // if found is true stop iterate data
					}
					return found;
				});
			}
			return found; // if found is true stop iterate treeannotations
		});
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
