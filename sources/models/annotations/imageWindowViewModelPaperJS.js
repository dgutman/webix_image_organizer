import lodash from "lodash";

import PaperScopeModel from "./paperScopeModel";
import ItemsModel from "./paperjsItemsModel";
import LayersModel from "./paperjsLayersModel";
import ajax from "../../services/ajaxActions";
import validate from "../../services/gallery/annotationValidator";

export default class imageWindowViewModel {
	constructor(imageWindowView) {
		this._imagesWindowView = imageWindowView;
	}

	setItem(item) {
		this.item = item;
	}

	getItem() {
		return this.item;
	}

	setLayer(layer) {
		this.layersModel.setLayer(layer);
	}

	getLayers() {
		return this.layersModel?.getLayer();
	}

	setToolKit(tk) {
		this.tk = tk;
		this.paperScopeModel = new PaperScopeModel(tk);
		const paperScope = this.paperScopeModel.getPaperScope();
		this.layersModel = new LayersModel(paperScope);
		this.itemsModel = new ItemsModel(paperScope);
	}

	getToolKit() {
		return this.tk;
	}

	createNewLayer() {
		return this.layersModel.createLayer();
	}

	createNewItem() {
		return this.itemsModel.createNewItem();
	}

	async asyncSetAnnotation() {
		if (this.item) {
			const annotationData = await this.getAndLoadAnnotations();
			if (annotationData?.length) {
				// TODO: implement
			}
			else {
				const newLayer = this.createNewLayer();
			}
		}
	}

