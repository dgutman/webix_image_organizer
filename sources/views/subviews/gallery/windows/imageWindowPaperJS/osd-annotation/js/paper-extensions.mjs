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

import { paper } from './paperjs.mjs';
import { OpenSeadragon } from './osd-loader.mjs';


// monkey patch to fix view.zoom when negative scaling is applied
paper.View.prototype.getZoom = function() {
    var scaling = this._decompose().scaling;
    // Use average since it can be non-uniform.
    return (Math.abs(scaling.x) + Math.abs(scaling.y)) / 2;
}

// monkey patch to fix non-rounded canvas sizes
paper.CanvasView.prototype._setElementSize.base = function(width, height) {
    var element = this._element;
    width = Math.round(width);
    height = Math.round(height);
    if (element) {
        if (element.width !== width)
            element.width = width;
        if (element.height !== height)
            element.height = height;
    }
},

/**
 * Sets the rotation of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {number} degrees - The number of degrees to rotate.
 * @param {any} center - The center point of the rotation.
 */
paper.View.prototype.setRotation = function(degrees, center){
    let degreesToRotate = degrees - (this._rotation || 0)
    this.rotate(degreesToRotate, center);
    this._rotation = OpenSeadragon.positiveModulo(degrees, 360);
    this.emit('rotate',{rotatedBy:degreesToRotate, currentRotation:this._rotation, center:center});
}

/**
 * Sets the flip of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {Boolean} flipped - Whether the view is flipped or not.
 * @param { number } currentRotation - the current rotation of the viewer in degrees
 */
paper.View.prototype.setFlipped = function(flipped, currentRotation){
    const isFlipped = this.getFlipped();
    if(flipped !== isFlipped){
        this.rotate(-currentRotation);
        this.scale(-1, 1);
        this.rotate(currentRotation);
        this.emit('flip',{flipped: flipped});
    }
}

/**
 * Gets the current flipped status of the of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {Boolean} flipped - Whether the view is flipped or not.
 */
paper.View.prototype.getFlipped = function(flipped){
    return this.scaling.x * this.scaling.y < 0;
}

Object.defineProperty(paper.Item.prototype, 'hierarchy', hierarchyDef());
Object.defineProperty(paper.Item.prototype, 'descendants', descendantsDef());
Object.defineProperty(paper.Item.prototype, 'fillOpacity', itemFillOpacityPropertyDef());
Object.defineProperty(paper.Item.prototype, 'strokeOpacity', itemStrokeOpacityPropertyDef());
Object.defineProperty(paper.Item.prototype, 'rescale', itemRescalePropertyDef());
Object.defineProperty(paper.Item.prototype, 'stroke', strokePropertyDefItem());
Object.defineProperty(paper.Style.prototype, 'fillOpacity', fillOpacityPropertyDef());
Object.defineProperty(paper.Style.prototype, 'strokeOpacity', strokeOpacityPropertyDef());
Object.defineProperty(paper.Style.prototype, 'rescale', rescalePropertyDef());
Object.defineProperty(paper.CompoundPath.prototype, 'descendants', descendantsDefCompoundPath());//this must come after the Item prototype def to override it
Object.defineProperty(paper.Project.prototype, 'hierarchy', hierarchyDef());
Object.defineProperty(paper.Project.prototype, 'fillOpacity', itemFillOpacityPropertyDef());
Object.defineProperty(paper.View.prototype, 'fillOpacity', viewFillOpacityPropertyDef());
Object.defineProperty(paper.View.prototype, '_fillOpacity',{value: 1, writable: true});//initialize to opaque
Object.defineProperty(paper.Project.prototype, 'strokeOpacity', itemStrokeOpacityPropertyDef());

paper.Item.prototype.updateFillOpacity = updateFillOpacity;
paper.Item.prototype.updateStrokeOpacity = updateStrokeOpacity;
paper.Project.prototype.updateFillOpacity = updateFillOpacity;
paper.View.prototype._multiplyOpacity = true;
paper.Style.prototype.set= styleSet;
paper.Item.prototype.applyRescale = applyRescale;

/**
 * Define the set method for a paper style object.
 * @private
 * @param {object|paper.Style} style - The style object to set.
 */
function styleSet(style){

    var isStyle = style instanceof paper.Style,
        values = isStyle ? style._values : style;
    if (values) {
        for (var key in values) {
            // console.log('setting',key)
            if (key in this._defaults || paper.Style.prototype.hasOwnProperty(key)) {
                var value = values[key];
                this[key] = value && isStyle && value.clone
                        ? value.clone() : value ;
            }
        }
    }
	
}
/**
 * Item.updateFillOpacity (paper extension)
 * Update the fill opacity of a paper item and its descendants.
 */

function updateFillOpacity(){
    this._computedFillOpacity = this.hierarchy.filter(item=>'fillOpacity' in item && (item._multiplyOpacity||item==this)).reduce((prod,item)=>prod*item.fillOpacity,1);
    if(this.fillColor){
        this.fillColor.alpha = this._computedFillOpacity;
    }
}
/**
 * Item.updateStrokeOpacity (paper extension)
 * Update the stroke opacity of a paper item and its descendants.
 */
function updateStrokeOpacity(){
    if(this.strokeColor){
        this.strokeColor.alpha = this.hierarchy.filter(item=>'strokeOpacity' in item && (item._multiplyOpacity||item==this)).reduce((prod,item)=>prod*item.strokeOpacity,1);
    }
}
/**
 * Define the fill opacity property for a paper style object.
 * The fill opacity property controls the opacity of the fill color in a style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} o - The fill opacity value. Should be a number between 0 and 1.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The fill opacity value. If not set, returns 1 (fully opaque).
 */
function fillOpacityPropertyDef(){
    return {
        set: function opacity(o){
            this._fillOpacity = this._values.fillOpacity = o;
        },
        get: function opacity(){
            return typeof this._fillOpacity === 'undefined' ? 1 : this._fillOpacity;
        }
    }
}
/**
 * Define the stroke opacity property for a paper style object.
 * The stroke opacity property controls the opacity of the stroke color in a style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the stroke opacity property.
 *   @param {number} o - The stroke opacity value. Should be a number between 0 and 1.
 * @property {function} get - The getter function for the stroke opacity property.
 *   @returns {number} The stroke opacity value. If not set, returns 1 (fully opaque).
 */
function strokeOpacityPropertyDef(){
    return {
        set: function opacity(o){
            this._strokeOpacity = this._values.strokeOpacity = o;
        },
        get: function opacity(){
            return typeof this._strokeOpacity === 'undefined' ? 1 : this._strokeOpacity;
        }
    }
}
/**
 * Define the fill opacity property for a paper item object.
 * The fill opacity property defines the opacity of the fill color used in a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} opacity - The opacity value for the fill color.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The opacity value of the fill color.
 */
function itemFillOpacityPropertyDef(){
    return {
        set: function opacity(o){
            (this.style || this.defaultStyle).fillOpacity = o;
            this.descendants.forEach(item=>item.updateFillOpacity())
        },
        get: function opacity(){
            return (this.style || this.defaultStyle).fillOpacity;
        }
    }
}

/**
 * Define the stroke opacity property for a paper item object.
 * The stroke opacity property defines the opacity of the stroke color used in a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the stroke opacity property.
 *   @param {number} opacity - The opacity value for the stroke color.
 * @property {function} get - The getter function for the stroke opacity property.
 *   @returns {number} The opacity value of the stroke color.
 */
function itemStrokeOpacityPropertyDef(){
    return {
        set: function opacity(o){
            (this.style || this.defaultStyle).strokeOpacity = o;
            this.descendants.forEach(item=>item.updateStrokeOpacity())
        },
        get: function opacity(){
            return (this.style || this.defaultStyle).strokeOpacity;
        }
    }
}


/**
 * Define the fill opacity property for a paper view object.
 * The fill opacity property defines the opacity of the fill color used in a paper view object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} opacity - The opacity value for the fill color.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The opacity value of the fill color.
 */
function viewFillOpacityPropertyDef(){
    return {
        set: function opacity(o){
            this._fillOpacity = o;
            this._project.descendants.forEach(item=>item.updateFillOpacity())
        },
        get: function opacity(){
            return this._fillOpacity;
        },
    }
}

/**
 * Define the rescale property for a paper style object.
 * The rescale property defines the scaling factor applied to a paper style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the rescale property.
 *   @param {number} rescale - The scaling factor value.
 * @property {function} get - The getter function for the rescale property.
 *   @returns {number} The scaling factor value.
 */
function rescalePropertyDef(){
    return {
        set: function rescale(o){
            this._rescale = this._values.rescale = o;
        },
        get: function rescale(){
            return this._rescale;
        }
    }
}

/**
 * Define the rescale property for a paper item object.
 * The rescale property defines the scaling factor applied to a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the rescale property.
 *   @param {number} rescale - The scaling factor value.
 * @property {function} get - The getter function for the rescale property.
 *   @returns {number} The scaling factor value.
 */
function itemRescalePropertyDef(){
    return {
        set: function rescale(o){
            this._style.rescale = o;
        },
        get: function rescale(){
            return this._style.rescale;
        }
    }
}

/**
 * Define the hierarchy property for a paper item or project object.
 * The hierarchy property represents the parent-child relationship of paper item or project objects.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the hierarchy property.
 *   @returns {paper.Item[]} The array of paper item objects representing the hierarchy.
 */
