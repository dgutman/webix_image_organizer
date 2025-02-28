import FileSaver from "file-saver";
import authService from "../services/authentication";
import projectMetadata from "../models/projectMetadata";
import constants from "../constants";

const wrongMetadataCollection = projectMetadata.getWrongMetadataCollection();

const DEFAULT_WIDTH = 150;
const DEFAULT_HEIGHT = 135;

function openInNewTab(url) {
	const otherWindow = window.open();
	otherWindow.opener = null;
	otherWindow.location = url;
}

function downloadByLink(url, name) {
	let element = document.createElement("a");
	element.setAttribute("style", "display: none");
	document.body.appendChild(element);
	element.setAttribute("href", url);
	element.setAttribute("target", "_blank");
	element.download = name || "download";
	element.click();
	element.parentNode.removeChild(element);
}

function downloadBlob(blob, name) {
	FileSaver.saveAs(blob, name);
}

function getUserId() {
	const userInfo = authService.getUserInfo();
	return userInfo ? userInfo._id : "";
}

function setDataviewItemDimensions(imageWidth, imageHeight) {
	webix.storage.local.put(`dataviewItemWidth-${getUserId() || "unregistered"}`, imageWidth);
	webix.storage.local.put(`dataviewItemHeight-${getUserId() || "unregistered"}`, imageHeight);
}

function getDataviewItemWidth() {
	let localWidth = webix.storage.local.get(`dataviewItemWidth-${getUserId() || "unregistered"}`);
	return localWidth || DEFAULT_WIDTH;
}

function getDataviewItemHeight() {
	let localHeight = webix.storage.local.get(`dataviewItemHeight-${getUserId() || "unregistered"}`);
	return localHeight || DEFAULT_HEIGHT;
}

function setDataviewSelectionId(id) {
	webix.storage.local.put(`dataviewSelectionId-${getUserId() || "unregistered"}`, id);
}

function getDataviewSelectionId() {
	return webix.storage.local.get(`dataviewSelectionId-${getUserId() || "unregistered"}`);
}

function setNewImageHeight(newItemHeight) {
	webix.storage.local.put(`newImageHeight-${getUserId() || "unregistered"}`, newItemHeight);
}

function getNewImageHeight() {
	return webix.storage.local.get(`newImageHeight-${getUserId() || "unregistered"}`);
}

function getColorTemplateData() {
	return webix.storage.local.get(`colorTemplate-${getUserId() || "unregistered"}`);
}

function setColorTemplateData(colorTemplateData) {
	webix.storage.local.put(`colorTemplate-${getUserId() || "unregistered"}`, colorTemplateData)
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
	let str = obj.name ?? "";
	const pattern = /\.([0-9a-z]+)(?!\S)/gi; // /\.[0-9a-z]+$/i;
	const matched = str.match(pattern);
	// const dotIndex = matched ? matched.index : 0;
	// str = str.slice(dotIndex + 1);
	str = matched ? matched.pop() : matched;
	str = str ? str.replace(".", "") : "non-type";
	return str;
}

