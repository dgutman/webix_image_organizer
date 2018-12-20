import {JetView} from "webix-jet";

export default class PagerSwitcherView extends JetView {
	config() {
		const switchButton = {
			view: "switch",
			value: 0,
			labelAlign: "right",
			width: 570,
			labelWidth: 200,
			labelRight: "Metadata table view",
			label: "Images thumbnail view",
			multiview: true
		};

		const pager = {
			view: "pager",
			width: 305,
			size: 70,
			template: (obj, common) => {
				return `${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
							<span class='pager-amount'>of ${obj.limit} ${this.getItemsCount(obj)}</span> ${common.next()} ${common.last()}`;
			}
		};

		const cartButton = {
			view: "button",
			name: "hideOrShowCartListButtonName",
			css: "transparent-button",
			width: 120,
			hidden: true
		};

		return {
			name: "pagerAndSwitcherViewClass",
			padding: 5,
			cols: [
				{},
				switchButton,
				{},
				pager,
				{},
				cartButton,
				{width: 40}
			]
		};
	}

	getItemsCount(pagerObj) {
		let count = pagerObj.count;
		let page = pagerObj.page + 1; //because first page in object is 0
		let pageSize = pagerObj.size;
		if (count < pageSize) {
			return `(${count}/${count})`;
		} else {
			let pageCount = pageSize * page;
			if (pageCount > count) {
				pageCount = count;
			}
			return `(${pageCount}/${count})`;
		}
	}

	getSwitcherView() {
		return this.getRoot().queryView({view: "switch"});
	}

	getPagerView() {
		return this.getRoot().queryView({view: "pager"});
	}

	getCartButton() {
		return this.getRoot().queryView({name: "hideOrShowCartListButtonName"});
	}
}
