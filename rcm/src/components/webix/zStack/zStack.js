import { uid, $$, template } from "webix";
import localStorageService from "../../../services/localStorage";
import "../../../styles/zStack.css";

export default class ZStack {
  constructor() {
    this.zStackID = uid();
    this.playID = uid();
    this.pauseID = uid();
    this.stopID = uid();
    this.speedInputID = uid();
    this.speedUpButtonID = uid();
    this.speedDownButtonID = uid();
    this.rootId = uid();
    this.intervalId = null;
  }

  getUI() {
    return {
      height: 0,
      id: this.rootId,
      rows: [
        {},
        {
          cols: [
            {
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
            },
            {
              view: "icon",
              icon: "fas fa-play",
              css: "z-stack-play-control",
              id: this.playID,
              click: () => {
                this.clickPlayButtonHandler()
              },
            },
            {
              view: "icon",
              icon: "fas fa-pause",
              css: "z-stack-play-control",
              id: this.pauseID,
              hidden: true,
              click: () => {
                this.clickPauseButtonHandler()
              },
            },
            {
              view: "icon",
              icon: "fas fa-stop",
              css: "z-stack-stop-control",
              id: this.stopID,
              hidden: true,
              click: () => {
                this.clickStopButtonHandler()
              },
            },
            {
              view: "text",
              id: this.speedInputID,
              css: "z-stack-speed-input",
              value: localStorageService.getZStackSpeed() ?? "10",
              height: 38,
              label: "Speed",
              labelAlign: "right",
              tooltip: "Frames per second",
              width: 120,
              labelWidth: 50,
              on: {
                onChange: (value) => {
                  localStorageService.setZStackSpeed(value);
                }
              }
            },
            {
              height: 38,
              rows: [
                {
                  view: "button",
                  id: this.speedUpButtonID,
                  type: "icon",
                  width: 18,
                  height: 18,
                  icon: "fas fa-caret-up",
                  css: "z-stack-speed-button",
                  click: () => {
                    const speedInput = this.getSpeedInput();
                    const speedValue = Number(speedInput.getValue());
                    const n = this.scaleToTen(speedValue);
                    speedInput.setValue(speedValue + n);
                  }
                },
                {
                  view: "button",
                  id: this.speedDownButtonID,
                  type: "icon",
                  width: 18,
                  height: 18,
                  icon: "fas fa-caret-down",
                  css: "z-stack-speed-button",
                  click: () => {
                    const speedInput = this.getSpeedInput();
                    const speedValue = Number(speedInput.getValue());
                    if (speedValue === 1) {
                      return;
                    }
                    const n = this.scaleToTen(speedValue);
                    if (n === speedValue) {
                      speedInput.setValue(speedValue - n / 10);
                    }
                    else {
                      speedInput.setValue(speedValue - n);
                    }
                  }
                },
              ]
            }
          ]
        },
        {},
      ],
    }
  }

  clickPlayButtonHandler() {
    const speedInput = this.getSpeedInput();
    const speedValue = Number(speedInput.getValue());
    if (this.intervalId) return
    this.intervalId = setInterval(() => {
      const slider = this.getSlider();
      const max = slider.config.max;
      const currentSliderValue = Number(slider.getValue());
      slider.setValue(currentSliderValue + 1);
      slider.refresh();
      if (slider.getValue() === max) {
        this.clickPauseButtonHandler();
        this.getPlayControl().hide();
      }
    }, 1000 / speedValue)
    const playButton = this.getPlayControl();
    const pauseButton = this.getPauseControl();
    const stopButton = this.getStopControl();
    playButton.hide();
    pauseButton.show();
    stopButton.show();
  }

  clickPauseButtonHandler () {
    clearInterval(this.intervalId);
    this.intervalId = null;
    const playButton = this.getPlayControl();
    const pauseButton = this.getPauseControl();
    const stopButton = this.getStopControl();
    playButton.show();
    pauseButton.hide();
    stopButton.show();
  }

  clickStopButtonHandler () {
    clearInterval(this.intervalId);
    this.intervalId = null;
    const slider = this.getSlider();
    slider.setValue(0);
    const playButton = this.getPlayControl();
    const pauseButton = this.getPauseControl();
    const stopButton = this.getStopControl();
    playButton.show();
    pauseButton.hide();
    stopButton.hide();
  }

  getSpeedInput() {
    return $$(this.speedInputID);
  }

  /** @returns {webix.ui.slider} */
  getSlider() {
    return $$(this.zStackID);
  }

  getPlayControl() {
    return $$(this.playID);
  }
  
  getPauseControl() {
    return $$(this.pauseID);
  }

  getStopControl() {
    return $$(this.stopID);
  }

  scaleToTen(value) {
    if (value === 0) {
      return 1;
    }
    const n = Math.floor(Math.log10(Math.abs(value)))
    return 10 ** n;
  }

  showControls() {
    $$(this.rootId).show();
  }

  hideControls() {
    $$(this.rootId).hide();
  }
}
