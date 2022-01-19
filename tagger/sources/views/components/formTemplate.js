webix.protoUI({
	name: "formTemplate",
	getValue() {
		const obj = this.getValues();
		return obj[this.config.name || "value"];
	},
	setValue(value) {
		value = {
			[this.config.name || "value"]: value
		};
		return this.setValues(value);
	}
}, webix.ui.template);
