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
import {ToolBase} from './papertools/base.mjs';
import {DefaultTool} from './papertools/default.mjs';
import {WandTool} from './papertools/wand.mjs';
import {BrushTool} from './papertools/brush.mjs';
import {PointTool} from './papertools/point.mjs';
import {PointTextTool} from './papertools/pointtext.mjs';
import {RectangleTool} from './papertools/rectangle.mjs';
import {EllipseTool} from './papertools/ellipse.mjs';
import {StyleTool} from './papertools/style.mjs';
import {LinestringTool} from './papertools/linestring.mjs';
import {PolygonTool} from './papertools/polygon.mjs';
import {SelectTool} from './papertools/select.mjs';
import {TransformTool} from './papertools/transform.mjs';
import {RasterTool} from './papertools/raster.mjs';




/**
 * A class for creating and managing annotation toolbars
 * @memberof OSDPaperjsAnnotation
 * @class 
 * 
 */
class AnnotationToolbar{
    /**
     * Constructs an AnnotationToolbar instance.
     * @property {Object} ui - The UI object.
     * @property {Object} paperScope - The Paper.js scope object.
     * @property {null|string[]} currentMode - The current mode.
     * @property {null|number} setModeTimeout - The set mode timeout.
     * @property {Object} toolLayer - The tool layer.
     * @property {ToolConstructors} toolConstructors - An object containing tool constructors.
     * @property {Object.<string, ToolObject>} tools - An object containing tool instances.
     * @param {Object} paperScope - The Paper.js scope object.
     * @param {Array} [tools] - An array of tool names or constructors to use. If not provided, all available tools will be used.
     * @throws {Error} Throws an error if `tools` is provided but is not an array.
     */
    constructor(paperScope, tools){
        // tools should be an array of strings, or null/falsey
        if(tools && !Array.isArray(tools)){
            throw('Bad option: if present, tools must be an Array of tool names or constructors to use.');
        }
        this.ui = this._makeUI();
        this.paperScope=paperScope;

        this.currentMode = null;
        this.setModeTimeout = null;
        
        let toolLayer=new paperScope.Layer();
        toolLayer.isGeoJSONFeatureCollection=false;
        toolLayer.name = 'toolLayer';
        toolLayer.applyMatrix = false;
        // toolLayer.setScaling(1/toolLayer.view.viewSize.width);
        paperScope.project.addLayer(toolLayer);

        /**
         * 
         * @property {DefaultTool} default - The default tool constructor.
         * @property {SelectTool} select - The select tool constructor.
         * @property {TransformTool} transform - The transform tool constructor.
         * @property {StyleTool} style - The style tool constructor.
         * @property {RectangleTool} rectangle - The rectangle tool constructor.
         * @property {EllipseTool} ellipse - The ellipse tool constructor.
         * @property {PointTool} point - The point tool constructor.
         * @property {PointTextTool} text - The point text tool constructor.
         * @property {PolygonTool} polygon - The polygon tool constructor.
         * @property {BrushTool} brush - The brush tool constructor.
         * @property {WandTool} wand - The wand tool constructor.
         * @property {LinestringTool} linestring - The linestring tool constructor.
         * @property {RasterTool} raster - The raster tool constructor.
         */
        this.toolConstructors = {
            default:DefaultTool,
            select: SelectTool,
            transform: TransformTool,
            style:  StyleTool,
            rectangle: RectangleTool,
            ellipse: EllipseTool,
            point: PointTool,
            text: PointTextTool,
            polygon: PolygonTool,
            brush: BrushTool,
            wand: WandTool,
            linestring : LinestringTool,
            raster: RasterTool,
        }   
        this.tools = {};

        // if array of tools was passed in, use that. Otherwise use all available ones listed in the toolConstructors dictionary
        let toolsToUse = tools || Object.keys(this.toolConstructors);
        // make sure the default tool is always included
        if(toolsToUse.indexOf('default') == -1){
            toolsToUse = ['default', ...toolsToUse];
        }
        //activate our paperScope before creating the tools
        this.paperScope.activate();
        toolsToUse.forEach(t => {
            if(typeof t === 'string'){
                if(!this.toolConstructors[t]){
                    console.warn(`The requested tool is invalid: ${t}. No constructor found for that name.`);
                    return;
                }
            } else if(! (t instanceof ToolBase) ){
                console.warn(`${t} must inherit from class ToolBase`);
                return;
            }

            let toolConstructor = (t instanceof ToolBase) ? t : this.toolConstructors[t]

            let toolObj = this.tools[t] = new toolConstructor(this.paperScope);
            let toolbarControl = toolObj.getToolbarControl();
            if(toolbarControl) this.addToolbarControl(toolbarControl);

            toolObj.addEventListener('deactivated',ev => {
                //If deactivation is triggered by another tool being activated, this condition will fail
                if(ev.target == this.paperScope.getActiveTool()){
                    this.tools.default.activate();
                }
            });
            
        })
        this.tools.default.activate();

        this.setMode();

        //items emit events on the paper project; add listeners to update the toolbar status as needed       
        paperScope.project.on({
            
            'item-replaced':()=>{
                this.setMode();
            },

            'item-selected':()=>{
                this.setMode()
            },
            'item-deselected':()=>{
                this.setMode()
            },
            'item-removed':()=>{
                this.setMode()
            },
            'items-changed':()=>{
                this.setMode();
            }
        });

    }

