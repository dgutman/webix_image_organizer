define([
	"app",
	"helpers/base_jet_view",
	"models/approved_metadata"
], function(
	app,
	BaseJetView,
	approvedMetadataModel
) {
	"user strict";
	app.callEvent("approvedMetadata:loadData");
	webix.csv.delimiter.cols = ', ';
	const METADATA_EXPORT_ID = "metadata-export-id";

	return class ExportCSVWindow extends BaseJetView {
		constructor(app) {
			super(app);
			this.$ondestroy = () => {
				return this.destroy();
			};
			this.exportData;
		}

		get $ui() {
			return {
				view: "window",
				css: "export-csv-window",
				id: this._rootId,
				modal: true,
				position: "center",
				width: 500,
				height: 500,
				head: {
					view: "toolbar",
					cols: [
						{gravity: 1},
						{
							view: "label",
							label: "Export CSV"
						},
						{gravity: 1},
						{
							view: "button",
							label: "Close",
							click: () => {
								this.getRoot().close();
							}
						}
					]
				},
				body: {
					rows: [
						{
							// TODO: add grouplist to component
							view: "grouplist",
							id: METADATA_EXPORT_ID,
							scroll: "auto",
							navigation: false,
							gravity: 10,
							select: false,
							drag: "source",
							templateGroup: ({value, id, checked}, common) => `<div style="width:100%; display: flex">
								<span class='metadata-grouplist__group-value'>${value}</span> ${common.checkboxState(checked)} <span style="padding-left:4px">Select all</span>
								</div>`,
							templateItem: ({value, id, checked}, common) => `<div style="width: 100%; display: flex">
								<span class='metadata-grouplist__item-value'>${value}</span> ${common.checkboxState(checked)}
								</div>`,
								type: {
									checkboxState: (checked) => {
										const icon = checked ? "checkbox mdi mdi-checkbox-marked" : "checkbox mdi mdi-checkbox-blank-outline";
										return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
									}
								},
							onClick: {
								checkbox: (ev, id) => {
									const grouplistView = $$(METADATA_EXPORT_ID);
									this.handleIconSelect(grouplistView, id);
									return false;
								}
							}
						},
						{
							view: "button",
							value: "Confirm",
							click: () => {
								const exportMetadata = $$(METADATA_EXPORT_ID).data.serialize();
								const filteredExportData = this.exportData.map((image) => this.filterData(image, exportMetadata));
								filteredExportData[0] = "[" + filteredExportData[0];
								filteredExportData[filteredExportData.length - 1] += "]";
								const list = webix.ui({
									view: "list"
								});
								list.parse(filteredExportData);
								webix.toCSV(list);
							}
						}
					]
				}
			};
		};

		showWindow(data) {
			const approvedProps = approvedMetadataModel.getProps();
			$$(METADATA_EXPORT_ID).clearAll();
			$$(METADATA_EXPORT_ID).parse(approvedProps);
			this.exportData = data;
			this.getRoot().show();
		}

		filterData(data, exportMetadata) {
			const dataToDisplay = {};
			exportMetadata.forEach((filter) => {
				if(filter.checked === false) {
					let dataForChecking;
					if(data.hasOwnProperty(filter.value)) {
						dataForChecking = data[filter.value];
					}
					if(Array.isArray(dataForChecking)) {
						filter.data.forEach((item, i) => {
							if(item.checked) {
								if(!dataToDisplay.hasOwnProperty(filter.value)) {
									dataToDisplay[filter.value] = {};
								}
								dataToDisplay[filter.value][i] = dataForChecking[i];
							}
						});
					} else {
						if(dataForChecking && typeof(dataForChecking) === "object" && !Array.isArray(dataForChecking)) {
							if(filter?.data?.length > 0) {
								dataForChecking = this.filterData(dataForChecking, filter.data);
							}
							const checkingDataLength = Object.keys(dataForChecking).length > 0
								? Object.keys(dataForChecking).length
								: 0;
							if(checkingDataLength > 0) {
								dataToDisplay[filter.value] = dataForChecking;
							}
						}
					}
				} else if(data.hasOwnProperty(filter.value)) {
					dataToDisplay[filter.value] = data[filter.value];
				}
			});
			return JSON.stringify(dataToDisplay);
		}

		checkData(id, data, check) {
			data.eachChild(id, (child) => {
				child.checked = check;
				if(data.getBranch(child.id).length > 0) {
					this.checkData(child.id, data, check);
				}
			});
		}

		handleIconSelect(view, id) {
			const element = view.getItem(id);
			const data = view.data;
			if(element.checked === true) {
				element.checked = false;
			} else {
				element.checked = true;
			}
			this.checkData(id, data, element.checked);
			view.render();
		}
	};
});
