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

import { OpenSeadragon } from '../osd-loader.mjs';
import { paper } from '../paperjs.mjs';
import { AnnotationToolkit } from '../annotationtoolkit.mjs';

/**
 * Represents an annotation item that can be used in a map.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class AnnotationItem{
    /**
     * Creates a new AnnotationItem instance.
     * @param {Object} feature - The GeoJSON feature containing annotation data.
     * @throws {string} Throws an error if the GeoJSON geometry type is invalid.
     * @property {paper.Item|null} _paperItem - The associated paper item of the annotation.
     * @property {Object} _props - The properties of the annotation.
     * @description This constructor initializes a new annotation item based on the provided GeoJSON feature. It validates the GeoJSON geometry type and sets up the associated paper item and properties.
     */
    constructor(feature){
        if(GeometryTypes.includes( (feature.geometry?.type) || feature.geometry ) === false){
            throw('Bad GeoJSON Geometry type');
        }
        this._paperItem = null;
        this._props = feature.properties || {};
    }
    
    /**
     * Tests whether the geojson type and (optional) subtype are supported by this type of annotation item
     * @param { String } type 
     * @param  { String } [subtype] 
     * @returns { Boolean } The base class always returns false; inheritinc classes override this with class-specific logic
     */
    static supportsGeoJSONType(type, subtype){
        return false; // base class returns false
    }

    /**
     * @param {Object} obj the GeoJSON object to test
     * @returns {Boolean} whether this object is supported
     */
    _supportsGeoJSONObj(obj){
        return this.constructor.supportsGeoJSONType(obj.geometry?.type, obj.geometry?.properties?.subtype);
    }

    /**
     * Retrieves the coordinates of the annotation item.
     * @returns {Array} An array of coordinates.
     * @description This method returns an array of coordinates representing the position of the annotation item.
     */
    getCoordinates(){
        return []
    }
    /**
     * Retrieves the properties of the annotation item.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the annotation item.
     */
    getProperties(){
        return {}
    }
    /**
     * Retrieves the style properties of the annotation item.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the annotation item in JSON format.
     */
    getStyleProperties(){
        return this.paperItem.style.toJSON();
    }
    // static getGeometry(){}
    static onTransform(){}

    /**
     * Tests whether a given GeoJSON geometry type and optional `properties.subtype` are supported
     * @param { String } type
     * @param { String } [subtype]
     */
    supportsGeoJSONType(type, subtype){
        return this.constructor.supportsGeoJSONType(type, subtype);
    }
    /**
     * 
     * @returns {Object} object with fields 'type' and optionally 'subtype'
     */
    getGeoJSONType(){
        return {
            type: undefined,
            subtype: undefined
        }
    }
    /**
     * Retrieves the label of the annotation item.
     * @returns {string} The label.
     * @description This method returns the label associated with the annotation item. It looks for the
     * display name of the associated paper item or falls back to the subtype or type from supported types.
     */
    getLabel(){
        if(this.paperItem.displayName){
            return this.paperItem.displayName;
        } else {
            const typeInfo = this.getGeoJSONType();
            return typeInfo.subtype || typeInfo.type;
        }
    }
    /**
     * Retrieves the type of the annotation item.
     * @type {string}
     * @description This property returns the type from the supported types associated with the annotation item.
     */
    get type(){
        return this.getGeoJSONType().type;
    }
    /**
     * Retrieves the subtype of the annotation item.
     * @type {string}
     * @description This property returns the subtype from the supported types associated with the annotation item.
     */
    get subtype(){
        return this.getGeoJSONType().subtype;
    }

    get paperItem(){
        return this._paperItem;
    }
    
    /**
     * 
     * Sets the associated paper item of the annotation item.
     * @param {paper.Item|null} paperItem - The paper item.
     * @description This method sets the associated paper item of the annotation item. It also applies special properties
     * to the paper item to convert it into an annotation item.
     */
    set paperItem(paperItem){
        this._paperItem = paperItem;
        //apply special properties that make the paper.Item an AnnotationItem
        convertPaperItemToAnnotation(this);
    }

    // default implmentation; can be overridden for custom behavior by subclasses
    /**
     * Sets the style properties of the annotation item.
     * @param {Object} properties - The style properties to set.
     * @description This method sets the style properties of the annotation item using the provided properties object.
     */
    setStyle(properties){
        this._paperItem && this._paperItem.style.set(properties);
    }

    // default implementation; can be overridden for custom behavior by subclasses
    /**
     * Converts the annotation item to a GeoJSON feature.
     * @returns {Object} The GeoJSON feature.
     * @description This method converts the annotation item into a GeoJSON feature object. It includes the geometry,
     * properties, style, and other relevant information.
     */
    toGeoJSONFeature(){
        let geoJSON = {
            type:'Feature',
            geometry:this.toGeoJSONGeometry(),
            properties:{
                label:this.paperItem.displayName,
                selected:this.paperItem.selected,
                ...this.getStyleProperties(),
                userdata:this.paperItem.data.userdata,
            }
        }

        return geoJSON;
    }

    // default implementation; can be overridden for custom behavior by subclasses
    /**
     * Converts the annotation item to a GeoJSON geometry.
     * @returns {Object} The GeoJSON geometry.
     * @description This method converts the annotation item into a GeoJSON geometry object, which includes the type,
     * properties, and coordinates of the annotation.
     */
    toGeoJSONGeometry(){
        let geom = {
            type: this.type,
            properties: this.getProperties(),
            coordinates: this.getCoordinates(),
        }
        if(this.subtype){
            geom.properties = Object.assign(geom.properties, {subtype: this.subtype});
        }
        return geom;
    }

}
export{AnnotationItem};

