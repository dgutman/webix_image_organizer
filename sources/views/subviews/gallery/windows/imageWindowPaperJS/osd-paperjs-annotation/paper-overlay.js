// Based on:
// paper-overlay.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/paper-overlay.mjs

/**
 * OpenSeadragon canvas Overlay plugin based on paper.js
 * @version 0.1.2
 * 
 * Includes additional open source libraries which are subject to copyright notices
 * as indicated accompanying those segments of code.
 * 
 * Original code:
 * Copyright (c) 2022, Thomas Pearce
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of paper-overlay nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */

(function (OpenSeadragon) {

    if (typeof OpenSeadragon === 'undefined') {
        console.error('[paper-overlay.mjs] requires OpenSeadragon and paper.js');
        return;
    }
    if (typeof paper==='undefined') {
        console.error('[paper-overlay.mjs] requires OpenSeadragon and paper.js');
        return;
    }

    
    Object.defineProperty(OpenSeadragon.Viewer.prototype, 'PaperOverlays',{
        get: function PaperOverlays(){
            return this._PaperOverlays || (this._PaperOverlays = []);
        }
    });
    /**
     * Gets the image data from the viewer.
     * @memberof OSDPaperjsAnnotation.PaperOverlay#
     * @function getImageData
     * @param {number} x - The x coordinate of the top left corner of the image data.
     * @param {number} y - The y coordinate of the top left corner of the image data.
     * @param {number} w - The width of the image data.
     * @param {number} h - The height of the image data.
     * @returns {ImageData} The image data.
     */
    OpenSeadragon.Viewer.prototype.getImageData = function(x, y, w, h){
        x = x || 0;
        y = y || 0;
        w = w == undefined ? this.drawer.canvas.width : w;
        h = h == undefined ? this.drawer.canvas.height : h;
        return this.drawer.canvas.getContext('2d',{willReadFrequently:true}).getImageData(x, y, w, h);
    }

    /**
     * Gets a raster object representing the viewport.
     * @memberof OSDPaperjsAnnotation.PaperOverlay#
     * @function getViewportRaster
     * @param {any} view - The view object.
     * @param {boolean} withImageData - Whether to include image data in the raster object.
     * @returns {any} The raster object.
     */
    OpenSeadragon.Viewer.prototype.getViewportRaster = function(view, withImageData = true){
        //TO DO: make this query subregions of the viewport directly instead of always returning the entire thing
        // let view = this.paperjsOverlay && this.paperjsOverlay.paperScope.view;
        // if(!view){
        //     console.error('Cannot call getViewportRaster before an overlay has been created');
        //     return;
        // }
        let center = view.viewToProject(new paper.Point(view.viewSize.width/2, view.viewSize.height/2 ));
        let rotation = -1 * this.viewport.getRotation();
        let rasterDef = {
            insert:false,
        }
        if(withImageData) rasterDef.canvas = this.drawer.canvas;
        else rasterDef.size = new paper.Size(this.drawer.canvas.width,this.drawer.canvas.height);
        let raster = new paper.Raster(rasterDef);

        raster.position = center;
        raster.rotate(rotation);
        let scaleFactor = view.viewSize.width / view.getZoom() / this.drawer.canvas.width;
        raster.scale(scaleFactor);
       
        return raster;
    }
    /**
     * Sets the rotation of the view.
     * @function setRotation
     * @memberof OSDPaperjsAnnotation.paperjsOverlay#
     * @param {number} degrees - The number of degrees to rotate.
     * @param {any} center - The center point of the rotation.
     */
    paper.View.prototype.setRotation = function(degrees, center){
        let degreesToRotate = degrees - (this._rotation || 0)
        this.rotate(degreesToRotate, center);
        this._rotation = OpenSeadragon.positiveModulo(degrees, 360);
        this.emit('rotate',{rotatedBy:degreesToRotate, currentRotation:this._rotation, center:center});
    }

    //Add applyRescale as a method to paper objects
    paper.Item.prototype.applyRescale = function(){
        let item = this;
        let z = 1;
        let rescale = item.rescale;
        rescale && (z = item.view.getZoom()) && Object.keys(rescale).forEach(function(prop){
            item[prop] = (typeof rescale[prop] ==='function') ? rescale[prop](z) : 
                        Array.isArray(rescale[prop]) ? rescale[prop].map(function(i){return i/z}) : 
                        rescale[prop]/z;
        })
    }

})(window.OpenSeadragon);


