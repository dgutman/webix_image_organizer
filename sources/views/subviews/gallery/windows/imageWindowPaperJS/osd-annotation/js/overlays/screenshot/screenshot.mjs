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


import { ToolBase } from '../../papertools/base.mjs';
import { PaperOverlay } from '../../paper-overlay.mjs';
import { OpenSeadragon } from '../../osd-loader.mjs';
import { paper } from '../../paperjs.mjs';
import { changeDpiBlob } from './changedpi.mjs';
import { domObjectFromHTML } from '../../utils/domObjectFromHTML.mjs';

class ScreenshotOverlay{
    /**
     * Creates an instance of the ScreenshotOverlay.
     *
     * @param {OpenSeadragon.Viewer} viewer - The OpenSeadragon viewer object.
     * @param {Object} [options]
     * @param {String} [options.downloadMessage] - A message to display in the download window
     */
    constructor(viewer, options){
        this.viewer = viewer;
        let overlay = this.overlay = new PaperOverlay(viewer,{overlayType:'viewer'})
        let tool = this.tool = new ScreenshotTool(this.overlay.paperScope, this);
        this.dummyTool = new this.overlay.paperScope.Tool();//to capture things like mouseMove, keyDown etc (when actual tool is not active)
        this.dummyTool.activate();
        this._mouseNavEnabledAtActivation = true;
        const button = overlay.addViewerButton({
            faIconClass:'fa-camera',
            tooltip:'Take Screenshot',
            onClick:()=>{
                tool.active ? this.deactivate() : this.activate();
            }
        });

        button.element.querySelector('svg.icon')?.style.setProperty('width', '1em');

        this._makeDialog(options); //creates this.dialog

        this.tool.addEventListener('region-selected',bounds=>this._setupScreenshotDialog(bounds));
     
    }
    /**
     * Activates the overlay.
     */
    activate(){
        let reactivate = this.overlay.setOSDMouseNavEnabled(false);
        this._mouseNavEnabledAtActivation = this._mouseNavEnabledAtActivation || reactivate;
        this.overlay.bringToFront();
        this.tool.activate();
    }
    /**
     * Deactivates the overlay.
     */
    deactivate(){
        this.dialog.classList.add('hidden');
        this.tool.deactivate(true);
        this.dummyTool.activate();
        this.overlay.setOSDMouseNavEnabled(this._mouseNavEnabledAtActivation);
        this._mouseNavEnabledAtActivation = false;
        this.overlay.sendToBack();
    }

    _startRegion(){
        this.dialog.classList.add('hidden');
        this.tool.activate();
    }

