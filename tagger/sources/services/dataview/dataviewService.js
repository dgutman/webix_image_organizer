import templates from "../../views/templates";
import constants from "../../constants";

export default class DataviewService {
	constructor(dataview, pager) {
		this.dataview = dataview;
		this.pager = pager;
		this.initOverlay();
		this.multiplier = 1;

		this.pager.attachEvent("onAfterRender", () => {
			this.onAfterPagerRender();
		});
	}

	initOverlay() {
		webix.extend(this.dataview, webix.OverlayBox);
		webix.extend(this.pager, webix.OverlayBox);
	}

	setDataviewState(count, text) {
		const dataviewNode = this.dataview.getNode();
		if (!count) {
			// Gallery Dataview
			dataviewNode.classList.add("hidden-overflow");
			this.dataview.showOverlay(templates.getDataviewOverlay(text));

			// Gallery Dataview Pager
			this.pager.showOverlay("<div class='empty-overlay'></div>");
		}
		else {
			// Gallery Dataview
			dataviewNode.classList.remove("hidden-overflow");
			this.dataview.hideOverlay();

			// Gallery Dataview Pager
			this.pager.hideOverlay();
		}
	}

	getVisibleRange() {
		const single = this.multiplier === "single";

		const state = this.dataview.getScrollState();
		const top = Math.max(0, state.y);
		const width = this.dataview._content_width;
		const height = this.dataview._content_height; // size of single item

		const dataviewNode = this.dataview.getNode();
		const nodeWidth = dataviewNode.offsetWidth;
		const nodeHeight = dataviewNode.offsetHeight;

		const t = this.dataview.type;
		let dx = Math.floor(width / t.width) || 1; // at least single item per row

		if (single) dx = 1;

		const xReminder = nodeWidth - t.width * dx;

		let min = Math.floor(top / t.height); // index of first visible row

		let dy = Math.ceil((height + top) / t.height) - 1 || 1; // index of last visible row
		// total count of items, paging can affect this math
		if (single) dy = 1;

		const yReminder = nodeHeight - t.height * dy;

		let count = this.dataview.data.$max ?
			this.dataview.data.$max - this.dataview.data.$min : this.dataview.count();
		let max = Math.ceil(count / dx) * t.height; // size of view in rows

		return {
			_from: min,
			_dy: dy,
			_top: top,
			_max: max,
			_y: t.height,
			_dx: dx,
			xReminder,
			yReminder
		};
	}

	onAfterPagerRender() {
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

		pagerInputNode.addEventListener("input", () => {
			const regexp = /[0-9]+/g;
			const value = pagerInputNode.value;
			const validValue = value.match(regexp) ? value.match(regexp).join("") : "";
			pagerInputNode.value = validValue;
		});
	}

	getPagerSize() {
		const vr = this.getVisibleRange();
		const yCount = vr._dy || 1;
		const xCount = vr._dx || 1;
		return yCount * xCount;
	}

	setImagesRange() {
		const prevSize = this.pager.data.size;
		const size = this.getPagerSize();
		if (prevSize !== size) {
			this.pager.define("size", size);
			this.pager.refresh();
		}
	}

	onResizeDataview() {
		if (this.multiplier === "single") {
			this.setImageSize(1, this.multiplier);
		}
		const index = this.getFirstItemIndexOnPage();
		this.setImagesRange();
		const page = this.getCurrentPageByItemIndex(index);
		this.dataview.refresh();
		return Promise.resolve(page);
	}

	getFirstItemIndexOnPage() {
		const pData = this.pager.data || {page: 0, size: 0};
		return pData.page * pData.size;
	}

	getCurrentPageByItemIndex(index) {
		return Math.floor(index / this.pager.data.size);
	}

	getDataviewTypeObject(multiplier) {
		multiplier = multiplier || 1;
		let width = constants.DATAVIEW_IMAGE_SIZE.WIDTH;
		let height = constants.DATAVIEW_IMAGE_SIZE.HEIGHT;
		if (multiplier === "single") {
			const dataviewNode = this.dataview.getNode();
			const nodeWidth = dataviewNode.offsetWidth;
			const nodeHeight = dataviewNode.offsetHeight;
			const widthMultiplier = Math.floor(nodeWidth / width);
			const heightMultiplier = Math.floor(nodeHeight / height);
			multiplier = Math.min(widthMultiplier, heightMultiplier) - 1;
		}
		width *= multiplier;
		height *= multiplier;
		return {
			width,
			height
		};
	}

	getNotLoadedItemIndex() {
		const pData = this.pager.data;
		const offset = pData.size * pData.page;
		const last = offset + pData.size;
		const items = this.dataview.data.serialize();
		const pageItems = items.slice(offset, last);
		const pageIndex = Math.max(pageItems.findIndex(item => !item), pageItems.length);
		const index = pageIndex + offset;
		const limit = pData.size - pageIndex;

		return {index, pageIndex, limit};
	}

	setImageSize(id, multi) {
		const multiplier = multi || constants.DATAVIEW_IMAGE_MULTIPLIERS.get(id);
		this.multiplier = multiplier;
		const dataviewTypeObj = this.dataview.config.type;
		const itemSizes = this.getDataviewTypeObject(multiplier);
		Object.assign(dataviewTypeObj, itemSizes);
		this.dataview.customize(dataviewTypeObj);
		this.dataview.refresh();
	}
}
