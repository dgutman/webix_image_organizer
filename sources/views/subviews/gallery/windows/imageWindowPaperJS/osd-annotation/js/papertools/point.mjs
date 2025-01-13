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
import { Point } from '../paperitems/point.mjs';
// import { paper } from '../paperjs.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';
/**
 * Represents the PointTool class that allows users to create and manipulate Point features on the Paper.js project.
 * This tool provides functionality for creating points on the map, moving them, and updating their properties.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 */
class PointTool extends AnnotationUITool{
    /**
     * Creates an instance of PointTool.
     * @constructor
     * @param {Object} paperScope - The Paper.js paper scope object, which is the context for working with Paper.js functionalities.
     * @description The constructor initializes the PointTool by calling the base class (AnnotationUITool) constructor and sets up the necessary event handlers.
     * It also creates and configures the cursor used to represent the point creation on the map.
     * @property {paper.Tool} tool - The Paper.js Tool object associated with the PointTool.
     * @property {paper.Item} cursor - The Paper.js item representing the cursor for point creation.
     * @property {boolean} dragging - A flag indicating whether the user is currently dragging a point.
     */
    constructor(paperScope){
        super(paperScope);
        
        let cursor = new Point({geometry:{type:'Point',coordinates:[0,0]},properties:{label:'Point Tool'}}).paperItem;
        
        cursor.visible=false;
        delete cursor.isGeoJSONFeature; // remove this field since this isn't really part of the GeoJSON structure
        
        this.cursor = cursor;
        this.dragging = false;

        this.project.toolLayer.addChild(cursor);
        
        this.setToolbarControl(new PointToolbar(this));
        
        
        this.extensions.onActivate = ()=>{
            this.project.toolLayer.bringToFront();
            this.setCursorProps();
        }
        
        
        this.extensions.onDeactivate = ()=>{
            this.project.toolLayer.sendToBack();
            this.cursor.visible=false;
            this.project.overlay.removeClass('point-tool-grab', 'point-tool-grabbing');
        }
        
        
        this.onSelectionChanged = ()=>{
            this.setCursorProps();
        }
        
    }
    
    setCursorProps(){
        if(this.itemToCreate){
            this.cursor.fillColor = this.itemToCreate.fillColor;
            this.cursor.strokeColor = this.itemToCreate.strokeColor;
            this.cursor.visible = true;
        } else {
            this.cursor.visible = false;
        }
    }
    
    onMouseMove(ev){
        this.cursor.position = ev.original.point;
        if(this.item.hitTest(ev.point)){
            this.project.overlay.addClass('point-tool-grab');
        }
        else{
            this.project.overlay.removeClass('point-tool-grab');
        }   
    }
    
    onMouseDown(ev){
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('Point');
            this.refreshItems();
            this.item.position=ev.point;
            this.cursor.visible=false;
            this.toolbarControl.updateInstructions('Point');
        } else {
            if(this.item&&this.item.hitTest(ev.point)){
                this.dragging=true;
                this.project.overlay.addClass('point-tool-grabbing')
            }
        }
    }
    
    onMouseDrag(ev){
        if(this.dragging){
            this.item && (this.item.position = this.item.position.add(ev.delta))
        }
    }
    
    onMouseUp(){
        this.dragging=false;
        this.project.overlay.removeClass('point-tool-grabbing');
    }
}
export {PointTool};

/**
 * Represents the toolbar for the point annotation tool.
 * @class
 * @memberof OSDPaperjsAnnotation.PointTool
 * @extends AnnotationUIToolbarBase
 */
class PointToolbar extends AnnotationUIToolbarBase{
    /**
     * Creates an instance of PointToolbar.
     * @constructor
     * @param {Object} tool - The point annotation tool instance.
     * @description Initializes the PointToolbar by calling the base class (AnnotationUIToolbarBase) constructor and configuring the toolbar elements.
     * @property {Object} button - The configuration for the toolbar button.
     * @property {Object} instructions - The configuration for the toolbar instructions.
     */
    constructor(tool){
        super(tool);
        
        const i = makeFaIcon('fa-map-pin');
        this.button.configure(i,'Point Tool');

        this.instructions = document.createElement('span');
        this.instructions.classList.add('instructions');
        this.dropdown.appendChild(this.instructions);
    }
    /**
     * Check if the toolbar is enabled for the specified mode.
     * @param {string} mode - The mode to check against.
     * @returns {boolean} Returns true if the toolbar is enabled for the mode, otherwise false.
     * @description Checks if the toolbar is enabled for the specified mode and updates the instructions.
     */
    isEnabledForMode(mode){
        this.updateInstructions(mode);
        return ['new','Point'].includes(mode);
    }
    /**
     * Update the instructions on the toolbar based on the mode.
     * @param {string} mode - The mode for which the instructions are being updated.
     * @description Updates the instructions on the toolbar based on the specified mode.
     */
    updateInstructions(mode){
        const text = mode=='new'?'Click to drop a pin' : mode=='Point' ? 'Drag to reposition' : '???';
        this.instructions.innerHTML = text;
    }
}