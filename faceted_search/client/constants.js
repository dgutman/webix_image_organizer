define([], function() {
	return {
		LOGOUT_PANEL_ID: "logout-panel",
		LOGIN_PANEL_ID: "login-panel",
		HOST_BOX_ID: "host-box",
		FOLDER_TREE_ID: "folder-tree-view",
		LOGOUT_MENU_ID: "logout-menu-id",
		LOCAL_API: `${window.location.origin}/api`,
		// begin channel list
		LIST_ID: "channels-list",
		TEXT_SEARCH_ID: "channels-search-field",
		ADD_TO_GROUP_BUTTON_ID: "add-to-group",
		// end channel list
		DEFAULT_CHANNEL_SETTINGS: {
			opacity: 1,
			min: 500,
			max: 30000
		},
		DEFAULT_16_BIT_CHANNEL_SETTINGS: {
			opacity: 1,
			min: 0,
			max: 15000
		},
		DEFAULT_8_BIT_CHANNEL_SETTINGS: {
			opacity: 1,
			min: 0,
			max: 256
		},
		USER_MODE: 1,
		ADMIN_MODE: 0,
		TEMPLATE_IMAGE_SIZE: {
			SMALL: 0,
			MEDIUM: 1,
			LARGE: 2
		},
		// begin approved-metadata popup
		APPROVED_METADATA_POPUP_ID: "edit_approved_metadata_popup_id",
		METADATA_GROUPLIST_ID: "metadata-grouplist-id",
		// end approved-metadata popup

		MAX_EDGE_FOR_8_BIT: 256,
		MAX_EDGE_FOR_16_BIT: 65536,
		EIGHT_BIT: 8,
		SIXTEEN_BIT: 16,
		THUMBNAIL_URLS: ["meta.ioparams.thumbnailUrl"],
		CHANNEL_MAP_FILTER: "meta|ioparams|channelmap",
		CHANNEL_MAP_FIELD_PATH: "meta.ioparams.channelmap",
		HIDDEN_METADATA_FIELDS: [
			"_id",
			"meta.ioparams.channelmap",
			"meta.ioparams.thumbnailUrl",
			"largeImage"
		],
		LINEAR_SCALE_VALUE: 1,
		LOGARITHMIC_SCALE_VALUE: 0,

		// start approved-facet popup
		SELECT_FACET_POPUP_ID: "filter_facet_popup_id",
		SELECT_APPROVED_FACET_VIEW_ID: "filter_facet_view_id",
		FACET_FILTER_GROUPLIST_ID: "facet_filter_grouplist_id",
		// end approved-facet popup

		TUTORIAL_LINK: "https://screencast-o-matic.com/watch/crhuIbVhoxa",

		// begin GroupColorTemplateWindow
		CLOSE_BUTTON_ID: "close-color-template-window-button",
		TEMPLATE_CHANNELS_LIST_ID: "template-channel-list",
		COLOR_TEMPLATE_WINDOW_ID: "color-template-window-",
		SAVE_TEMPLATE_BUTTON_ID: "save-template-button",
		ADD_TEMPLATE_BUTTON_ID: "add-template-button",
		DEFAULT_TEMPLATE: {
			name: "Default",
			channels: []
		},
		// end GroupColorTemplateWindow

		// begin ColorPickerWindow
		FORM_ID: "color-form",
		HISTOGRAM_FORM_ID: "histogram-form",
		// end ColorPickerWindow
		SEGMENT_CHANNELS: [
			"SEGMENTATION",
			"DAPI"
		],
		RESYNC_ID: "resync-id",
		STATUS_BAR_ID: "status-bar-id",

		// begin export dataset
		DATASET_COLLECTION_NAME: "NeuroTK",
		DATASET_FOLDER_NAME: "Datasets",
		PRIVATE_DATASET_FOLDER_NAME: "Private",
		PUBLIC_DATASET_FOLDER_NAME: "Public",
		// end export dataset

		// begin filters local storage
		APPLIED_FILTERS_LOCAL_STORAGE_KEY: "applied-filters",
		CASE_FILTERS_LOCAL_STORAGE_KEY: "case-filters",
		// end filters local storage

		FOLDER_TREE_ACTION: {
			upload: 1,
			delete: 2,
		},
		GENERATE_SCENE_FROM_TEMPLATE_ID: "generate-scene-from-template-button",
		CHECKBOX_STATE: {
			blank: 0,
			minus: 1,
			checked: 2,
		},
		STORAGE_HOTKEYS_CONFIG: 'hotkeys-config',
		STORAGE_HOTKEYS_LETTERS_USAGE: 'hotkeys-letter-usage',
		FILTER_STATUS: {
			MODIFIED: "modified",
			ADDED: "added",
			ALREADY_ADDED: "already_added",
			REMOVED: "removed",
		},
		AGGREGATE_CHECKBOX_NAME: "aggregate-checkbox",
		AGGREGATE_ICON_NAME: "aggregate-icon",
		HOTKEYS_LETTERS_STATE: {
			USE_LETTERS: 1,
			DISABLE_LETTERS: 0,
		}
	};
});
