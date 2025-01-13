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

/**
 * Represents a point with text annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `PointText` class represents a point with text annotation item. It inherits from the `AnnotationItem` class and provides methods to work with point text annotations.
 */
class PointText extends AnnotationItem{
     /**
     * Create a new PointText instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @property {paper.Group} _paperItem - The associated paper item representing the point with text.
     * @description This constructor initializes a new point with text annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);

        if (geoJSON.geometry.type !== 'Point') {
            error('Bad geoJSON object: type !=="Point"');
        }
        let radius = 4.0;
        let coords = geoJSON.geometry.coordinates.slice(0, 2);
        
        let point = this.paperItem = new paper.Group();

        point.pivot = new paper.Point(0,0);
        point.applyMatrix = true;
        
        let circle = new paper.Path.Circle(new paper.Point(0, 0), radius);
        // circle.scale(new paper.Point(1, 0.5), new paper.Point(0, 0));
    
        point.addChild(circle);
    
    
        let textitem = new paper.PointText({
            point: new paper.Point(0, 0),
            pivot: new paper.Point(0, 0),
            content: geoJSON.geometry.properties.content || 'PointText',
            fontSize: 18,
            strokeWidth: 1, //keep this constant
        });
        point.addChild(textitem);
        // To do: option to hide the point unless the text is moused over?
        // textitem.on({
        //     mouseenter: function(event) {
        //         circle.visible = true;
        //     },
        //     mouseleave: function(event) {
        //         circle.visible = false;
        //     }
        // });

        this.refreshTextOffset();
        textitem.on('content-changed',()=>{
            this.refreshTextOffset();
        })
    
        point.position = new paper.Point(...coords);
        point.scaleFactor = point.project._scope.scaleByCurrentZoom(1);
        point.scale(point.scaleFactor, circle.bounds.center);
        // textitem.strokeWidth = point.strokeWidth / point.scaleFactor;
    
        point.rescale = point.rescale || {};
    
        point.rescale.size = function (z) {
            point.scale(1 / (point.scaleFactor * z));
            point.scaleFactor = 1 / z;
            textitem.strokeWidth = 0; //keep constant; reset after strokewidth is set on overall item
        };

        function handleFlip(){
            // const angle = point.view.getRotation(); 
            const angle = point.view.getFlipped() ? point.view.getRotation() : 180 - point.view.getRotation();
            point.rotate(-angle);
            point.scale(-1, 1);
            point.rotate(angle);
        }
        
        if(point.view.getFlipped()){
            handleFlip();  
        }
        const offsetAngle = point.view.getFlipped() ? 180 - point.view.getRotation() : -point.view.getRotation();
        point.rotate(offsetAngle);  

        point.view.on('rotate',ev => {
            const angle = -ev.rotatedBy;
            point.rotate(angle)
        });
        point.view.on('flip', () => {
            handleFlip();
        });
        point.applyRescale();
        


    }
    /**
     * Set the style properties of the point with text.
     * @param {Object} props - The style properties to set.
     * @description This method sets the style properties of the point with text using the provided properties object.
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
     * Get the text item associated with the point.
     * @returns {paper.PointText} The associated text item.
     */
    get textitem(){
        return this.paperItem.children[1];
    }

    /**
     * Get the circle that represents the point.
     * @returns {paper.Path.Circle} The circle
     */
    get circle(){
        return this.paperItem.children[0];
    }

    /**
     * Retrieves the supported types by the PointText annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype){
        return type.toLowerCase() === 'point' && subtype?.toLowerCase() === 'pointtext';
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'PointText'`
     */
    getGeoJSONType(){
        return {
            type: 'Point',
            subtype: 'PointText'
        }
    }

    /**
    * Get the coordinates of the point.
    * @returns {Array<number>} The coordinates of the point.
    */
    getCoordinates(){
        let item = this.paperItem;
        let circle = item.children[0];
        return [circle.bounds.center.x, circle.bounds.center.y];
    }
    /**
     * Get the properties of the point.
     * @returns {Object} The properties of the point.
     */
    getProperties(){
        let item = this.paperItem;
        return {
            content: item.children[1].content,
        };
    }
    /**
     * Get the style properties of the point.
     * @returns {Object} The style properties of the point.
     */
    getStyleProperties(){
        return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Handle transformation operations on the point.
     * @static
     * @param {string} operation - The type of transformation operation.
     * @description This static method handles transformation operations on the point annotation.
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

    refreshTextOffset(){
        const flipped = this.textitem.view.getFlipped();
        let boundsNoRotate = this.textitem.getInternalBounds();
        let offsetX = boundsNoRotate.width / 2 / this.textitem.layer.scaling.x * (flipped ? 1 : -1);
        let offsetY = -boundsNoRotate.height / 2 / this.textitem.layer.scaling.x;
        let rotation = flipped ? 180 - this.textitem.view.getRotation() : this.textitem.view.getRotation();
        let offset = new paper.Point(offsetX, offsetY).divide(this.textitem.view.getZoom()).rotate(-rotation);
        this.textitem.position = this.circle.bounds.center.add(offset);
    }
    
}
export{PointText};

