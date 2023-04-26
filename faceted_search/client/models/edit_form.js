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
	let initialItemsLenght = 0;
	const saveURL = `${constants.LOCAL_API}/facets/filters`;
	const getURL = `${constants.LOCAL_API}/facets/get-filters-with-images`;

	const addItem = function(facet, type) {
		const data = getFacet(facet); let i; let wasAdded = false; let t = {};
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
					status: "modified"
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
				status: "added"
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

	const getFacet = function(facet) {
		if(totalFormData.hasOwnProperty(facet)) {
			return totalFormData[facet];
		}
		return false;
	};

	const removeItem = function(id, facet) {
		let i = 0;
		for(i = 0; i < addedItems.length; i++) {
			if(addedItems[i].facet.id === facet.id) {
				if(addedItems[i].status === "added") {
					addedItems.splice(i, 1);
				} else {
					addedItems[i].status = "removed";
				}
				break;
			}
		}
		itemsLabels.splice(0, 0, {id: facet.id, value: facet.value});
		app.callEvent("editForm:doAfterItemRemoved", [id]);
		app.callEvent("editForm:reloadOptions", [true]);
	};

	const saveItems = function() {
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
				if(addedItems[i].status === "removed") {
					addedItems.splice(i, 1);
				} else {
					addedItems[i].status = "already_added";
				}
			}
			initialItemsLenght = addedItems.length;
			app.callEvent("adminMode:onLoaded", ["edit", true]);
		});
	};

	app.attachEvent("editForm:removeItem", removeItem);

	const setItemsData = function(data) {
		itemsLabels = Object.keys(data);
		totalFormData = data;
		itemsLabels.forEach(function(item, index, array) {
			array[index] = {id: item, value: item.replace(/\|/g, ' \\ ')};
		});
	};

	const getItemsData = function() {
		return totalFormData;
	};

	const checkAbilityToAdd = function(facet, type) {
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

	const isNumeric = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};


	const getLabels = function() {
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

	const getItemTypes = function() {
		return [
			{"id": "checkbox", "value": "Checkbox"},
			{"id": "combo_box", "value": "Combo Box"},
			{"id": "radio", "value": "Radio"},
			{"id": "slider", "value": "Slider"},
			{"id": "range_slider", "value": "Range Slider"},
			{"id": "toggle", "value": "Toggle Button"}
		];
	};

	const getCountOfAddedItems = function() {
		return addedItems.length;
	};

	app.attachEvent("editForm:loadDataForFilters", function(approvedFacetLabels) {
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
							status: "already_added"
						};
						addedItems.push(t);
						totalFormData[key] = JSON.parse(JSON.stringify(data.filters[key]));
						view = adminFormHelper.transformToFormFormat(t, data.filters[key].type, getItemTypes(), "edit");
						q.push(view);
					}
				}
				initialItemsLenght = addedItems.length;
				app.callEvent("editForm:dataLoaded", [q]);
				app.callEvent("adminMode:onLoaded", ["edit", false]);
			});
	});

	const updateItemType = function(facet, type) {
		const data = getFacet(facet); let i; let wasAdded = false; let t = {};
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
				status: "added"
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

	const areFiltersNotChanged = function() {
		if (initialItemsLenght === addedItems.length) {
			return addedItems.every((item) => {
				return item.status === "already_added";
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
