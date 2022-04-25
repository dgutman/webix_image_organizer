/* eslint-disable no-use-before-define */
import iconsCollection from "../../../../models/iconsCollection";
import hotkeysCollection from "../../../../models/hotkeysCollection";

const groupsOfInputs = new Map();

export default class AdditionalInputsFactory {
	static create(name) {
		let input;
		switch (name) {
			case "badgevalue":
				input = new BadgeInput(name);
				break;
			case "badgecolor":
				input = new BadgeColorInput(name);
				break;
			case "icon":
				input = new IconInput(name);
				break;
			case "hotkey":
			default:
				input = new HotkeyInput(name);
				break;
		}
		if (!groupsOfInputs.has(name)) {
			groupsOfInputs.set(name, []);
		}
		const inputs = groupsOfInputs.get(name);
		inputs.push(input);
		return input.getConfig();
	}

	static getFilteredValues(collection, name) {
		const inputInstances = [...groupsOfInputs.get(name) || []];
		const existedValues = inputInstances
			.map((inputInstance) => {
				const input = webix.$$(inputInstance.id);
				return input && input.getValue && input.getValue();
			})
			.filter(val => val);
		return collection.data.serialize().filter(({id}) => !existedValues.includes(id));
	}

	static filterUniqueValues(val, old, name, collection) {
		if (val !== old) {
			const filteredIds = this.getFilteredValues(collection, name);
			const inputs = [...groupsOfInputs.get(name)]
				.map(inputInstance => webix.$$(inputInstance.id))
				.filter(input => input);

			inputs.forEach((input) => {
				let ids = [...filteredIds];
				const inputValue = input.getValue();
				const list = input.getList();
				if (inputValue) {
					ids.unshift(list.getItem(inputValue));
				}
				list.clearAll();
				list.parse(ids);
			});
		}
	}

	static clear(name) {
		if (name) {
			groupsOfInputs.delete(name);
		}
		else {
			groupsOfInputs.clear();
		}
	}
}

class AdditionalInput {
	constructor(name) {
		this._name = name;
		this._id = `${this.name}-${webix.uid()}`;
	}

	get name() {
		return this._name;
	}

	get id() {
		return this._id;
	}

	get defaultConfigValues() {
		return {
			name: this.name,
			id: this.id
		};
	}

	getConfig() {}
}

class BadgeInput extends AdditionalInput {
	getConfig() {
		return {
			view: "text",
			css: "text-field",
			placeholder: "Badge",
			gravity: 1,
			inputHeight: 36,
			...this.defaultConfigValues
		};
	}
}

class IconInput extends AdditionalInput {
	getConfig() {
		return {
			view: "combo",
			css: "select-field",
			invalidMessage: "Not unique",
			placeholder: "Icon",
			tooltip: obj => (obj.value ? `<div class='ellipsis-text'><i class='fas ${obj.value}'></i> ${obj.value}</div>` : ""),
			options: {
				data: AdditionalInputsFactory.getFilteredValues(iconsCollection, this.name),
				body: {
					tooltip: "#value#",
					template: obj => `<div class='ellipsis-text'><i class='fas ${obj.id}'></i> ${obj.value}</div>`
				}
			},
			on: {
				onChange: (val, old) => {
					AdditionalInputsFactory.filterUniqueValues(
						val,
						old,
						this.name,
						iconsCollection
					);
				}
			},
			gravity: 1,
			inputHeight: 36,
			...this.defaultConfigValues
		};
	}
}

class HotkeyInput extends AdditionalInput {
	getConfig() {
		return {
			view: "combo",
			css: "select-field",
			invalidMessage: "Not unique",
			options: AdditionalInputsFactory.getFilteredValues(hotkeysCollection, this.name),
			placeholder: "Hot-key",
			gravity: 1,
			inputHeight: 36,
			on: {
				onChange: (val, old) => {
					AdditionalInputsFactory.filterUniqueValues(
						val,
						old,
						this.name,
						hotkeysCollection
					);
				}
			},
			...this.defaultConfigValues
		};
	}
}

class BadgeColorInput extends AdditionalInput {
	getConfig() {
		return {
			view: "colorpicker",
			placeholder: "Badge color",
			value: "#FFFFFF",
			gravity: 1,
			inputHeight: 36,
			...this.defaultConfigValues
		};
	}
}
