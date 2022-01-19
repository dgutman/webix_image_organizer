import {JetView} from "webix-jet";

export default class SearchWithHeaderClass extends JetView {
	constructor(app, name, subConfig) {
		super(app, name);
		this.subConfig = subConfig;
	}

	config() {
		const searchInput = {
			view: "search",
			name: "searchInput",
			css: "search-field ellipsis-text",
			placeholder: this.subConfig.searchPlaceholder
		};

		const searchContainer = {
			rows: [
				searchInput
			]
		};

		return searchContainer;
	}

	getSearchInput() {
		return this.getRoot().queryView({name: "searchInput"});
	}
}
