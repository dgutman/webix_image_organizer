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
 * The TransformTool class extends the AnnotationUITool and provides functionality for transforming selected items on the canvas.
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class TransformTool extends AnnotationUITool{
        /**
     * Create a new TransformTool instance.
     * @memberof OSDPaperjsAnnotation.TransformTool
     * @constructor
     * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
     *The constructor initializes the TransformTool by calling the base class (AnnotationUITool) constructor and sets up the necessary toolbar control (TransformToolbar).
     * @property {paper.PaperScope} ps - The Paper.js scope associated with the project.
     * @property {string} _mode - The current mode of the TransformTool.
     * @property {paper.Item[]} _moving - An array of items currently being moved or transformed.
     * @property {paper.Group} _transformTool - The TransformTool object that contains transformation controls.
     */
    constructor(paperScope){
        super(paperScope);
        let self=this;

        this.ps = this.project.paperScope;
        this._mode = 'transform';
        this._moving = [];
        this._active = false;
        this.setToolbarControl(new TransformToolbar(this));
        this._makeTransformToolObject(self.project.getZoom());
        
        this.extensions.onActivate=function(){ 
            self._active = true;
            self.enableTransformToolObject();
        }    
        this.extensions.onDeactivate=function(shouldFinish){
            self._active = false;
            self.project.overlay.removeClass('transform-tool-resize', 'transform-tool-rotate', 'transform-tool-move');
            if(shouldFinish){
                self.disableTransformToolObject();
            }
        }
    }
    onSelectionChanged(){
        this.enableTransformToolObject();
    }

    /**
     * @param {boolean} alwaysRescaleUniformly Whether the tool should enforce uniform scaling to maintain width:height ratio
     */
    setUniformScaling(alwaysRescaleUniformly){
        this._alwaysRescaleUniformly = alwaysRescaleUniformly;
    }

    /**
     * A function that creates and initializes the TransformTool object with the specified zoom level.
     * This function sets up the corners for resizing, the rotation handle, and translation controls.
     * @param {number} currentZoom - The current zoom level of the canvas.
     * @property {paper.Group} _transformTool - The TransformTool object that contains transformation controls.
     * @property {object} _transformTool.corners - An object containing corner control points for resizing the bounding box.
     * @property {paper.Shape.Rectangle} _transformTool.corners.topLeft - The control point for the top-left corner.
     * @property {paper.Shape.Rectangle} _transformTool.corners.topRight - The control point for the top-right corner.
     * @property {paper.Shape.Rectangle} _transformTool.corners.bottomRight - The control point for the bottom-right corner.
     * @property {paper.Shape.Rectangle} _transformTool.corners.bottomLeft - The control point for the bottom-left corner.
     * @property {paper.Shape.Circle} _transformTool.rotationHandle - The control point for rotating the bounding box.
     * @property {function} _transformTool.setBounds - A function that (re)positions the tool handles (corners, rotation control).
     * @property {function} _transformTool.transformItems - A function that applies transformation to selected items and sets up new objects for transforming.
     * @property {function} _transformTool.onMouseDown - This function is triggered when the mouse button is pressed on the transform tool. It marks that the tool is in the dragging state.
     * @property {function} _transformTool.onMouseUp - This function is triggered when the mouse button is released on the transform tool. It marks that the tool is not in the dragging state.
     * @property {function} _transformTool.onMouseDrag - This function is triggered when the mouse is moved while a mouse button is pressed on the transform tool. It handles the dragging behavior of the transform tool. Depending on the state (resizing or translating), it resizes or translates the selected items accordingly.
     * @property {function} _transformTool.onMouseMove - This function is triggered when the mouse is moved on the transform tool. It updates the visual appearance of the transform tool, highlighting relevant handles and controls based on the mouse position.
     */
    _makeTransformToolObject(currentZoom){
        let self=this;
        let cSize=12;//control size
             
        if(this._transformTool) this._transformTool.remove();
        this._transformTool = new paper.Group();
        
        this.project.toolLayer.addChild(this._transformTool);
        this._transformTool.applyMatrix=false;
        this._transformTool.transforming=[];
        this._transformTool.boundingRect = new paper.Shape.Rectangle(new paper.Point(0,0), new paper.Size(0,0));
        this._transformTool.boundingDisplay = new paper.Shape.Rectangle(new paper.Point(0,0), new paper.Size(0,0));
        this._transformTool.boundingRect.set({strokeWidth:0,fillColor:new paper.Color(0,0,0,0.001)});
        this._transformTool.boundingDisplay.set({strokeWidth:5,strokeColor:'lightblue',rescale:{strokeWidth:5}});
        this._transformTool.addChild(this._transformTool.boundingRect);
        this._transformTool.addChild(this._transformTool.boundingDisplay);
        
        //Resize operations
        this._transformTool.corners=[
            ['topLeft','bottomRight'],
            ['topRight','bottomLeft'],
            ['bottomRight','topLeft'],
            ['bottomLeft','topRight']
        ].reduce((acc,c)=>{
             let ctrl = new paper.Shape.Rectangle(new paper.Point(0,0),new paper.Size(cSize/currentZoom,cSize/currentZoom));
           
             ctrl.set({rescale:{size:z=>new paper.Size(cSize/z, cSize/z)},fillColor:'red',strokeColor:'black'});
             self._transformTool.addChild(ctrl);
            
             ctrl.anchor=c[0];
             ctrl.opposite=c[1];
             ctrl.onMouseDown = function(ev){ev.stopPropagation();}

             // scaling operations
             ctrl.onMouseDrag = function(ev){
                // first handle the bounding box
                let layerAngle = self.targetLayer.getRotation();
                let rotation=this.parent.rotation;
                let delta=ev.delta.rotate(-rotation);
                let refPos = this.parent.corners[this.opposite].position;

                if(self._alwaysRescaleUniformly || ev.modifiers.command || ev.modifiers.control){
                    delta = delta.project(this.position.subtract(refPos));
                }
                
                let oldPos = this.position;
                let newPos = this.position.add(delta);
                let oldSize=new paper.Rectangle(refPos,oldPos).size;
                let newSize=new paper.Rectangle(refPos,newPos).size;
                let scaleFactor = newSize.divide(oldSize);
                
                let refPosX = refPos.transform(this.parent.matrix);
                let refPosZ = this.parent.matrix.inverseTransform(this.parent.corners[this.opposite].refPos);

                refPosZ = self.targetMatrix.inverseTransform(refPosZ);

                this.parent.transforming.forEach( item=>{
                    let matrix = new paper.Matrix().rotate(-layerAngle, refPosZ).scale(scaleFactor.width,scaleFactor.height,refPosZ).rotate(layerAngle, refPosZ); 

                    item.matrix.append(matrix);
                    item.onTransform && item.onTransform('scale', refPosX, rotation, matrix);
                });
                
                this.parent.boundingRect.scale(scaleFactor.width,scaleFactor.height,refPos);
                this.parent.setBounds(true);

             }
             acc[c[0]]=ctrl;
             return acc;
         },{});

        //Rotation operations
        this._transformTool.rotationHandle=new paper.Shape.Circle(new paper.Point(0,0),cSize/currentZoom);
        this._transformTool.rotationHandle.set({fillColor:'red',strokeColor:'black',rescale:{radius:cSize}});
        this._transformTool.addChild(this._transformTool.rotationHandle);
        this._transformTool.rotationHandle.onMouseDown = function(ev){ev.stopPropagation();}
        this._transformTool.rotationHandle.onMouseDrag = function(ev){
            
            let parentMatrix=this.parent.matrix;
            let center=parentMatrix.transform(this.parent.boundingRect.position);
            
            let oldVec = ev.point.subtract(ev.delta).subtract(center);
            let newVec = ev.point.subtract(center);
            let angle = newVec.angle - oldVec.angle;
            this.parent.rotate(angle,center);
            this.parent.transforming.forEach(item=>{
                let itemCenter = self.targetMatrix.inverseTransform(center);
                item.rotate(angle, itemCenter);
                item.onTransform && item.onTransform('rotate', angle, itemCenter);
            })
            Object.values(this.parent.corners).forEach(corner=>{
                corner.refPos = corner.refPos.rotate(angle,center);
            })
        }

        //Translation operations
        this.onMouseDrag = ev=>{
            if(!this._transformTool._moveOnDrag) return;
            
            // use original delta for the tool's display rectangle and handles
            this._transformTool.translate(ev.original.delta);

            // use transformed delta for the object we're transforming
            const delta = ev.delta;

            Object.values(this._transformTool.corners).forEach(corner=>{
                corner.refPos = corner.refPos.add(ev.original.delta);
            })
            this._transformTool.transforming.forEach(item=>{
                item.translate(delta);
                item.onTransform && item.onTransform('translate', delta);
            });
        }
        

        //(re)positioning the tool handles (corners, rotation control)
        this._transformTool.setBounds=function(useExistingBoundingRect=false){
            if(!useExistingBoundingRect){
                let bounds=this.transforming.reduce((acc,item)=>{
                    item.transform(self.targetLayer.matrix);
                    acc.minX = acc.minX===null?item.bounds.topLeft.x : Math.min(acc.minX,item.bounds.topLeft.x);
                    acc.minY = acc.minY===null?item.bounds.topLeft.y : Math.min(acc.minY,item.bounds.topLeft.y);
                    acc.maxX = acc.maxX===null?item.bounds.bottomRight.x : Math.max(acc.maxX,item.bounds.bottomRight.x);
                    acc.maxY = acc.maxY===null?item.bounds.bottomRight.y : Math.max(acc.maxY,item.bounds.bottomRight.y);
                    item.transform(self.targetLayer.matrix.inverted())
                    return acc;
                },{minX:null,minY:null,maxX:null,maxY:null});

                // bounds = self.targetMatrix.transform(bounds);

                let topLeft = new paper.Point(bounds.minX,bounds.minY);
                let bottomRight = new paper.Point(bounds.maxX,bounds.maxY);
                let rect = new paper.Rectangle(topLeft, bottomRight);
                this.matrix.reset();
                this.boundingRect.set({position:rect.center,size:rect.size});
                // this.transforming.forEach(item=>item.rotationAxis=new paper.Point(rect.center));
            }
            
            let br=this.boundingRect;
            this.boundingDisplay.set({position:br.position,size:br.bounds.size});
            Object.values(this.corners).forEach(c=>{
                c.position=br.bounds[c.anchor];
                // if(!useExistingBoundingRect) c.refPt.position = c.position;
                if(!useExistingBoundingRect) c.refPos = c.position;
            })
            this.rotationHandle.set({
                position:br.position.subtract(new paper.Point(0,br.bounds.size.height/2+this.rotationHandle.radius*2))
            });
        }



        this._transformTool.transformItems=function(items){
            //finish applying all transforms to previous items (called during disableTransformToolObject)
            this.transforming.forEach(item=>{
                item.matrix.apply(true,true);
                item.onTransform && item.onTransform('complete');
            })

            //set up new objects for transforming, and reset matrices of the tool
            this.transforming=items;
            items.forEach(item=>item.applyMatrix=false)
            this.matrix.reset();
            this.boundingRect.matrix.reset();
            this.boundingDisplay.matrix.reset();
            this.setBounds();
        }
        this._transformTool.visible=false;
    }
    /**
     * A function that enables the TransformTool object for transforming selected items.
     * This function activates the TransformTool, bringing it to the front, and sets up items for transformation.
     */
    enableTransformToolObject(){
        if(this.items.length > 0){
            this.project.toolLayer.bringToFront();
            this._transformTool.visible=true;
            this._transformTool.transformItems(this.items);
        }
    }
    /**
     * A function that disables the TransformTool object after transforming selected items.
     * This function deactivates the TransformTool, sends it to the back, and resets item matrices.
     */
    disableTransformToolObject(){
        this.project.toolLayer.sendToBack();
        this._transformTool.transformItems([]);
        this._transformTool.visible=false;
    }
    /**
     * A function that performs a hit test on the canvas to find the item under the specified coordinates.
     * This function is used to determine the item selected for transformation.
     * @param {paper.Point} coords - The coordinates to perform the hit test.
     * @returns {paper.HitResult} - The result of the hit test, containing the selected item.
     */
    hitTest(coords){
        let hitResult = this.ps.project.hitTest(coords,{
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

    onMouseMove(ev){
        if(!this._active) return;
        
        let hitResult = this.project.paperScope.project.hitTest(ev.original.point);
        if(hitResult){
            if(Object.values(this._transformTool.corners).includes(hitResult.item)){
                this.project.overlay.addClass('transform-tool-resize');
            } else {
                this.project.overlay.removeClass('transform-tool-resize');
            }
                
            if (this._transformTool.rotationHandle == hitResult.item){
                this.project.overlay.addClass('transform-tool-rotate');
            } else {
                this.project.overlay.removeClass('transform-tool-rotate');
            }

            if([this._transformTool.boundingRect, this._transformTool.boundingDisplay].includes(hitResult.item)){
                this.project.overlay.addClass('transform-tool-move');
                this._transformTool._moveOnDrag = true;
            } else {
                this.project.overlay.removeClass('transform-tool-move');
                this._transformTool._moveOnDrag = false;
            }
            
        } else{
            this.project.overlay.removeClass('transform-tool-resize', 'transform-tool-rotate', 'transform-tool-move');
        }
    
}
}
export{TransformTool};
/**
 * The TransformToolbar class extends the AnnotationUIToolbarBase and provides functionality for the transform tool's toolbar.
 * @memberof OSDPaperjsAnnotation.TransformTool
 * @extends AnnotationUIToolbarBase
 */
class TransformToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a new TransformToolbar instance.
     * @memberof OSDPaperjsAnnotation.TransformToolbar
     * @constructor
     * @param {TransformTool} tool - The TransformTool instance associated with the toolbar.
     */
    constructor(tool){
        super(tool);
        this.dropdown.classList.add('transform-dropdown');
        
        const i = makeFaIcon('fa-up-down-left-right');
        this.button.configure(i,'Transform Tool');
        
    }
    /**
     * Checks if the transform tool is enabled for the specified mode.
     * The transform tool is enabled when there are selected items on the canvas.
     * @method
     * @param {string} mode - The current mode.
     * @returns {boolean} - True if the transform tool is enabled for the mode, otherwise false.
     */
    isEnabledForMode(mode){
        let selectedItems = this.tool.project.paperScope.findSelectedItems()
        return selectedItems.length>0 && [
            'select',
            'multiselection',
            'Polygon',
            'MultiPolygon',
            'Point:Rectangle',
            'Point:Ellipse',
            // 'Point', // disable for Point because neither resize nor scaling work for that object type
            'LineString',
            'GeometryCollection:Raster',
        ].includes(mode) && new Set(selectedItems.map(item=>item.layer)).size == 1;
    }
    
}