import lodash from "lodash";

import annotationApiRequests from "../../../services/api";

const listViewItemsMap = new Map();
const annotationsMap = new Map();
const deletedAnnotationsMap = new Map();
const values = {
	itemId: null,
};

function addListViewItem(item) {
	const id = getItemId(item);
	if (listViewItemsMap.has(id)) {
		return listViewItemsMap.get(id);
	}
	listViewItemsMap.set(id, item);
	return listViewItemsMap.get(id);
}

function getItem(itemId) {
	if (listViewItemsMap.has(itemId)) {
		return listViewItemsMap.get(itemId);
	}
	return null;
}

async function getAnnotation(itemId) {
	const item = getItem(itemId);
	const id = getAnnotationIdFromItem(item);
	if (annotationsMap.has(itemId)) {
		return annotationsMap.get(itemId);
	}
	try {
		if (id) {
			const annotation = await annotationApiRequests.getAnnotationById(id);
			if (annotation) {
				// INFO: this flag is used to track if the annotation was modified locally
				annotation.isModified = false;
				annotationsMap.set(itemId, annotation);
				return annotation;
			}
		}
		// TODO: improve (create with schema)
		const annotation = {
			annotation: {
				description: item.annotation?.description || "",
				elements: [],
				name: item.annotation?.name || "",
			},
			itemId: item.itemId
		};
		annotationsMap.set(itemId, annotation);
		return annotation;
	}
	catch (error) {
		console.error(error);
		webix.message("AnnotationModel error: Couldn't add annotation");
		return null;
	}
}

async function updateAnnotation(itemId, updatedAnnotation, isModified = false) {
	const annotation = await getAnnotation(itemId);
	if (annotation) {
		lodash.merge(annotation, updatedAnnotation);
		annotation.isModified = isModified;
		annotationsMap.set(itemId, annotation);
		return annotation;
	}
	return null;
}

function getAnnotationIdFromItem(item) {
	const id = getAnnotationId(item);
	return id;
}

function getItemId(item) {
	return item?.id;
}

function getAnnotationId(annotation) {
	return annotation?._id;
}

function clearAll() {
	listViewItemsMap.clear();
	annotationsMap.clear();
	deletedAnnotationsMap.clear();
}

function deleteAnnotation(itemId) {
	listViewItemsMap.delete(itemId);
	const annotation = annotationsMap.get(itemId);
	deletedAnnotationsMap.set(itemId, annotation);
	annotationsMap.delete(itemId);
}

async function saveAnnotations() {
	annotationsMap.forEach(async (a, itemId) => {
		const id = getAnnotationId(a);
		const annotationData = {
			...a.annotation,
		};
		if (id) {
			const updatedAnnotation = a.isModified
				? await annotationApiRequests.updateAnnotation(id, annotationData)
				: null;
			if (updatedAnnotation) {
				await updateAnnotation(itemId, updatedAnnotation, false);
			}
		}
		else {
			const createdAnnotation = await annotationApiRequests
				.createAnnotation(a.itemId, annotationData);
			if (createdAnnotation) {
				await updateAnnotation(itemId, createdAnnotation, false);
			}
		}
	});
	deletedAnnotationsMap.forEach(async (a) => {
		const id = getAnnotationId(a);
		if (id) {
			await annotationApiRequests.deleteAnnotation(id);
		}
	});
	deletedAnnotationsMap.clear();
}

function setItemId(itemId) {
	values.itemId = itemId;
}

const annotationModel = {
	getAnnotation,
	updateAnnotation,
	addListViewItem,
	clearAll,
	saveAnnotations,
	deleteAnnotation,
	setItemId,
};

export default annotationModel;
