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

import {AnnotationUITool, AnnotationUIToolbarBase} from './annotationUITool.mjs';
import { paper } from '../paperjs.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';
/**
 * The RasterTool class extends the AnnotationUITool and provides functionality for rasterizing annotations.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class RasterTool extends AnnotationUITool{
    /**
   * Creates a new RasterTool instance.
   * The constructor initializes the RasterTool by calling the base class (AnnotationUITool) constructor and sets up the necessary toolbar control (RasterToolbar).
   * @memberof OSDPaperjsAnnotation.RasterTool
   * @constructor
   * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
   */
    constructor(paperScope){
        super(paperScope);

        this.setToolbarControl(new RasterToolbar(this));
    }
    /**
     * Rasterizes the current annotation item. It converts the vector annotation to a pixel-based raster.
     * After rasterization, it replaces the original annotation with the rasterized version.
     * The rasterized version includes both the raster image and the original annotation's geoJSON data.
     * @property {function} onLoad The function performs rasterization and replacement of the vector annotation with the rasterized version.
     * @property {Object} geoJSON geoJSON data representing the rasterized annotation item.
     * @property {string} geoJSON.type - The type of the geoJSON object (e.g., 'Feature').
     * @property {Object} geoJSON.geometry - The geometry information of the geoJSON object.
     * @property {string} geoJSON.geometry.type - The type of the geometry (e.g., 'GeometryCollection').
     * @property {Object} geoJSON.geometry.properties - Additional properties of the geometry.
     * @property {string} geoJSON.geometry.properties.subtype - The subtype of the geometry (e.g., 'Raster').
     * @property {Object} geoJSON.geometry.properties.raster - The raster data of the geometry.
     * @property {paper.Raster} geoJSON.geometry.properties.raster.data - The pixel-based raster data.
     * @property {Object} geoJSON.geometries - The list of geometries in the geometry collection.
     * @property {Object} geoJSON.properties - The properties of the geoJSON object.
     *
     */
    rasterize(){
        let self = this;
        let item = this.item;
        if(item){
            let raster = this.project.overlay.getViewportRaster();
            item.layer.addChild(raster);
        
        
            raster.onLoad = function(){
                //get the subregion in pixel coordinates of the large raster by inverse transforming the bounding rect of the item
                let offset = new paper.Point(this.width/2,this.height/2);
                
                let newBounds = new paper.Rectangle(
                    offset.add(this.matrix.inverseTransform(this.layer.matrix.transform(item.bounds.topLeft))).floor(), 
                    offset.add(this.matrix.inverseTransform(this.layer.matrix.transform(item.bounds.bottomRight))).ceil()
                );
                
                let subraster = this.getSubRaster(newBounds);
                
                subraster.transform(this.layer.matrix.inverted());
                
                subraster.selectedColor = null;
                let geoJSON = {
                    type:'Feature',
                    geometry:{
                        type:'GeometryCollection',
                        properties:{
                            subtype:'Raster',
                            raster: {
                                data:subraster,
                            },
                        },
                        geometries:[
                            item,
                        ]
                    },
                    properties:{}
                }

                item.replaceWith(paper.Item.fromGeoJSON(geoJSON));
                self.refreshItems();

                this.remove();
            }
        }

    }
    
}
export {RasterTool};
/**
 * The RasterToolbar class extends the AnnotationUIToolbarBase and provides the toolbar functionality for the RasterTool.
 * @extends AnnotationUIToolbarBase
 * @class 
 * @memberof OSDPaperjsAnnotation.RasterTool
 */
class RasterToolbar extends AnnotationUIToolbarBase{
   /**
   * The constructor sets up the toolbar UI with a button to trigger rasterization.
   * It also adds a warning message regarding the irreversible nature of rasterization.   * @constructor
   * @param {RasterTool} tool - The RasterTool instance.
   */
    constructor(tool){
        super(tool);
       
        const i = makeFaIcon('fa-image');
        this.button.configure(i,'raster Tool');

        const d = document.createElement('div');
        this.dropdown.appendChild(d);
        const button = document.createElement('button');
        button.innerHTML = 'Convert to raster';
        d.appendChild(button);
        const span = document.createElement('span');
        span.innerHTML = 'Warning: this cannot be undone!';
        d.appendChild(span);

        button.addEventListener('click',()=>tool.rasterize())
    }
    /**
   * Checks if the RasterTool is enabled for the given mode.
   * @function
   * @param {string} mode - The mode of the annotation, such as 'MultiPolygon', 'Point:Rectangle', or 'Point:Ellipse'.
   * @returns {boolean} - Returns true if the RasterTool is enabled for the given mode, false otherwise.
   */
    isEnabledForMode(mode){
        return ['Polygon','MultiPolygon','Point:Rectangle','Point:Ellipse'].includes(mode);
    }
}