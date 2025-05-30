const annotationCounts = {};

export const getAnnotationCounts = () => annotationCounts;

export const setAnnotationCounts = (newCounts) => {
	Object.assign(annotationCounts, newCounts);
};
