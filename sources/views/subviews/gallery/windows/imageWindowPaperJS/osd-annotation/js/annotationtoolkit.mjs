/**
 * OpenSeadragon annotation plugin based on paper.js
 * @version 0.4.12
 * 
 * Includes additional open source libraries which are subject to copyright notices
 * as indicated accompanying those segments of code.
 * 
 * Original code:
 * Copyright (c) 2022-2023, Thomas Pearce
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
 * * Neither the name of this project nor the names of its
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


import { OpenSeadragon } from './osd-loader.mjs';
import { paper } from './paperjs.mjs';
import { AnnotationUI } from './annotationui.mjs';
import { PaperOverlay } from './paper-overlay.mjs';
import { AnnotationItemFactory } from './paperitems/annotationitem.mjs';
import { MultiPolygon } from './paperitems/multipolygon.mjs';
import { Placeholder } from './paperitems/placeholder.mjs';
import { Linestring } from './paperitems/linestring.mjs';
import { MultiLinestring } from './paperitems/multilinestring.mjs';
import { Raster } from './paperitems/raster.mjs';
import { Point } from './paperitems/point.mjs';
import { PointText } from './paperitems/pointtext.mjs';
import { Rectangle } from './paperitems/rectangle.mjs';
import { Ellipse } from './paperitems/ellipse.mjs';
import { cyrb53 } from './utils/hash.mjs';

//extend paper prototypes to add functionality
//property definitions

Object.defineProperty(paper.Item.prototype, 'displayName', displayNamePropertyDef());
Object.defineProperty(paper.Item.prototype, 'featureCollection', featureCollectionPropertyDef());
Object.defineProperty(paper.TextItem.prototype, 'content', textItemContentPropertyDef());
Object.defineProperty(paper.Project.prototype, 'descendants', descendantsDefProject());

//extend remove function to emit events for GeoJSON type annotation objects
let origRemove=paper.Item.prototype.remove;
paper.Item.prototype.remove=function(){
    const childrenToFireRemove = this.getItems({match: item=>item.isGeoJSONFeatureCollection});
    (this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.project.emit('item-removed',{item: this});
    childrenToFireRemove.forEach(fc => this.project.emit('item-removed', {item: fc}));
    origRemove.call(this);
    (this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.emit('removed',{item: this});
    childrenToFireRemove.forEach(fc => fc.emit('removed', {item: fc}));
}
//function definitions
paper.Group.prototype.insertChildren=getInsertChildrenDef();
paper.Color.prototype.toJSON = paper.Color.prototype.toCSS;//for saving/restoring colors as JSON
paper.Style.prototype.toJSON = styleToJSON;
paper.View.prototype.getImageData = paperViewGetImageData;
paper.PathItem.prototype.toCompoundPath = toCompoundPath;
paper.PathItem.prototype.applyBounds = applyBounds;
paper.Item.prototype.select = paperItemSelect;
paper.Item.prototype.deselect = paperItemDeselect;
paper.Item.prototype.toggle = paperItemToggle;
//to do: should these all be installed on project instead of scope?
paper.PaperScope.prototype.findSelectedNewItem = findSelectedNewItem;
paper.PaperScope.prototype.findSelectedItems = findSelectedItems;
paper.PaperScope.prototype.findSelectedItem = findSelectedItem;
paper.PaperScope.prototype.scaleByCurrentZoom = function (v) { return v / this.view.getZoom(); };
paper.PaperScope.prototype.getActiveTool = function(){ return this.tool ? this.tool._toolObject : null; }        


/**
 * A class for creating and managing annotation tools on an OpenSeadragon viewer.
 * @class 
 * @memberof OSDPaperjsAnnotation
 * @extends OpenSeadragon.EventSource
 */
