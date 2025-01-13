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

import {ToolBase} from './base.mjs';
import { OpenSeadragon } from '../osd-loader.mjs';
import { SimplifyJS } from '../utils/simplify.mjs';

/**
 * Base class for annotation tools, extending the ToolBase class.
 *
 * @class
 * @extends ToolBase
 * @memberof OSDPaperjsAnnotation
 */
class AnnotationUITool extends ToolBase{
    /**
     * Create an AnnotationUITool instance.
     *
     * @constructor
     * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
     *
     * @property {boolean} _active - Flag indicating if the tool is currently active.
     * @property {paper.Item[]} _items - Array of selected items.
     * @property {paper.Item} _item - The selected item (if only one is selected).
     * @property {paper.Item} _itemToCreate - The selected new item to be created.
     */
    constructor(paperScope){
        super(paperScope)
        
        this._active=false;
        this._items=[];
        this._item=null;

        this.simplifier = new SimplifyJS();

        this.tool.onMouseDown = ev => {
            this.onMouseDown(this._transformEvent(ev));
        }
        this.tool.onMouseDrag = ev => {
            this.onMouseDrag(this._transformEvent(ev));
        }
        this.tool.onMouseMove = ev => {
            this.onMouseMove(this._transformEvent(ev));
        }
        this.tool.onMouseUp = ev => {
            this.onMouseUp(this._transformEvent(ev));
        }

    }

    isActive(){
        return this._active;
    }
    
    /**
     * Activate the annotation tool, making it ready for interaction.
     * If another tool was active, it's deactivated before activating this tool.
     */
    activate(){
        if(this._active) return;//breaks possible infinite loops of tools activating/deactivating each other
        this._active=true;
        this.getSelectedItems();
        this._setTargetLayer();
        let previousTool=this.project.paperScope.getActiveTool();
        this.tool.activate();
        this.toolbarControl.activate();//console.log('toolbar control activated')
        previousTool && previousTool != this && previousTool.deactivate(true);

        this.raiseCanvasZIndex();

        this.onActivate();
        this.broadcast('activated',{target:this});
    }
    /**
     * Deactivate the annotation tool, stopping its interaction.
     * @param {boolean} finishToolAction - Whether the tool action should be completed before deactivating.
     */
    deactivate(finishToolAction){
        if(!this._active) return;//breaks possible infinite loops of tools activating/deactivating each other
        this._active=false;
        this.toolbarControl.deactivate();

        this.resetCanvasZIndex();
        
        this.onDeactivate(finishToolAction);
        this.broadcast('deactivated',{target:this}); 
    }

    /**
     * Raise the viewer canvas's z-index so that toolbars don't interfere
     */
    raiseCanvasZIndex(){
        //raise the viewer's canvas to the top of the z-stack of the container element so that the toolbars don't interfere
        const viewer = this.project.paperScope.overlay.viewer;
        const canvas = viewer.canvas;
        this._canvasPriorZIndex = window.getComputedStyle(canvas)['z-index'];
        const siblings = Array.from(viewer.canvas.parentElement.children).filter(c => c!==canvas);
        const maxZ = Math.max(...siblings.map(el => {
            const z = window.getComputedStyle(el)['z-index'];
            return z === 'auto' ? 0 : parseInt(z);
        }));
        canvas.style['z-index'] = maxZ + 1;
    }

    /**
     * Return the viewer canvas to its original z-index 
     */
    resetCanvasZIndex(){
        //reset z-index of viewer canvas
        const canvas = this.project.paperScope.overlay.viewer.canvas;
        canvas.style['z-index'] = this._canvasPriorZIndex;
    }
    /**
     * Get the associated toolbar control for the tool.
     * @returns {AnnotationUIToolbarBase} The toolbar control instance.
     */
    getToolbarControl(){
        return this.toolbarControl;
    }
    /**
     * Set the associated toolbar control for the tool.
     *
     * @param {AnnotationUIToolbarBase} toolbarControl - The toolbar control instance to set.
     * @returns {AnnotationUIToolbarBase} The provided toolbar control instance.
     */
    setToolbarControl(toolbarControl){
        this.toolbarControl = toolbarControl;
        return this.toolbarControl;
    }
    /**
     * Refresh the list of currently selected items.
     */
    refreshItems(){
        return this.getSelectedItems();
    }
    /**
     * Retrieve the list of currently selected items.
     */
    getSelectedItems(){
        this._items = this.project.paperScope.findSelectedItems();
        this._itemToCreate = this.project.paperScope.findSelectedNewItem();
    }
    /**
     * Callback function triggered when the selection of items changes.
     * This function can be overridden in subclasses to react to selection changes.
     */
    selectionChanged(){
        this.getSelectedItems();
        this._setTargetLayer();
        this.onSelectionChanged();
    }
    /**
     * Callback function triggered when the selection changes.
     * To be implemented in subclasses.
     */
    onSelectionChanged(){}
    /**
     * Get the array of currently selected items.
     *
     * @returns {paper.Item[]} An array of currently selected items.
     */
    get items(){
        return this._items;
    }
    /**
     * Get the currently selected item, if only one is selected.
     *
     * @returns {paper.Item|null} The currently selected item, or null if no item is selected.
     */
    get item(){
        return this._items.length==1 ? this._items[0] : null;
    }
    /**
     * Get the selected new item to be created.
     *
     * @returns {paper.Item|null} The selected new item, or null if no item is selected.
     */
    get itemToCreate(){
        return this._itemToCreate;
    }

