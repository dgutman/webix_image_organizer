/*
import {JetView} from "webix-jet";
import ajax from "../../../services/ajaxActions";
import utils from "../../../utils/utils";

let hiddenViews = true;
const serverListData = process.env.SERVER_LIST;

export default class HostsCollectionThemesClass extends JetView {
	config() {
		const hostsAndCollectionsTemplate = {
			height: 27,
			width: 220,
			view: "template",
			borderless: true,
			name: "hostsAndCollectionsTemplateName",
			css: `collapssible-accordion ${utils.getCssCollapsedClass(hiddenViews)}`,
			template: "Hosts, Collections & Themes",
			onClick: {
				"collapssible-accordion": () => {
					utils.collapseViews(this.hostsAndCollectionsTemplate, this.hostsAndCollectionsViews, hiddenViews);
					hiddenViews = !hiddenViews;
				}
			}
		};

		const hostDropDownBox = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			name: "hostBoxName",
			css: "select-field",
			label: "Hosts",
			labelWidth: 70,
			width: 300,
			options: {
				template: "#value#",
				data: serverListData
			}
		};

		const collectionDropDownBox = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			name: "collectionBoxName",
			css: "select-field",
			label: "Collections",
			width: 330,
			labelWidth: 100,
			options: {
				body: {
					template: obj => obj.name || ""
				}
			}
		};
		const skinSwitcher = {
			name: "skin",
			labelWidth: 70,
			width: 300,
			view: "richselect",
			icon: utils.getSelectIcon(),
			css: "select-field",
			value: this.app.getService("theme").getTheme(),
			label: "Theme",
			options: [
				{id: "flat", value: "flat"},
				{id: "compact", value: "compact"},
				{id: "aircompact", value: "aircompact"},
				{id: "clouds", value: "clouds"},
				{id: "air", value: "air"},
				{id: "glamour", value: "glamour"},
				{id: "light", value: "light"},
				{id: "metro", value: "metro"},
				{id: "terrace", value: "terrace"},
				{id: "touch", value: "touch"},
				{id: "web", value: "web"}
			],
			on: {
				onChange: () => this.toggleTheme()
			}
		};
		return {
			name: "hostsCollectionThemesClass",
			rows: [
				{
					cols: [
						{width: 30},
						hostsAndCollectionsTemplate,
						{}
					]
				},
				{
					name: "hostsAndCollectionsViews",
					hidden: hiddenViews,
					cols: [
						{},
						hostDropDownBox,
						{},
						collectionDropDownBox,
						{},
						skinSwitcher,
						{}
					]
				}
			]

		};
	}

	ready() {
		this.hostsAndCollectionsTemplate = this.getHostsAndCollectionsTemplate();
		this.hostsAndCollectionsViews = this.getHiddenViews();
	}

	toggleTheme() {
		const themes = this.app.getService("theme");
		const value = this.getRoot().queryView({name: "skin"}).getValue();
		themes.setTheme(value, true);
	}

	loadCollectionData() {
		return ajax.getCollection().then(collections => collections);
	}

	parseToList(collections) {
		this.getCollectionBox().getList().clearAll();
		this.getCollectionBox().getList().parse(collections);
	}

	getHostBox() {
		return this.getRoot().queryView({name: "hostBoxName"});
	}

	getCollectionBox() {
		return this.getRoot().queryView({name: "collectionBoxName"});
	}

	parseCollectionData() {
		this.loadCollectionData()
			.then((data) => {
				this.parseToList({
					data: webix.copy(data)
				});
				let collectionList = this.getCollectionBox().getList();
				let firstId = collectionList.getFirstId();
				collectionList.select(firstId);
				this.getCollectionBox().setValue(firstId);
			});
	}

	getHostsAndCollectionsTemplate() {
		return this.getRoot().queryView({name: "hostsAndCollectionsTemplateName"});
	}

	getHiddenViews() {
		return this.getRoot().queryView({name: "hostsAndCollectionsViews"});
	}

}
*/