class AnnotationToolkit extends OpenSeadragon.EventSource{
    /**
     * Create a new AnnotationToolkit instance.
     * @constructor
     * @param {OpenSeadragon.Viewer} openSeadragonViewer - The OpenSeadragon viewer object.
     * @param {object} [opts]
     * @param {object} [opts.addUI] a configuration object for the UI, if desired
     * @param {object} [opts.overlay] a PaperOverlay object to use
     * @param {object} [opts.destroyOnViewerClose] whether to destroy the toolkit and its overlay when the viewer closes
     * @param {object} [opts.cacheAnnotations] whether to keep annotations in memory for images which aren't currently open
     */
    constructor(openSeadragonViewer, opts = {}) {
        super();

        
        if(!opts){
            opts = {};
        }

        this._defaultOptions = {
            addUI: false,
            overlay: null,
            destroyOnViewerClose: false,
            cacheAnnotations: false,
        }
        this.options = Object.assign({}, this._defaultOptions, opts);
        
        this._defaultStyle = {
            fillColor: new paper.Color('white'),
            strokeColor: new paper.Color('black'),
            fillOpacity:1,
            strokeOpacity:1,
            strokeWidth: 1,
            rescale: {
                strokeWidth: 1
            }
        };
        this.viewer = openSeadragonViewer;
        
        // set up overlay. If one is passed in, use it. Otherwise, create one.
        if(this.options.overlay){
            if(this.options.overlay instanceof PaperOverlay){
                this.overlay = this.options.overlay;
            }
        } else {
            this.overlay = new PaperOverlay(this.viewer, {type: 'image'});
        }
        this.paperScope.project.defaultStyle = new paper.Style();
        this.paperScope.project.defaultStyle.set(this.defaultStyle);

        // set the overlay to auto rescale items
        this.overlay.autoRescaleItems(true);

        // optionally destroy the annotation toolkit when the viewer closes
        if(this.options.destroyOnViewerClose){
            this.viewer.addOnceHandler('close', ()=>this.destroy());
        }

        //bind a reference to this to the viewer and the paperScope, for convenient access
        this.viewer.annotationToolkit = this;
        this.paperScope.annotationToolkit = this;

        this.viewer.world.addHandler('add-item',ev=>{
            if(this.options.cacheAnnotations){
                this._loadCachedAnnotations(ev.item);
            }
        })
        this.viewer.world.addHandler('remove-item',ev=>{
            if(this.options.cacheAnnotations){
                this._cacheAnnotations(ev.item);
            }
        }, false, 1);


        //register item constructors
        AnnotationItemFactory.register(MultiPolygon);
        AnnotationItemFactory.register(Placeholder);
        AnnotationItemFactory.register(Linestring);
        AnnotationItemFactory.register(MultiLinestring);
        AnnotationItemFactory.register(Raster);
        AnnotationItemFactory.register(Point);
        AnnotationItemFactory.register(PointText);
        AnnotationItemFactory.register(Rectangle);
        AnnotationItemFactory.register(Ellipse);

        paper.Item.fromGeoJSON = AnnotationItemFactory.itemFromGeoJSON;
        paper.Item.fromAnnotationItem = AnnotationItemFactory.itemFromAnnotationItem;

        this._cached = {};

        if(this.options.addUI){
            let uiOpts = {}
            if(typeof opts.addUI === 'object'){
                uiOpts = this.options.addUI;
            }
            this.addAnnotationUI(uiOpts)
        }

    }

    /**
     * Get the default style for the annotation items.
     * 
     * @returns {object} The default style object.
     */
    get defaultStyle(){
        return this._defaultStyle;
    }
    
    /**
     * Get the default style for the annotation items.
     * 
     * @returns {object} The default style object.
     */
    get annotationUI(){
        return this._annotationUI;
    }


    /**
     * Get the paperScope associated with this toolkit
     * 
     * @returns {object} The paperScope object for this toolkit's PaperOverlay.
     */
    get paperScope(){
        return this.overlay.paperScope;
    }

    /**
     * Empty any cached annotations
     */
    clearCache(){
        this._cached = {};
    }

