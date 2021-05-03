
define([
	"app",
	"constants",
	"helpers/switch_host_confirm"
], function (app, constants, switchHostConfirm) {
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
			data: app.config.hostsList,
			body: {
				template: obj => `<span title='${obj.value}'>${obj.value}</span>`,
				css: "ellipsis-text"
			}
		},
		on: {
			onChange: (newId, oldId) => {
				if (oldId && newId !== oldId) {
					const dropDown = $$(constants.HOST_BOX_ID);
					const host = dropDown.getList().getItem(newId);
					switchHostConfirm(dropDown, host, oldId);
				}
			}
		}
	};
	
	return {
        $ui: hostDropDownBox
    };
});

