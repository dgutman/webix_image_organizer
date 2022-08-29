import {JetView} from "webix-jet";
import transitionalAjax from "../../services/transitionalAjaxService";

export default class ExportResultsWindow extends JetView {
	config() {
		const description = {
			view: "label",
			label: "Metadata of all tasks in status Finished will be exported."
		};
		const dataOrder = {
			view: "radio",
			name: "file-format-radio",
			label: "Please choose data order and file format.",
			labelPosition: "top",
			options: [
				{id: 1, value: "Basic per User"},
				{id: 2, value: "Common per Task"}
			],
			value: "1"
		};
		const jsonButton = {
			view: "button",
			value: "JSON",
			width: 100,
			click: () => this.exportResult("json")
		};
		const txtButton = {
			view: "button",
			value: "TXT",
			width: 100,
			click: () => this.exportResult("txt")
		};
		const buttons = {
			cols: [
				{gravity: 1},
				jsonButton,
				{gravity: 1},
				txtButton,
				{gravity: 1}
			]
		};
		const win = {
			view: "window",
			css: "export-results-window",
			scroll: false,
			width: 400,
			height: 400,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "export-results-window-header",
						name: "headerTemplateName",
						template: "Export results",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						css: "btn webix_transparent",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				css: "export-results-window-body",
				rows: [
					description,
					dataOrder,
					buttons
				]
			}
		};
		return win;
	}

	showWindow() {
		this.getRoot().show();
	}

	async exportResult(extension) {
		const dataOrderElement = this.getRoot().queryView({name: "file-format-radio"});
		let result;
		let fileName;
		// Group - Task - User - Image - Tag - Value
		if (dataOrderElement.getValue() === "1") {
			result = await transitionalAjax.getFinishedTasksPerUser();
			fileName = "finished tasks per user";
		}
		// Group - Task - Image - Tag - Value - Quantity Users Assigned/Selected - Users
		else if (dataOrderElement.getValue() === "2") {
			result = await transitionalAjax.getFinishedTasksPerTask();
			fileName = "finished tasks per task";
		}
		if (extension === "txt") {
			const file = new Blob([JSON.stringify(result, null, 2)], {type: "application/txt"});
			webix.html.download(file, `${fileName}.txt`);
		}
		else if (extension === "json") {
			const file = new Blob([JSON.stringify(result, null, 2)], {type: "application/json"});
			webix.html.download(file, `${fileName}.json`);
		}
	}

	closeWindow() {
		this.getRoot().hide();
	}
}