    /**
     * save the current feature collections to the cache
     * @param {TiledImage} tiledImage 
     * @private
     */
    _cacheAnnotations(tiledImage){
        try{
            const key = cyrb53(JSON.stringify(tiledImage.source));
            const featureCollections = tiledImage.paperLayer.getItems({match: item=>item.isGeoJSONFeatureCollection});
            this._cached[key] = featureCollections;
        } catch(e){
            console.error('Error with caching', e);
        }
    }

    _loadCachedAnnotations(tiledImage){
        try{
            const key = cyrb53(JSON.stringify(tiledImage.source));
            const featureCollections = this._cached[key] || [];
            for(const fcGroup of featureCollections){
                this._addFeatureCollectionGroupToLayer(fcGroup, tiledImage.paperLayer);
            }
        } catch(e){
            console.error('Error with fetching from cache', e);
        }
    }

    /**
     * Add an annotation UI to the toolkit.
     * 
     * @param {object} [opts={}] - The options for the annotation UI.
     * @returns {AnnotationUI} The annotation UI object.
     */
    addAnnotationUI(opts = {}){
        if (!this._annotationUI) this._annotationUI = new AnnotationUI(this, opts);
        return this._annotationUI;
    }
    /**
     * Destroy the toolkit and its components.
     */
    destroy() {
        this.raiseEvent('before-destroy');
        let tool=this.paperScope && this.paperScope.getActiveTool();
        if(tool) tool.deactivate(true);

        this.viewer.annotationToolkit = null;
        this._annotationUI && this._annotationUI.destroy();
        this.overlay.destroy();
        this.raiseEvent('destroy');
    }
    /**
     * Close the toolkit and remove its feature collections.
     */
    close() {
        this.raiseEvent('before-close');
        let tool=this.paperScope && this.paperScope.getActiveTool();
        if(tool) tool.deactivate(true);

        this.addFeatureCollections([],true);
    }
    /**
     * Set the global visibility of the toolkit.
     * @param {boolean} [show=false] - Whether to show or hide the toolkit.
     */
    setGlobalVisibility(show = false){
        this.paperScope.view._element.setAttribute('style', 'visibility:' + (show ? 'visible;' : 'hidden;'));
    }
    /**
     * Add feature collections to the toolkit from GeoJSON objects.
     * @param {object[]} featureCollections - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     * @param {OpenSeadragon.TiledImage | OpenSeadragon.Viewport | false} [parentImage] - which image to add the feature collections to
     */
    addFeatureCollections(featureCollections,replaceCurrent, parentImage){
        this.loadGeoJSON(featureCollections,replaceCurrent, parentImage);
        this.overlay.rescaleItems();
        this.paperScope.project.emit('items-changed');
    }
    /**
     * Get the feature collection groups that the toolkit is managing.
     * @param {paper.Layer} [parentLayer]  The layer to find feature collections within. If not specified, finds across all layers.
     * @returns {paper.Group[]} The array of paper groups representing feature collections.
     */
    getFeatureCollectionGroups(parentLayer){
        // return this.overlay.paperScope.project.layers.filter(l=>l.isGeoJSONFeatureCollection);
        return this.paperScope.project.getItems({match: item=>item.isGeoJSONFeatureCollection && (parentLayer ? item.layer === parentLayer : true)});
    }
    /**
     * Get the features in the toolkit.
     * @returns {paper.Item[]} The array of paper item objects representing features.
     */
    getFeatures(){
        return this.paperScope.project.getItems({match:i=>i.isGeoJSONFeature});
    }
     /**
     * Register an item as a GeoJSONFeature that the toolkit should track
     * @param {paper.Item} item - The item to track as a geoJSONFeature
     */
    static registerFeature(item){
        item.isGeoJSONFeature = true;
    }
     /**
     * Register a group as a GeoJSONFeatureCollection that the toolkit should track
     * @param {paper.Group} group - The group to track as a geoJSONFeatureCollection
     */
    static registerFeatureCollection(group){
        group.isGeoJSONFeatureCollection = true;
    }

