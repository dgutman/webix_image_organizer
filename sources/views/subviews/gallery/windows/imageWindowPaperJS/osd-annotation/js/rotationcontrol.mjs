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

import { OpenSeadragon } from './osd-loader.mjs';
import { ToolBase } from './papertools/base.mjs';
import {PaperOverlay} from './paper-overlay.mjs';
import { paper } from './paperjs.mjs';

/**
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class RotationControlOverlay{
    /**
     * Creates an instance of the RotationControlOverlay.
     *
     * @param {any} viewer - The viewer object.
     */
    constructor(viewer){
        let overlay=this.overlay = new PaperOverlay(viewer,{overlayType:'viewer'})
        let tool = this.tool = new RotationControlTool(this.overlay.paperScope, this);
        this.dummyTool = new this.overlay.paperScope.Tool();//to capture things like mouseMove, keyDown etc (when actual tool is not active)
        this.dummyTool.activate();
        this._mouseNavEnabledAtActivation = true;
        const button = overlay.addViewerButton({
            faIconClass:'fa-rotate',
            tooltip:'Rotate viewer',
            onClick:()=>{
                tool.active ? this.deactivate() : this.activate();
            }
        });
        button.element.querySelector('svg.icon')?.style.setProperty('width','1em');
     
    }
    /**
     * Activates the rotation control.
     */
    activate(){
        this._mouseNavEnabledAtActivation=this.overlay.viewer.isMouseNavEnabled();
        this.tool.activate();
        this.tool.active=true;
        this.overlay.bringToFront();
    }
    /**
     * Deactivates the rotation control.
     */
    deactivate(){
        this.tool.deactivate(true);
        this.dummyTool.activate();
        this.overlay.viewer.setMouseNavEnabled(this._mouseNavEnabledAtActivation);
        this.tool.active=false;
        this.overlay.sendToBack();
    }
    
}

/**
 * @class 
 * @memberof OSDPaperjsAnnotation
 * @extends ToolBase
 * 
 */
class RotationControlTool extends ToolBase{
    /**
     * Creates an instance of the RotationControlTool.
     * @constructor
     * @param {any} paperScope - The paper scope object.
     * @param {any} rotationOverlay - The rotation overlay object.
     */
    constructor(paperScope, rotationOverlay){
        super(paperScope);
        let self=this;
        let bounds = paperScope.view.bounds;
        let widget = new RotationControlWidget(paperScope.view.bounds.center, setAngle, close);

        paperScope.view.on('flip',()=>{
            widget.closeButton.scale(-1, 1, widget.item.bounds.center);
        });

        let viewer = paperScope.overlay.viewer;

        viewer.addHandler('rotate', (ev)=>widget.setCurrentRotation(ev.degrees));
        paperScope.view.on('resize',function(ev){
            let pos = widget.item.position;
            let w = pos.x / bounds.width;
            let h = pos.y / bounds.height;
            bounds = paperScope.view.bounds;//new bounds after the resize
            widget.item.position = new paper.Point(w * bounds.width, h * bounds.height);
        })
        widget.item.visible = false;
        self.project.toolLayer.addChild(widget.item);
        
        //add properties to this.tools so that they properly appear on html
        this.tool.onMouseDown=function(ev){
            
        }
        this.tool.onMouseDrag=function(ev){
            
        }
        this.tool.onMouseMove=function(ev){
            widget.setLineOrientation(ev.point);
        }
        this.tool.onMouseUp = function(){
            
        }
        this.tool.extensions.onKeyDown=function(ev){
            if(ev.key=='escape'){
                rotationOverlay.deactivate();
            }
        }
        this.extensions.onActivate = function(){
            if(widget.item.visible==false){
                widget.item.position=paperScope.view.bounds.center;//reset to center when activated, so that if it gets lost off screen it's easy to recover
            }
            widget.item.visible=true;
            widget.item.opacity = 1;
        }
        this.extensions.onDeactivate = function(finished){
            if(finished){
                widget.item.visible=false;
            }
            widget.item.opacity = 0.3;
        }
        /**
         * Sets the angle of the rotation.
         * @memberof OSDPaperjsAnnotation.RotationControlTool#
         * @param {number} angle - The angle to set.
         * @param {any} pivot - The pivot point for the rotation.
         */
        function setAngle(angle, pivot){
            if(!pivot){
                let widgetCenter = new OpenSeadragon.Point(widget.item.position.x, widget.item.position.y)
                pivot = viewer.viewport.pointFromPixel(widgetCenter);
                
            }
            viewer.viewport.rotateTo(angle, pivot, true);
        }
        function close(){
            rotationOverlay.deactivate();
        }
    }
    
}
export {RotationControlTool};
export {RotationControlOverlay};

