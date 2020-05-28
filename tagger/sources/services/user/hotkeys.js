import hotkeysJS from "hotkeys-js";

class HotkeysService {
	constructor(dataview, dataviewStore, tagSelect, valueSelect, imageService) {
		this.dataview = dataview;
		this.dataviewStore = dataviewStore;
		this.tagSelect = tagSelect;
		this.valueSelect = valueSelect;
		this.imageService = imageService;
		this.image = null;
		this.imageNode = null;
		this.init();
	}

	init() {
		const dataviewNode = this.dataview.getNode();
		this.mouseOutEventId = webix.event(dataviewNode, "mouseout", (ev) => {
			// to avoid mouseout event in child nodes
			if (!this.imageNode || this.imageNode.contains(ev.relatedTarget)) return;
			this.image = null;
			this.imageNode = null;
		});

		this.mouseMoveEventId = webix.event(dataviewNode, "mouseover", (ev) => {
			if (this.imageNode) return;

			const target = ev.target.closest(".dataview-item");
			if (target && target !== this.imageNode) {
				const id = target.closest(".webix_dataview_item").getAttribute("webix_l_id");
				this.image = this.dataviewStore.getItemById(id);
				this.imageNode = target;
			}
		});
	}

	selectNewScope(taskName, hotkeyObject) {
		this.removeCurrentScope();
		hotkeysJS.setScope(taskName);
		this.currentScope = taskName;
		this.hotkeysObj = hotkeyObject;

		const hotkeys = Object.keys(hotkeyObject);
		hotkeysJS(hotkeys.join(", "), {keyup: true, scope: this.currentScope}, (event, handler) => {
			if (event.type === "keyup") {
				this.handleHotkeyPress(handler.key);
			}
		});
	}

	removeCurrentScope() {
		if (this.currentScope) {
			hotkeysJS.deleteScope(this.currentScope);
		}
	}

	handleHotkeyPress(key) {
		const tagList = this.tagSelect.getList();
		const currentKey = this.hotkeysObj[key];

		const currentTag = tagList.find(tag => tag.name === currentKey[0], true);
		const currentValue = currentTag.values.find(value => value.name === currentKey[1], true);

		if (this.image) {
			this.imageService.updateImageByHotkey(key, this.image, currentTag, currentValue);
		}

		// to avoid double changing of value in valueSelect
		this.tagSelect.blockEvent();
		this.tagSelect.setValue(currentTag.id);
		this.tagSelect.unblockEvent();
		this.tagSelect.callEvent("onChange", [currentTag.id, null, currentValue]);
	}
}

class HotkeysFactory {
	constructor() {
		this.hotKeysService = null;
	}

	createService(dataview, dataviewStore, tagSelect, valueSelect, imageService) {
		this.removeOldService();

		this.hotKeysService = new HotkeysService(
			dataview,
			dataviewStore,
			tagSelect,
			valueSelect,
			imageService
		);

		return this.hotKeysService;
	}

	removeOldService() {
		if (this.hotKeysService) {
			// remove scope with old hotkeys to detach old keyPress events
			this.hotKeysService.removeCurrentScope();
			this.hotKeysService = null;
		}
	}
}

const factoryInstance = new HotkeysFactory();

export default factoryInstance;
