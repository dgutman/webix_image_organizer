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
 * Represents a polygon annotation tool that allows users to create and manipulate polygons on a canvas.
 * Inherits functionality from the AnnotationUITool class.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class PolygonTool extends AnnotationUITool{
    /**
     * Creates an instance of PolygonTool.
     * @constructor
     * @param {Object} paperScope - The Paper.js paper scope object, which provides context for working with Paper.js functionalities.
     * @description Initializes the PolygonTool by calling the base class (AnnotationUITool) constructor and setting up event handlers for drawing and editing polygons.
     * @property {paper.Tool} tool - The Paper.js Tool object associated with the PolygonTool.
     * @property {paper.Group} drawingGroup - The Paper.js Group used for drawing polygons.
     * @property {paper.Segment} draggingSegment - The currently dragged segment during editing.
     * @property {boolean} eraseMode - A flag indicating whether the tool is in erase mode.
     * @property {Object} simplifying - A flag indicating whether the tool is simplifying the drawn polygon.
     * @property {SimplifyJS} simplifier - An instance of the SimplifyJS library used for polygon simplification.
     */
    constructor(paperScope){
        super(paperScope);
        let _this = this;
        let tool = this.tool;
        this._lastClickTime = 0;
        this.drawingGroup = new paper.Group();
        this._currentItem = null;
        this._currentItemSelectedColor = null;
        this.project.toolLayer.addChild(this.drawingGroup);
        this.drawingGroup.visible=false;  
        this.draggingSegment = null;
        this.eraseMode=false;
        this.simplifying=null;
        // this.simplifier = new SimplifyJS();
        this.setToolbarControl(new PolygonToolbar(this));  
        
        /**
         * Event handler when the tool is activated.
         * Configures the tool settings and displays the drawing group on activation.
         * @private
         */
        this.extensions.onActivate = function(){
            tool.minDistance=4/_this.project.getZoom();
            tool.maxDistance=20/_this.project.getZoom();
            _this.drawingGroup.visible=true;
            _this.drawingGroup.selected=true;
            _this.targetLayer.addChild(_this.drawingGroup);
            _this._cacheCurrentItem();
        }
        /**
         * Event handler when the tool is deactivated.
         * Finalizes the current interaction if finished is true.
         * @private
         * @param {boolean} finished - A flag indicating whether the tool interaction is finished.
         */
        this.extensions.onDeactivate= function(finished){
            if(finished){
                _this.finish();
                _this.project.toolLayer.addChild(_this.drawingGroup);
                _this.drawingGroup.removeChildren();
                _this.drawingGroup.visible = false;
                _this.drawingGroup.selected = false;
                _this._restoreCachedItem();
                _this._currentItem = null;
            }
        }
        
        
        /**
         * Event handler for the key down event.
         * Handles keyboard shortcuts like toggling erase mode and undo/redo.
         * @private
         * @param {paper.KeyEvent} ev - The key event.
         */
        tool.extensions.onKeyDown=function(ev){
            if(ev.key=='e'){
                if(_this.eraseMode===false){
                    _this.setEraseMode(true);
                }
                else if(_this.eraseMode===true) {
                    _this.eraseMode='keyhold';
                }
            }
            if ((ev.event.metaKey||ev.event.ctrlKey) && !ev.event.shiftKey && ev.event.key === 'z') {
                _this.undo();
            }
            if ((ev.event.metaKey||ev.event.ctrlKey) && ev.event.shiftKey && ev.event.key === 'z') {
                _this.redo();
            }
        }
        /**
         * Event handler for the key up event.
         * Handles releasing keys, such as exiting erase mode.
         * @private
         * @param {paper.KeyEvent} ev - The key event.
         */
        tool.extensions.onKeyUp=function(ev){
            if(ev.key=='e' && _this.eraseMode=='keyhold'){
                _this.setEraseMode(false);
            }
            
        }
    
    }
    _cacheCurrentItem(){
        this._currentItem = this.item;
        this._currentItem && (this._currentItem.selectedColor = this._currentItemSelectedColor);
    }
    _restoreCachedItem(){
        this._currentItem && (this._currentItem.selectedColor = this._currentItemSelectedColor);
    }
    onSelectionChanged(){
        if(this.item !== this._currentItem){
            this._restoreCachedItem();
            this._cacheCurrentItem();
            
            this.targetLayer.addChild(this.drawingGroup);
            this.drawingGroup.removeChildren();

            this.setEraseMode(this.eraseMode);
        }
    }
    onMouseDown(ev){
        this.draggingSegment=null;
        let now = Date.now();
        let interval=now-this._lastClickTime;
        let dblClick = interval < 300;
        this._lastClickTime=now;

        this.simplifying && this.cancelSimplify();  
        
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('MultiPolygon');
            this.refreshItems();
            this._cacheCurrentItem();
            this.saveHistory();        
        }

        let dr = this.drawing();
        if(dr && dblClick){
            this.finishCurrentPath();
            this.draggingSegment=null;
            return;
        }
        
        let hitResult = (dr&&dr.path ||this.item).hitTest(ev.point,{fill:false,stroke:true,segments:true,tolerance:this.getTolerance(5)})
        if(hitResult){
            //if erasing and hitResult is a segment, hitResult.segment.remove()
            if(hitResult.type=='segment' && this.eraseMode){
                hitResult.segment.remove();
            }
            //if hitResult is a segment and NOT erasing, save reference to hitResult.segment for dragging it
            else if(hitResult.type=='segment'){
                this.draggingSegment = hitResult.segment;
            }
            //if hitResult is a stroke, add a point:
            else if(hitResult.type=='stroke'){
                let insertIndex = hitResult.location.index +1;
                let ns = hitResult.item.insert(insertIndex, ev.point);
            }
        }
        else if(dr){ //already drawing, add point to the current path object
            if(ev.point.subtract(dr.path.lastSegment).length<(5/this.project.getZoom())) return;
            dr.path.add(ev.point);
        }
        else{ //not drawing yet, but start now!
            this.drawingGroup.removeChildren();
            this.drawingGroup.addChild(new paper.Path([ev.point]));
            this.drawingGroup.visible=true;
            this.drawingGroup.selected=true;
            this.drawingGroup.selectedColor= this.eraseMode ? 'red' : null;
        }
        
        
    }
    onMouseUp(ev){
        let dr = this.drawing();
        if(dr && dr.path.segments.length>1){
            let hitResult = dr.path.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5)})
            if(hitResult && hitResult.segment == dr.path.firstSegment){
                this.finishCurrentPath();
            }
        }
        else if(this.draggingSegment){
            this.draggingSegment=null;
            if(!this.item.isBoundingElement){
                let boundingItems = this.item.parent.children.filter(i=>i.isBoundingElement);
                this.item.applyBounds(boundingItems);
            }
        }
        this.saveHistory()
    }
    onMouseMove(ev){
        let dr = this.drawing();
        let hitResult = this.item && (dr&&dr.path ||this.item).hitTest(ev.point,{fill:false,stroke:true,segments:true,tolerance:this.getTolerance(5)})
        if(hitResult){
            let action = hitResult.type + (this.eraseMode ? '-erase' : '');
            this.project.overlay.addClass('tool-action').setAttribute('data-tool-action',action);
        }
        else{
            this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action','');
        }  
    }
    onMouseDrag(ev){
        let dr = this.drawing();
        if(dr){
            dr.path.add(ev.point)
        }
        else if (this.draggingSegment){
            this.draggingSegment.point = this.draggingSegment.point.add(ev.delta);
        }
    }
    /**
     * Retrieves the current drawing state, including the active path being drawn.
     * @returns {?{path: paper.Path}} The current drawing state or null if no path is being drawn.
     */
    drawing(){
        return this.drawingGroup.lastChild && {
            path: this.drawingGroup.lastChild,
        }
    }
    /**
     * Finalizes the current polygon drawing and performs necessary cleanup.
     */
    finish(){
        // this.finishCurrentPath();
        this.setEraseMode(false);
        this.draggingSegment=null;
        this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action','');
        this.deactivate();
        this.drawingGroup.selected=false;      
        this.drawingGroup.visible=false;  
    }
    
    /**
     * Sets the erase mode, enabling or disabling removal of segments or entire polygons.
     * @param {boolean} erase - True to enable erase mode, false to disable.
     */
    setEraseMode(erase){
        this.eraseMode=erase;
        this.item && (this.item.selectedColor = erase ? 'red' : null);
        this.drawingGroup.selectedColor= erase ? 'red' : null;
        this.toolbarControl.setEraseMode(erase);
    }
    /**
     * Completes the current polygon path and updates the annotation accordingly.
     */
    finishCurrentPath(){
        let dr = this.drawing();
        if(!dr || !this.item || !this.item.parent) return;
        dr.path.closed=true;
            
        let result = this.eraseMode ? this.item.subtract(dr.path,{insert:false}) : this.item.unite(dr.path,{insert:false});
        if(result){
            result=result.toCompoundPath();
            if(!this.item.isBoundingElement){
                let boundingItems = this.item.parent.children.filter(i=>i.isBoundingElement);
                result.applyBounds(boundingItems);
            }
            this.item.removeChildren();
            this.item.addChildren(result.children);
            this.item.children.forEach(child=>child.selected=false);//only have the parent set selected status
            result.remove();
        }
        this.drawingGroup.removeChildren();
        
    }
    /**
     * Saves the current state of the annotation to the history stack for undo/redo functionality.
     */
    saveHistory(){
        //push current state onto history stack
        const historyLength = 10;
        let idx = (this.item.history||[]).position || 0;
        this.item.history=[{
            children:this.item.children.map(x=>x.clone({insert:false,deep:true})),
            drawingGroup:this.drawingGroup.children.map(x=>x.clone({insert:false,deep:true})),
        }].concat((this.item.history||[]).slice(idx,historyLength));
    }
    /**
     * Undoes the last annotation action, restoring the previous state.
     */
    undo(){
        
        let history=(this.item.history||[]);
        let idx = (history.position || 0) +1;
        if(idx<history.length){
            this.drawingGroup.removeChildren();
            this.item.removeChildren();
            this.item.children = history[idx].children.map(x=>x.clone({insert:true,deep:true}));
            this.drawingGroup.children = history[idx].drawingGroup.map(x=>x.clone({insert:true,deep:true}));
            history.position=idx;
        }
    }
    /**
     * Redoes the previously undone annotation action, restoring the next state.
     */
    redo(){
        
        let history=(this.item.history||[]);
        let idx = (history.position || 0) -1;
        if(idx>=0){
            this.drawingGroup.removeChildren();
            this.item.removeChildren();
            this.item.children = history[idx].children.map(x=>x.clone({insert:true,deep:true}));
            this.drawingGroup.children = history[idx].drawingGroup.map(x=>x.clone({insert:true,deep:true}));
            history.position=idx;
        }
    }
}
export {PolygonTool};
/**
 * Represents the toolbar for the PolygonTool, providing UI controls for polygon annotation.
 * Inherits functionality from the AnnotationUIToolbarBase class.
 * @extends AnnotationUIToolbarBase
 * @class
 * @memberof OSDPaperjsAnnotation.PolygonTool
 */
class PolygonToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new instance of the PolygonToolbar class.
     * @param {PolygonTool} polyTool - The associated PolygonTool instance.
     */
    constructor(polyTool){
        super(polyTool);
        
        const i = makeFaIcon('fa-draw-polygon');
        this.button.configure(i,'Polygon Tool');
        
        const fdd = document.createElement('div');
        fdd.classList.add('dropdown','polygon-toolbar');
        fdd.setAttribute('data-tool','polygon');
        this.dropdown.appendChild(fdd);
        const s = document.createElement('span');
        s.innerHTML = 'Click or Drag';
        fdd.appendChild(s);
    
        const simplifyDiv = document.createElement('div');
        fdd.appendChild(simplifyDiv);
        this.simplifyButton = document.createElement('button');
        this.simplifyButton.setAttribute('data-action', 'simplify');
        this.simplifyButton.innerHTML = 'Simplify';
        simplifyDiv.append(this.simplifyButton);
        this.simplifyButton.addEventListener('click',function(){
            polyTool.doSimplify();
            polyTool.saveHistory();
        });


        this.eraseButton = document.createElement('button');
        fdd.appendChild(this.eraseButton);
        this.eraseButton.setAttribute('data-action', 'erase');
        this.eraseButton.innerHTML = 'Eraser';
        this.eraseButton.addEventListener('click',function(){
            let erasing = this.classList.toggle('active');
            polyTool.setEraseMode(erasing);
        });

        
        const undoRedo = document.createElement('span');
        fdd.appendChild(undoRedo);

        this.undoButton = document.createElement('button');
        undoRedo.appendChild(this.undoButton);
        this.undoButton.setAttribute('data-action', 'undo');
        this.undoButton.setAttribute('title', 'Undo (ctrl-Z)');
        this.undoButton.innerHTML = '<';
        this.undoButton.addEventListener('click',function(){
            polyTool.undo();
        });

        this.redoButton = document.createElement('button');
        undoRedo.appendChild(this.redoButton);
        this.redoButton.setAttribute('data-action', 'redo');
        this.redoButton.setAttribute('title', 'Redo (ctrl-shift-Z)');
        this.redoButton.innerHTML = '>';
        this.redoButton.addEventListener('click',function(){
            polyTool.redo();
        });
    }
    /**
     * Check if the toolbar is enabled for the given mode.
     * @param {string} mode - The annotation mode.
     * @returns {boolean} True if enabled, false otherwise.
     */
    isEnabledForMode(mode){
        return ['new','MultiPolygon', 'Polygon'].includes(mode);
    }
    /**
     * Set the erase mode for the toolbar, updating UI state.
     * @param {boolean} erasing - True to enable erase mode, false to disable.
     */
    setEraseMode(erasing){
        erasing ? this.eraseButton.classList.add('active') : this.eraseButton.classList.remove('active');
    }

}
export {PolygonToolbar};

