export default class PagerService {
	constructor(pager, dataview) {
		this.pager = pager;
		this.dataview = dataview;
		webix.extend(this.pager, webix.OverlayBox);
		this.attachEventHandlers();
	}

	onAfterRender() {
		const node = this.pager.getNode();
		const pagerInputNode = node.getElementsByClassName("pager-input")[0];
		const pager = this.pager;
		pagerInputNode.addEventListener("focus", () => {
			pagerInputNode.prev = pagerInputNode.value;
		});
		pagerInputNode.addEventListener("blur", () => {
			const currentPage = pager.data.page + 1; // because in pager first page is 0
			if (pagerInputNode.value !== currentPage) {
				pagerInputNode.value = currentPage;
			}
		});
		pagerInputNode.addEventListener("keydown", (e) => {
			if (e.keyCode === 13) { // enter
				let value = parseInt(pagerInputNode.value);
				if (value && value > 0 && value <= pager.data.limit) {
					pager.select(value - 1); // because in pager first page is 0
				}
				else {
					pagerInputNode.value = pagerInputNode.prev;
				}
			}
		});

		pagerInputNode.addEventListener("input", (e) => {
			const regexp = /[0-9]+/g;
			const value = pagerInputNode.value;
			const validValue = value.match(regexp) ? value.match(regexp).join("") : "";
			pagerInputNode.value = validValue;
		});
	}

	attachEventHandlers() {
		this.pager.attachEvent("onAfterRender", () => {
			this.onAfterRender();
			this.setDataviewState();
		});
		this.dataview.data.attachEvent("onStoreUpdated", () => {
			const count = this.dataview.count();
			if (!count) {
				this.pager.hide();
			}
			else if (count && !this.pager.isVisible()) {
				this.pager.show();
			}
			this.setDataviewState();
		});
		this.pager.attachEvent("onBeforePageChange", (page, oldPage) => {
			if (page !== oldPage) {
				this.dataview.scrollTo(0, 0);
			}
		});
	}

	setDataviewState() {
		const count = this.dataview.count();
		const pData = this.pager.data;
		const vr = this.getVisibleRange(pData, count);
		const dataviewNode = this.dataview.getNode();
		const scrollView = dataviewNode.querySelector(".webix_scroll_cont");
		scrollView.style.height = `${vr.actualMax}px`;
	}

	getVisibleRange(pData, dataCount) {
		const width = this.dataview._content_width;

		const t = this.dataview.type;
		const dx = Math.floor(width / t.width) || 1; // at least single item per row

		let actualSize = dataCount || 0;
		if (dataCount) {
			if (pData.page === pData.limit - 1) {
				actualSize = dataCount - pData.page * pData.size || 0;
			}
			else {
				actualSize = Math.min(actualSize, pData.size);
			}
		}
		const pageMax = Math.ceil(pData.size / dx) * t.height; // size of view in rows
		const actualMax = Math.ceil(actualSize / dx) * t.height;

		return {
			pageMax,
			actualMax,
			itemHeight: t.height,
			_dx: dx
		};
	}
}
