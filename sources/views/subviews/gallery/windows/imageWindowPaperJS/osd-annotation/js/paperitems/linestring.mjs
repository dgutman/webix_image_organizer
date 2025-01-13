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
 * Represents a linestring annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Linestring` class represents a linestring annotation item. It inherits from the `AnnotationItem` class and provides methods to work with linestring annotations.
 */
class Linestring extends AnnotationItem{
    /**
     * Create a new Linestring instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type is invalid.
     * @property {paper.Group} _paperItem - The associated paper item representing the linestring.
     * @description This constructor initializes a new linestring annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'LineString') {
            error('Bad geoJSON object: type !=="LineString"');
        }
        let coords = geoJSON.geometry.coordinates; //array of points
        let pts = coords.map(function (point) {
            return new paper.Point(point[0], point[1]);
        });
    
        let grp = new paper.Group({
            children: [new paper.Path(pts)]
        });
        // grp.config = geoJSON;
        // grp.config.properties.rescale && (delete grp.config.properties.rescale.strokeWidth);
        
        grp.fillColor = null;

        this.paperItem = grp;
    
    }
    
    /**
     * Retrieves the supported types by the Linestring annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype = null){
        return type.toLowerCase() === 'linestring' && subtype === null;
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Linestring'`
     */
    getGeoJSONType(){
        return {
            type: 'Linestring',
        }
    }
        /**
     * Retrieves the coordinates of the linestring.
     * @returns {Array} An array of arrays containing x and y coordinates of each point.
     * @description This method returns an array of arrays representing the coordinates of each point in the linestring.
     */
    getCoordinates(){
        let item = this.paperItem;
        return item.children.map(function (c) { return c.segments.map(function (s) { return [s.point.x, s.point.y]; }); });
    }
    /**
     * Retrieves the style properties of the linestring.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the linestring in JSON format.
     */
    getProperties(){
        let item = this.paperItem;
        return {
            strokeWidths: item.children.map(c => c.strokeWidth),
        }
    }
    /**
     * Sets the style properties of the linestring.
     * @param {Object} properties - The style properties to set.
     * @description This method sets the style properties of the linestring using the provided properties object.
     */
    setStyle(properties){
        Object.assign({},properties);
        if(properties.rescale){
            delete properties.rescale['strokeWidth'];
        }
        this._paperItem.style.set(properties);
    }
}
export{Linestring};