function hierarchyDef(){
    return {
        get: function hierarchy(){
            return this.parent ? this.parent.hierarchy.concat(this) : this.project ? this.project.hierarchy.concat(this) : [this.view, this];
        }
    }
}
/**
 * Define the descendants property for a paper item or project object.
 * The descendants property represents all the descendants (children and their children) of a paper item or project object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array of paper item objects representing the descendants.
 */
function descendantsDef(){
    return {
        get: function descendants(){
            return (this.children ? this.children.map(child=>child.descendants).flat() : []).concat(this.isGeoJSONFeature ? [this] : []);
        }
    }
}
/**
 * Define the descendants property for a paper compound path object.
 * The descendants property represents the compound path object itself as its only descendant.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array containing only the compound path object.
 */
function descendantsDefCompoundPath(){
    return {
        get: function descendants(){
            return [this];
        }
    }
}

function applyRescale(){
    let item = this;
    let rescale = item.rescale;
    if(rescale){
        // // this accounts for view level zoom as well as the scale of the tiled image itself
        // let zoomFactor = item.hierarchy.reduce((val, item)=>{
        //     return item.scaling ? item.scaling.x * val : val;
        // }, 1);

        let zoomFactor = item.view.scaling.x * item.layer.scaling.x;
        
        Object.keys(rescale).forEach(function(prop){
            if(typeof rescale[prop] ==='function'){
                item[prop] = rescale[prop](zoomFactor)
            } else {
                if(Array.isArray(rescale[prop])){
                    item[prop] = rescale[prop].map(function(i){return i/zoomFactor})
                } else {
                    item[prop] = rescale[prop]/zoomFactor;
                }
            } 
        });
    }
}

function strokePropertyDefItem(){
    return {
        get: function stroke(){
            return this._stroke;
        },
        set: function stroke(sw){
            this._stroke = sw;
            this.strokeWidth = sw / (this.view.getZoom() * this.hierarchy.filter(i=>i.tiledImage)[0].scaling.x);
        }
    }
}

// patch isClockwise by adding a small epsilon value to account for floating point errors
paper.PathItem.prototype.isClockwise = function() {
    return this.getArea() >= -0.00000001;
}
Object.defineProperty(paper.PathItem.prototype, 'clockwise', {get: function cw(){ return this.isClockwise(); }});



/*
 * Monkey patch paper boolean operations by getting rid of very short curves after splitting paths at intersections (see traceBoolean for modification)
 * Code modified from:
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

/**
 * @name CollisionDetection
 * @namespace
 * @private
 * @author Jan Boesenberg <jan.boesenberg@gmail.com>
 */
var CollisionDetection = /** @lends CollisionDetection */{
    /**
     * Finds collisions between axis aligned bounding boxes of items.
     *
     * This function takes the bounds of all items in the items1 and items2
     * arrays and calls findBoundsCollisions().
     *
     * @param {Array} items1 Array of items for which collisions should be
     *     found.
     * @param {Array} [items2] Array of items  that the first array should be
     *     compared with. If not provided, collisions between items within
     *     the first array will be returned.
     * @param {Number} [tolerance] If provided, the tolerance will be added to
     *     all sides of each bounds when checking for collisions.
     * @returns {Array} Array containing for the bounds at the same index in
     *     items1 an array of the indexes of colliding bounds in items2
     */
    findItemBoundsCollisions: function(items1, items2, tolerance) {
        function getBounds(items) {
            var bounds = new Array(items.length);
            for (var i = 0; i < items.length; i++) {
                var rect = items[i].getBounds();
                bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
            }
            return bounds;
        }

        var bounds1 = getBounds(items1),
            bounds2 = !items2 || items2 === items1
                ? bounds1
                : getBounds(items2);
        return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
    },

    /**
     * Finds collisions between curves bounds. For performance reasons this
     * uses broad bounds of the curve, which can be calculated much faster than
     * the actual bounds. Broad bounds guarantee to contain the full curve,
     * but they are usually larger than the actual bounds of a curve.
     *
     * This function takes the broad bounds of all curve values in the curves1
     * and curves2 arrays and calls findBoundsCollisions().
     *
     * @param {Array} curves1 Array of curve values for which collisions should
     *     be found.
     * @param {Array} [curves2] Array of curve values that the first array
     *     should be compared with. If not provided, collisions between curve
     *     bounds within the first arrray will be returned.
     * @param {Number} [tolerance] If provided, the tolerance will be added to
     *     all sides of each bounds when checking for collisions.
     * @param {Boolean} [bothAxis] If true, the sweep is performed along both
     *     axis, and the results include collisions for both: `{ hor, ver }`.
     * @returns {Array} Array containing for the bounds at the same index in
     *     curves1 an array of the indexes of colliding bounds in curves2
     */
    findCurveBoundsCollisions: function(curves1, curves2, tolerance, bothAxis) {
        function getBounds(curves) {
            var min = Math.min,
                max = Math.max,
                bounds = new Array(curves.length);
            for (var i = 0; i < curves.length; i++) {
                var v = curves[i];
                bounds[i] = [
                    min(v[0], v[2], v[4], v[6]),
                    min(v[1], v[3], v[5], v[7]),
                    max(v[0], v[2], v[4], v[6]),
                    max(v[1], v[3], v[5], v[7])
                ];
            }
            return bounds;
        }

        var bounds1 = getBounds(curves1),
            bounds2 = !curves2 || curves2 === curves1
                ? bounds1
                : getBounds(curves2);
        if (bothAxis) {
            var hor = this.findBoundsCollisions(
                    bounds1, bounds2, tolerance || 0, false, true),
                ver = this.findBoundsCollisions(
                    bounds1, bounds2, tolerance || 0, true, true),
                list = [];
            for (var i = 0, l = hor.length; i < l; i++) {
                list[i] = { hor: hor[i], ver: ver[i] };
            }
            return list;
        }
        return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
    },

    /**
     * Finds collisions between two sets of bounding rectangles.
     *
     * The collision detection is implemented as a sweep and prune algorithm
     * with sweep either along the x or y axis (primary axis) and immediate
     * check on secondary axis for potential pairs.
     *
     * Each entry in the bounds arrays must be an array of length 4 with
     * x0, y0, x1, and y1 as the array elements.
     *
     * The returned array has the same length as bounds1. Each entry
     * contains an array with all indices of overlapping bounds of
     * bounds2 (or bounds1 if bounds2 is not provided) sorted
     * in ascending order.
     *
     * If the second bounds array parameter is null, collisions between bounds
     * within the first bounds array will be found. In this case the indexed
     * returned for each bounds will not contain the bounds' own index.
     *
     *
     * @param {Array} boundsA Array of bounds objects for which collisions
     *     should be found.
     * @param {Array} [boundsB] Array of bounds that the first array should
     *     be compared with. If not provided, collisions between bounds within
     *     the first arrray will be returned.
     * @param {Number} [tolerance] If provided, the tolerance will be added to
     *     all sides of each bounds when checking for collisions.
     * @param {Boolean} [sweepVertical] If true, the sweep is performed along
     *     the y-axis.
     * @param {Boolean} [onlySweepAxisCollisions] If true, no collision checks
     *     will be done on the secondary axis.
     * @returns {Array} Array containing for the bounds at the same index in
     *     boundsA an array of the indexes of colliding bounds in boundsB
     */
    findBoundsCollisions: function(boundsA, boundsB, tolerance,
        sweepVertical, onlySweepAxisCollisions) {
        var self = !boundsB || boundsA === boundsB,
            allBounds = self ? boundsA : boundsA.concat(boundsB),
            lengthA = boundsA.length,
            lengthAll = allBounds.length;

        // Binary search utility function.
        // For multiple same entries, this returns the rightmost entry.
        // https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure_for_finding_the_rightmost_element
        function binarySearch(indices, coord, value) {
            var lo = 0,
                hi = indices.length;
            while (lo < hi) {
                var mid = (hi + lo) >>> 1; // Same as Math.floor((hi + lo) / 2)
                if (allBounds[indices[mid]][coord] < value) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
            }
            return lo - 1;
        }

        // Set coordinates for primary and secondary axis depending on sweep
        // direction. By default we sweep in horizontal direction, which
        // means x is the primary axis.
        var pri0 = sweepVertical ? 1 : 0,
            pri1 = pri0 + 2,
            sec0 = sweepVertical ? 0 : 1,
            sec1 = sec0 + 2;
        // Create array with all indices sorted by lower boundary on primary
        // axis.
        var allIndicesByPri0 = new Array(lengthAll);
        for (var i = 0; i < lengthAll; i++) {
            allIndicesByPri0[i] = i;
        }
        allIndicesByPri0.sort(function(i1, i2) {
            return allBounds[i1][pri0] - allBounds[i2][pri0];
        });
        // Sweep along primary axis. Indices of active bounds are kept in an
        // array sorted by higher boundary on primary axis.
        var activeIndicesByPri1 = [],
            allCollisions = new Array(lengthA);
        for (var i = 0; i < lengthAll; i++) {
            var curIndex = allIndicesByPri0[i],
                curBounds = allBounds[curIndex],
                // The original index in boundsA or boundsB:
                origIndex = self ? curIndex : curIndex - lengthA,
                isCurrentA = curIndex < lengthA,
                isCurrentB = self || !isCurrentA,
                curCollisions = isCurrentA ? [] : null;
            if (activeIndicesByPri1.length) {
                // remove (prune) indices that are no longer active.
                var pruneCount = binarySearch(activeIndicesByPri1, pri1,
                        curBounds[pri0] - tolerance) + 1;
                activeIndicesByPri1.splice(0, pruneCount);
                // Add collisions for current index.
                if (self && onlySweepAxisCollisions) {
                    // All active indexes can be added, no further checks needed
                    curCollisions = curCollisions.concat(activeIndicesByPri1);
                   // Add current index to collisions of all active indexes
                    for (var j = 0; j < activeIndicesByPri1.length; j++) {
                        var activeIndex = activeIndicesByPri1[j];
                        allCollisions[activeIndex].push(origIndex);
                    }
                } else {
                    var curSec1 = curBounds[sec1],
                        curSec0 = curBounds[sec0];
                    for (var j = 0; j < activeIndicesByPri1.length; j++) {
                        var activeIndex = activeIndicesByPri1[j],
                            activeBounds = allBounds[activeIndex],
                            isActiveA = activeIndex < lengthA,
                            isActiveB = self || activeIndex >= lengthA;

                        // Check secondary axis bounds if necessary.
                        if (
                            onlySweepAxisCollisions ||
                            (
                                isCurrentA && isActiveB ||
                                isCurrentB && isActiveA
                            ) && (
                                curSec1 >= activeBounds[sec0] - tolerance &&
                                curSec0 <= activeBounds[sec1] + tolerance
                            )
                        ) {
                            // Add current index to collisions of active
                            // indices and vice versa.
                            if (isCurrentA && isActiveB) {
                                curCollisions.push(
                                    self ? activeIndex : activeIndex - lengthA);
                            }
                            if (isCurrentB && isActiveA) {
                                allCollisions[activeIndex].push(origIndex);
                            }
                        }
                    }
                }
            }
            if (isCurrentA) {
                if (boundsA === boundsB) {
                    // If both arrays are the same, add self collision.
                    curCollisions.push(curIndex);
                }
                // Add collisions for current index.
                allCollisions[curIndex] = curCollisions;
            }
            // Add current index to active indices. Keep array sorted by
            // their higher boundary on the primary axis.s
            if (activeIndicesByPri1.length) {
                var curPri1 = curBounds[pri1],
                    index = binarySearch(activeIndicesByPri1, pri1, curPri1);
                activeIndicesByPri1.splice(index + 1, 0, curIndex);
            } else {
                activeIndicesByPri1.push(curIndex);
            }
        }
        // Sort collision indices in ascending order.
        for (var i = 0; i < allCollisions.length; i++) {
            var collisions = allCollisions[i];
            if (collisions) {
                collisions.sort(function(i1, i2) { return i1 - i2; });
            }
        }
        return allCollisions;
    }
};