function showAlert() {
	const alert = webix.alert({
		title: "Sorry!",
		text: "You can not open or download file.",
		type: "alert-warning"
	});
	return alert;
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

function angleIconChange(obj) {
	return obj.imageShown ? "fa-angle-down" : "fa-angle-right";
}

function getMetadataColumnColor(obj, columnId) {
	const wrongMetadataItem = wrongMetadataCollection.getItem(obj._id);
	if (wrongMetadataItem) {
		const foundKey = wrongMetadataItem.incorrectKeys.some(incorrectKey => incorrectKey === columnId);

		if (foundKey) {
			return "red";
		}
	}
	return "#6E7480";
}

function putHostsCollectionInLocalStorage(hostsCollection) {
	webix.storage.local.put("presentHostsCollection", hostsCollection);
}

function getHostsCollectionFromLocalStorage() {
	return webix.storage.local.get("presentHostsCollection");
}

function collapseViews(collapserTemplate, viewsToCollapse, hiddenViews) {
	if (hiddenViews) {
		viewsToCollapse.show();
		removeAndAddClassFromCollapsedElement("show", collapserTemplate.getNode());
	}
	else {
		viewsToCollapse.hide();
		removeAndAddClassFromCollapsedElement("hide", collapserTemplate.getNode());
	}
	collapserTemplate.refresh();
}

function getCssCollapsedClass(hiddenViews) {
	return hiddenViews ? "hidden-views" : "showed-views";
}


function showOrHideTemplateCollapsedViews(className, element) {
	const foundElements = document.getElementsByClassName(className);
	const propertiesElement = foundElements[1] ? foundElements[1] : foundElements[0];

	if (propertiesElement.offsetParent === null) {
		// show properties template
		removeAndAddClassFromCollapsedElement("show", element);
		propertiesElement.style.display = "block";
	}
	else {
		// hide properties template
		removeAndAddClassFromCollapsedElement("hide", element);
		propertiesElement.style.display = "none";
	}
}

function removeAndAddClassFromCollapsedElement(action, element) {
	webix.html.removeCss(element, "showed-views");
	webix.html.removeCss(element, "hidden-views");
	if (action === "hide") {
		webix.html.addCss(element, "hidden-views");
	}
	else if (action === "show") {
		webix.html.addCss(element, "showed-views");
	}
}


function setLocalStorageSettingsValues(values) {
	webix.storage.local.put("mouseSettingsValues", values);
}

function getLocalStorageSettingsValues() {
	return webix.storage.local.get("mouseSettingsValues");
}

function getDefaultMouseSettingsValues() {
	const mouseSettingsValues = {
		[constants.MOUSE_LEFT_SINGLE_CLICK]: "select",
		[constants.MOUSE_RIGHT_SINGLE_CLICK]: "edit",
		[constants.MOUSE_LEFT_DOUBLE_CLICK]: "open"
	};
	return mouseSettingsValues;
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

/**
 * Create copy of given object with new property
 * Set the value for the object copy for the given path
 * where the path can be a nested key represented with dot notation
 *
 * @param {object} obj   The object on which to set the given value
 * @param {string} path  The dot notation path to the nested property where the value should be set
 * @param {mixed}  value The value that should be set
 * @return {object} Object with updated property
 *
 */
function setPropertyAndGetNewObject(obj, path, value) {
	const objCopy = webix.copy(obj);
	setObjectProperty(objCopy, path, value);
	return objCopy;
}

function createElementFromHTML(htmlString) {
	const div = document.createElement("div");
	div.innerHTML = htmlString.trim();

	// Change this to div.childNodes to support multiple top-level nodes
	return div.firstChild;
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

function setAppSkinToLocalStorage(id) {
	const userId = getUserId() || "unregistered";
	webix.storage.local.put(`skinApp-${userId}`, id);
}

function getAppSkinFromLocalStorage() {
	const userId = getUserId() || "unregistered";
	return webix.storage.local.get(`skinApp-${userId}`);
}

function getSelectIcon() {
	const theme = getAppSkinFromLocalStorage();
	let icon = "fas fa-chevron-down";
	if (theme === "material" || theme === "mini") {
		icon = "wxi-menu-down";
	}
	return icon;
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

function escapeURIChars(string) {
	return string.replace(/[;,/?:@&=+$_.!~*'()#]/g, "");
}

function compareURLStrings(str1, str2) {
	str1 = decodeURI(str1);
	str2 = decodeURI(str2);
	if (escapeURIChars(str1) === escapeURIChars(str2)) {
		return true;
	}
	return false;
}

function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target, source) {
	let output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					Object.assign(output, {[key]: source[key]});
				}
				else {
					output[key] = mergeDeep(isObject(target[key]) ? target[key] : {}, source[key]);
				}
			}
			else {
				Object.assign(output, {[key]: source[key]});
			}
		});
	}
	return output;
}
function testJSON(text) {
	if (typeof text !== "string") {
		return false;
	}
	try {
		JSON.parse(text);
		return true;
	}
	catch (error) {
		return false;
	}
}


export default {
	openInNewTab,
	downloadByLink,
	setDataviewSelectionId,
	getDataviewSelectionId,
	setDataviewItemDimensions,
	getDataviewItemWidth,
	getDataviewItemHeight,
	setNewImageHeight,
	getNewImageHeight,
	escapeHTML,
	downloadBlob,
	searchForFileType,
	showAlert,
	isObjectEmpty,
	findItemInList,
	angleIconChange,
	getMetadataColumnColor,
	putHostsCollectionInLocalStorage,
	getHostsCollectionFromLocalStorage,
	collapseViews,
	getCssCollapsedClass,
	showOrHideTemplateCollapsedViews,
	getDefaultMouseSettingsValues,
	setLocalStorageSettingsValues,
	getLocalStorageSettingsValues,
	setObjectProperty,
	setPropertyAndGetNewObject,
	createElementFromHTML,
	isNode,
	isElement,
	setAppSkinToLocalStorage,
	getAppSkinFromLocalStorage,
	getSelectIcon,
	once,
	compareURLStrings,
	escapeURIChars,
	isObject,
	mergeDeep,
	getColorTemplateData,
	setColorTemplateData,
	testJSON,
};
