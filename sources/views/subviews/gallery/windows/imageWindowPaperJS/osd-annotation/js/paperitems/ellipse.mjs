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
 * Represents an ellipse annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Ellipse` class represents an ellipse annotation item. It inherits from the `AnnotationItem` class and provides methods to work with ellipse annotations.
 */
class Ellipse extends AnnotationItem{
    /**
     * Create a new Ellipse instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
     * @property {paper.CompoundPath} _paperItem - The associated paper item representing the ellipse.
     * @description This constructor initializes a new ellipse annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'Point' || geoJSON.geometry.properties.subtype !== 'Ellipse') {
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
            let a = props.majorRadius || 0;
            let b = props.minorRadius || 0;
            let degrees = props.angle || 0;
            
            let ellipse = new paper.Path.Ellipse({
                center: new paper.Point(x, y),
                radius: new paper.Size(a, b)
            })
            poly.addChild(ellipse);
            poly.rotate(degrees);
            
        }
        
        
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
    static supportsGeoJSONType(type, subtype){
        return type.toLowerCase() === 'point' && subtype?.toLowerCase() === 'ellipse';
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'Ellipse'`
     */
    getGeoJSONType(){
        return {
            type: 'Point',
            subtype: 'Ellipse'
        }
    }


    /**
     * Retrieves the coordinates of the center of the ellipse.
     * @returns {Array} An array containing the x and y coordinates of the center.
     * @description This method returns an array of coordinates representing the position of the center of the ellipse.
     */
    getCoordinates(){
        let item = this.paperItem;
        return [item.position.x, item.position.y];
    }
    
    /**
     * Retrieves the properties of the ellipse.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the ellipse.
     */
    getProperties(){
        let item = this.paperItem;
        let path = item.children[0];
        let points = path.segments.map(s=>s.point);
        let ax1 = points[2].subtract(points[0]);
        let ax2 = points[3].subtract(points[1]);
        let a, b;
        if(ax1.length > ax2.length){
            a = ax1;
            b = ax2;
        } else {
            a = ax2;
            b = ax1;
        }

        let angle = a.angle;
        return {
            majorRadius: a.length/2,
            minorRadius: b.length/2,
            angle: angle
        };
    }
    /**
     * Handle transformation operations on the ellipse item.
     * @static
     * @param {...string} operation - The transformation operation.
     * @description This static method handles transformation operations on the ellipse item, such as rotation.
     */
    static onTransform(){
        let operation = arguments[0];
        switch(operation){
            case 'complete':{
                let curves = this.children[0].curves;
                let center = this.bounds.center;
                //take two adjacent curves (of the four total) and find the point on each closest to the center
                let nearpoints = curves.slice(0, 2).map(curve=>{
                    return {
                        curve: curve,
                        location: curve.getNearestLocation(center),
                    }
                }).sort((a,b) => a.location.distance - b.location.distance);
                
                let closest = nearpoints[0].location.point;
                if(closest.equals(nearpoints[0].curve.segment1.point) || closest.equals(nearpoints[0].curve.segment2.point)){
                    //no recalculation of points/axes required, the nearest point is already one of our existing points, just return
                    return;
                }
                
                let t = nearpoints[0].location.curve == nearpoints[0].curve ? nearpoints[0].location.time : 1;//if owned by the other curve, time == 1 by definition
                let b = closest.subtract(center);//minor axis
                let a = nearpoints[1].curve.getLocationAtTime(t).point.subtract(center);//major axis
                let ellipse = new paper.Path.Ellipse({center:center, radius: [a.length, b.length]}).rotate(a.angle);
                this.children[0].set({segments: ellipse.segments});
                break;
            }
        }
    }

}
export{Ellipse};
