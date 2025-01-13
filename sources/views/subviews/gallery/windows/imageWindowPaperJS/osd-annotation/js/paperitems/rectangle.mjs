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
 * Represents a rectangle annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Rectangle` class represents a rectangle annotation item. It inherits from the `AnnotationItem` class and provides methods to work with rectangle annotations.
 */
class Rectangle extends AnnotationItem{
    /**
     * Create a new Rectangle instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
     * @property {paper.CompoundPath} _paperItem - The associated paper item representing the rectangle.
     * @description This constructor initializes a new rectangle annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'Point' || geoJSON.geometry.properties.subtype !== 'Rectangle') {
            error('Bad geoJSON object: type !=="Point" or subtype !=="Rectangle"');
        }
        

        let poly = new paper.CompoundPath({
            children: [],
            fillRule: 'evenodd',
        });

        if(geoJSON.geometry.coordinates.length > 1){
            let center = geoJSON.geometry.coordinates.slice(0, 2);
            let x = center[0] || 0;
            let y = center[1] || 0;
            let props = geoJSON.geometry.properties;
            let w = props.width || 0;
            let h = props.height || 0;
            let degrees = props.angle || 0;
            
            let corners = [ [x - w/2, y - h/2], [x + w/2, y - h/2], [x + w/2, y + h/2], [x - w/2, y + h/2] ]; //array of array of points
            let pts = corners.map(function (point) {
                return new paper.Point(point[0], point[1]);
            });
            let path = new paper.Path(pts);
            poly.addChild(path);
            poly.closed = true;

            poly.rotate(degrees);
        }
        
        
        poly.canBeBoundingElement = true;

        this.paperItem = poly;
    }

    /**
     * Retrieves the supported types by the Rectangle annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype){
        return type.toLowerCase() === 'point' && subtype?.toLowerCase() === 'rectangle';
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'Rectangle'`
     */
    getGeoJSONType(){
        return {
            type: 'Point',
            subtype: 'Rectangle'
        }
    }

    /**
     * Retrieves the coordinates of the rectangle.
     * @returns {Array} An array containing the x and y coordinates of the rectangle.
     * @description This method returns an array containing the x and y coordinates of the rectangle.
     */
    getCoordinates(){
        let item = this.paperItem;
        return [item.position.x, item.position.y];
    }
    /**
     * Retrieves the properties of the rectangle.
     * @returns {Object} An object containing the width, height, and angle of the rectangle.
     * @description This method returns an object containing the width, height, and angle properties of the rectangle.
     */
    getProperties(){
        let item = this.paperItem;
        let path = item.children[0];
        let points = path.segments.map(s=>s.point);
        let top = points[1].subtract(points[0]);
        let left = points[0].subtract(points[3]);
        let w = top.length;
        let h = left.length;
        let angle = top.angleInDegrees;
        return {
            width: w,
            height: h,
            angle: angle
        };
    }

    /**
     * Perform transformation on the rectangle.
     * @static
     * @param {string} operation - The transformation operation to perform (rotate or scale).
     * @param {*} arguments - The arguments specific to the operation.
     * @description This static method performs transformation on the rectangle based on the specified operation and arguments.
     */
    static onTransform(){
        let operation = arguments[0];
        switch(operation){
            case 'scale':{
                let p = this.layer.matrix.inverseTransform(arguments[1]); //reference position
                let r = arguments[2]; //rotation
                let m = arguments[3]; //matrix
                
                this.matrix.append(m.inverted()); //undo previous default operation that was already applied
                
                //scale the midpoints of each edge of the rectangle per the transform operation
                //while projecting the operation onto the normal vector, to maintain rectanglar shape 
                let segments = this.children[0].segments;
                segments.map((s, i) => {
                    let c = s.point.transform(this.matrix); // first corner
                    let s2 = segments[(i+1) % 4]; // next segment
                    let c2 = s2.point.transform(this.matrix); // next corner
                    let vec = c2.subtract(c).divide(2); // vector from c to midpoint
                    let mp = c.add(vec); // midpoint of the side
                    
                    mp.normal = vec.rotate(-90).normalize(); // normal vector for this side of the rectangle
                    mp.segments = [s, s2]; // keep track of which segments are on each end of this side
                    return mp;
                }).forEach((midpoint) => {
                    // now adjust each corner position to keep the sides of the rect parallel to their previous orientation
                    let a = midpoint.subtract(p);
                    let ar = a.rotate(-r); 
                    let br = ar.multiply(m.scaling);
                    let b = br.rotate(r);
                    let delta = b.subtract(a);
                    let proj = delta.project(midpoint.normal);
                    
                    midpoint.segments.forEach(s=>{
                        let pt = s.point.transform(this.matrix).add(proj);
                        s.point = this.matrix.inverseTransform(pt);
                    })
                })
                break;
            }
        }
    }

}
export{Rectangle};
