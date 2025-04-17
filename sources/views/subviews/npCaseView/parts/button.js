function getConfig(config) {
	if (config.id === "HE_button") {
		config.css = "np_button_active";
	}
	return {
		...config,
		view: "button",
		width: 100,
		inputHeight: 70
	};
}

export default {
	getConfig
};
