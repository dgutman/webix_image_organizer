webix.protoUI({
	name: "finderCounter",
	setCount(count) {
		if (count) {
			this.show();
		}
		else {
			this.hide();
		}
		this.setValues({count});
	},
	defaults: {
		borderless: true,
		hidden: true,
		height: 35,
		template({count}) {
			return `<div class='finder-counter'>Found: <span class='strong-font'>${count}</span> items</div>`;
		}
	}
}, webix.ui.template);
