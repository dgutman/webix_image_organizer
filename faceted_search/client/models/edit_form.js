define([
	"app",
	"helpers/admin_form",
	"models/approved_facet",
	"constants"
], function(
    app,
    adminFormHelper,
    approvedFacetModel,
    constants
) {
	let addedItems = [];
	let totalFormData = {};
	let itemsLabels = [];
	let initialItems = [];
	const saveURL = `${constants.LOCAL_API}/facets/filters`;
	const getURL = `${constants.LOCAL_API}/facets/get-filters-with-images`;

	function addItem(facet, type) {
		const data = getFacet(facet);
		let i;
		let wasAdded = false;
		let t = {};
		for(i = 0; i < addedItems.length; i++) {
			if(addedItems[i].facet.id === facet) {
				wasAdded = true;
				t = {
					facet: {
						id: facet,
						value: facet.replace(/\|/g, ' \\ ')
					},
					type: type,
					interface: data.values,
					status: constants.FILTER_STATUS.MODIFIED
				};
				addedItems[i] = t;
				break;
			}
		}
		if(!wasAdded) {
			t = {
				facet: {
					id: facet,
					value: facet.replace(/\|/g, ' \\ ')
				},
				type: type,
				interface: data.values,
				status: constants.FILTER_STATUS.ADDED
			};
			addedItems.push(t);
		}
		for(i = 0; i < itemsLabels.length; i++) {
			if(itemsLabels[i].id === facet) {
				itemsLabels.splice(i, 1);
				break;
			}
		}
		return adminFormHelper.transformToFormFormat(t, type, getItemTypes(), "edit");
	};

	function getFacet(facet) {
		if(totalFormData.hasOwnProperty(facet)) {
			return totalFormData[facet];
		}
		return false;
	};

	function removeItem(id, facet) {
		let i = 0;
		for(i = 0; i < addedItems.length; i++) {
			if(addedItems[i].facet.id === facet.id) {
				if(addedItems[i].status === constants.FILTER_STATUS.ADDED) {
					addedItems.splice(i, 1);
				} else {
					addedItems[i].status = constants.FILTER_STATUS.REMOVED;
				}
				break;
			}
		}
		itemsLabels.splice(0, 0, {id: facet.id, value: facet.value});
		app.callEvent("editForm:doAfterItemRemoved", [id]);
		app.callEvent("editForm:reloadOptions", [true]);
	};

	function saveItems() {
		const filters = [];
		app.callEvent("adminMode:doProgress", ["edit"]);

		addedItems.forEach(function(item) {
			const result = {};
			result.id = item.facet.id;
			const path = result.id.split('|');
			result.name = path[path.length - 1];
			result.parent = (path.length > 1) ? path[path.length - 2] : "Main";
			result.type = item.type;
			result.options = item.interface;
			result.status = item.status;

			filters.push(result);
		});
		webix.ajax().post(saveURL, {data: filters}, function() {
			let i = 0;
			for(i = 0; i < addedItems.length; i++) {
				if(addedItems[i].status === constants.FILTER_STATUS.REMOVED) {
					addedItems.splice(i, 1);
				} else {
					addedItems[i].status = constants.FILTER_STATUS.ALREADY_ADDED;
				}
			}
			initialItems = [...addedItems];
			app.callEvent("adminMode:onLoaded", ["edit", true]);
		});
	};

	app.attachEvent("editForm:removeItem", removeItem);

	function setItemsData(data) {
		const itemsKeys = Object
			.keys(data)
			.map((item) => {
				return {id: item, value: item.replace(/\|/g, ' \\ ')};
			});
		totalFormData = data;
		itemsLabels = [...itemsKeys];
	};

	function getItemsData() {
		return totalFormData;
	};

	function checkAbilityToAdd(facet, type) {
		const data = getFacet(facet); let i; let isNumber = false; let add = false;
		if(data) {
			if(type === "slider" || type === "range_slider") {
				isNumber = true;
			} else {
				add = true;
			}
			if(isNumber) {
				for(i = 0; i < data.values.length; i++) {
					if(!isNumeric(data.values[i])) {
						add = false;
						break;
					}
					add = true;
				}
			}
		}
		return add;
	};

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};


	function getLabels() {
		const displayedLabels = [];
		const approvedFacetsLabels = approvedFacetModel.getApprovedFacetsLabels();
		if (Array.isArray(approvedFacetsLabels)) {
			approvedFacetsLabels.forEach((approvedFacetLabel) => {
				itemsLabels.forEach((itemsLabel) => {
					if(approvedFacetLabel === itemsLabel.value) {
						displayedLabels.push(itemsLabel);
					}
				});
			});
		}
		return displayedLabels;
	};

	function getItemTypes() {
		return [
			{"id": "checkbox", "value": "Checkbox"},
			{"id": "combo_box", "value": "Combo Box"},
			{"id": "radio", "value": "Radio"},
			{"id": "slider", "value": "Slider"},
			{"id": "range_slider", "value": "Range Slider"},
			{"id": "toggle", "value": "Toggle Button"}
		];
	};

	function getCountOfAddedItems() {
		return addedItems.length;
	};

	app.attachEvent("editForm:loadDataForFilters", function(/* approvedFacetLabels */) {
		app.callEvent("adminMode:doProgress", ["edit"]);
		webix.ajax().get(getURL, {})
			.then(function(response) {
				addedItems = [];
				totalFormData = {};
				itemsLabels = [];
				const data = response.json();
				let key;
				let t;
				const q = [];
				let view;
				setItemsData(data.facets);
				for(key in data.filters) {
					if(data.filters.hasOwnProperty(key)) {
						t = {
							facet: {
								id: key,
								value: key.replace(/\|/g, ' \\ ')
							},
							type: data.filters[key].type,
							interface: data.filters[key].values,
							status: constants.FILTER_STATUS.ALREADY_ADDED
						};
						if (t.type === "radio" && t.interface.length === 0) {
							continue;
						}
						addedItems.push(t);
						totalFormData[key] = JSON.parse(JSON.stringify(data.filters[key]));
						view = adminFormHelper.transformToFormFormat(t, data.filters[key].type, getItemTypes(), "edit");
						q.push(view);
					}
				}
				// appliedItemsToFilters = addedItems.length;
				initialItems = [...addedItems];
				app.callEvent("editForm:dataLoaded", [q]);
				app.callEvent("adminMode:onLoaded", ["edit", false]);
			})
			.catch((error) => {
				if (app.debug) {
					console.error(error);
				}
			});
	});

	function updateItemType(facet, type) {
		const data = getFacet(facet);
		let i;
		let wasAdded = false;
		let t = {};
		for(i = 0; i < addedItems.length; i++) {
			if(addedItems[i].facet.id === facet) {
				wasAdded = true;
				addedItems[i].type = type;
				break;
			}
		}
		if(!wasAdded) {
			t = {
				facet: {
					id: facet,
					value: facet.replace(/\|/g, ' \\ ')
				},
				type: type,
				interface: data.values,
				status: constants.FILTER_STATUS.ADDED
			};
			addedItems.push(t);
		}
		for(i = 0; i < itemsLabels.length; i++) {
			if(itemsLabels[i].id === facet) {
				itemsLabels.splice(i, 1);
				break;
			}
		}
		return adminFormHelper.transformToFormFormat(t, type, getItemTypes(), "edit");
	};

	function areFiltersNotChanged() {
		const passed = initialItems.length === addedItems.length
			? initialItems.every((item) => {
				const foundElement = addedItems.find((added) => {
					return added.facet.id === item.facet.id;
				});
				return foundElement ? true : false;
				})
			: true;
		if (passed) {
			return addedItems.every((item) => {
				return item.status === constants.FILTER_STATUS.ALREADY_ADDED;
			});
		}
		return false;
	};

	return {
		addItem: addItem,
		removeItem: removeItem,
		saveItems: saveItems,
		getItemsData: getItemsData,
		setItemsData: setItemsData,
		getLabels: getLabels,
		getItemTypes: getItemTypes,
		checkAbilityToAdd: checkAbilityToAdd,
		getCountOfAddedItems: getCountOfAddedItems,
		updateItemType: updateItemType,
		areFiltersNotChanged
	};
});
