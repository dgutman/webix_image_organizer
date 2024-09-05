import * as webix from "webix";

export default class ColorMap {
  constructor() {
    this.colorListID = webix.uid();
  }

  getUI() {
    return {
      view: "list",
      css: "color-map",
      scroll: false,
      id: this.colorListID,
      // TODO: add template
      template: ""
    };
  }

  getList() {
    return webix.$$(this.colorListID);
  }
}
