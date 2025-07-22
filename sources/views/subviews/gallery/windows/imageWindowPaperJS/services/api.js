import annotationValidator from "./annotationValidator";
import ajaxActions from "../../../../../../services/ajaxActions";

async function getItemAnnotations(itemId) {
	const data = await ajaxActions.getAnnotationsByItemId(itemId);
	return data;
}

function parseAnnotation(data) {
	return {
		annotation: data.annotation,
		groups: data.groups,
		itemId: data.itemId,
		_id: data._id,
	};
}

async function getAnnotations(itemId) {
	const params = {
		itemId,
	};
	const data = await ajaxActions.getAnnotations(params);
	// TODO: finish schema validation
	// const schema = await ajaxActions.getAnnotationSchema();
	// const validationResults = data.map(a => annotationValidator.validate(a, schema));
	const annotations = data.map(a => parseAnnotation(a));
	return annotations;
}

async function createAnnotation(itemId, annotationData) {
	if (itemId) {
		const createdAnnotation = await ajaxActions.createAnnotation(itemId, annotationData);
		return createdAnnotation;
	}
	return null;
}

async function updateAnnotation(annotationId, annotationData) {
	const data = await ajaxActions.updateAnnotationById(annotationId, annotationData);
	const updatedAnnotation = parseAnnotation(data);
	return updatedAnnotation;
}

async function deleteAnnotation(annotationId) {
	await ajaxActions.deleteAnnotation(annotationId);
}

async function getAnnotationsCount(itemId) {
	const count = await ajaxActions.getAnnotationsCountByItemId(itemId);
	return count;
}

async function getAnnotationById(id) {
	const data = await ajaxActions.getAnnotationById(id);
	const annotation = parseAnnotation(data);
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
