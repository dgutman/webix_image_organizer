import state from "./state";

const annotationCounts = {};

export const getAnnotationCounts = () => annotationCounts;

export const setAnnotationCounts = (newCounts) => {
	Object.assign(annotationCounts, newCounts);
	state.app.callEvent("app:annotationCounts:updated", [annotationCounts]);
};
