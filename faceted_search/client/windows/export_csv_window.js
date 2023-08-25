define([
	"app",
	"helpers/base_jet_view",
	"models/approved_metadata",
	"models/filter",
	"helpers/authentication",
	"helpers/enum",
	"helpers/ajax"
], function(
	app,
	BaseJetView,
	approvedMetadataModel,
	Filter,
	auth,
	Enum,
	ajaxActions
) {
	"user strict";
	app.callEvent("approvedMetadata:loadData");
	webix.csv.delimiter.cols = ', ';
	const METADATA_EXPORT_ID = "metadata-export-id";
	const EXPORT_CSV_LABEL_ID = "export-csv-label-id";
	const EXPORT_TO_DATASET_LABEL_ID = "export-csv-to-server-label-id";
	const FILE_NAME_TEXT_ID = "file-name-text-id";
	const FILE_FORMAT_RADIO_ID = "file-format-radio-id";
	const PERMISSION_FOLDER_RADIO_ID = "permission-folder-radio-id";
	const FILE_FORMAT = Enum({
		CSV: "csv",
		JSON: "json"
	});
	const EXPORT_METHOD = Enum({
		PUSH_TO_DATASET: "push-to-dataset",
		EXPORT_CSV: "export-csv"
	});
	const PERMISSION_FOLDER = Enum({
		PUBLIC: "Public",
		PRIVATE: "Private"
	});

	return class ExportCSVWindow extends BaseJetView {
		constructor(app) {
			super(app);
			this.$ondestroy = () => {
				return this.destroy();
			};
			this.exportData;
			this.exportMethod;
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
							label: "Export CSV",
							id: EXPORT_CSV_LABEL_ID,
							hidden: true
						},
						{
							view: "label",
							label: "Push to Dataset",
							id: EXPORT_TO_DATASET_LABEL_ID,
							hidden: true
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
							view: "radio",
							id: FILE_FORMAT_RADIO_ID,
							value: FILE_FORMAT.CSV,
							labelWidth: 120,
							label: "File extension",
							hidden: true,
							options: [
								{
									id: FILE_FORMAT.CSV,
									value: "csv "
								},
								{
									id: FILE_FORMAT.JSON,
									value: "json"
								}
							]
						},
						{
							view: "radio",
							id: PERMISSION_FOLDER_RADIO_ID,
							value: PERMISSION_FOLDER.PRIVATE,
							labelWidth: 120,
							label: "Permission",
							hidden: true,
							options: [
								{
									id: PERMISSION_FOLDER.PRIVATE,
									value: "Private"
								},
								{
									id: PERMISSION_FOLDER.PUBLIC,
									value: "Public"
								}
							]
						},
						{
							view: "text",
							id: FILE_NAME_TEXT_ID,
							width: 400,
							label: "File name",
							placeholder: "Dataset"
						},
						{height: 15},
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
							click: async () => {
								const exportMetadata = $$(METADATA_EXPORT_ID).data.serialize();
								// const appliedFilters = Filter.getFilters().data.pull;
								const appliedFilters = "";
								const datasetName = $$(FILE_NAME_TEXT_ID).getValue() || "Dataset";
								const isPublic = $$(PERMISSION_FOLDER_RADIO_ID).getValue() === PERMISSION_FOLDER.PUBLIC ? true : false;
								const filteredExportData = this.exportData.map((image, index, array) => {
									if (index === 0) {
										return `[${this.filterData(image, exportMetadata)}`;
									} else if (index === array.length - 1) {
										return `${this.filterData(image, exportMetadata)}]`;
									} else {
										return this.filterData(image, exportMetadata);
									}
								});
								const list = webix.ui({
									view: "list"
								});
								list.parse(filteredExportData);
								if (this.exportMethod === EXPORT_METHOD.PUSH_TO_DATASET) {
									const dataset = list.serialize();
									try {
										const result = await ajaxActions.postDataset(dataset, datasetName, appliedFilters, isPublic);
										if (result?.name) {
											webix.message(`Dataset with name "${result.name}" is created`);
										}
										else {
											webix.message("Dataset is not created")
										}
									} catch (err) {
										console.error(JSON.stringify(err));
									}
								} else {
									webix.toCSV(list);
								}
							}
						}
					]
				}
			};
		};

		showWindow(data, isDatasetPush) {
			const approvedProps = approvedMetadataModel.getProps();
			$$(METADATA_EXPORT_ID).clearAll();
			$$(METADATA_EXPORT_ID).parse(approvedProps);
			this.exportData = data;
			if (isDatasetPush) {
				this.exportMethod = EXPORT_METHOD.PUSH_TO_DATASET;
				$$(EXPORT_TO_DATASET_LABEL_ID).show();
				$$(PERMISSION_FOLDER_RADIO_ID).show();
			}
			else {
				this.exportMethod = EXPORT_METHOD.EXPORT_CSV;
				$$(EXPORT_CSV_LABEL_ID).show();
			}
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