    get targetLayer(){
        return this._targetLayer;
    }

    get targetMatrix(){
        return this.targetLayer ? this.targetLayer.matrix : this._identityMatrix;
    }

    /**
     * Simplifies the polygon by reducing the number of points while preserving shape fidelity.
     */
    doSimplify(items){
        if(items && !Array.isArray(items)){
            items = [items];
        }
        if(!items){
            items = this.items;
        }

        for(const item of items){
            let lengthThreshold = 10/this.project.getZoom();
            let tol = 2.5/this.project.getZoom();
            const simplifying = item.clone();
            
            let pathsToRemove=[];
            const paths = simplifying.children || [simplifying];
            paths.forEach(path=>{
                let pts = path.segments.map(s=>{
                    if(s.point.subtract(s.previous.point).length < lengthThreshold && s.point.subtract(s.next.point).length < lengthThreshold){
                        s.point.x = (s.point.x+s.previous.point.x+s.next.point.x)/3;
                        s.point.y = (s.point.y+s.previous.point.y+s.next.point.y)/3;
                    }
                    return s.point;
                })
                pts.push(pts[0]);//
                let newpts = this.simplifier.simplify(pts,tol,true);
                path.segments=newpts;
                if(path.segments.length < 3 || Math.abs(path.area) < tol*tol) pathsToRemove.push(path);
                
            })
            pathsToRemove.forEach(p=>p.remove());
            let united = simplifying.unite(simplifying,{insert:false}).reduce().toCompoundPath();
            if(simplifying._children){
                simplifying.removeChildren();
                simplifying.addChildren(united.children);
            } else {
                simplifying.setSegments(united.children[0].segments);
            }
            if(!item.isBoundingElement){
                let boundingItems = item.parent.children.filter(i=>i.isBoundingElement);
                simplifying.applyBounds(boundingItems);
            }
            united.remove();
            if(item._children){
                item.removeChildren();
                item.addChildren(simplifying.children);
            } else {
                item.setSegments(simplifying.segments);
            }
            
            simplifying.remove();
            
        }
        
        
    }

    // private
    _setTargetLayer(){
        if(this.item){
            this._targetLayer = this.item.layer;
        } else if(this.itemToCreate){
            this._targetLayer = this.itemToCreate.layer;
        } else if(this.items){
            let layerSet = new Set(this.items.map(item=>item.layer));
            if(layerSet.size === 1){
                this._targetLayer = layerSet.values().next().value;
            } else {
                this._targetLayer = this.project.overlay.viewer.viewport.paperLayer;
            }
        } else {
            this._targetLayer = this.project.paperScope.project.activeLayer;
        }
    }
    // private
    _transformEvent(ev){
        let matrix = this.targetMatrix;
        let transformed = {
            point: matrix.inverseTransform(ev.point),
            downPoint: matrix.inverseTransform(ev.downPoint),
            lastPoint: matrix.inverseTransform(ev.lastPoint),
            middlePoint: matrix.inverseTransform(ev.middlePoint),
        };
        let deltaStart = ev.point.subtract(ev.delta);
        transformed.delta = transformed.point.subtract(matrix.inverseTransform(deltaStart));

        ev.original = {
            point: ev.point,
            downPoint: ev.downPoint,
            lastPoint: ev.lastPoint,
            middlePoint: ev.middlePoint,
            delta: ev.delta
        };

        Object.assign(ev, transformed);

        return ev;
    }
        
}
export{AnnotationUITool};

/**
 * Base class for annotation toolbar controls.
 *
 * @class
 * @memberof OSDPaperjsAnnotation.AnnotationUITool
 */
class AnnotationUIToolbarBase{
    /**
     * Create a new instance of AnnotationUIToolbarBase associated with an annotation tool.
     *
     * @constructor
     * @param {AnnotationUITool} tool - The annotation tool linked to the toolbar control.
     */
    constructor(tool){
        // let self=this;
        this._active=false;
        let button=document.createElement('button');
        button.classList.add('btn','invisible');
        button.textContent = 'Generic Tool';

        this.button=new OpenSeadragon.Button({
            tooltip:'Generic Tool',
            element:button,
            onClick:function(ev){if(!ev.eventSource.element.disabled) tool._active?tool.deactivate(true):tool.activate()},
        });
        this.button.configure=function(node,tooltip){
            this.element.title = tooltip;
            this.element.replaceChildren(node);
            this.element.classList.remove('invisible');
            this.tooltip=tooltip;
        }
        this.dropdown=document.createElement('div');
        this.dropdown.classList.add('dropdown'); 
        this.tool = tool;
    }
    /**
     * Check whether the toolbar control is enabled for a specific mode.
     *
     * @param {string} mode - The mode to check for enabling.
     * @returns {boolean} True if the toolbar control is enabled for the mode, otherwise false.
     */
    isEnabledForMode(mode){
        return false;
    }
    
    /**
     * Activate the toolbar control, making it visually active.
     */
    activate(){
        if(this._active) return;
        this._active=true;
        //this.tool.activate();
        this.button.element.classList.add('active');
        this.dropdown.classList.add('active');
    }
    /**
     * Deactivate the toolbar control, making it visually inactive.
     *
     * @param {boolean} shouldFinish - Whether the action associated with the control should be completed.
     */
    deactivate(shouldFinish){
        if(!this._active) return;
        this._active=false;
        //this.tool.deactivate(shouldFinish);
        this.button.element.classList.remove('active');
        this.dropdown.classList.remove('active');
    }
}
export{AnnotationUIToolbarBase};