function openInNewTab(url) {
	const otherWindow = window.open();
	otherWindow.opener = null;
	otherWindow.location = url;
}

function escapeHTML(str) {
	let tagsToReplace = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;"
	};

	return str ? str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag) : "";
}

function searchForFileType(obj) {
	let str = obj.name;
	const pattern = /\.[0-9a-z]+$/i;
	const matched = str.match(pattern);
	const dotIndex = matched ? matched.index : 0;
	str = str.slice(dotIndex + 1);
	return str || "non-type";
}

function isObjectEmpty(obj) {
	for (let prop in obj) {
		if (obj.hasOwnProperty(prop)) { return false; }
	}
	return true;
}

function findItemInList(id, list) {
	let returnParam;
	list.find((obj) => {
		if (obj._id === id) {
			returnParam = true;
		}
	});
	return returnParam;
}
/**
 * Set the value for the given object for the given path
 * where the path can be a nested key represented with dot notation
 *
 * @param {object} obj   The object on which to set the given value
 * @param {string} path  The dot notation path to the nested property where the value should be set
 * @param {mixed}  value The value that should be set
 * @return {mixed}
 *
 */
function setObjectProperty(obj, path, value) {
	// protect against being something unexpected
	obj = typeof obj === "object" ? obj : {};
	// split the path into and array if its not one already
	const keys = Array.isArray(path) ? path : path.split(".");
	// keep up with our current place in the object
	// starting at the root object and drilling down
	let curStep = obj;
	// loop over the path parts one at a time
	// but, dont iterate the last part,
	const lastItemIndex = keys.length - 1;
	for (let i = 0; i < lastItemIndex; i++) {
		// get the current path part
		const key = keys[i];

		// if nothing exists for this key, make it an empty object or array
		if (!curStep[key] && !Object.prototype.hasOwnProperty.call(curStep, key)) {
			// get the next key in the path, if its numeric, make this property an empty array
			// otherwise, make it an empty object
			const nextKey = keys[i + 1];
			const useArray = /^\+?(0|[1-9]\d*)$/.test(nextKey);
			curStep[key] = useArray ? [] : {};
		}
		// update curStep to point to the new level
		curStep = curStep[key];
	}
	// set the final key to our value
	const finalStep = keys[lastItemIndex];
	curStep[finalStep] = value;
}

// Returns true if it is a DOM node
function isNode(o) {
	return (
		typeof Node === "object" ? o instanceof Node :
			o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
	);
}

// Returns true if it is a DOM element
function isElement(o) {
	return (
		typeof HTMLElement === "object" ? o instanceof HTMLElement : // DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	);
}

function once(fn, context) {
	let result;

	return function () {
		if (fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

export default {
	openInNewTab,
	escapeHTML,
	searchForFileType,
	isObjectEmpty,
	findItemInList,
	setObjectProperty,
	isNode,
	isElement,
	once
};
