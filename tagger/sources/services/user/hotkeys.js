import hotkeysJS from "hotkeys-js";

class HotkeysService {
	constructor(
		dataview,
		dataviewStore,
		tagSelect,
		valueSelect,
		imageService,
		dataviewService,
		submitButton
	) {
		this.dataview = dataview;
		this.dataviewStore = dataviewStore;
		this.tagSelect = tagSelect;
		this.valueSelect = valueSelect;
		this.imageService = imageService;
		this.dataviewService = dataviewService;
		this.submitButton = submitButton;
		this.image = null;
		this.imageNode = null;
		this.init();
	}

	init() {
		webix.UIManager.removeHotKey("up");
		webix.UIManager.removeHotKey("down");
		webix.UIManager.removeHotKey("right");
		webix.UIManager.removeHotKey("left");

		const dataviewNode = this.dataview.getNode();
		this.mouseOutEventId = webix.event(dataviewNode, "mouseout", (ev) => {
			// to avoid mouseout event in child nodes
			if (!this.imageNode || this.imageNode.contains(ev.relatedTarget)) {
				return;
			}
			this.unselectItem();
		});

		this.mouseMoveEventId = webix.event(dataviewNode, "mouseover", (ev) => {
			if (this.imageNode) return;

			const target = ev.target.closest(".dataview-item");
			if (target && target !== this.imageNode) {
				const id = target
					.closest(".webix_dataview_item")
					.getAttribute("webix_l_id");
				this.image = this.dataviewStore.getItemById(id);
				this.imageNode = target;
				this.markSelectedImage();
			}
		});

		this.dataview.attachEvent("onItemRender", (obj) => {
			if (this.image && this.image.id === obj.id && this.imageNode) {
				webix.delay(() => {
					const itemNode = this.dataview.getItemNode(obj.id);
					if (itemNode) {
						this.imageNode = itemNode.querySelector(".dataview-item");
						this.markSelectedImage();
					}
				}, 100);
			}
		});
	}

	unselectItem() {
		if (this.imageNode) this.imageNode.classList.remove("selected");
		this.image = null;
		this.imageNode = null;
	}

	markSelectedImage() {
		const pager = this.dataview.getPager();
		if (this.imageNode && pager.data.size > 1 && !this.imageNode.classList.contains("selected")) {
			this.imageNode.classList.add("selected");
		}
	}

	attachNavButtons() {
		hotkeysJS(
			"up, down, left, right",
			{keyup: true, scope: this.currentScope},
			(event, handler) => {
				if (event.type === "keydown") {
					this.handleNavigation(handler.key);
				}
			}
		);
		hotkeysJS("enter", {keyup: true, scope: this.currentScope}, (event) => {
			if (event.type === "keydown") {
				this.handleEnter();
			}
		});
	}

	handleEnter() {
		if (this.submitButton) {
			this.submitButton.callEvent("onItemClick");
			const eventId = this.dataview.attachEvent("onAfterLoad", () => {
				if (this.dataview.count()) {
					this.handleNavigation("right");
				}
				this.dataview.detachEvent(eventId);
			});
		}
	}