    _makeDialog(options){
        let html = `<div class="screenshot-dialog hidden">
            <div class="size">
                <h3>Aspect Ratio</h3>
                <label>Lock</label><input class="lock-aspect-ratio" type="checkbox"/>
                <input type="number" min="0" value="1" class="aspect-width"/> x <input type="number" min="0" value="1" class="aspect-height"/>
                <button class="apply-aspect-ratio">Apply</button>
            </div>
            <hr>
            <div>
                <h3>Selected Region</h3>
                <div class="size">
                    <div><input class="region-width region-dim" type="number" min="0"/> x <input class="region-height region-dim" type="number" min="0"/> px 
                    (<span class="region-width-mm"></span> x <span class="region-height-mm"></span> mm)</div>
                </div>
                <div class="scalebar">
                    <label>Include scale bar:</label> <input class="include-scalebar"type="checkbox">
                    <div class="scalebar-opts">
                    <p>Enter desired scale bar width in millimeters and height in pixels.<br>Width will be rounded to the nearest pixel.</p>
                    <label>Width (mm):</label><input class="scalebar-width" type="number" min="0.001" step="0.01">
                    <label>Height (px):</label><input class="scalebar-height" type="number" min="1" step="1">
                    </div>
                </div> 
            <div>
            <hr>
            <div class="screenshot-results">
                <div class="instructions">
                    <h3>Create your screenshot</h3>
                    <div>
                        <label>Select size:</label>
                        <select class="select-size"></select>
                        <button class="create-screenshot">Create</button>
                    </div>
                    
                </div>
                <div class="download">
                    <h3>View/Download</h3>
                    <div class="download-message">${options?.downloadMessage || ''}</div>
                    <div><a class="open-screenshot screenshot-link" target="_blank"><button>Open in new tab</button></a> | 
                    <a class="download-screenshot screenshot-link" download="screenshot.png"><button>Download</button></a></div>
                    <div><button class="cancel-screenshot">Change size</button></div>
                </div>
                <div class="pending-message"><h3>View/Download</h3>
                Creating your screenshot...
                <div class="screenshot-progress">
                    <progress></progress>
                    <div>Loaded <span class="loaded"></span> of <span class="total"><span> tiles</div>
                </div>
                <div><button class="cancel-screenshot">Change size</button></div>
                </div>
            </div>
            <hr>
            <button class='rect'>Select a new area</button> | <button class='close'>Close</button>
        </div>`;

        let css = `<style data-type="screenshot-tool">
            .screenshot-dialog{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 1em;
                border: thin black solid;
                background-color: white;
                color: black;
            }
            .screenshot-dialog.hidden{
                display:none;
            }
            .screenshot-dialog h3{
                margin: 0.1em 0;
            }
            .screenshot-dialog input[type=number]{
                width: 5em;
            }
            .screenshot-results>*{
                display:none;
                min-height:6em;
            }
            .screenshot-results.created .download{
                display:block;
            }
            .screenshot-results.pending .pending-message{
                display:block;
            }
            .screenshot-results:not(.created):not(.pending) .instructions{
                display:block;
            }
            .screenshot-link{
                display:inline-block;
                margin-bottom: 0.5em;
            }
            .screenshot-dialog .download-message:not(:empty){
                margin-bottom:1em;
            }
            .scalebar-opts.hidden{
                visibility:hidden;
            }
        </style>`;
        if(!document.querySelector('style[data-type="screenshot-tool"]')){
            document.querySelector('head').appendChild(domObjectFromHTML(css));
        }

        const el = domObjectFromHTML(html);
        this.viewer.container.appendChild(el);

        el.addEventListener('mousemove',ev=>ev.stopPropagation());
        el.querySelectorAll('.close').forEach(e=>e.addEventListener('click',()=>this.deactivate()));
        el.querySelectorAll('.rect').forEach(e=>e.addEventListener('click',()=>this._startRegion()));
        el.querySelectorAll('.cancel-screenshot').forEach(e=>e.addEventListener('click',()=>el.querySelector('.screenshot-results').classList.remove('pending','created')));
        el.querySelectorAll('.create-screenshot').forEach(e=>e.addEventListener('click',()=>{
            const sel = el.querySelector('.select-size');
            const selectedOption = sel.options[sel.selectedIndex];
            const data = JSON.parse(selectedOption.getAttribute('data-dims')); 
            this.dialog.querySelector('.screenshot-results').classList.add('pending');
            this._createScreenshot(data).then(blobURL=>{
                const x = this.dialog.querySelector('.screenshot-results');
                x.classList.remove('pending');
                x.classList.add('created');
                this.dialog.querySelector('.screenshot-link').href = this.blobURL;
            }).catch(e=>{
                alert('There was a problem creating the screenshot. ' + e );
            });
        }));
        el.querySelectorAll('button.download-screenshot').forEach(e=>e.addEventListener('click',()=>{
            let a = el.querySelectorAll('a.download-screenshot');
            a.dispatchEvent(new Event('change'));
        }));
        el.querySelectorAll('.aspect-width').forEach(e=>{
            e.addEventListener('change',ev=>this.tool.setAspectWidth( Number(ev.target.value) ));
            e.dispatchEvent(new Event('change'));
        });
        el.querySelectorAll('.aspect-height').forEach(e=>{
            e.addEventListener('change',ev=>this.tool.setAspectHeight( Number(ev.target.value) ));
            e.dispatchEvent(new Event('change'));
        });
        el.querySelectorAll('.lock-aspect-ratio').forEach(e=>{
            e.addEventListener('change',ev=>this.tool.setAspectLocked( ev.target.checked ));
            e.dispatchEvent(new Event('change'));
        });
        el.querySelectorAll('.apply-aspect-ratio').forEach(e=>e.addEventListener('click',ev=>this._applyAspectRatio()));
        el.querySelectorAll('.region-dim').forEach(e=>e.addEventListener('change',()=>this._updateROI()));
        el.querySelectorAll('.scalebar-width').forEach(e=>{
            e.addEventListener('change',ev=>this._scalebarWidth = Number(ev.target.value), this._resetScreenshotResults() );
            e.dispatchEvent(new Event('change'));
        });
        el.querySelectorAll('.scalebar-height').forEach(e=>{
            e.addEventListener('change',ev=>this._scalebarHeight = Number(ev.target.value), this._resetScreenshotResults() );
            e.dispatchEvent(new Event('change'));
        });
        el.querySelectorAll('.include-scalebar').forEach(e=>{
            e.addEventListener('change',ev=>{
                this._includeScalebar = ev.target.checked;
                let opts = el.querySelector('.scalebar-opts');
                this._includeScalebar ? opts.classList.remove('hidden') : opts.classList.add('hidden');
                this._resetScreenshotResults();
            });
            e.dispatchEvent(new Event('change'));
        });
        this.dialog = el;
    }
    _updateROI(){
        let w = this.dialog.querySelector('.region-width').value;
        let h = this.dialog.querySelector('.region-height').value;
        this._currentBounds.width = Number(w);
        this._currentBounds.height = Number(h);
        this._setupScreenshotDialog(this._currentBounds);
        
        if(this.dialog.querySelector('.lock-aspect-ratio').checked){
            this._applyAspectRatio();
        } 
        
    }
    _applyAspectRatio(){
        // adjust by the smallest amount to match the aspect ratio
        let currentRatio = this._currentBounds.width / this._currentBounds.height;
        let desiredRatio = this.tool._aspectWidth / this.tool._aspectHeight;
        if(currentRatio / desiredRatio > 1){
            this._currentBounds.width = Math.round(this._currentBounds.height * desiredRatio);
            this._setupScreenshotDialog(this._currentBounds);
        } else if (currentRatio / desiredRatio < 1){
            this._currentBounds.height = Math.round(this._currentBounds.width / desiredRatio);
            this._setupScreenshotDialog(this._currentBounds);
        }
        
    }
    _setupScreenshotDialog(bounds){
        
        // this.tool.deactivate();
        this._resetScreenshotResults();
        this._currentBounds = bounds;

        this.dialog.querySelector('.region-width').value = bounds.width;
        this.dialog.querySelector('.region-height').value = bounds.height;

        let vp = this.viewer.viewport;
        let ti = this.viewer.world.getItemAt(this.viewer.currentPage());
        let boundsRect = new OpenSeadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        let viewportRect = vp.viewerElementToViewportRectangle( boundsRect );
        let imageBounds = vp.viewportToImageRectangle(viewportRect);

        const scaleFactor =  Math.max(imageBounds.width, imageBounds.height) / Math.max(boundsRect.width, boundsRect.height);
        let imageRect = {width: boundsRect.width * scaleFactor, height: boundsRect.height * scaleFactor};

        let calculated_mm = false;
        this._mpp = null;
        this.dialog.querySelector('.include-scalebar').disabled = true;  
        if(this.viewer.world.getItemCount() === 1){
            let mpp = this.viewer.world.getItemAt(0).source.mpp;
            if(mpp){
                this.dialog.querySelector('.region-width-mm').textContent = ''+(mpp.x / 1000 * imageRect.width).toFixed(3);
                this.dialog.querySelector('.region-height-mm').textContent = ''+(mpp.y / 1000 * imageRect.height).toFixed(3);
                calculated_mm = true;
                this.dialog.querySelector('.include-scalebar').disabled = false;
                this._mpp = mpp;   
            }
            
        }
        if(!calculated_mm){
            this.dialog.querySelectorAll('.region-width-mm, .region-height-mm').forEach(e=>e.textContent ='??');
        }

        let select = this.dialog.querySelector('.select-size');
        select.textContent = '';
        
        let w = imageRect.width;
        let h = imageRect.height;
        const maxDim = 23767;
        const maxArea = 268435456;
        while(w > bounds.width && h > bounds.height){
            let data ={
                w: Math.round(w), 
                h: Math.round(h), 
                imageBounds:imageBounds,
                scaleFactor: w / imageRect.width,
            }
            let option = document.createElement('option');
            select.appendChild(option);
            option.textContent = `${Math.round(w)} x ${Math.round(h)}`;
            option.setAttribute('data-dims', JSON.stringify(data));
            if(w > maxDim || h > maxDim || w*h > maxArea){
                // if the canvas is too big, don't even offer it as an option
                option.setAttribute('disabled',true);
            }
            w = w / 2;
            h = h / 2;
        }

        let data = {
            w: bounds.width, 
            h: bounds.height, 
            imageBounds:imageBounds,
            scaleFactor: bounds.width / imageRect.width,
        }
        let option = document.createElement('option');
        select.appendChild(option);
        option.textContent = `${Math.round(w)} x ${Math.round(h)}`;
        option.setAttribute('data-dims', JSON.stringify(data));
        
        this.dialog.classList.remove('hidden');
    }

