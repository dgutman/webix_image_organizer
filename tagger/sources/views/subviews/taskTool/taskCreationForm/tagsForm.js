import {JetView} from "webix-jet";
import TagForm from "./tagForm";
import {DELETE_TAG_FORM, RESIZE_TAGS_FORM} from "../../../../models/customEventNames";


const TAGS_FORM_ID = "tags-form";

export default class TagsForm extends JetView {
	constructor(app, config = {}) {
		super(app);

		this._cnf = config;
	}

	config() {
		return {
			...this._cnf,
			view: "form",
			localId: TAGS_FORM_ID,
			hidden: true,
			type: "line",
			css: "task-creation-tags-form",
			scroll: "y",
			elements: []
		};
	}

	ready() {
		this.attachFormEvents();
	}

	get _form() {
		return this.$$(TAGS_FORM_ID);
	}

	attachFormEvents() {
		this.on(this._form, DELETE_TAG_FORM, (form) => {
			this.removeTagForm(form);
			this.redefineFormSize();
		});

		this.on(this._form, RESIZE_TAGS_FORM, () => {
			this.redefineFormSize();
		});
	}

	addNewTagForm(tagSettings) {
		const forms = this.getFormChilds();
		const order = forms.length;
		const newForm = this.app.createView(new TagForm(this.app, tagSettings, order));
		this._form.show();
		this._form.addView(newForm);
		return newForm;
	}

	removeTagForm(form) {
		this._form.removeView(form);
	}

	removeTagForms() {
		const forms = this.getFormChilds();
		forms.forEach((view) => {
			this.removeTagForm(view);
		});
		this._form.hide();
	}

	getFormChilds() {
		return [...this._form.getChildViews()]; // to copy the array with forms
	}

	pupulateTagsByObject(tags) {
		tags.forEach((tag) => {
			const {type, icontype, selection, name, description, help, icon} = tag;
			const tagForm = this.addNewTagForm({type, icontype, selection});
			tagForm.setFormValues({name, description, help, icon}, tag.values);
		});
	}

	redefineFormSize() {
		const childHeightSum = this._form.getChildViews()
			.slice(0, 2)
			.reduce((acc, el) => acc + el.$height, 0);
		const formHeight = Math.min(childHeightSum + 5, 370);

		if (formHeight !== this._form.$height) {
			this._form.define("height", Math.min(formHeight + 5, 370));
			this._form.resize();
		}
	}

	collectTagsData() {
		return this.getFormChilds().map((form) => {
			const tag = form.getValues();
			Object.assign(tag, form.config.tagSettings);
			tag.values = form.$scope.collectValuesData();
			return tag;
		});
	}
}
