import views from "./dataViews";
import projectMetadata from "../models/projectMetadata";
import dataviewFilterModel from "../models/dataviewFilterModel";
import constants from "../constants";

const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const wrongMetadataCollection = projectMetadata.getWrongMetadataCollection();

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
	const treeView = views.getTree();
	treeView.data.eachChild(id, (item) =>{
		array.push(item.id);
	}, treeView, true);
	const length = array.length;
	for (let i = 0; i < length; i++) {
		treeView.remove(array[i]);
	}
	folder.$count = 1;
	folder.hasOpened = 0;

	webix.dp(treeView).ignore(() => {
		treeView.updateItem(folder.id, folder);
	});
	views.getPager().hide();
	views.getDatatable().clearAll();
	views.getDataview().clearAll();
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
	const dataview = views.getDataview();
	const datatable = views.getDatatable();
	const pager = views.getPager();
	if (!pager.isVisible()) {
		pager.show();
	}
	if (!linearData) {
		dataview.clearAll();
		datatable.clearAll();
	}
	data.forEach((item) => {
		item.starColor = findStarColorForItem(item);
	});
	dataview.parse(data);
	datatable.parse(data);
	dataviewFilterModel.prepareDataToFilter(data);
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
		views.getDataview().getNode().style.borderTop = "none";
	} else {
		template.hide();
		views.getDataview().getNode().style.borderTop = "1px solid #DDDDDD";
	}
}

function showOrHideTemplateCollapsedViews(className, element) {
	const propertiesElement = document.getElementsByClassName(className)[1];

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
	if (action === "hide") {
		webix.html.removeCss(element, "showed-views");
		webix.html.addCss(element, "hidden-views");
	} else if (action === "show") {
		webix.html.removeCss(element, "hidden-views");
		webix.html.addCss(element, "showed-views");
	}
}

export default {
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
