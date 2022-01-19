define([
    "app",
    "constants"
    ], function(app, constants){

	function returnToOldValue(selectView, oldId) {
		selectView.blockEvent(); //another one confirm window will pop up because of onchange event 
		selectView.setValue(oldId);
		selectView.unblockEvent();
	}

    return function (selectView, host, oldId) {

        var callback = function(result){
            if(result){
                const LOCAL_API = constants.LOCAL_API;
				webix.ajax(`${LOCAL_API}/host/${host.id}`)
					.then(() => {
						webix.storage.local.put("hostId", host.id);
						webix.storage.local.put("hostAPI", host.hostAPI);
						window.location.reload();
					})
					.catch((err) => {
						returnToOldValue(selectView, oldId);
					});
            } else {
				returnToOldValue(selectView, oldId);
            }
        }

        webix.confirm({
			title: "Attention!",
			type: "confirm-warning",
			text: "Are you sure you want to change host? All data will be cleared.",
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    }
})