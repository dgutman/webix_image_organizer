import annotationApiRequests from "../../../services/api";

const listViewItemsMap = new Map();
const annotationsMap = new Map();
const deletedAnnotationsMap = new Map();

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
		const annotation = await annotationApiRequests.getAnnotationById(id);
		if (annotation) {
			annotationsMap.set(itemId, annotation);
			return annotation;
		}
		return null;
	}
	catch (error) {
		console.error(error);
		webix.message("AnnotationModel error: Couldn't add annotation");
		return null;
	}
}

function createAnnotation(listItem, annotation) {
	const listItemId = getAnnotationIdFromListViewItem(listItem);
	listViewItemsMap.set(listItemId, listItem);
	annotationsMap.set(listItemId, annotation);
}

async function updateAnnotation(itemId, elements) {
	const annotation = await getAnnotation(itemId);
	if (annotation) {
		annotation.elements = elements;
		const id = getAnnotationId(annotation);
		annotationsMap.set(id, annotation);
		return annotation;
	}
	return null;
}

function getAnnotationIdFromListViewItem(annotationListItem) {
	return annotationListItem.annotation.id;
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
	const id = getAnnotationId(annotation);
	deletedAnnotationsMap.set(id, annotation);
}

async function saveAnnotations() {
	annotationsMap.forEach(async (a, itemId) => {
		const id = getAnnotationId(a);
		if (id) {
			const updatedAnnotation = await annotationApiRequests.updateAnnotation(id, a);
			if (updatedAnnotation) {
				await updateAnnotation(itemId, updatedAnnotation);
			}
		}
		else {
			const createdAnnotation = annotationApiRequests.createAnnotation(a);
			if (createdAnnotation) {
				await updateAnnotation(itemId, createdAnnotation);
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

const annotationModel = {
	createAnnotation,
	getAnnotation,
	updateAnnotation,
	addListViewItem,
	clearAll,
	saveAnnotations,
	deleteAnnotation,
};

export default annotationModel;
