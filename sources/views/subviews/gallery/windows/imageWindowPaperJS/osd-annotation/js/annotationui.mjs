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

//styles in annotationui.css

import { addCSS } from './utils/addcss.mjs';
import { AnnotationToolbar } from './annotationtoolbar.mjs';
import { LayerUI } from './layerui.mjs';
import { FileDialog } from './filedialog.mjs';

addCSS('annotationui.css', 'annotationui');
addCSS('editablecontent.css', 'editablecontent');

/**
 * @memberof OSDPaperjsAnnotation
 * @class
 * A class for creating and managing the annotation UI
 */
class AnnotationUI {

  /**
   * Creates an instance of AnnotationUI.
   *
   * @param {Object} annotationToolkit - The annotation toolkit object.
   * @param {Object} opts - The options for the AnnotationUI.
   * @param {boolean} [opts.autoOpen=true] - Determines if the AnnotationUI should be automatically opened.
   * @param {Array} [opts.featureCollections=[]] - An array of feature collections to load.
   * @param {boolean} [opts.addButton=true] - Determines if the AnnotationUI button should be added.
   * @param {boolean} [opts.addToolbar=true] - Determines if the AnnotationToolbar should be added.
   * @param {string[]} [opts.tools=null] - An array of tool names to use in the AnnotationToolbar. If not provided, all available tools will be used.
   * @param {boolean} [opts.addLayerUI=true] - Determines if the LayerUI dialog should be added.
   * @param {boolean} [opts.addFileButton=true] - Determines if the file button should be added for saving/loading annotations.
   * @param {boolean} [opts.buttonTogglesToolbar=true] - Determines if the AnnotationToolbar visibility is toggled by the AnnotationUI button.
   * @param {boolean} [opts.buttonTogglesLayerUI=true] - Determines if the LayerUI visibility is toggled by the AnnotationUI button.
   */
  constructor(annotationToolkit, opts) {
    let defaultOpts = {
      autoOpen: true,
      featureCollections: [],
      addButton: true,
      addToolbar: true,
      tools: null,
      addLayerUI: true,
      addFileButton: true,
      buttonTogglesToolbar: true,
      buttonTogglesLayerUI: true,
    };

    opts = this.options = Object.assign(defaultOpts, opts);
    let _viewer = this._viewer = annotationToolkit.viewer; // shorter alias
    this._isOpen = !!opts.autoOpen;

  
    /**
     * _toolbar: AnnotationToolbar UI for interactive tools
     * @private
     */
    this._toolbar = new AnnotationToolbar(annotationToolkit.overlay.paperScope, opts.tools);

    /**
     * _fileDialog: FileDialog UI for loading/saving data
     * @private
     */
    this._fileDialog = new FileDialog(annotationToolkit, { appendTo: _viewer.element });
    this._filebutton = null;
    if (opts.addFileButton) {
      //Handles the click event of the file button.
      this._filebutton = annotationToolkit.overlay.addViewerButton({
        onClick: () => {
          this._fileDialog.toggle();
        },
        faIconClass: 'fa-save',
        tooltip: 'Save/Load Annotations',
      });
    }

    /**
     * _layerUI: LayerUI: graphical user interface for this annotation layer
     * @private
     */
    this._layerUI = new LayerUI(annotationToolkit, opts.addFileButton);
    if (opts.addLayerUI) {
      this._addToViewer();
    }

    if(opts.autoOpen){
      this._layerUI.show();
      this._toolbar.show();
    } else {
      this._layerUI.hide();
      this._toolbar.hide();
    }


    /**
     * _button: Button for toggling LayerUI and/or AnnotationToolbar
     * @private
     */
    this._button = null;
    if (opts.addButton) {
      this._button = annotationToolkit.overlay.addViewerButton({
        onClick: () => {
          this._isOpen = !this._isOpen;
          if (this._isOpen) {
            this.options.buttonTogglesToolbar && this._toolbar.show();
            this.options.buttonTogglesLayerUI && this._layerUI.show();
          } else {
            this.options.buttonTogglesToolbar && this._toolbar.hide();
            this.options.buttonTogglesLayerUI && this._layerUI.hide();
          }
        },
        faIconClass: 'fa-pencil',
        tooltip: 'Annotation Interface',
      });
    }

    if (opts.featureCollections) {
      annotationToolkit.loadGeoJSON(opts.featureCollections);
    }
  }

  /**
   * Destroys the AnnotationUI and cleans up its resources.
   */
  destroy() {
    this._layerUI.destroy();
    this._toolbar.destroy();
    if (this._button) {
      let idx = this._viewer.buttonGroup.buttons.indexOf(this._button);
      if (idx > -1) {
        this._viewer.buttonGroup.buttons.splice(idx, 1);
      }
      this._button.element.remove();
    }
    if (this._filebutton) {
      let idx = this._viewer.buttonGroup.buttons.indexOf(this._filebutton);
      if (idx > -1) {
        this._viewer.buttonGroup.buttons.splice(idx, 1);
      }
      this._filebutton.element.remove();
    }
  }

  /**
   * Show the LayerUI interface
   */
  showUI(){
    this.ui.show();
  }

  /**
   * Hide the LayerUI interface
   */
  hideUI(){
    this.ui.hide();
  }

  /**
   * Show the toolbar
   */
  showToolbar(){
    this.toolbar.show();
  }

  /**
   * Hide the toolbar
   */
  hideToolbar(){
    this.toolbar.hide();
  }

  get ui(){
    return this._layerUI;
  }

  get toolbar() {
    return this._toolbar;
  }

  get element(){
    return this._layerUI.element;
  }

  /**
   * Set up the grid that adds the UI to the viewer
   */
  _addToViewer(){
    
    const container = document.createElement('div');
    
    this._viewer.element.appendChild(container);
    
    const top = document.createElement('div');
    const bottom = document.createElement('div');
    const center = document.createElement('div');
    const left = document.createElement('div');
    const right = document.createElement('div');
    const resizeRight = document.createElement('div');
    const classes={
      'annotation-ui-grid':container,
      'top':top,
      'bottom':bottom,
      'center':center,
      'left':left,
      'right':right,
      'resize-right':resizeRight
    }

    Object.entries(classes).forEach(([name, node])=>node.classList.add(name));
    [center, right, left, top, bottom].forEach(div => container.appendChild(div));

    center.appendChild(this._viewer.container);
    right.appendChild(resizeRight);
    right.appendChild(this.element);
    top.appendChild(this._toolbar.element);

    // keep a reference to the UI element
    const element = this.element;

    // add event handlers to do the resizing.
    const body = document.querySelector('body');
    let offset;

    resizeRight.addEventListener('mousedown',function(ev){
      this.classList.add('resizing');
      body.classList.add('.annotation-ui-noselect');

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseleave', finishResize);
      document.addEventListener('mouseup', finishResize);

      offset = element.getBoundingClientRect().left - ev.x;

    });

    function moveHandler(ev){
      if(resizeRight.classList.contains('resizing')){
        if(ev.movementX){
          const bounds = element.getBoundingClientRect();
          element.style.width = bounds.right - ev.x - offset + 'px';
        }
        ev.preventDefault();
      }
    }
    function finishResize(ev){
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseleave', finishResize);
      document.removeEventListener('mouseup', finishResize);
      body.classList.remove('.annotation-ui-noselect');
      resizeRight.classList.remove('resizing');
    }
    
  }

}

export { AnnotationUI };
