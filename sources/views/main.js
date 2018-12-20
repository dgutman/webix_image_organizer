import {JetView} from "webix-jet";
import header from "./header/header";
import selectView from "./parts/selectView";
import treeView from "./dataview/treeView";
import datatableView from "./dataview/dataView";
import pagerNswitcher from "./parts/pagerNswitcher";
import metadataView from "./dataview/metadataView";
import collapser from "./components/collapser";
import constants from "../constants";
import MainService from "../services/main/mainService";
import cartView from "./cartView/cardView";
import galleryFeatures from "./parts/galleryFeatures";

const collapserName = "metadataCollapser";

export default class MainView extends JetView {
	config() {
		const rightCollapser = collapser.getConfig(constants.SCROLL_VIEW_METADATA_ID, {type: "right", closed: true}, collapserName);

		return {
			rows: [
				header,
				selectView,
				galleryFeatures,
				pagerNswitcher,
				{
					cols: [
						treeView,
						datatableView,
						rightCollapser,
						metadataView,
						cartView
					]
				},
				{height: 12}
			]
		};
	}

	ready(view) {
		// init child views
		const hostBox = this.getSubSelectView().getHostBox();
		const collectionBox = this.getSubSelectView().getCollectionBox();
		const switcher = this.getSubPagerAndSwitcherView().getSwitcherView();
		const pager = this.getSubPagerAndSwitcherView().getPagerView();
		const dataview = this.getSubDataView().getDataView();
		const datatable = this.getSubDataView().getDataTableView();
		const tree = this.getSubTreeView().getTreeRoot();
		const scrollview = this.getSubMetadataView().getScrollView();
		const metaTemplate = this.getSubMetadataView().getTemplateView();
		const metadataCollapser = this.getSubCollapserView();
		const cartList = this.getSubCartView().getCartListView();

		this._mainService = new MainService(
			view,
			hostBox,
			collectionBox,
			switcher,
			pager,
			dataview,
			datatable,
			tree,
			metaTemplate,
			metadataCollapser,
			scrollview,
			cartList
		);
	}

	// getting child views
	getSubSelectView() {
		return this.getRoot().queryView({name: "selectViewClass"}).$scope;
	}

	getSubPagerAndSwitcherView() {
		return this.getRoot().queryView({name: "pagerAndSwitcherViewClass"}).$scope;
	}

	getSubTreeView() {
		return this.getRoot().queryView({name: "treeViewClass"}).$scope;
	}


	getSubDataView() {
		return this.getRoot().queryView({name: "multiDataviewClass"}).$scope;
	}

	getSubMetadataView() {
		return this.getRoot().queryView({name: "metadataViewClass"}).$scope;
	}

	getSubCollapserView() {
		return this.getRoot().queryView({name: collapserName});
	}

	getSubCartView() {
		return this.getRoot().queryView({name: "cartViewClass"}).$scope;
	}

	getSubGalleryFeaturesView() {
		return this.getRoot().queryView({name: "galleryFeaturesClass"}).$scope;
	}

}
