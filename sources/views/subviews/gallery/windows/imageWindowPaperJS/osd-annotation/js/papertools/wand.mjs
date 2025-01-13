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
import {ColorpickerCursor,getAverageColor} from './style.mjs';
import {Morph} from '../utils/morph.mjs';
import { makeMagicWand } from '../utils/magicwand.mjs';
import { paper } from '../paperjs.mjs';
import { datastore } from '../utils/datastore.mjs';
import { makeFaIcon } from '../utils/faIcon.mjs';

/**
 * The `WandTool` class represents a powerful tool designed for making selections with a magic wand-like effect. 
 * It extends the `AnnotationUITool` class to provide advanced selection capabilities within the Paper.js framework.
 *
 * This tool allows users to create selections by intelligently selecting areas of similar colors within an image or canvas.
 * It provides various modes and options for refining the selections and is particularly useful in interactive annotation and design workflows.
 * The `WandTool` offers a seamless integration of selection, color manipulation, and interaction with the underlying image.
 *
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class WandTool extends AnnotationUITool{
    /**
     * Creates a new instance of the `WandTool` class, enabling users to make precise selections with sophisticated color-based mechanisms.
     * This constructor initializes various properties and configurations that control the behavior of the tool.
     * 
     * @param {paper.PaperScope} paperScope - The PaperScope instance associated with this tool.
     */
    constructor(paperScope){
        super(paperScope);
        let self = this;
        let tool = this.tool;   
        this.paperScope = self.project.paperScope;
        
       /**
         * Determines whether the reduce mode is active, altering the effect of dragging to create selections.
         * When reduce mode is enabled, dragging reduces the current selection area instead of expanding it.
         *
         * @type {boolean}
         * @default false
         */
        this.reduceMode = false;
       /**
         * Determines whether the replace mode is active, affecting how the tool interacts with existing selections.
         * In replace mode, the tool replaces the current selection with the new selection.
         *
         * @type {boolean}
         * @default true
         */
        this.replaceMode = true;
        /**
         * Determines whether the flood mode is active, influencing the behavior of the tool's selection algorithm.
         * When flood mode is enabled, the tool uses a flood-fill approach to create selections.
         * Otherwise, it employs a threshold mask approach.
         *
         * @type {boolean}
         * @default true
         */
        this.floodMode = true;
        
        /**
         * An object containing color settings that guide the visual appearance of the tool.
         *
         * @type {Object}
         * @property {paper.Color} pixelAllowed - The color representing allowed pixels within the selection.
         * @property {paper.Color} pixelNotAllowed - The color representing disallowed pixels within the selection.
         * @property {paper.Color} currentItem - The color highlighting the currently selected item.
         * @property {paper.Color} nullColor - The color of transparent pixels (for negative spaces).
         * @property {paper.Color} defaultColor - The default color used for various UI elements.
         */
        this.colors = {
            pixelAllowed: new paper.Color({red:0,green:0,blue:100}),
            pixelNotAllowed: new paper.Color({red:100,green:0,blue:0}),
            currentItem : new paper.Color({red:0,green:100,blue:0,alpha:0.5}),
            nullColor: new paper.Color({red:0,green:0,blue:0,alpha:0}),//transparent pixels if negative
            defaultColor: new paper.Color({red:255,green:255,blue:255}),
        }
        
        this.threshold=10;
        this.minThreshold=-1;
        this.maxThreshold=100;
        this.startThreshold=10;

        //colorpicker
        this.colorPicker = new ColorpickerCursor(10,7,self.project.toolLayer);
        this.colorPicker.element.applyRescale();


        this.MagicWand = makeMagicWand();

        this.setToolbarControl(new WandToolbar(this));
        this.toolbarControl.setThreshold(this.threshold);

        let callback=function(){
            self.getImageData();
        }
        this.onSelectionChanged = callback; 
        this.extensions.onActivate = function(){ 
            let item = (self.item || self.itemToCreate);
            self.itemLayer = item ? item.layer : null;

            self.getImageData();
            self.project.overlay.viewer.addHandler('animation-finish',callback);
            self.project.overlay.viewer.addHandler('rotate',callback);  
            self.colorPicker.element.visible=true;
            self.project.toolLayer.bringToFront();
        };
        this.extensions.onDeactivate = function(finished){
            self.project.overlay.viewer.removeHandler('animation-finish',callback);
            self.project.overlay.viewer.removeHandler('rotate',callback);
            self.colorPicker.element.visible=false;
            this.preview && this.preview.remove();
            if(finished){
                self.finish();
            }
            self.project.toolLayer.sendToBack();
        };
        
        
        
        tool.extensions.onKeyUp=function(ev){
            if(ev.key=='a'){
                self.applyChanges();
            }
            if(ev.key=='e'){
                self.toolbarControl.cycleReduceMode();
            }
            if(ev.key=='r'){
                self.toolbarControl.cycleReplaceMode();
            }
            if(ev.key=='f'){
                self.toolbarControl.cycleFloodMode();
            }
        }
    }

    onMouseDown(ev){
        this.startThreshold=this.threshold;
        this.imageData.dragStartMask = this.imageData.binaryMask;
        this.applyMagicWand(ev.original.point);
        this.colorPicker.element.visible=false;     
    }
    onMouseDrag(ev){
        let delta = ev.original.point.subtract(ev.original.downPoint).multiply(this.project.getZoom());
        if(this.reduceMode) delta = delta.multiply(-1); //invert effect of dragging when in reduce mode for more intuitive user experience
        let s=Math.round((delta.x+delta.y*-1)/2);
        this.threshold=Math.min(Math.max(this.startThreshold+s, this.minThreshold), this.maxThreshold);
        if(Number.isNaN(this.threshold)){
            // console.log('wft nan??');
            console.warn('NaN value for threshold')
        }
        this.toolbarControl.setThreshold(this.threshold);
        this.applyMagicWand(ev.original.downPoint);
    }
    onMouseMove(ev){
        this.colorPicker.updatePosition(ev.original.point);
    }
    onMouseUp(ev){
        this.colorPicker.element.visible=true;
        this.colorPicker.element.bringToFront();
        // colorPicker.position=ev.point;
        this.colorPicker.updatePosition(ev.original.point);
    }


    /**
     * Finishes the wand tool operation and performs necessary cleanup.
     */
    finish(){
        // if(item) smoothAndSimplify(item);
        this.itemLayer=null;
        this.preview && this.preview.remove();
        this.deactivate();    
    }
    /**
     * Sets the threshold value for the magic wand operation.
     * @param {number} t - The threshold value.
     */
    setThreshold(t){
        this.threshold=parseInt(t);
    }
    /**
     * Sets whether the reduce mode is enabled.
     * @param {boolean} erase - Whether to enable reduce mode.
     */
    setReduceMode(erase){
        this.reduceMode=erase;
        this.getImageData(); //reset the masks
    }
    /**
     * Sets whether the flood mode is enabled.
     * @param {boolean} flood - Whether to enable flood mode.
     */
    setFloodMode(flood){
        this.floodMode=flood;
    }
    /**
     * Sets whether the replace mode is enabled.
     * @param {boolean} replace - Whether to enable replace mode.
     */
    setReplaceMode(replace){
        this.replaceMode=replace;
    }
    /**
     * Applies changes based on the magic wand selection.
     */
    applyChanges(){
        if(this.itemToCreate){
            this.itemToCreate.initializeGeoJSONFeature('MultiPolygon');
            this.refreshItems();
        }
        let wandOutput = {
            width:this.imageData.width,
            height:this.imageData.height,
            data:this.imageData.wandMask,
            bounds:{
                minX:0,
                minY:0,
                maxX:this.preview.width,
                maxY:this.preview.height,
            }
        };
        
        if(this.reduceMode){
            let toSubtract = maskToPath(this.MagicWand, wandOutput);
            toSubtract.translate(-1, -1); // adjust path to account for pixel offset of maskToPath algorithm. Value of 1 is empirical.
            toSubtract.translate(-this.preview.width/2, -this.preview.height/2);
            toSubtract.matrix = this.preview.matrix;
            toSubtract.transform(this.item.layer.matrix.inverted());
            let subtracted = this.item.subtract(toSubtract, false).toCompoundPath();
            toSubtract.remove();
            this.item.children = subtracted.children;
        } else {
            let toUnite = maskToPath(this.MagicWand, wandOutput);
            toUnite.translate(-1, -1); // adjust path to account for pixel offset of maskToPath algorithm. Value of 1 is empirical.
            toUnite.translate(-this.preview.width/2, -this.preview.height/2);
            toUnite.matrix = this.preview.matrix;
            toUnite.transform(this.item.layer.matrix.inverted());

            let boundingItems = this.itemLayer ? this.itemLayer.getItems({match:i=>i.isBoundingElement}) : [];
            // intersect toUnite with each of the bounding items
            if(boundingItems.length > 0){
                toUnite.children = boundingItems.map(boundingItem => boundingItem.intersect(toUnite));
            }

            let united = this.item.unite(toUnite, false).toCompoundPath();
            toUnite.remove();
            this.item.children = united.children;
        }
        
        
        this.getImageData();
        
    };
    
    /**
     * Retrieves image data for processing the magic wand operation.
     */
    getImageData(){
        let self=this;
        let imageData = self.project.overlay.getImageData();
        
        let viewportGroup = new paper.Group({children:[],insert:false});

        let b = self.tool.view.bounds
        let viewportPath = new paper.Path(b.topLeft, b.topRight, b.bottomRight, b.bottomLeft);
        viewportPath.strokeWidth=0;
        viewportGroup.addChild(viewportPath.clone());
        viewportGroup.addChild(viewportPath);
        viewportGroup.clipped=true;
        
        let boundingItems = this.itemLayer ? this.itemLayer.getItems({match:i=>i.isBoundingElement}) : [];
        //allow all pixels if no bounding item, otherwise disallow all and then allow those inside the bounding item(s);
        viewportPath.fillColor = boundingItems.length==0 ? self.colors.pixelAllowed : self.colors.pixelNotAllowed;
        boundingItems.forEach(item=>{
            let clone = item.clone({insert:false});
            clone.transform(self.item.layer.matrix);
            clone.fillColor = self.colors.pixelAllowed;
            clone.strokeWidth=0;
            viewportGroup.addChild(clone);
        })
        if(self.item){
            let clone = self.item.clone({insert:false});
            clone.transform(self.item.layer.matrix);
            clone.fillColor = self.colors.currentItem;
            clone.strokeWidth = 0;
            clone.selected=false;
            viewportGroup.addChild(clone);
        }
        
        viewportGroup.selected=false;

        //hide all annotation layers; add the viewportGroup; render; get image data; remove viewportGroup; restore visibility of layers
        // let annotationLayers = self.project.paperScope.project.layers.filter(l=>l.isGeoJSONFeatureCollection);
        let annotations = self.project.paperScope.project.getItems({match: l=>l.isGeoJSONFeatureCollection});
        let visibility = annotations.map(l=>l.visible);
        annotations.forEach(l=>l.visible=false);
        self.project.toolLayer.addChild(viewportGroup);
        self.tool.view.update();
        let cm = self.tool.view.getImageData();
        viewportGroup.remove();
        annotations.forEach((l,index)=>l.visible = visibility[index]);
        self.tool.view.update();
        
        self.imageData = {
            width:imageData.width,
            height:imageData.height,
            bytes:4,
            data:imageData.data,
            binaryMask:  new Uint8ClampedArray(imageData.width * imageData.height),
            wandMask:  new Uint8ClampedArray(imageData.width * imageData.height),
            colorMask:cm,
        }
        // self.imageData.binaryMask = new Uint8ClampedArray(self.imageData.width * self.imageData.height);
        for(let i = 0, m=0; i<self.imageData.data.length; i+= self.imageData.bytes, m+=1){
            self.imageData.binaryMask[m]=self.imageData.colorMask.data[i+1] ? 1 : 0;//green channel is for current item
        }
        
        if(self.item && self.item.isGeoJSONFeature && self.item.getArea()){
            getAverageColor(self.item).then(sampleColor=>{
                let c = [sampleColor.red*255,sampleColor.green*255,sampleColor.blue*255];
                self.imageData.sampleColor = c;
                self.rasterPreview(self.imageData.binaryMask, c);
            });
        }
        else{
            self.rasterPreview(self.imageData.binaryMask);
        } 
        
    }
    /**
     * Applies the magic wand effect based on the current mouse point.
     * @param {paper.Point} eventPoint - The point where the magic wand is applied.
     */
    applyMagicWand(eventPoint){
        let pt = this.paperScope.view.projectToView(eventPoint);
        //account for pixel density
        let r = this.paperScope.view.pixelRatio
        pt = pt.multiply(r);

        //use floodFill or thresholdMask depending on current selected option
        let magicWandOutput;
        if(this.floodMode){
            magicWandOutput = this.MagicWand.floodFill(this.imageData,Math.round(pt.x),Math.round(pt.y),this.threshold);
        }
        else{
            magicWandOutput = this.MagicWand.thresholdMask(this.imageData, Math.round(pt.x), Math.round(pt.y), this.threshold);
        }
        
        let bm = this.imageData.binaryMask;
        let wm = this.imageData.wandMask;
        let ds = this.imageData.dragStartMask;
        let cm = this.imageData.colorMask.data;
        let mw = magicWandOutput.data;

        //apply rules based on existing mask
        //1) set any pixels outside the bounding area to zero
        //2) if expanding current area, set pixels of existing item to 1
        //3) if reducing current area, use currentMask to remove pixels from existing item
        if(this.replaceMode && !this.reduceMode){ //start from the initial item (cm[i+1]>0) and add pixels from magicWandOutput (mw[m]) if allowed (cm[i]==0)
            for(let i = 0, m=0; i<cm.length; i+= this.imageData.bytes, m+=1){
                bm[m] = cm[i+1]>0 || (cm[i]==0 && mw[m]);
                wm[m] = mw[m];
            }
        }
        else if(this.replaceMode && this.reduceMode){ //start from initial item (cm[i+1]>0) and remove pixels from mw[m] if allowed (cm[i]==0)
            for(let i = 0, m=0; i<cm.length; i+= this.imageData.bytes, m+=1){
                bm[m] = cm[i+1]>0 && !(cm[i]==0 && mw[m]);
                wm[m] = mw[m];
            }
        }
        else if(!this.replaceMode && !this.reduceMode){ //start from dragstart (ds[m]) and add pixels from mw[m] if allowed (cm[i]==0)
            for(let i = 0, m=0; i<cm.length; i+= this.imageData.bytes, m+=1){
                bm[m] = ds[m] || (cm[i]==0 && mw[m]);
                wm[m] = wm[m] || mw[m];
            }
        }
        else if(!this.replaceMode && this.reduceMode){ //start from dragstart (ds[m]) and remove pixels from mw[m] if allowed (cm[i]==0)
            for(let i = 0, m=0; i<cm.length; i+= this.imageData.bytes, m+=1){
                bm[m] = ds[m] && !(cm[i]==0 && mw[m]);
                wm[m] = wm[m] || mw[m];
            }
        }

        // imgPreview(this.getDataURL(this.imageData.binaryMask));
        this.rasterPreview(this.imageData.binaryMask, this.imageData.sampleColor || magicWandOutput.sampleColor);
        
    }
    
    /**
     * Rasterize the selection preview based on the binary mask and sample color.
     *
     * @param {Uint8ClampedArray} binaryMask - The binary mask of the selection.
     * @param {Array<number>} sampleColor - The color sampled from the selected item.
     */
    rasterPreview(binaryMask, sampleColor){
        let self=this;
        let cmap = {0: this.colors.nullColor, 1: this.colors.defaultColor};
        //If a sample color is known, "invert" it for better contrast relative to background image
        if(sampleColor){
            cmap[1] = new paper.Color(sampleColor[0],sampleColor[1],sampleColor[2]);
            cmap[1].hue+=180;
            cmap[1].brightness=(180+cmap[1].brightness)%360;
        }

        this.preview && this.preview.remove();

        this.preview = this.project.paperScope.overlay.getViewportRaster(false);

        window.preview = this.preview;

        this.project.toolLayer.insertChild(0, this.preview);//add the raster to the bottom of the tool layer
        
        let c;
        let imdata=this.preview.createImageData(this.preview.size);
        for(var ix=0, mx=0; ix<imdata.data.length; ix+=4, mx+=1){
            c = cmap[binaryMask[mx]];
            imdata.data[ix]=c.red;
            imdata.data[ix+1]=c.blue;
            imdata.data[ix+2]=c.green;
            imdata.data[ix+3]=c.alpha*255;
        }
        this.preview.setImageData(imdata, new paper.Point(0,0));
        
        function tween1(){
            // console.log('tween1', self.preview.id)
            self.preview.tweenTo({opacity:0.15},{duration:1200,easing:'easeInQuart'}).then(tween2);
        }
        function tween2(){
            // console.log('tween2', self.preview.id)
            self.preview.tweenTo({opacity:1},{duration:800,easing:'easeOutCubic'}).then(tween1);
        }
        tween1();
    } 
    
    
}
export{WandTool};

