define([], function () {
	return {
		LOGOUT_PANEL_ID: "logout-panel",
		LOGIN_PANEL_ID: "login-panel",
		HOST_BOX_ID: "host-box",
		FOLDER_TREE_ID: "folder-tree-view",
		HOSTS_LIST: [
			{id: "1", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1"},
			{id: "2", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"}
		],
		LOCAL_API: `${window.location.origin}/api`
	}
})