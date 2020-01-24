export default {

	KEY_TOKEN: "girderToken",

	APP_PATHS: {
		TAGGER: "app"
	},

	PATTERN_PASSWORD: "^[!@_#$%^&?*()\"\\0-9a-zA-Z]{6,15}$",
	PATTERN_PASSWORD_HAS_SPEC_SYMBOLS: "[!@_#$%^&?*()\"\\0-9]+",
	PATTERN_LOGIN: "^[a-zA-Z]{1}[a-zA-Z0-9_.]{3,}$",
	PATTERN_TAGS: "[A-Za-z0-9&_]+",
	PATTERN_VALUES: "[A-Za-z0-9&_]+",
	PATTERN_NOTES: "[A-Za-z0-9_\\/\\|\\\\@#,.+&:;\"'<>*!?%№()$ \\r\\n^=\\{\\}\\[\\]`~-]+",

	TRANSITIONAL_TAGGER_SERVER_PARH: process.env.TAGGER_API_PATH,

	RESOURCE_IMAGES_LIMIT: 50,

	RECOGNITION_STATUSES: {
		DONE: {icon: "fas fa-check", iconColor: "#4caf50", value: "Done"},
		IN_PROGRESS: {icon: "fas fa-sync fa-spin", iconColor: "#ffb300", value: "In progress"},
		ERROR: {icon: "fas fa-times", iconColor: "#b71c1c", value: "Error"},
		WARNS: {icon: "fas fa-exclamation-triangle", iconColor: "#FD7E14", value: "Done with errors"}
	},

	WINDOW_SIZE: {
		WIDTH: 1300,
		HEIGHT: 650,
		MIN_WIDTH: 735,
		MIN_HEIGHT: 400
	},

	DATAVIEW_IMAGE_SIZE: {
		WIDTH: 135,
		HEIGHT: 120
	},

	DATAVIEW_IMAGE_MULTIPLIERS: {
		"Default size": 1,
		"x1.5": 1.5,
		"x2": 2,
		"x2.5": 2.5,
		"x3": 3
	}
};