/**
 * The `WandToolbar` class represents the user interface toolbar for the `WandTool` class.
 * This toolbar provides a range of options and controls that users can interact with to configure the behavior of the magic wand tool.
 * It extends the `AnnotationUIToolbarBase` class to create a cohesive interface for the tool.
 *
 * The `WandToolbar` offers features for setting threshold, selection modes, and applying changes, making the magic wand tool a versatile and interactive selection tool.
 *
 * @class
 * @memberof OSDPaperjsAnnotation.WandTool
 * @extends AnnotationUIToolbarBase
 */
class WandToolbar extends AnnotationUIToolbarBase{
    /**
     * Creates a new instance of the `WandToolbar` class, providing users with various options to configure the magic wand tool.
     * This constructor initializes UI elements, buttons, and interactive controls within the toolbar.
     * 
     * @param {WandTool} wandTool - The `WandTool` instance associated with this toolbar.
     */
    constructor(wandTool){
        super(wandTool);
        
        let html = makeFaIcon('fa-wand-magic-sparkles');
        html.classList.add('rotate-by');
        html.style.setProperty('--rotate-angle', '270deg');
        this.button.configure(html,'Magic Wand Tool');
        
        let fdd = document.createElement('div');
        fdd.classList.add('wand-toolbar', 'dropdown');
        fdd.setAttribute('data-tool','wand');
        this.dropdown.appendChild(fdd);

        let thr = document.createElement('div');
        thr.classList.add('threshold-container');
        fdd.appendChild(thr);

        let label = document.createElement('label');
        thr.appendChild(label);
        label.innerHTML = 'Threshold';

        this.thresholdInput = document.createElement('input');
        thr.appendChild(this.thresholdInput);
        Object.assign(this.thresholdInput, {type:'range',min:-1,max:100,value:20} );
        this.thresholdInput.onchange = function(){ wandTool.setThreshold(this.value) }
        
        let toggles = document.createElement('div');
        toggles.classList.add('toggles');
        fdd.appendChild(toggles);
        
        let cycleReplaceModeButton = this.cycleReplaceModeButton = document.createElement('span');
        cycleReplaceModeButton.classList.add('option-toggle');
        toggles.appendChild(cycleReplaceModeButton);
        datastore.set(cycleReplaceModeButton, {
            prefix:'On click:',
            actions:[{replace:'Start new mask'}, {append:'Add to current'}],
            onclick:function(action){
                wandTool.setReplaceMode(action=='replace');
            }
        });

        let cycleFloodModeButton = this.cycleFloodModeButton = document.createElement('span');
        cycleFloodModeButton.classList.add('option-toggle');
        toggles.appendChild(cycleFloodModeButton);
        datastore.set(cycleFloodModeButton, {
            prefix:'Fill rule:',
            actions:[{flood:'Contiguous'}, {everywhere:'Anywhere'}],
            onclick:function(action){
                wandTool.setFloodMode(action=='flood')
            }
        });

        let cycleReduceModeButton = this.cycleReduceModeButton = document.createElement('span');
        cycleReduceModeButton.classList.add('option-toggle');
        toggles.appendChild(cycleReduceModeButton);
        datastore.set(cycleReduceModeButton, {
            prefix:'Use to:',
            actions:[{expand:'Expand selection'}, {reduce:'Reduce selection'}],
            onclick:function(action){
                wandTool.setReduceMode(action=='reduce');
            }
        });
        
       
        // set up the buttons to cycle through actions for each option
        [cycleReplaceModeButton, cycleFloodModeButton, cycleReduceModeButton].forEach(item=>{
            
            let data = datastore.get(item);
            
            let s = document.createElement('span');
            s.classList.add('label','prefix');
            s.innerHTML = data.prefix;
            item.appendChild(s);
            
            data.actions.forEach((action,actionIndex)=>{
                let text=Object.values(action)[0];
                let key = Object.keys(action)[0];
                let option = document.createElement('span');
                option.classList.add('option');
                option.innerHTML = text;
                item.appendChild(option);
                datastore.set(option, {key, index:actionIndex});
                action.htmlElement = option;
                action.key = key;

                if(actionIndex==0) option.classList.add('selected');
            })
            
            item.addEventListener('click', function(){
                let itemData = datastore.get(this);
                let actions = itemData.actions;
                let selectedChild = this.querySelector('.option.selected');
                let currentIndex = datastore.get(selectedChild)?.index;
                let nextIndex = typeof currentIndex==='undefined' ? 0 : (currentIndex+1) % actions.length;
                let allOptions = this.querySelectorAll('.option');
                allOptions.forEach(o=>o.classList.remove('selected'));
                let actionToEnable = actions[nextIndex];
                actionToEnable.htmlElement.classList.add('selected');
                itemData.onclick(actionToEnable.key);
            });
        })


        
        let applyButton = document.createElement('button');
        applyButton.classList.add('btn', 'btn-secondary', 'btn-sm');
        applyButton.setAttribute('data-action','apply');
        fdd.appendChild(applyButton);
        applyButton.innerHTML = 'Apply';
        applyButton.onclick = function(){
            wandTool.applyChanges();
        };

        let doneButton = document.createElement('button');
        doneButton.classList.add('btn', 'btn-secondary', 'btn-sm');
        doneButton.setAttribute('data-action','done');
        fdd.appendChild(doneButton);
        doneButton.innerHTML = 'Done';
        doneButton.onclick = function(){
            wandTool.finish();
        };

    }
    /**
     * Check if the toolbar should be enabled for the given mode.
     * The toolbar is enabled when the mode is 'new' or 'MultiPolygon'.
     *
     * @param {string} mode - The mode to check.
     * @returns {boolean} True if the toolbar should be enabled for the given mode; otherwise, false.
     */
    isEnabledForMode(mode){
        return ['new','Polygon','MultiPolygon'].includes(mode);
    }
    /**
     * Set the threshold value in the threshold input element.
     *
     * @param {number} thr - The threshold value to set.
     */
    setThreshold(thr){
        this.thresholdInput.value = thr;
    }

