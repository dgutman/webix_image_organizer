// TODO: rewrite module to react
import { uid, $$ } from "webix";
import OpenSeaDragonViewer from "./osdViewer";
import imagesModel from "../../../models/imagesModel";
import imageTilesModel from "../../../models/imageTilesModel";
import "../../../styles/image.css";

const OSD_CONTAINER = "osd-container";
const NON_IMAGE_SELECTED_CLASS = "image-container__non-image-selected";

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
          <div class="${OSD_CONTAINER}"></div>
          <div class="${NON_IMAGE_SELECTED_CLASS} hidden">No image is selected</div>`,
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

  async setImage(image, isMacroscopic, useSourceOptions, maxFrame, isFrame) {
    const tilesOptions = image.yamlId ? imagesModel.getTilesOptions(image, isMacroscopic) : {};
    const imageID = image.yamlId ?? imagesModel.getImageID(image);
    // TODO: add tiles for framed image
    if (isFrame) {
      this.openSeaDragonViewer.removeAllTiles();
      const promises = []
      for (let i = 0; i < maxFrame; i++) {
        const tileSourcePromise = imageTilesModel.getTileSources(imageID, tilesOptions, useSourceOptions, i, true)
        promises.push(tileSourcePromise);
      }
      const tileSources = await Promise.all(promises);
      tileSources.forEach((t, index) => {
        const opacity = index === 0 ? 1 : 0;
        this.openSeaDragonViewer.addNewTile(t, index, opacity);
      })
    }
    else {
      const tileSource = await imageTilesModel.getTileSources(imageID, tilesOptions, useSourceOptions);
      tileSource.index = 0;
      this.openSeaDragonViewer.removeAllTiles();
      this.openSeaDragonViewer.addNewTile(tileSource);
    }
  }

  showFrame(frame) {
    this.openSeaDragonViewer.showTiledImage(frame);
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
      const osdNode = this.getNodeByClassName(OSD_CONTAINER);
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

  showNoImageSelected() {
    const osdNode = this.getNodeByClassName(OSD_CONTAINER);
    const nonImageSelectedNode = this.getNodeByClassName(NON_IMAGE_SELECTED_CLASS);
    if (osdNode && nonImageSelectedNode) {
      if (!osdNode.classList.contains("hidden")) {
        osdNode.classList.add("hidden");
      }
      if (nonImageSelectedNode.classList.contains("hidden")) {
        nonImageSelectedNode.classList.remove("hidden");
      }
    }
  }

  showOSD() {
    const osdNode = this.getNodeByClassName(OSD_CONTAINER);
    const nonImageSelectedNode = this.getNodeByClassName(NON_IMAGE_SELECTED_CLASS);
    if (osdNode && nonImageSelectedNode) {
      if (osdNode.classList.contains("hidden")) {
        osdNode.classList.remove("hidden");
      }
      if (!nonImageSelectedNode.classList.contains("hidden")) {
        nonImageSelectedNode.classList.add("hidden");
      }
    }
  }

  getNodeByClassName(className) {
    const templateID = this.getTemplateID();
    const template = $$(templateID);
    const templateNode = template.getNode();
    const node = templateNode?.querySelector(`.${className}`);
    return node;
  }
}