    _resetScreenshotResults(){
        this.dialog?.querySelector('.screenshot-results').classList.remove('created','pending');
    }

    _setProgress(loaded, total){
        if(this.dialog){
            const progress = this.dialog.querySelector('progress');
            progress.value = loaded;
            progress.max = total;
            this.dialog.querySelector('.loaded').textContent = loaded;
            this.dialog.querySelector('.total').textContent = total;
        }
    }
    
    _createScreenshot(data){
        let w = data.w;
        let h = data.h;
        let ib = data.imageBounds;
        let imageBounds = new OpenSeadragon.Rect(ib.x, ib.y, ib.width, ib.height, ib.degrees);
        let scaleFactor = data.scaleFactor;
        return new Promise((resolve, reject)=>{
            try{
                //make div for new viewer
                let pixelRatio = OpenSeadragon.pixelDensityRatio;
                w = w / pixelRatio;
                h = h / pixelRatio;
                
                const d = document.createElement('div');
                document.body.appendChild(d);
                d.style.cssText = `width:${w}px;height:${h}px;position:fixed;left:-${w*2}px;`;

                let ts = this.viewer.tileSources[this.viewer.currentPage()];
                let ti = this.viewer.world.getItemAt(this.viewer.currentPage());
                let ssViewer = OpenSeadragon({
                    element: d,
                    tileSources:[ts],
                    crossOriginPolicy: this.viewer.crossOriginPolicy,
                    prefixUrl: this.viewer.prefixUrl,
                    immediateRender:true,
                });
                ssViewer.viewport.setRotation(this.viewer.viewport.getRotation(true), true);
                ssViewer.addHandler('tile-drawn',(ev)=>{
                    // console.log(ev.tiledImage.coverage, ev.tile.level, ev.tile.x, ev.tile.y);
                    let coverage = ev.tiledImage.coverage;
                    let levels = Object.keys(coverage);
                    let maxLevel = levels[levels.length - 1];
                    if(ev.tile.level == maxLevel){
                        let full = coverage[maxLevel];
                        let status = Object.values(full).map(o=>Object.values(o)).flat();
                        // console.log(`Loaded ${loaded.filter(l=>l).length} of ${loaded.length} tiles`);
                        this._setProgress(status.filter(x=>x).length, status.length);
                    }
                    
                });
                ssViewer.addHandler('open',()=>{
                    ssViewer.world.getItemAt(0).setRotation(ti.getRotation(true), true);
                    ssViewer.world.getItemAt(0).addOnceHandler('fully-loaded-change',(ev)=>{
                        // draw scalebar if requested
                        if(this._includeScalebar && this._mpp){
                            let pixelWidth = Math.round(this._scalebarWidth * 1000 / this._mpp.x * scaleFactor);
                            let pixelHeight = Math.round(this._scalebarHeight);
                            let canvas = ssViewer.drawer.canvas;
                            let context = canvas.getContext('2d');
                            let canvasWidth = canvas.width;
                            let canvasHeight = canvas.height;
                            context.fillRect(canvasWidth - pixelHeight, canvasHeight - pixelHeight, -pixelWidth, -pixelHeight);
                        }
                        ssViewer.drawer.canvas.toBlob( async blob => {
                            if(pixelRatio != 1){
                                blob = await changeDpiBlob(blob, 96 * pixelRatio);
                            }
                            if(this.blobURL){
                                URL.revokeObjectURL(this.blobURL);
                            }
                            this.blobURL = URL.createObjectURL(blob);

                            resolve(this.blobURL);
                            
                            let container = ssViewer.element;
                            ssViewer.destroy();
                            container.remove();
                        });
                    })
                    // ssViewer.viewport.panTo(bounds.getCenter(), true);
                    let bounds = ssViewer.viewport.imageToViewportRectangle(imageBounds);
                    ssViewer.viewport.fitBounds(bounds);
                });
            } catch(e){
                reject(e);
            }
            
        });
        
    }
}