/**
 *
 * Represents a PaperOverlay associated with an OpenSeadragon Viewer.
 * A PaperOverlay is a Paper.js overlay that can be either synced to the zoomable image or fixed to the viewer.
 *
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class PaperOverlay{    
    /**
    * Creates an instance of the PaperOverlay.
    * overlayType: 'image' to sync to the zoomable image, 'viewport' to stay fixed to the viewer
    * @param {any} viewer - The viewer object.
    * @param {Object} opts - The options for the overlay.
    * @property {string} [overlayType='image'] - The type of overlay: 'image' to sync to the zoomable image or 'viewport' to stay fixed to the viewer.
    * @property {number} _scale - The scale factor for the overlay.
    * @property {OpenSeadragon.Viewer} osdViewer - The OpenSeadragon viewer object.
    * @property {string} _id - The unique ID of the paper overlay canvas.
    * @property {number} _containerWidth - The width of the overlay container.
    * @property {number} _containerHeight - The height of the overlay container.
    * @property {HTMLElement} _canvasdiv - The HTML element for the paper overlay container.
    * @property {HTMLCanvasElement} _canvas - The HTML canvas element for the paper overlay.
    * @property {paper.PaperScope} paperScope - The Paper.js PaperScope instance for the overlay.
    * @property {paper.PaperScope} ps - An alias for the Paper.js PaperScope instance for the overlay.
    * @property {paper.Project} _paperProject - The Paper.js project associated with the overlay.
    * @property {Function} onViewerDestroy - Event handler for viewer destroy.
    * @property {Function} onViewportChange - Event handler for viewer viewport change (applicable for overlayType='image').
    * @property {Function} onViewerResetSize - Event handler for viewer reset size.
    * @property {Function} onViewerResize - Event handler for viewer resize.
    * @property {Function} onViewerRotate - Event handler for viewer rotate (applicable for overlayType='image').
    */
    constructor(viewer,opts={overlayType:'image'}){
        let defaultOpts = {
            overlayType: 'image',
        }
        opts=OpenSeadragon.extend(true,defaultOpts,opts);

        this._scale = opts.overlayType=='image' ? getViewerContentWidth(viewer) : 1;

        this.osdViewer = viewer;
        
        viewer.PaperOverlays.push(this);
        
        let ctr = counter();
        this._id = 'paper-overlay-canvas-' + ctr;

        this._containerWidth = 0;
        this._containerHeight = 0;

        this._canvasdiv = document.createElement('div');
        this._canvasdiv.setAttribute('id','paper-overlay-'+ctr);
        this._canvasdiv.classList.add('paper-overlay');
        this._canvasdiv.style.position = 'absolute';
        this._canvasdiv.style.left = "0px";
        this._canvasdiv.style.top = "0px";
        this._canvasdiv.style.width = '100%';
        this._canvasdiv.style.height = '100%';

        this._canvas = document.createElement('canvas');
        this._canvas.setAttribute('id', this._id);
        this._canvasdiv.appendChild(this._canvas);
        
        viewer.canvas.appendChild(this._canvasdiv);
        
        
        this.paperScope = new paper.PaperScope();
        
        
        this.paperScope.overlay = this;
        let ps = this.paperScope.setup(this._canvas);
        this.paperScope.project.overlay = this;
        this.ps = ps;
        this._paperProject=ps.project;

        this._resize();
        
        if(opts.overlayType=='image'){
            this._updatePaperView();
        } 

        
        
        this.onViewerDestroy=(self=>function(){
            self.destroy(true);
        })(this);
        this.onViewportChange=(self=>function(){
            self._updatePaperView();
        })(this);
        this.onViewerResetSize=(self=>function(ev){
            self._scale = getViewerContentWidth(ev);
            //need to setTimeout to wait for some value (viewport.getZoom()?) to actually be updated before doing our update
            //need to check for destroyed because this will get called as part of the viewer destroy chain, and we've set the timeout
            setTimeout(()=>{
                if(self.destroyed){
                    return;
                }
                self._resize();
                if(opts.overlayType=='image'){
                    self._updatePaperView(true);
                }
            });
        })(this);
        this.onViewerResize=(self=>function(){
            self._resize();
            self.paperScope.view.emit('resize',{size:new paper.Size(self._containerWidth, self._containerHeight)})
            if(opts.overlayType=='image'){
                self._updatePaperView();
            } 
        })(this);
        this.onViewerRotate=(self=>function(ev){
            let pivot = ev.pivot || self.osdViewer.viewport.viewportToImageCoordinates(self.osdViewer.viewport.getCenter());
            self.paperScope.view.setRotation(ev.degrees, pivot)
        })(this);

        viewer.addHandler('resize',this.onViewerResize);
        viewer.addHandler('reset-size',this.onViewerResetSize)
        if(opts.overlayType=='image'){
            viewer.addHandler('viewport-change', this.onViewportChange)
            viewer.addHandler('rotate',this.onViewerRotate)
        }
        viewer.addOnceHandler('destroy', this.onViewerDestroy)
          
    }
  /**
   * Adds a button to the viewer. The button is created with the provided parameters.
   * @param {Object} params - The parameters for the button.
   * @param {string} params.tooltip - The tooltip text for the button.
   * @param {string} params.onClick - The function to be called when the button is clicked.
   * @param {string} params.faIconClasses - Space-separated list of Font Awesome icon classes for the button icon.
   * @returns {any} The button object.
   */
    addViewerButton(params={}){
        const prefixUrl=this.osdViewer.prefixUrl;
        let button = new OpenSeadragon.Button({
            tooltip: params.tooltip,
            srcRest: prefixUrl+`button_rest.png`,
            srcGroup: prefixUrl+`button_grouphover.png`,
            srcHover: prefixUrl+`button_hover.png`,
            srcDown: prefixUrl+`button_pressed.png`,
            onClick: params.onClick,
        });
        if(params.faIconClasses){
            let i = document.createElement('i');
            i.classList.add(...params.faIconClasses.split(/\s/), 'button-icon-fa');
            button.element.appendChild(i);
            // $(button.element).append($('<i>', {class:params.faIconClasses + ' button-icon-fa'}));
        }
        this.osdViewer.buttonGroup.buttons.push(button);
        this.osdViewer.buttonGroup.element.appendChild(button.element);
        return button;
    }
  /**
   * Brings the overlay to the front, making it appear on top of other overlays.
   * This method changes the z-index of the overlay to bring it forward.
   * The overlay will appear on top of any other overlays that are currently on the viewer.
   */
    bringToFront(){
        this.osdViewer.PaperOverlays.splice(this.osdViewer.PaperOverlays.indexOf(this),1);
        this.osdViewer.PaperOverlays.push(this);
        this.osdViewer.PaperOverlays.forEach(overlay=>this.osdViewer.canvas.appendChild(overlay._canvasdiv));
        this.paperScope.activate();
    }
  /**
   * Sends the overlay to the back, making it appear behind other overlays.
   * This method changes the z-index of the overlay to send it backward.
   * The overlay will appear behind any other overlays that are currently on the viewer.
   */
    sendToBack(){
        this.osdViewer.PaperOverlays.splice(this.osdViewer.PaperOverlays.indexOf(this),1);
        this.osdViewer.PaperOverlays.splice(0,0,this);
        this.osdViewer.PaperOverlays.forEach(overlay=>this.osdViewer.canvas.appendChild(overlay._canvasdiv));
        this.osdViewer.PaperOverlays[this.osdViewer.PaperOverlays.length-1].paperScope.activate();
    }
  /**
   * Destroys the overlay and removes it from the viewer.
   * This method cleans up the resources associated with the overlay and removes it from the viewer.
   *
   * @param {boolean} viewerDestroyed - Whether the viewer has been destroyed.
   * If `viewerDestroyed` is true, it indicates that the viewer itself is being destroyed, and this method
   * will not attempt to remove the overlay from the viewer, as it will be automatically removed during the viewer's cleanup process.
   */   
    destroy(viewerDestroyed){
        this.destroyed = true;
        this._canvasdiv.remove();
        this.paperScope.project.remove();
        this._canvasdiv.remove();
        this.ps.remove();  
        if(!viewerDestroyed){
            this.osdViewer.removeHandler('viewport-change',this.onViewportChange);
            this.osdViewer.removeHandler('resize',this.onViewerResize);
            this.osdViewer.removeHandler('close',this.onViewerDestroy);
            this.osdViewer.removeHandler('reset-size',this.onViewerResetSize);
            this.osdViewer.removeHandler('rotate',this.onViewerRotate);
            this.setOSDMouseNavEnabled(true);

            this.osdViewer.PaperOverlays.splice(this.osdViewer.PaperOverlays.indexOf(this),1);
            if(this.osdViewer.PaperOverlays.length>0){
                this.osdViewer.PaperOverlays[this.osdViewer.PaperOverlays.length-1].paperScope.activate();
            }
        }
         
    }
  /**
   * Clears the overlay by removing all paper items from the overlay's Paper.js project.
   * This method removes all Paper.js items (such as paths, shapes, etc.) that have been added to the overlay.
   * After calling this method, the overlay will be empty, and any content that was previously drawn on it will be removed.
   */
    clear(){
        this.paperScope.project.clear();
    }
    // ----------
    /**
     * Gets the canvas element of the overlay.
     *
     * @returns {HTMLCanvasElement} The canvas element.
     */
    canvas() {
        return this._canvas;
    }
    // ----------
  /**
   * This method allows you to add CSS classes to the canvas element of the overlay.
   * Adding classes can be useful for styling the overlay or associating specific styles with it.
   * 
   * @param {string} c - The class name to add to the canvas element.
   * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
   */
    addClass(c){
        this._canvas.classList.add(...arguments);
        return this;
    }
  /**
   * This method allows you to remove CSS classes from the canvas element of the overlay.
   * Removing classes can be useful for updating the overlay's appearance or changing its associated styles.
   * @param {string} c - The class name to remove from the canvas element.
   * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
   */
    removeClass(c){
        this._canvas.classList.remove(...arguments);
        return this;
    }
  /**
   * This method allows you to set custom attributes on the canvas element of the overlay.
   * Setting attributes can be useful for additional customization or to store metadata related to the overlay.
   *
   * @param {string} attr - The name of the attribute to set on the canvas element.
   * @param {string} value - The value to set for the specified attribute.
   * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
   */
    setAttribute(attr, value){
        this._canvas.setAttribute(attr,value);
        return this;
    }
  /**
   * This method allows you to add custom event listeners to the canvas element of the overlay.
   * You can listen for various events, such as mouse clicks or custom events, and perform actions accordingly.
   *
   * @param {string} event - The name of the event to listen for on the canvas element.
   * @param {function} listener - The function to call when the specified event is triggered.
   * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
   */
    addEventListener(event,listener){
        this._canvas.addEventListener(event,listener);
        return this;
    }
  /**
   * This method allows you to remove a previously added event listener from the canvas element of the overlay.
   * If the specified event and listener pair match an existing event listener, it will be removed.
   *
   * @param {string} event - The name of the event to stop listening for on the canvas element.
   * @param {function} listener - The function that was previously registered as the event listener.
   * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
   */
    removeEventListener(event,listener){
        this._canvas.removeEventListener(event,listener);
        return this;
    }
    // returns: mouseNavEnabled status BEFORE the call (for reverting)
    // raises 'mouse-nav-enabled' event
  /**
   * This method allows you to enable or disable mouse navigation in the viewer associated with the overlay.
   * Mouse navigation includes actions such as panning and zooming.
   * It returns a boolean value indicating whether mouse navigation was enabled before the method call.
   *
   * @param {boolean} enabled - Whether to enable or disable mouse navigation.
   * @returns {boolean} Whether mouse navigation was enabled before the call.
   */
    setOSDMouseNavEnabled(enabled=true){
        let wasMouseNavEnabled = this.osdViewer.isMouseNavEnabled();
        this.osdViewer.setMouseNavEnabled(enabled);
        if(enabled !== wasMouseNavEnabled){
            this.osdViewer.raiseEvent('mouse-nav-changed',{enabled: enabled, overlay: this});
        }
        return wasMouseNavEnabled;
    }
    // ----------
  /**
   * This method allows you to enable or disable automatic rescaling of items within the overlay
   * based on the zoom level of the OpenSeadragon viewer.
   * When enabled, items in the overlay will be rescaled automatically as the viewer's zoom level changes.
   *
   * @param {boolean} shouldHandle - Whether to enable or disable automatic rescaling.
   * @see {@link rescaleItems}
   */
    autoRescaleItems(shouldHandle=false){
        let _this=this;
        this.ps.view.off('zoom-changed',_rescale);
        if(shouldHandle) this.ps.view.on('zoom-changed',_rescale );
        
        function _rescale(){
            _this.rescaleItems();
        }
    }
    //-----------
  /**
   * Rescales all items in the overlay according to the current zoom level of the viewer.
   * This method manually rescales all Paper.js items that have the `rescale` property set to true.
   * The rescaling is based on the current zoom level of the viewer, ensuring that the items maintain their relative size on the viewer.
   * @see {@link autoRescaleItems}
   */
    rescaleItems(){
        this._paperProject.getItems({match:function(o){return o.rescale}}).forEach(function(item){
            item.applyRescale();
        });
    }
    //------------
  /**
   * Resizes the overlay to match the size of the viewer container.
   * This method updates the dimensions of the overlay's canvas element to match the size of the viewer container.
   * If the viewer container's size changes (e.g., due to a browser window resize), you can call this method to keep the overlay in sync with the viewer size.
   * Additionally, this method updates the Paper.js view size to match the new canvas dimensions.
   * @private
   */
    _resize()
     {
        let update=false;
        if (this._containerWidth !== this.osdViewer.container.clientWidth) {
            this._containerWidth = this.osdViewer.container.clientWidth;
            this._canvasdiv.setAttribute('width', this._containerWidth);
            this._canvas.setAttribute('width', this._containerWidth);
            update=true;
        }

        if (this._containerHeight !== this.osdViewer.container.clientHeight) {
            this._containerHeight = this.osdViewer.container.clientHeight;
            this._canvasdiv.setAttribute('height', this._containerHeight);
            this._canvas.setAttribute('height', this._containerHeight);
            update=true;
        }
        if(update){
            this.paperScope.view.viewSize = new paper.Size(this._containerWidth, this._containerHeight);
            this.paperScope.view.update();
        }
    }
  /**
   * Updates the Paper.js view to match the zoom and center of the OpenSeadragon viewer.
   * This method synchronizes the Paper.js view with the current zoom and center of the OpenSeadragon viewer.
   * When the viewer's zoom or center changes, this method should be called to ensure that the Paper.js view is updated accordingly.
   * @private
   */
    _updatePaperView() {
        let viewportZoom = this.osdViewer.viewport.getZoom(true);
        let oldZoom = this.paperScope.view.zoom;
        this.paperScope.view.zoom = this.osdViewer.viewport._containerInnerSize.x * viewportZoom / this._scale;
        let center = this.osdViewer.viewport.viewportToImageCoordinates(this.osdViewer.viewport.getCenter(true));
        this.osdViewer.drawer.canvas.pixelRatio = window.devicePixelRatio;
        this.paperScope.view.center = new paper.Point(center.x, center.y);
        
        if(Math.abs(this.paperScope.view.zoom - oldZoom)>0.0000001){
            this.paperScope.view.emit('zoom-changed',{zoom:this.paperScope.view.zoom});
        }
        this.paperScope.view.update();
    }

    
};
export {PaperOverlay};

let counter = (function () {
    let i = 1;

    return function () {
        return i++;
    }
})();

/**
 * Gets the content width of the viewer.
 * @param {any} input - The viewer object or an event object.
 * @returns {number} The content width of the viewer.
 */
function getViewerContentWidth(input){
    if(input.contentSize){
        return input.contentSize.x;
    }
    let viewer = input.eventSource || input;
    let item = viewer.world.getItemAt(0);
    return item && item.getContentSize().x || 1;
    // let viewer = input.eventSource || input;
    // let item = viewer.world.getItemAt(0);
    // return (item && item.source && item.source.width) || 1;
}
  