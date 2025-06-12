const annotationMagicWandToolbarId = "annotationMagicWandToolbar";

function getConfig(wandTool) {
	const config = {
		view: "window",
		id: annotationMagicWandToolbarId,
		height: 80,
		width: 800,
		head: {
			height: 1,
		},
		on: {
			onBeforeHide() {
				return false;
			}
		},
		body: {
			height: 60,
			cols: [
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "Threshold",
							height: 22,
						},
						{
							view: "slider",
							id: "magicWandThreshold",
							min: 0,
							max: 255,
							value: wandTool.startThreshold,
							step: 1,
							on: {
								onChange(newValue) {
									wandTool.setThreshold(newValue);
								}
							}
						}
					]
				},
				{width: 10},
				{
					width: 120,
					rows: [
						{
							view: "label",
							label: "On click:",
							height: 22,
						},
						{
							view: "button",
							id: "magicWandStartNewMaskButton",
							label: "Start new mask",
							on: {
								onItemClick() {
									const isReplaceMode = true;
									$$("magicWandStartNewMaskButton").hide();
									$$("magicWandAddToCurrentMaskButton").show();
									wandTool.setReplaceMode(isReplaceMode);
								}
							}
						},
						{
							view: "button",
							id: "magicWandAddToCurrentMaskButton",
							label: "Add to current",
							hidden: true,
							on: {
								onItemClick() {
									const isReplaceMode = false;
									$$("magicWandStartNewMaskButton").show();
									$$("magicWandAddToCurrentMaskButton").hide();
									wandTool.setReplaceMode(isReplaceMode);
								}
							}
						},

					]
				},
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "Fill rule:",
							height: 22,
						},
						{
							view: "button",
							id: "magicWandContiguousButton",
							label: "Contiguous",
							on: {
								onItemClick() {
									const isFloodMode = true;
									$$("magicWandContiguousButton").hide();
									$$("magicWandAnywhereButton").show();
									wandTool.setFloodMode(isFloodMode);
								}
							}
						},
						{
							view: "button",
							id: "magicWandAnywhereButton",
							hidden: true,
							label: "Anywhere",
							on: {
								onItemClick() {
									const isFloodMode = false;
									$$("magicWandAnywhereButton").hide();
									$$("magicWandContiguousButton").show();
									wandTool.setFloodMode(isFloodMode);
								}
							}
						}
					]
				},
				{
					width: 120,
					rows: [
						{
							view: "label",
							label: "Use to:",
							height: 22,
						},
						{
							view: "button",
							id: "magicWandExpandSelectionButton",
							label: "Expand Selection",
							on: {
								onItemClick() {
									const isReduceMode = false;
									$$("magicWandExpandSelectionButton").hide();
									wandTool.setReduceMode(isReduceMode);
								}
							}
						},
						{
							view: "button",
							id: "magicWandReduceSelectionButton",
							label: "Reduce Selection",
							hidden: true,
							on: {
								onItemClick() {
									const isReduceMode = true;
									$$("magicWandReduceSelectionButton").hide();
									$$("magicWandExpandSelectionButton").show();
									wandTool.setReduceMode(isReduceMode);
								}
							}
						}
					]
				},
				{
					width: 75,
					view: "button",
					id: "magicWandApplyButton",
					label: "Apply",
					on: {
						onItemClick() {
							wandTool.applyChanges();
						}
					}
				},
				{
					width: 75,
					view: "button",
					id: "magicWandDoneButton",
					label: "Done",
					on: {
						onItemClick() {
							wandTool.finish();
							const magicWandToolbar = $$("annotationMagicWandToolbar");
							if (magicWandToolbar) {
								magicWandToolbar.destructor();
							}
						}
					}
				},
			]
		}
	};
	return config;
}

function closeMagicWandToolbar() {
	$$(annotationMagicWandToolbarId).destructor();
}

export default {
	getConfig,
	closeMagicWandToolbar
};
