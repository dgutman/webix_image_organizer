// raster.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/paperitems/raster.mjs d3b3056: last modified Nov 3, 2023
// MIT License


// Copyright (c) 2023 Thomas Pearce

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { AnnotationItem } from './annotationitem';

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
        
        raster.selectedColor = rasterColor;

        

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
     * @returns {Object} An object with type and subtype properties.
     * @description This static method provides information about the supported types by the Raster annotation item class.
     */
    static get supportsType(){
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

const rasterColor = new paper.Color(0,0,0,0);
