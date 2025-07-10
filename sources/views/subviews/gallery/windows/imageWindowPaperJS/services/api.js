import ajaxActions from "../../../../../../services/ajaxActions";

async function getItemAnnotations(itemId) {
	const data = await ajaxActions.getAnnotationsByItemId(itemId);
	return data;
}

async function getAnnotations(itemId) {
	const params = {
		itemId,
	};
	const data = await ajaxActions.getAnnotations(params);
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

async function getAnnotationsCount(itemId) {
	const count = await ajaxActions.getAnnotationsCountByItemId(itemId);
	return count;
}

async function getAnnotationById(id) {
	const annotation = await ajaxActions.getAnnotationById(id);
	return annotation;
}

const annotationApiRequests = {
	getItemAnnotations,
	getAnnotations,
	createAnnotation,
	updateAnnotation,
	deleteAnnotation,
	getAnnotationsCount,
	getAnnotationById,
};

export default annotationApiRequests;
