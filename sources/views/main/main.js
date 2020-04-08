import {JetView, plugins} from "webix-jet";
import finderView from "../subviews/finder/finderView";
import multiview from "../subviews/multiDataView/multiDataView";
import dataviewActionPanel from "../subviews/dataviewActionPanel/dataviewActionPanel";
import metadataTemplateView from "../subviews/metadataPanel/metadataTemplateView";
import collapser from "../components/collapser";
import constants from "../../constants";
import MainService from "../../services/main/mainService";
import cartList from "../subviews/cartList/cardList";
import galleryFeatures from "../subviews/galleryFeatures/galleryFeatures";

const collapserName = "metadataCollapser";

export default class MainView extends JetView {
	config() {
		const rightCollapser = collapser.getConfig(constants.SCROLL_VIEW_METADATA_ID, {type: "right", closed: true}, collapserName);

		return {
			rows: [
				galleryFeatures,
				dataviewActionPanel,
				{
					cols: [
						finderView,
						multiview,
						rightCollapser,
						metadataTemplateView,
						cartList
					]
				},
				{height: 12}
			]
		};
	}

	ready(view) {
		// URL-NAV enable URL params with /
		this.use(plugins.UrlParam, ["folders"]);
		// init child views
		const hostBox = this.getSubHeaderView().getHostBox();
		const collectionBox = this.getSubHeaderView().getCollectionBox();
		const multiviewSwither = this.getSubDataviewActionPanelView().getSwitcherView();
		const galleryDataviewPager = this.getSubDataviewActionPanelView().getPagerView();
		const galleryDataview = this.getSubGalleryView().getDataView();
		const metadataTable = this.getSubMetadataTableView().getDataTableView();
		const finder = this.getSubFinderView().getTreeRoot();
		const metadataPanelScrollView = this.getSubMetadataPanelView().getScrollView();
		const metadataTemplate = this.getSubMetadataPanelView().getTemplateView();
		const metadataCollapser = this.getSubCollapserView();
		const cartList = this.getSubCartListView().getCartListView();

		this._mainService = new MainService(
			view,
			hostBox,
			collectionBox,
			multiviewSwither,
			galleryDataviewPager,
			galleryDataview,
			metadataTable,
			finder,
			metadataTemplate,
			metadataCollapser,
			metadataPanelScrollView,
			cartList
		);
	}

	// URL-NAV
	urlChange(...args) {
		if (this._mainService) {
			this._mainService._urlChange(...args);
		}
	}

	// getting child views
	getSubHostsCollectionThemesView() {
		return this.getRoot().queryView({name: "hostsCollectionThemesClass"}).$scope;
	}

	getSubDataviewActionPanelView() {
		return this.getRoot().queryView({name: "dataviewActionPanelClass"}).$scope;
	}

	getSubFinderView() {
		return this.getRoot().queryView({name: "finderClass"}).$scope;
	}

	getSubMetadataTableView() {
		return this.getRoot().queryView({name: "metadataTableCell"}).$scope;
	}

	getSubMultiDataView() {
		return this.getRoot().queryView({name: "multiDataViewClass"}).$scope;
	}

	getSubGalleryView() {
		return this.getRoot().queryView({name: "galleryCell"}).$scope;
	}

	getSubMetadataPanelView() {
		return this.getRoot().queryView({name: "metadataPanelClass"}).$scope;
	}

	getSubCollapserView() {
		return this.getRoot().queryView({name: collapserName});
	}

	getSubCartListView() {
		return this.getRoot().queryView({name: "cartListViewClass"}).$scope;
	}

	getSubGalleryFeaturesView() {
		return this.getRoot().queryView({name: "galleryFeaturesClass"}).$scope;
	}

	getSubHeaderView() {
		return this.getRoot().getTopParentView().queryView({name: "headerClass"}).$scope;
	}
}
