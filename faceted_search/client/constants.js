define([], function() {
	return {
		LOGOUT_PANEL_ID: "logout-panel",
		LOGIN_PANEL_ID: "login-panel",
		HOST_BOX_ID: "host-box",
		FOLDER_TREE_ID: "folder-tree-view",
		LOCAL_API: `${window.location.origin}/api`,
		DEFAULT_CHANNEL_SETTINGS: {
			opacity: 1,
			min: 0,
			max: 15000
		},
		USER_MODE: 1,
		ADMIN_MODE: 0,
		WHITELIST_POPUP_ID: "edit_whitelist_popup_id"
	};
});
