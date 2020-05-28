import transitionalAjax from "../transitionalAjaxService";
import auth from "../authentication";
import messageBoxes from "../../views/components/messageBoxes";

export default class NotesService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		this._notesList = this._view.$scope.getNotesList();
		this._addNoteButton = this._view.$scope.getAddNoteButton();

		this._getNotes();
		this._notesListEvents();
	}

	_notesListEvents() {
		const userId = auth.getUserId();

		this._addNoteButton.define("onClick", {
			"add-new": () => {
				const itemId = this._notesList.add({created: Date.now()}, 0);
				this._notesList.edit(itemId);
			}
		});

		this._notesList.attachEvent("onItemDblClick", (id) => {
			const itemNode = this._notesList.getItemNode(id);
			if (!itemNode.classList.contains("edit-mode")) {
				this._notesList.edit(id);
			}
		});

		this._notesList.attachEvent("onItemClick", (id, ev) => {
			const note = this._notesList.getItem(id);
			if (ev.target.classList.contains("delete-note")) {
				messageBoxes.confirmDelete("note")
					.then(() => transitionalAjax.removeNote(note._id))
					.then(() => {
						this._notesList.remove(id);
					});
			}
		});

		this._notesList.attachEvent("onCustomEditStart", (id) => {
			const itemNode = this._notesList.getItemNode(id);
			itemNode.classList.add("edit-mode");
		});

		this._notesList.attachEvent("onCustomEditStop", (id, values) => {
			messageBoxes.hideValidationPopup();
			const itemNode = this._notesList.getItemNode(id);
			itemNode.classList.remove("edit-mode");

			const note = this._notesList.getItem(id);
			if (!note._id && values.value) {
				transitionalAjax.createNote(note, userId)
					.then((response) => {
						this._notesList.updateItem(id, response.data);
					});
			}
			else if (values.value !== values.old && values.value) {
				transitionalAjax.updateNote(note._id, values.value)
					.then((response) => {
						this._notesList.updateItem(id, response.data);
					});
			}
			else if (!note._id && !values.value) {
				this._notesList.remove(id);
			}
		});
	}

	_getNotes() {
		const userId = auth.getUserId();
		transitionalAjax.getNotesByUser(userId)
			.then((data) => {
				this._notesList.parse(data);
			});
	}
}
