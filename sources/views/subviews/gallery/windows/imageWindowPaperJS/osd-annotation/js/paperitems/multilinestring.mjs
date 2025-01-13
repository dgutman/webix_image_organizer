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

import { AnnotationItem } from "./annotationitem.mjs";
import { paper } from '../paperjs.mjs';

/**
 * Represents a multi-linestring annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `MultiLinestring` class represents a multi-linestring annotation item. It inherits from the `AnnotationItem` class and provides methods to work with multi-linestring annotations.
 */
class MultiLinestring extends AnnotationItem{
    /**
     * Create a new MultiLinestring instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type is invalid.
     * @property {paper.Group} _paperItem - The associated paper item representing the multi-linestring.
     * @description This constructor initializes a new multi-linestring annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'MultiLineString') {
            error('Bad geoJSON object: type !=="MultiLineString"');
        }
        let coords = geoJSON.geometry.coordinates; //array of points
        let paths = coords.map(function (points, index) {
            let pts = points.map(function (point) {
                return new paper.Point(point[0], point[1]);
            });
            let path = new paper.Path(pts);
            path.strokeWidth = geoJSON.geometry.properties.strokeWidths[index];
            return new paper.Path(pts);
        });
    
        let grp = new paper.Group({
            children: paths
        });
        
        grp.fillColor = null;

        this.paperItem = grp;
    
    }
    
    /**
     * Retrieves the supported types by the MultiLineString annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype = null){
        return type.toLowerCase() === 'multilinestring' && subtype === null;
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'MultiLineString'`
     */
    getGeoJSONType(){
        return {
            type: 'MultiLineString',
        }
    }


    /**
     * Retrieves the coordinates of the multi-linestring.
     * @returns {Array} An array containing arrays of x and y coordinates for each point.
     * @description This method returns an array of arrays representing the coordinates of each point in the multi-linestring.
     */
    getCoordinates(){
        let item = this.paperItem;
        return item.children.map(function (c) { return c.segments.map(function (s) { return [s.point.x, s.point.y]; }); });
    }
    /**
     * Retrieves the properties of the multi-linestring.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the multi-linestring, including stroke color and widths.
     */
    getProperties(){
        let item = this.paperItem;
        return {
            strokeColor: item.children.length>0 ? item.children[0].strokeColor : undefined,
            strokeWidths: item.children.map(c => c.strokeWidth),
        }
    }
    /**
     * Retrieves the style properties of the multi-linestring.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the multi-linestring in JSON format.
     */
    getStyleProperties(){
        return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Apply style properties to the multi-linestring annotation item.
     * @param {Object} properties - The style properties to set.
     * @description This method applies the provided style properties to the multi-linestring annotation item.
     */
    setStyle(properties){
        Object.assign({},properties);
        if(properties.rescale){
            delete properties.rescale['strokeWidth'];
        }
        this._paperItem.style.set(properties);
    }
}
export{MultiLinestring};

