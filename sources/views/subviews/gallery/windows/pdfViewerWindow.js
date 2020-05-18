import {JetView} from "webix-jet";
import ajaxActions from "../../../../services/ajaxActions";

export default class PdfViewerWindowView extends JetView {
	config() {
		const pdfViewerWindowView = {
			view: "window",
			head: {
				cols: [
					{
						view: "template",
						name: "windowHeaderTemplate",
						css: "large-image-name",
						template: obj => obj.name,
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			move: true,
			modal: true,
			position: "center",
			resize: true,
			width: 900,
			height: 800,
			body: {
				rows: [
					{
						view: "template",
						name: "pdfViewerTemplate"
					}
				]
			}
		};
		return pdfViewerWindowView;
	}

	getPdfViewerTemplate() {
		return this.getRoot().queryView({name: "pdfViewerTemplate"});
	}

	getWindowHeaderTemplate() {
		return this.getRoot().queryView({name: "windowHeaderTemplate"});
	}

	showWindow(obj) {
		this.getWindowHeaderTemplate().parse(obj);
		this.setTemplateContent(obj);
		this.getRoot().show();
	}

	// setting template that we will display
	setTemplateContent(item) {
		if (item) {
			let content = `<embed src='${ajaxActions.getOpenFileUrl(item._id)}' 
							width='100%' height='100%' 
								pluginspage='http://www.adobe.com/products/acrobat/readstep2.html'>`;
			this.getPdfViewerTemplate().define("template", content);
			this.getPdfViewerTemplate().refresh();
		}
		else {
			this.getPdfViewerTemplate().define("template", "Nothing to display");
			this.getPdfViewerTemplate().refresh();
		}
	}

	close() {
		this.getWindowHeaderTemplate().parse({emptyObject: true});
		this.setTemplateContent();
		this.getRoot().hide();
	}
}

