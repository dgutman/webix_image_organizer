import transitionalAjax from "../services/transitionalAjaxService";
import authService from "../services/authentication";

class NotificationModel {
	constructor() {
		this.collection = new webix.DataCollection();
		this.getNotifications();
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
							this.collection.updateItem(item.id, {isRead: true});
						});
					}, 2000);
				});
		}
	}
}

export default new NotificationModel();
