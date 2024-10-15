import { uid, $$, template } from "webix";

export default class ZStack {
  constructor() {
    this.zStackID = uid();
  }

  getUI() {
    return {
      view: "slider",
      id: this.zStackID,
      css: "z-stack",
      label: "Z-Stack: ",
      min: 0,
      max: 19,
      disabled: true,
      title: template("#value#"),
      height: 0,
      moveTitle: false,
    }
  }

  /** @returns {webix.ui.slider} */
  getSlider() {
    return $$(this.zStackID);
  }
}
