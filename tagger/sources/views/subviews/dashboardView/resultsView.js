import {JetView} from "webix-jet";
import templates from "../../templates";
import taskUsers from "../../../models/taskUsers";

export default class TaggerResultsView extends JetView {
	config() {
		const resultsLayout = {
			css: "results-layout",
			width: 300,
			scroll: "auto",
			rows: [
				{
					name: "resultsTemplate",
					template: obj => templates.getUserProgressTemplate(obj),
					borderless: true,
					autoheight: true
				},
				{height: 10},
				{
					view: "richselect",
					css: "select-field",
					name: "resultsRichselect",
					hidden: true,
					options: {
						data: taskUsers,
						body: {
							template: obj => obj.name
						}
					}
				},
				{height: 10},
				{
					name: "tagStatisticTemplate",
					template: obj => templates.getTagsStatisticTemplate(obj),
					borderless: true,
					autoheight: true
				},
				{}
			]
		};

		const ui = {
			view: "accordionitem",
			header: "Results",
			css: "tagger-accordion-item right",
			body: resultsLayout,
			collapsed: true,
			name: "resultsAccordionItem",
			disabled: true
		};

		return ui;
	}

	get resultsTemplate() {
		return this.getRoot().queryView({name: "resultsTemplate"});
	}

	get resultsRichselect() {
		return this.getRoot().queryView({name: "resultsRichselect"});
	}

	get resultsAccordionItem() {
		return this.getRoot();
	}

	get tagStatisticTemplate() {
		return this.getRoot().queryView({name: "tagStatisticTemplate"});
	}
}
