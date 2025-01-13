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

import { FeatureUI } from './featureui.mjs';
import { EditableContent } from './utils/editablecontent.mjs';
import { domObjectFromHTML } from './utils/domObjectFromHTML.mjs';
import { datastore } from './utils/datastore.mjs';
import { DragAndDrop } from './utils/draganddrop.mjs';
import { Placeholder } from './paperitems/placeholder.mjs';
import { OpenSeadragon } from './osd-loader.mjs';
import { convertFaIcons } from './utils/faIcon.mjs';
import { paper } from './paperjs.mjs';

/**
 * A user interface for managing feature collections. The FeatureCollectionUI class provides a user
 *  interface to manage feature collections on a paper.Layer object. It allows users to create, edit,
 *  and organize features within the collection. The class includes various functionalities, such as 
 * adding and removing features, setting opacity and fill opacity for the paper layer, and more.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class FeatureCollectionUI{
    /**
     * Create a new FeatureCollectionUI instance.
     * 
     * @constructor
     * @property {string} displayName - The display name of the group.
     * @property {paper.Item} paperItem - The paper item object.
     * @property {HTMLElement} element - The HTML element of the feature collection UI.
     * @param {paper.Group} group - The paper group object.
     * @param {object} [opts] - The initialization options.
     * @param {IconFactory} [opts.iconFactory] - the IconFactory to use
     */
    constructor(group,opts){
        
        // this.toolbar = init.toolbar;
        this.element = makeFeatureCollectionElement();
        opts.iconFactory ? opts.iconFactory.convertFaIcons(this.element) : convertFaIcons(this.element);

        this._editableName = new EditableContent({iconFactory: opts.iconFactory});
        this.element.querySelector('.annotation-name.name').appendChild(this._editableName.element);
        this._editableName.onChanged = text => {
            this.label = text;
        }
        this._editableName.onEditClicked = event => {
            event.preventDefault();
            event.stopPropagation();
        }

        this._featurelist=this.element.querySelector('.features-list');

        this._dragAndDrop = new DragAndDrop({
            parent: this.element, 
            selector: '.features-list .feature', 
            dropTarget: this._featurelist,
            onDrop: ()=>{
                this.features.forEach(f => this.group.addChild(f.paperItem));
            }
        });

        this.group = group;
        // add paperjs event handlers
        this.group.on({
            'selection:mouseenter':()=>{
                this.element.classList.add('svg-hovered');
                this.element.dispatchEvent(new Event('mouseover'));
            },
            'selection:mouseleave':()=>{
                this.element.classList.remove('svg-hovered');
                this.element.dispatchEvent(new Event('mouseout'));
            },
            'selected':()=>{
                this.element.classList.add('selected');
                this.element.dispatchEvent(new Event('selected'));
            },
            'deselected':()=>{
                this.element.classList.remove('selected');
                this.element.dispatchEvent(new Event('deselected'));
            },
            'display-name-changed':()=>{
                this.updateLabel();
            },
            'removed':()=>{
                this.remove();
            },
            'child-added':(ev)=>{
                let featureUI = ev.item.FeatureUI || new FeatureUI(ev.item, opts);
                this._addFeature(featureUI);
            }
        });

        // expose this object as a property of the paper.js group
        this.group.featureCollectionUI = this;

        
        this.remove = ()=>{
            this.element.remove();
        }
        /**
         * Get the number of features in the feature collection.
         * @member
         * @returns {number} The number of features.
         */
        this.numFeatures = ()=>{
            return this.features.length;
        }

        /**
         * Add a feature to the feature collection UI element.
         * @member
         * @param {FeatureUI} f - The feature to add.
         * @returns {jQuery} The jQuery object of the feature element.
         */
        this._addFeature = f => {
            f.paperItem.updateFillOpacity();
            this._featurelist.appendChild(f.element);
            this._sortableDebounce && window.clearTimeout(this._sortableDebounce);
            self._sortableDebounce = window.setTimeout(()=>this._dragAndDrop.refresh(), 15);
            return f.element; 
        }
        /**
         * Create a new feature and add it to the paper group using the default style properties of the group.
         * This function also creates a geoJSON object for the feature and converts it to a paper item.
         * @member
        * @property {paper.Color} fillColor - The fill color of the group.
        * @property {paper.Color} strokeColor - The stroke color of the group.
        * @property {Object} rescale - The rescale properties of the group.
        * @property {number} fillOpacity - The fill opacity of the group.
        * @property {number} strokeOpacity - The stroke opacity of the group.
        * @property {number} strokeWidth - The stroke width of the group.
        * 
        * @property {string} type - The type of the feature (e.g., "Feature").
        * @property {Object} geometry - The geometry object.
        * @property {Object} properties - The properties object containing style information. 
        * 
        * @returns {paper.Item} The paper item object of the new feature that was added to the group.
         */
        this.createFeature=function(){
            //define a new feature
            let props = this.group.defaultStyle;
            let clonedProperties = {
                fillColor:new paper.Color(props.fillColor),
                strokeColor:new paper.Color(props.strokeColor),
                rescale:OpenSeadragon.extend(true,{},props.rescale),
                fillOpacity:props.fillOpacity,
                strokeOpacity:props.strokeOpacity,
                strokeWidth:props.strokeWidth,
            }
            let placeholder = new Placeholder(clonedProperties);
            this.group.addChild(placeholder.paperItem);
            return placeholder.paperItem;
        }

        
        const setOpacity = o=>{
            this.group.opacity = o;
        }
        
        const setFillOpacity = o => {
            this.group.fillOpacity = o;
        }

        this.ui={
            setOpacity:setOpacity,
            setFillOpacity:setFillOpacity,
        }
        
        datastore.set(this.element, {featureCollection: this});
        
        this.label = this.group.displayName;

        this.element.addEventListener('click',ev=>{
            ev.stopPropagation();
        })
        this.element.querySelector('.toggle-list').addEventListener('click',ev=>{
            let numFeatures = this._featurelist.children.length;
            this.element.querySelector('.num-annotations').textContent = numFeatures;
            this.element.querySelector('.features-summary').dataset.numElements = numFeatures;
            this.element.querySelector('.features').classList.toggle('collapsed');
            ev.stopPropagation();
            ev.preventDefault();
        });

        this.element.addEventListener('click', ev => {

            if(ev.target.matches('.annotation-header [data-action]')){
                //don't bubble up
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                ev.preventDefault();
                
                let action = ev.target.dataset.action;
                switch(action){
                    case 'trash': this.removeLayer(true); break;
                    case 'style': this.openStyleEditor(ev); break;
                    case 'show': this.toggleVisibility(); break;
                    case 'hide': this.toggleVisibility(); break;
                    default: console.log('No function set for action:',action);
                }
            }
            
        });
        this.element.querySelector('.new-feature').addEventListener('click',ev => {
            ev.stopPropagation();
            let item = this.createFeature();
            item.select();
        });

        return this;
    }
    
    /**
    * Get the features in the feature collection.
    * @member
    * @returns {FeatureUI[]} The array of features.
    */
    get features(){
       return Array.from(this._featurelist.querySelectorAll('.feature')).map(element => {
           return datastore.get(element, 'feature');
       });
    }
    get label(){
        return this.group.displayName;
    }
    set label(l){
        return this.setLabel(l)
    }
    /**
     * Set the label of the feature collection with a source.
     * @param {string} text - The new label of the feature collection.
     * @param {string} source - The source of the label (e.g. 'user-defined' or 'initializing').
     * @returns {string} The new label of the feature collection.
     */
    setLabel(text,source){
        let l = new String(text);
        l.source=source;
        this.group.displayName = l;
        this.updateLabel();
        return l;
    }
    /**
     * Update the label of the feature collection in the UI element.
     */
    updateLabel(){
        this._editableName.setText(this.label);
    }
    /**
     * Toggle the visibility of the feature collection UI element and the paper group.
     */
    toggleVisibility(){
        this.element.classList.toggle('annotation-hidden');
        this.group.visible = !this.element.classList.contains('annotation-hidden');
    }
    /**
     * Remove the paper layer associated with the feature collection.
     * @param {boolean} [confirm=true] - Whether to confirm before removing or not.
     */
    removeLayer(confirm = true){
        if(confirm && window.confirm('Remove this layer?')==true){
            this.group.remove();
        } else {

        }
    }
    /**
     * Open the style editor for the feature collection.
     * @function 
     * @param {object} ev - The event object.
     */
    openStyleEditor(ev){
        let heard = this.group.project.emit('edit-style',{item:this.group});
        if(!heard){
            console.warn('No event listeners are registered for paperScope.project for event \'edit-style\'');
        }
    }
}

