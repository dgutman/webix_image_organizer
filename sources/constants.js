export default {

	KEY_TOKEN: "girderToken",

	PATTERN_PASSWORD: "^[!@_#$%^&?*()\"\\0-9a-zA-Z]{6,15}$",
	PATTERN_PASSWORD_HAS_SPEC_SYMBOLS: "[!@_#$%^&?*()\"\\0-9]+",
	PATTERN_LOGIN: "^[a-zA-Z]{1}[a-zA-Z0-9_.]{3,}$",

	SCROLL_VIEW_METADATA_ID: "scroll-view-metadata-id",
	ID_GALLERY_RICHSELECT: "gallery-richselect-viewid",
	ID_DATATABLE_IMAGES_TEMPLATE: "datatable-images-template-id",

	RENAME_CONTEXT_MENU_ID: "Rename folder",
	LINEAR_CONTEXT_MENU_ID: "Make linear structure",
	RENAME_FILE_CONTEXT_MENU_ID: "Rename file",
	REFRESH_FOLDER_CONTEXT_MENU_ID: "Refresh folder",

	MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: "Make large image",

	IMAGES_ONLY_MENU_ID: "Download Selected Items only",
	IMAGES_AND_METADATA_MENU_ID: "Download Selected Items and Metadata",
	COPY_TO_CLIPBOARD_MENU_ID: "Copy Selected Items",
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

	THREE_DATAVIEW_COLUMNS: "Display large images",
	FIVE_DATAVIEW_COLUMNS: "Display medium images",
	DEFAULT_DATAVIEW_COLUMNS: "Display small images",

	STORAGE_COLUMNS_CONFIG: "storage-columns-config",

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
	MOUSE_LEFT_DOUBLE_CLICK: "mouseLeftDouble"
};