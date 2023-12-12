import AnnotationTool from "./annotationTool";

export default class DefaultTool extends AnnotationTool {
	constructor(paperScope, toolControl) {
		super(paperScope);
		this.setToolbarControl(toolControl);
	}

	onDeactivate() {}

	onActivate() {}
}