export {FeatureCollectionUI};

/**
 * Create an HTML element for the feature collection UI.
 * @private
 * @returns {jQuery} The jQuery object of the HTML element.
 */
function makeFeatureCollectionElement(){
    let html = `
    <div class='feature-collection'>
        <div class='annotation-header hoverable-actions'>
            <span class="visibility-toggle"><span class="fa fa-eye" data-action="hide"></span><span class="fa fa-eye-slash" data-action="show"></span></span>
            <span class='annotation-name name'></span>
            <span class='onhover fa-solid fa-palette' data-action='style' title='Open style editor'></span>
            <span class='onhover fa-solid fa-trash-can' data-action='trash' title='Remove feature collection'></span>
        </div>
        <div class="flex-row features">
            <div class="toggle-list btn-group btn-group-sm"><button class="btn btn-default"><span class='fa-solid fa-caret-down' data-action="collapse-down"></span><span class='fa-solid fa-caret-up' data-action="collapse-up"></span></button></div>
            <div class="annotation-details">
                <div>
                    <div class='features-summary feature-item name'><span class='num-annotations'></span> annotation element<span class='pluralize'></span></div>
                    <div class='features-list'></div>
                </div>
                <div class='new-feature feature'><span class='fa fa-plus' data-action="add-feature"></span>Add feature</div>
            </div>
        </div>
    </div>
    `;
    return domObjectFromHTML(html);
}