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

import { AnnotationUIToolbarBase } from './annotationUITool.mjs';
import {PolygonTool} from './polygon.mjs';
import { paper } from '../paperjs.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';

/**
 * The LinestringTool class extends the PolygonTool and provides functionality for creating and modifying linestrings.
 * @extends PolygonTool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class LinestringTool extends PolygonTool{
    /**
    * The constructor initializes the LinestringTool by calling the base class (PolygonTool) constructor and sets up the necessary toolbar control (LinestringToolbar).
    * @memberof OSDPaperjsAnnotation.LinestringTool
    * @constructor
    * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
    * @property {paper.Shape.Circle} cursor - The cursor representing the pen for drawing linestrings. It is a Paper.js Circle shape.
    * @property {number} radius - The brush radius for drawing linestrings. This property controls the width of the linestring paths.
    * @property {paper.Path} draggingSegment - The segment that is being dragged during the mouse drag event. It is a Paper.js Path representing the segment.
    */
    constructor(paperScope){
        super(paperScope);
        let self = this;
        let tool = this.tool;   
        
        this.setToolbarControl(new LinestringToolbar(this));
        let lastClickTime=0;
        let drawColor = new paper.Color('green');
        let eraseColor= new paper.Color('red');
        this.radius = 0;
        this.cursor=new paper.Shape.Circle(new paper.Point(0,0),this.radius);
        this.cursor.set({
            strokeWidth:1,
            strokeColor:'black',
            fillColor:drawColor,
            opacity:1,
            visible:false,
        });
        self.project.toolLayer.addChild(this.cursor);

        this.clickAction = 'startPath';

        this.extensions.onActivate= ()=>{
            this.cursor.radius = this.radius/this.project.getZoom();
            this.cursor.strokeWidth=1/this.project.getZoom();
            this.refreshCursorVisibility();
            tool.minDistance=4/self.project.getZoom();
            tool.maxDistance=10/self.project.getZoom();
        }

        this.extensions.onDeactivate = finished => {
            this.cursor.visible=false;
            if(finished){
                this.finish();
            } 
        }
        
        tool.onMouseWheel = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            if(ev.deltaY==0) return;//ignore lateral "scrolls"
            
            this.toolbarControl.updateBrushRadius({larger:ev.deltaY < 0});
        }
    }

    /**
     * Set the brush radius for the linestring tool.
     * This function updates the brush radius used for drawing linestrings.
     * The new radius is adjusted according to the current zoom level.
     * @param {number} r - The new brush radius value to set.
     * 
     */        
    setRadius(r){
        this.radius = r;
        this.cursor.radius= r / this.project.getZoom();

    }


    onMouseDown(ev){
        this.draggingSegment=null;

        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('MultiLineString');
            this.refreshItems();
            
            this.startNewPath(ev);
            return;
        }
        
        let hitResult = this.item?.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5)})
        if(hitResult){
            //if erasing and hitResult is a segment, hitResult.segment.remove()
            if(hitResult.type=='segment' && this.eraseMode){
                hitResult.segment.remove();
            }
            
            //if hitResult is a segment and NOT erasing, save reference to hitResult.segment for dragging it
            else if(hitResult.type=='segment'){
                this.draggingSegment = hitResult.segment;
            }

            //if hitResult is a stroke, add a point (unless in erase mode):
            else if(hitResult.type=='stroke' && !this.eraseMode){
                let insertIndex = hitResult.location.index +1;
                hitResult.item.insert(insertIndex, ev.point);
            }
        }
        else{ //not drawing yet, but start now!
            if(!this.eraseMode) this.startNewPath(ev);
        }
        
    }

    
    onMouseMove(ev){
        this.cursor.position=ev.original.point;

        let hitResult = this.item?.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5)})
        if(hitResult){
            let action = hitResult.type + (this.eraseMode ? '-erase' : '');
            this.project.overlay.addClass('tool-action').setAttribute('data-tool-action',action);
            this.clickAction = action;
        }
        else{
            this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action','');
            this.clickAction = 'startPath';
        }
        
        this.refreshCursorVisibility();
    }
    
    onMouseDrag(ev){
        this.cursor.position=ev.original.point;
        
        PolygonTool.prototype.onMouseDrag.call(this, ev);
        let dr = this.drawing();
        dr && (dr.path.segments = this.simplifier.simplify(dr.path.segments.map(s=>s.point)));
    }
    
    onMouseUp(ev){
        this.finishCurrentPath();
    }

    /**
     * Start a new linestring path when the user clicks the mouse.
     * This function initializes the creation of a new linestring path, sets up a drawing group to hold the path, and listens for user mouse events to add new points to the path.
     * @function startNewPath
     * @memberof OSDPaperjsAnnotation.LinestringTool#
     * @param {paper.MouseEvent} ev - The mouse event containing the click information.
     */
    startNewPath(ev){
        this.finishCurrentPath();
        this.drawingGroup.removeChildren();
        this.drawingGroup.addChild(new paper.Path([ev.point]));
        // this.drawing = {path:this.drawingGroup.lastChild, index: 1};
        this.drawingGroup.visible=true;
        this.drawingGroup.selected=true;
        this.drawingGroup.selectedColor= this.eraseMode ? 'red' : null;
        let path = this.drawing().path;
        path.set({
            strokeWidth:this.radius  * 2 / this.targetLayer.scaling.x / this.project.getZoom(),
            strokeColor:this.item.strokeColor,
            strokeJoin: 'round',
            strokeCap: 'round',
        });
    }
    //override finishCurrentPath so it doesn't close the path
    /**
     * Finish the current linestring path when the user releases the mouse.
     * This function finalizes the current linestring path by adding it to the main item and clears the drawing group.
     * @function finishCurrentPath
     * @memberof OSDPaperjsAnnotation.LinestringTool#
     */
    finishCurrentPath(){
        if(!this.drawing() || !this.item) return;
        
        let newPath = this.drawing().path;
        if(newPath.segments.length>1){
            this.item.addChild(this.drawing().path);
        }
        this.drawingGroup.removeChildren();
    }

    refreshCursorVisibility(){
        this.cursor.visible = !this.eraseMode && this.clickAction==='startPath';
    }
}
export{LinestringTool};
/**
 * The LinestringToolbar class extends the AnnotationUIToolbarBase and provides the toolbar controls for the LinestringTool.
 * The constructor initializes the LinestringToolbar by calling the base class (AnnotationUIToolbarBase) constructor and sets up the necessary toolbar controls.
 * @extends AnnotationUIToolbarBase
 * @class
 * @memberof OSDPaperjsAnnotation.LinestringTool
 * @param {OSDPaperjsAnnotation.LinestringTool} linestringTool - The LinestringTool instance associated with the toolbar.
 * @property {jQuery} rangeInput - The range input element for adjusting the brush radius in the toolbar.
 * @property {jQuery} eraseButton - The erase button element in the toolbar for toggling erase mode.
 *
 */
class LinestringToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new LinestringToolbar instance.
     * The constructor initializes the LinestringToolbar by calling the base class (AnnotationUIToolbarBase) constructor and sets up the necessary toolbar controls.
     * @constructor
     * @param {OSDPaperjsAnnotation.LinestringTool} linestringTool - The LinestringTool instance associated with the toolbar.
     */
    constructor(linestringTool){
        super(linestringTool);
        this.linestringTool = linestringTool;

        const i = makeFaIcon('fa-pen-nib');
        this.button.configure(i,'Linestring Tool');
        
        const fdd = document.createElement('div');
        fdd.classList.add('dropdown','linestring-toolbar');
        fdd.setAttribute('data-tool','linestring');
        this.dropdown.appendChild(fdd);
        const label = document.createElement('label');
        label.innerHTML = 'Set pen width:';
        fdd.appendChild(label);


        let defaultRadius=4;
        
        this.rangeInput = document.createElement('input');
        fdd.appendChild(this.rangeInput);
        Object.assign(this.rangeInput, {type:'range', min:0.2, max:12, step:0.1, value:defaultRadius});
        this.rangeInput.addEventListener('change', function(){
            linestringTool.setRadius(this.value);
        });

        this.eraseButton = document.createElement('button');
        fdd.appendChild(this.eraseButton);
        this.eraseButton.innerHTML = 'Eraser';
        this.eraseButton.setAttribute('data-action','erase');
        this.eraseButton.addEventListener('click',function(){
            let erasing = this.classList.toggle('active');
            linestringTool.setEraseMode(erasing);
        });
        
        setTimeout(()=>linestringTool.setRadius(defaultRadius));
    }
    /**
     * Update the brush radius based on the mouse wheel scroll direction.
     * The updateBrushRadius function is called when the user scrolls the mouse wheel in the LinestringToolbar.
     * It updates the brush radius value based on the direction of the mouse wheel scroll.
     * If the larger property of the update object is true, it increases the brush radius.
     * If the larger property of the update object is false, it decreases the brush radius.
     * @function
     * @param {Object} update - An object containing the update information.
     * @param {boolean} update.larger - A boolean value indicating whether the brush radius should be increased or decreased.
     */
    updateBrushRadius(update){
        if(update.larger){
            this.rangeInput.value = parseFloat(this.rangeInput.value)+parseFloat(this.rangeInput.step);
            this.rangeInput.dispatchEvent(new Event('change'));
        }
        else{
            this.rangeInput.value = parseFloat(this.rangeInput.value)-parseFloat(this.rangeInput.step);
            this.rangeInput.dispatchEvent(new Event('change'));
        }
    }
        /**
     * Check if the LinestringTool should be enabled for the current mode.
     * The isEnabledForMode function is called to determine if the LinestringTool should be enabled for the current mode.
     * It returns true if the mode is 'new', 'LineString', or 'MultiLineString', and false otherwise.
     * @function
     * @param {string} mode - The current mode of the tool.
     * @returns {boolean} - A boolean value indicating whether the LinestringTool should be enabled for the current mode.
     */
    isEnabledForMode(mode){
        return ['new','LineString','MultiLineString'].includes(mode);
    }
    /**
     * Set the erase mode for the LinestringTool.
     * The setEraseMode function is called when the user clicks the erase button in the LinestringToolbar.
     * It sets the erase mode of the associated LinestringTool based on the value of the erasing parameter.
     * If erasing is true, it enables the erase mode in the LinestringTool by adding the 'active' class to the erase button.
     * If erasing is false, it disables the erase mode by removing the 'active' class from the erase button.
     * @function
     * @param {boolean} erasing - A boolean value indicating whether the erase mode should be enabled or disabled.
     */
    setEraseMode(erasing){
        erasing ? this.eraseButton.classList.add('active') : this.eraseButton.classList.remove('active');
        this.linestringTool.refreshCursorVisibility();
    }
}