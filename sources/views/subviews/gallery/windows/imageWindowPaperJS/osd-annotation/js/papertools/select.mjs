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

import {AnnotationUITool, AnnotationUIToolbarBase} from './annotationUITool.mjs';
import { paper } from '../paperjs.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';

/**
 * Represents the SelectTool class that extends the AnnotationUITool.
 * This tool allows users to select and manipulate GeoJSON feature items on the Paper.js project.
 * @class
 */
class SelectTool extends AnnotationUITool{
    /**
     * Creates an instance of SelectTool.
     * @constructor
     * @param {Object} paperScope - The Paper.js paper scope object.
     * @property {Object} ps - Reference to the Paper.js project scope.
     * @property {SelectToolbar} toolbarControl - Sets the toolbar control for the SelectTool.
     * @property {paper.Path.Rectangle} selectionRectangle - The selection rectangle used for area-based selection.
     * @property {paper.Path.Rectangle} sr2 - A second selection rectangle with a dashed border.
     * @description This tool provides the ability to select and manipulate GeoJSON feature items on the canvas. Users can select items by clicking
     * on them or by performing area-based selection through click-and-drag. It also emits selection-related events for interaction and provides
     * functions to retrieve selected items and check for the existence of GeoJSON feature items.
     */
    constructor(paperScope){
        super(paperScope);
        let self=this;
        this.ps = this.project.paperScope;
        this.setToolbarControl(new SelectToolbar(this));

        let selectionRectangle = new paper.Path.Rectangle({strokeWidth:1,rescale:{strokeWidth:1},strokeColor:'black'});
        let sr2 = new paper.Path.Rectangle({strokeWidth:1,dashArray:[10,10],rescale:{strokeWidth:1,dashArray:[10,10]},strokeColor:'white'});
        this.project.toolLayer.addChild(selectionRectangle);
        this.project.toolLayer.addChild(sr2);
        selectionRectangle.applyRescale();
        sr2.applyRescale();
        selectionRectangle.visible=false;
        sr2.visible=false;
        
        this.extensions.onActivate=function(){ 
            self.tool.onMouseMove = (ev)=>self.onMouseMove(ev);
        }    
        this.extensions.onDeactivate=function(shouldFinish){
            self.project.overlay.removeClass('selectable-layer');
            self.tool.onMouseMove = null;
        }
        this.tool.extensions.onKeyUp=function(ev){
            if(ev.key=='escape'){
                self.project.paperScope.findSelectedItems().forEach(item=>item.deselect());
            }
        }
       
        /**
         * Event handler for mouse up events.
         * @private
         * @param {Event} ev - The mouse up event.
         * @property {boolean} visible - Hide the selection rectangle.
         * @property {HitResult} hitResult - The result of the hit test to find the item under the mouse pointer.
         * @property {boolean} toggleSelection - Indicates whether the 'Control' or 'Meta' key was pressed during the event.
         * @property {HitResult[]} hitResults - An array of hit test results containing items found within the area.
         * @property {boolean} keepExistingSelection - Indicates whether the 'Control' or 'Meta' key was pressed during the event.
         * @property {Item[]} selectedItems - An array of selected items to be deselected.
         */        
        this.tool.onMouseUp=function(ev){
            selectionRectangle.visible=false;
            sr2.visible=false;
            if(ev.downPoint.subtract(ev.point).length==0){
                //not a click-and-drag, do element selection
                let hitResult = self.hitTestPoint(ev);
                hitResult && self._isItemSelectable(hitResult.item) && hitResult.item.toggle((ev.modifiers.control || ev.modifiers.meta));
                
            } else{
                //click and drag, do area-based selection
                let hitResults = self.hitTestArea(ev);
                let keepExistingSelection = (ev.modifiers.control || ev.modifiers.meta);
                if(!keepExistingSelection){
                    self.project.paperScope.findSelectedItems().forEach(item=>item.deselect());
                }
                hitResults.forEach(item=>item.select(true))
                //limit results to a single layer
                // hitResults.filter(item=>item.layer === hitResults[0].layer).forEach(item=>item.select(true))
            }
        }
        /**
         * Event handler for mouse drag events.
         * @private
         * @param {Event} ev - The mouse drag event.
         * @property {boolean} visible - Show the selection rectangle.
         * @property {Rectangle} r - The bounding rectangle of the selection area.
         */
        this.tool.onMouseDrag = function(ev){
            selectionRectangle.visible=true;
            sr2.visible=true;
            let r=new paper.Rectangle(ev.downPoint,ev.point);
            selectionRectangle.set({segments:[r.topLeft, r.topRight, r.bottomRight, r.bottomLeft]});
            sr2.set({segments:[r.topLeft, r.topRight, r.bottomRight, r.bottomLeft]});
            // console.log(selectionRectangle.visible, selectionRectangle.segments)
        }
    }
//   /**
//    * Gets the selected items that are GeoJSON features.
//    * This method retrieves all the items in the Paper.js project that are considered as GeoJSON features and are currently selected.
//    * @returns {Array<Object>} An array of selected items that are GeoJSON features.
//    */
//     getSelectedItems(){
//         return this.ps.project.selectedItems.filter(i=>i.isGeoJSONFeature);
//     }
  /**
   * Checks if there are any GeoJSON feature items in the project.
   * This method searches through all the items in the Paper.js project and determines if there are any GeoJSON feature items.
   * @returns {boolean} Returns true if there are GeoJSON feature items, false otherwise.
   */
    doAnnotationItemsExist(){
        return this.ps.project.getItems({match:i=>i.isGeoJSONFeature}).length>0; 
    }

