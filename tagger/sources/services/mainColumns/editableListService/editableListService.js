export default class EditableListService {
	constructor(view) {
		this._view = view;
		this._editMode = false;
		this._isEnterClicked = false;
		this._ready();
	}

	_ready() {
		// child views
		this._editModeBtn = this._view.$scope.getEditModeButton();
		this._editableList = this._view.$scope.getEditableList();

		// attaching events
		this._attachFastEditingEvents();
		this._attachEditModeBtnEvent();
	}

	_attachFastEditingEvents() {
		this._editableList.attachEvent("onBeforeEditStop", (state) => {
			if (!state.value && state.old) {
				state.value = state.old;
			}
		});
		this._editableList.attachEvent("onEnter", () => {
			this._isEnterClicked = true;
		});
		this._editableList.attachEvent("onAfterEditStop", (state, editor) => {
			if (this._isEnterClicked) {
				const nextId = this._editableList.getNextId(editor.id);
				if (nextId) {
					this._editableList.edit(nextId);
				}
				else {
					this._editableList.editStop(editor.id);
				}
			}
			this._isEnterClicked = false;
		});
	}

	_attachEditModeBtnEvent() {
		this._editModeBtn.attachEvent("onItemClick", () => {
			this._changeEditMode();
		});
	}

	_changeEditMode() {
		const button = this._editModeBtn;
		const editList = this._editableList;
		const viewNode = this._view.getNode();

		this._editMode = !this._editMode;
		editList.unselectAll();
		editList.define("editable", this._editMode);
		editList.define("select", !this._editMode);
		viewNode.classList.toggle("disabled-editing");
		viewNode.classList.toggle("enabled-editing");

		if (this._editMode) {
			button.setValue("Edit mode (turn off)");
		}
		else {
			button.setValue("Edit mode (turn on)");
		}
		editList.refresh();
	}
}
