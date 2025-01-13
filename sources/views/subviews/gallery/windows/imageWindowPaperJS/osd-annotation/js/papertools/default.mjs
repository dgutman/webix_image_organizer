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
 * Default annotation tool that extends the AnnotationUITool class.
 * Used for image navigation and interaction with annotations.
 *
 * @class
 * @extends AnnotationUITool
 * @memberof OSDPaperjsAnnotation
 */
class DefaultTool extends AnnotationUITool{
    /**
     * Create a DefaultTool instance for image navigation and annotation interaction.
     * @constructor
     * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
     */
    constructor(paperScope){
        super(paperScope);
        this.setToolbarControl(new DefaultToolbar(this));
    }

    onDeactivate(){}

    onActivate(){
        this.resetCanvasZIndex();
    } 
}
export{DefaultTool};

/**
 * Default toolbar control for the DefaultTool class.
 * Provides image navigation functionality.
 *
 * @class
 * @extends AnnotationUIToolbarBase
 * @memberof OSDPaperjsAnnotation.DefaultTool
 */
class DefaultToolbar extends AnnotationUIToolbarBase{
    /**
     * Create a DefaultToolbar instance associated with the DefaultTool.
     *
     * @constructor
     * @param {DefaultTool} tool - The DefaultTool linked to the toolbar control.
     */
    constructor(tool){
        super(tool);
        
        const i = makeFaIcon('fa-hand');
        this.button.configure(i,'Image Navigation Tool');
        
    }
    /**
     * Check whether the toolbar control is enabled for a specific mode.
     *
     * @param {string} mode - The mode to check for enabling.
     * @returns {boolean} True, as the default tool is enabled for all modes.
     */
    isEnabledForMode(mode){
        return true;//enabled for all modes
    }
    
}