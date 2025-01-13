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
import { OpenSeadragon } from '../osd-loader.mjs';
import { paper } from '../paperjs.mjs';
// import { makeFaIcon } from "../utils/faIcon.mjs";


/**
 * Represents a point annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Point` class represents a point annotation item. It inherits from the `AnnotationItem` class and provides methods to work with point annotations.
 */
class Point extends AnnotationItem{
    /**
     * Create a new Point instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @property {paper.Group} _paperItem - The associated paper item representing the point.
     * @description This constructor initializes a new point annotation item based on the provided GeoJSON object. It creates a visual representation of a point annotation with an icon and a circle.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'Point') {
            error('Bad geoJSON object: type !=="Point"');
        }
        let radius = 6.0;
        let coords = geoJSON.geometry.coordinates.slice(0, 2);
        
        let point = new paper.Group();
        point.pivot = new paper.Point(0,0);
        point.applyMatrix = true;
        
        let circle = new paper.Path.Circle(new paper.Point(0, 0), radius);
        circle.scale(new paper.Point(1, 0.5), new paper.Point(0, 0));
    
        point.addChild(circle);

        let stem = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(0, -radius));
        point.addChild(stem);
        
        let ball = new paper.Path.Circle(new paper.Point(0, -radius*1.5), radius/2);
        point.addChild(ball);
        
        point.position = new paper.Point(...coords);
        point.scaleFactor = point.project._scope.scaleByCurrentZoom(1);
        point.scale(point.scaleFactor, circle.bounds.center);
       
        point.rescale = point.rescale || {};
    
        point.rescale.size = function (z) {
            point.scale(1 / (point.scaleFactor * z));
            point.scaleFactor = 1 / z;
        };
        
        point.applyRescale();

        
        this.paperItem = point;

    }
    /**
     * Set the style properties of the point.
     * @param {Object} props - The style properties to set.
     * @description This method sets the style properties of the point using the provided properties object.
     */
    setStyle(props){
        //override default implementation so it doesn't overwrite the rescale properties
        // let rescale = props.rescale;
        // delete props.rescale;
        props.rescale = OpenSeadragon.extend(true, props.rescale, this.paperItem.rescale);
        this.paperItem.style.set(props);
        // this.paperItem.children[0].style.set(props);
    }
    
    /**
     * Retrieves the supported types by the Point annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype=null){
        return type.toLowerCase() === 'point' && subtype === null;
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'`
     */
    getGeoJSONType(){
        return {
            type: 'Point',
        }
    }


    /**
     * Retrieves the coordinates of the point.
     * @returns {Array} An array containing the x and y coordinates.
     * @description This method returns an array of coordinates representing the position of the point.
     */
    getCoordinates(){
        let item = this.paperItem;
        let circle = item.children[0];
        return [circle.bounds.center.x, circle.bounds.center.y];
    }
    /**
     * Retrieves the style properties of the point.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the point in JSON format.
     */
    getStyleProperties(){
        return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Perform actions during a transformation on the point.
     * @static
     * @param {string} operation - The type of transformation operation.
     * @description This static method performs actions during a transformation on the point, such as rotation or scaling. It handles both rotation and scaling transformations of the point annotation.
     */
    static onTransform(){
        let operation = arguments[0];
        switch(operation){
            case 'rotate':{
                let angle = arguments[1];
                let center = arguments[2];
                this.rotate(-angle, center); //undo the rotation: return to original position and orientation
                let vector = this.position.subtract(center);
                let newpos = center.add(vector.rotate(angle));
                let delta = newpos.subtract(this.position);
                this.translate(delta);
                break;
            }
            case 'scale':{
                let p = arguments[1]; //reference position
                let r = arguments[2]; //rotation
                let m = arguments[3]; //matrix

                this.matrix.append(m.inverted()); //undo previous operation
                let pos = this.pivot.transform(this.matrix);
                // let pos = this.pivot;
                let a = pos.subtract(p); // initial vector, unrotated
                let ar = a.rotate(-r); // initial vector, rotated
                let br = ar.multiply(m.scaling); //scaled rotated vector
                let b = br.rotate(r); //scaled unrotated vector
                let delta = b.subtract(a); //difference between scaled and unscaled position

                this.translate(delta);
                break;
            }
        }
    }

    // /**
    //  * Get the icon text for the point's icon.
    //  * @private
    //  * @returns {string} - The icon text.
    //  */
    // get iconText(){
    //     if(!this._iconText){
    //         this._makeIcon();
    //     }
    //     return this._iconText;
    // }
    // /**
    //  * Get the icon font family for the point's icon.
    //  * @private
    //  * @returns {string} - The icon font family.
    //  */
    // get iconFontFamily(){
    //     if(!this._iconFontFamily){
    //         this._makeIcon();
    //     }
    //     return this._iconFontFamily;
    // }
    // /**
    //  * Get the icon font weight for the point's icon.
    //  * @private
    //  * @returns {string} - The icon font weight.
    //  */
    // get iconFontWeight(){
    //     if(!this._iconFontWeight){
    //         this._makeIcon();
    //     }
    //     return this._iconFontWeight;
    // }
    
}
export{Point};
