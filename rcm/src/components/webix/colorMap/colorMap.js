// TODO: make webix global
import { uid, $$ } from "webix";
import "../../../styles/colorMap.css";

export default class ColorMap {
  constructor() {
    this.colorListID = uid();
  }

  getUI() {
    return {
      view: "template",
      css: "color-map",
      scroll: false,
      id: this.colorListID,
      template: `<div>
        <div class="color-map_title">Color map</div>
        <ul class="color-map">
          <li class="color-map_item"><span class="color-map_item_circle" style="border-color: red;"></span> Vivastack</li>
          <li class="color-map_item"><span class="color-map_item_circle" style="border-color: orange;"></span> Vivablock</li>
          <li class="color-map_item"><span class="color-map_item_circle" style="border-color: blue;"></span> Macroscopic Image</li>
          <li class="color-map_item"><span class="color-map_item_circle" style="border-color: green;"></span> Conforcal Image</li>
        </ul>
      </div>`,
    };
  }

  /** @returns {webix.ui.template} */
  getList() {
    return $$(this.colorListID);
  }
}
