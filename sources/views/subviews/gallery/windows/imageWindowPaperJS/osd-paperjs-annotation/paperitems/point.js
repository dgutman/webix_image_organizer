// point.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/paperitems/point.mjs e52bae0: last modified Aug 17, 2023
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
        let radius = 8.0;
        let coords = geoJSON.geometry.coordinates.slice(0, 2);
        
        let point = new paper.Group();
        point.pivot = new paper.Point(0,0);
        point.applyMatrix = true;
        
        let circle = new paper.Path.Circle(new paper.Point(0, 0), radius);
        circle.scale(new paper.Point(1, 0.5), new paper.Point(0, 0));
    
        point.addChild(circle);
    
    
        let textitem = new paper.PointText({
            point: new paper.Point(0, 0),
            pivot: new paper.Point(0, 0),
            content: this.iconText,
            fontFamily: this.iconFontFamily,
            fontWeight: this.iconFontWeight,
            fontSize: 18,
            strokeWidth: 1, //keep this constant
        });
        point.addChild(textitem);

        //to-do: make this automatic somehow, instead of hard-coded...
        //the problem is that the bounding box of the text for some reason is not tight to the visual object.
        textitem.translate(new paper.Point(-6, -2)); 
    
        point.position = new paper.Point(...coords);
        point.scaleFactor = point.project._scope.scaleByCurrentZoom(1);
        point.scale(point.scaleFactor, circle.bounds.center);
        textitem.strokeWidth = point.strokeWidth / point.scaleFactor;
    
        point.rescale = point.rescale || {};
    
        point.rescale.size = function (z) {
            point.scale(1 / (point.scaleFactor * z));
            point.scaleFactor = 1 / z;
            textitem.strokeWidth = 1; //keep constant; reset after strokewidth is set on overall item
        };
        
        point.rotate(-point.view.getRotation());
        point.view.on('rotate',function(ev){point.rotate(-ev.rotatedBy)});
        point.applyRescale();
        
        this.paperItem = point;

        // define style getter/setter so that style propagates to/from children
        Object.defineProperty(point, 'style', {   
            get: ()=>{ return point.children[0].style },
            set: style=> { point.children.forEach(child=>child.style = style); }
        });
        // override fillOpacity property definition so that style getter/setter doesn't mess with fillOpacity
        Object.defineProperty(point, 'fillOpacity', {   
            get: function(){
                return this._style.fillOpacity;
            },
            set: function(opacity){
                this._style.fillOpacity = opacity;
            }
        });
        
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
     * @returns {Object} An object with type property set to 'Point'.
     * @description This static method provides information that the Point annotation item has a type of 'Point'.
     */
    static get supportsType(){
        return {
            type: 'Point'
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

    /**
     * Get the icon text for the point's icon.
     * @private
     * @returns {string} - The icon text.
     */
    get iconText(){
        if(!this._iconText){
            this._makeIcon();
        }
        return this._iconText;
    }
    /**
     * Get the icon font family for the point's icon.
     * @private
     * @returns {string} - The icon font family.
     */
    get iconFontFamily(){
        if(!this._iconFontFamily){
            this._makeIcon();
        }
        return this._iconFontFamily;
    }
    /**
     * Get the icon font weight for the point's icon.
     * @private
     * @returns {string} - The icon font weight.
     */
    get iconFontWeight(){
        if(!this._iconFontWeight){
            this._makeIcon();
        }
        return this._iconFontWeight;
    }

    //private
    /**
     * Generate the icon text, font family, and font weight for the point's icon.
     * @private
     * @memberof OSDPaperjsAnnotation.Point
     * @returns {void}
     * @description This private method generates the necessary text content, font family, and font weight for the point's icon. It uses a hidden DOM element to extract the computed styles and content of the FontAwesome icon, which is then used to populate the icon properties.
     */
    _makeIcon(){
        //to-do: make the class(es) used to select a fontawesome icon a configurable option
        let domText = $('<i>', { class: 'fa-solid fa-map-pin', style: 'visibility:hidden;' }).appendTo('body');
        let computedStyle = window.getComputedStyle(domText[0], ':before');
        this._iconText = computedStyle.content.substring(1, 2);
        this._iconFontFamily = computedStyle.fontFamily;
        this._iconFontWeight = computedStyle.fontWeight;
        domText.remove();
    }
    
}
export{Point};
