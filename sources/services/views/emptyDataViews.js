const overlayNode = `<div class='data-subview-overlay'>
						<span class='overlay-text'>There are no items</span>
					</div>`;

export default class MainDataViewsStateSetter {
	constructor(dataCollection, dataview, metadataTable, pager, selectItemsTemplate) {
		this.dataCollection = dataCollection;
		this.dataview = dataview;
		this.metadataTable = metadataTable;
		this.pager = pager;
		this.selectItemsTemplate = selectItemsTemplate;
		this.initOverlay();
	}

	initOverlay() {
		webix.extend(this.dataview, webix.OverlayBox);
		webix.extend(this.metadataTable, webix.OverlayBox);
		webix.extend(this.pager, webix.OverlayBox);
	}

	attachDataCollectionEvent() {
		this.dataview.data.attachEvent("onStoreUpdated", () => {
			const count = this.dataview.count();
			this.setDataviewState(count);
		});
		this.metadataTable.data.attachEvent("onStoreUpdated", () => {
			const count = this.metadataTable.count();
			this.setDatatableState(count);
		});
	}

	setDataviewState(count) {
		const pData = this.pager.data;
		const vr = this.getVisibleRange(pData, count);
		const dataviewNode = this.dataview.getNode();
		const scrollView = dataviewNode.querySelector(".webix_scroll_cont");
		scrollView.style.height = `${Math.min(vr.actualMax, vr.pageMax)}px`;
		if (!count) {
			// Gallery Dataview
			dataviewNode.classList.add("hidden-overflow");
			this.dataview.showOverlay(overlayNode);

			// Gallery Dataview Pager
			this.pager.showOverlay("<div class='empty-overlay'></div>");

			// Select Items Template
			this.showOrHideImageSelectionTemplate("hide", this.selectItemsTemplate);
		}
		else {
			// Gallery Dataview
			dataviewNode.classList.remove("hidden-overflow");
			this.dataview.hideOverlay();

			// Gallery Dataview Pager
			this.pager.hideOverlay();

			// Select Items Template
			this.showOrHideImageSelectionTemplate("show", this.selectItemsTemplate);
		}
	}

	setDatatableState(count) {
		if (!count) {
			// MetadataTable
			this.metadataTable.showOverlay(overlayNode);
		}
		else {
			// MetadataTable
			this.metadataTable.hideOverlay();
		}
	}

	getVisibleRange(pData, dataCount) {
		const width = this.dataview._content_width;

		const t = this.dataview.type;
		let dx = Math.floor(width / t.width) || 1; // at least single item per row

		let actualSize = dataCount || 0;
		if (dataCount) {
			if (pData.page === pData.limit - 1) {
				actualSize = dataCount - pData.page * pData.size || 0;
			}
			else {
				actualSize = Math.min(actualSize, pData.size);
			}
		}
		let pageMax = Math.ceil(pData.size / dx) * t.height; // size of view in rows
		let actualMax = Math.ceil(actualSize / dx) * t.height;

		return {
			pageMax,
			actualMax,
			itemHeight: t.height,
			_dx: dx
		};
	}

	showOrHideImageSelectionTemplate(action, template) {
		if (action === "show") {
			template.show();
			this.dataview.getNode().style.borderTop = "none";
		}
		else {
			template.hide();
			this.dataview.getNode().style.borderTop = "1px solid #DDDDDD";
		}
	}
}

