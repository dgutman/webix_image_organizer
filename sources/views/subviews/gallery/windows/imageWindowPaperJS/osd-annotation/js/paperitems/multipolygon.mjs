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
 * Represents a multi-polygon annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `MultiPolygon` class represents a multi-polygon annotation item. It inherits from the `AnnotationItem` class and provides methods to work with multi-polygon annotations.
 */
class MultiPolygon extends AnnotationItem{
    /**
     * Create a new MultiPolygon instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type is invalid.
     * @property {paper.CompoundPath} _paperItem - The associated paper item representing the multi-polygon.
     * @description This constructor initializes a new multi-polygon annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if(!this._supportsGeoJSONObj(geoJSON)){
            error(`Bad geoJSON object: geometry type ${geoJSON.geometry?.type} is not supported by this factory.`)
        }
        // GeoJSON Polygons are arrays of arrays of points. The first is the external linear ring, while the rest are internal "hole" linear rings.
        // GeoJSON MultiPolygons are arrays of Polygons.
        // For type==MultiPolygon, flatten the outer array
        let linearRings;
        if(geoJSON.geometry.type.toLowerCase() === 'multipolygon'){
            linearRings = geoJSON.geometry.coordinates.flat();
        } else {
            linearRings = geoJSON.geometry.coordinates;
        } 
        
        let paths = linearRings.map(function (points) {
            let pts = points.map(function (point) {
                return new paper.Point(point[0], point[1]);
            });
            return new paper.Path(pts);
        });

        let poly = new paper.CompoundPath({
            children: paths,
            fillRule: 'evenodd',
            closed: true,
        });

        poly = poly.replaceWith(poly.unite(poly).toCompoundPath());
        
        poly.canBeBoundingElement = true;

        this.paperItem = poly;
    }
    
    /**
     * Retrieves the supported types by the Ellipse annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype = null){
        return ['polygon','multipolygon'].includes(type.toLowerCase()) && subtype === null;
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type in ['MultiPolygon', 'Polygon']`
     */
    getGeoJSONType(){
        let polygons = this.paperItem.children.filter(c=>c.area > 0 && c.segments.length>2);
        const type = polygons.length > 1 ? 'MultiPolygon' : 'Polygon';
            
        return {
            type: type,
        }
    }


    /**
     * Retrieves the coordinates of the multi-polygon.
     * @returns {Array} An array of arrays representing the coordinates of the polygons and holes.
     * @description This method returns an array of arrays representing the coordinates of the polygons and their holes in the multi-polygon.
     */
    getCoordinates(){
        //filter out invalid children with less than 3 points
        let polygons = this.paperItem.children.filter(c=>c.area > 0 && c.segments.length>2);
        let holes = this.paperItem.children.filter(c=>c.area <= 0 && c.segments.length>2);
        let out = polygons.map(p => 
            [p.segments.map(s => [s.point.x, s.point.y]), ].concat(
                holes.filter(h=>p.contains(h.segments[0].point)).map(h=> h.segments.map(s=>[s.point.x, s.point.y])) )
        );
        //Close each polygon by making the first point equal to the last (if needed)
        out.forEach(polylist=>{
            polylist.forEach(array=>{
                let first = array[0];
                let last = array.slice(-1)[0];
                if(first[0]!==last[0] || first[1] !== last[1]){
                    array.push([first[0], first[1]]);
                }
            })
        })
        if(out.length === 1){
            out = out[0]; // unwrap the first element for type===Polygon
        }
        return out;
    }
    /**
     * Retrieves the properties of the multi-polygon.
     * @returns {undefined}
     * @description This method returns `undefined` since the MultiPolygon class does not have specific properties.
     */
    getProperties(){
        return;
    }
    
}
export{MultiPolygon};