/**
 * Array of valid geometry types for GeoJSON.
 * @constant
 * @type {string[]}
 * @private
 * @description This array contains valid geometry types that can be used in GeoJSON features.
 */
const GeometryTypes = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', null];

/**
 * Array of registered constructors for creating AnnotationItem instances.
 * @private
 * @type {Function[]}
 * @description This array stores the registered constructors that can be used to create AnnotationItem instances.
 */
const _constructors = [];

/**
 * Represents a factory for creating and managing AnnotationItem instances.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class AnnotationItemFactory{
    constructor(){
        // this._constructors=[];
    }
    /**
     * Register a constructor to the AnnotationItemFactory.
     * @static
     * @param {Function} ctor - The constructor function for creating AnnotationItem instances.
     * @throws {string} Throws an error if the provided constructor does not implement the necessary API.
     * @description This static method registers a constructor to the AnnotationItemFactory. It checks whether the constructor implements the required static accessor supportsGeoJSONType.
     */
    static register(ctor){
        //test whether the object has implemented the necessary API
        if(ctor.supportsGeoJSONType === AnnotationItem.supportsGeoJSONType){
            console.error('Static accessor supportsGeoJSONType must be implemented');
            throw('Static accessor supportsGeoJSONType must be implemented');
        }
        if(!_constructors.includes(ctor)){
            _constructors.push(ctor);
        }
    }
    /**
     * Get a constructor for creating an AnnotationItem instance based on a GeoJSON feature.
     * @static
     * @param {Object} geoJSON - The GeoJSON feature object.
     * @returns {Function|undefined} A constructor function or undefined if no matching constructor is found.
     * @description This static method retrieves a constructor from the registered constructors based on the provided GeoJSON feature. It matches the geometry type and subtype to determine the appropriate constructor.
     */
    static getConstructor(geoJSON){
        if(!('geometry' in geoJSON && 'properties' in geoJSON)){
            console.error('Invalid GeoJSON Feature object. Returning undefined.');
            return;
        }

        let geomType = geoJSON.geometry?.type;
        let geomSubtype = geoJSON.geometry?.properties?.subtype;

        let constructors = _constructors.filter(c=>c.supportsGeoJSONType(geomType, geomSubtype) );
        
        return constructors.slice(-1)[0]; //return the most recent constructor that supports this type
    }
    /**
     * Create an AnnotationItem instance from a GeoJSON feature.
     * @static
     * @param {Object} geoJSON - The GeoJSON feature object.
     * @returns {paper.Item|undefined} A paper.Item instance or undefined if no matching constructor is found.
     * @description This static method creates an AnnotationItem instance from a GeoJSON feature. It retrieves a matching constructor based on the GeoJSON geometry type and subtype, and then creates an AnnotationItem instance using that constructor.
     */
    static itemFromGeoJSON(geoJSON){ 
        if(GeometryTypes.includes(geoJSON.type)){
            geoJSON = {
                type: 'Feature',
                geometry: geoJSON,
                properties: {},
            }
        }
        let ctor = AnnotationItemFactory.getConstructor(geoJSON);
        if(ctor){
            let annotationItem = new ctor(geoJSON);
            annotationItem.paperItem.data.userdata = geoJSON.properties?.userdata;
            return annotationItem.paperItem;
        }
    }
    /**
     * Create an AnnotationItem instance from an existing AnnotationItem.
     * @static
     * @param {paper.Item} item - The paper.Item instance associated with an AnnotationItem.
     * @returns {paper.Item|undefined} A paper.Item instance created from the AnnotationItem, or undefined if the item is not associated with an AnnotationItem.
     * @description This static method creates a new paper.Item instance based on an existing AnnotationItem. It retrieves the underlying AnnotationItem and converts it to a GeoJSON feature. Then, it creates a new paper.Item using the `itemFromGeoJSON` method of the AnnotationItemFactory.
     */
    static itemFromAnnotationItem(item){
        if(!item.annotationItem){
            error('Only paper.Items constructed by AnnotationItem implementations are supported');
            return;
        }
        let geoJSON = {
            type:'Feature',
            geometry: item.annotationItem.toGeoJSONGeometry(),
            properties:item.annotationItem._props,
        };
        return AnnotationItemFactory.itemFromGeoJSON(geoJSON);
    }

}

