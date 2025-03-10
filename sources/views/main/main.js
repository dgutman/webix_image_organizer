import {JetView, plugins} from "webix-jet";

import constants from "../../constants";
import MainService from "../../services/main/mainService";
import collapser from "../components/collapser";
import cartList from "../subviews/cartList/cardList";
import dataviewActionPanel from "../subviews/dataviewActionPanel/dataviewActionPanel";
import finderView from "../subviews/finder/finderView";
import galleryFeatures from "../subviews/galleryFeatures/galleryFeatures";
import metadataTemplateView from "../subviews/metadataPanel/metadataTemplateView";
import Multiview from "../subviews/multiDataView/multiDataView";

const metadataCollapserName = "metadataCollapser";
const finderCollapserName = "finderCollapserName";

export default class MainView extends JetView {
	constructor(app) {
		super(app);

		this._multiview = new Multiview(app);
	}

	config() {
		const rightCollapser = collapser.getConfig(constants.SCROLL_VIEW_METADATA_ID, {type: "right", closed: true}, metadataCollapserName, "Metadata");
		const finderCollapser = collapser.getConfig(constants.FINDER_VIEW_ID, {type: "left", closed: false}, finderCollapserName, "Folders tree");

		return {
			rows: [
				galleryFeatures,
				dataviewActionPanel,
				{
					cols: [
						finderView,
						finderCollapser,
						this._multiview,
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
		const metadataCollapser = this.getSubMetadataCollapserView();
		const cartListView = this.getSubCartListView().getCartListView();
		const npView = this.getSubNPView();
		const finderCollapser = this.getSubFinderCollapserView();

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
			cartListView,
			npView,
			finderCollapser,
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

	getSubMultiDataView() {
		return this._multiview;
	}

	getSubMetadataTableView() {
		return this._multiview.getMetadataTableView();
	}

	getSubGalleryView() {
		return this._multiview.getThumbnalisView();
	}

	getSubZStackView() {
		return this._multiview.getZStackView();
	}

	getSubScenesViewCell() {
		return this._multiview.getScenesView();
	}

	getSubMultichannelViewCell() {
		return this._multiview.getMultichannelView();
	}

	getSubMetadataPanelView() {
		return this.getRoot().queryView({name: "metadataPanelClass"}).$scope;
	}

	getSubMetadataCollapserView() {
		return this.getRoot().queryView({name: metadataCollapserName});
	}

	getSubFinderCollapserView() {
		return this.getRoot().queryView({name: finderCollapserName});
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

	getSubNPView() {
		return this._multiview.getNPView();
	}
}
