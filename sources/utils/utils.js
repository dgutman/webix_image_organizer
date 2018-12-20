import authService from "../services/authentication";
import FileSaver from "file-saver";


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
	webix.storage.local.put(`dataviewItemWidth-${getUserId()}`, imageWidth);
	webix.storage.local.put(`dataviewItemHeight-${getUserId()}`, imageHeight);
}

function getDataviewItemWidth() {
	let localWidth = webix.storage.local.get(`dataviewItemWidth-${getUserId()}`);
	return localWidth ? localWidth : DEFAULT_WIDTH;
}

function getDataviewItemHeight() {
	let localHeight = webix.storage.local.get(`dataviewItemHeight-${getUserId()}`);
	return localHeight ? localHeight : DEFAULT_HEIGHT;
}

function setDataviewSelectionId(id) {
	webix.storage.local.put(`dataviewSelectionId-${getUserId()}`, id);
}

function getDataviewSelectionId() {
	return webix.storage.local.get(`dataviewSelectionId-${getUserId()}`);
}

function setNewImageHeight(newItemHeight) {
	webix.storage.local.put(`newImageHeight-${getUserId()}`, newItemHeight);
}

function getNewImageHeight() {
	return webix.storage.local.get(`newImageHeight-${getUserId()}`);
}

function escapeHTML(str) {
	let tagsToReplace = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;"
	};

	return str ? str.replace(/[&<>]/g, tag => (tagsToReplace[tag] || tag)) : "";
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
	downloadBlob
};