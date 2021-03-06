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

	FINDER_VIEW_ID: "finder-view-id",
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
	EMPTY_CART_MENU_ID: "Empty cart",

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

	LINEAR_STRUCTURE_LIMIT: 2000,
	FOLDERS_LIMIT: 0,

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

	LOADING_STATUSES: {
		DONE: {icon: "fas fa-check", iconColor: "#4caf50", value: "Done"},
		IN_PROGRESS: {icon: "fas fa-sync fa-spin", iconColor: "#ffb300", value: "In progress"},
		ERROR: {icon: "fas fa-times", iconColor: "#b71c1c", value: "Error"},
		WARNS: {icon: "fas fa-exclamation-triangle", iconColor: "#FD7E14", value: "Done with errors"}
	},

	RECOGNIZE_SERVICE_PATH: process.env.RECOGNITION_SERVICE_API,

	EDIT_ACCESS_LEVEL: 1,

	ALLOWED_FILE_EXTENSIONS: ["csv", "xls", "xlsx"],
	ITEM_NAME_COLUMN: "filename",

	ACCEPT_METADATA_LIMIT: 100,
	ESTIMATED_LOADING_TIME: 5000, // milliseconds for 100 items

	METADATA_TABLE_IMAGES_SIZES: ["32", "48", "64"],
	METADATA_TABLE_IMAGES_TYPES: ["thumbnail", "label", "macro"],

	METADATA_TABLE_IMAGE_COLUMN_CONFIG: {
		imageSize: "32",
		imageType: "thumbnail",
		columnType: "image",
		header: "Preview",
		id: "-image"
	},

	SUB_FOLDER_MODEL_TYPE: "itemsSubFolder",
	FOLDER_MAX_SHOWED_ITEMS: 5000,

	METADATA_TABLE_ROW_HEIGHT: 34,


	MAIN_MULTIVIEW_OPTIONS: [
		{id: "thumbnailView", value: "Images thumbnail view"},
		{id: "metadataView", value: "Metadata table view"},
		{id: "zstackView", value: "Zstack"}
	],
	SCENES_VIEW_OPTION: {id: "scenesView", value: "Scenes view"},
	MULTICHANNEL_VIEW_OPTION: {id: "multichannelView", value: "Multichannel view"},

	SCENES_VIEW_CHANGE_MODE_EVENT_NAME: "scenesViewerModeChange",
	SCENES_VIEW_CHANGE_POINTS_MODE_EVENT_NAME: "scenesViewerPointsModeChange",

	DEFAULT_VIEW_SIGNS: {
		SCENES_VIEW: "XBSViewOne"
	},

	OPEN_MULTICHANNEL_VIEW_EVENT: "showMultichannelView",

	THUMBNAIL_URLS: ["meta.ioparams.thumbnailUrl"]
};
