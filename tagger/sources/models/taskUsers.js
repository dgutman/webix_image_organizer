export default new webix.DataCollection({
	scheme: {
		$init: (obj) => {
			obj.name = `${obj.firstName || ""} ${obj.lastName || ""}`;
		}
	}
});
