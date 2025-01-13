/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.12
 * 
 * Includes additional open source libraries which are subject to copyright notices
 * as indicated accompanying those segments of code.
 * 
 * Original code:
 * Copyright (c) 2022-2024, Thomas Pearce
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
 * * Neither the name of osd-paperjs-annotation nor the names of its
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

import { PaperOverlay } from "./paper-overlay.mjs";
import { OpenSeadragon } from "./osd-loader.mjs";
import { paper } from './paperjs.mjs';

Object.defineProperty(OpenSeadragon.Viewer.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(OpenSeadragon.TiledImage.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(OpenSeadragon.Viewport.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(OpenSeadragon.TiledImage.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(OpenSeadragon.Viewer.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(OpenSeadragon.Viewport.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(OpenSeadragon.Viewer.prototype, 'paperItems', paperItemsDef());
Object.defineProperty(OpenSeadragon.TiledImage.prototype, 'paperItems', paperItemsDef());
Object.defineProperty(OpenSeadragon.Viewport.prototype, 'paperItems', paperItemsDef());
OpenSeadragon.Viewer.prototype._setupPaper = _setupPaper;
OpenSeadragon.Viewport.prototype._setupPaper = _setupPaperForViewport;
OpenSeadragon.TiledImage.prototype._setupPaper = _setupPaperForTiledImage;
OpenSeadragon.Viewer.prototype.addPaperItem = addPaperItem;
OpenSeadragon.Viewport.prototype.addPaperItem = addPaperItem;
OpenSeadragon.TiledImage.prototype.addPaperItem = addPaperItem;

/**
 * Creates a PaperOverlay for this viewer. See {@link PaperOverlay} for options.
 * @returns {PaperOverlay} The overlay that was created
 */
OpenSeadragon.Viewer.prototype.createPaperOverlay = function(){ 
    let overlay = new PaperOverlay(this, ...arguments);
    return overlay;
};

/**
 * Define the paperItems property for a tiledImage.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperItems.
 *   @returns {paper.Item[]} The array of paper item objects representing the items belonging to this TiledImage.
 */
function paperItemsDef(){
    return {
        get: function paperItems(){
            return this.paperLayer.children;
        }
    }
}


/**
 * @private
 */
function _createPaperLayer(osdObject, paperScope){
    let layer = new paper.Layer({applyMatrix:false});
    paperScope.project.addLayer(layer);
    osdObject._paperLayerMap.set(paperScope, layer);
    return layer;
}

/**
 * Define the paperLayer property for a tiledImage.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperGroup.
 *   @returns {paper.Layer} The group that serves as the parent of all paper items belonging to this TiledImage.
 */
function paperLayerDef(){
    return {
        get: function paperLayer(){
            let numScopes = this._paperLayerMap.size;
            if( numScopes === 1){
                return this._paperLayerMap.values().next().value;
            } else if (numScopes === 0){
                return null;
            } else {
                return this._paperLayerMap.get(paper) || null;
            }
        }
    }
}
/**
 * Define the _paperLayerMap property for a tiledImage. Initializes the Map object the first time it is accessed.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperGroup.
 *   @returns {Map} The mapping from paper.Scope to the layer within the scope corresponding to this object
 */
function paperLayerMapDef(){
    return {
        get: function _paperLayerMap(){
            if(!this.__paperLayerMap){
                this.__paperLayerMap = new Map();
            }
            return this.__paperLayerMap;
        }
    }
}

/**
 * @private
 * @returns {paper.Layer}
 */
function _setupPaper(overlay){
    return _createPaperLayer(this, overlay.paperScope);
}

/**
 * @private
 * 
 */
function _setupPaperForTiledImage(overlay){
    let _this = this;
    let layer = _setupPaper.call(this, overlay);
    let tiledImage = this;
    layer.tiledImage = tiledImage;
    
    function updateMatrix(){
        let degrees = _this.getRotation();
        let bounds = _this.getBoundsNoRotate();
        let matrix = new paper.Matrix();

        matrix.rotate(degrees, (bounds.x+bounds.width/2) * overlay.scaleFactor, (bounds.y+bounds.height/2) * overlay.scaleFactor);
        matrix.translate({x: bounds.x * overlay.scaleFactor, y: bounds.y * overlay.scaleFactor});
        matrix.scale(bounds.width * overlay.scaleFactor / _this.source.width );

        layer.matrix.set(matrix);
    }
    tiledImage.addHandler('bounds-change',updateMatrix);
    overlay.addHandler('update-scale',updateMatrix);
    updateMatrix();
}

/**
 * @private
 * 
 */
function _setupPaperForViewport(overlay){
    let layer = _setupPaper.call(this, overlay);
    layer.viewport = this;
    
    layer.matrix.scale(overlay.scaleFactor);

    function updateMatrix(){
        layer.matrix.reset();
        layer.matrix.scale(overlay.scaleFactor);
    }
    
    overlay.addHandler('update-scale',updateMatrix);
}


/**
 * @private
 */
function addPaperItem(item){
    if(this.paperLayer){
        this.paperLayer.addChild(item);
        item.applyRescale();
    } else {
        console.error('No layer has been set up in the active paper scope for this object. Does a scope need to be activated?');
    }
}
