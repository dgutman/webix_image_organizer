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

		TUTORIAL_LINK: "https://screencast-o-matic.com/watch/crhuIbVhoxa"
	};
});
