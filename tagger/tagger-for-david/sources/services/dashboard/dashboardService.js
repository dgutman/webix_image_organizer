import constants from "../../constants";
import auth from "../authentication";
import transitionalAjax from "../transitionalAjaxService";

export default class TaggerDashboardService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		// child views
		const scope = this._view.$scope;
		this._dashboard = scope.dashboard;
		this._textarea = scope.textarea;
		this._sendButton = scope.sendButton;
		this._saveButton = scope.saveButton;

		this.getTaskData();

		this._textarea.setValue(this.getTextMessageFromLS());

		this._dashboard.attachEvent("onSelectChange", () => {
			const selectedItems = this._dashboard.getSelectedItem(true);
			if (selectedItems.length) this._sendButton.enable();
			else this._sendButton.disable();
		});

		this._saveButton.attachEvent("onItemClick", () => {
			const value = this._textarea.getValue().trim();
			this.putTextToLocalStorage(value);
		});

		this._sendButton.attachEvent("onItemClick", () => {
			const value = this._textarea.getValue().trim();
			const selectedItems = this._dashboard.getSelectedItem(true);
			const taskIds = selectedItems.map(item => item._id);
			this._view.showProgress();
			transitionalAjax.sendNotifications(value, taskIds)
				.then((data) => {
					const string = data.length > 1 ? "messages were" : "message was";
					webix.message(`${data.length} ${string} successfully sent`);
					this._view.hideProgress();
				})
				.catch(() => {
					this._view.hideProgress();
				});
		});
	}

	getTaskData() {
		this._view.showProgress();
		transitionalAjax.getTaskData()
			.then((response) => {
				this._dashboard.parse(response.data);
				this._view.hideProgress();
			})
			.catch(() => {
				this._view.hideProgress();
			});
	}

	putTextToLocalStorage(text) {
		if (auth.isAdmin()) {
			webix.storage.local.put(`notification-message-${auth.getUserId()}`, text);
		}
	}

	getTextMessageFromLS() {
		return webix.storage.local.get(`notification-message-${auth.getUserId()}`) || constants.DEFAULT_NOTIFICATION_TEXT;
	}
}