    /**
     * Convert the feature collections in the toolkit to GeoJSON objects.
     * @param {Object} [options] 
     * @param {Layer} [options.layer] The specific layer to use
     * @returns {Object[]} The array of GeoJSON objects representing feature collections.
     */
    toGeoJSON(options){
        const defaults = {
            layer:null,
        }
        options = Object.assign(defaults, options);

        const parent = options.layer || this.paperScope.project;
        //find all featureCollection items and convert to GeoJSON compatible structures
        return parent.getItems({match:i=>i.isGeoJSONFeatureCollection}).map(grp=>{
            
            let geoJSON = {
                type:'FeatureCollection',
                features: grp.descendants.filter(d=>d.annotationItem).map(d=>d.annotationItem.toGeoJSONFeature()),
                properties:{
                    defaultStyle: grp.defaultStyle.toJSON(),
                    userdata: grp.data.userdata,
                },
                label:grp.displayName,
            }
            
            return geoJSON;
        })
    }
    
    /**
     * Convert the feature collections in the project to a JSON string.
     * @param {function} [replacer] - The replacer function for JSON.stringify().
     * @param {number|string} [space] - The space argument for JSON.stringify().
     * @returns {string} The JSON string representing the feature collections.
     */
    toGeoJSONString(replacer,space){
        return JSON.stringify(this.toGeoJSON(),replacer,space);
    }
    /**
     * Load feature collections from GeoJSON objects and add them to the project.
     * @param {object[]} geoJSON - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     * @param {OpenSeadragon.TiledImage | OpenSeadragon.Viewport | false} [parentImage] - Which image (or viewport) to add the object to
     * @param {boolean} [pixelCoordinates]
     */
    loadGeoJSON(geoJSON, replaceCurrent, parentImage){
        let parentLayer = parentImage ? parentImage.paperLayer : false;
        if(replaceCurrent){
            this.getFeatureCollectionGroups(parentImage).forEach(grp=>grp.remove());
        }
        if(!Array.isArray(geoJSON)){
            geoJSON = [geoJSON];
        }
        
        geoJSON.forEach(obj=>{
            if(obj.type=='FeatureCollection'){
                let group = this._createFeatureCollectionGroup({label: obj.label, parent: parentLayer});
                let props = (obj.properties || {});
                group.data.userdata = Object.assign({},props.userdata);
                group.defaultStyle.set(props.defaultStyle);
                obj.features.forEach(feature=>{
                    let item = paper.Item.fromGeoJSON(feature);
                    group.addChild(item);
                })
            }
            else{
                console.warn('GeoJSON object not loaded: wrong type. Only FeatureCollection objects are currently supported');
            }
        })
    }

    /**
     * Add a new, empty FeatureCollection with default label and parent
     * @returns {paper.Group} The paper group object representing the feature collection.
     */
    addEmptyFeatureCollectionGroup(){
        return this._createFeatureCollectionGroup();
    }
    
    /**
     * Create a new feature collection group in the project scope.
     * @private
     * @param {Object} [opts] - Object with fields label and parent
     * @returns {paper.Group} The paper group object representing the feature collection.
     */
    _createFeatureCollectionGroup(opts = {}) {
        let defaultOpts = {
            label:null,
            parent:null
        }
        opts = Object.assign({}, defaultOpts, opts);

        let displayLabel = opts.label;
        
        let parent = opts.parent;
        if(!parent){
            let numItems = this.viewer.world.getItemCount();
            if( numItems == 1){
                parent = this.viewer.world.getItemAt(0).paperLayer;
            } else if (numItems == 0){
                parent = this.viewer.viewport.paperLayer;
            } else {
                //TODO: Update the UI and associated APIs to allow selecting specific tiled images for multi-image use
                console.warn('Use of AnnotationToolkit with multi-image is not yet fully supported. All annotations will be added to the top-level tiled image.');
                parent = this.viewer.world.getItemAt(numItems - 1).paperLayer;
            }
        }
        if(!parent){
            console.error('Failed to create feature collection group: no parent could be found');
            return;
        }

        let grp = new paper.Group();
        this._addFeatureCollectionGroupToLayer(grp, parent);
        let grpNum = this.getFeatureCollectionGroups().length;
        grp.name = grp.displayName = displayLabel!==null ? displayLabel : `Annotation Group ${grpNum}`;
        grp.defaultStyle = new paper.Style(this.paperScope.project.defaultStyle);
        return grp;
    }