/*
 * Monkey patch paper boolean operations by getting rid of very short curves after splitting paths at intersections (see traceBoolean for modification)
 * Code modified from:
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

const PathItem = paper.PathItem;
const Path = paper.Path;
const CompoundPath = paper.CompoundPath;
const Base = paper.Base;
const Item = paper.Item;
const Segment = paper.Segment;
const Curve = paper.Curve;
const CurveLocation = paper.CurveLocation;
const Numerical = paper.Numerical;

/*
 * Boolean Geometric Path Operations
 *
 * Supported
 *  - Path and CompoundPath items
 *  - Boolean Union
 *  - Boolean Intersection
 *  - Boolean Subtraction
 *  - Boolean Exclusion
 *  - Resolving a self-intersecting Path items
 *  - Boolean operations on self-intersecting Paths items
 *
 * @author Harikrishnan Gopalakrishnan <hari.exeption@gmail.com>
 * @author Jan Boesenberg <jan.boesenberg@gmail.com>
 * @author Jürg Lehni <juerg@scratchdisk.com>
 */
PathItem.inject(new function() {
    var min = Math.min,
        max = Math.max,
        abs = Math.abs,
        // Set up lookup tables for each operator, to decide if a given segment
        // is to be considered a part of the solution, or to be discarded, based
        // on its winding contribution, as calculated by propagateWinding().
        // Boolean operators return true if a segment with the given winding
        // contribution contributes to the final result or not. They are applied
        // to for each segment after the paths are split at crossings.
        operators = {
            unite:     { '1': true, '2': true },
            intersect: { '2': true },
            subtract:  { '1': true },
            // exclude only needs -1 to support reorientPaths() when there are
            // no crossings. The actual boolean code uses unsigned winding.
            exclude:   { '1': true, '-1': true }
        };

    function getPaths(path) {
        return path._children || [path];
    }

    /*
     * Creates a clone of the path that we can modify freely, with its matrix
     * applied to its geometry. Calls #reduce() to simplify compound paths and
     * remove empty curves, #resolveCrossings() to resolve self-intersection
     * make sure all paths have correct winding direction.
     */
    function preparePath(path, resolve) {
        var res = path
            .clone(false)
            .reduce({ simplify: true })
            .transform(null, true, true);
        if (resolve) {
            // For correct results, close open paths with straight lines:
            var paths = getPaths(res);
            for (var i = 0, l = paths.length; i < l; i++) {
                var path = paths[i];
                if (!path._closed && !path.isEmpty()) {
                    // Close with epsilon tolerance, to avoid tiny straight
                    // that would cause issues with intersection detection.
                    path.closePath(/*#=*/Numerical.EPSILON);
                    path.getFirstSegment().setHandleIn(0, 0);
                    path.getLastSegment().setHandleOut(0, 0);
                }
            }
            res = res
                .resolveCrossings()
                .reorient(res.getFillRule() === 'nonzero', true);
        }
        return res;
    }

    function createResult(paths, simplify, path1, path2, options) {
        var result = new CompoundPath(Item.NO_INSERT);
        result.addChildren(paths, true);
        // See if the item can be reduced to just a simple Path.
        result = result.reduce({ simplify: simplify });
        if (!(options && options.insert == false)) {
            // Insert the resulting path above whichever of the two paths appear
            // further up in the stack.
            result.insertAbove(path2 && path1.isSibling(path2)
                    && path1.getIndex() < path2.getIndex() ? path2 : path1);
        }
        // Copy over the input path attributes, excluding matrix and we're done.
        result.copyAttributes(path1, true);
        return result;
    }

    function filterIntersection(inter) {
        // TODO: Change isCrossing() to also handle overlaps (hasOverlap())
        // that are actually involved in a crossing! For this we need proper
        // overlap range detection / merging first... But as we call
        // #resolveCrossings() first in boolean operations, removing all
        // self-touching areas in paths, this works for the known use cases.
        // The ideal implementation would deal with it in a way outlined in:
        // https://github.com/paperjs/paper.js/issues/874#issuecomment-168332391
        return inter.hasOverlap() || inter.isCrossing();
    }

    function traceBoolean(path1, path2, operation, options) {
        // Only support subtract and intersect operations when computing stroke
        // based boolean operations (options.split = true).
        if (options && (options.trace == false || options.stroke) &&
                /^(subtract|intersect)$/.test(operation))
            return splitBoolean(path1, path2, operation);
        // We do not modify the operands themselves, but create copies instead,
        // fas produced by the calls to preparePath().
        // NOTE: The result paths might not belong to the same type i.e.
        // subtract(A:Path, B:Path):CompoundPath etc.
        var _path1 = preparePath(path1, true),
            _path2 = path2 && path1 !== path2 && preparePath(path2, true),
            // Retrieve the operator lookup table for winding numbers.
            operator = operators[operation];
        // Add a simple boolean property to check for a given operation,
        // e.g. `if (operator.unite)`
        operator[operation] = true;
        // Give both paths the same orientation except for subtraction
        // and exclusion, where we need them at opposite orientation.
        if (_path2 && (operator.subtract || operator.exclude)
                ^ (_path2.isClockwise() ^ _path1.isClockwise()))
            _path2.reverse();
        // Split curves at crossings on both paths. Note that for self-
        // intersection, path2 is null and getIntersections() handles it.
        var crossings = divideLocations(CurveLocation.expand(
                _path1.getIntersections(_path2, filterIntersection))),
            paths1 = getPaths(_path1),
            paths2 = _path2 && getPaths(_path2),
            segments = [],
            curves = [],
            paths;

        function collectPaths(paths) {
            for (var i = 0, l = paths.length; i < l; i++) {
                var path = paths[i];
                Base.push(segments, path._segments);
                Base.push(curves, path.getCurves());
                // See if all encountered segments in a path are overlaps, to
                // be able to separately handle fully overlapping paths.
                path._overlapsOnly = true;
            }
        }

        function getCurves(indices) {
            var list = [];
            for (var i = 0, l = indices && indices.length; i < l; i++) {
                list.push(curves[indices[i]]);
            }
            return list;
        }

        if (crossings.length) {
            // Collect all segments and curves of both involved operands.
            collectPaths(paths1);
            if (paths2)
                collectPaths(paths2);

            // Monkey patch is here. Paths are split above in divideLocations.
            // Remove segments/curves with length less than geomEpsilon of 1e-7
            for(let i=crossings.length-1; i > -1; i--){
                if(segments[i].curve.length < 1e-7) {
                    segments[i].remove();
                    segments.splice(i,1);
                    curves.splice(i,1); 
                }
            }

            var curvesValues = new Array(curves.length);
            for (var i = 0, l = curves.length; i < l; i++) {
                curvesValues[i] = curves[i].getValues();
            }
            var curveCollisions = CollisionDetection.findCurveBoundsCollisions(
                    curvesValues, curvesValues, 0, true);
            var curveCollisionsMap = {};
            for (var i = 0; i < curves.length; i++) {
                var curve = curves[i],
                    id = curve._path._id,
                    map = curveCollisionsMap[id] = curveCollisionsMap[id] || {};
                map[curve.getIndex()] = {
                    hor: getCurves(curveCollisions[i].hor),
                    ver: getCurves(curveCollisions[i].ver)
                };
            }

            // Propagate the winding contribution. Winding contribution of
            // curves does not change between two crossings.
            // First, propagate winding contributions for curve chains starting
            // in all crossings:
            for (var i = 0, l = crossings.length; i < l; i++) {
                propagateWinding(crossings[i]._segment, _path1, _path2,
                        curveCollisionsMap, operator);
            }
            for (var i = 0, l = segments.length; i < l; i++) {
                var segment = segments[i],
                    inter = segment._intersection;
                if (!segment._winding) {
                    propagateWinding(segment, _path1, _path2,
                            curveCollisionsMap, operator);
                }
                // See if all encountered segments in a path are overlaps.
                if (!(inter && inter._overlap))
                    segment._path._overlapsOnly = false;
            }
            paths = tracePaths(segments, operator);
        } else {
            // When there are no crossings, the result can be determined through
            // a much faster call to reorientPaths():
            paths = reorientPaths(
                    // Make sure reorientPaths() never works on original
                    // _children arrays by calling paths1.slice()
                    paths2 ? paths1.concat(paths2) : paths1.slice(),
                    function(w) {
                        return !!operator[w];
                    });
        }
        return createResult(paths, true, path1, path2, options);
    }

    function splitBoolean(path1, path2, operation) {
        var _path1 = preparePath(path1),
            _path2 = preparePath(path2),
            crossings = _path1.getIntersections(_path2, filterIntersection),
            subtract = operation === 'subtract',
            divide = operation === 'divide',
            added = {},
            paths = [];

        function addPath(path) {
            // Simple see if the point halfway across the open path is inside
            // path2, and include / exclude the path based on the operator.
            if (!added[path._id] && (divide ||
                    _path2.contains(path.getPointAt(path.getLength() / 2))
                        ^ subtract)) {
                paths.unshift(path);
                return added[path._id] = true;
            }
        }

        // Now loop backwards through all crossings, split the path and check
        // the new path that was split off for inclusion.
        for (var i = crossings.length - 1; i >= 0; i--) {
            var path = crossings[i].split();
            if (path) {
                // See if we can add the path, and if so, clear the first handle
                // at the split, because it might have been a curve.
                if (addPath(path))
                    path.getFirstSegment().setHandleIn(0, 0);
                // Clear the other side of the split too, which is always the
                // end of the remaining _path1.
                _path1.getLastSegment().setHandleOut(0, 0);
            }
        }
        // At the end, add what's left from our path after all the splitting.
        addPath(_path1);
        return createResult(paths, false, path1, path2);
    }

    /*
     * Creates linked lists between intersections through their _next and _prev
     * properties.
     *
     * @private
     */
    function linkIntersections(from, to) {
        // Only create the link if it's not already in the existing chain, to
        // avoid endless recursions. First walk to the beginning of the chain,
        // and abort if we find `to`.
        var prev = from;
        while (prev) {
            if (prev === to)
                return;
            prev = prev._previous;
        }
        // Now walk to the end of the existing chain to find an empty spot, but
        // stop if we find `to`, to avoid adding it again.
        while (from._next && from._next !== to)
            from = from._next;
        // If we're reached the end of the list, we can add it.
        if (!from._next) {
            // Go back to beginning of the other chain, and link the two up.
            while (to._previous)
                to = to._previous;
            from._next = to;
            to._previous = from;
        }
    }

    function clearCurveHandles(curves) {
        // Clear segment handles if they were part of a curve with no handles.
        for (var i = curves.length - 1; i >= 0; i--)
            curves[i].clearHandles();
    }

    /**
     * Reorients the specified paths.
     *
     * @param {Item[]} paths the paths of which the orientation needs to be
     *     reoriented
     * @param {Function} isInside determines if the inside of a path is filled.
     *     For non-zero fill rule this function would be implemented as follows:
     *
     *     function isInside(w) {
     *       return w != 0;
     *     }
     * @param {Boolean} [clockwise] if provided, the orientation of the root
     *     paths will be set to the orientation specified by `clockwise`,
     *     otherwise the orientation of the largest root child is used.
     * @return {Item[]} the reoriented paths
    */
    function reorientPaths(paths, isInside, clockwise) {
        var length = paths && paths.length;
        if (length) {
            var lookup = Base.each(paths, function (path, i) {
                    // Build a lookup table with information for each path's
                    // original index and winding contribution.
                    this[path._id] = {
                        container: null,
                        winding: path.isClockwise() ? 1 : -1,
                        index: i
                    };
                }, {}),
                // Now sort the paths by their areas, from large to small.
                sorted = paths.slice().sort(function (a, b) {
                    return abs(b.getArea()) - abs(a.getArea());
                }),
                // Get reference to the first, largest path and insert it
                // already.
                first = sorted[0];
            // create lookup containing potentially overlapping path bounds
            var collisions = CollisionDetection.findItemBoundsCollisions(sorted,
                    null, Numerical.GEOMETRIC_EPSILON);
            if (clockwise == null)
                clockwise = first.isClockwise();
            // Now determine the winding for each path, from large to small.
            for (var i = 0; i < length; i++) {
                var path1 = sorted[i],
                    entry1 = lookup[path1._id],
                    containerWinding = 0,
                    indices = collisions[i];
                if (indices) {
                    var point = null; // interior point, only get it if required.
                    for (var j = indices.length - 1; j >= 0; j--) {
                        if (indices[j] < i) {
                            point = point || path1.getInteriorPoint();
                            var path2 = sorted[indices[j]];
                            // As we run through the paths from largest to
                            // smallest, for any current path, all potentially
                            // containing paths have already been processed and
                            // their orientation fixed. To achieve correct
                            // orientation of contained paths based on winding,
                            // find one containing path with different
                            // "insideness" and set opposite orientation.
                            if (path2.contains(point)) {
                                var entry2 = lookup[path2._id];
                                containerWinding = entry2.winding;
                                entry1.winding += containerWinding;
                                entry1.container = entry2.exclude
                                    ? entry2.container : path2;
                                break;
                            }
                        }
                    }
                }
                // Only keep paths if the "insideness" changes when crossing the
                // path, e.g. the inside of the path is filled and the outside
                // is not, or vice versa.
                if (isInside(entry1.winding) === isInside(containerWinding)) {
                    entry1.exclude = true;
                    // No need to delete excluded entries. Setting to null is
                    // enough, as #setChildren() can handle arrays with gaps.
                    paths[entry1.index] = null;
                } else {
                    // If the containing path is not excluded, we're done
                    // searching for the orientation defining path.
                    var container = entry1.container;
                    path1.setClockwise(
                            container ? !container.isClockwise() : clockwise);
                }
            }
        }
        return paths;
    }


    /**
     * Divides the path-items at the given locations.
     *
     * @param {CurveLocation[]} locations an array of the locations to split the
     *     path-item at.
     * @param {Function} [include] a function that determines if dividing should
     *     happen at a given location.
     * @return {CurveLocation[]} the locations at which the involved path-items
     *     were divided
     * @private
     */
    function divideLocations(locations, include, clearLater) {
        var results = include && [],
            tMin = /*#=*/Numerical.CURVETIME_EPSILON,
            tMax = 1 - tMin,
            clearHandles = false,
            clearCurves = clearLater || [],
            clearLookup = clearLater && {},
            renormalizeLocs,
            prevCurve,
            prevTime;

        // When dealing with overlaps and crossings, divideLocations() is called
        // twice. If curve handles of curves that originally didn't have handles
        // are cleared after the first call , we loose  curve-time consistency
        // and CurveLocation#_time values become invalid.
        // In those situations, clearLater is passed as a container for all
        // curves of which the handles need to be cleared in the end.
        // Create a lookup table that allows us to quickly determine if a given
        // curve was resulting from an original curve without handles.
        function getId(curve) {
            return curve._path._id + '.' + curve._segment1._index;
        }

        for (var i = (clearLater && clearLater.length) - 1; i >= 0; i--) {
            var curve = clearLater[i];
            if (curve._path)
                clearLookup[getId(curve)] = true;
        }

        // Loop backwards through all sorted locations, from right to left, so
        // we can assume a predefined sequence for curve-time renormalization.
        for (var i = locations.length - 1; i >= 0; i--) {
            var loc = locations[i],
                // Retrieve curve-time before calling include(), because it may
                // be changed to the scaled value after splitting previously.
                // See CurveLocation#getCurve(), #resolveCrossings()
                time = loc._time,
                origTime = time,
                exclude = include && !include(loc),
                // Retrieve curve after calling include(), because it may cause
                // a change in the cached location values, see above.
                curve = loc._curve,
                segment;
            if (curve) {
                if (curve !== prevCurve) {
                    // This is a new curve, update clearHandles setting.
                    clearHandles = !curve.hasHandles()
                            || clearLookup && clearLookup[getId(curve)];
                    // Keep track of locations for later curve-time
                    // renormalization within the curve.
                    renormalizeLocs = [];
                    prevTime = null;
                    prevCurve = curve;
                } else if (prevTime >= tMin) {
                    // Rescale curve-time when we are splitting the same curve
                    // multiple times, if splitting was done previously.
                    time /= prevTime;
                }
            }
            if (exclude) {
                // Store excluded locations for later renormalization, in case
                // the same curve is divided to their left.
                if (renormalizeLocs)
                    renormalizeLocs.push(loc);
                continue;
            } else if (include) {
                results.unshift(loc);
            }
            prevTime = origTime;
            if (time < tMin) {
                segment = curve._segment1;
            } else if (time > tMax) {
                segment = curve._segment2;
            } else {
                // Split the curve at time, passing true for _setHandles to
                // always set the handles on the sub-curves even if the original
                // curve had no handles.
                var newCurve = curve.divideAtTime(time, true);
                // Keep track of curves without handles, so they can be cleared
                // again at the end.
                if (clearHandles)
                    clearCurves.push(curve, newCurve);
                segment = newCurve._segment1;
                // Handle locations that need their curve-time renormalized
                // within the same curve after dividing at this location.
                for (var j = renormalizeLocs.length - 1; j >= 0; j--) {
                    var l = renormalizeLocs[j];
                    l._time = (l._time - time) / (1 - time);
                }
            }
            loc._setSegment(segment);
            // Create links from the new segment to the intersection on the
            // other curve, as well as from there back. If there are multiple
            // intersections on the same segment, we create linked lists between
            // the intersections through linkIntersections(), linking both ways.
            var inter = segment._intersection,
                dest = loc._intersection;
            if (inter) {
                linkIntersections(inter, dest);
                // Each time we add a new link to the linked list, we need to
                // add links from all the other entries to the new entry.
                var other = inter;
                while (other) {
                    linkIntersections(other._intersection, inter);
                    other = other._next;
                }
            } else {
                segment._intersection = dest;
            }
        }
        // Clear curve handles right away if we're not storing them for later.
        if (!clearLater)
            clearCurveHandles(clearCurves);
        return results || locations;
    }

    /**
     * Returns the winding contribution number of the given point in respect
     * to the shapes described by the passed curves.
     *
     * See #1073#issuecomment-226942348 and #1073#issuecomment-226946965 for a
     * detailed description of the approach developed by @iconexperience to
     * precisely determine the winding contribution in all known edge cases.
     *
     * @param {Point} point the location for which to determine the winding
     *     contribution
     * @param {Curve[]} curves The curves that describe the shape against which
     *     to check, as returned by {@link Path#curves} or
     *     {@link CompoundPath#curves}.
     * @param {Boolean} [dir=false] the direction in which to determine the
     *     winding contribution, `false`: in x-direction, `true`: in y-direction
     * @param {Boolean} [closed=false] determines how areas should be closed
     *     when a curve is part of an open path, `false`: area is closed with a
     *     straight line, `true`: area is closed taking the handles of the first
     *     and last segment into account
     * @param {Boolean} [dontFlip=false] controls whether the algorithm is
     *     allowed to flip direction if it is deemed to produce better results
     * @return {Object} an object containing the calculated winding number, as
     *     well as an indication whether the point was situated on the contour
     * @private
     */
    function getWinding(point, curves, dir, closed, dontFlip) {
        // `curves` can either be an array of curves, or an object containing of
        // the form `{ hor: [], ver: [] }` (see `curveCollisionsMap`), with each
        // key / value pair holding only those curves that can be crossed by a
        // horizontal / vertical line through the point to be checked.
        var curvesList = Array.isArray(curves)
            ? curves
            : curves[dir ? 'hor' : 'ver'];
        // Determine the index of the abscissa and ordinate values in the curve
        // values arrays, based on the direction:
        var ia = dir ? 1 : 0, // the abscissa index
            io = ia ^ 1, // the ordinate index
            pv = [point.x, point.y],
            pa = pv[ia], // the point's abscissa
            po = pv[io], // the point's ordinate
            // Use separate epsilons for winding contribution code.
            windingEpsilon = 1e-9,
            qualityEpsilon = 1e-6,
            paL = pa - windingEpsilon,
            paR = pa + windingEpsilon,
            windingL = 0,
            windingR = 0,
            pathWindingL = 0,
            pathWindingR = 0,
            onPath = false,
            onAnyPath = false,
            quality = 1,
            roots = [],
            vPrev,
            vClose;

        function addWinding(v) {
            var o0 = v[io + 0],
                o3 = v[io + 6];
            if (po < min(o0, o3) || po > max(o0, o3)) {
                // If the curve is outside the ordinates' range, no intersection
                // with the ray is possible.
                return;
            }
            var a0 = v[ia + 0],
                a1 = v[ia + 2],
                a2 = v[ia + 4],
                a3 = v[ia + 6];
            if (o0 === o3) {
                // A horizontal curve is not necessarily between two non-
                // horizontal curves. We have to take cases like these into
                // account:
                //          +-----+
                //     +----+     |
                //          +-----+
                if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
                    onPath = true;
                }
                // If curve does not change in ordinate direction, windings will
                // be added by adjacent curves.
                // Bail out without updating vPrev at the end of the call.
                return;
            }
            // Determine the curve-time value corresponding to the point.
            var t =   po === o0 ? 0
                    : po === o3 ? 1
                    // If the abscissa is outside the curve, we can use any
                    // value except 0 (requires special handling). Use 1, as it
                    // does not require additional calculations for the point.
                    : paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3)
                    ? 1
                    : Curve.solveCubic(v, io, po, roots, 0, 1) > 0
                        ? roots[0]
                        : 1,
                a =   t === 0 ? a0
                    : t === 1 ? a3
                    : Curve.getPoint(v, t)[dir ? 'y' : 'x'],
                winding = o0 > o3 ? 1 : -1,
                windingPrev = vPrev[io] > vPrev[io + 6] ? 1 : -1,
                a3Prev = vPrev[ia + 6];
            if (po !== o0) {
                // Standard case, curve is not crossed at its starting point.
                if (a < paL) {
                    pathWindingL += winding;
                } else if (a > paR) {
                    pathWindingR += winding;
                } else {
                    onPath = true;
                }
                // Determine the quality of the winding calculation. Reduce the
                // quality with every crossing of the ray very close to the
                // path. This means that if the point is on or near multiple
                // curves, the quality becomes less than 0.5.
                if (a > pa - qualityEpsilon && a < pa + qualityEpsilon)
                    quality /= 2;
            } else {
                // Curve is crossed at starting point.
                if (winding !== windingPrev) {
                    // Winding changes from previous curve, cancel its winding.
                    if (a0 < paL) {
                        pathWindingL += winding;
                    } else if (a0 > paR) {
                        pathWindingR += winding;
                    }
                } else if (a0 != a3Prev) {
                    // Handle a horizontal curve between the current and
                    // previous non-horizontal curve. See
                    // #1261#issuecomment-282726147 for a detailed explanation:
                    if (a3Prev < paR && a > paR) {
                        // Right winding was not added before, so add it now.
                        pathWindingR += winding;
                        onPath = true;
                    } else if (a3Prev > paL && a < paL) {
                        // Left winding was not added before, so add it now.
                        pathWindingL += winding;
                        onPath = true;
                    }
                }
                quality /= 4;
            }
            vPrev = v;
            // If we're on the curve, look at the tangent to decide whether to
            // flip direction to better determine a reliable winding number:
            // If the tangent is parallel to the direction, call getWinding()
            // again with flipped direction and return that result instead.
            return !dontFlip && a > paL && a < paR
                    && Curve.getTangent(v, t)[dir ? 'x' : 'y'] === 0
                    && getWinding(point, curves, !dir, closed, true);
        }

        function handleCurve(v) {
            // Get the ordinates:
            var o0 = v[io + 0],
                o1 = v[io + 2],
                o2 = v[io + 4],
                o3 = v[io + 6];
            // Only handle curves that can cross the point's ordinate.
            if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
                // Get the abscissas:
                var a0 = v[ia + 0],
                    a1 = v[ia + 2],
                    a2 = v[ia + 4],
                    a3 = v[ia + 6],
                    // Get monotone curves. If the curve is outside the point's
                    // abscissa, it can be treated as a monotone curve:
                    monoCurves = paL > max(a0, a1, a2, a3) ||
                                 paR < min(a0, a1, a2, a3)
                            ? [v] : Curve.getMonoCurves(v, dir),
                    res;
                for (var i = 0, l = monoCurves.length; i < l; i++) {
                    // Calling addWinding() my lead to direction flipping, in
                    // which case we already have the result and can return it.
                    if (res = addWinding(monoCurves[i]))
                        return res;
                }
            }
        }

        for (var i = 0, l = curvesList.length; i < l; i++) {
            var curve = curvesList[i],
                path = curve._path,
                v = curve.getValues(),
                res;
            if (!i || curvesList[i - 1]._path !== path) {
                // We're on a new (sub-)path, so we need to determine values of
                // the last non-horizontal curve on this path.
                vPrev = null;
                // If the path is not closed, connect the first and last segment
                // based on the value of `closed`:
                // - `false`: Connect with a straight curve, just like how
                //   filling open paths works.
                // - `true`: Connect with a curve that takes the segment handles
                //   into account, just like how closed paths behave.
                if (!path._closed) {
                    vClose = Curve.getValues(
                            path.getLastCurve().getSegment2(),
                            curve.getSegment1(),
                            null, !closed);
                    // This closing curve is a potential candidate for the last
                    // non-horizontal curve.
                    if (vClose[io] !== vClose[io + 6]) {
                        vPrev = vClose;
                    }
                }

                if (!vPrev) {
                    // Walk backwards through list of the path's curves until we
                    // find one that is not horizontal.
                    // Fall-back to the first curve's values if none is found:
                    vPrev = v;
                    var prev = path.getLastCurve();
                    while (prev && prev !== curve) {
                        var v2 = prev.getValues();
                        if (v2[io] !== v2[io + 6]) {
                            vPrev = v2;
                            break;
                        }
                        prev = prev.getPrevious();
                    }
                }
            }

            // Calling handleCurve() my lead to direction flipping, in which
            // case we already have the result and can return it.
            if (res = handleCurve(v))
                return res;

            if (i + 1 === l || curvesList[i + 1]._path !== path) {
                // We're at the last curve of the current (sub-)path. If a
                // closing curve was calculated at the beginning of it, handle
                // it now to treat the path as closed:
                if (vClose && (res = handleCurve(vClose)))
                    return res;
                if (onPath && !pathWindingL && !pathWindingR) {
                    // If the point is on the path and the windings canceled
                    // each other, we treat the point as if it was inside the
                    // path. A point inside a path has a winding of [+1,-1]
                    // for clockwise and [-1,+1] for counter-clockwise paths.
                    // If the ray is cast in y direction (dir == true), the
                    // windings always have opposite sign.
                    pathWindingL = pathWindingR = path.isClockwise(closed) ^ dir
                            ? 1 : -1;
                }
                windingL += pathWindingL;
                windingR += pathWindingR;
                pathWindingL = pathWindingR = 0;
                if (onPath) {
                    onAnyPath = true;
                    onPath = false;
                }
                vClose = null;
            }
        }
        // Use the unsigned winding contributions when determining which areas
        // are part of the boolean result.
        windingL = abs(windingL);
        windingR = abs(windingR);
        // Return the calculated winding contributions along with a quality
        // value indicating how reliable the value really is.
        return {
            winding: max(windingL, windingR),
            windingL: windingL,
            windingR: windingR,
            quality: quality,
            onPath: onAnyPath
        };
    }

    function propagateWinding(segment, path1, path2, curveCollisionsMap,
            operator) {
        // Here we try to determine the most likely winding number contribution
        // for the curve-chain starting with this segment. Once we have enough
        // confidence in the winding contribution, we can propagate it until the
        // next intersection or end of a curve chain.
        var chain = [],
            start = segment,
            totalLength = 0,
            winding;
        do {
            var curve = segment.getCurve();
            // We can encounter paths with only one segment, which would not
            // have a curve.
            if (curve) {
                var length = curve.getLength();
                chain.push({ segment: segment, curve: curve, length: length });
                totalLength += length;
            }
            segment = segment.getNext();
        } while (segment && !segment._intersection && segment !== start);
        // Determine winding at three points in the chain. If a winding with
        // sufficient quality is found, use it. Otherwise use the winding with
        // the best quality.
        var offsets = [0.5, 0.25, 0.75],
            winding = { winding: 0, quality: -1 },
            // Don't go too close to segments, to avoid special winding cases:
            tMin = 1e-3,
            tMax = 1 - tMin;
        for (var i = 0; i < offsets.length && winding.quality < 0.5; i++) {
            var length = totalLength * offsets[i];
            for (var j = 0, l = chain.length; j < l; j++) {
                var entry = chain[j],
                    curveLength = entry.length;
                if (length <= curveLength) {
                    var curve = entry.curve,
                        path = curve._path,
                        parent = path._parent,
                        operand = parent instanceof CompoundPath ? parent : path,
                        t = Numerical.clamp(curve.getTimeAt(length), tMin, tMax),
                        pt = curve.getPointAtTime(t),
                        // Determine the direction in which to check the winding
                        // from the point (horizontal or vertical), based on the
                        // curve's direction at that point. If tangent is less
                        // than 45°, cast the ray vertically, else horizontally.
                        dir = abs(curve.getTangentAtTime(t).y) < Math.SQRT1_2;
                    // While subtracting, we need to omit this curve if it is
                    // contributing to the second operand and is outside the
                    // first operand.
                    var wind = null;
                    if (operator.subtract && path2) {
                        // Calculate path winding at point depending on operand.
                        var otherPath = operand === path1 ? path2 : path1,
                            pathWinding = otherPath._getWinding(pt, dir, true);
                        // Check if curve should be omitted.
                        if (operand === path1 && pathWinding.winding ||
                            operand === path2 && !pathWinding.winding) {
                            // Check if quality is not good enough...
                            if (pathWinding.quality < 1) {
                                // ...and if so, skip this point...
                                continue;
                            } else {
                                // ...otherwise, omit this curve.
                                wind = { winding: 0, quality: 1 };
                            }
                        }
                    }
                    wind =  wind || getWinding(
                            pt, curveCollisionsMap[path._id][curve.getIndex()],
                            dir, true);
                    if (wind.quality > winding.quality)
                        winding = wind;
                    break;
                }
                length -= curveLength;
            }
        }
        // Now assign the winding to the entire curve chain.
        for (var j = chain.length - 1; j >= 0; j--) {
            chain[j].segment._winding = winding;
        }
    }

    /**
     * Private method to trace closed paths from a list of segments, according
     * to a the their winding number contribution and a custom operator.
     *
     * @param {Segment[]} segments array of segments to trace closed paths
     * @param {Function} operator the operator lookup table that receives as key
     *     the winding number contribution of a curve and returns a boolean
     *     value indicating whether the curve should be included in result
     * @return {Path[]} the traced closed paths
     */
    function tracePaths(segments, operator) {
        var paths = [],
            starts;

        function isValid(seg) {
            var winding;
            return !!(seg && !seg._visited && (!operator
                    || operator[(winding = seg._winding || {}).winding]
                        // Unite operations need special handling of segments
                        // with a winding contribution of two (part of both
                        // areas), which are only valid if they are part of the
                        // result's contour, not contained inside another area.
                        && !(operator.unite && winding.winding === 2
                            // No contour if both windings are non-zero.
                            && winding.windingL && winding.windingR)));
        }

        function isStart(seg) {
            if (seg) {
                for (var i = 0, l = starts.length; i < l; i++) {
                    if (seg === starts[i])
                        return true;
                }
            }
            return false;
        }

        function visitPath(path) {
            var segments = path._segments;
            for (var i = 0, l = segments.length; i < l; i++) {
                segments[i]._visited = true;
            }
        }

        // If there are multiple possible intersections, find the ones that's
        // either connecting back to start or are not visited yet, and will be
        // part of the boolean result:
        function getCrossingSegments(segment, collectStarts) {
            var inter = segment._intersection,
                start = inter,
                crossings = [];
            if (collectStarts)
                starts = [segment];

            function collect(inter, end) {
                while (inter && inter !== end) {
                    var other = inter._segment,
                        path = other && other._path;
                    if (path) {
                        var next = other.getNext() || path.getFirstSegment(),
                            nextInter = next._intersection;
                        // See if this segment and the next are not visited yet,
                        // or are bringing us back to the start, and are both
                        // valid, meaning they're part of the boolean result.
                        if (other !== segment && (isStart(other)
                            || isStart(next)
                            || next && (isValid(other) && (isValid(next)
                                // If next segment isn't valid, its intersection
                                // to which we may switch may be, so check that.
                                || nextInter && isValid(nextInter._segment))))
                        ) {
                            crossings.push(other);
                        }
                        if (collectStarts)
                            starts.push(other);
                    }
                    inter = inter._next;
                }
            }

            if (inter) {
                collect(inter);
                // Find the beginning of the linked intersections and loop all
                // the way back to start, to collect all valid intersections.
                while (inter && inter._previous)
                    inter = inter._previous;
                collect(inter, start);
            }
            return crossings;
        }

        // Sort segments to give non-ambiguous segments the preference as
        // starting points when tracing: prefer segments with no intersections
        // over intersections, and process intersections with overlaps last:
        segments.sort(function(seg1, seg2) {
            var inter1 = seg1._intersection,
                inter2 = seg2._intersection,
                over1 = !!(inter1 && inter1._overlap),
                over2 = !!(inter2 && inter2._overlap),
                path1 = seg1._path,
                path2 = seg2._path;
            // Use bitwise-or to sort cases where only one segment is an overlap
            // or intersection separately, and fall back on natural order within
            // the path.
            return over1 ^ over2
                    ? over1 ? 1 : -1
                    // NOTE: inter1 & 2 are objects, convert to boolean first
                    // as otherwise toString() is called on them.
                    : !inter1 ^ !inter2
                        ? inter1 ? 1 : -1
                        // All other segments, also when comparing two overlaps
                        // or two intersections, are sorted by their order.
                        // Sort by path id to group segments on the same path.
                        : path1 !== path2
                            ? path1._id - path2._id
                            : seg1._index - seg2._index;
        });

        for (var i = 0, l = segments.length; i < l; i++) {
            var seg = segments[i],
                valid = isValid(seg),
                path = null,
                finished = false,
                closed = true,
                branches = [],
                branch,
                visited,
                handleIn;
            // If all encountered segments in a path are overlaps, we may have
            // two fully overlapping paths that need special handling.
            if (valid && seg._path._overlapsOnly) {
                // TODO: Don't we also need to check for multiple overlaps?
                var path1 = seg._path,
                    path2 = seg._intersection._segment._path;
                if (path1.compare(path2)) {
                    // Only add the path to the result if it has an area.
                    if (path1.getArea())
                        paths.push(path1.clone(false));
                    // Now mark all involved segments as visited.
                    visitPath(path1);
                    visitPath(path2);
                    valid = false;
                }
            }
            // Do not start with invalid segments (segments that were already
            // visited, or that are not going to be part of the result).
            while (valid) {
                // For each segment we encounter, see if there are multiple
                // crossings, and if so, pick the best one:
                var first = !path,
                    crossings = getCrossingSegments(seg, first),
                    // Get the other segment of the first found crossing.
                    other = crossings.shift(),
                    finished = !first && (isStart(seg) || isStart(other)),
                    cross = !finished && other;
                if (first) {
                    path = new Path(Item.NO_INSERT);
                    // Clear branch to start a new one with each new path.
                    branch = null;
                }
                if (finished) {
                    // If we end up on the first or last segment of an operand,
                    // copy over its closed state, to support mixed open/closed
                    // scenarios as described in #1036
                    if (seg.isFirst() || seg.isLast())
                        closed = seg._path._closed;
                    seg._visited = true;
                    break;
                }
                if (cross && branch) {
                    // If we're about to cross, start a new branch and add the
                    // current one to the list of branches.
                    branches.push(branch);
                    branch = null;
                }
                if (!branch) {
                    // Add the branch's root segment as the last segment to try,
                    // to see if we get to a solution without crossing.
                    if (cross)
                        crossings.push(seg);
                    branch = {
                        start: path._segments.length,
                        crossings: crossings,
                        visited: visited = [],
                        handleIn: handleIn
                    };
                }
                if (cross)
                    seg = other;
                // If an invalid segment is encountered, go back to the last
                // crossing and try other possible crossings, as well as not
                // crossing at the branch's root.
                if (!isValid(seg)) {
                    // Remove the already added segments, and mark them as not
                    // visited so they become available again as options.
                    path.removeSegments(branch.start);
                    for (var j = 0, k = visited.length; j < k; j++) {
                        visited[j]._visited = false;
                    }
                    visited.length = 0;
                    // Go back to the branch's root segment where the crossing
                    // happened, and try other crossings. Note that this also
                    // tests the root segment without crossing as it is added to
                    // the list of crossings when the branch is created above.
                    do {
                        seg = branch && branch.crossings.shift();
                        if (!seg || !seg._path) {
                            seg = null;
                            // If there are no segments left, try previous
                            // branches until we find one that works.
                            branch = branches.pop();
                            if (branch) {
                                visited = branch.visited;
                                handleIn = branch.handleIn;
                            }
                        }
                    } while (branch && !isValid(seg));
                    if (!seg)
                        break;
                }
                // Add the segment to the path, and mark it as visited.
                // But first we need to look ahead. If we encounter the end of
                // an open path, we need to treat it the same way as the fill of
                // an open path would: Connecting the last and first segment
                // with a straight line, ignoring the handles.
                var next = seg.getNext();
                path.add(new Segment(seg._point, handleIn,
                        next && seg._handleOut));
                seg._visited = true;
                visited.push(seg);
                // If this is the end of an open path, go back to its first
                // segment but ignore its handleIn (see above for handleOut).
                seg = next || seg._path.getFirstSegment();
                handleIn = next && next._handleIn;
            }
            if (finished) {
                if (closed) {
                    // Carry over the last handleIn to the first segment.
                    path.getFirstSegment().setHandleIn(handleIn);
                    path.setClosed(closed);
                }
                // Only add finished paths that cover an area to the result.
                if (path.getArea() !== 0) {
                    paths.push(path);
                }
            }
        }
        return paths;
    }

    return /** @lends PathItem# */{
        /**
         * Returns the winding contribution number of the given point in respect
         * to this PathItem.
         *
         * @param {Point} point the location for which to determine the winding
         *     contribution
         * @param {Number} [dir=0] the direction in which to determine the
         *     winding contribution, `0`: in x-direction, `1`: in y-direction
         * @return {Object} an object containing the calculated winding number, as
         *     well as an indication whether the point was situated on the contour
         */
        _getWinding: function(point, dir, closed) {
            return getWinding(point, this.getCurves(), dir, closed);
        },

        /**
         * {@grouptitle Boolean Path Operations}
         *
         * Unites the geometry of the specified path with this path's geometry
         * and returns the result as a new path item.
         *
         * @option [options.insert=true] {Boolean} whether the resulting item
         *     should be inserted back into the scene graph, above both paths
         *     involved in the operation
         *
         * @param {PathItem} path the path to unite with
         * @param {Object} [options] the boolean operation options
         * @return {PathItem} the resulting path item
         */
        unite: function(path, options) {
            return traceBoolean(this, path, 'unite', options);
        },

        /**
         * Intersects the geometry of the specified path with this path's
         * geometry and returns the result as a new path item.
         *
         * @option [options.insert=true] {Boolean} whether the resulting item
         *     should be inserted back into the scene graph, above both paths
         *     involved in the operation
         * @option [options.trace=true] {Boolean} whether the tracing method is
         *     used, treating both paths as areas when determining which parts
         *     of the paths are to be kept in the result, or whether the first
         *     path is only to be split at intersections, keeping the parts of
         *     the curves that intersect with the area of the second path.
         *
         * @param {PathItem} path the path to intersect with
         * @param {Object} [options] the boolean operation options
         * @return {PathItem} the resulting path item
         */
        intersect: function(path, options) {
            return traceBoolean(this, path, 'intersect', options);
        },

        /**
         * Subtracts the geometry of the specified path from this path's
         * geometry and returns the result as a new path item.
         *
         * @option [options.insert=true] {Boolean} whether the resulting item
         *     should be inserted back into the scene graph, above both paths
         *     involved in the operation
         * @option [options.trace=true] {Boolean} whether the tracing method is
         *     used, treating both paths as areas when determining which parts
         *     of the paths are to be kept in the result, or whether the first
         *     path is only to be split at intersections, removing the parts of
         *     the curves that intersect with the area of the second path.
         *
         * @param {PathItem} path the path to subtract
         * @param {Object} [options] the boolean operation options
         * @return {PathItem} the resulting path item
         */
        subtract: function(path, options) {
            return traceBoolean(this, path, 'subtract', options);
        },

        /**
         * Excludes the intersection of the geometry of the specified path with
         * this path's geometry and returns the result as a new path item.
         *
         * @option [options.insert=true] {Boolean} whether the resulting item
         *     should be inserted back into the scene graph, above both paths
         *     involved in the operation
         *
         * @param {PathItem} path the path to exclude the intersection of
         * @param {Object} [options] the boolean operation options
         * @return {PathItem} the resulting path item
         */
        exclude: function(path, options) {
            return traceBoolean(this, path, 'exclude', options);
        },

        /**
         * Splits the geometry of this path along the geometry of the specified
         * path returns the result as a new group item. This is equivalent to
         * calling {@link #subtract(path)} and {@link #intersect(path)} and
         * putting the results into a new group.
         *
         * @option [options.insert=true] {Boolean} whether the resulting item
         *     should be inserted back into the scene graph, above both paths
         *     involved in the operation
         * @option [options.trace=true] {Boolean} whether the tracing method is
         *     used, treating both paths as areas when determining which parts
         *     of the paths are to be kept in the result, or whether the first
         *     path is only to be split at intersections.
         *
         * @param {PathItem} path the path to divide by
         * @param {Object} [options] the boolean operation options
         * @return {PathItem} the resulting path item
         */
        divide: function(path, options) {
            return options && (options.trace == false || options.stroke)
                    ? splitBoolean(this, path, 'divide')
                    : createResult([
                        this.subtract(path, options),
                        this.intersect(path, options)
                    ], true, this, path, options);
        },

        /*
         * Resolves all crossings of a path item by splitting the path or
         * compound-path in each self-intersection and tracing the result.
         * If possible, the existing path / compound-path is modified if the
         * amount of resulting paths allows so, otherwise a new path /
         * compound-path is created, replacing the current one.
         *
         * @return {PathItem} the resulting path item
         */
        resolveCrossings: function() {
            var children = this._children,
                // Support both path and compound-path items
                paths = children || [this];

            function hasOverlap(seg, path) {
                var inter = seg && seg._intersection;
                return inter && inter._overlap && inter._path === path;
            }

            // First collect all overlaps and crossings while taking note of the
            // existence of both.
            var hasOverlaps = false,
                hasCrossings = false,
                intersections = this.getIntersections(null, function(inter) {
                    return inter.hasOverlap() && (hasOverlaps = true) ||
                            inter.isCrossing() && (hasCrossings = true);
                }),
                // We only need to keep track of curves that need clearing
                // outside of divideLocations() if two calls are necessary.
                clearCurves = hasOverlaps && hasCrossings && [];
            intersections = CurveLocation.expand(intersections);
            if (hasOverlaps) {
                // First divide in all overlaps, and then remove the inside of
                // the resulting overlap ranges.
                var overlaps = divideLocations(intersections, function(inter) {
                    return inter.hasOverlap();
                }, clearCurves);
                for (var i = overlaps.length - 1; i >= 0; i--) {
                    var overlap = overlaps[i],
                        path = overlap._path,
                        seg = overlap._segment,
                        prev = seg.getPrevious(),
                        next = seg.getNext();
                    if (hasOverlap(prev, path) && hasOverlap(next, path)) {
                        seg.remove();
                        prev._handleOut._set(0, 0);
                        next._handleIn._set(0, 0);
                        // If the curve that is left has no length, remove it
                        // altogether. Check for paths with only one segment
                        // before removal, since `prev.getCurve() == null`.
                        if (prev !== seg && !prev.getCurve().hasLength()) {
                            // Transfer handleIn when removing segment:
                            next._handleIn.set(prev._handleIn);
                            prev.remove();
                        }
                    }
                }
            }
            if (hasCrossings) {
                // Divide any remaining intersections that are still part of
                // valid paths after the removal of overlaps.
                divideLocations(intersections, hasOverlaps && function(inter) {
                    // Check both involved curves to see if they're still valid,
                    // meaning they are still part of their paths.
                    var curve1 = inter.getCurve(),
                        seg1 = inter.getSegment(),
                        // Do not call getCurve() and getSegment() on the other
                        // intersection yet, as it too is in the intersections
                        // array and will be divided later. But check if its
                        // current curve is valid, as required by some rare edge
                        // cases, related to intersections on the same curve.
                        other = inter._intersection,
                        curve2 = other._curve,
                        seg2 = other._segment;
                    if (curve1 && curve2 && curve1._path && curve2._path)
                        return true;
                    // Remove all intersections that were involved in the
                    // handling of overlaps, to not confuse tracePaths().
                    if (seg1)
                        seg1._intersection = null;
                    if (seg2)
                        seg2._intersection = null;
                }, clearCurves);
                if (clearCurves)
                    clearCurveHandles(clearCurves);
                // Finally resolve self-intersections through tracePaths()
                paths = tracePaths(Base.each(paths, function(path) {
                    Base.push(this, path._segments);
                }, []));
            }
            // Determine how to return the paths: First try to recycle the
            // current path / compound-path, if the amount of paths does not
            // require a conversion.
            var length = paths.length,
                item;
            if (length > 1 && children) {
                if (paths !== children)
                    this.setChildren(paths);
                item = this;
            } else if (length === 1 && !children) {
                if (paths[0] !== this)
                    this.setSegments(paths[0].removeSegments());
                item = this;
            }
            // Otherwise create a new compound-path and see if we can reduce it,
            // and attempt to replace this item with it.
            if (!item) {
                item = new CompoundPath(Item.NO_INSERT);
                item.addChildren(paths);
                item = item.reduce();
                item.copyAttributes(this);
                this.replaceWith(item);
            }
            return item;
        },

        /**
         * Fixes the orientation of the sub-paths of a compound-path, assuming
         * that non of its sub-paths intersect, by reorienting them so that they
         * are of different winding direction than their containing paths,
         * except for disjoint sub-paths, i.e. islands, which are oriented so
         * that they have the same winding direction as the the biggest path.
         *
         * @param {Boolean} [nonZero=false] controls if the non-zero fill-rule
         *     is to be applied, by counting the winding of each nested path and
         *     discarding sub-paths that do not contribute to the final result
         * @param {Boolean} [clockwise] if provided, the orientation of the root
         *     paths will be set to the orientation specified by `clockwise`,
         *     otherwise the orientation of the largest root child is used.
         * @return {PathItem} a reference to the item itself, reoriented
         */
        reorient: function(nonZero, clockwise) {
            var children = this._children;
            if (children && children.length) {
                this.setChildren(reorientPaths(this.removeChildren(),
                        function(w) {
                            // Handle both even-odd and non-zero rule.
                            return !!(nonZero ? w : w & 1);
                        },
                        clockwise));
            } else if (clockwise !== undefined) {
                this.setClockwise(clockwise);
            }
            return this;
        },

        /**
         * Returns a point that is guaranteed to be inside the path.
         *
         * @bean
         * @type Point
         */
        getInteriorPoint: function() {
            var bounds = this.getBounds(),
                point = bounds.getCenter(true);
            if (!this.contains(point)) {
                // Since there is no guarantee that a poly-bezier path contains
                // the center of its bounding rectangle, we shoot a ray in x
                // direction and select a point between the first consecutive
                // intersections of the ray on the left.
                var curves = this.getCurves(),
                    y = point.y,
                    intercepts = [],
                    roots = [];
                // Process all y-monotone curves that intersect the ray at y:
                for (var i = 0, l = curves.length; i < l; i++) {
                    var v = curves[i].getValues(),
                        o0 = v[1],
                        o1 = v[3],
                        o2 = v[5],
                        o3 = v[7];
                    if (y >= min(o0, o1, o2, o3) && y <= max(o0, o1, o2, o3)) {
                        var monoCurves = Curve.getMonoCurves(v);
                        for (var j = 0, m = monoCurves.length; j < m; j++) {
                            var mv = monoCurves[j],
                                mo0 = mv[1],
                                mo3 = mv[7];
                            // Only handle curves that are not horizontal and
                            // that can cross the point's ordinate.
                            if ((mo0 !== mo3) &&
                                (y >= mo0 && y <= mo3 || y >= mo3 && y <= mo0)){
                                var x = y === mo0 ? mv[0]
                                    : y === mo3 ? mv[6]
                                    : Curve.solveCubic(mv, 1, y, roots, 0, 1)
                                        === 1
                                        ? Curve.getPoint(mv, roots[0]).x
                                        : (mv[0] + mv[6]) / 2;
                                intercepts.push(x);
                            }
                        }
                    }
                }
                if (intercepts.length > 1) {
                    intercepts.sort(function(a, b) { return a - b; });
                    point.x = (intercepts[0] + intercepts[1]) / 2;
                }
            }
            return point;
        }
    };
});


