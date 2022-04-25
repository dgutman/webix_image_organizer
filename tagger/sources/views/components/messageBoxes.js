function confirmDelete(str) {
	return webix.confirm({
		title: "Delete",
		text: `Are you sure you want to delete this ${str}?`,
		ok: "Yes",
		cancel: "No"
	});
}

function confirmMessage(message) {
	return webix.confirm({
		text: message || "",
		ok: "Yes",
		cancel: "No"
	});
}

const validationPopup = webix.ui({
	view: "popup",
	autofocus: false,
	height: 30,
	width: 150,
	body: {
		css: "popup-validate-template",
		borderless: true,
		template: obj => `${obj.text}`
	}
});

function showValidationPopup(node, text) {
	const template = validationPopup.getBody();
	template.setValues({text});
	validationPopup.show(node, {pos: "top"});
}

function hideValidationPopup() {
	const template = validationPopup.getBody();
	template.setValues({text: ""});
	validationPopup.hide();
}

export default {
	confirmDelete,
	confirmMessage,
	showValidationPopup,
	hideValidationPopup
};
