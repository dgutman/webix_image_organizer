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
 * The RectangleTool class extends the AnnotationUITool and provides functionality for creating and modifying rectangles.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class RectangleTool extends AnnotationUITool{
    /**
     * Create a new RectangleTool instance.
    * @memberof OSDPaperjsAnnotation.RectangleTool
    * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
    * @property {string} mode - The current mode of the RectangleTool.
    * @property {paper.Path.Rectangle|null} creating - The currently creating rectangle.
    * @property {paper.Point|null} refPoint - The reference point used for resizing rectangles.
    * @property {paper.Point|null} ctrlPoint - The control point used for resizing rectangles.
    * @description This tool provides users with the ability to create new rectangles by clicking and dragging on the canvas, as well as modifying existing rectangles by resizing and moving them. It offers options to control the shape and position of the rectangles, making it a versatile tool for annotating and highlighting areas of interest.
    */
    constructor(paperScope){
        super(paperScope);
        let self=this;

        let crosshairTool = new paper.Group({visible:false});
        let h1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        let h2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        let v1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        let v2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        crosshairTool.addChildren([h1,h2,v1,v2]);
        this.project.toolLayer.addChild(crosshairTool);
        
        this.h1 = h1;
        this.h2 = h2;
        this.v1 = v1;
        this.v2 = v2;
        this.crosshairTool = crosshairTool;

        /**
         * The current mode of the RectangleTool, which can be 'creating', 'corner-drag', 'fill-drag', or 'modifying'.
         * @type {string}
         */
        this.mode = null;
        /**
         * The currently creating rectangle during the drawing process.
         * @type {paper.Path.Rectangle|null}
         */
        this.creating = null;
        
        this.setToolbarControl(new RectToolbar(this));

        this.extensions.onActivate = this.onSelectionChanged = function(){
            if(self.itemToCreate){
                self.mode='creating';
                crosshairTool.visible = true;
                self.creating = null;//reset reference to actively creating item
                self.toolbarControl.updateInstructions('new');
            }
            else if(self.creating && self.creating.parent==self.item){
                self.mode='creating';
                crosshairTool.visible = true;
                self.toolbarControl.updateInstructions('new');
            }
            else if (self.item){
                self.creating=null;//reset reference to actively creating item
                self.mode='modifying';
                crosshairTool.visible = false;
                self.toolbarControl.updateInstructions('Point:Rectangle');
            }
            else {
                // self.creating=null;//reset reference to actively creating item
                // self.mode=null;
                // crosshairTool.visible = false;
                // self.toolbarControl.updateInstructions('Point:Rectangle');
                self.deactivate();
            }
        }
        this.extensions.onDeactivate = function(finished){
            if(finished) self.creating = null;
            crosshairTool.visible=false;
            self.mode=null;
            self.project.overlay.removeClass('rectangle-tool-resize');
            self.project.overlay.removeClass('rectangle-tool-move');
        }
        
    }

    get rectangle(){
        // handle the case where the actual rectangle is the first child of a group, or just the item itself
        return (this.item.children && this.item.children[0]) || this.item;
    }

    setCursorPosition(point){
        //to do: account for view rotation
        // let viewBounds=tool.view.bounds;
        let tool = this.tool;

        let pt = tool.view.projectToView(point);
        let left=tool.view.viewToProject(new paper.Point(0, pt.y))
        let right=tool.view.viewToProject(new paper.Point(tool.view.viewSize.width, pt.y))
        let top=tool.view.viewToProject(new paper.Point(pt.x, 0))
        let bottom=tool.view.viewToProject(new paper.Point(pt.x,tool.view.viewSize.height))
        // console.log(viewBounds)
        this.h1.segments[0].point = left;
        this.h2.segments[0].point = left;
        this.h1.segments[1].point = right;
        this.h2.segments[1].point = right;
        this.v1.segments[0].point = top;
        this.v2.segments[0].point = top;
        this.v1.segments[1].point = bottom;
        this.v2.segments[1].point = bottom;
    }
    onMouseDown(ev){
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('Point', 'Rectangle');
            this.refreshItems();
            
            let r=new paper.Path.Rectangle(ev.point,ev.point);
            this.creating = r;
            this.item.removeChildren();
            this.item.addChild(r);
            this.mode='creating';
        }
        else if(this.item){
            // try hit test on corners first
            let result = this.item.hitTest(ev.point,{fill:false,stroke:false,segments:true, tolerance:this.getTolerance(5) });
            if(result){
                // crosshairTool.visible=true;
                this.mode='corner-drag';
                let idx=result.segment.path.segments.indexOf(result.segment);
                let oppositeIdx=(idx+2) % result.segment.path.segments.length;
                this.refPoint = result.segment.path.segments[oppositeIdx].point;
                this.ctrlPoint = result.segment.point.clone();
                return;
            }
            
            // next hit test on "fill"
            if(this.item.contains(ev.point)){
                // crosshairTool.visible=true;
                this.mode='fill-drag';
                return;
            }
        }
    }

    onMouseMove(ev){
        this.setCursorPosition(ev.original.point);
        if(this.mode == 'modifying'){
            let hitResult = this.item.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5) });
            if(hitResult){
                this.project.overlay.addClass('rectangle-tool-resize');
            } else{
                this.project.overlay.removeClass('rectangle-tool-resize');
            }

            if(this.item.contains(ev.point)){
                this.project.overlay.addClass('rectangle-tool-move');
            } else {
                this.project.overlay.removeClass('rectangle-tool-move');
            }
        }
    }
    
    onMouseDrag(ev){
        let refPt, currPt, cursorPt, angle;
        let center = this.item.center;
        if(this.mode=='creating'){
            angle = -(this.item.view.getRotation() + this.item.layer.getRotation());
            refPt = ev.downPoint;
            
            if(ev.modifiers.command || ev.modifiers.control){
                let delta = ev.point.subtract(ev.downPoint);
                let axes = [[1,1],[1,-1],[-1,-1],[-1,1]].map(p=>new paper.Point(p[0],p[1]).rotate(angle));
                let closestAxis = axes.sort( (a, b) => a.dot(delta) - b.dot(delta))[0];
                let proj = delta.project(closestAxis);
                currPt = ev.downPoint.add(proj);
            } else {
                currPt = ev.point;
            }
        } else if(this.mode=='corner-drag'){
            angle = this.rectangle.segments[1].point.subtract(this.rectangle.segments[0].point).angle;
            refPt = this.refPoint;

            if(ev.modifiers.command || ev.modifiers.control){
                let delta = ev.point.subtract(this.refPoint);
                let axis = this.ctrlPoint.subtract(this.refPoint);
                let proj = delta.project(axis);
                currPt = this.refPoint.add(proj);
            } else {
                currPt = ev.point;
            }
        } else if(this.mode == 'fill-drag') {
            this.item.translate(ev.delta);
            return;
        } else{
            this.setCursorPosition(ev.original.point);
            return;
        }
        this.setCursorPosition(this.targetLayer.matrix.transform(currPt));
        // this.setCursorPosition(currPt);
        let r=new paper.Rectangle(refPt.rotate(-angle,center),currPt.rotate(-angle, center));
        let corners = [r.topLeft, r.topRight, r.bottomRight, r.bottomLeft].map(p=>p.rotate(angle,center));
        this.rectangle.set({segments:corners})
    }
    
    onMouseUp(){
        this.mode='modifying';
        this.crosshairTool.visible=false;
        this.creating=null;
        this.toolbarControl.updateInstructions('Point:Rectangle');
    }
    
}

