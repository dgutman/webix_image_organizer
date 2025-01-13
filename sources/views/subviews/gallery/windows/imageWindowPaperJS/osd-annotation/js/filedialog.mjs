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


import { EditableContent } from "./utils/editablecontent.mjs";
import { dialog } from "./utils/dialog.mjs";
import { datastore} from "./utils/datastore.mjs";
import { paper } from './paperjs.mjs';

/**
 * The FileDialog class provides options for saving and loading feature collections as GeoJSON, exporting them as SVG or PNG files,
 * and storing them in local storage. It is designed to work with the AnnotationToolKit (atk) object to manage annotations.
 *
 * @class
 * @memberof OSDPaperjsAnnotation
 */
class FileDialog{

    /**
     * Creates an instance of the FileDialog class, which allows users to save and load feature collections in various formats.
     *
     * @constructor
     * @memberof OSDPaperjsAnnotation.FileDialog
     * @param {any} atk - The AnnotationToolKit object.
     * @param {object} opts - Additional options for the file dialog.
     */
    constructor(atk, opts){
        let _this=this;
        this.dialog = dialog({innerHTML: fileDialogHtml(), title:''});
        this.element = this.dialog.container;

        this.element.querySelector('button[data-action="geojson-load"]').addEventListener('click',loadGeoJSON)
        this.element.querySelector('button[data-action="geojson-save"]').addEventListener('click',saveGeoJSON)
        this.element.querySelector('button[data-action="svg-export"]').addEventListener('click',exportSVG)
        this.element.querySelector('button[data-action="png-export"]').addEventListener('click',exportPNG)
        this.element.querySelector('button[data-action="ls-store"]').addEventListener('click',localstorageStore)
        this.element.querySelector('button[data-action="ls-load"]').addEventListener('click',localstorageLoad)

        function getFileName(appendIfNotBlank){
            // TODO: handle case of multiple images
            let output = atk.viewer.world.getItemAt(0)?.source.name || '';
            if(output.length > 0){
                output += appendIfNotBlank;
            }
            return output;
        }
        function initDlg(){
            _this.element.querySelector('.featurecollection-list')?.replaceChildren();
            _this.element.querySelector('.finalize')?.replaceChildren();
        }
        /**
         * Sets up the feature collection list in the dialog. This function populates the file dialog with a list of available feature collections.
         *
         * @private
         * @param {Array} fcarray - An array of feature collections.
         * @returns {jQuery} The feature collection list element.
         */
        function setupFeatureCollectionList(fcarray){
            let list = _this.element.querySelector('.featurecollection-list');
            list.replaceChildren();
            fcarray.forEach(fc => {
                let label = fc.label || fc.displayName; //handle geoJSON objects or paper.Layers

                const d = document.createElement('div');
                list.appendChild(d);
                const input = document.createElement('input');
                d.appendChild(input);
                input.setAttribute('type', 'checkbox');
                input.setAttribute('checked', 'true');
                datastore.set(input, 'fc', fc);

                const l = document.createElement('label');
                l.innerText = label;
                d.appendChild(l);
                
            });
            // list.append(els);
            return list;
        }
        /**
         * Loads a GeoJSON file and displays its content in the file dialog. This function triggers the file input and loads the GeoJSON file selected by the user.
         * It then parses the GeoJSON data, sets up the feature collection list, and provides options to add or replace existing layers.
         *
         * @private
         */
        function loadGeoJSON(){
            initDlg();
            const finput = document.createElement('input');
            finput.type = 'file';
            finput.accept = 'text/geojson,.geojson,text/json,.json';
            
            finput.addEventListener('change',function(){
                let file = this.files[0];
                let fr = new FileReader();
                let geoJSON=[];
                fr.onload=function(){
                    try{
                        geoJSON = JSON.parse(this.result);
                    }catch(e){
                        alert('Bad file - JSON could not be parsed');
                        return;
                    }
                    if(!Array.isArray(geoJSON)) geoJSON = [geoJSON];
                    let type = Array.from(new Set(geoJSON.map(e=>e.type)))
                    if(type.length==0){
                        _this.element.find('.featurecollection-list').text('Bad file - no Features or FeatureCollections were found')
                    }
                    if(type.length > 1){
                        alert('Bad file - valid geoJSON consists of an array of objects with single type (FeatureCollection or Feature)');
                        return;
                    }
                    
                    //convert list of features into a featurecolletion
                    if(type[0]=='Feature'){
                        let fc = [{
                            type:'FeatureCollection',
                            features:geoJSON,
                            properties:{
                                label:file.name
                            }
                        }];
                        geoJSON = fc;
                    }
                    setupFeatureCollectionList(geoJSON);
                    
                    const replaceButton = document.createElement('button');
                    _this.element.querySelector('.finalize').appendChild(replaceButton);
                    replaceButton.innerText = 'Replace existing layers';
                    replaceButton.addEventListener('click',()=>atk.addFeatureCollections(geoJSON,true));

                    const addButton = document.createElement('button');
                    _this.element.querySelector('.finalize').appendChild(addButton);
                    addButton.innerText = 'Add new layers';
                    addButton.addEventListener('click',()=>atk.addFeatureCollections(geoJSON,false));
                }
                fr.readAsText(file);
            })
            
            // Normal dispatchEvent doesn't work; use the alternative below to open the file dialog
            finput['click']();
        }
        /**
         * Loads the feature collections from local storage and displays them in the file dialog. This function retrieves the feature collections stored in local storage
         * and sets up the feature collection list in the file dialog, providing options to add or replace existing layers.
         *
         * @private
         */
        function localstorageLoad(){
            initDlg();
            let geoJSON=[];
            let filename=getFileName();
            let lskeys=Object.keys(window.localStorage);
            let listContainer = _this.element.querySelector('.featurecollection-list');
            listContainer.innerText='';

            
            const list = document.createElement('div');
            list.classList.add('localstorage-key-list');
            listContainer.appendChild(list);

            lskeys.sort((a,b)=>a.localeCompare(b)).forEach(key=>{
                const div = document.createElement('div');
                div.classList.add('localstorage-key');
                div.style.order = key==filename ? 0 : 1;
                div.innerText = key;
                list.appendChild(div);
            });
            
            list.querySelectorAll('.localstorage-key').forEach(e=>e.addEventListener('click', function(){
                let lsdata = window.localStorage.getItem(this.textContent);
                if(!lsdata){
                    alert(`No data found in local storage for key=${this.textContent}`);
                    return;
                }
                try{
                    geoJSON = JSON.parse(lsdata);
                }catch(e){
                    alert('Bad data - JSON could not be parsed');
                    return;
                }
                setupFeatureCollectionList(geoJSON);
                
                const replace = document.createElement('button');
                replace.innerText = 'Replace existing layers';
                replace.addEventListener('click',()=>atk.addFeatureCollections(geoJSON, true));
                _this.element.querySelector('.finalize').appendChild(replace);

                const add = document.createElement('button');
                add.innerText = 'Add new layers';
                add.addEventListener('click',()=>atk.addFeatureCollections(geoJSON, false));
                _this.element.querySelector('.finalize').appendChild(add);
            }));
            
            
        }
        /**
         * Saves the feature collections as a GeoJSON file and provides a download link. This function prepares the selected feature collections in GeoJSON format,
         * creates a Blob, and generates a download link for the user to save the file.
         *
         * @private
         */
        function saveGeoJSON(){
            initDlg();
            let fcs = atk.toGeoJSON();
            let list = setupFeatureCollectionList(fcs);
            let finishbutton = setupFinalize('Create file','Choose file name:',getFileName('-') + 'FeatureCollections.json');
            finishbutton.addEventListener('click',function(){
                this.parentElement.querySelector('.download-link')?.remove();
                
                let toSave=Array.from(list.querySelectorAll('input:checked')).map(cb => datastore.get(cb,'fc') );
                let txt = JSON.stringify(toSave);
                let blob = new Blob([txt],{type:'text/json'});
                let filename=this.getAttribute('data-label'); 
                
                const dl = document.createElement('div');
                dl.classList.add('download-link');
                this.parentElement.insertBefore(dl, this.nextSibling);

                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                a.target = '_blank';
                a.innerText = 'Download file';
                dl.appendChild(a);
            })
        }
        /**
         * Exports the feature collections as an SVG file and provides a download link. This function prepares the selected feature collections and exports them as an SVG file.
         * It generates a download link for the user to save the file in SVG format.
         *
         * @private
         */      
        function exportSVG(){
            initDlg();
            // let fcs = atk.toGeoJSON();
            let fcs = atk.getFeatureCollectionGroups();
            let list = setupFeatureCollectionList(fcs);
            let finishbutton = setupFinalize('Create file','Choose file name:',getFileName('-')+'FeatureCollections.svg');
            finishbutton.addEventListener('click',function(){
                
                this.parentElement.querySelector('.download-link')?.remove();
                let toSave=Array.from(list.querySelectorAll('input:checked')).map(function(cb){return datastore.get(cb, 'fc')});
                if(toSave.length>0){
                    let p = new paper.PaperScope();
                    p.setup();
                    toSave.forEach(function(s){
                        p.project.activeLayer.addChildren(s.layer.clone({insert:false,deep:true}).children);
                    })
                    let blob = new Blob([p.project.exportSVG({asString:true,bounds:'content'})],{type:'text/svg'});
                    let filename=this.getAttribute('data-label');

                    const dl = document.createElement('div');
                    dl.classList.add('download-link');
                    this.parentElement.insertBefore(dl, this.nextSibling);

                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = filename;
                    a.target = '_blank';
                    a.innerText = 'Download file';
                    dl.appendChild(a);
                }
            })
        }
        /**
         * Exports the feature collections as a PNG file and provides a download link. This function prepares the selected feature collections and exports them as a rasterized PNG file.
         * It generates a download link for the user to save the file in PNG format.
         *
         * @private
         */
        function exportPNG(){
            initDlg();
            let fcs = atk.getFeatureCollectionGroups();
            let list = setupFeatureCollectionList(fcs);
            let finishbutton = setupFinalize('Create file','Choose file name:',getFileName('-')+'raster.png');
            finishbutton.addEventListener('click',function(){
                this.parentElement.querySelector('.download-link')?.remove();
                let toSave=Array.from(list.querySelectorAll('input:checked')).map(function(cb){return datastore.get(cb, 'fc')});
                if(toSave.length>0){
                    let p = new paper.PaperScope();
                    p.setup();
                    toSave.forEach(function(s){
                        p.project.activeLayer.addChildren(s.layer.clone({insert:false,deep:true}).children);
                    })
                    // let blob = new Blob([p.project.activeLayer.rasterize({insert:false}).toDataURL()],{type:'image/png'});
                    let filename=this.getAttribute('data-label');

                    const dl = document.createElement('div');
                    dl.classList.add('download-link');
                    this.parentElement.insertBefore(dl, this.nextSibling);

                    const a = document.createElement('a');
                    a.href = p.project.activeLayer.rasterize({insert:false}).toDataURL();
                    a.download = filename;
                    a.target = '_blank';
                    a.innerText = 'Download file';
                    dl.appendChild(a);
                }
            })
        }
        /**
         * Stores the feature collections in the local storage.
         * @private 
         */        
        function localstorageStore(){
            initDlg();
            let fcs = atk.toGeoJSON();
            let list = setupFeatureCollectionList(fcs);
            let finishbutton=setupFinalize('Save data','Local storage key:',getFileName(),true)
            finishbutton.addEventListener('click',function(){
                let toSave=Array.from(list.querySelectorAll('input:checked')).map(function(cb){
                    return datastore.get(cb, 'fc');
                });
                let txt = JSON.stringify(toSave);
                let filename=this.getAttribute('data-label');
                window.localStorage.setItem(filename,txt);
            })
        }
        /**
         * Sets up the finalize button for performing actions and handling local storage. This function configures the finalize button,
         * allowing users to specify a label or key and checks for local storage availability.
         * @private
         * @param {string} buttonText - The text to display on the button.
         * @param {string} editableLabel - The label for the editable content.
         * @param {string} editableContent - The initial content for the editable content.
         * @param {boolean} localstorage - Whether to test for local storage.
         * @returns {jQuery} The finish button element.
         */
        function setupFinalize(buttonText,editableLabel,editableContent,localstorage){
            function testLocalstorage(localstorage, text, div){
                if(localstorage) Object.keys(localStorage).includes(text) ? div.classList.add('key-exists') : div.classList.remove('key-exists');
            }
            const finalize=_this.element.querySelector('.finalize');
            const finishButton = document.createElement('button');
            finishButton.innerText = buttonText;
            finalize.appendChild(finishButton);

            let ec;
            if(editableLabel){
                const div = document.createElement('div');
                const div2 = document.createElement('div');
                div.appendChild(div2);
                finalize.appendChild(div);
                div2.innerText = editableLabel;

                ec = new EditableContent();
                ec.setText(editableContent);
                div.appendChild(ec.element);
                if(localstorage) div.classList.add('localstorage-key-test');
                ec.onChanged = (text)=>{
                    finishButton.setAttribute('data-label',text);
                    testLocalstorage(localstorage, text, div);
                }
                testLocalstorage(localstorage, editableContent, div);
            }
            finalize.appendChild(finishButton);
            finishButton.setAttribute('data-label',editableContent);
            
            return finishButton;
        }
        /**
         * Returns the HTML for the file dialog. This function generates the HTML markup for the file dialog, including the buttons and feature collection list.
         * @private
         * @returns {string} The HTML for the file dialog.
         */
        function fileDialogHtml(){
            return `
                <div class="annotation-ui-filedialog" title="Save and Load Feature Collections">
                    <div class="file-actions">
                        <div class='header'>1. Available actions</div>
                        <button class='btn' data-action='geojson-load'>Load GeoJSON</button>
                        <button class='btn' data-action='ls-load'>Load from browser</button>
                        <hr>
                        <button class='btn' data-action='geojson-save'>Save GeoJSON</button>
                        <button class='btn' data-action='svg-export'>Export as SVG</button>
                        <button class='btn' data-action='png-export'>Rasterize to PNG</button>
                        <button class='btn' data-action='ls-store'>Store in browser</button>
                    </div>
                    <div class='featurecollection-selection'>
                        <div class='header'>2. Select Feature Collections</div>
                        <div class='featurecollection-list'></div>
                    </div>
                    <div class="finalize-panel">
                        <div class='header'>3. Finalize</div>
                        <div class='finalize'>
                        
                        </div>
                    </div>
                </div>`;
        }
    }
    /**
     * Shows the file dialog.
     */
    show(){
        // this.element.dialog('open');
        this.dialog.show();
    }
    /**
     * Hides the file dialog.
     */
    hide(){
        // this.element.dialog('close');
        this.dialog.hide();
    }
    /**
     * Toggles the visibility of the file dialog.
     */
    toggle(){
        // this.element.dialog('isOpen') ? this.element.dialog('close') : this.element.dialog('open');
        this.dialog.toggle();
    }
    /**
     * Calls a method on the dialog element.
     * @param {...any} args - The arguments to pass to the method.
     */
    // dialog(...args){
    //     this.element.dialog(...args)
    // }
}

export {FileDialog};