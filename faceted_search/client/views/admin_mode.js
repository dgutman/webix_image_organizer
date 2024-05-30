define([
	"app",
	"views/toolbar",
	"views/edit_form",
	"views/host_drop_down",
	"views/user_panel",
	"views/folder_tree",
	"views/components/header_label",
	"helpers/authentication",
	"constants"
], function(
	app,
	toolbar,
	editFormView,
	hostDropDown,
	userPanel,
	folderTree,
	HeaderLabel,
	auth,
	constants
) {
	const editViewId = "editView";
	const ui = {
		rows: [
			{
				view: "toolbar",
				borderless: true,
				cols: [
					new HeaderLabel(app),
					{},
					hostDropDown,
					{width: 50},
					toolbar,
					{width: 50},
					userPanel
				]
			},
			{height: 10},
			{
				view: "accordion",
				id: editViewId,
				cols: [
					{
						header: "Folders",
						collapsed: true,
						body: folderTree
					},
					editFormView
				]
			}
		]
	};

	app.attachEvent("adminMode:doProgress", function(type) {
		if(type === "edit") {
			const editView = $$(editViewId);
			if (editView && !editView.$destructed) {
				editView.showProgress({
					type: "icon"
				});
			}
		}
	});

	app.attachEvent("adminMode:onLoaded", function(type, showMsg) {
		if(type === "edit") {
			const editView = $$(editViewId);
			if (editView && !editView.$destructed) {
				$$(editViewId).hideProgress();
			}
		}
		if(showMsg) {
			webix.message({
				type: "message",
				text: "Filters were saved"
			});
		}
	});

	return {
		$ui: ui,
		$oninit: function() {
			const editView = $$(editViewId);
			if (editView) {
				webix.extend(editView, webix.ProgressBar);
			}
			if (auth.isLoggedIn()) {
				app.callEvent("approvedMetadata:loadData");
				app.callEvent("approvedFacet:loadApprovedFacetData");
			} else {
				app.show("/top/user_mode");
			}
		},
		$onurlchange: (_arg1, _arg2, scope) => {
			const switchViews = scope.root.queryView({name: "switchViews"});
			switchViews.setValue(window.location.hash.indexOf("user_mode") > -1 ? constants.USER_MODE : constants.ADMIN_MODE);
		}
	};
});