	// TODO: rewrite to async-await
	async getMetadataAndLoadAnnotations() {
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

	async getAndLoadAnnotations() {
		let url = `${ajax.getHostApiUrl()}/annotation/item/${this.item._id}`;
		const result = await webix.ajax().get(url);
		if (result?.json) {
			this.annotations = result.json();
		}
		let allShapesLength = 0;
		let geoIdArray = [];
		let labelId = [];
		if (!lodash.isEmpty(this.annotations)) {
			// this.annotations = this.annotations
			// 	.filter(annotation => annotation.annotation.attributes.dsalayers);
			// TODO: rewrite according structure
			// this.annotations.forEach((annotation) => {
			// 	const dsalayers = annotation.annotation.attributes.dsalayers;
			// 	if (dsalayers?.length) {
			// 		dsalayers.forEach((dsalayer) => {
			// 			this.dsalayers.push(dsalayer);
			// 			this.treeannotations.push(dsalayer);
			// 			allShapesLength += dsalayer.data.length;
			// 			dsalayer.data.forEach((dsalayerData) => {
			// 				geoIdArray.push(dsalayerData.geoid);
			// 				if (dsalayerData.labelId) {
			// 					labelId.push(dsalayerData.labelId);
			// 				}
			// 			});
			// 		});
			// 		if (labelId.length !== 0) {
			// 			labelId = labelId.sort();
			// 			this.lastLabelNumber = labelId[labelId.length - 1];
			// 		}
			// 		else if (geoIdArray.length !== 0) {
			// 			this.lastLabelNumber = Math.max(...geoIdArray);
			// 		}
			// 		else this.lastLabelNumber = 0;
			// 		this.reloadAnnotationsTable();
			// 	}
			// 	else {
			// 		this.reinitializeTreeLayers();
			// 	}
			// 	// Reload existing annotations.
			// 	if (annotation.annotation.attributes.geojslayer
			// 		&& !this.isEmpty(annotation.annotation.attributes.geojslayer)
			// 		&& annotation.annotation.attributes.geojslayer.features
			// 		&& !this.isEmpty(annotation.annotation.attributes.geojslayer.features)) {
			// 		let features = annotation.annotation.attributes.geojslayer.features;
			// 		if (allShapesLength > features.length) {
			// 			this.dsalayers = this.dsalayers.filter((dsalayer) => {
			// 				dsalayer.data = dsalayer.data.filter((dsalayerData) => {
			// 					let count = 0;
			// 					features.forEach((feature) => {
			// 						if (dsalayerData.geoid !== feature.properties.annotationId) {
			// 							count++;
			// 						}
			// 					});
			// 					return count !== features.length;
			// 				});
			// 				return dsalayer.data.length !== 0;
			// 			});
			// 		}
			// 		let geojsJSON = annotation.annotation.attributes.geojslayer;
			// 		this.geoJSON = annotation.annotation.attributes.geojslayer;
			// 		this.layer.geojson(geojsJSON, "update");
			// 	}
			// 	else {
			// 		this.geoJSON = {};
			// 		this.layer.geojson(this.geoJSON, "update");
			// 	}
			// });
		}
	}

	// TODO: uncomment this part of code if annotations storing in items endpoint
	// Version for storing annotations data in items endpoint
	/* updateGirderWithAnnotationData(table, item) {
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
	} */

	// Version for storing annotation data in annotation endpoint
	async updateGirderWithAnnotationData(table, item) {
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

		// TODO: uncomment this part of code when data will be valid and comment another part
		/* let annotationInfo = {
			// elements: []
			attributes: {
				dsalayers: this.treeannotations,
				geojslayer: geojsonObj
			}
		};
		this.treeannotations.forEach((treeannotation) => {
		geojsonObj.features.forEach((feature) => {
			annotationInfo = {
				name: "",
				description: "",
				// attributes: {
				// 	id: treeannotation.id,
				// 	label: {
				// 		value: treeannotation.value
				// 	},
				// 	lineColor: treeannotation.strokeColor,
				// 	type: "point",
				// 	fillColor: treeannotation.fillColor,
				// 	checked: treeannotation.checked
				// },
				elements: []
			};

			let annotationElement = {};
			annotationElement.label = {
				value: feature.properties.value
			};
			annotationElement.lineColor = feature.properties.strokeColor;
			annotationElement.lineWidth = feature.properties.strokeWidth;
			switch (feature.properties.annotationType) {
				case "line":
					annotationElement.id = feature.properties.annotationId;
					annotationElement.type = "polyline";
					annotationElement.fillColor = feature.properties.fillColor || "#00ff00";
					annotationElement.fillOpacity = feature.properties.fillOpacity;
					annotationElement.points = feature.geometry.coordinates;
					annotationElement.closed = feature.properties.closed;
					break;
				case "rectangle":
					annotationElement.id = feature.properties.id;
					annotationElement.type = "rectangle";
					// annotationElement.center = ["Coordinates"];
					// annotationElement.fillColor = "Fill color";
					annotationElement.fillOpacity = feature.properties.fillOpacity;
					// annotationElement.points = geojsonObj.features.geometry.coordinates;
					break;
				case "polygon":
					annotationElement.id = feature.properties.annotationId;
					annotationElement.type = "polyline";
					// annotationElement.center = ["Coordinates"];
					annotationElement.fillColor = feature.properties.fillColor || "#00ff00";
					annotationElement.fillOpacity = feature.properties.fillOpacity;
					annotationElement.points = feature.geometry.coordinates;
					annotationElement.closed = true;
					break;
				default:
					break;
			}

			feature.forEach((dataItem) => {
				let annotationElement = {};
				switch (dataItem.type) {
					case "line":
						annotationElement.id = dataItem.id;
						annotationElement.label = {
							value: dataItem.value
						};
						annotationElement.lineColor = dataItem.strokeColor;
						annotationElement.lineWidth = dataItem.strokeWidth;
						annotationElement.type = "polyline";
						annotationElement.center = ["Coordinates"];
						annotationElement.fillColor = "Fill color";
						annotationElement.points = geojsonObj.features.geometry.coordinates;
						annotationElement.closed = false;
						break;
					case "rectangle":
						annotationElement.id = dataItem.id;
						annotationElement.label = {
							value: dataItem.value
						};
						annotationElement.lineColor = dataItem.strokeColor;
						annotationElement.lineWidth = dataItem.strokeWidth;
						annotationElement.type = "polyline";
						annotationElement.center = ["Coordinates"];
						annotationElement.fillColor = "Fill color";
						annotationElement.points = geojsonObj.features.geometry.coordinates;
						break;
					case "polygon":
						annotationElement.id = dataItem.id;
						annotationElement.label = {
							value: dataItem.value
						};
						annotationElement.lineColor = dataItem.strokeColor;
						annotationElement.lineWidth = dataItem.strokeWidth;
						annotationElement.type = "polyline";
						annotationElement.center = ["Coordinates"];
						annotationElement.fillColor = "Fill color";
						annotationElement.points = geojsonObj.features.geometry.coordinates;
						annotationElement.closed = true;
						break;
					default:
						break;
				}
				annotationInfo.elements.push(annotationElement);
			});
		}); */

		this.geoJSON = geojsonObj;
		this.dsalayers = this.treeannotations;
		let url;

		try {
			if (this.annotations && lodash.isArray(this.annotations) && this.annotations.length !== 0) {
				this.annotations.forEach(async (annotation) => {
					let annotationInfo = {
						// elements: []
						attributes: {
							dsalayers: this.dsalayers,
							geojslayer: geojsonObj
						}
					};
					const valid = validate(annotationInfo);
					if (valid) {
						annotation.annotation.attributes = annotationInfo;
						url = `${ajax.getHostApiUrl()}/annotation/${annotation._id}`;
						const params = JSON.stringify(annotationInfo);
						await webix.ajax().headers({
							"Content-type": "application/json"
						}).put(url, params);
						webix.message("Changes are successfully saved");
					}
					else {
						webix.message("Invalid data. Check schema");
					}
				});
			}
			else {
				let annotationInfo = {
					// elements: []
					attributes: {
						dsalayers: this.treeannotations,
						geojslayer: geojsonObj
					}
				};
				url = `${ajax.getHostApiUrl()}/annotation?itemId=${this.item._id}`;
				const params = JSON.stringify(annotationInfo);
				// let params = JSON.stringify();
				const response = await webix.ajax().headers({
					"Content-type": "application/json"
				}).post(url, params);
				if (response && response.json) {
					this.annotations.push(response.json());
				}
			}
		}
		catch (err) {
			if (err.responseText) {
				const responseText = JSON.parse(err.responseText);
				const errMessage = responseText.message;
				webix.message({
					type: "debug",
					text: errMessage
				});
			}
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
