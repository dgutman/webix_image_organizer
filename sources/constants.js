const location = window.location;

const APP_URL_PATH = "app";

export default {

	KEY_TOKEN: "girderToken",

	APP_PATHS: {
		APP: APP_URL_PATH,
		MAIN: `${APP_URL_PATH}///main`,
		UPLOAD_METADATA: `${APP_URL_PATH}///upload-metadata`
	},

	PATTERN_PASSWORD: "^[!@_#$%^&?*()\"\\0-9a-zA-Z]{6,15}$",
	PATTERN_PASSWORD_HAS_SPEC_SYMBOLS: "[!@_#$%^&?*()\"\\0-9]+",
	PATTERN_LOGIN: "^[a-zA-Z]{1}[a-zA-Z0-9_.]{3,}$",
	PATTERN_ITEM_FIELDS: "^[a-zA-Z0-9_](?:\\.?[a-zA-Z0-9_]+)*$",

	SCROLL_VIEW_METADATA_ID: "scroll-view-metadata-id",
	ID_GALLERY_RICHSELECT: "gallery-richselect-viewid",
	ID_DATATABLE_IMAGES_TEMPLATE: "datatable-images-template-id",

	RENAME_CONTEXT_MENU_ID: "Rename folder",
	LINEAR_CONTEXT_MENU_ID: "Make linear structure",
	RENAME_FILE_CONTEXT_MENU_ID: "Rename file",
	REFRESH_FOLDER_CONTEXT_MENU_ID: "Refresh folder",
	RUN_RECOGNITION_SERVICE: "Recognition service",
	UPLOAD_METADATA_MENU_ID: "Upload metadata",


	MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: "Make large image",

	IMAGES_ONLY_MENU_ID: "Download selected items only",
	IMAGES_AND_METADATA_MENU_ID: "Download selected items and metadata",
	COPY_TO_CLIPBOARD_MENU_ID: "Copy selected items",
	ADD_TAG_TO_IMAGES_MENU_ID: "Add tag to images",

	EDIT_COLUMN_MODE_ADD: "addColumn",
	EDIT_COLUMN_MODE_DELETE: "deleteColumn",

	INITIAL_COLUMNS_IDS: {
		ID: "_id",
		NAME: "name",
		PARENT_TYPE: "baseParentType",
		CREATED: "created",
		UPDATED: "updated",
		MODEL_TYPE: "_modelType",
		SIZE: "size"
	},

	IGNORED_METADATA_COLUMNS: ["dsalayers", "geojslayer"], // not for only top level keys. Example for nested keys: geojslayer[0].someValue

	THREE_DATAVIEW_COLUMNS: "Display large images",
	FIVE_DATAVIEW_COLUMNS: "Display medium images",
	DEFAULT_DATAVIEW_COLUMNS: "Display small images",

	STORAGE_COLUMNS_CONFIG: "storage-columns-config",
	STORAGE_NEW_ITEM_META_FIELDS: "new-meta-fields",

	LINEAR_STRUCTURE_LIMIT: 150,
	FOLDERS_LIMIT: 500,

	MAX_COUNT_IMAGES_SELECTION: 100,

	FILTER_TYPE_NONE: "None",
	FILTER_TYPE_SELECT: "Select filter",
	FILTER_TYPE_DATE: "Date filter",
	FILTER_TYPE_TEXT: "Typing filter",

	PROJECT_METADATA_FOLDER_NAME: ".ProjectMetadata",

	THUMBNAIL_DATAVIEW_IMAGES: "Display THUMBNAIL images",
	LABEL_DATAVIEW_IMAGES: "Display LABEL images",
	MACRO_DATAVIEW_IMAGES: "Display MACRO images",
	MACRO_AND_LABEL_DATAVIEW_IMAGES: "Display LABEL & MACRO images",

	MAIN_PROPERTIES_CLASS_NAME: "main-properties",
	METADATA_PROPERTIES_CLASS_NAME: "metadata-properties",

	MOUSE_LEFT_SINGLE_CLICK: "mouseLeftSingle",
	MOUSE_RIGHT_SINGLE_CLICK: "mouseRightSingle",
	MOUSE_LEFT_DOUBLE_CLICK: "mouseLeftDouble",

	RECOGNITION_OPTION_IDS: {
		MARKER: "Find markers",
		STICKER: "Find stickers",
		LABEL: "Find labels"
	},

	RECOGNITION_STATUSES: {
		DONE: {icon: "fas fa-check", iconColor: "#4caf50", value: "Done"},
		IN_PROGRESS: {icon: "fas fa-sync fa-spin", iconColor: "#ffb300", value: "In progress"},
		ERROR: {icon: "fas fa-times", iconColor: "#b71c1c", value: "Error"},
		WARNS: {icon: "fas fa-exclamation-triangle", iconColor: "#FD7E14", value: "Done with errors"}
	},

	RECOGNIZE_SERVICE_PATH: location.hostname === "localhost" ? `http://${location.hostname}:5000` : "http://192.168.1.223:5000",

	EDIT_ACCESS_LEVEL: 1,

	ALLOWED_FILE_EXTENSIONS: ["csv"],
	ITEM_NAME_COLUMN: "filename",

	ACCEPT_METADATA_LIMIT: 100,
	ESTIMATED_LOADING_TIME: 5000 // milliseconds for 100 items
};
