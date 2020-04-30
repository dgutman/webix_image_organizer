const location = window.location;

const TAGGER_PATH = "app";

export default {

	KEY_TOKEN: "girderToken",

	APP_PATHS: {
		TAGGER: TAGGER_PATH,
		TAGGER_ADMIN: `${TAGGER_PATH}/admin`,
		TAGGER_ADMIN_DASHBOARD: "/dashboard",
		TAGGER_USER: `${TAGGER_PATH}/user`,
		TAGGER_USER_NOTIFICATIONS: "/notifications"
	},
	ADMIN_VIEW_PATTERN: "^(\\/app\\/admin|app\\/admin|\\/dashboard)",

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

	DATAVIEW_IMAGE_MULTIPLIERS: new Map([
		["Small", 1],
		["Medium", 1.75],
		["Big", 2.5]
	]),

	TAG_TYPES: {
		MULTI_WITH_DEFAULT: "multiple_with_default",
		MULTI: "multiple"
	},

	TAG_SELECTION: {
		SINGLE: "single",
		MULTI: "multiple"
	},

	HEADER_HEIGHT: 60,

	DATAVIEW_TAG_ICON_WRAP_SIZE: 28,

	TAGGER_TASKS_COLLECTION_ID:  process.env.TAGGER_TASKS_COLLECTION_ID,

	TAGGER_NO_VALUE_FILTER: "&lt;no value&gt;",

	DEFAULT_NOTIFICATION_TEXT: "Dear Colleague,\n\nplease, speed up task completion. We hope, that your progress can be increased.\n\nAdministration.",

	WEBIX_MESSAGE_TEXT_LIMIT: 140
};
