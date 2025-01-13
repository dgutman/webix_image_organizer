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
import { PointText } from '../paperitems/pointtext.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';

/**
 * The PointTextTool class empowers the annotation UI with the ability to add point-based text annotations.
 * This class extends the AnnotationUITool and is paired with the PointTextToolbar for interactive control.
 * @class
 * @memberof OSDPaperjsAnnotation
 * 
 */
class PointTextTool extends AnnotationUITool{
/**
 * Initialize the PointTextTool with Paper.js scope, cursor representation, and toolbar controls.
 *
 * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
 *
 * @property {paper.PointText} cursor - The visual representation of the text cursor.
 */
    constructor(paperScope){
        super(paperScope);
        
        this.dragging=false;
        
        /**
         * The visual representation of the text cursor.
         * @type {paper.PointText}
         */
        let pointText = new PointText({
            geometry:{
                type:'Point',
                coordinates:[0,0],
                properties:{
                    subtype:'PointText',
                    content:'Click to place',
                }
            },
            properties:{
                label:'Text Tool',
            }
        });
        
        let cursor = this.cursor = pointText.paperItem;
        cursor.isGeoJSONFeature = false;
        cursor.fillColor='grey';
        cursor.strokeColor='black';
        cursor.strokeWidth = 1;
        cursor.visible=false;
        this.project.toolLayer.addChild(cursor);
        
        pointText.refreshTextOffset();
        cursor.applyRescale();
        
        /**
         * Set the toolbar control for the PointTextTool.
         * This function sets the toolbar control using the provided instance of PointTextToolbar.
         * @private
         * @param {PointTextToolbar} toolbarControl - The toolbar control instance to be set.
         */
        this.setToolbarControl(new PointTextToolbar(this));
        /**
         * Activate event handler for the PointTextTool.
         * This function is called when the tool is activated, and it handles the setup of cursor visibility and interaction behavior.
         * @private
         */
        this.extensions.onActivate = () => {
            if(this.itemToCreate){
                // new item to be created - show the cursor
                this.cursor.visible = true;
                pointText.refreshTextOffset();
                cursor.applyRescale();
            } else if(this.item){
                // modifying an existing item
                this._updateTextInput();
            }
        }
        /**
         * Deactivate event handler for the PointTextTool.
         * This function is called when the tool is deactivated, and it handles cursor visibility and interaction cleanup.
         * @private
         */
        this.extensions.onDeactivate = () => {
            this.project.toolLayer.addChild(this.cursor);
            this.cursor.visible=false;
            this.project.overlay.removeClass('point-tool-grab', 'point-tool-grabbing');
        }
        
    }
    
    onSelectionChanged(){
        this.cursor.visible = !!this.itemToCreate;
        this._updateTextInput();
    }
    onMouseMove(ev){
        this.cursor.position = ev.original.point;
        if(this.item.hitTest(ev.point)){ // for some reason hit-testing needs to be done in transformed coordinates not original
            this.project.overlay.addClass('point-tool-grab');
        }
        else{
            this.project.overlay.removeClass('point-tool-grab');
        }   
    }
    onMouseDown(ev){
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('Point','PointText');
            this.refreshItems();
            this.item.children[1].content = this.toolbarControl.getValue();
            this.item.position=ev.point;
            this.cursor.visible=false;
            this.toolbarControl.updateInstructions('Point:PointText');
        }
        else{
            if(this.item && this.item.hitTest(ev.point)){ // for some reason hit-testing needs to be done in transformed coordinates not original
                this.dragging=true;
                this.project.overlay.addClass('point-tool-grabbing')
            }
        }
    }
    onMouseDrag=function(ev){
        if(this.dragging){
            this.item && (this.item.position = this.item.position.add(ev.delta))
        }
    }
    onMouseUp(){
        this.dragging=false;
        this.project.overlay.removeClass('point-tool-grabbing');
    }
    

    _updateTextInput(){
        let text = (this.item && this.item.annotationItem.subtype=='PointText') ? this.item.children[1].content : '';
        this.toolbarControl.setItemText(text);
        this.cursor.children[1].content = text.length ? text : this.toolbarControl.input.getAttribute('placeholder');
    }
}
export{PointTextTool};


/**
 * The PointTextToolbar class enhances the PointTextTool by providing an interactive toolbar for text annotation controls.
 * This class extends the AnnotationUIToolbarBase to manage the toolbar's behavior.
 * @class
 * @memberof OSDPaperjsAnnotation.PointTextTool
 * 
 * 
 */

class PointTextToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new instance of the PointTextToolbar, complementing the associated PointTextTool.
     *
     * @param {PointTextTool} tool - The corresponding PointTextTool instance.
     */
    constructor(tool){
        super(tool);
        let self = this;

        const i = makeFaIcon('fa-font');
        this.button.configure(i,'Text Tool');

        this.instructions = document.createElement('span');
        this.instructions.classList.add('instructions');
        this.dropdown.appendChild(this.instructions);

        this.input = document.createElement('input');
        this.input.setAttribute('type','text');
        this.input.setAttribute('placeholder', 'Enter text');
        this.dropdown.appendChild(this.input);
        this.input.addEventListener('input', function(){
            let value = self.getValue();
            if(self.tool.item && self.tool.item.annotationItem.subtype=='PointText'){
                self.tool.item.children[1].content = value;
            }
            self.tool.cursor.children[1].content = value;
        })
        
        this.input.dispatchEvent(new Event('input'));
    }
    /**
     * Update the input element's text content.
     *
     * @param {string} text - The text to be set in the input.
     */
    setItemText(text){
        this.input.value = text;
    }
    /**
     * Retrieve the current value from the input element.
     *
     * @returns {string} The value from the input.
     */
    getValue(){
        let input = this.input;
        return input.value.trim() || input.getAttribute('placeholder');
    }
    /**
     * Determine if the toolbar is enabled for the given annotation mode.
     *
     * @param {string} mode - The current annotation mode.
     * @returns {boolean} True if the toolbar is enabled, otherwise false.
     */
    isEnabledForMode(mode){
        this.updateInstructions(mode);
        return ['new','Point:PointText'].includes(mode);
    }
    
    /**
     * Update the instructional text based on the current annotation mode.
     *
     * @param {string} mode - The current annotation mode.
     */
    updateInstructions(mode){
        const text = mode=='new' ? 'Click to place' : mode=='Point:PointText' ? 'Drag to reposition' : '???';
        this.instructions.innerHTML = text;
    }
}