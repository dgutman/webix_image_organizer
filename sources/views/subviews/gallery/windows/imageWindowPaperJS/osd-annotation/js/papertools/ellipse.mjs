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
 * Represents an Ellipse Tool in the Annotation Toolkit program.
 * This tool allows users to create and modify ellipses on the canvas.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 * @description The `EllipseToolbar` class provides a user interface toolbar for the ellipse annotation tool. It inherits from the `AnnotationUIToolbarBase` class and includes methods to configure, enable, and update instructions for the ellipse tool.
 */
class EllipseTool extends AnnotationUITool{
  /**
   * Create an EllipseTool instance.
   * @param {paper.PaperScope} paperScope - The Paper.js PaperScope instance.
   * @property {paper.Tool} tool - The Paper.js tool instance for handling mouse events.
   * @property {paper.Layer} toolLayer - The Paper.js project's tool layer where the crosshairTool is added.
   * @property {string|null} mode - The current mode of the Ellipse Tool.
   *     Possible values are 'creating', 'segment-drag', 'modifying', or null.
   * @property {paper.Path.Ellipse|null} creating - The currently active ellipse being created or modified.
   * @property {EllipseToolbar} toolbarControl - The EllipseToolbar instance associated with this EllipseTool.
   */
    constructor(paperScope){
        super(paperScope);
        let self=this;

        this.crosshairTool = new paper.Group({visible:false});
        this.h1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        this.h2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        this.v1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        this.v2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        this.crosshairTool.addChildren([this.h1, this.h2, this.v1, this.v2]);
        this.project.toolLayer.addChild(this.crosshairTool);
        
        this.mode = null;
        this.creating = null;
        
        this.setToolbarControl(new EllipseToolbar(this));
        
        
        this.extensions.onActivate = this.onSelectionChanged = function(){
            if(self.itemToCreate){
                self.mode='creating';
                self.crosshairTool.visible = true;
                self.creating = null;//reset reference to actively creating item
                self.toolbarControl.updateInstructions('new');
            }
            else if(self.creating && self.creating.parent==self.item){
                self.mode='creating';
                self.crosshairTool.visible = true;
                self.toolbarControl.updateInstructions('new');
            }
            else if (self.item){
                self.creating=null;//reset reference to actively creating item
                self.mode='modifying';
                self.crosshairTool.visible = false;
                self.toolbarControl.updateInstructions('Point:Ellipse');
            }
            else {
                self.creating=null;//reset reference to actively creating item
                self.mode=null;
                self.crosshairTool.visible = false;
                self.toolbarControl.updateInstructions('Point:Ellipse');
            }
        }
        this.extensions.onDeactivate = function(finished){
            if(finished) self.creating = null;
            self.crosshairTool.visible=false;
            self.mode=null;
            self.project.overlay.removeClass('rectangle-tool-resize');
        }
        
    }