export {RectangleTool};

/**
 * The RectToolbar class extends the AnnotationUIToolbarBase and provides a toolbar for the RectangleTool.
 * @extends AnnotationUIToolbarBase
 * @memberof OSDPaperjsAnnotation.RectangleTool#
 */
class RectToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new RectToolbar instance.
     * @param {RectangleTool} tool - The RectangleTool instance.
     */
    constructor(tool){
        super(tool);
        
        const i = makeFaIcon('fa-vector-square');
        this.button.configure(i,'Rectangle Tool');
        
        this.instructions = document.createElement('span');
        this.instructions.innerHTML = 'Click and drag to create a rectangle';
        this.dropdown.appendChild(this.instructions);
    }
    /**
     * Check if the toolbar is enabled for the specified mode.
     * @param {string} mode - The mode to check.
     * @returns {boolean} True if the toolbar is enabled for the mode, false otherwise.
     */
    isEnabledForMode(mode){
        return ['new','Point:Rectangle'].includes(mode);
    }
    /**
     * Update the instructions text based on the mode.
     * @param {string} mode - The current mode.
     */
    updateInstructions(mode){
        const text = mode=='new'?'Click and drag to create a rectangle' : mode=='Point:Rectangle' ? 'Drag a corner to resize' : '???'; 
        this.instructions.innerHTML = text;
    }
}