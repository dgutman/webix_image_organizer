webix.protoUI({
	name: "progress-template",
	$init() {
		this.$ready.push(this._set_progress_template);
	},
	defaults: {
		css: "progress-component",
		minRange: 0,
		maxRange: 100,
		value: 0
	},
	setValue(value) {
		this.define("value", value);
		this.refresh();
	},
	getValue() {
		return this.config.value;
	},
	_set_progress_template() {
		this.define("template", () => {
			const error = this.config.error ? "error" : "";
			const value = this.config.value || 0;
			const maxRange = this.config.maxRange || 1;
			const percents = (+value / +maxRange) * 100;
			const roundedPercents = percents < 1 ? Math.ceil(percents) : Math.floor(percents);

			return `<div class="progress-bar">
						<span class="bar">
							<span class='progress-text'>${roundedPercents}%</span>
							<span class="progress ${error}" style='width: ${roundedPercents}%;'></span>
						</span>
					</div>`;
		});
	}
}, webix.ui.template);
