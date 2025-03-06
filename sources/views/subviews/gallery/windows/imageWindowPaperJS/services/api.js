import ajaxActions from "../../../../../../services/ajaxActions";

async function getAnnotations(itemId) {
	const data = await ajaxActions.getAnnotationsByItemId(itemId);
	return data;
}

async function createAnnotation(itemId, annotationData) {
	await ajaxActions.createAnnotation(itemId, annotationData);
}

async function updateAnnotation(annotationId, annotationData) {
	const updatedAnnotation = await ajaxActions.updateAnnotationById(annotationId, annotationData);
	return updatedAnnotation;
}

async function deleteAnnotation(annotationData) {
	await ajaxActions.deleteAnnotation(annotationData);
}

const annotationApiRequests = {
	getAnnotations,
	createAnnotation,
	updateAnnotation,
	deleteAnnotation,
};

export default annotationApiRequests;