/**
 * @class 
 * @extends ToolBase
 * 
 */
class ScreenshotTool extends ToolBase{
    
    
    constructor(paperScope, overlay){
        super(paperScope);
        let self = this;

        this._ps = paperScope;
        this.compoundPath = new paper.CompoundPath({children:[],fillRule:'evenodd'});
        this.compoundPath.visible = false;
        this.compoundPath.fillColor = 'black';
        this.compoundPath.opacity = 0.3;

        this.project.toolLayer.addChild(this.compoundPath);

        this.crosshairTool = new paper.Group();
        let h1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        let h2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        let v1 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'black'});
        let v2 = new paper.Path({segments:[new paper.Point(0,0),new paper.Point(0,0)],strokeScaling:false,strokeWidth:1,strokeColor:'white',dashArray:[6,6]});
        this.crosshairTool.addChildren([h1,h2,v1,v2]);
        this.project.toolLayer.addChild(this.crosshairTool);
        this.crosshairTool.visible = false;
       
        this._aspectHeight = 1;
        this._aspectWidth = 1;
        this._aspectLocked = false;

        
        //add properties to this.tools so that they properly appear on html
        this.tool.onMouseDown= (ev) => {
            this.crosshairTool.visible = false;
            this.compoundPath.visible = true;
            this.compoundPath.removeChildren();
            this.compoundPath.addChild(new paper.Path.Rectangle(this._ps.view.bounds));
            window.cp = this.compoundPath;
        }
        this.tool.onMouseDrag= (ev) => {
            this.compoundPath.removeChildren(1);
            let point = this.getPoint(ev);
            this.compoundPath.addChild(new paper.Path.Rectangle(ev.downPoint, point));
        }
        this.tool.onMouseMove= (ev) => {
            this.crosshairTool.visible = true;
            setCursorPosition(self.tool, ev.point);
        }
        this.tool.onMouseUp = (ev) => {
            let point = this.getPoint(ev);
            this.broadcast('region-selected',new paper.Rectangle(ev.downPoint, point));
            // this.compoundPath.visible = false;
        }
        this.tool.extensions.onKeyDown=function(ev){
            if(ev.key=='escape'){
                overlay.deactivate();
            }
        }
        this.extensions.onActivate = () => {
            this.crosshairTool.visible = true;
            this.compoundPath.visible = false;
        }
        this.extensions.onDeactivate = (finished) => {
            this.crosshairTool.visible = false;
            this.compoundPath.visible = false;
        }   
        

        function setCursorPosition(tool, point){
            
            let pt = tool.view.projectToView(point);
            let left=tool.view.viewToProject(new paper.Point(0, pt.y))
            let right=tool.view.viewToProject(new paper.Point(tool.view.viewSize.width, pt.y))
            let top=tool.view.viewToProject(new paper.Point(pt.x, 0))
            let bottom=tool.view.viewToProject(new paper.Point(pt.x,tool.view.viewSize.height))
            // console.log(viewBounds)
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

    activate(){
        this.tool.activate();
        this.crosshairTool.visible = true;
        this.compoundPath.visible = false;
    }
    deactivate(){
        this.crosshairTool.visible = false;
        this.compoundPath.visible = false;
    }
    setAspectHeight(h){
        this._aspectHeight = h;
    }
    setAspectWidth(w){
        this._aspectWidth = w;
    }
    setAspectLocked(l){
        this._aspectLocked = l;
    }
    getPoint(ev){
        let point = ev.point;
        if(this._aspectLocked){
            let delta = ev.point.subtract(ev.downPoint);
            
            if(Math.abs(delta.x) > Math.abs(delta.y)){
                point.y = ev.downPoint.y + (delta.y < 0 ? -1 : 1 ) * Math.abs(delta.x) * this._aspectHeight / this._aspectWidth;
            } else {
                point.x = ev.downPoint.x + (delta.x < 0 ? -1 : 1 ) * Math.abs(delta.y) * this._aspectWidth / this._aspectHeight;
            }
        }
        return point;
    }

    
}
export {ScreenshotTool};
export {ScreenshotOverlay};


