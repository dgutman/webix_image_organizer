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
    return this.openSeaDragonViewer;
  }

  async setImage(image) {
    // const tiles = await ajax.getImageTiles(imagesModel.getImageID(image));
    const tileSource = await imageTilesModel.getTileSources(image);
    if (!this.openSeaDragonViewer) {
      debugger;
    }
    this.openSeaDragonViewer.removeAllTiles();
    this.openSeaDragonViewer.addNewTile(tileSource);
  }

  createViewer() {
    if (!this.openSeaDragonViewer) {
      const templateID = this.getTemplateID();
      const template = webix.$$(templateID);
      if (!template?.getNode) {
        debugger;
      }
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
      if (!template?.getNode) {
        debugger;
      }
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
}
