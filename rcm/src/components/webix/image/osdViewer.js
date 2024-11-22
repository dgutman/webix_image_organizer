import openseadragon from "openseadragon";
import { $$ } from "webix";

export default class OpenSeaDragonViewer {
  /**
   * 
   * @param {openseadragon.Options} opts
   */
  constructor(opts) {
    this.defaultOptions = {
      // TODO: describe default options
    }
    const options = {...this.defaultOptions, ...opts}
    this.node = opts.element;
    this._viewer = new openseadragon.Viewer(options);
    this.addEventHandler();
  }

  updateZoom() {
    const viewer = this.$viewer();
    const zoom = viewer.viewport.getZoom(true);
    const imageZoom = viewer.viewport.viewportToImageZoom(zoom);
    this.app.callEvent("app:update-viewer-zoom", [zoom, imageZoom]);
  }
  
  addEventHandler() {}
  
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
  
  addNewTile(tileSource, index = 0, opacity) {
    const viewer = this.$viewer();
    viewer.addTiledImage({
      tileSource,
      index,
      opacity,
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
    return $$(this._osdViewerTemplateID);
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
		this._viewer = new openseadragon.Viewer({
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

  addOverlay(element, location) {
    const viewer = this.$viewer();
    viewer.addOverlay(element, location)
  }

  clearOverlays() {
    const viewer = this.$viewer();
    viewer.clearOverlays();
  }

  getLayersCount() {
    return this.$viewer().world.getItemCount();
  }

  getTiledImage(index) {
    return this.$viewer().world.getItemAt(index);
  }
  
  showTiledImage(index) {
    const count = this.getLayersCount();
    for (let i = 0; i < count; i++) {
      const image = this.getTiledImage(i);
      const opacity = i === index ? 1 : 0;
      image.setOpacity(opacity);
    }
  }

  getMouseTracker() {
    return this.mouseTracker;
  }
}
