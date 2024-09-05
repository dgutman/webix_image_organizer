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
          ? obj.webPoint.x.toFixed(2)
          : "Nan";
        const objWebPointY = typeof obj?.webPoint?.y === "number"
          ? obj.webPoint.y.toFixed(2)
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
}
