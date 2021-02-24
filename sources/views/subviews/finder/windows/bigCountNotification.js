import {JetView} from "webix-jet";
import auth from "../../../../services/authentication";

export default class BigCountNotificationWindow extends JetView {
	config() {
		const bigCountNotificationWindow = {
			view: "window",
			name: "bigCountNotificationWindow",
			position: "center",
			move: true,
			modal: true,
			width: 400,
			height: 250,
			head: {
				height: 60,
				cols: [
					{
						css: "notification-popup-header",
						name: "bigCountNotificationWindowHead",
						template: "Notification"
					}
				]
			},
			body: {
				rows: [
					{
						template: "<div style='text-align: center'>The folder has more than 5000 images. It will be structured inside the \"&lt;items&gt;\" subfolder</div>",
						borderless: true,
						autoheight: true
					},
					{
						borderless: true,
						view: "form",
						name: "bigCountNotificationWindowForm",
						elements: [
							{
								cols: [
									{
										view: "checkbox",
										name: "show",
										css: "checkbox-ctrl",
										label: "Don't show again",
										value: 0,
										width: 170,
										labelWidth: 130
									},
									{},
									{
										view: "button",
										name: "okButton",
										width: 90,
										css: "btn",
										value: "Ok",
										click: () => {
											const form = this.getRoot().queryView({name: "bigCountNotificationWindowForm"});
											const values = form.getValues();
											const userInfo = auth.getUserInfo();
											if (values.show) {
												webix.storage.local.put(`dont-show-notification-about-amount-${userInfo ? userInfo._id : "unregistered"}`, true);
											}
											this.closeWindow();
										}
									}
								]
							}
						]
					}
				]}
		};

		return bigCountNotificationWindow;
	}

	init(view) {
		this._view = view;
	}

	isShowingNeeded() {
		const userInfo = auth.getUserInfo();
		const showFlag = webix.storage.local.get(`dont-show-notification-about-amount-${userInfo ? userInfo._id : "unregistered"}`);
		return !showFlag && !this.getRoot().isVisible();
	}

	showWindow() {
		if (this.isShowingNeeded()) {
			this.getRoot().show();
		}
	}

	closeWindow() {
		this.getRoot().hide();
	}
}
