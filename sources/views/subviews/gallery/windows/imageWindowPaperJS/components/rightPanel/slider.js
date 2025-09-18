/**
 * get slider config
 *
 * @param {webix.ui.sliderConfig} opts
 * @returns {webix.ui.sliderConfig}
 */
function getConfig(opts) {
	/**
	 * slider config
	 *
	 * @type {webix.ui.sliderConfig}
	 */
	const ui = {
		...opts,
		view: "slider",
		id: opts.id || webix.uid(),
		label: opts.label || "Slider",
		labelWidth: 100,
		title: webix.template("#value#"),
	};
	return ui;
}

export default {
	getConfig,
};
