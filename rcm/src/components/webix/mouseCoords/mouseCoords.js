import * as webix from "webix";

export default class MouseCoords {
  constructor(mouseTracker) {
    this._mouseTracker = mouseTracker;
    this._mouseCoordsTemplateID = webix.uid();
  }

  getUI() {
    return {
      view: "template",
      css: "mouse-coords",
      id: this._mouseCoordsTemplateID,
      template: (obj) => {
        const objWebPointX = typeof obj?.webPoint?.x === "number"
          ? obj.imagePoint.x.toFixed(2)
          : "Nan";
        const objWebPointY = typeof obj?.webPoint?.y === "number"
          ? obj.imagePoint.y.toFixed(2)
          : "Nan";
        return `<div class=mouse-coords-container>
          <div>
            <span class="mouse-coords-web">Mouse Coords: ${objWebPointX}, ${objWebPointY}</span>
          </div>
        </div>`;
      }
    };
  }

  getMouseCoordsTemplateID() {
    return this._mouseCoordsTemplateID;
  }

  /** @return {webix.ui.template} */
  getMouseCoordsTemplate() {
    const template = webix.$$(this.getMouseCoordsTemplateID());
    return template
  }

  setMouseCoords(mouseCoords) {
    const template = this.getMouseCoordsTemplate();
    template.parse(mouseCoords);
  }
}
