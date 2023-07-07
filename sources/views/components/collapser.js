import constants from "../../constants";
import utils from "../../utils/utils";

function changeDataviewItemDimensions(collapsedView) {
	if (collapsedView.config.id === constants.SCROLL_VIEW_METADATA_ID) {
		const galleryRichselect = $$(constants.ID_GALLERY_RICHSELECT);
		const dataviewSelectionId = utils.getDataviewSelectionId()
			|| constants.DEFAULT_DATAVIEW_COLUMNS;
		galleryRichselect.callEvent("onChange", [dataviewSelectionId]);
	}
}

function getConfig(collapsedViewId, config, collapserName) {
	const BTN_CLOSED_STATE_ID = `collapser-btn-closed-${webix.uid()}`;
	const BTN_OPENED_STATE_ID = `collapser-btn-opened-${webix.uid()}`;
	const handleCollapse = function () {
		const collapsedView = $$(collapsedViewId);
		collapsedView.hide();
		this.hide();
		$$(BTN_CLOSED_STATE_ID).show();
		webix.ui.resize();
		changeDataviewItemDimensions(collapsedView);
	};
	const handleExpand = function () {
		const collapsedView = $$(collapsedViewId);
		collapsedView.show();
		this.hide();
		$$(BTN_OPENED_STATE_ID).show();
		webix.ui.resize();
		changeDataviewItemDimensions(collapsedView);
	};
	if (config.type === "top" || config.type === "bottom") {
		return {
			css: "collapser-vertical",
			height: 23,
			name: collapserName,
			setClosedState: () => {
				const collapsedView = $$(collapsedViewId);
				collapsedView.hide();
				$$(BTN_OPENED_STATE_ID).hide();
				$$(BTN_CLOSED_STATE_ID).show();
				webix.ui.resize();
				changeDataviewItemDimensions(collapsedView);
			},
			rows: [
				{
					view: "template",
					template: config && config.type === "top" ?
						"<span class='webix_icon fas fa-angle-up'></span>" :
						"<span class='webix_icon fas fa-angle-down'></span>",
					css: "collapser-btn",
					id: BTN_OPENED_STATE_ID,
					hidden: config && config.closed,
					onClick: {
						"collapser-btn": handleCollapse
					}
				},
				{
					view: "template",
					template: config && config.type === "bottom" ?
						"<span class='webix_icon fas fa-angle-up'></span>" :
						"<span class='webix_icon fas fa-angle-down'></span>",
					css: "collapser-btn",
					id: BTN_CLOSED_STATE_ID,
					hidden: !(config && config.closed),
					onClick: {
						"collapser-btn": handleExpand
					}
				}
			]
		};
	}
	return {
		css: "collapser",
		width: 23,
		name: collapserName,
		setClosedState: () => {
			const collapsedView = $$(collapsedViewId);
			collapsedView.hide();
			$$(BTN_OPENED_STATE_ID).hide();
			$$(BTN_CLOSED_STATE_ID).show();
			webix.ui.resize();
			changeDataviewItemDimensions(collapsedView);
		},
		rows: [
			{
				view: "template",
				template: config && config.type === "left" ?
					"<span class='webix_icon fas fa-angle-left'></span>" :
					"<span class='webix_icon fas fa-angle-right'></span>",
				css: "collapser-btn",
				id: BTN_OPENED_STATE_ID,
				hidden: config && config.closed,
				onClick: {
					"collapser-btn": handleCollapse
				}
			},
			{
				view: "template",
				template: config && config.type === "left" ?
					"<span class='webix_icon fas fa-angle-right'></span>" :
					"<span class='webix_icon fas fa-angle-left'></span>",
				css: "collapser-btn",
				id: BTN_CLOSED_STATE_ID,
				hidden: !(config && config.closed),
				onClick: {
					"collapser-btn": handleExpand
				}
			}
		]
	};
}

export default {
	getConfig
};
