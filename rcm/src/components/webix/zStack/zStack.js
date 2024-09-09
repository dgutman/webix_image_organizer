import * as webix from "webix";

export default class ZStack {
  constructor() {
    this.zStackID = webix.uid();
  }

  getUI() {
    return {
      view: "slider",
      id: this.zStackID,
      css: "z-stack",
      label: "Z-Stack: ",
      min: 0,
      max: 1,
    }
  }

  getSlider() {
    return webix.$$(this.zStackID);
  }
}
