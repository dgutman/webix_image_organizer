define([], function() {
	return {
		LOGOUT_PANEL_ID: "logout-panel",
		LOGIN_PANEL_ID: "login-panel",
		HOST_BOX_ID: "host-box",
		FOLDER_TREE_ID: "folder-tree-view",
		LOCAL_API: `${window.location.origin}/api`,
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
		WHITELIST_POPUP_ID: "edit_whitelist_popup_id",
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
			"largeImage"
		]
	};
});
