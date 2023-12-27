const emptyAnnotation = {
	name: "Default Annotation",
	dsaLayers: []
};

export default class AnnotationsModel {
	constructor(annotations) {
		if (!AnnotationsModel.instance) {
			this.annotationCollection = new webix.DataCollection();
			this.annotations = annotations ?? [];
			if (annotations.length === 0) {
				this.createAnnotation();
			}
			this.activeAnnotation = this.annotations[0] ?? null;
		}
		return AnnotationsModel.instance;
	}

	setActiveAnnotation(id) {
		this.activeAnnotation = this.annotations[id];
	}

	getAnnotationsNames() {
		return this.annotations.map((annotation, index) => ({
			id: index,
			name: annotation.name
		}));
	}

	addAnnotation(annotation) {
		this.annotations.push(annotation);
	}

	createAnnotation(name) {
		const newAnnotation = webix.copy(emptyAnnotation);
		if (name) {
			newAnnotation.name = name;
		}
		this.annotations.push(newAnnotation);
		return newAnnotation;
	}

	deleteAnnotation(id) {
		this.annotations.splice(id, 1);
	}
}
