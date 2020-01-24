import {JetView} from "webix-jet";
import NotesService from "../../../services/notesService/notesService";
import auth from "../../../services/authentication";
import formats from "../../../utils/formats";
import "../../components/notesList";

export default class NotesViewClass extends JetView {
	config() {
		const addNoteButton = {
			template: () => "<div><a class='add-new'><i class=\"fas fa-plus-circle\"></i> Add new note</a></div>",
			name: "addNoteButton",
			height: 30,
			width: 150,
			borderless: true,
			hidden: !auth.isLoggedIn()
		};

		const listHeaderLayout = {
			cols: [
				addNoteButton
			]
		};

		const notesList = {
			view: "notesList",
			template: (obj) => {
				let date = new Date(obj.created);
				date = formats.formatDateString(date);
				return `<div class='note-item'>
							<div class='note-flex-container'>
								<div class='note-content'>
									<div class='note-date'>${date}</div>
									<div class='editable-content'>${obj.content || ""}</div>
								</div>
								<span class='delete-note fas fa-trash'></span>
							</div>
						</div>`;
			},
			type: {
				height: "auto"
			},
			borderless: true,
			select: false,
			navigation: false
		};

		const ui = {
			padding: 10,
			height: 250,
			rows: [
				listHeaderLayout,
				notesList
			]
		};

		return ui;
	}

	ready(view) {
		if (auth.isLoggedIn()) {
			this.notesService = new NotesService(view);
		}
		// fix bug with endless resizer
		const accordionItem = view.getParentView();
		accordionItem.attachEvent("onViewResize", () => {
			const parent = accordionItem.getParentView();
			const childs = parent.getChildViews();
			let siblingsHeight = 0;
			childs.forEach((child) => {
				if (child.config.id !== accordionItem.config.id) {
					siblingsHeight += child.$height;
				}
			});
			parent.define("height", window.innerHeight);
			parent.resize();
			parent.define("height", undefined);
			const viewHeight = parent.$height - siblingsHeight;
			if (accordionItem.$height > viewHeight) {
				accordionItem.define("height", viewHeight);
				accordionItem.resize();
			}
			else if (accordionItem.$height < 150) {
				accordionItem.define("height", 150);
				accordionItem.resize();
			}
		});
	}

	getNotesList() {
		return this.getRoot().queryView({view: "notesList"});
	}

	getAddNoteButton() {
		return this.getRoot().queryView({name: "addNoteButton"});
	}

	unescapeHtml(str) {
		return str
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#039;/g, "'");
	}
}
