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

import { AnnotationItem } from './annotationitem.mjs';
import { paper } from '../paperjs.mjs';

/*
 * Raster - contains pixel data for a rectangular region, with an optional clip mask
 * pseudo-GeoJSON definition:
 * {
 *   type: Feature
 *   geometry:{
 *     type: GeometryCollection,
 *     properties:{
 *       subtype: Raster,
 *       raster: {
 *          data: [Raster data],
 *          width: width of raster image,
 *          height: height of raster image,
 *          center: center of raster object [x, y],
 *          scaling: scaling applied to raster object [x, y],
 *          rotation: rotation applied to raster object,
 *       },
 *       transform: matrix
 *     }
 *     geometries:[ Array of GeoJSON Geometry objects ],
 *   }
 * 
 **/

/**
 * Represents a raster annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Raster` class represents a raster annotation item. It inherits from the `AnnotationItem` class and provides methods to work with raster annotations.
 */
class Raster extends AnnotationItem{
    /**
     * Create a new Raster instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
     * @property {paper.Group} _paperItem - The associated paper item representing the raster.
     * @description This constructor initializes a new raster annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);
        if (geoJSON.geometry.type !== 'GeometryCollection' || geoJSON.geometry.properties.subtype !== 'Raster') {
            error('Bad geoJSON object: type !=="GeometryCollection" or subtype !=="Raster"');
        }

        //handle composition by geoJSON definition or by pre-constructed paper items
        let inputRaster = geoJSON.geometry.properties.raster;
        let inputClip = geoJSON.geometry.geometries;

        if(!inputRaster){
            error('Bad input: geometry.properties.raster must hold raster data, or a paper.Raster object');
        }

        let raster;
        if(inputRaster.data instanceof paper.Raster){
            raster = inputRaster.data;
        } else {
            raster = new paper.Raster(inputRaster.data);
            raster.translate(inputRaster.center[0], inputRaster.center[1]);
            raster.scale(inputRaster.scaling[0], inputRaster.scaling[1]);
            raster.rotate(inputRaster.rotation);
        }
        
        this._rasterSelectedColor = new paper.Color(0,0,0,0);

        raster.selectedColor = this._rasterSelectedColor;

        

        let grp = new paper.Group([raster]);
        grp.updateFillOpacity = function(){
            paper.Group.prototype.updateFillOpacity.call(this);
            raster.opacity = this.opacity * this._computedFillOpacity;
            if(grp.clipped){
                grp.children[0].fillColor = null;
            }
        }
        if(inputClip.length > 0){
            let clipGroup = new paper.Group();
            grp.insertChild(0, clipGroup);
            grp.clipped = true; //do this after adding the items, so the stroke style is deleted
            inputClip.forEach(i => {
                let item = i instanceof paper.Item ? paper.Item.fromAnnotationItem(i) : paper.Item.fromGeoJSON(i);
                delete item.isGeoJSONFeature; //so it doesn't trigger event handlers about new features being added/moved/removed
                item._annotationItem = item.annotationItem; //rename to private property
                delete item.annotationItem; //so it isn't found by descendants query
                setTimeout(()=>item.strokeColor = (i.properties||i).strokeColor);
                item.strokeWidth = (i.properties||i).strokeWidth;
                item.rescale = (i.properties||i).rescale;
                clipGroup.addChild(item);
            });
            
        }

        if(geoJSON.geometry.properties.transform){
            grp.matrix = new paper.Matrix(geoJSON.geometry.properties.transform);
        }

        grp.on('selected',()=>{
            grp.clipped && (grp.children[0].selected = false);
        })
        
        this.paperItem = grp;
    }

    /**
     * Retrieves the supported types by the Raster annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype){
        return type.toLowerCase() === 'geometrycollection' && subtype?.toLowerCase() === 'raster';
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'GeometryCollection'` and `subtype === 'Raster'`
     */
    getGeoJSONType(){
        return {
            type: 'GeometryCollection',
            subtype: 'Raster'
        }
    }

    /**
     * Convert the raster annotation to a GeoJSON geometry.
     * @returns {Object} The GeoJSON representation of the raster annotation.
     */
    toGeoJSONGeometry(){
        let item = this.paperItem;
        let clipGroup = item.children[0];
        let raster = item.children[1];
        let geom = {
            type: 'GeometryCollection',
            properties: {
                subtype: 'Raster',
                raster: {
                    data:raster.toDataURL(),
                    center: [raster.bounds.center.x, raster.bounds.center.y],
                    width: raster.width,
                    height: raster.height,
                    scaling: [raster.matrix.scaling.x, raster.matrix.scaling.y],
                    rotation: raster.matrix.rotation,
                },
                transform: item.matrix.values,
            },
            geometries:clipGroup.children.map(item=>{
                let feature = item._annotationItem.toGeoJSONFeature();
                let geometry = feature.geometry;
                if(!geometry.properties){
                    geometry.properties = {};
                }
                geometry.properties.strokeColor = feature.properties.strokeColor;
                geometry.properties.strokeWidth = feature.properties.strokeWidth;
                geometry.properties.rescale = feature.properties.rescale;
                return geometry;
            })
        }
        return geom;
    }
}
export{Raster};

