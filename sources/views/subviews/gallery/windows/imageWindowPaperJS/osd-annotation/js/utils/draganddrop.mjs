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
 * @class
 * @description Set up an element to let children be dragged and dropped to rearrange their order.
 * Styling and certain functionality depend on css properties (currently found in annotationui.css)
 * targed with class names prefixed with draganddrop-
 * 
 */
export class DragAndDrop{
    /**
     * 
     * @param {Object} options 
     * @param {HTMLElement} options.parent the parent element
     * @param {String} options.selector the selector to use
     * @param {HTMLElement} options.dropTarget the element to drop onto
     * @param {function} [options.onDrop] a callback to call when drop occurs
        
     }}
     */
    constructor(options){
        if(!options.parent){
            console.error('element is required');
            return;
        }
        if(!options.selector){
            console.error('selector is required');
            return;
        }
        if(!options.dropTarget){
            console.error('droptarget is required');
            return;
        }

        this.element = options.parent;
        this.selector = options.selector;
        this.droptarget = options.dropTarget;
        this.onDrop = options.onDrop;

        this.placeholder = null;
        this.dragging = null;

        this.refresh();


        this.droptarget.addEventListener('dragover',ev => {
            ev.preventDefault();
            return false;
        });
        this.droptarget.addEventListener('dragleave',ev=>{
            ev.preventDefault();
            return false;
        });
        this.droptarget.addEventListener('dragend',ev=>{
            if(!this.dragging){
                return;
            }
            ev.preventDefault();
            this.cleanupDropTarget();
            return false;
        });
        this.element.addEventListener('dragstart',ev=>{
            if(ev.target.matches(this.selector)){
                ev.stopPropagation();
                this.dragging = ev.target;
                this.placeholder = ev.target.cloneNode(true);
                this.placeholder.classList.add('draganddrop-placeholder');
                // this.dragging.parentNode.insertBefore(this.placeholder, this.dragging);
                ev.target.classList.add('draganddrop-dragging');
                this.setupDropTarget();
            }
        });
        this.element.addEventListener('dragend',ev=>{
            if(ev.target.matches(this.selector)){
                ev.stopPropagation();
                ev.target.classList.remove('draganddrop-dragging', 'draganddrop-hide');

                if(this.placeholder){
                    this.placeholder.remove();
                }
                this.placeholder = null;
                this.dragging = null;

                this.cleanupDropTarget();
            }
            
        });
        this.element.addEventListener('dragleave',ev=>{
            if(ev.target.matches(this.selector)){
                ev.stopPropagation();
            }
            
        });
        this.element.addEventListener('drop',ev=>{
            if(this.dragging && this.placeholder.parentNode == this.droptarget){
                ev.stopPropagation();
                this.placeholder.replaceWith(this.dragging);
                this.dragging = null;
                this.placeholder = null;

                if(this.onDrop){
                    this.onDrop();
                }
            }
        });
        this.element.addEventListener('dragover',ev=>{
            if(!this.dragging){
                return;
            }
            ev.preventDefault();
            this.dragging.classList.add('draganddrop-hide');
            if(ev.target.matches(this.selector)){
                ev.stopPropagation();
                
                let top=ev.target.getBoundingClientRect().top;
                let bottom=ev.target.getBoundingClientRect().bottom;
                if(this.placeholder == ev.target){
                    // console.log('returning');
                    return;
                }
                if(ev.clientY<(top+bottom)/2) {
                    ev.target.parentNode.insertBefore(this.placeholder, ev.target);
                }
                else {
                    ev.target.parentNode.insertBefore(this.placeholder, ev.target.nextSibling);
                }
            } else if(ev.target == this.element){
                this.droptarget.appendChild(this.placeholder);
                ev.stopPropagation();
            }
            
        });
    }

    /**
     * Add draggable attribute to children that match the selector passed in at creation
     */
    refresh(){
        this.element.querySelectorAll(this.selector).forEach(element => {
            element.setAttribute('draggable', true);
        })
    }

    setupDropTarget(){
        this.droptarget.classList.add('draganddrop-drop-target');
    }

    cleanupDropTarget(){
        this.droptarget.classList.remove('draganddrop-drop-target');
    }
}