export{AnnotationItemFactory};



/**
 * Convert a Paper.js item into an AnnotationItem.
 * @private
 * @param {AnnotationItem} annotationItem - The AnnotationItem instance.
 * @description This function takes an AnnotationItem instance and converts the associated paper item into an
 * AnnotationItem by enhancing it with special properties and behaviors.
 */
function convertPaperItemToAnnotation(annotationItem){
    let item = annotationItem.paperItem;
    let constructor = annotationItem.constructor;
    let properties = annotationItem._props;

    AnnotationToolkit.registerFeature(item);
    item.onTransform = constructor.onTransform;

    //style
    annotationItem.setStyle(properties);

    //set fillOpacity property based on initial fillColor alpha value
    item.fillOpacity = item.fillColor ? item.fillColor.alpha : 1;

    //displayName
    item.displayName = properties.label || annotationItem.getLabel();

    item.annotationItem = annotationItem;
    
    //enhance replaceWith functionatily
    item.replaceWith = enhancedReplaceWith;

    //selected or not
    if('selected' in properties){
        item.selected = properties.selected;
    }
}

/**
 * Enhance the `replaceWith` functionality of Paper.js items.
 * @private
 * @param {paper.Item} newItem - The new item to replace with.
 * @returns {paper.Item} The replaced item.
 * @description This function enhances the `replaceWith` functionality of Paper.js items by providing additional
 * behaviors and properties for the replacement item.
 */
function enhancedReplaceWith(newItem){
    if(!newItem.isGeoJSONFeature){
        console.warn('An item with isGeoJSONFeature==false was used to replace an item.');
    }
    newItem._callbacks = this._callbacks;
    let rescale = OpenSeadragon.extend(true,this.rescale,newItem.rescale);
    newItem.style = this.style; //to do: make this work with rescale properties, so that rescale.strokeWidth doesn't overwrite other props
    newItem.rescale=rescale;
    //replace in the paper hierarchy
    this.emit('item-replaced',{item:newItem});
    newItem.project.emit('item-replaced',{item:newItem});
    paper.Item.prototype.replaceWith.call(this, newItem);
    newItem.selected = this.selected;
    newItem.updateFillOpacity();
    newItem.applyRescale();
    newItem.project.view.update();
    return newItem;
}