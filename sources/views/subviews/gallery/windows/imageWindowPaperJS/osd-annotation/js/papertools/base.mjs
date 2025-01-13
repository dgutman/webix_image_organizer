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

/**
 * The ToolBase Class
 * @class
 * @memberof OSDPaperjsAnnotation
 */ 
class ToolBase{
    /**
     * Create a new instance of ToolBase.
     * @param {paper.PaperScope} paperScope - The Paper.js PaperScope object.
     * @memberof OSDPaperjsAnnotation.ToolBase#
     */    
    constructor(paperScope){

        /**
         * The project interface object containing various properties.
         * If a layer in the current project exists that is named "toolLayer" it will be used by the tool for graphical display
         * , the current active layer will be used as the tool layer. 
         * @memberof OSDPaperjsAnnotation.ToolBase#
         * @function projectInterface
         * @property {Function} getZoom - A function to get the current zoom level.
         * @property {paper.Layer} toolLayer - The layer used by the tool for graphical display.
         * @property {paper.PaperScope} paperScope - The Paper.js PaperScope object.
         * @property {Element} overlay - The overlay element used by the tool.
         */
        this.project ={
            getZoom:()=>paperScope.view.getZoom(),
            toolLayer:paperScope.project.layers.toolLayer || paperScope.project.activeLayer,
            paperScope:paperScope,
            overlay:paperScope.overlay,
        }
        
        let shiftPressed;
        let self=this;

        this._identityMatrix = new paperScope.Matrix();
      
        this.extensions = {
            onActivate:()=>{},
            onDeactivate:()=>{}
        }
        this.tool = new paperScope.Tool();
        
        this.tool._toolObject=this; //TODO is _toolObject actually used, and does it need to be?            
        this.tool.extensions = {
            onKeyUp:()=>{},
            onKeyDown:()=>{},
        }
        this.tool.onKeyDown=function(ev){
            if(!shiftPressed && ev.key==='shift'){
                shiftPressed=true;
                self.onDeactivate();//enable OpenSeadragon event handling for navigation
            }
            this.extensions.onKeyDown(ev);
            self.onKeyDown(ev);
        }
        this.tool.onKeyUp=function(ev){
            if(ev.key=='shift'){
                shiftPressed=false;
                self.onActivate();//start capturing mouse/keyboard events again
            }
            this.extensions.onKeyUp(ev);
            self.onKeyUp(ev);
        }

        this.tool.onMouseDown = ev => {
            this.onMouseDown(ev);
        }
        this.tool.onMouseDrag = ev => {
            this.onMouseDrag(ev);
        }
        this.tool.onMouseMove = ev => {
            this.onMouseMove(ev);
        }
        this.tool.onMouseUp = ev => {
            this.onMouseUp(ev);
        }
        this.listeners = {}
    }
    getTolerance(pixels, item = null){
        if(!item){
            item = this.item;
        }
        const scalefactor = item?.layer.scaling.x || 1;
        return pixels / scalefactor / this.project.getZoom();
    }
    /**
     * Check if the tool is active.
     * @returns {boolean} True if the tool is active, otherwise false.
     */    
    isActive(){return this._active; }
    activate(){
        this.tool.activate();
        this.onActivate();
    } 
    deactivate(finishToolAction){
        this.onDeactivate(finishToolAction);
    }
    /**
     * Function called when the tool is activated.
     */    
    onActivate(){
        this.captureUserInput(true);
        this.project.overlay.addEventListener('wheel',this.tool.onMouseWheel);
        this.project.toolLayer.bringToFront();
        this.extensions.onActivate();
    }
    /**
     * Function called when the tool is deactivated.
     * @param {boolean} [shouldFinish=false] - Indicates whether the tool should finish its action.
     */    
    onDeactivate(shouldFinish=false){
        this.captureUserInput(false);
        this.project.overlay.removeEventListener('wheel',this.tool.onMouseWheel);
        this.project.toolLayer.sendToBack(); 
        this.extensions.onDeactivate(shouldFinish);
    }
    /**
     * Add an event listener for a specific event type.
     * @param {string} eventType - The type of event to listen for.
     * @param {Function} callback - The callback function to be executed when the event occurs.
     */    
    addEventListener(eventType,callback){
        this.listeners[eventType] = this.listeners[eventType]||[];
        this.listeners[eventType].push(callback);
    }
    /**
     * Broadcast an event to all registered event listeners for the specified event type.
     * @param {string} eventType - The type of event to broadcast.
     * @param {...*} data - Data to be passed as arguments to the event listeners.
     */    
    broadcast(eventType,...data){
        let listeners = this.listeners[eventType];
        listeners && listeners.forEach(l=>l(...data));
    }
    
    /**
     * Capture user input to enable or disable OpenSeadragon mouse navigation.
     * @memberof OSDPaperjsAnnotation.ToolBase
     * @inner
     * @param {boolean} [capture=true] - Set to true to capture user input, false to release it.
     */    
    captureUserInput(capture = true) { 
        this.project.overlay.setOSDMouseNavEnabled(!capture);
    };

    // default no-op implementations of tool event handlers
    onMouseDown(){}
    onMouseMove(){}
    onMouseDrag(){}
    onMouseUp(){}
    onKeyDown(){}
    onKeyUp(){}

    
        
}
export {ToolBase};