  /**
   * Handles mouse movement events and emits selection-related events for items under the cursor.
   * When the mouse moves within the Paper.js project area, this method detects if it is over any item and triggers related selection events.
   * It updates the currently hovered item and layer, and applies a CSS class to the project's overlay for highlighting selectable layers.
   * @param {Object} ev - The mouse move event object containing information about the cursor position.
   */
    onMouseMove(ev){
        if(ev.item && this._isItemSelectable(ev.item)){
            if(this.currentItem != ev.item) (ev.item.emit('selection:mouseenter')||true) 
            if(this.currentLayer != ev.item.layer) ev.item.layer.emit('selection:mouseenter');
            this.currentItem = ev.item;
            this.currentLayer = this.currentItem.layer;
            this.project.overlay.addClass('selectable-layer')
        }
        else{
            this.currenItem && (this.currentItem.emit('selection:mouseleave',ev)||true) 
            this.currentLayer && this.currentLayer.emit('selection:mouseleave',ev);
            this.project.overlay.removeClass('selectable-layer')
            this.currentItem = null;
            this.currentLayer = null;
        }   
    }
    /**
     * Performs a hit test on a specific point and returns hit results for GeoJSON feature items.
     * This method performs a hit test on the provided point and filters the results to include only GeoJSON feature items.
     * It also adjusts the hit result if the initial hit is not on the GeoJSON feature itself, but on a child item.
     * @param {Object} ev - The mouse event object containing the point to perform the hit test on.
     * @returns {HitResult} The hit result object containing information about the hit test.
     */
    hitTestPoint(ev){
        let hitResult = this.ps.project.hitTest(ev.point,{
            fill:true,
            stroke:true,
            segments:true,
            tolerance:this.getTolerance(5),
            match:i=>i.item.isGeoJSONFeature || i.item.parent.isGeoJSONFeature,
        })
        if(hitResult && !hitResult.item.isGeoJSONFeature){
            hitResult.item = hitResult.item.parent;
        }
        return hitResult;
    }
    /**
     * Performs a hit test within an area and returns hit results for GeoJSON feature items.
     * This method performs a hit test within the provided area and returns hit results that include only GeoJSON feature items.
     * It supports options for testing against fully contained or overlapping items.
     * @param {Object} ev - The mouse event object containing the area for hit testing.
     * @param {boolean} [onlyFullyContained=false] - Flag to indicate if hit test should be performed only on fully contained items.
     * @returns {HitResult[]} An array of hit results containing GeoJSON feature items within the specified area.
     */
    hitTestArea(ev,onlyFullyContained){
        let options = {
            match:item=>item.isGeoJSONFeature,
        }
        let testRectangle=new paper.Rectangle(ev.point,ev.downPoint);
        if(onlyFullyContained){
            options.inside=testRectangle;
        }
        else{
            options.overlapping=testRectangle;
        }
        let hitResult = this.ps.project.getItems(options);
        return hitResult;
    }

    _isItemSelectable(item){
        return true;
        return (this.items.length==0) || (item.layer == this.targetLayer);
    }
}
export{SelectTool};


class SelectToolbar extends AnnotationUIToolbarBase{
    constructor(tool){
        super(tool);
        this.dropdown.classList.add('select-dropdown');
        
        const i = makeFaIcon('fa-arrow-pointer');
        this.button.configure(i,'Selection Tool');
        
        const s = document.createElement('div');
        s.setAttribute('data-active', 'select');
        this.dropdown.appendChild(s);
        const span = document.createElement('span');
        span.innerHTML = '(Ctrl)click to select items.';
        s.append(span);        
    }
    
    isEnabledForMode(mode){
        let itemsExist = this.tool.doAnnotationItemsExist();
        return itemsExist && [
            'default',
            'select',
            'multiselection',
            'Polygon',
            'MultiPolygon',
            'Point:Rectangle',
            'Point:Ellipse',
            'Point',
            'LineString',
            'MultiLineString',
            'GeometryColletion:Raster',
        ].includes(mode);
    }
    
}