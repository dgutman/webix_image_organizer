import messageBoxes from "./messageBoxes";
import constants from "../../constants";

webix.protoUI({
	name: "notesList",
	defaults: {
		editable: false,
		maxCharCount: 250
	},
	$init() {
		this.$view.classList.add("editable_list");
	},

	edit(id) {
		const item = this.getItem(id);
		const itemNode = this.getItemNode(id);
		const parentNode = itemNode.querySelector(".note-content");
		const editableNode = parentNode.querySelector(".editable-content");
		editableNode.classList.add("hidden");

		const textarea = document.createElement("textarea");
		textarea.setAttribute("maxlength", this.config.maxCharCount);
		textarea.classList.add("list-edit-textarea");
		const oldValue = item.content || "";

		textarea.value = this._unescapeHtml(oldValue) || "";
		parentNode.appendChild(textarea);
		this._fixTextareaHeight(textarea, editableNode);
		textarea.focus();

		const inputEventId = textarea.addEventListener("input", () => {
			this._filterItemText(textarea);
			this._fixTextareaHeight(textarea, editableNode);
		});

		const keypressEventId = webix.event(textarea, "keypress", (ev) => {
			if (ev.keyCode === 13 && !ev.shiftKey) { // Enter key
				textarea.blur();
				ev.preventDefault();
			}
		});

		const blurEventId = webix.event(textarea, "blur", () => {
			const values = {
				value: textarea.value,
				old: oldValue || ""
			};
			this.updateItem(id, {content: values.value || oldValue});
			this.callEvent("onCustomEditStop", [id, values]);
			webix.eventRemove(blurEventId);
			webix.eventRemove(inputEventId);
			webix.eventRemove(keypressEventId);
			parentNode.removeChild(textarea);
		});

		this.callEvent("onCustomEditStart", [id, textarea]);
	},

	_fixTextareaHeight(textarea, editableNode) {
		const value = textarea.value;
		let text = "";
		value.split("\n").forEach((s) => {
			text = `${text}${s.replace(/\s\s/g, " &nbsp;")}\n`;
		});
		editableNode.innerHTML = text;
		textarea.style.height = "auto";
		textarea.style.height = `${editableNode.scrollHeight}px`;
	},

	_filterItemText(textarea) {
		// validate text
		const value = textarea.value;
		const regex = new RegExp(constants.PATTERN_NOTES, "g");
		let text = "";

		let validValue = value.match(regex) ? value.match(regex).join("") : "";
		if (value !== validValue) {
			text = "Invalid character";
		}
		else {
			validValue = validValue.slice(0, this.config.maxCharCount);
			text = `Symbols left - ${Math.max(this.config.maxCharCount - validValue.length, 0)}`;
		}
		textarea.value = validValue;
		messageBoxes.showValidationPopup(textarea, text);
	},

	_unescapeHtml(str) {
		return str
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#039;/g, "'");
	}
}, webix.ui.list);
