// placeholder.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/paperitems/placeholder.mjs e52bae0: last modified Aug 17, 2023
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
 * Represents a placeholder annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Placeholder` class represents a placeholder annotation item. It inherits from the `AnnotationItem` class and provides methods to work with placeholder annotations.
 */
class Placeholder extends AnnotationItem{
    /**
     * Create a new Placeholder instance.
     * @param {Object} geoJSON - The GeoJSON object containing annotation data.
     * @property {paper.Path} _paperItem - The associated paper item representing the placeholder.
     * @description This constructor initializes a new placeholder annotation item based on the provided GeoJSON object.
     */
    constructor(geoJSON){
        super(geoJSON);
        
        this.paperItem = new paper.Path();
        // this.paperItem.style = this.paperItem.instructions = geoJSON;
        this.paperItem.style = geoJSON.properties;

        this.paperItem.initializeGeoJSONFeature = initialize;
    }
    /**
     * Retrieves the supported types by the Placeholder annotation item.
     * @static
     * @returns {Object} An object with type property set to null.
     * @description This static method provides information that the Placeholder annotation item does not have a specific type.
     */
    static get supportsType(){
        return {
            type: null
        }
    }
    /**
     * Retrieves the coordinates of the placeholder.
     * @returns {Array} An empty array.
     * @description This method returns an empty array since the Placeholder class does not have coordinates.
     */
    getCoordinates(){
        return [];
    }
    /**
     * Retrieves the properties of the placeholder.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the placeholder.
     */
    getProperties(){
        let item = this.paperItem;
        return item.style;
    }
    
}

export{Placeholder};

/**
 * Initializes a GeoJSON feature based on the provided geometry type and subtype.
 * @param {string} geoJSONGeometryType - The GeoJSON geometry type.
 * @param {string} geometrySubtype - The subtype of the geometry.
 * @returns {paper.Item} The created paper item.
 * @private
 * @description This function initializes a GeoJSON feature using the provided geometry type and subtype, and returns the corresponding paper item.
 */
function initialize(geoJSONGeometryType, geometrySubtype) {
    let item = this;
    // let geoJSON = item.instructions;
    let geoJSON = {
        geometry:{
            type: geoJSONGeometryType,
            coordinates: [],
            properties: {
                subtype:geometrySubtype,
            },
        },
        properties: item.style,
    };
    
    let newItem = paper.Item.fromGeoJSON(geoJSON);
    // newItem.selected=item.selected;
    item.replaceWith(newItem);
        
    return newItem;
}