// Monkey patch the paper.js boolean operations to account for issues with floating point math
// when large coordinate values are used (1000 is an empiric value that seems to work reliably)
// See https://github.com/paperjs/paper.js/issues/2082 for discussion
const funcs = ['unite', 'intersect', 'subtract', 'exclude', 'divide'];
for(const func of funcs){
    const original = paper.PathItem.prototype[func];
    paper.PathItem.prototype[func] = function(){
        const path = arguments[0],
                numericThreshold = 1000, // empiric
                b1 = this.getBounds(),
                b2 = path.getBounds(),
                l = Math.min(b1.x, b2.x),
                r = Math.max(b1.x + b1.width, b2.x + b2.width),
                t = Math.min(b1.y, b2.y),
                b = Math.max(b1.y + b1.height, b2.y + b2.height);

        if(l > -numericThreshold &&
            r < numericThreshold &&
            t > -numericThreshold &&
            b < numericThreshold ){
            // Our bounds are within the limit: no need to translate or scale, just call the original function
            return original.apply(this, arguments);
        }
        // One or more of our bounds is out of range
        // Calculate whether we need to scale or just translate
        const w = r - l,
                h = b - t,
                scaleX = Math.pow(2, Math.ceil(Math.log2(w/(2*numericThreshold)))),
                scaleY = Math.pow(2, Math.ceil(Math.log2(h/(2*numericThreshold)))),
                scale = Math.max(scaleX, scaleY),
                center = new paper.Point((l + r)/2, (t + b)/2),
                offset = new paper.Point(-Math.round(center.x), -Math.round(center.y));            
        
        if(scale > 1){
            // we need to scale the path(s) to make them fit within our numeric bounds
            this.scale(1/scale, center);
            if(path !== this){
                path.scale(1/scale, center);
            }
        }

        // translate the path(s) by the offset
        this.translate(offset);
        if(path !== this){
            path.translate(offset);
        }

        const result = original.apply(this, arguments);

        // restore the path(s)
        this.translate(offset.multiply(-1));
        result.translate(offset.multiply(-1));
        if(path !== this){
            path.translate(offset.multiply(-1));
        }

        if(scale > 1){
            // reset the scale back to the original values
            this.scale(scale, center);
            result.scale(scale, center);
            if(path !== this){
                path.scale(scale, center);
            }
        }
        
        return result;
    }
}

// // Monkey patch paper.Curve.getTimeOf to reduce values very close to end points
// // See https://github.com/paperjs/paper.js/issues/2082 for discussion
paper.Curve.getTimeOf = function(v, point){

    // Before solving cubics, compare the beginning and end of the curve
    // with zero epsilon:
    var p0 = new paper.Point(v[0], v[1]),
        p3 = new paper.Point(v[6], v[7]),
        geomEpsilon = 1e-7,
        t = point.isClose(p0, geomEpsilon) ? 0
            : point.isClose(p3, geomEpsilon) ? 1
            : null;
    if (t === null) {
        // Solve the cubic for both x- and y-coordinates and consider all
        // solutions, testing with the larger / looser geometric epsilon.
        var coords = [point.x, point.y],
            roots = [];
        for (var c = 0; c < 2; c++) {
            var count = paper.Curve.solveCubic(v, c, coords[c], roots, 0, 1);
            for (var i = 0; i < count; i++) {
                var u = roots[i];
                if (point.isClose(paper.Curve.getPoint(v, u), geomEpsilon))
                    return u;
            }
        }
    }
    
    
    return t;
    
}