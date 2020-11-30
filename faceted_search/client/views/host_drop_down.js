
define([
	"app",
	"constants",
	"helpers/authentication",
], function (app, constants) {
	const preselectedHost = webix.storage.local.get("hostId") || 1;

	const hostDropDownBox = {
		view: "richselect",
		id: constants.HOST_BOX_ID,
		css: "ellipsis-text",
		label: "Hosts",
		labelWidth: 100,
		width: 250,
		value: preselectedHost,
		options: {
			template: "#value#",
			data: constants.HOSTS_LIST,
			body: {
				template: obj => `<span title='${obj.value}'>${obj.value}</span>`,
				css: "ellipsis-text"
			}
		},
		on: {
			onChange: (newId, oldId) => {
				if (oldId && newId !== oldId) {
					webix.confirm({
						title: "Attention!",
						type: "confirm-warning",
						text: "Are you sure you want to change host? All data will be cleared.",
						ok: "Yes",
						cancel: "No",
						callback: (result) => {
							const dropDown = $$(constants.HOST_BOX_ID);
							if (result) {
								const host = dropDown.getList().getItem(newId);
								webix.storage.local.put("hostId", newId);
								webix.storage.local.put("hostAPI", host.hostAPI);
								window.location.reload();
							}
							else {
								dropDown.blockEvent();
								dropDown.setValue(oldId);
								dropDown.unblockEvent();
							}
						}
					});
				}
			}
		}
	};
	
	return {
        $ui: hostDropDownBox
    };
});

