// TODO: rewrite module to react
import { uid, $$ } from "webix";
import OpenSeaDragonViewer from "./osdViewer";
import imagesModel from "../../../models/imagesModel";
import imageTilesModel from "../../../models/imageTilesModel";

const OSD_CONTAINER = "osd-container";

export default class Image {
  constructor() {
    this.imageTemplateID = uid();
    this.openSeaDragonViewer = null;
  }

  getUI() {
    return {
      view: "template",
      id: this.imageTemplateID,
      css: "image-container",
      template: `<div id="overlay-rect"></div>
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
    return $$(this.imageTemplateID);
  }

  getTemplateID() {
    return this.imageTemplateID;
  }

  getOSDViewer() {
    return this.openSeaDragonViewer.$viewer();
  }

  async setImage(image, isMacroscopic, useSourceOptions, frame, isFrame) {
    const tilesOptions = image.yamlId ? imagesModel.getTilesOptions(image, isMacroscopic) : {};
    const imageID = image.yamlId ?? imagesModel.getImageID(image);
    const tileSource = isFrame
      ? await imageTilesModel.getTileSources(imageID, tilesOptions, useSourceOptions, frame, true)
      : await imageTilesModel.getTileSources(imageID, tilesOptions, useSourceOptions);
    tileSource.index = 0;
    this.openSeaDragonViewer.removeAllTiles();
    this.openSeaDragonViewer.addNewTile(tileSource);
  }

  createViewer() {
    if (!this.openSeaDragonViewer) {
      const templateID = this.getTemplateID();
      const template = $$(templateID);
      const node = template.getNode();

      this.openSeaDragonViewer = new OpenSeaDragonViewer(
        {
          element: node,
        }
      )
    }
    else {
      const templateID = this.getTemplateID();
      const template = $$(templateID);
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

  async addArea(overlayOptions, areaStyle, clearOverlaysFlag) {
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

    const overlayElement = document.createElement("div");
    overlayElement.className = "overlay-rect";
    overlayElement.style.borderColor = areaStyle.color ?? "black";
    overlayElement.style.borderStyle = areaStyle.borderStyle ?? "dashed";
    overlayElement.style.borderWidth = areaStyle.borderWidth ?? "2px";
    overlayElement.style.visibility = "visible";
    if (clearOverlaysFlag) {
      this.openSeaDragonViewer.clearOverlays();
    }
    this.openSeaDragonViewer.addOverlay(overlayElement, tiledRect)
  }
}