    get element(){
        return this._element;
    }
    
    /**
     * Sets the mode of the toolbar based on the currently selected items in the project. Individual tools will be enabled and disabled by this. If the currently active tool is not supported for the selected item(s) it will be deactivated.
     * 
     */
    setMode() {
        let self = this;
        this.setModeTimeout && clearTimeout(this.setModeTimeout);
        this.setModeTimeout = setTimeout(() => {
            this.setModeTimeout = null;
            let selection = this.paperScope.findSelectedItems();
            let activeTool = this.paperScope.getActiveTool();
            if (selection.length === 0) {
                this.currentMode = 'select';
            } else if (selection.length === 1) {
                let item = selection[0];
                let def = item.annotationItem || {};
                let type = def.type;
                if (def.subtype) type += ':' + def.subtype;
                let mode = type === null ? 'new' : type;
                this.currentMode = mode;
            } else {
                this.currentMode = 'multiselection';
            }
        
            if (activeTool.getToolbarControl().isEnabledForMode(this.currentMode) === false) {
                activeTool.deactivate(true);
                this.tools.default.activate();
            }
        

            Object.values(this.tools).forEach(toolObj => {
                let t = toolObj.getToolbarControl();
                t && (t.isEnabledForMode(self.currentMode) ? t.button.enable() : t.button.disable());
            });
    

            activeTool.selectionChanged();
        }, 0);
    }

/**
 * Adds a toolbar control to the Annotation Toolbar.
 *
 * @param {Object} toolbarControl - The toolbar control to be added.
 * @throws {Error} Throws an error if the toolbar control's button element is not found.
 */    
    addToolbarControl(toolbarControl){
        const button = toolbarControl.button.element;
        const dropdown = toolbarControl.dropdown;
        this._buttonbar.appendChild(button);
        this._dropdowns.appendChild(dropdown);

        toolbarControl.isEnabledForMode(this.currentMode) ? toolbarControl.button.enable() : toolbarControl.button.disable();
    }

/**
 * Shows the Annotation Toolbar.
 */
    show(){
        this.element.style.display = 'inline-block';
    }
/**
 * Hides the Annotation Toolbar.
 */
    hide(){
        this.element.style.display = 'none';
    }
    
/**
 * Destroys the Annotation Toolbar.
 *
 */
    destroy(){
        this.element.remove();
    }

    _makeUI(){
        this._element = document.createElement('div');
        this._buttonbar = document.createElement('div');
        this._dropdowns = document.createElement('div');
        const dropdownContainer = document.createElement('div');
        this._element.appendChild(this._buttonbar);
        this._element.appendChild(dropdownContainer);
        dropdownContainer.appendChild(this._dropdowns);

        const classes = 'annotation-ui-drawing-toolbar btn-group btn-group-sm mode-selection'.split(' ');
        classes.forEach(c => this._element.classList.add(c));

        dropdownContainer.classList.add('dropdowns-container');
        this._dropdowns.classList.add('dropdowns');
        this._buttonbar.classList.add('annotation-ui-buttonbar');

    } 
}
export {AnnotationToolbar};



