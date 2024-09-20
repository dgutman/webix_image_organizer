import * as webix from "webix";
import OpenSeaDragonViewer from "./osdViewer";
import ajax from "../../../services/ajaxActions";
import imagesModel from "../../../models/imagesModel";
import imageTilesModel from "../../../models/imageTilesModel";

const OSD_CONTAINER = "osd-container";

export default class Image {
  constructor() {
    this.imageTemplateID = webix.uid();
    this.openSeaDragonViewer = null;
  }

  getUI() {
    return {
      view: "template",
      id: this.imageTemplateID,
      css: "image-container",
      template: `<div style="display:none" class="icons">
            <span webix_tooltip="home" class="icon home fas fa-home"></span>
            <span webix_tooltip="zoom in" class="icon zoomin fas fa-search-plus"></span>
            <span webix_tooltip="zoom out" class="icon zoomout fas fa-search-minus"></span>
            <span webix_tooltip="fullscreen" class="icon fullscreen fas fa-expand-arrows-alt"></span>
          </div>
          <div id="overlay-rect"></div>
          <div class="${OSD_CONTAINER}"></dvi>`,
      on: {
        onAfterRender: () => {
          this.createViewer();
        }
      },
      onClick: {
        home: () => {
          this.zoomHome();
        },
        zoomin: () => {
          this.zoomIn();
        },
        zoomout: () => {
          this.zoomOut();
        },
        fullscreen: () => {
          this.fullscreen();
        }
      }
    }
  }

  destructor() {
    this.openSeaDragonViewer?.destroy();
  }

  getTemplate() {
    return webix.$$(this.imageTemplateID);
  }

  getTemplateID() {
    return this.imageTemplateID;
  }

  getOSDViewer() {
    return this.openSeaDragonViewer.$viewer();
  }

  async setImage(image, isMacroscopic, useSourceOptions, frame, isFrame) {
    const tilesOptions = image.yamlId ? imagesModel.getTilesOptions(image, isMacroscopic) : {};
    const tileSource = isFrame
      ? await imageTilesModel.getTileSources(image, tilesOptions, useSourceOptions, frame, true)
      : await imageTilesModel.getTileSources(image, tilesOptions, useSourceOptions);
    tileSource.index = 0;
    this.openSeaDragonViewer.removeAllTiles();
    this.openSeaDragonViewer.addNewTile(tileSource);
  }

  createViewer() {
    if (!this.openSeaDragonViewer) {
      const templateID = this.getTemplateID();
      const template = webix.$$(templateID);
      const node = template.getNode();

      this.openSeaDragonViewer = new OpenSeaDragonViewer(
        {
          element: node,
        }
      )
    }
    else {
      const templateID = this.getTemplateID();
      const template = webix.$$(templateID);
      const templateNode = template.getNode();
      const osdNode = templateNode?.querySelector(`.${OSD_CONTAINER}`)
      this.openSeaDragonViewer.createViewer({element: osdNode}, osdNode);
    }
  }

  zoomHome() {
    this.openSeaDragonViewer.zoomHome();
  }

  zoomIn() {
    this.openSeaDragonViewer.zoomIn();
  }

  zoomOut() {
    this.openSeaDragonViewer.zoomOut();
  }

  fullscreen() {
    this.openSeaDragonViewer.setFullScreen();
  }

  async addArea(overlayOptions, color) {
    let tiledImage = this.openSeaDragonViewer.getTiledImage(0);
    if (!tiledImage) {
      return
    };
    const tiledRect = tiledImage.imageToViewportRectangle(
      overlayOptions.x,
      overlayOptions.y,
      overlayOptions.width,
      overlayOptions.height,
    );

    const overlayElement = document.getElementById("overlay-rect");
    overlayElement.style.borderColor = color ?? "red";
    this.openSeaDragonViewer.clearOverlays();
    this.openSeaDragonViewer.addOverlay(overlayElement, tiledRect)
  }
}
