import authService from "../services/authentication";
import FileSaver from "file-saver";
import projectMetadata from "../models/projectMetadata";
import galleryDataviewFilterModel from "../models/galleryDataviewFilterModel";
import webixViews from "../models/webixViews";

const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
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

function searchForFileType(obj) {
	const str = obj.name;
	const pattern = /.*\.(.*)$/;
	const matched = str.match(pattern);
	return matched ? matched[1] : "non-type";
}

function showAlert() {
	const alert = webix.alert({
		title: "Sorry!",
		text: "You can not open or download file.",
		type: "alert-warning"
	});
	return alert;
}

function findAndRemove(id, folder, array) {
	const finderView = webixViews.getFinderView();
	finderView.data.eachChild(id, (item) =>{
		array.push(item.id);
	}, finderView, true);
	const length = array.length;
	for (let i = 0; i < length; i++) {
		finderView.remove(array[i]);
	}
	folder.$count = 1;
	folder.hasOpened = 0;

	webix.dp(finderView).ignore(() => {
		finderView.updateItem(folder.id, folder);
	});
	webixViews.getGalleryPager().hide();
	webixViews.getMetadataTableView().clearAll();
	webixViews.getGalleryDataview().clearAll();
}

function isObjectEmpty(obj) {
	for (let prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
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

function parseDataToViews(data, linearData) {
	const metadataTable = webixViews.getMetadataTableView();
	const galleryDataview = webixViews.getGalleryDataview();
	const pager = webixViews.getGalleryPager();

	if (!pager.isVisible()) {
		pager.show();
	}
	if (!linearData) {
		galleryDataview.clearAll();
		metadataTable.clearAll();
	}

	data.forEach((item) => {
		item.starColor = findStarColorForItem(item);
	});

	galleryDataview.parse(data);
	metadataTable.parse(data);
	galleryDataviewFilterModel.prepareDataToFilter(data);
}

function findStarColorForItem(item) {
	let arrayOfWrongData = [];
	let hasFoundMissingKey = false;
	let hasFoundIncorrectKey = false;
	let starColor;
	if (item.hasOwnProperty("meta") && projectMetadataCollection.count() !== 0) {
		const projectSchema = projectMetadataCollection.getItem(projectMetadataCollection.getLastId()).meta.projectSchema;
		for (let key in projectSchema) {
			const metaTag = key.substr(0, key.indexOf("."));
			const metaKey = key.substr(key.indexOf(".") + 1, key.length);
			if (metaKey !== metaTag) {
				if (item.meta[metaTag]) {
					if (item.meta[metaTag][metaKey] !== undefined) {
						const correctValue = projectSchema[key].find((correctValue) => item.meta[metaTag][metaKey] === correctValue);
						if (!correctValue) {
							arrayOfWrongData.push({
								incorrectKey: metaKey
							});
							const wrongMetadataItem = wrongMetadataCollection.getItem(item._id);
							if (wrongMetadataItem) {
								wrongMetadataItem.incorrectKeys.push(metaKey);
							} else {
								wrongMetadataCollection.add({
									id: item._id,
									incorrectKeys: [metaKey]
								});
							}

						}
					} else {
						arrayOfWrongData.push({
							missingKey: metaKey
						});
					}
				}
			} else {
				if (item.meta[metaTag]) {
					const correctValue = projectSchema[key].find((correctValue) => item.meta[metaTag] === correctValue);
					if (!correctValue) {
						arrayOfWrongData.push({
							incorrectKey: metaKey
						});
						const wrongMetadataItem = wrongMetadataCollection.getItem(item._id);
						if (wrongMetadataItem) {
							wrongMetadataItem.incorrectKeys.push(metaKey);
						} else {
							wrongMetadataCollection.add({
								id: item._id,
								incorrectKeys: [metaKey]
							});
						}
					}
				} else {
					arrayOfWrongData.push({
						missingKey: metaKey
					});
				}
			}
		}
		arrayOfWrongData.forEach((wrongData) => {
			if (wrongData.missingKey && !hasFoundMissingKey) {
				hasFoundMissingKey = true;
			} else if (wrongData.incorrectKey && !hasFoundIncorrectKey) {
				hasFoundIncorrectKey = true;
			}
		});

		if (!hasFoundIncorrectKey && !hasFoundMissingKey) {
			starColor = "green";
		} else if (!hasFoundIncorrectKey && hasFoundMissingKey) {
			starColor = "orange";
		} else if (hasFoundIncorrectKey && !hasFoundMissingKey) {
			starColor = "yellow";
		} else {
			starColor = "red";
		}

		return starColor;
	}

}

function getMetadataColumnColor(obj, columnId) {
	const wrongMetadataItem = wrongMetadataCollection.getItem(obj._id);
	if (wrongMetadataItem) {
		const wrongColumnId = wrongMetadataItem.incorrectKeys.find(incorrectKey => incorrectKey === columnId);
		if (wrongColumnId) {
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
	} else {
		viewsToCollapse.hide();
		removeAndAddClassFromCollapsedElement("hide", collapserTemplate.getNode());
	}
	collapserTemplate.refresh();
}

function getCssCollapsedClass(hiddenViews) {
	return hiddenViews ? "hidden-views" : "showed-views";
}


function showOrHideImageSelectionTemplate(action, template) {
	if (action === "show") {
		template.show();
		webixViews.getGalleryDataview().getNode().style.borderTop = "none";
	} else {
		template.hide();
		webixViews.getGalleryDataview().getNode().style.borderTop = "1px solid #DDDDDD";
	}
}

function showOrHideTemplateCollapsedViews(className, element) {
	const foundElements = document.getElementsByClassName(className);
	const propertiesElement = foundElements[1] ? foundElements[1] : foundElements[0];

	if (propertiesElement.offsetParent === null) {
		//show properties template
		removeAndAddClassFromCollapsedElement("show", element);
		propertiesElement.style.display = "block";
	} else {
		//hide properties template
		removeAndAddClassFromCollapsedElement("hide", element);
		propertiesElement.style.display = "none";
	}
}

function removeAndAddClassFromCollapsedElement(action, element) {
	webix.html.removeCss(element, "showed-views");
	webix.html.removeCss(element, "hidden-views");
	if (action === "hide") {
		webix.html.addCss(element, "hidden-views");
	} else if (action === "show") {
		webix.html.addCss(element, "showed-views");
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
	findAndRemove,
	isObjectEmpty,
	findItemInList,
	angleIconChange,
	parseDataToViews,
	getMetadataColumnColor,
	putHostsCollectionInLocalStorage,
	getHostsCollectionFromLocalStorage,
	collapseViews,
	getCssCollapsedClass,
	showOrHideImageSelectionTemplate,
	showOrHideTemplateCollapsedViews
};