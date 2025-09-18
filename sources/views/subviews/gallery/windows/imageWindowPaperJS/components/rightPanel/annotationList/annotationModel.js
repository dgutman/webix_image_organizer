import annotationApiRequests from "../../../services/api";

const listViewItemsMap = new Map();
const annotationsMap = new Map();
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

async function updateAnnotation(itemId, updatedAnnotation) {
	const annotation = await getAnnotation(itemId);
	if (annotation) {
		annotation.annotation.elements = updatedAnnotation.annotation.elements;
		annotation.groups = updatedAnnotation.groups;
		const id = getAnnotationId(updatedAnnotation);
		if (id) {
			annotation._id = id;
		}
		annotationsMap.set(itemId, annotation);
		return annotation;
	}
	return null;
}

function updateAnnotationNameAndDescription(itemId, data) {
	const annotation = annotationsMap.get(itemId);
	if (annotation) {
		annotation.annotation.name = data.annotation.name;
		annotation.annotation.description = data.annotation.description;
		annotationsMap.set(itemId, annotation);
	}
	const listViewItem = listViewItemsMap.get(itemId);
	if (listViewItem) {
		listViewItem.annotation.name = data.annotation.name;
		listViewItem.annotation.description = data.annotation.description;
		listViewItemsMap.set(itemId, listViewItem);
	}
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
	clearValues();
}

function clearValues() {
	const valuesKeys = Object.keys(values);
	for (let key of valuesKeys) {
		values[key] = null;
	}
}

async function deleteItemAnnotation(itemId) {
	listViewItemsMap.delete(itemId);
	const annotation = annotationsMap.get(itemId);
	const id = getAnnotationId(annotation);
	if (id) {
		const result = await annotationApiRequests.deleteAnnotation(id);
		if (result) {
			webix.message(`Annotation "${annotation.annotation.name}" was deleted`);
		}
	}
}

async function saveAnnotations() {
	console.log("Saving annotations...");
	if (annotationsMap.size === 0) {
		webix.message("No annotations to save");
		return;
	}
	const sentRequestsFlagArray = await Promise.all(
		Array.from(annotationsMap).map(async ([itemId, a]) => {
			const id = getAnnotationId(a);
			const annotationData = {
				...a.annotation,
			};
			if (id) {
				const updatedAnnotation = a.isModified
					? await annotationApiRequests.updateAnnotation(id, annotationData)
					: null;
				if (updatedAnnotation) {
					webix.message(`Annotation "${updatedAnnotation.annotation.name}" was updated`);
					await updateAnnotation(itemId, updatedAnnotation);
					return true;
				}
			}
			else {
				const createdAnnotation = await annotationApiRequests
					.createAnnotation(a.itemId, annotationData);
				if (createdAnnotation) {
					webix.message(`Annotation "${createdAnnotation.annotation.name}" was created`);
					await updateAnnotation(itemId, createdAnnotation);
					return true;
				}
			}
			return false;
		})
	);
	const isRequestSent = sentRequestsFlagArray.some(flag => flag);
	if (!isRequestSent) {
		webix.message("No annotations to save");
	}
}

function setItemId(itemId) {
	values.itemId = itemId;
}

function setModifiedFlag(itemId, isModified) {
	const annotation = annotationsMap.get(itemId);
	if (annotation) {
		annotation.isModified = isModified;
		annotationsMap.set(itemId, annotation);
	}
}

const annotationModel = {
	getAnnotation,
	updateAnnotation,
	addListViewItem,
	clearAll,
	saveAnnotations,
	deleteItemAnnotation,
	setItemId,
	setModifiedFlag,
	updateAnnotationNameAndDescription,
};

export default annotationModel;
