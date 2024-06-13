
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
		$ui: hostDropDownBox,
		$oninit() {
			const hostBox = webix.$$(constants.HOST_BOX_ID);
			hostBox.getList().waitData.then(() => {
				const hostsList = hostBox.getList();
				const dataCount = hostsList?.count();
				if (dataCount <= 1) {
					hostBox.hide();
					const hostId = hostsList.getFirstId();
					const host = hostsList.getItem(hostId);
					const hostAPI = host.hostAPI;
					const currentHostId = webix.storage.local.get("hostId");
					const currentHostAPI = webix.storage.local.get("hostAPI");
					webix.storage.local.put("hostId", host.id);
					webix.storage.local.put("hostAPI", host.hostAPI);
					if (currentHostId !== hostId || currentHostAPI !== hostAPI) {
						window.location.reload();
					}
				}
			});
		}
	};
});

