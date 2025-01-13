import ListView from "../../../../../../components/listView";

export default class AnnotationListView extends ListView {
	constructor(app, config) {
		super(app, config);
		this._tk = null;
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
	}

	updateAnnotation(annotationData, annotationId) {
		
	}
}