/**
 * Creates a rotation control widget.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @param {paper.Point} center - The center point of the widget.
 * @param {Function} setAngle - The function to set the rotation angle.
 * @returns {object} The rotation control widget object.
 */
function RotationControlWidget(center, setAngle, close){
 
    let width = center.x*2;
    let height= center.y*2;
    let radius = Math.min(width/5, height/5, 30);
    let innerRadius = radius * 0.3;

    let baseAngle = new paper.Point(0, -1).angle; //make north the reference direction for 0 degrees (even though normally it would be east)

    //group will contain all the elements of the GUI control
    let group = new paper.Group({insert:false});
    
    //circle is the central region with crosshair and cardinal points
    let circle = new paper.Path.Circle({center:new paper.Point(0,0),radius:radius});
    circle.fillColor = new paper.Color(0,0,0,0.01);//nearly transparent fill so the fill can be clickable
    circle.strokeColor = 'black';
    circle.strokeWidth = 2;
    
    //crosshair to focus on central point of circle
    [0,90,180,270].map(angle=>{
        let crosshair = new paper.Path.Line(new paper.Point(0, innerRadius),new paper.Point(0, radius));
        crosshair.rotate(angle, new paper.Point(0,0));
        crosshair.fillColor = null;
        crosshair.strokeColor = 'black';
        crosshair.strokeWidth = 2;
        group.addChild(crosshair);
    })

    //controls for north, east, south, west    
    let cardinalControls=[0,90,180,270].map(angle=>{
        let rect = new paper.Path.Rectangle(new paper.Point(-innerRadius, 0),new paper.Size(innerRadius*2,-1*(radius+innerRadius*1.5)));
        let control = rect.subtract(circle,{insert:false});
        rect.remove();
        control.rotate(angle, new paper.Point(0,0));
        control.fillColor = new paper.Color(100,100,100,0.5);
        control.strokeColor = 'black';
        control._angle = angle;
        group.addChild(control);
        return control;
        
    })

    //add circle after others so it can capture mouse events
    group.addChild(circle);

    //dot indicating current rotation status of the image
    let currentRotationIndicator = new paper.Path.Circle({center:new paper.Point(0, -radius), radius:innerRadius/1.5});
    currentRotationIndicator.set({fillColor:'yellow',strokeColor:'black',applyMatrix:false});//applyMatrix=false so the rotation property saves current value
    group.addChild(currentRotationIndicator);
    

    //line with arrows indicating that any spot on the image can be grabbed in order to perform rotation
    let rotationLineControl = new paper.Group({applyMatrix:false});
    let arrowControl = new paper.Group({applyMatrix:false});
    
    
    let rcc = new paper.Color(0.3,0.3,0.3,0.8);
    let lineControl = new paper.Path.Line(new paper.Point(0, -innerRadius), new paper.Point(0, -Math.max(width, height)));
    lineControl.strokeColor = rcc;
    lineControl.strokeWidth = 1;
    lineControl.applyMatrix=false;
    rotationLineControl.addChild(lineControl);
    rotationLineControl.addChild(arrowControl);

    let aa=94;
    let ah1 = new paper.Path.RegularPolygon(new paper.Point(-innerRadius*1.2, 0), 3, innerRadius*0.8);
    ah1.rotate(-aa);
    let ah2 = new paper.Path.RegularPolygon(new paper.Point(innerRadius*1.2, 0), 3, innerRadius*0.8);
    ah2.rotate(aa);
    let connector = new paper.Path.Arc(new paper.Point(-innerRadius*1.2, 0),new paper.Point(0, -innerRadius/4),new paper.Point(innerRadius*1.2, 0))
    let connectorbg = connector.clone();
    arrowControl.addChildren([connectorbg,connector,ah1,ah2]);
    arrowControl.fillColor = 'yellow';
    connector.strokeWidth=innerRadius/2;
    connectorbg.strokeWidth = connector.strokeWidth+2;
    connectorbg.strokeColor = rcc;
    ah1.strokeColor = rcc;
    ah2.strokeColor = rcc;
    connector.strokeColor='yellow';
    connector.fillColor=null;

    group.addChild(rotationLineControl);

    // close button
    let closeButton = new paper.Group({insert:false});
    closeButton.addChild(new paper.Path.Circle({radius:innerRadius}));
    closeButton.addChild(new paper.Path.Line(new paper.Point(-innerRadius/2, -innerRadius/2), new paper.Point(innerRadius/2, innerRadius/2)));
    closeButton.addChild(new paper.Path.Line(new paper.Point(innerRadius/2, -innerRadius/2), new paper.Point(-innerRadius/2, innerRadius/2)));
    closeButton.set({fillColor:'red',strokeColor:'black',opacity:0.7});
    closeButton.position = new paper.Point(radius*1.5, -radius*1.5), 
    group.addChild(closeButton);
    
    group.pivot = circle.bounds.center;//make the center of the circle the pivot for the entire  controller
    group.position = center;//set position after adding all children so it is applied to all

    

    //define API

    /**
    * The rotation control widget object.
    *     
    * @memberof OSDPaperjsAnnotation.RotationControlWidget
    * @property {paper.Group} item - The group containing all the elements of the widget.
    * @property {paper.Path.Circle} circle - The central region with crosshair and cardinal points.
    * @property {Array<paper.Path.Rectangle>} cardinalControls - The controls for north, east, south, west.
    * @property {paper.Group} rotationLineControl - The line with arrows indicating the spot for grabbing to perform rotation.
    * @example
    * // Usage example:
    * const rotationControl = new OSDPaperjsAnnotation.RotationControlWidget(centerPoint, setRotationAngle);
    * paper.project.activeLayer.addChild(rotationControl.item);
    * 
    * // Set the current rotation angle
    * rotationControl.setCurrentRotation(45);
    * 
    * // Set the line orientation for control
    * const orientationPoint = new paper.Point(150, 150);
    * rotationControl.setLineOrientation(orientationPoint, true);
    */
    let widget={};
    //add items
    widget.item = group;
    widget.circle = circle;
    widget.cardinalControls = cardinalControls;
    widget.rotationLineControl = rotationLineControl;
    widget.closeButton = closeButton;

    //add API functions
    /**
   * Sets the current rotation angle.
   * @memberof OSDPaperjsAnnotation.RotationControlWidget#
   * @method setCurrentRotation
   * @param {number} angle - The angle to set.
   */
    widget.setCurrentRotation = (angle)=>{
        // console.log('setCurrentRotation',angle);
        currentRotationIndicator.rotate(angle-currentRotationIndicator.rotation, circle.bounds.center)
    };
    /**
     * Sets the orientation of the line control.
     * @memberof OSDPaperjsAnnotation.RotationControlWidget#
     * @method setLineOrientation
     * @param {paper.Point} point - The point representing the orientation.
     * @param {boolean} [makeVisible=false] - Whether to make the control visible.
     */
    widget.setLineOrientation = (point, makeVisible=false)=>{
        let vector = point.subtract(circle.bounds.center);
        let angle = vector.angle - baseAngle;
        let length = vector.length;
        rotationLineControl.rotate(angle - rotationLineControl.rotation, circle.bounds.center);
        rotationLineControl.visible = makeVisible || length > radius+innerRadius*1.5;
        arrowControl.position = new paper.Point(0, -length);
        lineControl.segments[1].point = new paper.Point(0, -length);
    }

    //add intrinsic item-level controls
    cardinalControls.forEach(control=>{
        control.onClick = function(){
            setAngle(control._angle);
        }
    });
    currentRotationIndicator.onMouseDrag=function(ev){
        let dragAngle = ev.point.subtract(circle.bounds.center).angle;
        let angle = dragAngle - baseAngle;
        setAngle(angle);
    }
    arrowControl.onMouseDown=function(ev){
        arrowControl._angleOffset = currentRotationIndicator.rotation - ev.point.subtract(circle.bounds.center).angle;
    }
    arrowControl.onMouseDrag=function(ev){
        let hitResults = this.project.hitTestAll(ev.point).filter(hr=>cardinalControls.includes(hr.item));
        let angle;
        if(hitResults.length>0){
            //we are over a cardinal direction control object; snap the line to that angle
            // angle = -hitResults[0].item._angle + arrowControl._angleOffset;
            ev.point = hitResults[0].item.bounds.center;
        }
        angle = ev.point.subtract(circle.bounds.center).angle + arrowControl._angleOffset;
        setAngle(angle);
        widget.setLineOrientation(ev.point, true);
    }
    // arrowControl.onMouseUp = function(ev){
    //     // console.log('arrow mouseup',ev)
        
    // }
    circle.onMouseDrag=function(ev){
        widget.item.position = widget.item.position.add(ev.delta);
    }

    closeButton.onClick = function(){
        close();
    }

    return widget;
}
