export default class AnnotationTool {
	constructor(paperScope, toolControl) {
		this._paperScope = paperScope;
		this._toolControl = toolControl;
		this._active = false;
		this._items = [];
		this._webixEvents = [];
		this._item = null;
		const self = this;

		this.project = {
			getZoom: () => paperScope.view.getZoom(),
			toolLayer: paperScope.project.layers.toolLayer || paperScope.project.activeLayer,
			paperScope,
			overlay: paperScope.overlay
		};

		this.extensions = {
			onActivate: () => {},
			onDeactivate: () => {}
		};
		this.tool = new paperScope.Tool();
		this.tool._toolObject = this;
		this.tool.extensions = {
			onKeyUp: () => {},
			onKeyDown: () => {}
		};

		let shiftPressed;
		this.tool.onKeyDown = function (ev) {
			if (!shiftPressed && ev.key === "shift") {
				shiftPressed = true;
				self.onDeactivate();
			}
			this.extensions.onKeyDown(ev);
		};
		this.tool.onKeyUp = function (ev) {
			if (ev.key === "shift") {
				shiftPressed = false;
				self.onActivate();
			}
			this.extensions.onKeyUp(ev);
		};
		this.listeners = {};
		if (toolControl) {
			this.setToolbarControl(toolControl);
		}
		this.attachEvents();
	}

	attachEvents() {
		const clickEvent = this._toolControl.attachEvent("onItemClick", (/* ev */) => {
			this.createItem();
			this.activate();
			this.tool.activate();
		});
		this._webixEvents.push(clickEvent);
	}

	detachEvents() {
		this._webixEvents.forEach((event) => {
			this._toolControl.detachEvent(event);
		});
	}

	createItem() {
		const props = this._paperScope.project.activeLayer.defaultStyle;
		const clonedProperties = {
			fillColor: new paper.Color(props.fillColor),
			strokeColor: new paper.Color(props.strokeColor),
			rescale: webix.copy({}, props.rescale),
			fillOpacity: props.fillOpacity,
			strokeOpacity: props.strokeOpacity,
			strokeWidth: props.strokeWidth,
		};
		const style = new paper.Style(clonedProperties);
		const geoJSON = {
			type: "Feature",
			geometry: null,
			properties: style,
		};
		const item = paper.Item.fromGeoJSON(geoJSON);
		this._paperScope.project.activeLayer.addChild(item);
		item.select();
		return item;
	}

	activate() {
		if (this._active) return;
		this._active = true;
		const previousTool = this.project.paperScope.getActiveTool();
		this.getSelectedItems();
		if (previousTool && previousTool !== this) {
			previousTool.deactivate(true);
		}
		// TODO: rewrite this method
		// this.toolbarControl.activate();
		this.onActivate();
		this.broadcast("activated");
	}

	deactivate(finishToolAction) {
		if (!this._active) return;
		this._active = false;
		// TODO: rewrite this method
		// this.toolbarControl.deactivate();

		this.onDeactivate(finishToolAction);
		this.broadcast("deactivated", {target: this});
	}

	getToolbarControl() {
		return this.toolbarControl;
	}

	setToolbarControl(toolbarControl) {
		this.toolbarControl = toolbarControl;
		return this.toolbarControl;
	}

	refreshItems() {
		return this.getSelectedItems();
	}

	getSelectedItems() {
		this._items = this.project.paperScope.findSelectedItems();
		this._itemToCreate = this.project.paperScope.findSelectedNewItem();
	}

	selectionChanged() {
		this.getSelectedItems();
		this.onSelectionChanged();
	}

	onSelectionChanged() {}

	get items() {
		return this._items;
	}

	get item() {
		return this._items.length === 1 ? this._items[0] : null;
	}

	get itemToCreate() {
		return this._itemToCreate;
	}

	isActive() {
		return this._active;
	}

	onActivate() {
		this.captureUserInput(true);
		// TODO: write onMouseWheel from this.tool.onMouseWheel
		this.project.overlay.addEventListener("wheel", this.onMouseWheel);
		this.project.toolLayer.bringToFront();
		this.extensions.onActivate();
	}

	onDeactivate(shouldFinish = false) {
		this.captureUserInput(false);
		this.project.overlay.removeEventListener("wheel", this.tool.onMouseWheel);
		this.project.toolLayer.sendToBack();
		this.extensions.onDeactivate(shouldFinish);
	}

	addEventListener(eventType, callback) {
		this.listeners[eventType] = this.listeners[eventType] || [];
		this.listeners[eventType].push(callback);
	}

	broadcast(eventType, ...data) {
		const listeners = this.listeners[eventType];
		listeners?.forEach((l) => {
			l(...data);
		});
	}

	captureUserInput(capture = true) {
		this.project.overlay.setOSDMouseNavEnabled(!capture);
	}
}
