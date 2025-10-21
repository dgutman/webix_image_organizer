import { uid, $$ } from "webix";
import "../../../styles/mouseCoords.css";

export default class MouseCoords {
  constructor(mouseTracker) {
    this._mouseTracker = mouseTracker;
    this._mouseCoordsTemplateID = uid();
  }

  getUI() {
    return {
      view: "template",
      id: this._mouseCoordsTemplateID,
      template: (obj) => {
        const objWebPointX = typeof obj?.webPoint?.x === "number"
          ? obj.webPoint.x.toFixed(2)
          : "Nan";
        const objWebPointY = typeof obj?.webPoint?.y === "number"
          ? obj.webPoint.y.toFixed(2)
          : "Nan";
        const imagePointX = typeof obj?.imagePoint?.x === "number"
          ? obj.imagePoint.x.toFixed(2)
          : "Nan";
        const imagePointY = typeof obj?.imagePoint?.y === "number"
          ? obj.imagePoint.y.toFixed(2)
          : "Nan";
        const viewportPointX = typeof obj?.viewportPoint?.x === "number"
          ? obj.viewportPoint.x.toFixed(2)
          : "Nan";
        const viewportPointY = typeof obj?.viewportPoint?.y === "number"
          ? obj.viewportPoint.y.toFixed(2)
          : "Nan";
        return `<div class=mouse-coords-container>
          <div class="mouse-coords-container_item"><span>Web Coords: ${objWebPointX}, ${objWebPointY}</span></div>
          <div class="mouse-coords-container_item"><span>Image Coords: ${imagePointX}, ${imagePointY}</span></div>
          <!--<div class="mouse-coords-container_item"><span>Viewport Coords: ${viewportPointX}, ${viewportPointY}</span></div>-->
        </div>`;
      }
    };
  }

  getMouseCoordsTemplateID() {
    return this._mouseCoordsTemplateID;
  }

  /** @return {webix.ui.template} */
  getMouseCoordsTemplate() {
    const template = $$(this.getMouseCoordsTemplateID());
    return template
  }

  setMouseCoords(mouseCoords) {
    const template = this.getMouseCoordsTemplate();
    template.parse(mouseCoords);
  }
}
