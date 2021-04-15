define([], function () {
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
		}
	}
})