    _addFeatureCollectionGroupToLayer(fcGroup, layer){
        layer.addChild(fcGroup);
        AnnotationToolkit.registerFeatureCollection(fcGroup);
        this.paperScope.project.emit('feature-collection-added',{group:fcGroup});
        // re-insert children to trigger events
        if(fcGroup.children){
            fcGroup.insertChildren(0, fcGroup.children);
        }
    }

    /**
     * Make a placeholder annotation item
     * @param {Object} style - options (e.g strokeColor) to pass to the paper item
     */
    makePlaceholderItem(style){
        return new Placeholder(style);
    }
    
};

export {AnnotationToolkit as AnnotationToolkit};



// private functions

/**
 * Create a compound path from a path item.
 * @private
 * @returns {paper.CompoundPath} The compound path object.
 */
function toCompoundPath() {
    if (this.constructor !== paper.CompoundPath) {
        let np = new paper.CompoundPath({ children: [this], fillRule: 'evenodd' });
        np.selected = this.selected;
        this.selected = false;
        return np;
    }
    return this;
}
/**
 * Apply bounds to a path item.
 * @private
 * @param {paper.Item[]} boundingItems - The array of paper items to use as bounds.
 */
function applyBounds(boundingItems) {
    if (boundingItems.length == 0)
        return;
    let intersection;
    if (boundingItems.length == 1) {
        let bounds = boundingItems[0];
        intersection = bounds.intersect(this, { insert: false });
    }
    else if (boundingItems.length > 1) {
        let bounds = new paper.CompoundPath(boundingItems.map(b => b.clone().children).flat());
        intersection = bounds.intersect(this, { insert: false });
        bounds.remove();
    }
    if (this.children) {
        //compound path
        this.removeChildren();
        this.addChildren(intersection.children ? intersection.children : [intersection]);
    }
    else {
        //simple path
        this.segments = intersection.segments ? intersection.segments : intersection.firstChild.segments;
    }

}
/**
 * Select a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemSelect(keepOtherSelectedItems) {
    if(!keepOtherSelectedItems){
        this.project._scope.findSelectedItems().forEach(item => item.deselect());
    }
    this.selected = true;
    this.emit('selected');
    this.project.emit('item-selected', { item: this });
}
/**
 * Deselect a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemDeselect(keepOtherSelectedItems) {
    if(!keepOtherSelectedItems){
        this.project._scope.findSelectedItems().forEach(item => item.deselect(true));
        return;
    }
    this.selected = false;
    this.emit('deselected');
    this.project.emit('item-deselected', { item: this });
}
/**
 * Toggle the selection of a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemToggle(keepOtherSelectedItems) {
    this.selected ? this.deselect(keepOtherSelectedItems) : this.select(keepOtherSelectedItems);
}

/**
 * Find the selected new item in the project scope.
 * @private
 * @returns {paper.Item} The selected new item, or null if none exists.
 */
function findSelectedNewItem() {
    //to do: change this to use type=='Feature' and geometry==null to match GeoJSON spec and AnnotationItemPlaceholder definition
    return this.project.getItems({ selected:true, match: function (i) { return i.isGeoJSONFeature && i.initializeGeoJSONFeature; } })[0];
}
/**
 * Find the selected items in the project scope.
 * @private
 * @returns {paper.Item[]} The array of selected items, or an empty array if none exists.
 */
