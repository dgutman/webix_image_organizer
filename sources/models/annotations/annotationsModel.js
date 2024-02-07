import initGeoJSON from "./templates/init.geoJSON.json";

const initAnnotation = {
	name: "Annotation",
	description: ""
};

export default class AnnotationsModel {
	/**
	 * Creates an instance of AnnotationsModel.
	 *
	 * @constructor
	 * @param {*} annotationsData
	 * @param {import("../../views/subviews/gallery/windows/imageWindowPaperJS/osd-paperjs-annotation/annotationtoolkit").AnnotationToolkit} tk
	 */
	constructor(annotationsData) {
		if (!AnnotationsModel.instance) {
			AnnotationsModel.instance = this;
		}
		if (annotationsData) {
			AnnotationsModel.instance.annotationsMap = new Map();
			if (annotationsData.length > 0) {
				annotationsData?.forEach((item, index) => {
					const id = index + 1;
					AnnotationsModel.instance.annotationsMap.set(id, item);
				});
			}
			else {
				AnnotationsModel.instance.createAnnotation({id: 1});
			}
		}
		return AnnotationsModel.instance;
	}

	setActiveAnnotation(id) {
		this.activeAnnotation = this.annotationsMap.get(Number(id) ?? 1);
		this.activeAnnotationId = Number(id);
	}

	getActiveAnnotation() {
		return this.activeAnnotation;
	}

	getActiveAnnotationId() {
		return this.activeAnnotationId;
	}

	getAnnotationByID(id) {
		return this.annotationsMap.get(Number(id));
	}

	getAnnotations() {
		return Array.from(this.annotationsMap, ([id, value]) => ({id, ...value}));
	}

	addAnnotation(annotation, id) {
		this.annotationsMap.set(Number(id), annotation);
	}

	createAnnotation(data) {
		const newAnnotation = {};
		newAnnotation.elements = webix.copy(initGeoJSON);
		newAnnotation.name = data?.name ?? "Default Annotation";
		newAnnotation.description = data?.description ?? "";
		this.annotationsMap.set(Number(data?.id), newAnnotation);
		return newAnnotation;
	}

	deleteAnnotation(id) {
		this.annotationsMap.delete(Number(id));
	}

	updateActiveAnnotation(annotationData) {
		const activeAnnotation = this.annotationsMap.get(Number(this.activeAnnotationId));
		activeAnnotation.elements = annotationData;
	}

	updateAnnotation(annotationData, id) {
		const annotation = this.annotationsMap.get(Number(id));
		annotation.elements = annotationData;
	}

	clearAnnotations() {
		this.annotationsMap.clear();
	}
}
