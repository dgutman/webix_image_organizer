import {JetView} from "webix-jet";
import webixViews from "../../models/webixViews";

let oldName;
let item;

export default class RenamePopup extends JetView {
	config() {
		const renamePopup = {
			view: "popup",
			css: "select-field",
			width: 300,
			move: false,
			body: {
				view: "text",
				name: "nameToChangeTextView"
			}
		};
		return renamePopup;
	}

	ready() {
		this.renamePopup = this.getRenamePopup();
		this.renameTextView = this.getNameToChangeTextView();

		this.renamePopup.attachEvent("onHide", () => {
			const newName = this.renameTextView.getValue();

			if (newName !== oldName) {
				const valuesObject = {
					value: newName,
					old: oldName
				};
				const objectInGallery = {
					inGallery: true
				};
				this.finderView.callEvent("onAfterEditStop", [valuesObject, objectInGallery, item]);
			}
		});
		this.renameTextView.attachEvent("onKeyPress", (keyCode) => {
			if (keyCode === 13) { // enter
				this.renamePopup.hide();
			}
			else if (keyCode === 27) { // escape
				this.renamePopup.blockEvent();
				this.renamePopup.hide();
				this.renamePopup.unblockEvent();
			}
		});
	}

	getRenamePopup() {
		return this.getRoot();
	}

	getNameToChangeTextView() {
		return this.getRoot().queryView({name: "nameToChangeTextView"});
	}

	showPopup(itemClientRect, documentWidth, oldValue, galleryItem) {
		item = galleryItem;
		oldName = oldValue;
		this.finderView = webixViews.getFinderView();
		this.renameTextView.setValue(oldName);

		let xPosition;
		let yPosition = itemClientRect.bottom - 7;
		const renamePopupWidth = this.renamePopup.$width;
		const widthWithPopup = renamePopupWidth + itemClientRect.right;

		if (widthWithPopup > documentWidth) {
			xPosition = documentWidth - renamePopupWidth;
		}
		else {
			xPosition = itemClientRect.right - 20;
		}

		this.renamePopup.setPosition(xPosition, yPosition);
		this.renamePopup.show();
	}
}
