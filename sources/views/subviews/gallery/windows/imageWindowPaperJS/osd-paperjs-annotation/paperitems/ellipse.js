// ellipse.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/paperitems/ellipse.mjs e52bae0: last modified Aug 17, 2023
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

import { AnnotationItem } from "./annotationitem";

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
     * @returns {Object} An object with type and subtype properties.
     * @description This static method provides information about the supported types by the Ellipse annotation item class.
     */
    static get supportsType(){
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