    onMouseDown(ev){
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('Point', 'Ellipse');
            this.refreshItems();
            
            let r=new paper.Path.Ellipse(ev.point,ev.point);
            this.creating = r;
            this.item.removeChildren();
            this.item.addChild(r);
            this.mode='creating';
        } else if(this.item){
            // first do a hit test on the segments
            let result = this.item.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5)})
            if(result){
                
                this.mode='segment-drag';
                let idx=result.segment.path.segments.indexOf(result.segment);
                let oppositeIdx=(idx+2) % result.segment.path.segments.length;
                //save reference to the original points of the ellipse before the drag started
                this.points = {
                    opposite: result.segment.path.segments[oppositeIdx].point.clone(),
                    drag: result.segment.point.clone(),
                    p1: result.segment.next.point.clone(),
                    p2: result.segment.previous.point.clone(),
                }
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
    onMouseDrag(ev){
        let currPt;
        let center = this.item.bounds.center;
        if(this.mode=='creating'){
            let angle = -(this.item.view.getRotation() + this.item.layer.getRotation());
            if(this.item.view.getFlipped()){
                angle = 180 - angle;
            }
            
            if(ev.modifiers.command || ev.modifiers.control){
                let delta = ev.point.subtract(ev.downPoint);
                let axes = [[1,1],[1,-1],[-1,-1],[-1,1]].map(p=>new paper.Point(p[0],p[1]).rotate(angle));
                let closestAxis = axes.sort( (a, b) => a.dot(delta) - b.dot(delta))[0];
                let proj = delta.project(closestAxis);
                currPt = ev.downPoint.add(proj);
            } else {
                currPt = ev.point;
            }
            
            let r=new paper.Rectangle(ev.downPoint.rotate(-angle,center),currPt.rotate(-angle, center));
            let ellipse = new paper.Path.Ellipse(r); 
            ellipse.rotate(angle, center);
            this.item.children[0].set({segments: ellipse.segments});
            ellipse.remove();

        } else if(this.mode=='segment-drag'){
            let dragdelta = ev.point.subtract(this.points.opposite);
            let axis = this.points.drag.subtract(this.points.opposite);
            let proj = dragdelta.project(axis);
            let angle = axis.angle;
            
            if(ev.modifiers.command || ev.modifiers.control){
                //scale proportionally
                let scalefactor = proj.length / axis.length;
                let halfproj = proj.divide(2);
                let center = this.points.opposite.add(halfproj);
                let r1 = halfproj.length;
                let r2 = Math.abs(this.points.p1.subtract(this.points.opposite).multiply(scalefactor).cross(proj.normalize()));
                let ellipse = new paper.Path.Ellipse({center:center, radius: [r1, r2]}).rotate(angle);
                this.item.children[0].set({segments: ellipse.segments});
                ellipse.remove();
            } else {
                //scale in one direction only
                let halfproj = proj.divide(2);
                let center = this.points.opposite.add(halfproj);
                let r1 = halfproj.length;
                let r2 = Math.abs(this.points.p1.subtract(this.points.opposite).cross(proj.normalize()));
                let ellipse = new paper.Path.Ellipse({center:center, radius: [r1, r2]}).rotate(angle);
                this.item.children[0].set({segments: ellipse.segments});
                ellipse.remove();
            }

        } else if(this.mode == 'fill-drag') {
            this.item.translate(ev.delta);
            return;
        } else{
            this.setCursorPosition(ev.original.point);
            return;
        }
        this.setCursorPosition(this.targetLayer.matrix.transform(currPt));
        
    }
    onMouseMove(ev){
        this.setCursorPosition(ev.original.point);
        if(this.mode == 'modifying'){
            let hitResult = this.item.hitTest(ev.point,{fill:false,stroke:false,segments:true,tolerance:this.getTolerance(5)});
            if(hitResult){
                this.project.overlay.addClass('rectangle-tool-resize');
            } else { 
                this.project.overlay.removeClass('rectangle-tool-resize');
            }

            if(this.item.contains(ev.point)){
                this.project.overlay.addClass('rectangle-tool-move');
            } else {
                this.project.overlay.removeClass('rectangle-tool-move');
            }
        }
    }
   
    
    onMouseUp(){
        this.mode='modifying';
        this.crosshairTool.visible=false;
        this.creating=null;
        this.toolbarControl.updateInstructions('Point:Ellipse');
    }

    /**
     * Sets the cursor position and updates the crosshairTool to provide visual feedback.
     * This function calculates the position of the crosshair lines based on the current cursor position.
     * The crosshairTool displays lines intersecting at the cursor position, providing a reference for alignment and positioning.
     * @private
     * @param {paper.Point} point - The current cursor position in Paper.js coordinate system.
     */
    setCursorPosition(point){
        //to do: account for view rotation
        // let viewBounds=tool.view.bounds;
        let pt = this.tool.view.projectToView(point);
        let left = this.tool.view.viewToProject(new paper.Point(0, pt.y))
        let right = this.tool.view.viewToProject(new paper.Point(this.tool.view.viewSize.width, pt.y))
        let top = this.tool.view.viewToProject(new paper.Point(pt.x, 0))
        let bottom = this.tool.view.viewToProject(new paper.Point(pt.x, this.tool.view.viewSize.height))
        // console.log(viewBounds)

        let h1 = this.h1;
        let h2 = this.h2;
        let v1 = this.v1;
        let v2 = this.v2;

        h1.segments[0].point = left;
        h2.segments[0].point = left;
        h1.segments[1].point = right;
        h2.segments[1].point = right;
        v1.segments[0].point = top;
        v2.segments[0].point = top;
        v1.segments[1].point = bottom;
        v2.segments[1].point = bottom;
    }
    
}
export{EllipseTool};

/**
 * Represents an ellipse annotation tool's user interface toolbar.
 * @class
 * @memberof OSDPaperjsAnnotation.EllipseTool
 * @extends AnnotationUIToolbarBase
 * @description The `EllipseToolbar` class provides a user interface toolbar for the ellipse annotation tool. It inherits from the `AnnotationUIToolbarBase` class and includes methods to configure, enable, and update instructions for the ellipse tool.
 */
class EllipseToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new EllipseToolbar instance.
     * @param {AnnotationTool} tool - The annotation tool associated with the toolbar.
     * @description This constructor initializes a new `EllipseToolbar` instance by providing the associated annotation tool.
     */
    constructor(tool){
        super(tool);
        
        const i = makeFaIcon('fa-circle');
        this.button.configure(i,'Ellipse Tool');
        
        this.instructions = document.createElement('span');
        this.instructions.innerHTML = 'Click and drag to create an ellipse';
        this.dropdown.appendChild(this.instructions);

    }
     /**
     * Check if the ellipse tool is enabled for the given mode.
     * @param {string} mode - The mode of the annotation tool.
     * @returns {boolean} Returns `true` if the mode is 'new' or 'Point:Ellipse', otherwise `false`.
     * @description This method checks if the ellipse tool is enabled for the given mode by comparing it with the supported modes.
     */
    isEnabledForMode(mode){
        return ['new','Point:Ellipse'].includes(mode);
    }
    /**
     * Update the instructions based on the annotation tool's mode.
     * @param {string} mode - The mode of the annotation tool.
     * @description This method updates the instructions text based on the annotation tool's mode. It provides appropriate instructions for different modes.
     */
    updateInstructions(mode){
        const text = mode=='new'?'Click and drag to create an ellipse' : mode=='Point:Ellipse' ? 'Drag a point to resize' : '???';
        this.instructions.innerHTML = text;
    }
}