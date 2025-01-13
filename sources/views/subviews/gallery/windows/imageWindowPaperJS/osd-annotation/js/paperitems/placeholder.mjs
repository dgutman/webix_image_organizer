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
 * Represents a placeholder annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Placeholder` class represents a placeholder annotation item. It inherits from the `AnnotationItem` class and provides methods to work with placeholder annotations.
 */
class Placeholder extends AnnotationItem{
    /**
     * Create a new Placeholder instance.
     * @property {paper.Path} paperItem - The associated paper item representing the placeholder.
     * @description This constructor initializes a new placeholder annotation item based on the provided GeoJSON object.
     */
    constructor(styleOpts){
        super({type:'Feature',geometry:null});
        
        this.paperItem = new paper.Path();
        // this.paperItem.style = this.paperItem.instructions = geoJSON;
        this.paperItem.style = new paper.Style(styleOpts);

        this.paperItem.initializeGeoJSONFeature = initialize;
    }

    /**
     * Retrieves the supported types by the Placeholder annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
    static supportsGeoJSONType(type, subtype = null){
        return type.toLowerCase() === null && subtype === null;
    }

    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === null`
     */
    getGeoJSONType(){
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