    /**
     * Cycle through the reduce modes (add, reduce)
     */
    cycleReduceMode(){
        this.cycleReduceModeButton.dispatchEvent(new Event('click'));
    }

    /**
     * Cycle through the replace modes (replace, expand)
     */
    cycleReplaceMode(){
        this.cycleReplaceModeButton.dispatchEvent(new Event('click'));
    }

    /**
     * Cycle through the flood modes (flood, everywhere)
     */
    cycleFloodMode(){
        this.cycleFloodModeButton.dispatchEvent(new Event('click'));
    }
}


// /**
//  * Displays an image preview on the web page using the provided data URL.
//  * If a preview image already exists, it is removed and replaced with the new one.
//  * The preview is positioned fixed on the top-left corner of the viewport.
//  * @private
//  * @param {string} dataURL - The data URL of the image to display.
//  */
// function imgPreview(dataURL){
//     if(window.preview) window.preview.remove();
//     const img = document.createElement('img');
//     Object.assign(img, {style:'position:fixed;left:10px;top:10px;width:260px;',src:dataURL});
//     window.preview = document.querySelector('body').appendChild(img);
// }

/**
 * Converts a binary mask to a compound path, tracing contours and creating path objects.
 * The mask is processed to identify contours and create paths for each contour, forming a compound path.
 * Contours with an absolute area less than the specified minimum area are filtered out.
 * @private
 * @param {MagicWand} MagicWand - The MagicWand instance used to trace contours.
 * @param {Uint8ClampedArray} mask - The binary mask to be converted into paths.
 * @param {string} border - The type of border to add ('dilate' for dilation, undefined for none).
 * @returns {paper.CompoundPath} A compound path containing the traced paths from the mask contours.
 */
function maskToPath(MagicWand, mask, border){
    let minPathArea = 50;
    let path=new paper.CompoundPath({children:[],fillRule:'evenodd',insert:false});
    if(mask){
        let morph = new Morph(mask);
        mask = morph.addBorder();
        if(border=='dilate') morph.dilate();
        mask.bounds={
            minX:0,
            minY:0,
            maxX:mask.width,
            maxY:mask.height,
        }
        
        
        let contours = MagicWand.traceContours(mask);
        path.children = contours.map(function(c){
            let pts = c.points.map(pt=>new paper.Point(pt));
            let path=new paper.Path(pts,{insert:false});
            path.closed=true;
            return path;
        }).filter(function(p){
            //Use absolute area since inner (hole) paths will have negative area
            if(Math.abs(p.area) >= minPathArea){
                return true;
            }
            //if the item is being filtered out for being too small, it must be removed
            // otherwise paper.js memory usage will spike with all the extra hidden
            // path objects that will remain in the active layer (not having been inserted elsewhere)
            p.remove(); 
        })
    }
    
    return path;//.reorient(true,'clockwise');
}


