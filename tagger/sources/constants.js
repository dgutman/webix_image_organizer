const location = window.location;

const TAGGER_PATH = "app";

export default {

	KEY_TOKEN: "girderToken",

	APP_PATHS: {
		TAGGER: TAGGER_PATH,
		TAGGER_ADMIN: `${TAGGER_PATH}/admin`,
		TAGGER_ADMIN_DASHBOARD: "/dashboard",
		TAGGER_USER: `${TAGGER_PATH}/user`,
		TAGGER_USER_NOTIFICATIONS: "/notifications",
		TAGGER_TASK_TOOL: `${TAGGER_PATH}/task_tool`
	},
	ADMIN_VIEW_PATTERN: "^(\\/app\\/admin|app\\/admin|\\/dashboard)",

	PATTERN_PASSWORD: "^[!@_#$%^&?*()\"\\0-9a-zA-Z]{6,15}$",
	PATTERN_PASSWORD_HAS_SPEC_SYMBOLS: "[!@_#$%^&?*()\"\\0-9]+",
	PATTERN_LOGIN: "^[a-zA-Z]{1}[a-zA-Z0-9_.]{3,}$",
	PATTERN_TAGS: "[ A-Za-z0-9&_-]+",
	PATTERN_VALUES: "[ A-Za-z0-9&_-]+",
	PATTERN_NOTES: "[A-Za-z0-9_\\/\\|\\\\@#,.+&:;\"'<>*!?%№()$ \\r\\n^=\\{\\}\\[\\]`~-]+",

	TRANSITIONAL_TAGGER_SERVER_PATH: process.env.TAGGER_API_PATH,

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
		["Big", 2.5],
		["Single image", "single"]
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

	TAGGER_TASKS_COLLECTION_ID: process.env.TAGGER_TASKS_COLLECTION_ID,

	TAGGER_NO_VALUE_FILTER: "&lt;no value&gt;",

	DEFAULT_NOTIFICATION_TEXT: "Dear Colleague,\n\nplease, speed up task completion. We hope, that your progress can be increased.\n\nAdministration.",
	CONNECTION_ERROR_MESSAGE: "Server connection error.<br /> Please check the connection.",

	WEBIX_MESSAGE_TEXT_LIMIT: 140,

	DEFAULT_TAG_SETTINGS: {
		type: "multiple",
		selection: "single",
		icontype: "pervalue"
	},

	CREATE_TASK_BUTTON_ID: "task-creation:create-task",
	EDIT_TASK_BUTTON_ID: "task-creation:edit-task",
	PUBLISH_TASK_BUTTON_ID: "task-creation:publish-task",
	PREVIEW_TASK_BUTTON_ID: "task-creation:preview-task",

	DEFAULT_COLORS: [
		"#ef9a9a",
		"#9fa8da",
		"#80deea",
		"#a5d6a7",
		"#fff59d",
		"#ffcc80",
		"#ce93d8",
		"#bcaaa4",
		"#f48fb1",
		"#546e7a"
	],

	DEFAULT_HOT_KEYS: [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
	],

	BINARY_ICONS_FOR_VALUES: {
		YES: ["true", "yes"],
		NO: ["false", "no"]
	},

	USER_MENU_ITEMS: {
		ADMIN: [
			{id: "dashboard", value: "<span class='fas fa-table'></span> Dashboard"},
			{id: "task_tool", value: "<span class='fas fa-toolbox'></span> Create"},
			{id: "user", value: "<span class='fas fa-columns'></span> User View"}
		],
		USER: [
			{id: "notifications", value: "<span class='fas fa-bell'></span> Notifications"}
		],
		BOTH: [
			{id: "logout", value: "<span class='fas fa-arrow-right'></span> Logout"}
		]
	},

	TASK_STATUS_CREATED: "created",
	TASK_STATUS_PUBLISHED: "published",
	TASK_STATUS_IN_PROGRESS: "in_progress",
	TASK_STATUS_CANCELED: "canceled",
	TASK_STATUS_FINISHED: "finished",

	TASK_STATUSES: ["created", "published", "in_progress", "canceled", "finished"],

	TAG_ICON_TYPES: {
		PER_VALUE: "pervalue",
		BADGE: "badge",
		BADGE_COLOR: "badgecolor"
	}
};