function findSelectedItems() {
    return this.project.getItems({ selected: true, match: function (i) { return i.isGeoJSONFeature; } });
}
/**
 * Find the first selected item in the project scope.
 * @private
 * @returns {paper.Item} The first selected item, or null if none exists.
 */
function findSelectedItem() {
    return this.findSelectedItems()[0];
}



/**
 * Define the display name property for a paper item object.
 * The display name property defines the name used to identify a paper item object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the display name property.
 *   @param {string} input - The display name value.
 * @property {function} get - The getter function for the display name property.
 *   @returns {string} The display name value.
 */
function displayNamePropertyDef(){
    return {
        set: function displayName(input){
            if(Array.isArray(input)){
                this._displayName = new String(input[0]);
                this._displayName.source=input[1];
            }
            else{
                this._displayName = input;
            }
            this.name = this._displayName;
            this.emit('display-name-changed',{displayName:this._displayName});
        },
        get: function displayName(){
            return this._displayName;
        }
    }
}

/**
 * Define the featureCollection property for a paper item object.
 * @private
 */
function featureCollectionPropertyDef(){
    return {
        get: function fc(){
            return this.hierarchy.filter(i=>i.isGeoJSONFeatureCollection)[0];
        }
    }
}


/**
 * Define the descendants property for a paper project object.
 * The descendants property represents all the descendants (layers and their children) of a paper project object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array of paper item objects representing the descendants.
 */
function descendantsDefProject(){
    return {
        get: function descendants(){
            // return this.layers ? this.layers.filter(layer=>layer.isGeoJSONFeatureCollection).map(child=>child.descendants).flat() : [this];
            return this.layers ? this.getItems({match: item=>item.isGeoJSONFeatureCollection}).map(child=>child.descendants).flat() : [this];
        }
    }
}

/**
 * Convert a paper style object to a JSON object.
 * @private
 * @returns {object} The JSON object representing the style.
 */
function styleToJSON(){
    let output={};
    Object.keys(this._values).forEach(key=>{
        output[key] = this[key];//invoke getter
    })
    return output;
}
/**
 * Get the image data of a paper view element.
 * @private
 * @returns {ImageData} The image data object of the view element.
 */
function paperViewGetImageData(){
    return this.element.getContext('2d').getImageData(0,0,this.element.width, this.element.height);
}

/**
 * Get the insert children method definition for a paper group object.
 * The insert children method emits events when children are added to the paper group object.
 * @private
 * @returns {function} The insert children method that emits events when children are added.
 */
function getInsertChildrenDef(){
    let origInsertChildren = paper.Group.prototype.insertChildren.original || paper.Group.prototype.insertChildren;
    function insertChildren(){ 
        let output = origInsertChildren.apply(this,arguments); 
        let index = arguments[0], children=Array.from(arguments[1]);
        children&&children.forEach((child,i)=>{
            if(child.isGeoJSONFeature){
                let idx = typeof index !== 'undefined' ? index+1 : -1; 
                this.emit('child-added',{item:child,index:idx});
            } 
        });
        return output;
    }
    insertChildren.original = origInsertChildren;
    return insertChildren;
}

/**
 * Define the fill opacity property for a paper style object.
 *  @private
 *  @returns {object} The property descriptor object with the following properties:
 * - get: A function that returns the text of the item.
 * - set: A function that sets the text of the item and causes the 'content-changed' event to be fired.
 */
function textItemContentPropertyDef(){
    let _set = paper.TextItem.prototype._setContent || Object.getOwnPropertyDescriptor(paper.TextItem.prototype, 'content').set;
    paper.TextItem.prototype._setContent = _set;
    return{
        get: function() {
            return this._content;
        },
        set: function(content) {
            _set.call(this, content);
            this.emit('content-changed');
        },
    }
}