	handleNavigation(button) {
		this.dataview.unselectAll();
		const pager = this.dataview.getPager();
		const nextPage = Math.min(pager.data.page + 1, pager.data.limit - 1);
		const prevPage = Math.max(pager.data.page - 1, 0);

		const {_dy, _dx} = this.dataviewService.getVisibleRange();
		const dataRange = this.dataview.data.getRange();
		const dataMatrix = dataRange.reduce((rows, key, index) => {
			if (index % _dx === 0) {
				rows.push([key]);
			}
			else {
				rows[rows.length - 1].push(key);
			}
			return rows;
		}, []);
		let itemToSelect = this.image && this.dataview.getItemNode(this.image.id) ? this.image : null;
		this.unselectItem();

		if (itemToSelect) {
			const currentItemRow = Math.max(
				Math.floor(dataRange.findIndex(item => item.id === itemToSelect.id) / _dx),
				0
			);
			const currentItemCol = dataMatrix[currentItemRow].findIndex(
				item => item.id === itemToSelect.id
			);

			switch (button) {
				case "up": {
					const itemToSelectRow =	currentItemRow > 0 ? currentItemRow - 1 : _dy - 1;
					itemToSelect =
						(dataMatrix[itemToSelectRow] && dataMatrix[itemToSelectRow][currentItemCol]) ||
						itemToSelect;
					break;
				}
				case "right": {
					if (itemToSelect.id ===	dataRange[dataRange.length - 1].id && nextPage !== pager.data.page) {
						pager.select(nextPage);
						const areItemsLoaded = this.dataview.data.getRange().every(item => item);
						if (areItemsLoaded) {
							this.handleNavigation(button);
						}
						else {
							const eventId = this.dataview.attachEvent("onAfterLoad", () => {
								this.handleNavigation(button);
								this.dataview.detachEvent(eventId);
							});
						}
						return;
					}

					itemToSelect =
						(dataMatrix[currentItemRow] && dataMatrix[currentItemRow][currentItemCol + 1]) ||
						(dataMatrix[currentItemRow + 1] && dataMatrix[currentItemRow + 1][0]) ||
						itemToSelect;
					break;
				}
				case "down": {
					const itemToSelectRow =	currentItemRow < _dy - 1 ? currentItemRow + 1 : 0;
					itemToSelect =
						(dataMatrix[itemToSelectRow] && dataMatrix[itemToSelectRow][currentItemCol]) ||
						itemToSelect;
					break;
				}
				case "left": {
					if (itemToSelect.id === dataRange[0].id && prevPage !== pager.data.page) {
						pager.select(prevPage);
						const areItemsLoaded = this.dataview.data
							.getRange()
							.every(item => item);
						if (areItemsLoaded) {
							this.handleNavigation(button);
						}
						else {
							const eventId = this.dataview.attachEvent("onAfterLoad", () => {
								webix.UIManager.setFocus(this.dataview);
								this.handleNavigation(button);
								this.dataview.detachEvent(eventId);
							});
						}
						return;
					}

					itemToSelect =
						(dataMatrix[currentItemRow] && dataMatrix[currentItemRow][currentItemCol - 1]) ||
						(dataMatrix[currentItemRow - 1] && dataMatrix[currentItemRow - 1][dataMatrix[currentItemRow - 1].length - 1]) ||
						itemToSelect;
					break;
				}
				default:
					break;
			}
		}
		else {
			itemToSelect = button === "left" ? dataRange.pop() : dataRange[0];
		}

		this.image = itemToSelect;
		const itemNode = this.dataview.getItemNode(itemToSelect.id);
		this.imageNode = itemNode.querySelector(".dataview-item");
		this.markSelectedImage();
	}

	selectNewScope(taskName, hotkeyObject) {
		this.removeCurrentScope();
		hotkeysJS.setScope(taskName);
		this.currentScope = taskName;
		this.hotkeysObj = hotkeyObject;

		const hotkeys = Object.keys(hotkeyObject);
		hotkeysJS(hotkeys.join(", "),
			{keyup: true, scope: this.currentScope},
			(event, handler) => {
				if (event.type === "keyup") {
					this.handleHotkeyPress(handler.key);
				}
			});
		this.attachNavButtons();
	}

	removeCurrentScope() {
		if (this.currentScope) {
			hotkeysJS.deleteScope(this.currentScope);
		}
	}

	handleHotkeyPress(key) {
		const tagList = this.tagSelect.getList();
		const [tagName, valueName] = this.hotkeysObj[key];

		const currentTag = tagList.find(tag => tag.name === tagName, true);
		const currentValue = currentTag.values.find(
			value => value.name === valueName,
			true
		);

		if (currentValue) {
			if (this.image) {
				this.imageService.updateImageByHotkey(key, this.image, currentTag, currentValue);
			}

			// to avoid double changing of value in valueSelect
			this.tagSelect.blockEvent();
			this.tagSelect.setValue(currentTag.id);
			this.tagSelect.unblockEvent();
			this.tagSelect.callEvent("onChange", [currentTag.id, null, currentValue]);
		}
		else {
			this.tagSelect.setValue(currentTag.id);
		}
	}
}

class HotkeysFactory {
	constructor() {
		this.hotKeysService = null;
	}

	createService(...args) {
		const focusedViews = ["combo", "richselect"];
		this.removeOldService();
		this.focusEventId = webix.attachEvent("onFocusChange", (currView) => {
			if (currView && focusedViews.includes(currView.config.view)) {
				const hideEventId = currView.getPopup().attachEvent("onHide", () => {
					webix.UIManager.setFocus(args[0]);
					currView.getPopup().hide();

					currView.getPopup().detachEvent(hideEventId);
					currView.refresh(); // to fix bug with hotkeys navigation
				});
				hotkeysJS.setScope("$webix_scope");
			}
			else if (this.hotKeysService && this.hotKeysService.currentScope) {
				hotkeysJS.setScope(this.hotKeysService.currentScope);
			}
		});
		this.hotKeysService = new HotkeysService(...args);

		return this.hotKeysService;
	}

	removeOldService() {
		if (this.hotKeysService) {
			// remove scope with old hotkeys to detach old keyPress events
			this.hotKeysService.removeCurrentScope();
			this.hotKeysService = null;
		}
		if (this.focusEventId) {
			webix.detachEvent(this.focusEventId);
		}
	}
}

const factoryInstance = new HotkeysFactory();

export default factoryInstance;
