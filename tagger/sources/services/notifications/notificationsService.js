import NotificationsModel from "../../models/notificationsModel";
import transitionalAjax from "../transitionalAjaxService";

export default class TaggerNotificationsService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		const notificationsModel = NotificationsModel.getInstance();
		webix.extend(this._view, webix.ProgressBar);
		// child views
		const scope = this._view.$scope;
		this._list = scope.notificationsList;
		this._notificationsCollection = notificationsModel.collection;

		this._list.sync(this._notificationsCollection);
		this._notificationsCollection.waitData
			.then(() => {
				notificationsModel.readNotifications();
			});

		this._list.attachEvent("onItemClick", (id, e) => {
			const item = this._list.getItem(id);
			if (e.target.classList.contains("remove-icon")) {
				this._notificationsCollection.updateItem(id, {_pending: true});
				transitionalAjax.removeNotification(item._id)
					.then(() => {
						this._notificationsCollection.remove(id);
					})
					.catch(() => {
						if (this.collection.exists(item.id)) {
							this._notificationsCollection.updateItem(id, {_pending: false});
						}
					});
				return false;
			}
		});
	}
}
