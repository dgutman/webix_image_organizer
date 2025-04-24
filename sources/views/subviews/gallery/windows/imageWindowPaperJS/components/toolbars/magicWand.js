import { view } from "paper/dist/paper-core";

function getConfig() {
	const config = {
		view: "popup",
		height: 80,
		width: 700,
		body: {
			height: 60,
			cols: [
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "Threshold",
						},
						{
							view: "slider",
							id: "magicWandThreshold",
							min: 0,
							max: 255,
							value: 0,
							step: 1,
							on: {
								onChange(newValue) {
									const magicWand = $$("magicWand");
									if (magicWand) {
										magicWand.setValue(newValue);
									}
								}
							}
						}
					]
				},
				{width: 10},
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "On click:",
						},
						{
							view: "button",
							id: "magicWandStartNewMaskButton",
							label: "Start new mask",
							on: {
								onItemClick() {
									const magicWand = $$("magicWand");
									if (magicWand) {
										magicWand.setValue(0);
									}
								}
							}
						}
					]
				},
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "Fill rule:",
						},
						{
							view: "button",
							id: "magicWandContiguousButton",
							label: "Contiguous",
							on: {
								onItemClick() {
									const magicWand = $$("magicWand");
									if (magicWand) {
										magicWand.setValue(0);
									}
								}
							}
						}
					]
				},
				{
					width: 100,
					rows: [
						{
							view: "label",
							label: "Use to:",
						},
						{
							view: "button",
							id: "magicWandExpandSelectionButton",
							label: "ExpandSelection",
							on: {
								onItemClick() {
									const magicWand = $$("magicWand");
									if (magicWand) {
										magicWand.setValue(0);
									}
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
							const magicWand = $$("magicWand");
							if (magicWand) {
								magicWand.setValue(0);
							}
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
							const magicWand = $$("magicWand");
							if (magicWand) {
								magicWand.setValue(0);
							}
						}
					}
				},
			]
		}
	};
	return config;
}

export default {
	getConfig
};
