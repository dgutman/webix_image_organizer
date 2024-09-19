import OpenSeaDragon from "openseadragon";
import * as webix from "webix";

export default class OpenSeaDragonViewer {
  /**
   * 
   * @param {OpenSeaDragon.Options} opts
   */
  constructor(opts) {
    this.defaultOptions = {
      // TODO: describe default options
    }
    const options = {...this.defaultOptions, ...opts}
    this.node = opts.element;
    this._viewer = new OpenSeaDragon.Viewer(options);
    this.addEventHandler();
  }

  updateZoom() {
    const viewer = this.$viewer();
    const zoom = viewer.viewport.getZoom(true);
    const imageZoom = viewer.viewport.viewportToImageZoom(zoom);
    this.app.callEvent("app:update-viewer-zoom", [zoom, imageZoom]);
  }
  
  addEventHandler() {
    const viewer = this.$viewer();
    const updateZoom = () => {
      const zoom = viewer.viewport.getZoom(true);
      const tiledImage = viewer.world.getItemAt(0);
      if (tiledImage) {
        const imageZoom = tiledImage?.viewportToImageZoom(zoom);
        this.app.callEvent("app:update-viewer-zoom", [zoom, imageZoom]);
      }
    };
    viewer.addHandler("open", () => {
      const tracker = new OpenSeaDragon.MouseTracker({
        element: viewer.container,
        moveHandler: (event) => {
          const webPoint = event.position;
          const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
          const tiledImage = viewer.world.getItemAt(0);
          if (tiledImage) {
            const imagePoint = tiledImage.viewportToImageCoordinates(viewportPoint);
            updateZoom();
            this.app.callEvent("app:update-viewer-coordinates", [webPoint, viewportPoint, imagePoint]);
          }
        }
      });
      tracker.setTracking(true);
      viewer.addHandler("animation", updateZoom);
    });
  }
  
  zoomHome() {
    const viewer = this.$viewer();
    this.zoomTo(viewer.viewport.getHomeZoom());
    viewer.viewport.panTo(viewer.viewport.getCenter());
  }
  
  zoomIn() {
    const viewer = this.$viewer();
    const zoomValue = viewer.viewport.getZoom();
    if (zoomValue * 2 < viewer.viewport.getMaxZoom()) {
      this.zoomTo(zoomValue * 2);
    }
    else {
      this.zoomTo(viewer.viewport.getMaxZoom());
    }
  }
  
  zoomOut() {
    const viewer = this.$viewer();
    let zoomValue = viewer.viewport.getZoom();
    if (zoomValue / 2 > viewer.viewport.getMinZoom()) {
      this.zoomTo(zoomValue / 2);
    }
    else {
      this.zoomTo(viewer.viewport.getMinZoom());
    }
  }
  
  zoomTo(value) {
    this.$viewer().viewport.zoomTo(value);
  }

  setFullScreen() {
    const isFullScreen = this.$viewer().isFullScreen();
    this.$viewer().setFullscreen(!isFullScreen);
  }
  
  reset() {
    this.getRoot().callEvent("resetMainFrameBtnClick");
  }
  
  addGroup() {
    this.getRoot().callEvent("addGroupBtnClick");
  }
  
  uploadGroups() {
    this.getRoot().callEvent("uploadGroupBtnClick");
  }
  
  replaceTile(tileSource, index = 0) {
    const viewer = this.$viewer();
    const tileToReplace = viewer.world.getItemAt(index);
  
    viewer.addTiledImage({
      tileSource,
      opacity: 1,
      index,
      success() {
        viewer.world.removeItem(tileToReplace);
      }
    });
  }
  
  addNewTile(tileSource) {
    const viewer = this.$viewer();
    viewer.addTiledImage({
      tileSource
    });
  }
  
  flipTiles(firstIndex, secondIndex) {
    const tileIndexes = [firstIndex, secondIndex];
    const viewer = this.$viewer();
    const [firstItem, secondItem] = tileIndexes.map((tileIndex) => {
      const tile = viewer.world.getItemAt(tileIndex);
      if (tileIndex === 0) {
        const anotherTileIndex = tileIndexes.find(index => index !== tileIndex);
        const anotherTile = viewer.world.getItemAt(anotherTileIndex);
  
        tile.setCompositeOperation("difference");
        anotherTile.setCompositeOperation();
      }
      return tile;
    });
  
    viewer.world.setItemIndex(firstItem, secondIndex);
    viewer.world.setItemIndex(secondItem, firstIndex);
  }
  
  removeAllTiles() {
    const viewer = this.$viewer();
    if (viewer) {
      viewer.world.removeAll();
    }
  }
  
  setTileOpacity(index, opacity = 1) {
    const viewer = this.$viewer();
    viewer.world.getItemAt(index).setOpacity(opacity);
  }
  
  getViewerTemplate() {
    return webix.$$(this._osdViewerTemplateID);
  }
  
  getBounds() {
    const viewer = this.$viewer();
    return viewer?.viewport.getBounds();
  }
  
  setBounds(bounds) {
    const viewer = this.$viewer();
    viewer.viewport.fitBounds(bounds);
  }

  /** @return {OpenSeaDragonViewer} */
  $viewer() {
    return this._viewer;
  }

  createViewer(opts = {}, node = this.node) {
    const options = {...this.defaultOptions, ...opts}
		this._viewer = new OpenSeaDragon.Viewer({
      options,
			element: node,
		});

		const viewer = this.$viewer();

		return new Promise((resolve, reject) => {
			viewer.addOnceHandler("open", () => {
				resolve();
			});
			viewer.addOnceHandler("open-failed", () => {
				reject();
			});
		});
	}

  destroy() {
    const viewer = this.$viewer();
    viewer.destroy();
  }
}