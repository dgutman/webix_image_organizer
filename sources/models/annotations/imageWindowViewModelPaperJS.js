import lodash from "lodash";

import ajax from "../../services/ajaxActions";
import adapter from "../../views/subviews/gallery/windows/imageWindowPaperJS/services/adapter";
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

	async asyncLoadAnnotations() {
		if (this.item) {
			const annotationData = await this.getAndLoadAnnotations();
			if (annotationData?.length) {
				annotationData.forEach((annotation) => {
					// TODO: parse annotationData to model
					this.annotationModel.addAnnotation(annotation);
				});
			}
			this.annotationModel.setActiveAnnotation();
		}
	}

	// TODO: rewrite to async-await
	// async getMetadataAndLoadAnnotations() {
	// 	let url = `${ajax.getHostApiUrl()}/item/${this.item._id}`;
	// 	webix.ajax().get(url, (text) => {
	// 		this.currentSlide = JSON.parse(text);
	// 		if (this.currentSlide && this.currentSlide.meta) {
	// 			let allShapesLength = 0;
	// 			if (this.currentSlide.meta.dsalayers
	// 				&& !this.isEmpty(this.currentSlide.meta.dsalayers)
	// 				&& this.currentSlide.meta.dsalayers.length > 0) {
	// 				this.treeannotations.length = 0;
	// 				this.dsalayers = this.currentSlide.meta.dsalayers;
	// 				this.treeannotations = this.currentSlide.meta.dsalayers;
	// 				this.dsalayers.forEach((dsalayer) => {
	// 					allShapesLength += dsalayer.data.length;
	// 				});
	// 				let geoIdArray = [];
	// 				let labelId = [];
	// 				this.dsalayers.forEach((dsalayer) => {
	// 					dsalayer.data.forEach((dsalayerData) => {
	// 						geoIdArray.push(dsalayerData.geoid);
	// 						if (dsalayerData.labelId) {
	// 							labelId.push(dsalayerData.labelId);
	// 						}
	// 					});
	// 				});
	// 				if (labelId.length !== 0) {
	// 					labelId = labelId.sort();
	// 					this.lastLabelNumber = labelId[labelId.length - 1];
	// 				}
	// 				else if (geoIdArray.length !== 0) {
	// 					this.lastLabelNumber = Math.max(...geoIdArray);
	// 				}
	// 				else this.lastLabelNumber = 0;
	// 				if (this.dsalayers) {
	// 					this.reloadAnnotationsTable();
	// 				}
	// 			}
	// 			else {
	// 				this.reinitializeTreeLayers();
	// 			}
	// 			// Reload existing annotations.
	// 			if (this.currentSlide.meta.hasOwnProperty("geojslayer")
	// 				&& !this.isEmpty(this.currentSlide.meta.geojslayer)
	// 				&& this.currentSlide.meta.geojslayer.features
	// 				&& !this.isEmpty(this.currentSlide.meta.geojslayer.features)) {
	// 				let features = this.currentSlide.meta.geojslayer.features;
	// 				if (allShapesLength > features.length) {
	// 					this.dsalayers = this.dsalayers.filter((dsalayer) => {
	// 						dsalayer.data = dsalayer.data.filter((dsalayerData) => {
	// 							let count = 0;
	// 							features.forEach((feature) => {
	// 								if (dsalayerData.geoid !== feature.properties.annotationId) {
	// 									count++;
	// 								}
	// 							});
	// 							return count !== features.length;
	// 						});
	// 						return dsalayer.data.length !== 0;
	// 					});
	// 				}
	// 				let geojsJSON = this.currentSlide.meta.geojslayer;
	// 				this.geoJSON = this.currentSlide.meta.geojslayer;
	// 				this.layer.geojson(geojsJSON, "update");
	// 			}
	// 			else {
	// 				this.geoJSON = {};
	// 				this.layer.geojson(this.geoJSON, "update");
	// 			}
	// 		}
	// 		else {
	// 			this.geoJSON = {};
	// 			this.layer.geojson({}, "update");
	// 		}
	// 		this.treeCheckBoxesClicked();
	// 	});
	// }

	async getAndLoadAnnotations() {
		const data = await ajax.getAnnotationsByItemId(this.item._id);
		if (!lodash.isEmpty(data)) {
			const annotations = data.map((item) => {
				const annotation = {};
				annotation.name = item.annotation.name;
				annotation.description = item.annotation.description;
				annotation._id = item._id;
				annotation.elements = adapter.annotationToFeatureCollections(item);
				return annotation;
			});
			return annotations;
		}
		return [];
	}

	// Version for storing annotation data in annotation endpoint
	async updateGirderWithAnnotationData(annotations) {
		annotations.forEach(async (annotationData) => {
			console.log(annotationData);
			const data = {};
			data.name = annotationData.name;
			data.description = annotationData.description;
			data.elements = adapter.featureCollectionsToElements(annotationData.elements);
			if (annotationData._id) {
				ajax.updateAnnotationById(data, annotationData._id);
			}
			else {
				ajax.createAnnotation(this.item._id, data);
			}
		});
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
