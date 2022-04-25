import transitionalAjax from "../services/transitionalAjaxService";
import authService from "../services/authentication";

class NotificationModel {
	constructor() {
		if (!NotificationModel._instance) {
			NotificationModel._instance = this;
			this.collection = new webix.DataCollection();
			this.getNotifications();
		}
		else {
			throw new Error("Instantiation failed: use NotificationModel.getInstance() instead of new.");
		}
	}

	getNotifications() {
		if (!this.collection.count() && authService.isLoggedIn() && !authService.isAdmin()) {
			transitionalAjax.getNotifications()
				.then((data) => {
					this.collection.parse(data);
				});
		}
	}

	readNotifications() {
		const data = this.collection.data.serialize().filter(item => !item.isRead);
		const ids = data.map(item => item._id);
		if (ids.length) {
			transitionalAjax.readNotifications(ids)
				.then(() => {
					setTimeout(() => {
						data.forEach((item) => {
							if (this.collection.exists(item.id)) {
								this.collection.updateItem(item.id, {isRead: true});
							}
						});
					}, 2000);
				});
		}
	}

	getInstance() {
		const userId = authService.getUserId();
		if (userId === NotificationModel._userId) {
			return NotificationModel._instance;
		}
		NotificationModel._userId = userId;
		NotificationModel._instance = null;
		NotificationModel._instance = new NotificationModel();
		return NotificationModel._instance;
	}
}

export default new NotificationModel();
