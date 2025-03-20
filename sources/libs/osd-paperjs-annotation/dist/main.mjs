/******/ var __webpack_modules__ = ({

/***/ 946:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
.annotation-ui-noselect{
    user-select:none;
}
.ui-dialog{
    font-size:14px;
}
.ui-dialog, .ui-dialog-content {
    box-sizing: content-box;
}
.flex-row{
    display:flex;
    flex-direction:row;
}
.annotation-ui-mainwindow .templates{
    display:none;
}
.annotation-ui-mainwindow{
    height:100%;
    width:16em;
    min-width:12em;
    color:black;
    overflow:hidden;
    display:grid;
    grid-template-rows: auto auto minmax(4em, 1fr) auto;
    border:thin gray solid;
    padding:2px;
    box-sizing:border-box;
}
.annotation-visibility-controls{
    display:flex;
    flex-grow:0;
    flex-shrink:0;
    border-bottom:thin gray solid;
    padding-bottom:2px;
    margin-bottom:2px;
}
.annotation-visibility-controls .visibility-buttons{
    flex-grow:0;
    display:flex;
    margin-right:5px;
}
.annotation-visibility-controls .annotation-opacity-container{
    flex-grow:1;
}
.annotation-ui-mainwindow button.btn{
    padding:0 3px;
}
.file-button{
    padding:0.1em 0.5em;
    margin-right:0.3em;
}
.annotation-ui label{
    margin:0;
}
.annotation-ui-feature-collections{
    overflow:auto;
    border-bottom:thin gray solid;
}
.annotation-ui-feature-collections:empty::before {
    content: 'Click below to begin a new feature collection';
    color: gray;
}
.feature-collection{
    border: thin transparent solid;
    padding:2px;
    opacity:0.1;
}
.annotation-ui-feature-collections .feature-collection{
    transition: opacity 1s;
}
.annotation-ui-feature-collections .feature-collection.inserted:not(.trashed):not(.draganddrop-dragging){
    opacity:1;
}
.annotation-ui-feature-collections .feature-collection:not(.trashed).selected{
    border:thin black solid;
    background-color:azure;
} 
.annotation-ui-feature-collections
    .feature-collection:not(.trashed,.annotation-hidden,.selected):hover, 
    .feature-collection.svg-hovered:not(.trashed):not(.annotation-hidden){
    background-color:lightgoldenrodyellow;
    border:thin black solid;
}
.feature-collection.annotation-hidden [data-action="hide"]{
    display:none;
}
.feature-collection:not(.annotation-hidden) [data-action="show"]{
    display:none;
}
.feature-collection.annotation-hidden .features{
    pointer-events:none;
    opacity:50%;
}
.annotation-ui-feature-collections .name{
    font-weight:bold;
}
.annotation-details{
    flex-grow:1;
}
.feature-item{
    margin-left:1em;
}

.feature-collection [data-action], .feature [data-action]{
    margin-left:0.2em;
}
.hoverable-actions:not(:hover) .onhover{
    visibility:hidden;
}
.hoverable-actions:hover .editablecontent .onhover {
    visibility:visible;
}
.feature-collection.trashed{
    background-color:darkred;
    opacity:0.3;
    pointer-events:none;
}
.annotation-header{
    display:grid;
    grid-template-columns:auto 1fr auto auto auto;
}
.feature-collection.trashed .annotation-header [data-action="trash"]{
    pointer-events:all;
    visibility:visible;
}
.feature-collection .toggle-list{
    flex-grow:0
}
.feature-collection .features{
    flex-grow:1;
}
.features.collapsed .features-list{
    display:none;
}
.features:not(.collapsed) .features-summary{
    display:none;
}
.features.collapsed [data-action="collapse-up"]{
    display:none;
}
.features:not(.collapsed) [data-action="collapse-down"]{
    display:none;
}
.features-summary:not([data-num-elements="1"]) .pluralize::before{
    content:'s';
}
.feature.selected{
    background-color:green;
}
.feature{
    cursor:default;
}
.annotation-ui-mainwindow.disabled .disable-when-annotations-hidden{
    opacity:0.5;
    pointer-events:none;
    cursor:not-allowed;
}
.annotation-ui-mainwindow.deactivated .disable-when-deactivated{
    opacity:0.5;
    pointer-events:none;
    cursor:not-allowed;
}

.annotation-ui-grid{
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    width: 100%;
    height: 100%;
    background-color:white;
}
.annotation-ui-grid .center{
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    position:relative;
    z-index:0; /* reset the z-index basis for this container so children can be manipulated independently of siblings */
}
.annotation-ui-grid .top {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    text-align:center;
    border-bottom:thin gray solid;
}
.annotation-ui-grid .bottom {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
}
.annotation-ui-grid .left {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
}
.annotation-ui-grid .right {
    grid-column: 3 / 4;
    grid-row: 1 / 4;
    position:relative;
}
.annotation-ui-grid .resize-right{
    width: 15px;
    left: -15px;
    position: absolute;
    background-color: rgb(196, 196, 196);
    cursor: grab;
    text-align:center;
    user-select:none;
    top:50%;
    transform: translate(0, -50%);
    padding:10px 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.annotation-ui-grid .resize-right::before{
    content:'||';
}
.annotation-ui-grid .resize-right.resizing{
    cursor:grabbing;
}
.annotation-ui-grid .right:not(:hover) .resize-right{
    display:none;
}

.annotation-ui-drawing-toolbar .pseudohidden, .annotation-ui-drawing-toolbar .invisible{
    visibility:hidden;
    width: 0;
    height: 0;
    overflow: hidden;
    padding:0;
    border:none;
}
.annotation-ui-drawing-toolbar{
    background-color:lightgray;
    display: inline-block;
    max-width:100%;
    text-align:left;
}
.annotation-ui-drawing-toolbar button[disabled]{
    pointer-events:none;
    cursor:not-allowed;
    border:thin solid transparent;
}
.annotation-ui-drawing-toolbar button:not([disabled]){
    border:thin rgb(195, 195, 195) solid;
}
.annotation-ui-drawing-toolbar button:not([disabled]):hover{
    border:thin rgb(41, 41, 41) solid;
    z-index:2;
}
.annotation-ui-drawing-toolbar .dropdowns>*:not(.active){
    display:none;
}
.annotation-ui-buttonbar>.btn.active{
    color:black;
    background-color:darkgray;
}
.annotation-ui-buttonbar>.btn:not(.active){
    color:rgb(62, 62, 62);
    background-color:lightgrey;
}
.dropdowns-container{
    position:relative;
    background-color:inherit;
}
.dropdowns{
    color:black;
    position:absolute;
    background-color:inherit;
    min-width:100%;
}
.dropdown{
    width:100%;
    display:grid;
    vertical-align: middle;
    column-gap:1em;
    grid-template-columns:auto;
}
/* brush-toolbar styles */
.dropdown.brush-toolbar{
    grid-template-columns: auto 1fr auto auto;    
}
/* end brush-toolbar styles */

/* polygon-toolbar styles */
.dropdown.polygon-toolbar{
    grid-template-columns: 1fr auto auto auto auto auto;    
}
.dropdown.polygon-toolbar button[data-action="simplify"]{
    margin-right:0.2em;
}
/* end polygon-toolbar styles */

/* linestring-toolbar styles */
.dropdown.linestring-toolbar{
    grid-template-columns: auto 1fr auto auto;
}
/* end linestring-toolbar styles */
canvas.selectable-layer{
    cursor:pointer;
}
canvas.point-tool-grab{
    cursor:grab;
}
canvas.point-tool-grabbing{
    cursor:grabbing;
}
canvas.rectangle-tool-move{
    cursor: move;
}
canvas.rectangle-tool-resize{
    cursor:nesw-resize;
}
canvas.transform-tool-move{
    cursor: move;
}
canvas.transform-tool-resize{
    cursor:nesw-resize;
}
canvas.transform-tool-rotate{
    cursor: pointer;
}
.tool-action[data-tool-action="segment"]{
    cursor:move;
}
.tool-action[data-tool-action="stroke"]{
    cursor:copy;
}
.tool-action[data-tool-action="segment-erase"]{
    cursor:not-allowed;
}
.tool-action[data-tool-action="colorpicker"]{
    cursor:none;
}

/* wand-toolbar styles */
.dropdown.wand-toolbar{
    grid-template-columns: 5em 1fr auto auto;
}

.wand-toolbar .threshold-container{
    display:flex;
    flex-direction:column;
}
.wand-toolbar .threshold-container label, .wand-toolbar .label{
    margin-bottom:0;
    font-size:0.8em;
}
/* .wand-toolbar .toggle .btn{
    padding:auto 4px;
    line-height:1;
} */
/* .wand-toolbar .toggle.btn-primary{
    margin-bottom:0;
} */
.wand-toolbar .toggles{
    display:grid;
    column-gap:2px;
    grid-template-columns:7em 5em 8em;
}
.wand-toolbar .option-toggle{
    display:grid;
    grid-template-rows:auto auto;
    cursor: pointer;
    user-select: none;
    -webkit-user-select:none;
}
.wand-toolbar .option-toggle:hover .option{
    background-color:darkgray;
}
.wand-toolbar .option-toggle .option:not(.selected){
    display:none;
}
/* End wand-toolbar styles */

.viewer-controls-topleft{
    display:flex;
}

/* style-toolbar styles */

.style-toolbar .style-row{
    display:grid;
    grid-template-columns:auto auto auto auto;
    column-gap:0.5em;
    align-items:center;
}
.style-toolbar .style-item{
    display:inline-block;
    width:7em;
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding-left:0.5em;
    cursor:pointer;
}
.style-toolbar .style-item.selected{
    outline:medium lightskyblue solid;
}
.style-toolbar .hierarchy-up{
    cursor:pointer;
    padding:0 0.5em;
}
.style-toolbar input[type="number"]{
    width:3.5em;
}
.style-toolbar .colorpicker-row.hidden{
    display:none;
}
.style-toolbar .colorpicker-row{
    display:grid;
    grid-template-columns:repeat(4,auto)
}
.style-toolbar .preview{
    position:relative;
    display:block;
    background: repeating-conic-gradient(#d0d0d0 0% 25%, white 0% 50%) 
              50% / 20px 20px
}
.style-toolbar .preview::after{
    /* This is just so the height is set correctly since children are absolute positioned */
    content:'Preview';
    visibility:hidden;
}
.style-toolbar .preview .bg{
    display:block;
    position:absolute;
    outline:thin solid black;
    top:0;
    left:0;
    bottom:0;
    right:0;
}
.style-toolbar .preview .text{
    display:block;
    position:absolute;
    padding:0 0.2em;
}
.style-toolbar input[type="range"]{
    display:inline-block;
}

/* end style-toolbar styles */


.new-feature,.new-feature-collection{
    cursor:pointer;
}
.new-feature:hover,.new-feature-collection:hover{
    background-color:antiquewhite;
    outline:thin gray solid;
}
/* Annotation UI File Dialog Styles*/
.annotation-ui-filedialog{
    display:grid;
    grid-template-columns: auto auto auto;
}
.annotation-ui-filedialog>div{
    padding: 0 0.3em;
}
.annotation-ui-filedialog .featurecollection-selection{
    border-right:thin gray solid;
    border-left:thin gray solid;
    width:15em;
    overflow-x:hidden;
}
.annotation-ui-filedialog .featurecollection-list{
    display:flex;
    flex-direction:column;
    overflow:auto;
}
.annotation-ui-filedialog .localstorage-key-list::before{
    content:'Saved in local storage:';
    display:block;
    color:gray;
}
.annotation-ui-filedialog .localstorage-key-list:empty::after{
    content:'No items were found in local storage';
    font-style:italic;
    color:gray;
}
.annotation-ui-filedialog .localstorage-key{
    cursor:pointer;
}
.annotation-ui-filedialog .localstorage-key:hover{
    background-color:lightgoldenrodyellow;
}
.annotation-ui-filedialog .localstorage-key-test.key-exists::after{
    content: '(overwrite)';
    font-weight:bold;
    background-color:rgb(190, 99, 66);
    color:white;
    padding:0 0.2em;
}
.annotation-ui-filedialog .finalize-panel{
    width:15em;
    overflow-x:hidden;
}
.annotation-ui-filedialog .header{
    white-space: nowrap;
    border-bottom:thin gray solid;
    padding-bottom:2px;
    margin-bottom:2px;
}
.annotation-ui-filedialog button{
    display:block;
}

.annotation-ui-filedialog .file-actions{
    display:flex;
    flex-direction:column;
}
.annotation-ui-filedialog .file-actions hr{
    margin: 5px 0;
}

button[disabled]{
    opacity:0.3;
}

.dropdown button[data-action="erase"].active{
    background-color:rgb(187, 86, 86);

}
.feature .bounding-element{
    margin-right:-1.2em;
}
.feature .bounding-element:not(.active){
    visibility:visible;
    color:lightgray;
}
.feature .bounding-element.active{
    visibility:visible;
    color:black;
}
.feature:not(:hover) .bounding-element:not(.active){
    visibility:hidden;
}

.hidden{
    display:none;
}

.draganddrop-dragging{
    opacity:0.3;
}
.draganddrop-hide{
    display:none;
}
.draganddrop-drop-target{
    outline:thick rgb(112, 111, 111) solid;
}
.draganddrop-drop-target:hover{
    outline-color:black;
}
.draganddrop-drop-target>*>*{
    pointer-events:none;
}
.draganddrop-placeholder{
    border: thin black solid;
    border-radius:2px;
}
.draganddrop-placeholder>*{
    visibility:hidden;
}

/* From bootstrap */
input[type=range] {
    display: block;
    width: 100%;
}
.btn {
    display: inline-block;
    padding: 2px 8px;
    margin-bottom: 0;
    font-size: 14px;
    /* font-weight: 400; */
    /* line-height: 1.42857143; */
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    /* -ms-touch-action: manipulation;
    touch-action: manipulation; */
    cursor: pointer;
    /* -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none; */
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    /* border-radius: 4px; */
}
.btn.btn-sm{
    font-size:12px;
}

.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
}
/* Items with [data-action] are supposed to be clickable but if the sub-object gets the click it doesn't work, so stop pointer events on children */
[data-action]>*{
    pointer-events:none;
}

.rotate-by{
    transform:rotate(var(--rotate-angle));
}`, "",{"version":3,"sources":["webpack://./src/css/annotationui.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;EAoCE;AACF;IACI,gBAAgB;AACpB;AACA;IACI,cAAc;AAClB;AACA;IACI,uBAAuB;AAC3B;AACA;IACI,YAAY;IACZ,kBAAkB;AACtB;AACA;IACI,YAAY;AAChB;AACA;IACI,WAAW;IACX,UAAU;IACV,cAAc;IACd,WAAW;IACX,eAAe;IACf,YAAY;IACZ,mDAAmD;IACnD,sBAAsB;IACtB,WAAW;IACX,qBAAqB;AACzB;AACA;IACI,YAAY;IACZ,WAAW;IACX,aAAa;IACb,6BAA6B;IAC7B,kBAAkB;IAClB,iBAAiB;AACrB;AACA;IACI,WAAW;IACX,YAAY;IACZ,gBAAgB;AACpB;AACA;IACI,WAAW;AACf;AACA;IACI,aAAa;AACjB;AACA;IACI,mBAAmB;IACnB,kBAAkB;AACtB;AACA;IACI,QAAQ;AACZ;AACA;IACI,aAAa;IACb,6BAA6B;AACjC;AACA;IACI,wDAAwD;IACxD,WAAW;AACf;AACA;IACI,8BAA8B;IAC9B,WAAW;IACX,WAAW;AACf;AACA;IACI,sBAAsB;AAC1B;AACA;IACI,SAAS;AACb;AACA;IACI,uBAAuB;IACvB,sBAAsB;AAC1B;AACA;;;IAGI,qCAAqC;IACrC,uBAAuB;AAC3B;AACA;IACI,YAAY;AAChB;AACA;IACI,YAAY;AAChB;AACA;IACI,mBAAmB;IACnB,WAAW;AACf;AACA;IACI,gBAAgB;AACpB;AACA;IACI,WAAW;AACf;AACA;IACI,eAAe;AACnB;;AAEA;IACI,iBAAiB;AACrB;AACA;IACI,iBAAiB;AACrB;AACA;IACI,kBAAkB;AACtB;AACA;IACI,wBAAwB;IACxB,WAAW;IACX,mBAAmB;AACvB;AACA;IACI,YAAY;IACZ,6CAA6C;AACjD;AACA;IACI,kBAAkB;IAClB,kBAAkB;AACtB;AACA;IACI;AACJ;AACA;IACI,WAAW;AACf;AACA;IACI,YAAY;AAChB;AACA;IACI,YAAY;AAChB;AACA;IACI,YAAY;AAChB;AACA;IACI,YAAY;AAChB;AACA;IACI,WAAW;AACf;AACA;IACI,sBAAsB;AAC1B;AACA;IACI,cAAc;AAClB;AACA;IACI,WAAW;IACX,mBAAmB;IACnB,kBAAkB;AACtB;AACA;IACI,WAAW;IACX,mBAAmB;IACnB,kBAAkB;AACtB;;AAEA;IACI,aAAa;IACb,iCAAiC;IACjC,oCAAoC;IACpC,WAAW;IACX,YAAY;IACZ,sBAAsB;AAC1B;AACA;IACI,kBAAkB;IAClB,eAAe;IACf,iBAAiB;IACjB,SAAS,EAAE,wGAAwG;AACvH;AACA;IACI,kBAAkB;IAClB,eAAe;IACf,iBAAiB;IACjB,6BAA6B;AACjC;AACA;IACI,kBAAkB;IAClB,eAAe;AACnB;AACA;IACI,kBAAkB;IAClB,eAAe;AACnB;AACA;IACI,kBAAkB;IAClB,eAAe;IACf,iBAAiB;AACrB;AACA;IACI,WAAW;IACX,WAAW;IACX,kBAAkB;IAClB,oCAAoC;IACpC,YAAY;IACZ,iBAAiB;IACjB,gBAAgB;IAChB,OAAO;IACP,6BAA6B;IAC7B,cAAc;IACd,2BAA2B;IAC3B,8BAA8B;AAClC;AACA;IACI,YAAY;AAChB;AACA;IACI,eAAe;AACnB;AACA;IACI,YAAY;AAChB;;AAEA;IACI,iBAAiB;IACjB,QAAQ;IACR,SAAS;IACT,gBAAgB;IAChB,SAAS;IACT,WAAW;AACf;AACA;IACI,0BAA0B;IAC1B,qBAAqB;IACrB,cAAc;IACd,eAAe;AACnB;AACA;IACI,mBAAmB;IACnB,kBAAkB;IAClB,6BAA6B;AACjC;AACA;IACI,oCAAoC;AACxC;AACA;IACI,iCAAiC;IACjC,SAAS;AACb;AACA;IACI,YAAY;AAChB;AACA;IACI,WAAW;IACX,yBAAyB;AAC7B;AACA;IACI,qBAAqB;IACrB,0BAA0B;AAC9B;AACA;IACI,iBAAiB;IACjB,wBAAwB;AAC5B;AACA;IACI,WAAW;IACX,iBAAiB;IACjB,wBAAwB;IACxB,cAAc;AAClB;AACA;IACI,UAAU;IACV,YAAY;IACZ,sBAAsB;IACtB,cAAc;IACd,0BAA0B;AAC9B;AACA,yBAAyB;AACzB;IACI,yCAAyC;AAC7C;AACA,6BAA6B;;AAE7B,2BAA2B;AAC3B;IACI,mDAAmD;AACvD;AACA;IACI,kBAAkB;AACtB;AACA,+BAA+B;;AAE/B,8BAA8B;AAC9B;IACI,yCAAyC;AAC7C;AACA,kCAAkC;AAClC;IACI,cAAc;AAClB;AACA;IACI,WAAW;AACf;AACA;IACI,eAAe;AACnB;AACA;IACI,YAAY;AAChB;AACA;IACI,kBAAkB;AACtB;AACA;IACI,YAAY;AAChB;AACA;IACI,kBAAkB;AACtB;AACA;IACI,eAAe;AACnB;AACA;IACI,WAAW;AACf;AACA;IACI,WAAW;AACf;AACA;IACI,kBAAkB;AACtB;AACA;IACI,WAAW;AACf;;AAEA,wBAAwB;AACxB;IACI,wCAAwC;AAC5C;;AAEA;IACI,YAAY;IACZ,qBAAqB;AACzB;AACA;IACI,eAAe;IACf,eAAe;AACnB;AACA;;;GAGG;AACH;;GAEG;AACH;IACI,YAAY;IACZ,cAAc;IACd,iCAAiC;AACrC;AACA;IACI,YAAY;IACZ,4BAA4B;IAC5B,eAAe;IACf,iBAAiB;IACjB,wBAAwB;AAC5B;AACA;IACI,yBAAyB;AAC7B;AACA;IACI,YAAY;AAChB;AACA,4BAA4B;;AAE5B;IACI,YAAY;AAChB;;AAEA,yBAAyB;;AAEzB;IACI,YAAY;IACZ,yCAAyC;IACzC,gBAAgB;IAChB,kBAAkB;AACtB;AACA;IACI,oBAAoB;IACpB,SAAS;IACT,mBAAmB;IACnB,eAAe;IACf,sBAAsB;IACtB,kBAAkB;IAClB,cAAc;AAClB;AACA;IACI,iCAAiC;AACrC;AACA;IACI,cAAc;IACd,eAAe;AACnB;AACA;IACI,WAAW;AACf;AACA;IACI,YAAY;AAChB;AACA;IACI,YAAY;IACZ;AACJ;AACA;IACI,iBAAiB;IACjB,aAAa;IACb;;AAEJ;AACA;IACI,uFAAuF;IACvF,iBAAiB;IACjB,iBAAiB;AACrB;AACA;IACI,aAAa;IACb,iBAAiB;IACjB,wBAAwB;IACxB,KAAK;IACL,MAAM;IACN,QAAQ;IACR,OAAO;AACX;AACA;IACI,aAAa;IACb,iBAAiB;IACjB,eAAe;AACnB;AACA;IACI,oBAAoB;AACxB;;AAEA,6BAA6B;;;AAG7B;IACI,cAAc;AAClB;AACA;IACI,6BAA6B;IAC7B,uBAAuB;AAC3B;AACA,oCAAoC;AACpC;IACI,YAAY;IACZ,qCAAqC;AACzC;AACA;IACI,gBAAgB;AACpB;AACA;IACI,4BAA4B;IAC5B,2BAA2B;IAC3B,UAAU;IACV,iBAAiB;AACrB;AACA;IACI,YAAY;IACZ,qBAAqB;IACrB,aAAa;AACjB;AACA;IACI,iCAAiC;IACjC,aAAa;IACb,UAAU;AACd;AACA;IACI,8CAA8C;IAC9C,iBAAiB;IACjB,UAAU;AACd;AACA;IACI,cAAc;AAClB;AACA;IACI,qCAAqC;AACzC;AACA;IACI,sBAAsB;IACtB,gBAAgB;IAChB,iCAAiC;IACjC,WAAW;IACX,eAAe;AACnB;AACA;IACI,UAAU;IACV,iBAAiB;AACrB;AACA;IACI,mBAAmB;IACnB,6BAA6B;IAC7B,kBAAkB;IAClB,iBAAiB;AACrB;AACA;IACI,aAAa;AACjB;;AAEA;IACI,YAAY;IACZ,qBAAqB;AACzB;AACA;IACI,aAAa;AACjB;;AAEA;IACI,WAAW;AACf;;AAEA;IACI,iCAAiC;;AAErC;AACA;IACI,mBAAmB;AACvB;AACA;IACI,kBAAkB;IAClB,eAAe;AACnB;AACA;IACI,kBAAkB;IAClB,WAAW;AACf;AACA;IACI,iBAAiB;AACrB;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,WAAW;AACf;AACA;IACI,YAAY;AAChB;AACA;IACI,sCAAsC;AAC1C;AACA;IACI,mBAAmB;AACvB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,wBAAwB;IACxB,iBAAiB;AACrB;AACA;IACI,iBAAiB;AACrB;;AAEA,mBAAmB;AACnB;IACI,cAAc;IACd,WAAW;AACf;AACA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,gBAAgB;IAChB,eAAe;IACf,sBAAsB;IACtB,6BAA6B;IAC7B,kBAAkB;IAClB,mBAAmB;IACnB,sBAAsB;IACtB;iCAC6B;IAC7B,eAAe;IACf;;4BAEwB;IACxB,iBAAiB;IACjB,sBAAsB;IACtB,6BAA6B;IAC7B,wBAAwB;AAC5B;AACA;IACI,cAAc;AAClB;;AAEA;IACI,UAAU;IACV,WAAW;IACX,wBAAwB;AAC5B;AACA,mJAAmJ;AACnJ;IACI,mBAAmB;AACvB;;AAEA;IACI,qCAAqC;AACzC","sourcesContent":["/**\n * OpenSeadragon paperjs overlay plugin based on paper.js\n * @version 0.4.13\n * \n * Includes additional open source libraries which are subject to copyright notices\n * as indicated accompanying those segments of code.\n * \n * Original code:\n * Copyright (c) 2022-2024, Thomas Pearce\n * All rights reserved.\n * \n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are met:\n * \n * * Redistributions of source code must retain the above copyright notice, this\n *   list of conditions and the following disclaimer.\n * \n * * Redistributions in binary form must reproduce the above copyright notice,\n *   this list of conditions and the following disclaimer in the documentation\n *   and/or other materials provided with the distribution.\n * \n * * Neither the name of osd-paperjs-annotation nor the names of its\n *   contributors may be used to endorse or promote products derived from\n *   this software without specific prior written permission.\n * \n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\n * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\n * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\n * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\n * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\n * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n * \n */\n.annotation-ui-noselect{\n    user-select:none;\n}\n.ui-dialog{\n    font-size:14px;\n}\n.ui-dialog, .ui-dialog-content {\n    box-sizing: content-box;\n}\n.flex-row{\n    display:flex;\n    flex-direction:row;\n}\n.annotation-ui-mainwindow .templates{\n    display:none;\n}\n.annotation-ui-mainwindow{\n    height:100%;\n    width:16em;\n    min-width:12em;\n    color:black;\n    overflow:hidden;\n    display:grid;\n    grid-template-rows: auto auto minmax(4em, 1fr) auto;\n    border:thin gray solid;\n    padding:2px;\n    box-sizing:border-box;\n}\n.annotation-visibility-controls{\n    display:flex;\n    flex-grow:0;\n    flex-shrink:0;\n    border-bottom:thin gray solid;\n    padding-bottom:2px;\n    margin-bottom:2px;\n}\n.annotation-visibility-controls .visibility-buttons{\n    flex-grow:0;\n    display:flex;\n    margin-right:5px;\n}\n.annotation-visibility-controls .annotation-opacity-container{\n    flex-grow:1;\n}\n.annotation-ui-mainwindow button.btn{\n    padding:0 3px;\n}\n.file-button{\n    padding:0.1em 0.5em;\n    margin-right:0.3em;\n}\n.annotation-ui label{\n    margin:0;\n}\n.annotation-ui-feature-collections{\n    overflow:auto;\n    border-bottom:thin gray solid;\n}\n.annotation-ui-feature-collections:empty::before {\n    content: 'Click below to begin a new feature collection';\n    color: gray;\n}\n.feature-collection{\n    border: thin transparent solid;\n    padding:2px;\n    opacity:0.1;\n}\n.annotation-ui-feature-collections .feature-collection{\n    transition: opacity 1s;\n}\n.annotation-ui-feature-collections .feature-collection.inserted:not(.trashed):not(.draganddrop-dragging){\n    opacity:1;\n}\n.annotation-ui-feature-collections .feature-collection:not(.trashed).selected{\n    border:thin black solid;\n    background-color:azure;\n} \n.annotation-ui-feature-collections\n    .feature-collection:not(.trashed,.annotation-hidden,.selected):hover, \n    .feature-collection.svg-hovered:not(.trashed):not(.annotation-hidden){\n    background-color:lightgoldenrodyellow;\n    border:thin black solid;\n}\n.feature-collection.annotation-hidden [data-action=\"hide\"]{\n    display:none;\n}\n.feature-collection:not(.annotation-hidden) [data-action=\"show\"]{\n    display:none;\n}\n.feature-collection.annotation-hidden .features{\n    pointer-events:none;\n    opacity:50%;\n}\n.annotation-ui-feature-collections .name{\n    font-weight:bold;\n}\n.annotation-details{\n    flex-grow:1;\n}\n.feature-item{\n    margin-left:1em;\n}\n\n.feature-collection [data-action], .feature [data-action]{\n    margin-left:0.2em;\n}\n.hoverable-actions:not(:hover) .onhover{\n    visibility:hidden;\n}\n.hoverable-actions:hover .editablecontent .onhover {\n    visibility:visible;\n}\n.feature-collection.trashed{\n    background-color:darkred;\n    opacity:0.3;\n    pointer-events:none;\n}\n.annotation-header{\n    display:grid;\n    grid-template-columns:auto 1fr auto auto auto;\n}\n.feature-collection.trashed .annotation-header [data-action=\"trash\"]{\n    pointer-events:all;\n    visibility:visible;\n}\n.feature-collection .toggle-list{\n    flex-grow:0\n}\n.feature-collection .features{\n    flex-grow:1;\n}\n.features.collapsed .features-list{\n    display:none;\n}\n.features:not(.collapsed) .features-summary{\n    display:none;\n}\n.features.collapsed [data-action=\"collapse-up\"]{\n    display:none;\n}\n.features:not(.collapsed) [data-action=\"collapse-down\"]{\n    display:none;\n}\n.features-summary:not([data-num-elements=\"1\"]) .pluralize::before{\n    content:'s';\n}\n.feature.selected{\n    background-color:green;\n}\n.feature{\n    cursor:default;\n}\n.annotation-ui-mainwindow.disabled .disable-when-annotations-hidden{\n    opacity:0.5;\n    pointer-events:none;\n    cursor:not-allowed;\n}\n.annotation-ui-mainwindow.deactivated .disable-when-deactivated{\n    opacity:0.5;\n    pointer-events:none;\n    cursor:not-allowed;\n}\n\n.annotation-ui-grid{\n    display: grid;\n    grid-template-rows: auto 1fr auto;\n    grid-template-columns: auto 1fr auto;\n    width: 100%;\n    height: 100%;\n    background-color:white;\n}\n.annotation-ui-grid .center{\n    grid-column: 2 / 3;\n    grid-row: 2 / 3;\n    position:relative;\n    z-index:0; /* reset the z-index basis for this container so children can be manipulated independently of siblings */\n}\n.annotation-ui-grid .top {\n    grid-column: 1 / 3;\n    grid-row: 1 / 2;\n    text-align:center;\n    border-bottom:thin gray solid;\n}\n.annotation-ui-grid .bottom {\n    grid-column: 1 / 3;\n    grid-row: 3 / 4;\n}\n.annotation-ui-grid .left {\n    grid-column: 1 / 2;\n    grid-row: 2 / 3;\n}\n.annotation-ui-grid .right {\n    grid-column: 3 / 4;\n    grid-row: 1 / 4;\n    position:relative;\n}\n.annotation-ui-grid .resize-right{\n    width: 15px;\n    left: -15px;\n    position: absolute;\n    background-color: rgb(196, 196, 196);\n    cursor: grab;\n    text-align:center;\n    user-select:none;\n    top:50%;\n    transform: translate(0, -50%);\n    padding:10px 0;\n    border-top-left-radius: 5px;\n    border-bottom-left-radius: 5px;\n}\n.annotation-ui-grid .resize-right::before{\n    content:'||';\n}\n.annotation-ui-grid .resize-right.resizing{\n    cursor:grabbing;\n}\n.annotation-ui-grid .right:not(:hover) .resize-right{\n    display:none;\n}\n\n.annotation-ui-drawing-toolbar .pseudohidden, .annotation-ui-drawing-toolbar .invisible{\n    visibility:hidden;\n    width: 0;\n    height: 0;\n    overflow: hidden;\n    padding:0;\n    border:none;\n}\n.annotation-ui-drawing-toolbar{\n    background-color:lightgray;\n    display: inline-block;\n    max-width:100%;\n    text-align:left;\n}\n.annotation-ui-drawing-toolbar button[disabled]{\n    pointer-events:none;\n    cursor:not-allowed;\n    border:thin solid transparent;\n}\n.annotation-ui-drawing-toolbar button:not([disabled]){\n    border:thin rgb(195, 195, 195) solid;\n}\n.annotation-ui-drawing-toolbar button:not([disabled]):hover{\n    border:thin rgb(41, 41, 41) solid;\n    z-index:2;\n}\n.annotation-ui-drawing-toolbar .dropdowns>*:not(.active){\n    display:none;\n}\n.annotation-ui-buttonbar>.btn.active{\n    color:black;\n    background-color:darkgray;\n}\n.annotation-ui-buttonbar>.btn:not(.active){\n    color:rgb(62, 62, 62);\n    background-color:lightgrey;\n}\n.dropdowns-container{\n    position:relative;\n    background-color:inherit;\n}\n.dropdowns{\n    color:black;\n    position:absolute;\n    background-color:inherit;\n    min-width:100%;\n}\n.dropdown{\n    width:100%;\n    display:grid;\n    vertical-align: middle;\n    column-gap:1em;\n    grid-template-columns:auto;\n}\n/* brush-toolbar styles */\n.dropdown.brush-toolbar{\n    grid-template-columns: auto 1fr auto auto;    \n}\n/* end brush-toolbar styles */\n\n/* polygon-toolbar styles */\n.dropdown.polygon-toolbar{\n    grid-template-columns: 1fr auto auto auto auto auto;    \n}\n.dropdown.polygon-toolbar button[data-action=\"simplify\"]{\n    margin-right:0.2em;\n}\n/* end polygon-toolbar styles */\n\n/* linestring-toolbar styles */\n.dropdown.linestring-toolbar{\n    grid-template-columns: auto 1fr auto auto;\n}\n/* end linestring-toolbar styles */\ncanvas.selectable-layer{\n    cursor:pointer;\n}\ncanvas.point-tool-grab{\n    cursor:grab;\n}\ncanvas.point-tool-grabbing{\n    cursor:grabbing;\n}\ncanvas.rectangle-tool-move{\n    cursor: move;\n}\ncanvas.rectangle-tool-resize{\n    cursor:nesw-resize;\n}\ncanvas.transform-tool-move{\n    cursor: move;\n}\ncanvas.transform-tool-resize{\n    cursor:nesw-resize;\n}\ncanvas.transform-tool-rotate{\n    cursor: pointer;\n}\n.tool-action[data-tool-action=\"segment\"]{\n    cursor:move;\n}\n.tool-action[data-tool-action=\"stroke\"]{\n    cursor:copy;\n}\n.tool-action[data-tool-action=\"segment-erase\"]{\n    cursor:not-allowed;\n}\n.tool-action[data-tool-action=\"colorpicker\"]{\n    cursor:none;\n}\n\n/* wand-toolbar styles */\n.dropdown.wand-toolbar{\n    grid-template-columns: 5em 1fr auto auto;\n}\n\n.wand-toolbar .threshold-container{\n    display:flex;\n    flex-direction:column;\n}\n.wand-toolbar .threshold-container label, .wand-toolbar .label{\n    margin-bottom:0;\n    font-size:0.8em;\n}\n/* .wand-toolbar .toggle .btn{\n    padding:auto 4px;\n    line-height:1;\n} */\n/* .wand-toolbar .toggle.btn-primary{\n    margin-bottom:0;\n} */\n.wand-toolbar .toggles{\n    display:grid;\n    column-gap:2px;\n    grid-template-columns:7em 5em 8em;\n}\n.wand-toolbar .option-toggle{\n    display:grid;\n    grid-template-rows:auto auto;\n    cursor: pointer;\n    user-select: none;\n    -webkit-user-select:none;\n}\n.wand-toolbar .option-toggle:hover .option{\n    background-color:darkgray;\n}\n.wand-toolbar .option-toggle .option:not(.selected){\n    display:none;\n}\n/* End wand-toolbar styles */\n\n.viewer-controls-topleft{\n    display:flex;\n}\n\n/* style-toolbar styles */\n\n.style-toolbar .style-row{\n    display:grid;\n    grid-template-columns:auto auto auto auto;\n    column-gap:0.5em;\n    align-items:center;\n}\n.style-toolbar .style-item{\n    display:inline-block;\n    width:7em;\n    white-space: nowrap;\n    overflow:hidden;\n    text-overflow:ellipsis;\n    padding-left:0.5em;\n    cursor:pointer;\n}\n.style-toolbar .style-item.selected{\n    outline:medium lightskyblue solid;\n}\n.style-toolbar .hierarchy-up{\n    cursor:pointer;\n    padding:0 0.5em;\n}\n.style-toolbar input[type=\"number\"]{\n    width:3.5em;\n}\n.style-toolbar .colorpicker-row.hidden{\n    display:none;\n}\n.style-toolbar .colorpicker-row{\n    display:grid;\n    grid-template-columns:repeat(4,auto)\n}\n.style-toolbar .preview{\n    position:relative;\n    display:block;\n    background: repeating-conic-gradient(#d0d0d0 0% 25%, white 0% 50%) \n              50% / 20px 20px\n}\n.style-toolbar .preview::after{\n    /* This is just so the height is set correctly since children are absolute positioned */\n    content:'Preview';\n    visibility:hidden;\n}\n.style-toolbar .preview .bg{\n    display:block;\n    position:absolute;\n    outline:thin solid black;\n    top:0;\n    left:0;\n    bottom:0;\n    right:0;\n}\n.style-toolbar .preview .text{\n    display:block;\n    position:absolute;\n    padding:0 0.2em;\n}\n.style-toolbar input[type=\"range\"]{\n    display:inline-block;\n}\n\n/* end style-toolbar styles */\n\n\n.new-feature,.new-feature-collection{\n    cursor:pointer;\n}\n.new-feature:hover,.new-feature-collection:hover{\n    background-color:antiquewhite;\n    outline:thin gray solid;\n}\n/* Annotation UI File Dialog Styles*/\n.annotation-ui-filedialog{\n    display:grid;\n    grid-template-columns: auto auto auto;\n}\n.annotation-ui-filedialog>div{\n    padding: 0 0.3em;\n}\n.annotation-ui-filedialog .featurecollection-selection{\n    border-right:thin gray solid;\n    border-left:thin gray solid;\n    width:15em;\n    overflow-x:hidden;\n}\n.annotation-ui-filedialog .featurecollection-list{\n    display:flex;\n    flex-direction:column;\n    overflow:auto;\n}\n.annotation-ui-filedialog .localstorage-key-list::before{\n    content:'Saved in local storage:';\n    display:block;\n    color:gray;\n}\n.annotation-ui-filedialog .localstorage-key-list:empty::after{\n    content:'No items were found in local storage';\n    font-style:italic;\n    color:gray;\n}\n.annotation-ui-filedialog .localstorage-key{\n    cursor:pointer;\n}\n.annotation-ui-filedialog .localstorage-key:hover{\n    background-color:lightgoldenrodyellow;\n}\n.annotation-ui-filedialog .localstorage-key-test.key-exists::after{\n    content: '(overwrite)';\n    font-weight:bold;\n    background-color:rgb(190, 99, 66);\n    color:white;\n    padding:0 0.2em;\n}\n.annotation-ui-filedialog .finalize-panel{\n    width:15em;\n    overflow-x:hidden;\n}\n.annotation-ui-filedialog .header{\n    white-space: nowrap;\n    border-bottom:thin gray solid;\n    padding-bottom:2px;\n    margin-bottom:2px;\n}\n.annotation-ui-filedialog button{\n    display:block;\n}\n\n.annotation-ui-filedialog .file-actions{\n    display:flex;\n    flex-direction:column;\n}\n.annotation-ui-filedialog .file-actions hr{\n    margin: 5px 0;\n}\n\nbutton[disabled]{\n    opacity:0.3;\n}\n\n.dropdown button[data-action=\"erase\"].active{\n    background-color:rgb(187, 86, 86);\n\n}\n.feature .bounding-element{\n    margin-right:-1.2em;\n}\n.feature .bounding-element:not(.active){\n    visibility:visible;\n    color:lightgray;\n}\n.feature .bounding-element.active{\n    visibility:visible;\n    color:black;\n}\n.feature:not(:hover) .bounding-element:not(.active){\n    visibility:hidden;\n}\n\n.hidden{\n    display:none;\n}\n\n.draganddrop-dragging{\n    opacity:0.3;\n}\n.draganddrop-hide{\n    display:none;\n}\n.draganddrop-drop-target{\n    outline:thick rgb(112, 111, 111) solid;\n}\n.draganddrop-drop-target:hover{\n    outline-color:black;\n}\n.draganddrop-drop-target>*>*{\n    pointer-events:none;\n}\n.draganddrop-placeholder{\n    border: thin black solid;\n    border-radius:2px;\n}\n.draganddrop-placeholder>*{\n    visibility:hidden;\n}\n\n/* From bootstrap */\ninput[type=range] {\n    display: block;\n    width: 100%;\n}\n.btn {\n    display: inline-block;\n    padding: 2px 8px;\n    margin-bottom: 0;\n    font-size: 14px;\n    /* font-weight: 400; */\n    /* line-height: 1.42857143; */\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    /* -ms-touch-action: manipulation;\n    touch-action: manipulation; */\n    cursor: pointer;\n    /* -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none; */\n    user-select: none;\n    background-image: none;\n    border: 1px solid transparent;\n    /* border-radius: 4px; */\n}\n.btn.btn-sm{\n    font-size:12px;\n}\n\n.icon {\n    width: 1em;\n    height: 1em;\n    vertical-align: -0.125em;\n}\n/* Items with [data-action] are supposed to be clickable but if the sub-object gets the click it doesn't work, so stop pointer events on children */\n[data-action]>*{\n    pointer-events:none;\n}\n\n.rotate-by{\n    transform:rotate(var(--rotate-angle));\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 676:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
.editablecontent{
    display:grid;
    grid-template-columns:1fr auto;
}
.editablecontent:not(.editing){
    cursor:default;
}

.editablecontent>.edit-button{
    margin-left:0.2em;
    cursor:pointer;
}
.editablecontent:not(:hover) .onhover{
    visibility:hidden;
}
.editablecontent.editing .text-content{
    display: none;
}
.editablecontent.editing textarea{
    display:block;
}
.editablecontent:not(.editing) textarea{
    display:none;
}

.editablecontent .text-content{
    display:inline-block;
    position:relative;
}
.editablecontent svg *{
    pointer-events: none;
}
.editablecontent textarea{
    resize:none;
    width:100%;
    padding:0;
    margin:0;
    border:none;
    outline:thin black solid;
    font-weight: inherit;
    font-size: inherit;
    font-family: inherit;
}`, "",{"version":3,"sources":["webpack://./src/css/editablecontent.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;EAoCE;AACF;IACI,YAAY;IACZ,8BAA8B;AAClC;AACA;IACI,cAAc;AAClB;;AAEA;IACI,iBAAiB;IACjB,cAAc;AAClB;AACA;IACI,iBAAiB;AACrB;AACA;IACI,aAAa;AACjB;AACA;IACI,aAAa;AACjB;AACA;IACI,YAAY;AAChB;;AAEA;IACI,oBAAoB;IACpB,iBAAiB;AACrB;AACA;IACI,oBAAoB;AACxB;AACA;IACI,WAAW;IACX,UAAU;IACV,SAAS;IACT,QAAQ;IACR,WAAW;IACX,wBAAwB;IACxB,oBAAoB;IACpB,kBAAkB;IAClB,oBAAoB;AACxB","sourcesContent":["/**\n * OpenSeadragon paperjs overlay plugin based on paper.js\n * @version 0.4.13\n * \n * Includes additional open source libraries which are subject to copyright notices\n * as indicated accompanying those segments of code.\n * \n * Original code:\n * Copyright (c) 2022-2024, Thomas Pearce\n * All rights reserved.\n * \n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are met:\n * \n * * Redistributions of source code must retain the above copyright notice, this\n *   list of conditions and the following disclaimer.\n * \n * * Redistributions in binary form must reproduce the above copyright notice,\n *   this list of conditions and the following disclaimer in the documentation\n *   and/or other materials provided with the distribution.\n * \n * * Neither the name of osd-paperjs-annotation nor the names of its\n *   contributors may be used to endorse or promote products derived from\n *   this software without specific prior written permission.\n * \n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\n * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\n * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\n * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\n * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\n * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n * \n */\n.editablecontent{\n    display:grid;\n    grid-template-columns:1fr auto;\n}\n.editablecontent:not(.editing){\n    cursor:default;\n}\n\n.editablecontent>.edit-button{\n    margin-left:0.2em;\n    cursor:pointer;\n}\n.editablecontent:not(:hover) .onhover{\n    visibility:hidden;\n}\n.editablecontent.editing .text-content{\n    display: none;\n}\n.editablecontent.editing textarea{\n    display:block;\n}\n.editablecontent:not(.editing) textarea{\n    display:none;\n}\n\n.editablecontent .text-content{\n    display:inline-block;\n    position:relative;\n}\n.editablecontent svg *{\n    pointer-events: none;\n}\n.editablecontent textarea{\n    resize:none;\n    width:100%;\n    padding:0;\n    margin:0;\n    border:none;\n    outline:thin black solid;\n    font-weight: inherit;\n    font-size: inherit;\n    font-family: inherit;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 354:
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/nonce */
/******/ (() => {
/******/ 	__webpack_require__.nc = undefined;
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  jG: () => (/* reexport */ AnnotationToolbar),
  yV: () => (/* reexport */ AnnotationToolkit),
  YV: () => (/* reexport */ AnnotationUITool),
  ls: () => (/* reexport */ BrushTool),
  Ge: () => (/* reexport */ DefaultTool),
  dH: () => (/* reexport */ EllipseTool),
  fy: () => (/* reexport */ FeatureCollectionUI),
  $_: () => (/* reexport */ FeatureUI),
  fm: () => (/* reexport */ FileDialog),
  Wi: () => (/* reexport */ LayerUI),
  KW: () => (/* reexport */ LinestringTool),
  Cz: () => (/* reexport */ PaperOffset),
  Fv: () => (/* reexport */ PaperOverlay),
  Mf: () => (/* reexport */ PointTextTool),
  L_: () => (/* reexport */ PointTool),
  tD: () => (/* reexport */ PolygonTool),
  Ue: () => (/* reexport */ RasterTool),
  Sk: () => (/* reexport */ RectangleTool),
  M$: () => (/* reexport */ RotationControlOverlay),
  RV: () => (/* reexport */ ScreenshotOverlay),
  HA: () => (/* reexport */ SelectTool),
  wN: () => (/* reexport */ StyleTool),
  YQ: () => (/* reexport */ ToolBase),
  Bg: () => (/* reexport */ TransformTool),
  FY: () => (/* reexport */ WandTool)
});

;// ./src/js/osd-loader.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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

var osd = OpenSeadragon;

;// ./src/js/paperjs.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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

var _paper = paper;

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/css/editablecontent.css
var editablecontent = __webpack_require__(676);
;// ./src/css/editablecontent.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(editablecontent/* default */.A, options);




       /* harmony default export */ const css_editablecontent = (editablecontent/* default */.A && editablecontent/* default */.A.locals ? editablecontent/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/css/annotationui.css
var annotationui = __webpack_require__(946);
;// ./src/css/annotationui.css

      
      
      
      
      
      
      
      
      

var annotationui_options = {};

annotationui_options.styleTagTransform = (styleTagTransform_default());
annotationui_options.setAttributes = (setAttributesWithoutAttributes_default());

      annotationui_options.insert = insertBySelector_default().bind(null, "head");
    
annotationui_options.domAPI = (styleDomAPI_default());
annotationui_options.insertStyleElement = (insertStyleElement_default());

var annotationui_update = injectStylesIntoStyleTag_default()(annotationui/* default */.A, annotationui_options);




       /* harmony default export */ const css_annotationui = (annotationui/* default */.A && annotationui/* default */.A.locals ? annotationui/* default */.A.locals : undefined);

;// ./src/js/importcss.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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



var importedCSS = true;
;// ./src/js/utils/addcss.mjs
/*** IMPORTS FROM imports-loader ***/


/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
var localImportsCompleted = typeof importedCSS !== 'undefined';
/**
 * 
 * A regular expression pattern to check for in existing CSS links in the document, used to avoid duplicating CSS files. If the pattern is found in the document, the new link is not added. For consistency, the pattern is also checked against the url parameter to make sure it will exist in the document after adding the new link. If the pattern is not found in the url, an error is logged to the console and the file is not added
 * test
 * @memberof OSDPaperjsAnnotation#
 * @param {string} url - The URL of the CSS file to add.
 * @param {string} [nameToCheck] - The name pattern to check in the URL. If provided,
 * @returns {void}
 */
function addCSS(url, nameToCheck) {
  if (localImportsCompleted) {
    // console.log('Already imported', url);
    return;
  }
  // convert relative url to absolute

  var currUrl = !url.startsWith('http')
  // ? `${import.meta.url.match(/(.*?)js\/utils\/[^\/]*$/)[1]}css/${url}`
  ? new URL("../../css/".concat(url), "file:///C:/Users/tempacc/Source/Repos/osd-paperjs-annotation/osd-paperjs-annotation/src/js/utils/addcss.mjs").href : url;
  if (nameToCheck) {
    var pattern = "/".concat(nameToCheck, ".(?:min.)?css");
    var urlMatchesPattern = currUrl.match(pattern);
    if (!urlMatchesPattern) {
      console.error("addCSS error: pattern(".concat(pattern, ") not found in url (").concat(currUrl, ")"));
      return;
    }
    var found = Array.from(document.head.getElementsByTagName('link')).filter(function (link) {
      return link.href.match(pattern);
    });
    if (found.length > 0) {
      return;
    }
  }
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = currUrl;
  document.head.appendChild(link);
}

;// ./src/js/papertools/base.mjs
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
var ToolBase = /*#__PURE__*/function () {
  /**
   * Create a new instance of ToolBase.
   * @param {paper.PaperScope} paperScope - The Paper.js PaperScope object.
   * @memberof OSDPaperjsAnnotation.ToolBase#
   */
  function ToolBase(paperScope) {
    var _this = this;
    _classCallCheck(this, ToolBase);
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
    this.project = {
      getZoom: function getZoom() {
        return paperScope.view.getZoom();
      },
      toolLayer: paperScope.project.layers.toolLayer || paperScope.project.activeLayer,
      paperScope: paperScope,
      overlay: paperScope.overlay
    };
    var shiftPressed;
    var self = this;
    this._identityMatrix = new paperScope.Matrix();
    this.extensions = {
      onActivate: function onActivate() {},
      onDeactivate: function onDeactivate() {}
    };
    this.tool = new paperScope.Tool();
    this.tool._toolObject = this; //TODO is _toolObject actually used, and does it need to be?            
    this.tool.extensions = {
      onKeyUp: function onKeyUp() {},
      onKeyDown: function onKeyDown() {}
    };
    this.tool.onKeyDown = function (ev) {
      if (!shiftPressed && ev.key === 'shift') {
        shiftPressed = true;
        self.onDeactivate(); //enable OpenSeadragon event handling for navigation
      }
      this.extensions.onKeyDown(ev);
      self.onKeyDown(ev);
    };
    this.tool.onKeyUp = function (ev) {
      if (ev.key == 'shift') {
        shiftPressed = false;
        self.onActivate(); //start capturing mouse/keyboard events again
      }
      this.extensions.onKeyUp(ev);
      self.onKeyUp(ev);
    };
    this.tool.onMouseDown = function (ev) {
      _this.onMouseDown(ev);
    };
    this.tool.onMouseDrag = function (ev) {
      _this.onMouseDrag(ev);
    };
    this.tool.onMouseMove = function (ev) {
      _this.onMouseMove(ev);
    };
    this.tool.onMouseUp = function (ev) {
      _this.onMouseUp(ev);
    };
    this.listeners = {};
  }
  return _createClass(ToolBase, [{
    key: "getTolerance",
    value: function getTolerance(pixels) {
      var _item;
      var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!item) {
        item = this.item;
      }
      var scalefactor = ((_item = item) === null || _item === void 0 ? void 0 : _item.layer.scaling.x) || 1;
      return pixels / scalefactor / this.project.getZoom();
    }
    /**
     * Check if the tool is active.
     * @returns {boolean} True if the tool is active, otherwise false.
     */
  }, {
    key: "isActive",
    value: function isActive() {
      return this._active;
    }
  }, {
    key: "activate",
    value: function activate() {
      this.tool.activate();
      this.onActivate();
    }
  }, {
    key: "deactivate",
    value: function deactivate(finishToolAction) {
      this.onDeactivate(finishToolAction);
    }
    /**
     * Function called when the tool is activated.
     */
  }, {
    key: "onActivate",
    value: function onActivate() {
      this.captureUserInput(true);
      this.project.overlay.addEventListener('wheel', this.tool.onMouseWheel);
      this.project.toolLayer.bringToFront();
      this.extensions.onActivate();
    }
    /**
     * Function called when the tool is deactivated.
     * @param {boolean} [shouldFinish=false] - Indicates whether the tool should finish its action.
     */
  }, {
    key: "onDeactivate",
    value: function onDeactivate() {
      var shouldFinish = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.captureUserInput(false);
      this.project.overlay.removeEventListener('wheel', this.tool.onMouseWheel);
      this.project.toolLayer.sendToBack();
      this.extensions.onDeactivate(shouldFinish);
    }
    /**
     * Add an event listener for a specific event type.
     * @param {string} eventType - The type of event to listen for.
     * @param {Function} callback - The callback function to be executed when the event occurs.
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(eventType, callback) {
      this.listeners[eventType] = this.listeners[eventType] || [];
      this.listeners[eventType].push(callback);
    }
    /**
     * Broadcast an event to all registered event listeners for the specified event type.
     * @param {string} eventType - The type of event to broadcast.
     * @param {...*} data - Data to be passed as arguments to the event listeners.
     */
  }, {
    key: "broadcast",
    value: function broadcast(eventType) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }
      var listeners = this.listeners[eventType];
      listeners && listeners.forEach(function (l) {
        return l.apply(void 0, data);
      });
    }

    /**
     * Capture user input to enable or disable OpenSeadragon mouse navigation.
     * @memberof OSDPaperjsAnnotation.ToolBase
     * @inner
     * @param {boolean} [capture=true] - Set to true to capture user input, false to release it.
     */
  }, {
    key: "captureUserInput",
    value: function captureUserInput() {
      var capture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.project.overlay.setOSDMouseNavEnabled(!capture);
    }
  }, {
    key: "onMouseDown",
    value:
    // default no-op implementations of tool event handlers
    function onMouseDown() {}
  }, {
    key: "onMouseMove",
    value: function onMouseMove() {}
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag() {}
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {}
  }, {
    key: "onKeyDown",
    value: function onKeyDown() {}
  }, {
    key: "onKeyUp",
    value: function onKeyUp() {}
  }]);
}();

;// ./src/js/utils/simplify.mjs
function simplify_typeof(o) { "@babel/helpers - typeof"; return simplify_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, simplify_typeof(o); }
function simplify_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function simplify_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, simplify_toPropertyKey(o.key), o); } }
function simplify_createClass(e, r, t) { return r && simplify_defineProperties(e.prototype, r), t && simplify_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function simplify_toPropertyKey(t) { var i = simplify_toPrimitive(t, "string"); return "symbol" == simplify_typeof(i) ? i : i + ""; }
function simplify_toPrimitive(t, r) { if ("object" != simplify_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != simplify_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SimplifyJS = /*#__PURE__*/function () {
  /*
  Based on:
      Simplify.js, a high-performance JS polyline simplification library
      mourner.github.io/simplify-js
      License: BSD
      Copyright (c) 2017, Vladimir Agafonkin
      All rights reserved.
       Redistribution and use in source and binary forms, with or without modification, are
      permitted provided that the following conditions are met:
       1. Redistributions of source code must retain the above copyright notice, this list of
          conditions and the following disclaimer.
       2. Redistributions in binary form must reproduce the above copyright notice, this list
          of conditions and the following disclaimer in the documentation and/or other materials
          provided with the distribution.
       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
      EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
      MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
      COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
      SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
      HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
      TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  function SimplifyJS() {
    simplify_classCallCheck(this, SimplifyJS);
  }
  return simplify_createClass(SimplifyJS, [{
    key: "getSqDist",
    value: function getSqDist(p1, p2) {
      // square distance between 2 points
      var dx = p1.x - p2.x,
        dy = p1.y - p2.y;
      return dx * dx + dy * dy;
    }
  }, {
    key: "getSqSegDist",
    value: function getSqSegDist(p, p1, p2) {
      // square distance from a point to a segment
      var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;
      if (dx !== 0 || dy !== 0) {
        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
          x = p2.x;
          y = p2.y;
        } else if (t > 0) {
          x += dx * t;
          y += dy * t;
        }
      }
      dx = p.x - x;
      dy = p.y - y;
      return dx * dx + dy * dy;
    }
  }, {
    key: "simplifyRadialDist",
    value: function simplifyRadialDist(points, sqTolerance) {
      // basic distance-based simplification
      var prevPoint = points[0],
        newPoints = [prevPoint],
        point;
      for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];
        if (this.getSqDist(point, prevPoint) > sqTolerance) {
          newPoints.push(point);
          prevPoint = point;
        }
      }
      if (prevPoint !== point) newPoints.push(point);
      return newPoints;
    }
  }, {
    key: "simplifyDPStep",
    value: function simplifyDPStep(points, first, last, sqTolerance, simplified) {
      var maxSqDist = sqTolerance,
        index;
      for (var i = first + 1; i < last; i++) {
        var sqDist = this.getSqSegDist(points[i], points[first], points[last]);
        if (sqDist > maxSqDist) {
          index = i;
          maxSqDist = sqDist;
        }
      }
      if (maxSqDist > sqTolerance) {
        if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
      }
    }

    // simplification using Ramer-Douglas-Peucker algorithm
  }, {
    key: "simplifyDouglasPeucker",
    value: function simplifyDouglasPeucker(points, sqTolerance) {
      var last = points.length - 1;
      var simplified = [points[0]];
      this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
      simplified.push(points[last]);
      return simplified;
    }

    // both algorithms combined for awesome performance
  }, {
    key: "simplify",
    value: function simplify(points, tolerance, highestQuality) {
      if (points.length <= 2) return points;
      var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
      points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
      points = this.simplifyDouglasPeucker(points, sqTolerance);
      return points;
    }
  }]);
}();
;// ./src/js/papertools/annotationUITool.mjs
function annotationUITool_typeof(o) { "@babel/helpers - typeof"; return annotationUITool_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, annotationUITool_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function annotationUITool_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function annotationUITool_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, annotationUITool_toPropertyKey(o.key), o); } }
function annotationUITool_createClass(e, r, t) { return r && annotationUITool_defineProperties(e.prototype, r), t && annotationUITool_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function annotationUITool_toPropertyKey(t) { var i = annotationUITool_toPrimitive(t, "string"); return "symbol" == annotationUITool_typeof(i) ? i : i + ""; }
function annotationUITool_toPrimitive(t, r) { if ("object" != annotationUITool_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != annotationUITool_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == annotationUITool_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Base class for annotation tools, extending the ToolBase class.
 *
 * @class
 * @extends ToolBase
 * @memberof OSDPaperjsAnnotation
 */
var AnnotationUITool = /*#__PURE__*/function (_ToolBase) {
  /**
   * Create an AnnotationUITool instance.
   *
   * @constructor
   * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
   *
   * @property {boolean} _active - Flag indicating if the tool is currently active.
   * @property {paper.Item[]} _items - Array of selected items.
   * @property {paper.Item} _item - The selected item (if only one is selected).
   * @property {paper.Item} _itemToCreate - The selected new item to be created.
   */
  function AnnotationUITool(paperScope) {
    var _this;
    annotationUITool_classCallCheck(this, AnnotationUITool);
    _this = _callSuper(this, AnnotationUITool, [paperScope]);
    _this._active = false;
    _this._items = [];
    _this._item = null;
    _this.simplifier = new SimplifyJS();
    _this.tool.onMouseDown = function (ev) {
      _this.onMouseDown(_this._transformEvent(ev));
    };
    _this.tool.onMouseDrag = function (ev) {
      _this.onMouseDrag(_this._transformEvent(ev));
    };
    _this.tool.onMouseMove = function (ev) {
      _this.onMouseMove(_this._transformEvent(ev));
    };
    _this.tool.onMouseUp = function (ev) {
      _this.onMouseUp(_this._transformEvent(ev));
    };
    return _this;
  }
  _inherits(AnnotationUITool, _ToolBase);
  return annotationUITool_createClass(AnnotationUITool, [{
    key: "isActive",
    value: function isActive() {
      return this._active;
    }

    /**
     * Activate the annotation tool, making it ready for interaction.
     * If another tool was active, it's deactivated before activating this tool.
     */
  }, {
    key: "activate",
    value: function activate() {
      if (this._active) return; //breaks possible infinite loops of tools activating/deactivating each other
      this._active = true;
      this.getSelectedItems();
      this._setTargetLayer();
      var previousTool = this.project.paperScope.getActiveTool();
      this.tool.activate();
      this.toolbarControl.activate(); //console.log('toolbar control activated')
      previousTool && previousTool != this && previousTool.deactivate(true);
      this.raiseCanvasZIndex();
      this.onActivate();
      this.broadcast('activated', {
        target: this
      });
    }
    /**
     * Deactivate the annotation tool, stopping its interaction.
     * @param {boolean} finishToolAction - Whether the tool action should be completed before deactivating.
     */
  }, {
    key: "deactivate",
    value: function deactivate(finishToolAction) {
      if (!this._active) return; //breaks possible infinite loops of tools activating/deactivating each other
      this._active = false;
      this.toolbarControl.deactivate();
      this.resetCanvasZIndex();
      this.onDeactivate(finishToolAction);
      this.broadcast('deactivated', {
        target: this
      });
    }

    /**
     * Raise the viewer canvas's z-index so that toolbars don't interfere
     */
  }, {
    key: "raiseCanvasZIndex",
    value: function raiseCanvasZIndex() {
      //raise the viewer's canvas to the top of the z-stack of the container element so that the toolbars don't interfere
      var viewer = this.project.paperScope.overlay.viewer;
      var canvas = viewer.canvas;
      this._canvasPriorZIndex = window.getComputedStyle(canvas)['z-index'];
      var siblings = Array.from(viewer.canvas.parentElement.children).filter(function (c) {
        return c !== canvas;
      });
      var maxZ = Math.max.apply(Math, _toConsumableArray(siblings.map(function (el) {
        var z = window.getComputedStyle(el)['z-index'];
        return z === 'auto' ? 0 : parseInt(z);
      })));
      canvas.style['z-index'] = maxZ + 1;
    }

    /**
     * Return the viewer canvas to its original z-index 
     */
  }, {
    key: "resetCanvasZIndex",
    value: function resetCanvasZIndex() {
      //reset z-index of viewer canvas
      var canvas = this.project.paperScope.overlay.viewer.canvas;
      canvas.style['z-index'] = this._canvasPriorZIndex;
    }
    /**
     * Get the associated toolbar control for the tool.
     * @returns {AnnotationUIToolbarBase} The toolbar control instance.
     */
  }, {
    key: "getToolbarControl",
    value: function getToolbarControl() {
      return this.toolbarControl;
    }
    /**
     * Set the associated toolbar control for the tool.
     *
     * @param {AnnotationUIToolbarBase} toolbarControl - The toolbar control instance to set.
     * @returns {AnnotationUIToolbarBase} The provided toolbar control instance.
     */
  }, {
    key: "setToolbarControl",
    value: function setToolbarControl(toolbarControl) {
      this.toolbarControl = toolbarControl;
      return this.toolbarControl;
    }
    /**
     * Refresh the list of currently selected items.
     */
  }, {
    key: "refreshItems",
    value: function refreshItems() {
      return this.getSelectedItems();
    }
    /**
     * Retrieve the list of currently selected items.
     */
  }, {
    key: "getSelectedItems",
    value: function getSelectedItems() {
      this._items = this.project.paperScope.findSelectedItems();
      this._itemToCreate = this.project.paperScope.findSelectedNewItem();
    }
    /**
     * Callback function triggered when the selection of items changes.
     * This function can be overridden in subclasses to react to selection changes.
     */
  }, {
    key: "selectionChanged",
    value: function selectionChanged() {
      this.getSelectedItems();
      this._setTargetLayer();
      this.onSelectionChanged();
    }
    /**
     * Callback function triggered when the selection changes.
     * To be implemented in subclasses.
     */
  }, {
    key: "onSelectionChanged",
    value: function onSelectionChanged() {}
    /**
     * Get the array of currently selected items.
     *
     * @returns {paper.Item[]} An array of currently selected items.
     */
  }, {
    key: "items",
    get: function get() {
      return this._items;
    }
    /**
     * Get the currently selected item, if only one is selected.
     *
     * @returns {paper.Item|null} The currently selected item, or null if no item is selected.
     */
  }, {
    key: "item",
    get: function get() {
      return this._items.length == 1 ? this._items[0] : null;
    }
    /**
     * Get the selected new item to be created.
     *
     * @returns {paper.Item|null} The selected new item, or null if no item is selected.
     */
  }, {
    key: "itemToCreate",
    get: function get() {
      return this._itemToCreate;
    }
  }, {
    key: "targetLayer",
    get: function get() {
      return this._targetLayer;
    }
  }, {
    key: "targetMatrix",
    get: function get() {
      return this.targetLayer ? this.targetLayer.matrix : this._identityMatrix;
    }

    /**
     * Simplifies the polygon by reducing the number of points while preserving shape fidelity.
     */
  }, {
    key: "doSimplify",
    value: function doSimplify(items) {
      var _this2 = this;
      if (items && !Array.isArray(items)) {
        items = [items];
      }
      if (!items) {
        items = this.items;
      }
      var _iterator = _createForOfIteratorHelper(items),
        _step;
      try {
        var _loop = function _loop() {
          var item = _step.value;
          var lengthThreshold = 10 / _this2.project.getZoom();
          var tol = 2.5 / _this2.project.getZoom();
          var simplifying = item.clone();
          var pathsToRemove = [];
          var paths = simplifying.children || [simplifying];
          paths.forEach(function (path) {
            var pts = path.segments.map(function (s) {
              if (s.point.subtract(s.previous.point).length < lengthThreshold && s.point.subtract(s.next.point).length < lengthThreshold) {
                s.point.x = (s.point.x + s.previous.point.x + s.next.point.x) / 3;
                s.point.y = (s.point.y + s.previous.point.y + s.next.point.y) / 3;
              }
              return s.point;
            });
            pts.push(pts[0]); //
            var newpts = _this2.simplifier.simplify(pts, tol, true);
            path.segments = newpts;
            if (path.segments.length < 3 || Math.abs(path.area) < tol * tol) pathsToRemove.push(path);
          });
          pathsToRemove.forEach(function (p) {
            return p.remove();
          });
          var united = simplifying.unite(simplifying, {
            insert: false
          }).reduce().toCompoundPath();
          if (simplifying._children) {
            simplifying.removeChildren();
            simplifying.addChildren(united.children);
          } else {
            simplifying.setSegments(united.children[0].segments);
          }
          if (!item.isBoundingElement) {
            var boundingItems = item.parent.children.filter(function (i) {
              return i.isBoundingElement;
            });
            simplifying.applyBounds(boundingItems);
          }
          united.remove();
          if (item._children) {
            item.removeChildren();
            item.addChildren(simplifying.children);
          } else {
            item.setSegments(simplifying.segments);
          }
          simplifying.remove();
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    // private
  }, {
    key: "_setTargetLayer",
    value: function _setTargetLayer() {
      if (this.item) {
        this._targetLayer = this.item.layer;
      } else if (this.itemToCreate) {
        this._targetLayer = this.itemToCreate.layer;
      } else if (this.items) {
        var layerSet = new Set(this.items.map(function (item) {
          return item.layer;
        }));
        if (layerSet.size === 1) {
          this._targetLayer = layerSet.values().next().value;
        } else {
          this._targetLayer = this.project.overlay.viewer.viewport.paperLayer;
        }
      } else {
        this._targetLayer = this.project.paperScope.project.activeLayer;
      }
    }
    // private
  }, {
    key: "_transformEvent",
    value: function _transformEvent(ev) {
      var matrix = this.targetMatrix;
      var transformed = {
        point: matrix.inverseTransform(ev.point),
        downPoint: matrix.inverseTransform(ev.downPoint),
        lastPoint: matrix.inverseTransform(ev.lastPoint),
        middlePoint: matrix.inverseTransform(ev.middlePoint)
      };
      var deltaStart = ev.point.subtract(ev.delta);
      transformed.delta = transformed.point.subtract(matrix.inverseTransform(deltaStart));
      ev.original = {
        point: ev.point,
        downPoint: ev.downPoint,
        lastPoint: ev.lastPoint,
        middlePoint: ev.middlePoint,
        delta: ev.delta
      };
      Object.assign(ev, transformed);
      return ev;
    }
  }]);
}(ToolBase);


/**
 * Base class for annotation toolbar controls.
 *
 * @class
 * @memberof OSDPaperjsAnnotation.AnnotationUITool
 */
var AnnotationUIToolbarBase = /*#__PURE__*/function () {
  /**
   * Create a new instance of AnnotationUIToolbarBase associated with an annotation tool.
   *
   * @constructor
   * @param {AnnotationUITool} tool - The annotation tool linked to the toolbar control.
   */
  function AnnotationUIToolbarBase(tool) {
    annotationUITool_classCallCheck(this, AnnotationUIToolbarBase);
    // let self=this;
    this._active = false;
    var button = document.createElement('button');
    button.classList.add('btn', 'invisible');
    button.textContent = 'Generic Tool';
    this.button = new osd.Button({
      tooltip: 'Generic Tool',
      element: button,
      onClick: function onClick(ev) {
        if (!ev.eventSource.element.disabled) tool._active ? tool.deactivate(true) : tool.activate();
      }
    });
    this.button.configure = function (node, tooltip) {
      this.element.title = tooltip;
      this.element.replaceChildren(node);
      this.element.classList.remove('invisible');
      this.tooltip = tooltip;
    };
    this.dropdown = document.createElement('div');
    this.dropdown.classList.add('dropdown');
    this.tool = tool;
  }
  /**
   * Check whether the toolbar control is enabled for a specific mode.
   *
   * @param {string} mode - The mode to check for enabling.
   * @returns {boolean} True if the toolbar control is enabled for the mode, otherwise false.
   */
  return annotationUITool_createClass(AnnotationUIToolbarBase, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return false;
    }

    /**
     * Activate the toolbar control, making it visually active.
     */
  }, {
    key: "activate",
    value: function activate() {
      if (this._active) return;
      this._active = true;
      //this.tool.activate();
      this.button.element.classList.add('active');
      this.dropdown.classList.add('active');
    }
    /**
     * Deactivate the toolbar control, making it visually inactive.
     *
     * @param {boolean} shouldFinish - Whether the action associated with the control should be completed.
     */
  }, {
    key: "deactivate",
    value: function deactivate(shouldFinish) {
      if (!this._active) return;
      this._active = false;
      //this.tool.deactivate(shouldFinish);
      this.button.element.classList.remove('active');
      this.dropdown.classList.remove('active');
    }
  }]);
}();

;// ./src/js/utils/faIcon.mjs
function faIcon_typeof(o) { "@babel/helpers - typeof"; return faIcon_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, faIcon_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || faIcon_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function faIcon_toConsumableArray(r) { return faIcon_arrayWithoutHoles(r) || faIcon_iterableToArray(r) || faIcon_unsupportedIterableToArray(r) || faIcon_nonIterableSpread(); }
function faIcon_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function faIcon_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function faIcon_arrayWithoutHoles(r) { if (Array.isArray(r)) return faIcon_arrayLikeToArray(r); }
function faIcon_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = faIcon_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function faIcon_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return faIcon_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? faIcon_arrayLikeToArray(r, a) : void 0; } }
function faIcon_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function faIcon_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function faIcon_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, faIcon_toPropertyKey(o.key), o); } }
function faIcon_createClass(e, r, t) { return r && faIcon_defineProperties(e.prototype, r), t && faIcon_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function faIcon_toPropertyKey(t) { var i = faIcon_toPrimitive(t, "string"); return "symbol" == faIcon_typeof(i) ? i : i + ""; }
function faIcon_toPrimitive(t, r) { if ("object" != faIcon_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != faIcon_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
var iconDefs = {
  'fa-pen-nib': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M368.4 18.3L312.7 74.1 437.9 199.3l55.7-55.7c21.9-21.9 21.9-57.3 0-79.2L447.6 18.3c-21.9-21.9-57.3-21.9-79.2 0zM288 94.6l-9.2 2.8L134.7 140.6c-19.9 6-35.7 21.2-42.3 41L3.8 445.8c-3.8 11.3-1 23.9 7.3 32.4L164.7 324.7c-3-6.3-4.7-13.3-4.7-20.7c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48c-7.4 0-14.4-1.7-20.7-4.7L33.7 500.9c8.6 8.3 21.1 11.2 32.4 7.3l264.3-88.6c19.7-6.6 35-22.4 41-42.3l43.2-144.1 2.8-9.2L288 94.6z"/></svg>',
  'fa-edit': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>',
  'fa-up-down-left-right': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96H128V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96H192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8H288V288h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6v32H288V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z"/></svg>',
  'fa-palette': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>',
  'fa-arrow-pointer': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/></svg>',
  'fa-vector-square': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M368 80h32v32H368V80zM352 32c-17.7 0-32 14.3-32 32H128c0-17.7-14.3-32-32-32H32C14.3 32 0 46.3 0 64v64c0 17.7 14.3 32 32 32V352c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32H320c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V384c0-17.7-14.3-32-32-32V160c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H352zM96 160c17.7 0 32-14.3 32-32H320c0 17.7 14.3 32 32 32V352c-17.7 0-32 14.3-32 32H128c0-17.7-14.3-32-32-32V160zM48 400H80v32H48V400zm320 32V400h32v32H368zM48 112V80H80v32H48z"/></svg>',
  'fa-image': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>',
  'fa-draw-polygon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M96 151.4V360.6c9.7 5.6 17.8 13.7 23.4 23.4H328.6c0-.1 .1-.2 .1-.3l-4.5-7.9-32-56 0 0c-1.4 .1-2.8 .1-4.2 .1c-35.3 0-64-28.7-64-64s28.7-64 64-64c1.4 0 2.8 0 4.2 .1l0 0 32-56 4.5-7.9-.1-.3H119.4c-5.6 9.7-13.7 17.8-23.4 23.4zM384.3 352c35.2 .2 63.7 28.7 63.7 64c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H119.4c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V151.4C12.9 140.4 0 119.7 0 96C0 60.7 28.7 32 64 32c23.7 0 44.4 12.9 55.4 32H328.6c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 35.3-28.5 63.8-63.7 64l-4.5 7.9-32 56-2.3 4c4.2 8.5 6.5 18 6.5 28.1s-2.3 19.6-6.5 28.1l2.3 4 32 56 4.5 7.9z"/></svg>',
  'fa-font': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32h-1.8l18-48H303.8l18 48H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H390.2L254 52.8zM279.8 304H168.2L224 155.1 279.8 304z"/></svg>',
  'fa-map-pin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z"/></svg>',
  'fa-circle': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>',
  'fa-hand': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z"/></svg>',
  'fa-brush': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M162.4 6c-1.5-3.6-5-6-8.9-6h-19c-3.9 0-7.5 2.4-8.9 6L104.9 57.7c-3.2 8-14.6 8-17.8 0L66.4 6c-1.5-3.6-5-6-8.9-6H48C21.5 0 0 21.5 0 48V224v22.4V256H9.6 374.4 384v-9.6V224 48c0-26.5-21.5-48-48-48H230.5c-3.9 0-7.5 2.4-8.9 6L200.9 57.7c-3.2 8-14.6 8-17.8 0L162.4 6zM0 288v32c0 35.3 28.7 64 64 64h64v64c0 35.3 28.7 64 64 64s64-28.7 64-64V384h64c35.3 0 64-28.7 64-64V288H0zM192 432a16 16 0 1 1 0 32 16 16 0 1 1 0-32z"/></svg>',
  'fa-rotate': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>',
  'fa-pencil': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>',
  'fa-save': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>',
  'fa-wand-magic-sparkles': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>',
  'fa-trash-can': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>',
  'fa-sitemap': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M208 80c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-8v40H464c30.9 0 56 25.1 56 56v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H464c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-4.4-3.6-8-8-8H312v40h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H256c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V280H112c-4.4 0-8 3.6-8 8v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-30.9 25.1-56 56-56H264V192h-8c-26.5 0-48-21.5-48-48V80z"/></svg>',
  'fa-eye': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>',
  'fa-eye-slash': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>',
  'fa-binoculars': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M128 32h32c17.7 0 32 14.3 32 32V96H96V64c0-17.7 14.3-32 32-32zm64 96V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V388.9c0-34.6 9.4-68.6 27.2-98.3C40.9 267.8 49.7 242.4 53 216L60.5 156c2-16 15.6-28 31.8-28H192zm227.8 0c16.1 0 29.8 12 31.8 28L459 216c3.3 26.4 12.1 51.8 25.8 74.6c17.8 29.7 27.2 63.7 27.2 98.3V448c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V128h99.8zM320 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V96H320V64zm-32 64V288H224V128h64z"/></svg>',
  'fa-crop-simple': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M128 32c0-17.7-14.3-32-32-32S64 14.3 64 32V64H32C14.3 64 0 78.3 0 96s14.3 32 32 32H64V384c0 35.3 28.7 64 64 64H352V384H128V32zM384 480c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H448l0-256c0-35.3-28.7-64-64-64L160 64v64l224 0 0 352z"/></svg>',
  'fa-plus': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
  'fa-caret-down': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>',
  'fa-caret-up': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>',
  'fa-camera': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>'
};
var IconFactory = /*#__PURE__*/function () {
  function IconFactory(container) {
    faIcon_classCallCheck(this, IconFactory);
    this._setupSymbols(container);
  }

  /**
   * Create an SVG icon from a font-awesome class name. See iconDefs for the list of supported class names.
   * @param {String} classname
   * @param {boolean} [currentColor] Whether to use the currentColor property for the fill color
   * @returns the newly created svg element with class 'icon'
   */
  return faIcon_createClass(IconFactory, [{
    key: "makeFaIcon",
    value: function makeFaIcon(classname) {
      var currentColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon');
      if (currentColor) {
        svg.setAttribute('fill', 'currentColor');
      }
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      el.setAttribute('href', "#".concat(classname));
      svg.appendChild(el);
      return svg;
    }

    /**
     * Find descendants of a parent element and convert font awesome classes into svg icons. See iconDefs for the list of supported class names.
     * @param {HTMLElement} element the parent to search within
     * @param {Array} [faClassesToReplace] an optional array of strings of fontawesome class names to convert. Defaults to all classes in iconDefs above.
     * @param {Array} [faClassesToRemove] an optional array of strings to remove from the class list. Default: ['fa', 'fa-solid'] 
     */
  }, {
    key: "convertFaIcons",
    value: function convertFaIcons(element, faClassesToReplace) {
      var _this = this;
      var faClassesToRemove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['fa', 'fa-solid'];
      if (!faClassesToReplace) {
        faClassesToReplace = Object.keys(iconDefs);
      }
      var _iterator = faIcon_createForOfIteratorHelper(faClassesToReplace),
        _step;
      try {
        var _loop = function _loop() {
          var classname = _step.value;
          element.querySelectorAll(".".concat(classname)).forEach(function (e) {
            var _e$classList;
            var svg = _this.makeFaIcon(classname);
            (_e$classList = e.classList).remove.apply(_e$classList, [classname].concat(faIcon_toConsumableArray(faClassesToRemove)));
            e.appendChild(svg);
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "_setupSymbols",
    value: function _setupSymbols(parent) {
      var container = document.createElement('div');
      parent.appendChild(container);
      container.style.position = 'absolute';
      container.style.display = 'none';
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      container.appendChild(svg);
      var htmlString = '';
      for (var _i = 0, _Object$entries = Object.entries(iconDefs); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          def = _Object$entries$_i[1];
        htmlString += def.replace('<svg', "<symbol id=\"".concat(key, "\"")).replace('/svg>', '/symbol>');
      }
      svg.innerHTML = htmlString;
    }
  }]);
}();

/**
     * Create an SVG icon from a font-awesome class name. See iconDefs for the list of supported class names.
     * @param {String} classname
     * @param {boolean} [currentColor] Whether to use the currentColor property for the fill color
     * @returns the newly created svg element with class 'icon'
     */
function makeFaIcon(classname) {
  var currentColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var template = document.createElement('template');
  var html = iconDefs[classname];
  var svg;
  if (html) {
    template.innerHTML = iconDefs[classname];
    svg = template.content.children[0];
  } else {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  }
  svg.classList.add('icon');
  if (currentColor) {
    svg.setAttribute('fill', 'currentColor');
  }
  return svg;
}

/**
 * Find descendants of a parent element and convert font awesome classes into svg icons. See iconDefs for the list of supported class names.
 * @param {HTMLElement} element the parent to search within
 * @param {Array} [faClassesToReplace] an optional array of strings of fontawesome class names to convert. Defaults to all classes in iconDefs above.
 * @param {Array} [faClassesToRemove] an optional array of strings to remove from the class list. Default: ['fa', 'fa-solid'] 
 */
function convertFaIcons(element, faClassesToReplace) {
  var faClassesToRemove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['fa', 'fa-solid'];
  if (!faClassesToReplace) {
    faClassesToReplace = Object.keys(iconDefs);
  }
  var _iterator2 = faIcon_createForOfIteratorHelper(faClassesToReplace),
    _step2;
  try {
    var _loop2 = function _loop2() {
      var classname = _step2.value;
      element.querySelectorAll(".".concat(classname)).forEach(function (e) {
        var _e$classList2;
        var svg = makeFaIcon(classname);
        (_e$classList2 = e.classList).remove.apply(_e$classList2, [classname].concat(faIcon_toConsumableArray(faClassesToRemove)));
        e.appendChild(svg);
      });
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop2();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
;// ./src/js/papertools/default.mjs
function default_typeof(o) { "@babel/helpers - typeof"; return default_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, default_typeof(o); }
function default_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function default_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, default_toPropertyKey(o.key), o); } }
function default_createClass(e, r, t) { return r && default_defineProperties(e.prototype, r), t && default_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function default_toPropertyKey(t) { var i = default_toPrimitive(t, "string"); return "symbol" == default_typeof(i) ? i : i + ""; }
function default_toPrimitive(t, r) { if ("object" != default_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != default_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function default_callSuper(t, o, e) { return o = default_getPrototypeOf(o), default_possibleConstructorReturn(t, default_isNativeReflectConstruct() ? Reflect.construct(o, e || [], default_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function default_possibleConstructorReturn(t, e) { if (e && ("object" == default_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return default_assertThisInitialized(t); }
function default_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function default_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (default_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function default_getPrototypeOf(t) { return default_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, default_getPrototypeOf(t); }
function default_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && default_setPrototypeOf(t, e); }
function default_setPrototypeOf(t, e) { return default_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, default_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Default annotation tool that extends the AnnotationUITool class.
 * Used for image navigation and interaction with annotations.
 *
 * @class
 * @extends AnnotationUITool
 * @memberof OSDPaperjsAnnotation
 */
var DefaultTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Create a DefaultTool instance for image navigation and annotation interaction.
   * @constructor
   * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
   */
  function DefaultTool(paperScope) {
    var _this;
    default_classCallCheck(this, DefaultTool);
    _this = default_callSuper(this, DefaultTool, [paperScope]);
    _this.setToolbarControl(new DefaultToolbar(_this));
    return _this;
  }
  default_inherits(DefaultTool, _AnnotationUITool);
  return default_createClass(DefaultTool, [{
    key: "onDeactivate",
    value: function onDeactivate() {}
  }, {
    key: "onActivate",
    value: function onActivate() {
      this.resetCanvasZIndex();
    }
  }]);
}(AnnotationUITool);


/**
 * Default toolbar control for the DefaultTool class.
 * Provides image navigation functionality.
 *
 * @class
 * @extends AnnotationUIToolbarBase
 * @memberof OSDPaperjsAnnotation.DefaultTool
 */
var DefaultToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a DefaultToolbar instance associated with the DefaultTool.
   *
   * @constructor
   * @param {DefaultTool} tool - The DefaultTool linked to the toolbar control.
   */
  function DefaultToolbar(tool) {
    var _this2;
    default_classCallCheck(this, DefaultToolbar);
    _this2 = default_callSuper(this, DefaultToolbar, [tool]);
    var i = makeFaIcon('fa-hand');
    _this2.button.configure(i, 'Image Navigation Tool');
    return _this2;
  }
  /**
   * Check whether the toolbar control is enabled for a specific mode.
   *
   * @param {string} mode - The mode to check for enabling.
   * @returns {boolean} True, as the default tool is enabled for all modes.
   */
  default_inherits(DefaultToolbar, _AnnotationUIToolbarB);
  return default_createClass(DefaultToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return true; //enabled for all modes
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/utils/isvisible.mjs
function isVisible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}
;// ./src/js/papertools/style.mjs
function style_typeof(o) { "@babel/helpers - typeof"; return style_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, style_typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == style_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(style_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function style_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function style_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, style_toPropertyKey(o.key), o); } }
function style_createClass(e, r, t) { return r && style_defineProperties(e.prototype, r), t && style_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function style_toPropertyKey(t) { var i = style_toPrimitive(t, "string"); return "symbol" == style_typeof(i) ? i : i + ""; }
function style_toPrimitive(t, r) { if ("object" != style_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != style_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function style_callSuper(t, o, e) { return o = style_getPrototypeOf(o), style_possibleConstructorReturn(t, style_isNativeReflectConstruct() ? Reflect.construct(o, e || [], style_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function style_possibleConstructorReturn(t, e) { if (e && ("object" == style_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return style_assertThisInitialized(t); }
function style_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function style_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (style_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function style_getPrototypeOf(t) { return style_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, style_getPrototypeOf(t); }
function style_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && style_setPrototypeOf(t, e); }
function style_setPrototypeOf(t, e) { return style_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, style_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a tool for modifying the visual styles of annotation items, including color and opacity.
 * Inherits functionality from the AnnotationUITool class.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var StyleTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Create a new instance of the StyleTool class.
   * @param {paper.PaperScope} paperScope - The PaperScope instance to associate with the tool.
   * @constructor
   */
  function StyleTool(paperScope) {
    var _this;
    style_classCallCheck(this, StyleTool);
    _this = style_callSuper(this, StyleTool, [paperScope]);
    var self = _this;
    var tool = _this.tool;
    _this._ignoreNextSelectionChange = false;
    _this._targetItems = [];
    _this.setToolbarControl(new StyleToolbar(_this));
    var cursorGridSize = 9; //this must be an odd number so the grid is symmetric around a center cell
    var cursorCellSize = 12;
    _this.colorpicker = new ColorpickerCursor(cursorCellSize, cursorGridSize, _this.project.toolLayer);
    _this.cursor = _this.colorpicker.element;
    _this.cursor.applyRescale();
    _this.extensions.onActivate = function () {
      if (self.pickingColor) {
        self.project.overlay.addClass('tool-action').setAttribute('data-tool-action', 'colorpicker');
        self.cursor.visible = true;
      }
      self.selectionChanged(); //set initial list of selected items
      // self.tool.captureUserInput(!!self.pickingColor);
      self.captureUserInput(!!self.pickingColor);
    };
    _this.extensions.onDeactivate = function (finished) {
      self.project.overlay.removeClass('tool-action').setAttribute('data-tool-action', '');
      self.cursor.visible = false;
      if (finished) {
        self.cancelColorpicker();
      }
    };
    tool.extensions.onKeyUp = function (ev) {
      if (ev.key == 'escape') {
        self.cancelColorpicker();
      }
    };
    _this.project.paperScope.project.on('edit-style', function (ev) {
      _this.activateForItem(ev.item);
    });
    return _this;
  }
  style_inherits(StyleTool, _AnnotationUITool);
  return style_createClass(StyleTool, [{
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      if (this.pickingColor) {
        this.colorpicker.updatePosition(ev.original.point);
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      if (this.pickingColor && this.cursor.visible) {
        this._colorpickerPromise && this._colorpickerPromise.resolve(this.colorpicker.selectedColor);
        this._colorpickerPromise = null;
        this.cancelColorpicker();
      }
    }

    /**
     * Activate the StyleTool for a specific annotation item.
     * @param {paper.Item} item - The item for which the StyleTool should be activated.
     */
  }, {
    key: "activateForItem",
    value: function activateForItem(item) {
      this.targetItems = item;
      this._ignoreNextSelectionChange = true;
      this.activate();
      this.toolbarControl.updateDisplay();
      this._ignoreNextSelectionChange = false;
    }
    /**
     * Event handler for selection changes, updating the target items and the toolbar display.
     */
  }, {
    key: "onSelectionChanged",
    value: function onSelectionChanged() {
      if (!this._ignoreNextSelectionChange) {
        this.targetItems = this.items;
        this.toolbarControl.updateDisplay();
      }
      this._ignoreNextSelectionChange = false;
    }
  }, {
    key: "defaultTarget",
    get: function get() {
      return this.project.paperScope.project;
    }
  }, {
    key: "targetItems",
    get: function get() {
      // return this._targetItems.map(item=>item.defaultStyle || item)
      return this._targetItems;
    },
    set: function set(target) {
      this._targetItems = target ? [target].flat().filter(function (t) {
        return t.defaultStyle || t.style;
      }) : [];
      if (this._targetItems.length == 0) this._targetItems = [this.defaultTarget];
    }
  }, {
    key: "targetItemStyles",
    get: function get() {
      return this._targetItems.map(function (item) {
        return item.defaultStyle || item.style;
      });
    }
  }, {
    key: "targetDescription",
    get: function get() {
      if (this._targetItems.length == 0) {
        return "No target";
      } else if (this._targetItems.length > 1) {
        return "".concat(this._targetItems.length, " items");
      } else {
        var t = this._targetItems[0];
        return t == this.defaultTarget ? 'Default style' : t.displayName;
      }
    }

    /**
     * Activate the color picker interface, allowing users to pick a color from the canvas.
     * @returns {Promise<paper.Color>} - A Promise that resolves to the selected color.
     */
  }, {
    key: "pickColor",
    value: function pickColor() {
      var self = this;
      self.captureUserInput(true);
      return new Promise(function (resolve, reject) {
        self._colorpickerPromise && self._colorpickerPromise.reject('Canceled');
        self._colorpickerPromise = {
          resolve: resolve,
          reject: reject
        };
        self.activate();
        self.pickingColor = true;
        self.cursor.visible = true;
        self.project.paperScope.project.layers.toolLayer.bringToFront();
        self.tool.onMouseMove({
          point: self.cursor.view.center
        });
        self.project.overlay.addClass('tool-action').setAttribute('data-tool-action', 'colorpicker');
      })["finally"](function () {
        self.captureUserInput(false);
      });
    }
    /**
     * Cancel the color picker interface and reject the associated Promise.
     */
  }, {
    key: "cancelColorpicker",
    value: function cancelColorpicker() {
      this.cursor.addTo(this.project.toolLayer);
      this.pickingColor = false;
      this.cursor.visible = false;
      this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action', '');
      this._colorpickerPromise && this._colorpickerPromise.reject('Canceled');
    }
    /**
     * Create a masked image of the item for use in color sampling.
     * @param {paper.Item} item - The item to create the masked image from.
     * @returns {paper.Group} - A Group containing the masked image.
     */
  }, {
    key: "createMaskedImage",
    value: function createMaskedImage(item) {
      var mask = item.clone();
      var grp = new _paper.Group([mask]);
      var mb = this.project.paperScope.view.projectToView(mask.bounds);
      var mx = mb.x;
      var my = mb.y;
      var mw = mask.bounds.width * this.project.getZoom();
      var mh = mask.bounds.height * this.project.getZoom();

      //Deal with pixel ratio other than one
      var r = this.project.paperScope.view.pixelRatio;
      var newcanvas = document.createElement('canvas');
      canvas.setAttribute('width', mw * r);
      canvas.setAttribute('height', mh * r);
      newcanvas.getContext('2d').drawImage(this.project.overlay.viewer.drawer.canvas, mx * r, my * r, mw * r, mh * r, 0, 0, mw * r, mh * r);
      var dataurl = newcanvas.toDataURL();
      var raster = new _paper.Raster({
        source: dataurl,
        position: mask.bounds.center
      });
      raster.scale(1 / (r * this.project.getZoom()));
      grp.addChild(raster);
      grp.clipped = true;
      grp.position.x = grp.position.x + 500;
      return grp;
    }

    /**
     * Apply the given stroke width to the target items.
     * @param {number} value - The stroke width value to apply.
     */
  }, {
    key: "applyStrokeWidth",
    value: function applyStrokeWidth(value) {
      this.targetItems.forEach(function (item) {
        if (item.defaultStyle) item = item.defaultStyle;
        item.strokeWidth = value;
        item.rescale && (item.rescale.strokeWidth = value);

        //for annotation items, update the config object and apply rescale
        if (item.isGeoJSONFeature) {
          item.applyRescale();
        }
      });
    }

    /**
    * Apply the given opacity value to fill or stroke properties of the target items.
    * @param {number} opacity - The opacity value to apply.
    * @param {string} property - The property to apply the opacity to (e.g., 'fillOpacity', 'strokeOpacity').
    */
  }, {
    key: "applyOpacity",
    value: function applyOpacity(opacity, property) {
      this.targetItems.forEach(function (item) {
        var style = item.defaultStyle || item.style;
        style[property] = opacity;
        if (item.isGeoJSONFeature) {
          item.updateFillOpacity();
          item.updateStrokeOpacity();
        }
      });
    }

    /**
     * Apply the given color value to the specified type (fill or stroke) of the target items.
     * @param {string} value - The color value to apply.
     * @param {string} type - The type of color to apply (either 'fill' or 'stroke').
     * @param {paper.Item} item - The specific item to apply the color to (optional).
     */
  }, {
    key: "applyColor",
    value: function applyColor(value, type, item) {
      if (type == 'fill') this.applyFillColor(value, item);else if (type == 'stroke') this.applyStrokeColor(value, item);else console.warn("Cannot apply color change - type \"".concat(type, "\" not recognized"));
    }

    /**
     * Apply the given fill color value to the target items.
     * @param {string} value - The fill color value to apply.
     * @param {paper.Item} item - The specific item to apply the color to (optional).
     */
  }, {
    key: "applyFillColor",
    value: function applyFillColor(value, item) {
      (item ? [item] : this.targetItems).forEach(function (item) {
        var color = new _paper.Color(value);
        var style = item.defaultStyle || item.style;
        style.fillColor = color;
        if (item.isGeoJSONFeature) {
          item.updateFillOpacity();
        }
      });
    }
    /**
     * Apply the given stroke color value to the target items.
     * @param {string} value - The stroke color value to apply.
     * @param {paper.Item} item - The specific item to apply the color to (optional).
     */
  }, {
    key: "applyStrokeColor",
    value: function applyStrokeColor(value, item) {
      (item ? [item] : this.targetItems).forEach(function (item) {
        var color = new _paper.Color(value);
        var style = item.defaultStyle || item.style;
        // style.strokeColor && (color.alpha = style.strokeColor.alpha);
        style.strokeColor = color;
        if (item.isGeoJSONFeature) {
          // item.config.properties.strokeColor = item.strokeColor;
          item.updateStrokeOpacity();
        }
      });
    }
  }]);
}(AnnotationUITool);


/**
 * Represents the toolbar for the StyleTool class. Provides user interface elements for modifying annotation styles.
 * Inherits functionality from the AnnotationUIToolbarBase class.
 * @extends AnnotationUIToolbarBase
 * @class
 * @memberof OSDPaperjsAnnotation.StyleTool
 */
var StyleToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new instance of the StyleToolbar class.
   * @param {StyleTool} tool - The associated StyleTool instance.
   */
  function StyleToolbar(tool) {
    var _this2;
    style_classCallCheck(this, StyleToolbar);
    _this2 = style_callSuper(this, StyleToolbar, [tool]);
    var self = _this2;
    var i = makeFaIcon('fa-palette');
    _this2.button.configure(i, 'Style Tool');
    _this2.dropdown.innerHTML = _this2.uiHTML();
    convertFaIcons(_this2.dropdown);
    _this2._hierarchy = [];
    _this2.dropdown.querySelectorAll('[data-action="pick-color"]').forEach(function (e) {
      e.addEventListener('click', function () {
        var type = this.getAttribute('data-type');
        var colorinput = self.dropdown.querySelector("input[type=\"color\"][data-type=\"".concat(type, "\"]"));
        self.dropdown.querySelectorAll('[data-action="pick-color"]').forEach(function (e) {
          return e.classList.remove('active');
        });
        if (isVisible(colorinput)) {
          self.dropdown.querySelectorAll('.colorpicker-row').forEach(function (e) {
            return e.classList.add('hidden');
          });
        } else {
          self.dropdown.querySelectorAll('.colorpicker-row').forEach(function (e) {
            return e.classList.add('hidden');
          });
          colorinput.closest('.colorpicker-row').classList.remove('hidden');
          this.classList.add('active');
        }
      });
    });
    _this2.dropdown.querySelectorAll('input[type="color"]').forEach(function (e) {
      return e.addEventListener('input', function () {
        var type = this.getAttribute('data-type');
        self.tool.applyColor(this.value, type);
        type == 'fill' && self.setFillButtonColor(new _paper.Color(this.value));
        type == 'stroke' && self.setStrokeButtonColor(new _paper.Color(this.value));
      });
    });
    _this2.dropdown.querySelectorAll('input[type="number"]').forEach(function (e) {
      return e.addEventListener('input', function () {
        self.tool.applyStrokeWidth(this.value);
      });
    });
    _this2.dropdown.querySelectorAll('input[data-action="opacity"]').forEach(function (e) {
      return e.addEventListener('input', function () {
        var type = this.getAttribute('data-type');
        var prop = this.getAttribute('data-property');
        self.tool.applyOpacity(this.value, prop);
        type == 'fill' && self.setFillButtonOpacity(this.value);
        type == 'stroke' && self.setStrokeButtonOpacity(this.value);
      });
    });
    _this2.dropdown.querySelectorAll('[data-action="from-image"]').forEach(function (e) {
      return e.addEventListener('click', function () {
        var _this3 = this;
        self.tool.pickColor().then(function (color) {
          _this3.parentElement.querySelectorAll('input[type="color"]').forEach(function (e) {
            e.value = color.toCSS(true);
            e.dispatchEvent(new Event('input'));
          });
        })["catch"](function (error) {});
      });
    });
    _this2.dropdown.querySelectorAll('[data-action="from-average"]').forEach(function (e) {
      return e.addEventListener('click', function () {
        var type = this.getAttribute('data-type');
        self.fromAverage(type);
      });
    });
    _this2.dropdown.querySelectorAll('.style-item').forEach(function (e) {
      return e.addEventListener('click', function () {
        var items = self.tool.targetItems;
        var allSelected = items.every(function (item) {
          return item.selected;
        });
        var selectableItems = items.filter(function (item) {
          return item.isGeoJSONFeature;
        });
        if (selectableItems.length > 0) {
          self.tool._ignoreNextSelectionChange = true;
          selectableItems.forEach(function (item) {
            return allSelected ? item.deselect() : item.select();
          }); //select all if not all selected, else unselect all
        }
        self.updateTargetDescription();
      });
    });
    _this2.dropdown.querySelectorAll('.hierarchy-up').forEach(function (e) {
      return e.addEventListener('click', function () {
        if (self._hierarchy && self._hierarchy.length > 0) {
          self._hierarchy.index = (self._hierarchy.index + 1) % self._hierarchy.length;
        } else {
          var items = self.tool.targetItems;
          var layers = new Set(items.map(function (item) {
            return item.hierarchy.filter(function (i) {
              return i.isGeoJSONFeatureCollection && i !== item;
            });
          }).flat());
          if (layers.size == 0) {
            //this happens if a layer was directly selected, or if the default target was directly selected
            if (items.indexOf(self.tool.defaultTarget) > -1) {
              self._hierarchy = [self.tool.defaultTarget];
              self._hierarchy.index = 0;
            } else {
              self._hierarchy = [items, self.tool.defaultTarget];
              self._hierarchy.index = 1;
            }
          } else if (layers.size == 1) {
            //this happens if children of exactly one annotation layer are the target
            self._hierarchy = [self.tool.targetItems, layers.values().next().value, self.tool.defaultTarget];
            self._hierarchy.index = 1;
          } else {
            //this happens if children of more than one layer are selected
            self._hierarchy = [self.tool.targetItems, self.tool.defaultTarget];
            self._hierarchy.index = 1;
          }
        }
        var hierarchyRef = self._hierarchy;
        self.tool.activateForItem(self._hierarchy[self._hierarchy.index]);
        self._hierarchy = hierarchyRef; //on activation this variable is cleared; reset here
      });
    });
    return _this2;
  }

  /**
   * Handle color selection based on area average.
   * @param {string} type - The type of style ('fill' or 'stroke').
   */
  style_inherits(StyleToolbar, _AnnotationUIToolbarB);
  return style_createClass(StyleToolbar, [{
    key: "fromAverage",
    value: function fromAverage(type) {
      var self = this;
      var promises = this.tool.targetItems.map(function (item) {
        return getAverageColor(item).then(function (color) {
          self.tool.applyColor(color, type, item);
        });
      });
      Promise.all(promises).then(function () {
        return self.updateDisplay();
      });
    }

    /**
     * Check if the toolbar is enabled for the given mode.
     * @param {string} mode - The current annotation mode.
     * @returns {boolean} - True if the toolbar is enabled for the mode, otherwise false.
     */
  }, {
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return true;
    }
    /**
     * Generate the HTML structure of the UI elements.
     * @returns {string} - The HTML structure of the UI.
     */
  }, {
    key: "uiHTML",
    value: function uiHTML() {
      var html = "\n            <div class=\"style-toolbar\">\n                <div class=\"flex-row style-row annotation-ui-buttonbar\" >\n                    <span><span class=\"hierarchy-up fa-solid fa-sitemap\" title='Cycle through hierarchy'></span><span class='style-item' title='Toggle selection'></span></span>\n                    <span class='btn' data-action=\"pick-color\" data-type=\"fill\"><span class=\"preview\"><span class=\"color bg\"></span><span class=\"color text\">Fill</span></span></span>\n                    <span class='btn' data-action=\"pick-color\" data-type=\"stroke\"><span class=\"preview\"><span class=\"color bg\"></span><span class=\"color text\">Stroke</span></span></span>\n                    <input type=\"number\" min=0 value=1>\n                </div>\n                <div class=\"colorpicker-row hidden\">\n                    <input type=\"color\" data-action=\"color\" data-type=\"fill\">\n                    <input type=\"range\" data-action=\"opacity\" data-type=\"fill\" data-property=\"fillOpacity\" min=0 max=1 step=0.01 value=1>\n                    <span class='btn' data-action=\"from-image\">From image</span>\n                    <span class='btn' data-action=\"from-average\" data-type=\"fill\">Area average</span>\n                </div>\n                <div class=\"colorpicker-row hidden\">\n                    <input type=\"color\" data-action=\"color\" data-type=\"stroke\">\n                    <input type=\"range\" data-action=\"opacity\" data-type=\"stroke\" data-property=\"strokeOpacity\" min=0 max=1 step=0.01 value=1>\n                    <span class='btn' data-action=\"from-image\">From image</span>\n                    <span class='btn' data-action=\"from-average\" data-type=\"stroke\">Area average</span>\n                </div>\n            </div>\n        ";
      return html;
    }
    /**
     * Update the displayed description of the target items.
     */
  }, {
    key: "updateTargetDescription",
    value: function updateTargetDescription() {
      var targetDescription = this.tool.targetDescription;
      var allSelected = this.tool.targetItems.every(function (item) {
        return item.selected && item.isGeoJSONFeature;
      });
      var element = this.dropdown.querySelector('.style-item');
      element.innerHTML = targetDescription;
      allSelected ? element.classList.add('selected') : element.classList.remove('selected');
    }
    /**
     * Update the displayed style settings in the toolbar.
     */
  }, {
    key: "updateDisplay",
    value: function updateDisplay() {
      this._hierarchy = [];
      var targets = this.tool.targetItemStyles;
      this.updateTargetDescription();
      var fillColor = targets.map(function (item) {
        return item.fillColor;
      });
      if (fillColor.length == 1 || new Set(fillColor.map(function (c) {
        return c.toCSS();
      })).size == 1) {
        this.setFillButtonColor(fillColor[0]);
      } else {
        this.setFillButtonColor();
      }
      var strokeColor = targets.map(function (item) {
        return item.strokeColor;
      });
      if (strokeColor.length == 1 || new Set(strokeColor.map(function (c) {
        return c.toCSS();
      })).size == 1) {
        this.setStrokeButtonColor(strokeColor[0]);
      } else {
        // console.warn('Multiple colors not implemented')
        this.setStrokeButtonColor();
      }
      var fillOpacity = targets.map(function (item) {
        return item.fillOpacity;
      });
      if (fillOpacity.length == 1 || new Set(fillOpacity).size == 1) {
        this.setFillButtonOpacity(fillOpacity[0]);
      } else {
        // console.warn('Multiple opacities not implemented; setting to 1');
        this.setFillButtonOpacity(1);
      }
      var strokeOpacity = targets.map(function (item) {
        return item.strokeOpacity;
      });
      if (strokeOpacity.length == 1 || new Set(strokeOpacity).size == 1) {
        this.setStrokeButtonOpacity(strokeOpacity[0]);
      } else {
        // console.warn('Multiple opacities not implemented; setting to 1');
        this.setStrokeButtonOpacity(1);
      }
      var strokeWidth = targets.map(function (item) {
        return item.rescale ? item.rescale.strokeWidth : item.strokeWidth;
      });
      if (strokeWidth.length == 1 || new Set(strokeWidth).size == 1) {
        this.dropdown.querySelectorAll('input[type="number"]').forEach(function (e) {
          return e.value = strokeWidth[0];
        });
      } else {
        // console.warn('Multiple stroke widths not implemented; clearing input')
        this.dropdown.querySelectorAll('input[type="number"]').forEach(function (e) {
          return e.value = '';
        });
      }
    }
    /**
     * Set the color and text of the Fill button.
     * @param {paper.Color} [color] - The color to set for the Fill button. Defaults to white.
     */
  }, {
    key: "setFillButtonColor",
    value: function setFillButtonColor() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _paper.Color('white');
      // let val = color ? color.toCSS(true) : 'none';
      // let textcolor = color ? getContrastYIQ(color.toCSS(true)) : 'black';
      if (!color) color = new _paper.Color('white');
      var val = color.toCSS(true);
      var textcolor = getContrastYIQ(color.toCSS(true));
      this.dropdown.querySelectorAll('[data-type="fill"] .preview .text').forEach(function (e) {
        return e.style.color = textcolor;
      });
      this.dropdown.querySelectorAll('[data-type="fill"] .preview .color').forEach(function (e) {
        e.style.backgroundColor = val;
        e.style.outlineColor = textcolor;
      });
      this.dropdown.querySelectorAll('input[type="color"][data-type="fill"]').forEach(function (e) {
        return e.value = val;
      });
    }
    /**
     * Set the color and text of the Stroke button.
     * @param {paper.Color} [color] - The color to set for the Stroke button. Defaults to black.
     */
  }, {
    key: "setStrokeButtonColor",
    value: function setStrokeButtonColor() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _paper.Color('black');
      // let val = color ? color.toCSS(true) : 'none';
      // let textcolor = color ? getContrastYIQ(color.toCSS(true)) : 'black';
      if (!color) color = new _paper.Color('black');
      var val = color.toCSS(true);
      var textcolor = getContrastYIQ(color.toCSS(true));
      this.dropdown.querySelectorAll('[data-type="stroke"] .preview .text').forEach(function (e) {
        return e.style.color = textcolor;
      });
      this.dropdown.querySelectorAll('[data-type="stroke"] .preview .color').forEach(function (e) {
        e.style.backgroundColor = val;
        e.style.outlineColor = textcolor;
      });
      this.dropdown.querySelectorAll('input[type="color"][data-type="stroke"]').forEach(function (e) {
        return e.value = val;
      });
    }
    /**
     * Set the opacity of the Fill button.
     * @param {number} val - The opacity value to set for the Fill button.
     */
  }, {
    key: "setFillButtonOpacity",
    value: function setFillButtonOpacity(val) {
      this.dropdown.querySelectorAll('[data-type="fill"] .preview .bg').forEach(function (e) {
        return e.style.opacity = val;
      });
      this.dropdown.querySelectorAll('[data-type="fill"][data-action="opacity"]').forEach(function (e) {
        return e.value = val;
      });
    }
    /**
     * Set the opacity of the Stroke button.
     * @param {number} val - The opacity value to set for the Stroke button.
     */
  }, {
    key: "setStrokeButtonOpacity",
    value: function setStrokeButtonOpacity(val) {
      this.dropdown.querySelectorAll('[data-type="stroke"] .preview .bg').forEach(function (e) {
        return e.style.opacity = val;
      });
      this.dropdown.querySelectorAll('[data-type="stroke"][data-action="opacity"]').forEach(function (e) {
        return e.value = val;
      });
    }
  }]);
}(AnnotationUIToolbarBase);


/**
 * Represents a color picker cursor for selecting colors from an image.
 * @function
 * @param {number} cursorCellSize - The size of the individual color cells in the cursor.
 * @param {number} cursorGridSize - The size of the grid in the cursor.
 * @param {paper.Layer} parent - The parent layer to which the cursor group will be added.
 * @memberof OSDPaperjsAnnotation.StyleTool#
 */
function ColorpickerCursor(cursorCellSize, cursorGridSize, parent) {
  var cursor = new _paper.Group({
    visible: false,
    applyMatrix: false
  });
  this.element = cursor;
  parent.addChild(cursor);
  function handleFlip() {
    var angle = cursor.view.getFlipped() ? cursor.view.getRotation() : 180 - cursor.view.getRotation();
    cursor.rotate(-angle);
    cursor.scale(-1, 1);
    cursor.rotate(angle);
  }

  //desired rotation is negative of view rotation value
  cursor.view.on('rotate', function (ev) {
    return cursor.rotate(-ev.rotatedBy);
  });
  cursor.view.on('flip', handleFlip);
  cursor.numRows = cursorGridSize;
  cursor.numColumns = cursorGridSize;
  var canvas = document.createElement('canvas');
  canvas.height = cursor.numRows;
  canvas.width = cursor.numColumns;
  var ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });
  var s = cursorCellSize;
  var min = -((cursorGridSize - 1) / 2);
  var max = min + cursorGridSize;
  for (var y = min; y < max; y++) {
    for (var x = min; x < max; x++) {
      var r = new _paper.Shape.Rectangle({
        point: [x * s, y * s],
        size: [s, s],
        strokeWidth: 0.5,
        strokeColor: 'white',
        fillColor: 'white',
        rescale: {
          position: [x * s, y * s],
          size: [s, s],
          strokeWidth: 0.5
        }
      });
      cursor.addChild(r);
      if (x == 0 && y == 0) cursor.centerCell = r;
    }
  }
  //add darker thicker border for central "selected" spot
  var x = 0,
    y = 0;
  var c = new _paper.Shape.Rectangle({
    point: [x * s, y * s],
    size: [s, s],
    strokeWidth: 1,
    strokeColor: 'black',
    fillColor: null,
    rescale: {
      position: [x * s, y * s],
      size: [s, s],
      strokeWidth: 1
    }
  });
  cursor.addChild(c);

  //add a background rectangle surrounding the whole cursor to show the selected color
  var x = 0,
    y = 0;
  var sz = cursorCellSize * (cursorGridSize + 2); //border= 1 cell thick
  var b = new _paper.Shape.Rectangle({
    point: [x * s, y * s],
    size: [sz, sz],
    strokeWidth: 1,
    strokeColor: 'black',
    fillColor: null,
    rescale: {
      position: [x * s, y * s],
      size: [sz, sz],
      strokeWidth: 1
    }
  });
  cursor.addChild(b);
  cursor.borderElement = b;
  b.sendToBack(); //this sets b as the first child, requiring 1-based indexing of grid in mousemove handler
  cursor.applyRescale = function () {
    cursor.children.forEach(function (child) {
      return child.applyRescale();
    });
  };

  // flip the cursor if needed
  if (cursor.view.getFlipped()) {
    handleFlip();
  }

  /**
   * Update the position of the color picker cursor and retrieve colors from the image.
   * @param {paper.Point} point - The point in the view where the cursor is positioned.
   */
  this.updatePosition = function (point) {
    var _this4 = this;
    cursor.position = point;
    var o = cursor.project.overlay.paperToCanvasCoordinates(point.x, point.y);
    var x = Math.round(o.x) - Math.floor(cursor.numColumns / 2);
    var y = Math.round(o.y) - Math.floor(cursor.numRows / 2);
    var w = cursor.numColumns;
    var h = cursor.numRows;
    var r = cursor.view.pixelRatio;
    var imdata = cursor.project.overlay.getImageData(x * r, y * r, w * r, h * r);
    ctx.clearRect(0, 0, w, h);
    window.createImageBitmap(imdata).then(function (bitmap) {
      ctx.drawImage(bitmap, 0, 0, cursor.numColumns, cursor.numRows);
      var data = ctx.getImageData(0, 0, w, h);
      var i, p;
      for (i = 0, p = 1; i < data.data.length; i += 4, p += 1) {
        cursor.children[p].fillColor.red = data.data[i] / 255;
        cursor.children[p].fillColor.green = data.data[i + 1] / 255;
        cursor.children[p].fillColor.blue = data.data[i + 2] / 255;
      }
      cursor.borderElement.fillColor = cursor.centerCell.fillColor;
      _this4.selectedColor = cursor.centerCell.fillColor;
    });
  };
  return this;
}


/**
 * Represents a utility function to calculate the average color of an item on the screen.
 * @async
 * @function
 * @param {paper.Item} itemToAverage - The item for which to calculate the average color.
 * @returns {Promise<paper.Color>} - A promise that resolves with the calculated average color.
 * @memberof OSDPaperjsAnnotation.StyleTool#
 */
function getAverageColor(_x) {
  return _getAverageColor.apply(this, arguments);
}
function _getAverageColor() {
  _getAverageColor = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(itemToAverage) {
    var raster;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          raster = (itemToAverage.project && itemToAverage.project.overlay || itemToAverage.overlay).getViewportRaster();
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            raster.onLoad = function () {
              // clone the item and transform it back to viewport coordinates
              var cloned = itemToAverage.clone();
              cloned.transform(cloned.layer.matrix);
              var color = raster.getAverageColor(cloned);
              //clean up the cloned item and the raster
              raster.remove();
              cloned.remove();
              if (!color) {
                reject('Error: The item must be visible on the screen to pick the average color of visible pixels. Please navigate and retry.');
              }
              resolve(color);
            };
          }));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getAverageColor.apply(this, arguments);
}
;

//local functions

// Calculate best text color for contrast from background - https://stackoverflow.com/a/11868398
/**
 * Calculate the best text color for contrast from a given background color.
 * This function uses the YIQ color model to determine the best text color (black or white)
 * based on the luminance of the background color.
 *
 * @private
 * @param {string} hexcolor - The background color in hexadecimal format.
 * @returns {string} - The recommended text color ('black' or 'white') for contrast.
 * @memberof OSDPaperjsAnnotation
 */
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? 'black' : 'white';
}
;// ./src/js/utils/morph.mjs
function morph_typeof(o) { "@babel/helpers - typeof"; return morph_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, morph_typeof(o); }
function morph_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, morph_toPropertyKey(o.key), o); } }
function morph_createClass(e, r, t) { return r && morph_defineProperties(e.prototype, r), t && morph_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function morph_toPropertyKey(t) { var i = morph_toPrimitive(t, "string"); return "symbol" == morph_typeof(i) ? i : i + ""; }
function morph_toPrimitive(t, r) { if ("object" != morph_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != morph_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function morph_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 PorkShoulderHolder
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Morph = /*#__PURE__*/morph_createClass(function Morph(initmask) {
  morph_classCallCheck(this, Morph);
  this.width = initmask.width, this.height = initmask.height, this.data = new Uint8Array(initmask.data);
  if (this.data) {
    if (this.height * this.width != this.data.length) throw 'MORPH_DIMENSION_ERROR: incorrect dimensions';
  } else {
    // this.data = Array.apply(null, new Array(this.height * this.width)).map(Number.prototype.valueOf,0);
    this.data = Array(this.width * this.height).fill(0);
  }
  this.dilate = function () {
    // this.addBorder()
    var o = Array.from(this.data);
    var w = this.width;
    var h = this.height;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var ind = y * w + x;
        this.data[ind] = o[ind] ? o[ind] : this.adjacentIndices(ind).some(function (i) {
          return o[i];
        }) ? 1 : 0;
      }
    }
    return {
      width: this.width,
      height: this.height,
      data: this.data
    };
  };
  this.addBorder = function () {
    this.width = this.width + 2;
    this.height = this.height + 2;
    var orig = this.data;
    this.data = new Uint8Array(this.width * this.height).fill(0);
    for (var y = 1; y < this.height - 1; y++) {
      for (var x = 1; x < this.width - 1; x++) {
        this.data[y * this.width + x] = orig[(y - 1) * (this.width - 2) + (x - 1)];
      }
    }
    return {
      width: this.width,
      height: this.height,
      data: this.data
    };
  };
  this.adjacentIndices = function (ind) {
    var ul = ind - this.width - 1;
    var ll = ind + this.width - 1;
    var len = this.data.length;
    return [ul, ul + 1, ul + 2, ind - 1, ind + 1, ll, ll + 1, ll + 2].filter(function (i) {
      return i >= 0 && i < len;
    });
  };
});
;// ./src/js/utils/magicwand.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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

////// MagicWand.js
// https://github.com/Tamersoul/magic-wand-js a3b0903 last modified Oct 13, 2020, downloaded 9/21/21 
// The MIT License (MIT)

// Copyright (c) 2014, Ryasnoy Paul (ryasnoypaul@gmail.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function makeMagicWand() {
  var lib = {};

  /** Create a binary mask on the image by color threshold
   * Algorithm: Scanline flood fill (http://en.wikipedia.org/wiki/Flood_fill)
   * @param {Object} image: {Uint8Array} data, {int} width, {int} height, {int} bytes
   * @param {int} x of start pixel
   * @param {int} y of start pixel
   * @param {int} color threshold
   * @param {Uint8Array} mask of visited points (optional) 
   * @param {boolean} [includeBorders=false] indicate whether to include borders pixels
   * @return {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
   */
  lib.floodFill = function (image, px, py, colorThreshold, mask, includeBorders) {
    return includeBorders ? floodFillWithBorders(image, px, py, colorThreshold, mask) : floodFillWithoutBorders(image, px, py, colorThreshold, mask);
  };
  function floodFillWithoutBorders(image, px, py, colorThreshold, mask) {
    var c,
      x,
      newY,
      el,
      xr,
      xl,
      dy,
      dyl,
      dyr,
      checkY,
      data = image.data,
      w = image.width,
      h = image.height,
      bytes = image.bytes,
      // number of bytes in the color
      maxX = -1,
      minX = w + 1,
      maxY = -1,
      minY = h + 1,
      i = py * w + px,
      // start point index in the mask data
      result = new Uint8Array(w * h),
      // result mask
      visited = new Uint8Array(mask ? mask : w * h); // mask of visited points

    if (visited[i] === 1) return null;
    i = i * bytes; // start point index in the image data
    var sampleColor = [data[i], data[i + 1], data[i + 2], data[i + 3]]; // start point color (sample)

    var stack = [{
      y: py,
      left: px - 1,
      right: px + 1,
      dir: 1
    }]; // first scanning line
    do {
      el = stack.shift(); // get line for scanning

      checkY = false;
      for (x = el.left + 1; x < el.right; x++) {
        dy = el.y * w;
        i = (dy + x) * bytes; // point index in the image data

        if (visited[dy + x] === 1) continue; // check whether the point has been visited

        // compare the color of the sample
        c = data[i] - sampleColor[0]; // check by red
        if (c > colorThreshold || c < -colorThreshold) continue;
        c = data[i + 1] - sampleColor[1]; // check by green
        if (c > colorThreshold || c < -colorThreshold) continue;
        c = data[i + 2] - sampleColor[2]; // check by blue
        if (c > colorThreshold || c < -colorThreshold) continue;

        //ignore transparent points
        if (data[i + 3] === 0) continue;
        checkY = true; // if the color of the new point(x,y) is similar to the sample color need to check minmax for Y 

        result[dy + x] = 1; // mark a new point in mask
        visited[dy + x] = 1; // mark a new point as visited

        xl = x - 1;
        // walk to left side starting with the left neighbor
        while (xl > -1) {
          dyl = dy + xl;
          i = dyl * bytes; // point index in the image data
          if (visited[dyl] === 1) break; // check whether the point has been visited
          // compare the color of the sample
          c = data[i] - sampleColor[0]; // check by red
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 1] - sampleColor[1]; // check by green
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 2] - sampleColor[2]; // check by blue
          if (c > colorThreshold || c < -colorThreshold) break;

          //ignore transparent points
          if (data[i + 3] === 0) break;
          result[dyl] = 1;
          visited[dyl] = 1;
          xl--;
        }
        xr = x + 1;
        // walk to right side starting with the right neighbor
        while (xr < w) {
          dyr = dy + xr;
          i = dyr * bytes; // index point in the image data
          if (visited[dyr] === 1) break; // check whether the point has been visited
          // compare the color of the sample
          c = data[i] - sampleColor[0]; // check by red
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 1] - sampleColor[1]; // check by green
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 2] - sampleColor[2]; // check by blue
          if (c > colorThreshold || c < -colorThreshold) break;

          //ignore transparent points
          if (data[i + 3] === 0) break;
          result[dyr] = 1;
          visited[dyr] = 1;
          xr++;
        }

        // check minmax for X
        if (xl < minX) minX = xl + 1;
        if (xr > maxX) maxX = xr - 1;
        newY = el.y - el.dir;
        if (newY >= 0 && newY < h) {
          // add two scanning lines in the opposite direction (y - dir) if necessary
          if (xl < el.left) stack.push({
            y: newY,
            left: xl,
            right: el.left,
            dir: -el.dir
          }); // from "new left" to "current left"
          if (el.right < xr) stack.push({
            y: newY,
            left: el.right,
            right: xr,
            dir: -el.dir
          }); // from "current right" to "new right"
        }
        newY = el.y + el.dir;
        if (newY >= 0 && newY < h) {
          // add the scanning line in the direction (y + dir) if necessary
          if (xl < xr) stack.push({
            y: newY,
            left: xl,
            right: xr,
            dir: el.dir
          }); // from "new left" to "new right"
        }
      }
      // check minmax for Y if necessary
      if (checkY) {
        if (el.y < minY) minY = el.y;
        if (el.y > maxY) maxY = el.y;
      }
    } while (stack.length > 0);
    return {
      data: result,
      width: image.width,
      height: image.height,
      bounds: {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      },
      sampleColor: sampleColor
    };
  }
  ;
  function floodFillWithBorders(image, px, py, colorThreshold, mask) {
    var c,
      x,
      newY,
      el,
      xr,
      xl,
      dy,
      dyl,
      dyr,
      checkY,
      data = image.data,
      w = image.width,
      h = image.height,
      bytes = image.bytes,
      // number of bytes in the color
      maxX = -1,
      minX = w + 1,
      maxY = -1,
      minY = h + 1,
      i = py * w + px,
      // start point index in the mask data
      result = new Uint8Array(w * h),
      // result mask
      visited = new Uint8Array(mask ? mask : w * h); // mask of visited points

    if (visited[i] === 1) return null;
    i = i * bytes; // start point index in the image data
    var sampleColor = [data[i], data[i + 1], data[i + 2], data[i + 3]]; // start point color (sample)

    var stack = [{
      y: py,
      left: px - 1,
      right: px + 1,
      dir: 1
    }]; // first scanning line
    do {
      el = stack.shift(); // get line for scanning

      checkY = false;
      for (x = el.left + 1; x < el.right; x++) {
        dy = el.y * w;
        i = (dy + x) * bytes; // point index in the image data

        if (visited[dy + x] === 1) continue; // check whether the point has been visited

        checkY = true; // if the color of the new point(x,y) is similar to the sample color need to check minmax for Y 

        result[dy + x] = 1; // mark a new point in mask
        visited[dy + x] = 1; // mark a new point as visited

        // compare the color of the sample
        c = data[i] - sampleColor[0]; // check by red
        if (c > colorThreshold || c < -colorThreshold) continue;
        c = data[i + 1] - sampleColor[1]; // check by green
        if (c > colorThreshold || c < -colorThreshold) continue;
        c = data[i + 2] - sampleColor[2]; // check by blue
        if (c > colorThreshold || c < -colorThreshold) continue;

        //ignore transparent points
        if (data[i + 3] === 0) continue;
        xl = x - 1;
        // walk to left side starting with the left neighbor
        while (xl > -1) {
          dyl = dy + xl;
          i = dyl * bytes; // point index in the image data
          if (visited[dyl] === 1) break; // check whether the point has been visited

          result[dyl] = 1;
          visited[dyl] = 1;
          xl--;

          // compare the color of the sample
          c = data[i] - sampleColor[0]; // check by red
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 1] - sampleColor[1]; // check by green
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 2] - sampleColor[2]; // check by blue
          if (c > colorThreshold || c < -colorThreshold) break;

          //ignore transparent points
          if (data[i + 3] === 0) break;
        }
        xr = x + 1;
        // walk to right side starting with the right neighbor
        while (xr < w) {
          dyr = dy + xr;
          i = dyr * bytes; // index point in the image data
          if (visited[dyr] === 1) break; // check whether the point has been visited

          result[dyr] = 1;
          visited[dyr] = 1;
          xr++;

          // compare the color of the sample
          c = data[i] - sampleColor[0]; // check by red
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 1] - sampleColor[1]; // check by green
          if (c > colorThreshold || c < -colorThreshold) break;
          c = data[i + 2] - sampleColor[2]; // check by blue
          if (c > colorThreshold || c < -colorThreshold) break;

          //ignore transparent points
          if (data[i + 3] === 0) break;
        }

        // check minmax for X
        if (xl < minX) minX = xl + 1;
        if (xr > maxX) maxX = xr - 1;
        newY = el.y - el.dir;
        if (newY >= 0 && newY < h) {
          // add two scanning lines in the opposite direction (y - dir) if necessary
          if (xl < el.left) stack.push({
            y: newY,
            left: xl,
            right: el.left,
            dir: -el.dir
          }); // from "new left" to "current left"
          if (el.right < xr) stack.push({
            y: newY,
            left: el.right,
            right: xr,
            dir: -el.dir
          }); // from "current right" to "new right"
        }
        newY = el.y + el.dir;
        if (newY >= 0 && newY < h) {
          // add the scanning line in the direction (y + dir) if necessary
          if (xl < xr) stack.push({
            y: newY,
            left: xl,
            right: xr,
            dir: el.dir
          }); // from "new left" to "new right"
        }
      }
      // check minmax for Y if necessary
      if (checkY) {
        if (el.y < minY) minY = el.y;
        if (el.y > maxY) maxY = el.y;
      }
    } while (stack.length > 0);
    return {
      data: result,
      width: image.width,
      height: image.height,
      bounds: {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      },
      sampleColor: sampleColor
    };
  }
  ;
  lib.thresholdMask = function (image, px, py, colorThreshold) {
    var masks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var c,
      r,
      data = image.data,
      w = image.width,
      h = image.height,
      bytes = image.bytes,
      // number of bytes in the color
      i = py * w + px,
      // start point index in the mask data
      result = new Uint8Array(masks.append ? masks.append : w * h),
      // result mask
      ignore = new Uint8Array(masks.ignore ? masks.ignore : w * h); // mask of points to ignore

    if (ignore[i] === 1) return null;
    i = i * bytes; // start point index in the image data
    var sampleColor = [data[i], data[i + 1], data[i + 2], data[i + 3]]; // start point color (sample)

    for (i = 0, r = 0; i < data.length; i += 4, r += 1) {
      if (ignore[r] || result[r]) continue;

      //ignore transparent points
      if (data[i + 3] === 0) continue;

      // compare the color of the sample
      c = data[i] - sampleColor[0]; // check by red
      if (c > colorThreshold || c < -colorThreshold) continue;
      c = data[i + 1] - sampleColor[1]; // check by green
      if (c > colorThreshold || c < -colorThreshold) continue;
      c = data[i + 2] - sampleColor[2]; // check by blue
      if (c > colorThreshold || c < -colorThreshold) continue;
      result[r] = 1;
    }
    return {
      data: result,
      width: image.width,
      height: image.height,
      bounds: {
        minX: 0,
        minY: 0,
        maxX: w,
        maxY: h
      },
      sampleColor: sampleColor
    };
  };

  /** Apply the gauss-blur filter to binary mask
      * Algorithms: http://blog.ivank.net/fastest-gaussian-blur.html
      * http://www.librow.com/articles/article-9
      * http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @param {int} blur radius
      * @return {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      */
  lib.gaussBlur = function (mask, radius) {
    var i,
      k,
      k1,
      x,
      y,
      val,
      start,
      end,
      n = radius * 2 + 1,
      // size of the pattern for radius-neighbors (from -r to +r with the center point)
      s2 = radius * radius,
      wg = new Float32Array(n),
      // weights
      total = 0,
      // sum of weights(used for normalization)
      w = mask.width,
      h = mask.height,
      data = mask.data,
      minX = mask.bounds.minX,
      maxX = mask.bounds.maxX,
      minY = mask.bounds.minY,
      maxY = mask.bounds.maxY;

    // calc gauss weights
    for (i = 0; i < radius; i++) {
      var dsq = (radius - i) * (radius - i);
      var ww = Math.exp(-dsq / (2.0 * s2)) / (2 * Math.PI * s2);
      wg[radius + i] = wg[radius - i] = ww;
      total += 2 * ww;
    }
    // normalization weights
    for (i = 0; i < n; i++) {
      wg[i] /= total;
    }
    var result = new Uint8Array(w * h),
      // result mask
      endX = radius + w,
      endY = radius + h;

    //walk through all source points for blur
    for (y = minY; y < maxY + 1; y++) for (x = minX; x < maxX + 1; x++) {
      val = 0;
      k = y * w + x; // index of the point
      start = radius - x > 0 ? radius - x : 0;
      end = endX - x < n ? endX - x : n; // Math.min((((w - 1) - x) + radius) + 1, n);
      k1 = k - radius;
      // walk through x-neighbors
      for (i = start; i < end; i++) {
        val += data[k1 + i] * wg[i];
      }
      start = radius - y > 0 ? radius - y : 0;
      end = endY - y < n ? endY - y : n; // Math.min((((h - 1) - y) + radius) + 1, n);
      k1 = k - radius * w;
      // walk through y-neighbors
      for (i = start; i < end; i++) {
        val += data[k1 + i * w] * wg[i];
      }
      result[k] = val > 0.5 ? 1 : 0;
    }
    return {
      data: result,
      width: w,
      height: h,
      bounds: {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      }
    };
  };

  /** Create a border index array of boundary points of the mask with radius-neighbors
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @param {int} blur radius
      * @param {Uint8Array} visited: mask of visited points (optional) 
      * @return {Array} border index array of boundary points with radius-neighbors (only points need for blur)
      */
  function createBorderForBlur(mask, radius, visited) {
    var x,
      i,
      j,
      y,
      k,
      k1,
      k2,
      w = mask.width,
      h = mask.height,
      data = mask.data,
      visitedData = new Uint8Array(data),
      minX = mask.bounds.minX,
      maxX = mask.bounds.maxX,
      minY = mask.bounds.minY,
      maxY = mask.bounds.maxY,
      len = w * h,
      temp = new Uint8Array(len),
      // auxiliary array to check uniqueness
      border = [],
      // only border points
      x0 = Math.max(minX, 1),
      x1 = Math.min(maxX, w - 2),
      y0 = Math.max(minY, 1),
      y1 = Math.min(maxY, h - 2);
    if (visited && visited.length > 0) {
      // copy visited points (only "black")
      for (k = 0; k < len; k++) {
        if (visited[k] === 1) visitedData[k] = 1;
      }
    }

    // walk through inner values except points on the boundary of the image
    for (y = y0; y < y1 + 1; y++) for (x = x0; x < x1 + 1; x++) {
      k = y * w + x;
      if (data[k] === 0) continue; // "white" point isn't the border
      k1 = k + w; // y + 1
      k2 = k - w; // y - 1
      // check if any neighbor with a "white" color
      if (visitedData[k + 1] === 0 || visitedData[k - 1] === 0 || visitedData[k1] === 0 || visitedData[k1 + 1] === 0 || visitedData[k1 - 1] === 0 || visitedData[k2] === 0 || visitedData[k2 + 1] === 0 || visitedData[k2 - 1] === 0) {
        //if (visitedData[k + 1] + visitedData[k - 1] + 
        //    visitedData[k1] + visitedData[k1 + 1] + visitedData[k1 - 1] +
        //    visitedData[k2] + visitedData[k2 + 1] + visitedData[k2 - 1] == 8) continue;
        border.push(k);
      }
    }

    // walk through points on the boundary of the image if necessary
    // if the "black" point is adjacent to the boundary of the image, it is a border point
    if (minX == 0) for (y = minY; y < maxY + 1; y++) if (data[y * w] === 1) border.push(y * w);
    if (maxX == w - 1) for (y = minY; y < maxY + 1; y++) if (data[y * w + maxX] === 1) border.push(y * w + maxX);
    if (minY == 0) for (x = minX; x < maxX + 1; x++) if (data[x] === 1) border.push(x);
    if (maxY == h - 1) for (x = minX; x < maxX + 1; x++) if (data[maxY * w + x] === 1) border.push(maxY * w + x);
    var result = [],
      // border points with radius-neighbors
      start,
      end,
      endX = radius + w,
      endY = radius + h,
      n = radius * 2 + 1; // size of the pattern for radius-neighbors (from -r to +r with the center point)

    len = border.length;
    // walk through radius-neighbors of border points and add them to the result array
    for (j = 0; j < len; j++) {
      k = border[j]; // index of the border point
      temp[k] = 1; // mark border point
      result.push(k); // save the border point
      x = k % w; // calc x by index
      y = (k - x) / w; // calc y by index
      start = radius - x > 0 ? radius - x : 0;
      end = endX - x < n ? endX - x : n; // Math.min((((w - 1) - x) + radius) + 1, n);
      k1 = k - radius;
      // walk through x-neighbors
      for (i = start; i < end; i++) {
        k2 = k1 + i;
        if (temp[k2] === 0) {
          // check the uniqueness
          temp[k2] = 1;
          result.push(k2);
        }
      }
      start = radius - y > 0 ? radius - y : 0;
      end = endY - y < n ? endY - y : n; // Math.min((((h - 1) - y) + radius) + 1, n);
      k1 = k - radius * w;
      // walk through y-neighbors
      for (i = start; i < end; i++) {
        k2 = k1 + i * w;
        if (temp[k2] === 0) {
          // check the uniqueness
          temp[k2] = 1;
          result.push(k2);
        }
      }
    }
    return result;
  }
  ;

  /** Apply the gauss-blur filter ONLY to border points with radius-neighbors
      * Algorithms: http://blog.ivank.net/fastest-gaussian-blur.html
      * http://www.librow.com/articles/article-9
      * http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @param {int} blur radius
      * @param {Uint8Array} visited: mask of visited points (optional) 
      * @return {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      */
  lib.gaussBlurOnlyBorder = function (mask, radius, visited) {
    var border = createBorderForBlur(mask, radius, visited),
      // get border points with radius-neighbors
      ww,
      dsq,
      i,
      j,
      k,
      k1,
      x,
      y,
      val,
      start,
      end,
      n = radius * 2 + 1,
      // size of the pattern for radius-neighbors (from -r to +r with center point)
      s2 = 2 * radius * radius,
      wg = new Float32Array(n),
      // weights
      total = 0,
      // sum of weights(used for normalization)
      w = mask.width,
      h = mask.height,
      data = mask.data,
      minX = mask.bounds.minX,
      maxX = mask.bounds.maxX,
      minY = mask.bounds.minY,
      maxY = mask.bounds.maxY,
      len = border.length;

    // calc gauss weights
    for (i = 0; i < radius; i++) {
      dsq = (radius - i) * (radius - i);
      ww = Math.exp(-dsq / s2) / Math.PI;
      wg[radius + i] = wg[radius - i] = ww;
      total += 2 * ww;
    }
    // normalization weights
    for (i = 0; i < n; i++) {
      wg[i] /= total;
    }
    var result = new Uint8Array(data),
      // copy the source mask
      endX = radius + w,
      endY = radius + h;

    //walk through all border points for blur
    for (i = 0; i < len; i++) {
      k = border[i]; // index of the border point
      val = 0;
      x = k % w; // calc x by index
      y = (k - x) / w; // calc y by index
      start = radius - x > 0 ? radius - x : 0;
      end = endX - x < n ? endX - x : n; // Math.min((((w - 1) - x) + radius) + 1, n);
      k1 = k - radius;
      // walk through x-neighbors
      for (j = start; j < end; j++) {
        val += data[k1 + j] * wg[j];
      }
      if (val > 0.5) {
        result[k] = 1;
        // check minmax
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        continue;
      }
      start = radius - y > 0 ? radius - y : 0;
      end = endY - y < n ? endY - y : n; // Math.min((((h - 1) - y) + radius) + 1, n);
      k1 = k - radius * w;
      // walk through y-neighbors
      for (j = start; j < end; j++) {
        val += data[k1 + j * w] * wg[j];
      }
      if (val > 0.5) {
        result[k] = 1;
        // check minmax
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        result[k] = 0;
      }
    }
    return {
      data: result,
      width: w,
      height: h,
      bounds: {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
      }
    };
  };

  /** Create a border mask (only boundary points)
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @return {Object} border mask: {Uint8Array} data, {int} width, {int} height, {Object} offset
      */
  lib.createBorderMask = function (mask) {
    var x,
      y,
      k,
      k1,
      k2,
      w = mask.width,
      h = mask.height,
      data = mask.data,
      minX = mask.bounds.minX,
      maxX = mask.bounds.maxX,
      minY = mask.bounds.minY,
      maxY = mask.bounds.maxY,
      rw = maxX - minX + 1,
      // bounds size
      rh = maxY - minY + 1,
      result = new Uint8Array(rw * rh),
      // reduced mask (bounds size)
      x0 = Math.max(minX, 1),
      x1 = Math.min(maxX, w - 2),
      y0 = Math.max(minY, 1),
      y1 = Math.min(maxY, h - 2);

    // walk through inner values except points on the boundary of the image
    for (y = y0; y < y1 + 1; y++) for (x = x0; x < x1 + 1; x++) {
      k = y * w + x;
      if (data[k] === 0) continue; // "white" point isn't the border
      k1 = k + w; // y + 1
      k2 = k - w; // y - 1
      // check if any neighbor with a "white" color
      if (data[k + 1] === 0 || data[k - 1] === 0 || data[k1] === 0 || data[k1 + 1] === 0 || data[k1 - 1] === 0 || data[k2] === 0 || data[k2 + 1] === 0 || data[k2 - 1] === 0) {
        //if (data[k + 1] + data[k - 1] + 
        //    data[k1] + data[k1 + 1] + data[k1 - 1] +
        //    data[k2] + data[k2 + 1] + data[k2 - 1] == 8) continue;
        result[(y - minY) * rw + (x - minX)] = 1;
      }
    }

    // walk through points on the boundary of the image if necessary
    // if the "black" point is adjacent to the boundary of the image, it is a border point
    if (minX == 0) for (y = minY; y < maxY + 1; y++) if (data[y * w] === 1) result[(y - minY) * rw] = 1;
    if (maxX == w - 1) for (y = minY; y < maxY + 1; y++) if (data[y * w + maxX] === 1) result[(y - minY) * rw + (maxX - minX)] = 1;
    if (minY == 0) for (x = minX; x < maxX + 1; x++) if (data[x] === 1) result[x - minX] = 1;
    if (maxY == h - 1) for (x = minX; x < maxX + 1; x++) if (data[maxY * w + x] === 1) result[(maxY - minY) * rw + (x - minX)] = 1;
    return {
      data: result,
      width: rw,
      height: rh,
      offset: {
        x: minX,
        y: minY
      }
    };
  };

  /** Create a border index array of boundary points of the mask
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height
      * @return {Array} border index array boundary points of the mask
      */
  lib.getBorderIndices = function (mask) {
    var x,
      y,
      k,
      k1,
      k2,
      w = mask.width,
      h = mask.height,
      data = mask.data,
      border = [],
      // only border points
      x1 = w - 1,
      y1 = h - 1;

    // walk through inner values except points on the boundary of the image
    for (y = 1; y < y1; y++) for (x = 1; x < x1; x++) {
      k = y * w + x;
      if (data[k] === 0) continue; // "white" point isn't the border
      k1 = k + w; // y + 1
      k2 = k - w; // y - 1
      // check if any neighbor with a "white" color
      if (data[k + 1] === 0 || data[k - 1] === 0 || data[k1] === 0 || data[k1 + 1] === 0 || data[k1 - 1] === 0 || data[k2] === 0 || data[k2 + 1] === 0 || data[k2 - 1] === 0) {
        //if (data[k + 1] + data[k - 1] + 
        //    data[k1] + data[k1 + 1] + data[k1 - 1] +
        //    data[k2] + data[k2 + 1] + data[k2 - 1] == 8) continue;
        border.push(k);
      }
    }

    // walk through points on the boundary of the image if necessary
    // if the "black" point is adjacent to the boundary of the image, it is a border point
    for (y = 0; y < h; y++) if (data[y * w] === 1) border.push(y * w);
    for (x = 0; x < w; x++) if (data[x] === 1) border.push(x);
    k = w - 1;
    for (y = 0; y < h; y++) if (data[y * w + k] === 1) border.push(y * w + k);
    k = (h - 1) * w;
    for (x = 0; x < w; x++) if (data[k + x] === 1) border.push(k + x);
    return border;
  };

  /** Create a compressed mask with a "white" border (1px border with zero values) for the contour tracing
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @return {Object} border mask: {Uint8Array} data, {int} width, {int} height, {Object} offset
      */
  function prepareMask(mask) {
    var x,
      y,
      w = mask.width,
      data = mask.data,
      minX = mask.bounds.minX,
      maxX = mask.bounds.maxX,
      minY = mask.bounds.minY,
      maxY = mask.bounds.maxY,
      rw = maxX - minX + 3,
      // bounds size +1 px on each side (a "white" border)
      rh = maxY - minY + 3,
      result = new Uint8Array(rw * rh); // reduced mask (bounds size)

    // walk through inner values and copy only "black" points to the result mask
    for (y = minY; y < maxY + 1; y++) for (x = minX; x < maxX + 1; x++) {
      if (data[y * w + x] === 1) result[(y - minY + 1) * rw + (x - minX + 1)] = 1;
    }
    return {
      data: result,
      width: rw,
      height: rh,
      offset: {
        x: minX - 1,
        y: minY - 1
      }
    };
  }
  ;

  /** Create a contour array for the binary mask
      * Algorithm: http://www.sciencedirect.com/science/article/pii/S1077314203001401
      * @param {Object} mask: {Uint8Array} data, {int} width, {int} height, {Object} bounds
      * @return {Array} contours: {Array} points, {bool} inner, {int} label
      */
  lib.traceContours = function (mask) {
    var m = prepareMask(mask),
      contours = [],
      label = 0,
      w = m.width,
      w2 = w * 2,
      h = m.height,
      src = m.data,
      dx = m.offset.x,
      dy = m.offset.y,
      dest = new Uint8Array(src),
      // label matrix
      i,
      j,
      x,
      y,
      k,
      k1,
      c,
      inner,
      dir,
      first,
      second,
      current,
      previous,
      next,
      d;

    // all [dx,dy] pairs (array index is the direction)
    // 5 6 7
    // 4 X 0
    // 3 2 1
    var directions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) {
      k = y * w + x;
      if (src[k] === 1) {
        for (i = -w; i < w2; i += w2) {
          // k - w: outer tracing (y - 1), k + w: inner tracing (y + 1)
          if (src[k + i] === 0 && dest[k + i] === 0) {
            // need contour tracing
            inner = i === w; // is inner contour tracing ?
            label++; // label for the next contour

            c = [];
            dir = inner ? 2 : 6; // start direction
            current = previous = first = {
              x: x,
              y: y
            };
            second = null;
            while (true) {
              dest[current.y * w + current.x] = label; // mark label for the current point 
              // bypass all the neighbors around the current point in a clockwise
              for (j = 0; j < 8; j++) {
                dir = (dir + 1) % 8;

                // get the next point by new direction
                d = directions[dir]; // index as direction
                next = {
                  x: current.x + d[0],
                  y: current.y + d[1]
                };
                k1 = next.y * w + next.x;
                if (src[k1] === 1)
                  // black boundary pixel
                  {
                    dest[k1] = label; // mark a label
                    break;
                  }
                dest[k1] = -1; // mark a white boundary pixel
                next = null;
              }
              if (next === null) break; // no neighbours (one-point contour)
              current = next;
              if (second) {
                if (previous.x === first.x && previous.y === first.y && current.x === second.x && current.y === second.y) {
                  break; // creating the contour completed when returned to original position
                }
              } else {
                second = next;
              }
              c.push({
                x: previous.x + dx,
                y: previous.y + dy
              });
              previous = current;
              dir = (dir + 4) % 8; // next dir (symmetrically to the current direction)
            }
            if (next != null) {
              c.push({
                x: first.x + dx,
                y: first.y + dy
              }); // close the contour
              contours.push({
                inner: inner,
                label: label,
                points: c
              }); // add contour to the list
            }
          }
        }
      }
    }
    return contours;
  };

  /** Simplify contours
      * Algorithms: http://psimpl.sourceforge.net/douglas-peucker.html 
      * http://neerc.ifmo.ru/wiki/index.php?title=%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B8%D0%B3%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9_%D1%86%D0%B5%D0%BF%D0%B8
      * @param {Array} contours: {Array} points, {bool} inner, {int} label
      * @param {float} simplify tolerant
      * @param {int} simplify count: min number of points when the contour is simplified
      * @return {Array} contours: {Array} points, {bool} inner, {int} label, {int} initialCount
      */
  lib.simplifyContours = function (contours, simplifyTolerant, simplifyCount) {
    var lenContours = contours.length,
      result = [],
      i,
      j,
      k,
      c,
      points,
      len,
      resPoints,
      lst,
      stack,
      ids,
      maxd,
      maxi,
      dist,
      r1,
      r2,
      r12,
      dx,
      dy,
      pi,
      pf,
      pl;

    // walk through all contours 
    for (j = 0; j < lenContours; j++) {
      c = contours[j];
      points = c.points;
      len = c.points.length;
      if (len < simplifyCount) {
        // contour isn't simplified
        resPoints = [];
        for (k = 0; k < len; k++) {
          resPoints.push({
            x: points[k].x,
            y: points[k].y
          });
        }
        result.push({
          inner: c.inner,
          label: c.label,
          points: resPoints,
          initialCount: len
        });
        continue;
      }
      lst = [0, len - 1]; // always add first and last points
      stack = [{
        first: 0,
        last: len - 1
      }]; // first processed edge

      do {
        ids = stack.shift();
        if (ids.last <= ids.first + 1)
          // no intermediate points
          {
            continue;
          }
        maxd = -1.0; // max distance from point to current edge
        maxi = ids.first; // index of maximally distant point

        for (i = ids.first + 1; i < ids.last; i++)
        // bypass intermediate points in edge
        {
          // calc the distance from current point to edge
          pi = points[i];
          pf = points[ids.first];
          pl = points[ids.last];
          dx = pi.x - pf.x;
          dy = pi.y - pf.y;
          r1 = Math.sqrt(dx * dx + dy * dy);
          dx = pi.x - pl.x;
          dy = pi.y - pl.y;
          r2 = Math.sqrt(dx * dx + dy * dy);
          dx = pf.x - pl.x;
          dy = pf.y - pl.y;
          r12 = Math.sqrt(dx * dx + dy * dy);
          if (r1 >= Math.sqrt(r2 * r2 + r12 * r12)) dist = r2;else if (r2 >= Math.sqrt(r1 * r1 + r12 * r12)) dist = r1;else dist = Math.abs((dy * pi.x - dx * pi.y + pf.x * pl.y - pl.x * pf.y) / r12);
          if (dist > maxd) {
            maxi = i; // save the index of maximally distant point
            maxd = dist;
          }
        }
        if (maxd > simplifyTolerant)
          // if the max "deviation" is larger than allowed then...
          {
            lst.push(maxi); // add index to the simplified list
            stack.push({
              first: ids.first,
              last: maxi
            }); // add the left part for processing
            stack.push({
              first: maxi,
              last: ids.last
            }); // add the right part for processing
          }
      } while (stack.length > 0);
      resPoints = [];
      len = lst.length;
      lst.sort(function (a, b) {
        return a - b;
      }); // restore index order
      for (k = 0; k < len; k++) {
        resPoints.push({
          x: points[lst[k]].x,
          y: points[lst[k]].y
        }); // add result points to the correct order
      }
      result.push({
        inner: c.inner,
        label: c.label,
        points: resPoints,
        initialCount: c.points.length
      });
    }
    return result;
  };
  return lib;
}
;
;// ./src/js/utils/datastore.mjs
function datastore_slicedToArray(r, e) { return datastore_arrayWithHoles(r) || datastore_iterableToArrayLimit(r, e) || datastore_unsupportedIterableToArray(r, e) || datastore_nonIterableRest(); }
function datastore_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function datastore_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return datastore_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? datastore_arrayLikeToArray(r, a) : void 0; } }
function datastore_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function datastore_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function datastore_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function datastore_typeof(o) { "@babel/helpers - typeof"; return datastore_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, datastore_typeof(o); }
function datastore_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function datastore_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, datastore_toPropertyKey(o.key), o); } }
function datastore_createClass(e, r, t) { return r && datastore_defineProperties(e.prototype, r), t && datastore_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function datastore_toPropertyKey(t) { var i = datastore_toPrimitive(t, "string"); return "symbol" == datastore_typeof(i) ? i : i + ""; }
function datastore_toPrimitive(t, r) { if ("object" != datastore_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != datastore_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Datastore = /*#__PURE__*/function () {
  function Datastore() {
    datastore_classCallCheck(this, Datastore);
    this._map = new WeakMap();
  }
  return datastore_createClass(Datastore, [{
    key: "set",
    value: function set(element, key, value) {
      if (!this._map.has(element)) {
        this._map.set(element, new Map());
      }
      if (datastore_typeof(key) === 'object') {
        var obj = key;
        var e = this._map.get(element);
        for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = datastore_slicedToArray(_Object$entries[_i], 2),
            _key = _Object$entries$_i[0],
            _value = _Object$entries$_i[1];
          e.set(_key, _value);
        }
      } else {
        this._map.get(element).set(key, value);
      }
    }
  }, {
    key: "get",
    value: function get(element, key) {
      if (!this._map.has(element)) {
        this._map.set(element, new Map());
        return; //return undefined by default
      }
      if (typeof key === 'undefined') {
        return Object.fromEntries(this._map.get(element));
      } else {
        return this._map.get(element).get(key);
      }
    }
  }, {
    key: "remove",
    value: function remove(element, key) {
      if (!this._map.has(element)) {
        return;
      }
      var ret = this._map.get(element)["delete"](key);
      if (this._map.get(element).size === 0) {
        this._map["delete"](element);
      }
      return ret;
    }
  }]);
}();
var datastore = new Datastore();

;// ./src/js/papertools/wand.mjs
function wand_typeof(o) { "@babel/helpers - typeof"; return wand_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, wand_typeof(o); }
function wand_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function wand_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, wand_toPropertyKey(o.key), o); } }
function wand_createClass(e, r, t) { return r && wand_defineProperties(e.prototype, r), t && wand_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function wand_toPropertyKey(t) { var i = wand_toPrimitive(t, "string"); return "symbol" == wand_typeof(i) ? i : i + ""; }
function wand_toPrimitive(t, r) { if ("object" != wand_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != wand_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function wand_callSuper(t, o, e) { return o = wand_getPrototypeOf(o), wand_possibleConstructorReturn(t, wand_isNativeReflectConstruct() ? Reflect.construct(o, e || [], wand_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function wand_possibleConstructorReturn(t, e) { if (e && ("object" == wand_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return wand_assertThisInitialized(t); }
function wand_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function wand_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (wand_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function wand_getPrototypeOf(t) { return wand_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, wand_getPrototypeOf(t); }
function wand_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && wand_setPrototypeOf(t, e); }
function wand_setPrototypeOf(t, e) { return wand_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, wand_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
var WandTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Creates a new instance of the `WandTool` class, enabling users to make precise selections with sophisticated color-based mechanisms.
   * This constructor initializes various properties and configurations that control the behavior of the tool.
   * 
   * @param {paper.PaperScope} paperScope - The PaperScope instance associated with this tool.
   */
  function WandTool(paperScope) {
    var _this;
    wand_classCallCheck(this, WandTool);
    _this = wand_callSuper(this, WandTool, [paperScope]);
    var self = _this;
    var tool = _this.tool;
    _this.paperScope = self.project.paperScope;

    /**
      * Determines whether the reduce mode is active, altering the effect of dragging to create selections.
      * When reduce mode is enabled, dragging reduces the current selection area instead of expanding it.
      *
      * @type {boolean}
      * @default false
      */
    _this.reduceMode = false;
    /**
      * Determines whether the replace mode is active, affecting how the tool interacts with existing selections.
      * In replace mode, the tool replaces the current selection with the new selection.
      *
      * @type {boolean}
      * @default true
      */
    _this.replaceMode = true;
    /**
     * Determines whether the flood mode is active, influencing the behavior of the tool's selection algorithm.
     * When flood mode is enabled, the tool uses a flood-fill approach to create selections.
     * Otherwise, it employs a threshold mask approach.
     *
     * @type {boolean}
     * @default true
     */
    _this.floodMode = true;

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
    _this.colors = {
      pixelAllowed: new _paper.Color({
        red: 0,
        green: 0,
        blue: 100
      }),
      pixelNotAllowed: new _paper.Color({
        red: 100,
        green: 0,
        blue: 0
      }),
      currentItem: new _paper.Color({
        red: 0,
        green: 100,
        blue: 0,
        alpha: 0.5
      }),
      nullColor: new _paper.Color({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
      }),
      //transparent pixels if negative
      defaultColor: new _paper.Color({
        red: 255,
        green: 255,
        blue: 255
      })
    };
    _this.threshold = 10;
    _this.minThreshold = -1;
    _this.maxThreshold = 100;
    _this.startThreshold = 10;

    //colorpicker
    _this.colorPicker = new ColorpickerCursor(10, 7, self.project.toolLayer);
    _this.colorPicker.element.applyRescale();
    _this.MagicWand = makeMagicWand();
    _this.setToolbarControl(new WandToolbar(_this));
    _this.toolbarControl.setThreshold(_this.threshold);
    var callback = function callback() {
      self.getImageData();
    };
    _this.onSelectionChanged = callback;
    _this.extensions.onActivate = function () {
      var item = self.item || self.itemToCreate;
      self.itemLayer = item ? item.layer : null;
      self.getImageData();
      self.project.overlay.viewer.addHandler('animation-finish', callback);
      self.project.overlay.viewer.addHandler('rotate', callback);
      self.colorPicker.element.visible = true;
      self.project.toolLayer.bringToFront();
    };
    _this.extensions.onDeactivate = function (finished) {
      self.project.overlay.viewer.removeHandler('animation-finish', callback);
      self.project.overlay.viewer.removeHandler('rotate', callback);
      self.colorPicker.element.visible = false;
      this.preview && this.preview.remove();
      if (finished) {
        self.finish();
      }
      self.project.toolLayer.sendToBack();
    };
    tool.extensions.onKeyUp = function (ev) {
      if (ev.key == 'a') {
        self.applyChanges();
      }
      if (ev.key == 'e') {
        self.toolbarControl.cycleReduceMode();
      }
      if (ev.key == 'r') {
        self.toolbarControl.cycleReplaceMode();
      }
      if (ev.key == 'f') {
        self.toolbarControl.cycleFloodMode();
      }
    };
    return _this;
  }
  wand_inherits(WandTool, _AnnotationUITool);
  return wand_createClass(WandTool, [{
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      this.startThreshold = this.threshold;
      this.imageData.dragStartMask = this.imageData.binaryMask;
      this.applyMagicWand(ev.original.point);
      this.colorPicker.element.visible = false;
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      var delta = ev.original.point.subtract(ev.original.downPoint).multiply(this.project.getZoom());
      if (this.reduceMode) delta = delta.multiply(-1); //invert effect of dragging when in reduce mode for more intuitive user experience
      var s = Math.round((delta.x + delta.y * -1) / 2);
      this.threshold = Math.min(Math.max(this.startThreshold + s, this.minThreshold), this.maxThreshold);
      if (Number.isNaN(this.threshold)) {
        // console.log('wft nan??');
        console.warn('NaN value for threshold');
      }
      this.toolbarControl.setThreshold(this.threshold);
      this.applyMagicWand(ev.original.downPoint);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.colorPicker.updatePosition(ev.original.point);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(ev) {
      this.colorPicker.element.visible = true;
      this.colorPicker.element.bringToFront();
      // colorPicker.position=ev.point;
      this.colorPicker.updatePosition(ev.original.point);
    }

    /**
     * Finishes the wand tool operation and performs necessary cleanup.
     */
  }, {
    key: "finish",
    value: function finish() {
      // if(item) smoothAndSimplify(item);
      this.itemLayer = null;
      this.preview && this.preview.remove();
      this.deactivate();
    }
    /**
     * Sets the threshold value for the magic wand operation.
     * @param {number} t - The threshold value.
     */
  }, {
    key: "setThreshold",
    value: function setThreshold(t) {
      this.threshold = parseInt(t);
    }
    /**
     * Sets whether the reduce mode is enabled.
     * @param {boolean} erase - Whether to enable reduce mode.
     */
  }, {
    key: "setReduceMode",
    value: function setReduceMode(erase) {
      this.reduceMode = erase;
      this.getImageData(); //reset the masks
    }
    /**
     * Sets whether the flood mode is enabled.
     * @param {boolean} flood - Whether to enable flood mode.
     */
  }, {
    key: "setFloodMode",
    value: function setFloodMode(flood) {
      this.floodMode = flood;
    }
    /**
     * Sets whether the replace mode is enabled.
     * @param {boolean} replace - Whether to enable replace mode.
     */
  }, {
    key: "setReplaceMode",
    value: function setReplaceMode(replace) {
      this.replaceMode = replace;
    }
    /**
     * Applies changes based on the magic wand selection.
     */
  }, {
    key: "applyChanges",
    value: function applyChanges() {
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('MultiPolygon');
        this.refreshItems();
      }
      var wandOutput = {
        width: this.imageData.width,
        height: this.imageData.height,
        data: this.imageData.wandMask,
        bounds: {
          minX: 0,
          minY: 0,
          maxX: this.preview.width,
          maxY: this.preview.height
        }
      };
      if (this.reduceMode) {
        var toSubtract = maskToPath(this.MagicWand, wandOutput);
        toSubtract.translate(-1, -1); // adjust path to account for pixel offset of maskToPath algorithm. Value of 1 is empirical.
        toSubtract.translate(-this.preview.width / 2, -this.preview.height / 2);
        toSubtract.matrix = this.preview.matrix;
        toSubtract.transform(this.item.layer.matrix.inverted());
        var subtracted = this.item.subtract(toSubtract, false).toCompoundPath();
        toSubtract.remove();
        this.item.children = subtracted.children;
      } else {
        var toUnite = maskToPath(this.MagicWand, wandOutput);
        toUnite.translate(-1, -1); // adjust path to account for pixel offset of maskToPath algorithm. Value of 1 is empirical.
        toUnite.translate(-this.preview.width / 2, -this.preview.height / 2);
        toUnite.matrix = this.preview.matrix;
        toUnite.transform(this.item.layer.matrix.inverted());
        var boundingItems = this.itemLayer ? this.itemLayer.getItems({
          match: function match(i) {
            return i.isBoundingElement;
          }
        }) : [];
        // intersect toUnite with each of the bounding items
        if (boundingItems.length > 0) {
          toUnite.children = boundingItems.map(function (boundingItem) {
            return boundingItem.intersect(toUnite);
          });
        }
        var united = this.item.unite(toUnite, false).toCompoundPath();
        toUnite.remove();
        this.item.children = united.children;
      }
      this.getImageData();
    }
  }, {
    key: "getImageData",
    value:
    /**
     * Retrieves image data for processing the magic wand operation.
     */
    function getImageData() {
      var self = this;
      var imageData = self.project.overlay.getImageData();
      var viewportGroup = new _paper.Group({
        children: [],
        insert: false
      });
      var b = self.tool.view.bounds;
      var viewportPath = new _paper.Path(b.topLeft, b.topRight, b.bottomRight, b.bottomLeft);
      viewportPath.strokeWidth = 0;
      viewportGroup.addChild(viewportPath.clone());
      viewportGroup.addChild(viewportPath);
      viewportGroup.clipped = true;
      var boundingItems = this.itemLayer ? this.itemLayer.getItems({
        match: function match(i) {
          return i.isBoundingElement;
        }
      }) : [];
      //allow all pixels if no bounding item, otherwise disallow all and then allow those inside the bounding item(s);
      viewportPath.fillColor = boundingItems.length == 0 ? self.colors.pixelAllowed : self.colors.pixelNotAllowed;
      boundingItems.forEach(function (item) {
        var clone = item.clone({
          insert: false
        });
        clone.transform(self.item.layer.matrix);
        clone.fillColor = self.colors.pixelAllowed;
        clone.strokeWidth = 0;
        viewportGroup.addChild(clone);
      });
      if (self.item) {
        var clone = self.item.clone({
          insert: false
        });
        clone.transform(self.item.layer.matrix);
        clone.fillColor = self.colors.currentItem;
        clone.strokeWidth = 0;
        clone.selected = false;
        viewportGroup.addChild(clone);
      }
      viewportGroup.selected = false;

      //hide all annotation layers; add the viewportGroup; render; get image data; remove viewportGroup; restore visibility of layers
      // let annotationLayers = self.project.paperScope.project.layers.filter(l=>l.isGeoJSONFeatureCollection);
      var annotations = self.project.paperScope.project.getItems({
        match: function match(l) {
          return l.isGeoJSONFeatureCollection;
        }
      });
      var visibility = annotations.map(function (l) {
        return l.visible;
      });
      annotations.forEach(function (l) {
        return l.visible = false;
      });
      self.project.toolLayer.addChild(viewportGroup);
      self.tool.view.update();
      var cm = self.tool.view.getImageData();
      viewportGroup.remove();
      annotations.forEach(function (l, index) {
        return l.visible = visibility[index];
      });
      self.tool.view.update();
      self.imageData = {
        width: imageData.width,
        height: imageData.height,
        bytes: 4,
        data: imageData.data,
        binaryMask: new Uint8ClampedArray(imageData.width * imageData.height),
        wandMask: new Uint8ClampedArray(imageData.width * imageData.height),
        colorMask: cm
      };
      // self.imageData.binaryMask = new Uint8ClampedArray(self.imageData.width * self.imageData.height);
      for (var i = 0, m = 0; i < self.imageData.data.length; i += self.imageData.bytes, m += 1) {
        self.imageData.binaryMask[m] = self.imageData.colorMask.data[i + 1] ? 1 : 0; //green channel is for current item
      }
      if (self.item && self.item.isGeoJSONFeature && self.item.getArea()) {
        getAverageColor(self.item).then(function (sampleColor) {
          var c = [sampleColor.red * 255, sampleColor.green * 255, sampleColor.blue * 255];
          self.imageData.sampleColor = c;
          self.rasterPreview(self.imageData.binaryMask, c);
        });
      } else {
        self.rasterPreview(self.imageData.binaryMask);
      }
    }
    /**
     * Applies the magic wand effect based on the current mouse point.
     * @param {paper.Point} eventPoint - The point where the magic wand is applied.
     */
  }, {
    key: "applyMagicWand",
    value: function applyMagicWand(eventPoint) {
      var pt = this.paperScope.view.projectToView(eventPoint);
      //account for pixel density
      var r = this.paperScope.view.pixelRatio;
      pt = pt.multiply(r);

      //use floodFill or thresholdMask depending on current selected option
      var magicWandOutput;
      if (this.floodMode) {
        magicWandOutput = this.MagicWand.floodFill(this.imageData, Math.round(pt.x), Math.round(pt.y), this.threshold);
      } else {
        magicWandOutput = this.MagicWand.thresholdMask(this.imageData, Math.round(pt.x), Math.round(pt.y), this.threshold);
      }
      var bm = this.imageData.binaryMask;
      var wm = this.imageData.wandMask;
      var ds = this.imageData.dragStartMask;
      var cm = this.imageData.colorMask.data;
      var mw = magicWandOutput.data;

      //apply rules based on existing mask
      //1) set any pixels outside the bounding area to zero
      //2) if expanding current area, set pixels of existing item to 1
      //3) if reducing current area, use currentMask to remove pixels from existing item
      if (this.replaceMode && !this.reduceMode) {
        //start from the initial item (cm[i+1]>0) and add pixels from magicWandOutput (mw[m]) if allowed (cm[i]==0)
        for (var i = 0, m = 0; i < cm.length; i += this.imageData.bytes, m += 1) {
          bm[m] = cm[i + 1] > 0 || cm[i] == 0 && mw[m];
          wm[m] = mw[m];
        }
      } else if (this.replaceMode && this.reduceMode) {
        //start from initial item (cm[i+1]>0) and remove pixels from mw[m] if allowed (cm[i]==0)
        for (var _i = 0, _m = 0; _i < cm.length; _i += this.imageData.bytes, _m += 1) {
          bm[_m] = cm[_i + 1] > 0 && !(cm[_i] == 0 && mw[_m]);
          wm[_m] = mw[_m];
        }
      } else if (!this.replaceMode && !this.reduceMode) {
        //start from dragstart (ds[m]) and add pixels from mw[m] if allowed (cm[i]==0)
        for (var _i2 = 0, _m2 = 0; _i2 < cm.length; _i2 += this.imageData.bytes, _m2 += 1) {
          bm[_m2] = ds[_m2] || cm[_i2] == 0 && mw[_m2];
          wm[_m2] = wm[_m2] || mw[_m2];
        }
      } else if (!this.replaceMode && this.reduceMode) {
        //start from dragstart (ds[m]) and remove pixels from mw[m] if allowed (cm[i]==0)
        for (var _i3 = 0, _m3 = 0; _i3 < cm.length; _i3 += this.imageData.bytes, _m3 += 1) {
          bm[_m3] = ds[_m3] && !(cm[_i3] == 0 && mw[_m3]);
          wm[_m3] = wm[_m3] || mw[_m3];
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
  }, {
    key: "rasterPreview",
    value: function rasterPreview(binaryMask, sampleColor) {
      var self = this;
      var cmap = {
        0: this.colors.nullColor,
        1: this.colors.defaultColor
      };
      //If a sample color is known, "invert" it for better contrast relative to background image
      if (sampleColor) {
        cmap[1] = new _paper.Color(sampleColor[0], sampleColor[1], sampleColor[2]);
        cmap[1].hue += 180;
        cmap[1].brightness = (180 + cmap[1].brightness) % 360;
      }
      this.preview && this.preview.remove();
      this.preview = this.project.paperScope.overlay.getViewportRaster(false);
      window.preview = this.preview;
      this.project.toolLayer.insertChild(0, this.preview); //add the raster to the bottom of the tool layer

      var c;
      var imdata = this.preview.createImageData(this.preview.size);
      for (var ix = 0, mx = 0; ix < imdata.data.length; ix += 4, mx += 1) {
        c = cmap[binaryMask[mx]];
        imdata.data[ix] = c.red;
        imdata.data[ix + 1] = c.blue;
        imdata.data[ix + 2] = c.green;
        imdata.data[ix + 3] = c.alpha * 255;
      }
      this.preview.setImageData(imdata, new _paper.Point(0, 0));
      function tween1() {
        // console.log('tween1', self.preview.id)
        self.preview.tweenTo({
          opacity: 0.15
        }, {
          duration: 1200,
          easing: 'easeInQuart'
        }).then(tween2);
      }
      function tween2() {
        // console.log('tween2', self.preview.id)
        self.preview.tweenTo({
          opacity: 1
        }, {
          duration: 800,
          easing: 'easeOutCubic'
        }).then(tween1);
      }
      tween1();
    }
  }]);
}(AnnotationUITool);


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
var WandToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Creates a new instance of the `WandToolbar` class, providing users with various options to configure the magic wand tool.
   * This constructor initializes UI elements, buttons, and interactive controls within the toolbar.
   * 
   * @param {WandTool} wandTool - The `WandTool` instance associated with this toolbar.
   */
  function WandToolbar(wandTool) {
    var _this2;
    wand_classCallCheck(this, WandToolbar);
    _this2 = wand_callSuper(this, WandToolbar, [wandTool]);
    var html = makeFaIcon('fa-wand-magic-sparkles');
    html.classList.add('rotate-by');
    html.style.setProperty('--rotate-angle', '270deg');
    _this2.button.configure(html, 'Magic Wand Tool');
    var fdd = document.createElement('div');
    fdd.classList.add('wand-toolbar', 'dropdown');
    fdd.setAttribute('data-tool', 'wand');
    _this2.dropdown.appendChild(fdd);
    var thr = document.createElement('div');
    thr.classList.add('threshold-container');
    fdd.appendChild(thr);
    var label = document.createElement('label');
    thr.appendChild(label);
    label.innerHTML = 'Threshold';
    _this2.thresholdInput = document.createElement('input');
    thr.appendChild(_this2.thresholdInput);
    Object.assign(_this2.thresholdInput, {
      type: 'range',
      min: -1,
      max: 100,
      value: 20
    });
    _this2.thresholdInput.onchange = function () {
      wandTool.setThreshold(this.value);
    };
    var toggles = document.createElement('div');
    toggles.classList.add('toggles');
    fdd.appendChild(toggles);
    var cycleReplaceModeButton = _this2.cycleReplaceModeButton = document.createElement('span');
    cycleReplaceModeButton.classList.add('option-toggle');
    toggles.appendChild(cycleReplaceModeButton);
    datastore.set(cycleReplaceModeButton, {
      prefix: 'On click:',
      actions: [{
        replace: 'Start new mask'
      }, {
        append: 'Add to current'
      }],
      onclick: function onclick(action) {
        wandTool.setReplaceMode(action == 'replace');
      }
    });
    var cycleFloodModeButton = _this2.cycleFloodModeButton = document.createElement('span');
    cycleFloodModeButton.classList.add('option-toggle');
    toggles.appendChild(cycleFloodModeButton);
    datastore.set(cycleFloodModeButton, {
      prefix: 'Fill rule:',
      actions: [{
        flood: 'Contiguous'
      }, {
        everywhere: 'Anywhere'
      }],
      onclick: function onclick(action) {
        wandTool.setFloodMode(action == 'flood');
      }
    });
    var cycleReduceModeButton = _this2.cycleReduceModeButton = document.createElement('span');
    cycleReduceModeButton.classList.add('option-toggle');
    toggles.appendChild(cycleReduceModeButton);
    datastore.set(cycleReduceModeButton, {
      prefix: 'Use to:',
      actions: [{
        expand: 'Expand selection'
      }, {
        reduce: 'Reduce selection'
      }],
      onclick: function onclick(action) {
        wandTool.setReduceMode(action == 'reduce');
      }
    });

    // set up the buttons to cycle through actions for each option
    [cycleReplaceModeButton, cycleFloodModeButton, cycleReduceModeButton].forEach(function (item) {
      var data = datastore.get(item);
      var s = document.createElement('span');
      s.classList.add('label', 'prefix');
      s.innerHTML = data.prefix;
      item.appendChild(s);
      data.actions.forEach(function (action, actionIndex) {
        var text = Object.values(action)[0];
        var key = Object.keys(action)[0];
        var option = document.createElement('span');
        option.classList.add('option');
        option.innerHTML = text;
        item.appendChild(option);
        datastore.set(option, {
          key: key,
          index: actionIndex
        });
        action.htmlElement = option;
        action.key = key;
        if (actionIndex == 0) option.classList.add('selected');
      });
      item.addEventListener('click', function () {
        var _datastore$get;
        var itemData = datastore.get(this);
        var actions = itemData.actions;
        var selectedChild = this.querySelector('.option.selected');
        var currentIndex = (_datastore$get = datastore.get(selectedChild)) === null || _datastore$get === void 0 ? void 0 : _datastore$get.index;
        var nextIndex = typeof currentIndex === 'undefined' ? 0 : (currentIndex + 1) % actions.length;
        var allOptions = this.querySelectorAll('.option');
        allOptions.forEach(function (o) {
          return o.classList.remove('selected');
        });
        var actionToEnable = actions[nextIndex];
        actionToEnable.htmlElement.classList.add('selected');
        itemData.onclick(actionToEnable.key);
      });
    });
    var applyButton = document.createElement('button');
    applyButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    applyButton.setAttribute('data-action', 'apply');
    fdd.appendChild(applyButton);
    applyButton.innerHTML = 'Apply';
    applyButton.onclick = function () {
      wandTool.applyChanges();
    };
    var doneButton = document.createElement('button');
    doneButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    doneButton.setAttribute('data-action', 'done');
    fdd.appendChild(doneButton);
    doneButton.innerHTML = 'Done';
    doneButton.onclick = function () {
      wandTool.finish();
    };
    return _this2;
  }
  /**
   * Check if the toolbar should be enabled for the given mode.
   * The toolbar is enabled when the mode is 'new' or 'MultiPolygon'.
   *
   * @param {string} mode - The mode to check.
   * @returns {boolean} True if the toolbar should be enabled for the given mode; otherwise, false.
   */
  wand_inherits(WandToolbar, _AnnotationUIToolbarB);
  return wand_createClass(WandToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'Polygon', 'MultiPolygon'].includes(mode);
    }
    /**
     * Set the threshold value in the threshold input element.
     *
     * @param {number} thr - The threshold value to set.
     */
  }, {
    key: "setThreshold",
    value: function setThreshold(thr) {
      this.thresholdInput.value = thr;
    }

    /**
     * Cycle through the reduce modes (add, reduce)
     */
  }, {
    key: "cycleReduceMode",
    value: function cycleReduceMode() {
      this.cycleReduceModeButton.dispatchEvent(new Event('click'));
    }

    /**
     * Cycle through the replace modes (replace, expand)
     */
  }, {
    key: "cycleReplaceMode",
    value: function cycleReplaceMode() {
      this.cycleReplaceModeButton.dispatchEvent(new Event('click'));
    }

    /**
     * Cycle through the flood modes (flood, everywhere)
     */
  }, {
    key: "cycleFloodMode",
    value: function cycleFloodMode() {
      this.cycleFloodModeButton.dispatchEvent(new Event('click'));
    }
  }]);
}(AnnotationUIToolbarBase); // /**
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
function maskToPath(MagicWand, mask, border) {
  var minPathArea = 50;
  var path = new _paper.CompoundPath({
    children: [],
    fillRule: 'evenodd',
    insert: false
  });
  if (mask) {
    var morph = new Morph(mask);
    mask = morph.addBorder();
    if (border == 'dilate') morph.dilate();
    mask.bounds = {
      minX: 0,
      minY: 0,
      maxX: mask.width,
      maxY: mask.height
    };
    var contours = MagicWand.traceContours(mask);
    path.children = contours.map(function (c) {
      var pts = c.points.map(function (pt) {
        return new _paper.Point(pt);
      });
      var path = new _paper.Path(pts, {
        insert: false
      });
      path.closed = true;
      return path;
    }).filter(function (p) {
      //Use absolute area since inner (hole) paths will have negative area
      if (Math.abs(p.area) >= minPathArea) {
        return true;
      }
      //if the item is being filtered out for being too small, it must be removed
      // otherwise paper.js memory usage will spike with all the extra hidden
      // path objects that will remain in the active layer (not having been inserted elsewhere)
      p.remove();
    });
  }
  return path; //.reorient(true,'clockwise');
}
;// ./src/js/paper-offset.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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

////// Offset.js
/* Downloaded from https://github.com/glenzli/paperjs-offset/ on 10/9/2021 */
/*
MIT License

Copyright (c) 2016-2019 luz-alphacode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


if (typeof _paper === 'undefined') {
  console.error('paper-offset.mjs requires paper.js to have been loaded');
}

/**
 * Offset the start/terminal segment of a bezier curve
 * @param segment segment to offset
 * @param curve curve to offset
 * @param handleNormal the normal of the the line formed of two handles
 * @param offset offset value
 */
function offsetSegment(segment, curve, handleNormal, offset) {
  var isFirst = segment.curve === curve;
  // get offset vector
  var offsetVector = curve.getNormalAtTime(isFirst ? 0 : 1).multiply(offset);
  // get offset point
  var point = segment.point.add(offsetVector);
  var newSegment = new _paper.Segment(point);
  // handleOut for start segment & handleIn for terminal segment
  var handle = isFirst ? 'handleOut' : 'handleIn';
  newSegment[handle] = segment[handle].add(handleNormal.subtract(offsetVector).divide(2));
  return newSegment;
}
/**
 * Adaptive offset a curve by repeatly apply the approximation proposed by Tiller and Hanson.
 * @param curve curve to offset
 * @param offset offset value
 */
function adaptiveOffsetCurve(curve, offset) {
  var hNormal = new _paper.Curve(curve.segment1.handleOut.add(curve.segment1.point), new _paper.Point(0, 0), new _paper.Point(0, 0), curve.segment2.handleIn.add(curve.segment2.point)).getNormalAtTime(0.5).multiply(offset);
  var segment1 = offsetSegment(curve.segment1, curve, hNormal, offset);
  var segment2 = offsetSegment(curve.segment2, curve, hNormal, offset);
  // divide && re-offset
  var offsetCurve = new _paper.Curve(segment1, segment2);
  // if the offset curve is not self intersected, divide it
  if (offsetCurve.getIntersections(offsetCurve).length === 0) {
    var threshold = Math.min(Math.abs(offset) / 10, 1);
    var midOffset = offsetCurve.getPointAtTime(0.5).getDistance(curve.getPointAtTime(0.5));
    if (Math.abs(midOffset - Math.abs(offset)) > threshold) {
      var subCurve = curve.divideAtTime(0.5);
      if (subCurve != null) {
        return adaptiveOffsetCurve(curve, offset).concat(adaptiveOffsetCurve(subCurve, offset));
      }
    }
  }
  return [segment1, segment2];
}
/**
 * Create a round join segment between two adjacent segments.
 */
function makeRoundJoin(segment1, segment2, originPoint, radius) {
  var through = segment1.point.subtract(originPoint).add(segment2.point.subtract(originPoint)).normalize(Math.abs(radius)).add(originPoint);
  var arc = new _paper.Path.Arc({
    from: segment1.point,
    to: segment2.point,
    through: through,
    insert: false
  });
  segment1.handleOut = arc.firstSegment.handleOut;
  segment2.handleIn = arc.lastSegment.handleIn;
  return arc.segments.length === 3 ? arc.segments[1] : null;
}
function det(p1, p2) {
  return p1.x * p2.y - p1.y * p2.x;
}
/**
 * Get the intersection point of point based lines
 */
function getPointLineIntersections(p1, p2, p3, p4) {
  var l1 = p1.subtract(p2);
  var l2 = p3.subtract(p4);
  var dl1 = det(p1, p2);
  var dl2 = det(p3, p4);
  return new _paper.Point(dl1 * l2.x - l1.x * dl2, dl1 * l2.y - l1.y * dl2).divide(det(l1, l2));
}
/**
 * Connect two adjacent bezier curve, each curve is represented by two segments,
 * create different types of joins or simply removal redundant segment.
 */
function connectAdjacentBezier(segments1, segments2, origin, joinType, offset, limit) {
  var curve1 = new _paper.Curve(segments1[0], segments1[1]);
  var curve2 = new _paper.Curve(segments2[0], segments2[1]);
  var intersection = curve1.getIntersections(curve2);
  var distance = segments1[1].point.getDistance(segments2[0].point);
  if (origin.isSmooth()) {
    segments2[0].handleOut = segments2[0].handleOut.project(origin.handleOut);
    segments2[0].handleIn = segments1[1].handleIn.project(origin.handleIn);
    segments2[0].point = segments1[1].point.add(segments2[0].point).divide(2);
    segments1.pop();
  } else {
    if (intersection.length === 0) {
      if (distance > Math.abs(offset) * 0.1) {
        // connect
        switch (joinType) {
          case 'miter':
            var join = getPointLineIntersections(curve1.point2, curve1.point2.add(curve1.getTangentAtTime(1)), curve2.point1, curve2.point1.add(curve2.getTangentAtTime(0)));
            // prevent sharp angle
            var joinOffset = Math.max(join.getDistance(curve1.point2), join.getDistance(curve2.point1));
            if (joinOffset < Math.abs(offset) * limit) {
              segments1.push(new _paper.Segment(join));
            }
            break;
          case 'round':
            var mid = makeRoundJoin(segments1[1], segments2[0], origin.point, offset);
            if (mid) {
              segments1.push(mid);
            }
            break;
        }
      } else {
        segments2[0].handleIn = segments1[1].handleIn;
        segments1.pop();
      }
    } else {
      var second1 = curve1.divideAt(intersection[0]);
      if (second1) {
        var join = second1.segment1;
        var second2 = curve2.divideAt(curve2.getIntersections(curve1)[0]);
        join.handleOut = second2 ? second2.segment1.handleOut : segments2[0].handleOut;
        segments1.pop();
        segments2[0] = join;
      } else {
        segments2[0].handleIn = segments1[1].handleIn;
        segments1.pop();
      }
    }
  }
}
/**
 * Connect all the segments together.
 */
function connectBeziers(rawSegments, join, source, offset, limit) {
  var originSegments = source.segments;
  if (rawSegments.length == 0) return source.segments;
  var first = rawSegments[0].slice();
  for (var i = 0; i < rawSegments.length - 1; ++i) {
    connectAdjacentBezier(rawSegments[i], rawSegments[i + 1], originSegments[i + 1], join, offset, limit);
  }
  if (source.closed) {
    connectAdjacentBezier(rawSegments[rawSegments.length - 1], first, originSegments[0], join, offset, limit);
    rawSegments[0][0] = first[0];
  }
  return rawSegments;
}
function reduceSingleChildCompoundPath(path) {
  if (path.children.length === 1) {
    path = path.children[0];
    path.remove(); // remove from parent, this is critical, or the style attributes will be ignored
  }
  return path;
}
/** Normalize a path, always clockwise, non-self-intersection, ignore really small components, and no one-component compound path. */
function normalize(path, areaThreshold) {
  if (areaThreshold === void 0) {
    areaThreshold = 0.01;
  }
  if (path.closed) {
    var ignoreArea_1 = Math.abs(path.area * areaThreshold);
    if (!path.clockwise) {
      path.reverse();
    }
    path = path.unite(path, {
      insert: false
    });
    if (path instanceof _paper.CompoundPath) {
      path.children.filter(function (c) {
        return Math.abs(c.area) < ignoreArea_1;
      }).forEach(function (c) {
        return c.remove();
      });
      if (path.children.length === 1) {
        return reduceSingleChildCompoundPath(path);
      }
    }
  }
  return path;
}
function isSameDirection(partialPath, fullPath) {
  var offset1 = partialPath.segments[0].location.offset;
  var offset2 = partialPath.segments[Math.max(1, Math.floor(partialPath.segments.length / 2))].location.offset;
  var sampleOffset = (offset1 + offset2) / 3;
  var originOffset1 = fullPath.getNearestLocation(partialPath.getPointAt(sampleOffset)).offset;
  var originOffset2 = fullPath.getNearestLocation(partialPath.getPointAt(2 * sampleOffset)).offset;
  return originOffset1 < originOffset2;
}
/** Remove self intersection when offset is negative by point direction dectection. */
function removeIntersection(path) {
  if (path.closed) {
    var newPath = path.unite(path, {
      insert: false
    });
    if (newPath instanceof _paper.CompoundPath) {
      newPath.children.filter(function (c) {
        if (c.segments.length > 1) {
          return !isSameDirection(c, path);
        } else {
          return true;
        }
      }).forEach(function (c) {
        return c.remove();
      });
      return reduceSingleChildCompoundPath(newPath);
    }
  }
  return path;
}
function getSegments(path) {
  if (path instanceof _paper.CompoundPath) {
    return path.children.map(function (c) {
      return c.segments;
    }).flat();
  } else {
    return path.segments;
  }
}
/**
 * Remove impossible segments in negative offset condition.
 */
function removeOutsiders(newPath, path) {
  var segments = getSegments(newPath).slice();
  segments.forEach(function (segment) {
    if (!path.contains(segment.point)) {
      segment.remove();
    }
  });
}
function preparePath(path, offset) {
  var source = path.clone({
    insert: false
  });
  source.reduce({});
  if (!path.clockwise) {
    source.reverse();
    offset = -offset;
  }
  return [source, offset];
}
function offsetSimpleShape(path, offset, join, limit) {
  var _a;
  var source;
  _a = preparePath(path, offset), source = _a[0], offset = _a[1];
  var curves = source.curves.slice();
  var offsetCurves = curves.map(function (curve) {
    return adaptiveOffsetCurve(curve, offset);
  }).flat();
  var raws = [];
  for (var i = 0; i < offsetCurves.length; i += 2) {
    raws.push(offsetCurves.slice(i, i + 2));
  }
  var segments = connectBeziers(raws, join, source, offset, limit).flat();
  var newPath = removeIntersection(new _paper.Path({
    segments: segments,
    insert: false,
    closed: path.closed
  }));
  newPath.reduce({});
  if (source.closed && (source.clockwise && offset < 0 || !source.clockwise && offset > 0)) {
    removeOutsiders(newPath, path);
  }
  // recovery path
  if (source.clockwise !== path.clockwise) {
    newPath.reverse();
  }
  return normalize(newPath);
}
function makeRoundCap(from, to, offset) {
  var origin = from.point.add(to.point).divide(2);
  var normal = to.point.subtract(from.point).rotate(-90, new _paper.Point(0, 0)).normalize(offset);
  var through = origin.add(normal);
  var arc = new _paper.Path.Arc({
    from: from.point,
    to: to.point,
    through: through,
    insert: false
  });
  return arc.segments;
}
function connectSide(outer, inner, offset, cap) {
  if (outer instanceof _paper.CompoundPath) {
    var cs = outer.children.map(function (c) {
      return {
        c: c,
        a: Math.abs(c.area)
      };
    });
    cs = cs.sort(function (c1, c2) {
      return c2.a - c1.a;
    });
    outer = cs[0].c;
  }
  var oSegments = outer.segments.slice();
  var iSegments = inner.segments.slice();
  switch (cap) {
    case 'round':
      var heads = makeRoundCap(iSegments[iSegments.length - 1], oSegments[0], offset);
      var tails = makeRoundCap(oSegments[oSegments.length - 1], iSegments[0], offset);
      var result = new _paper.Path({
        segments: heads.concat(oSegments, tails, iSegments),
        closed: true,
        insert: false
      });
      result.reduce({});
      return result;
    default:
      return new _paper.Path({
        segments: oSegments.concat(iSegments),
        closed: true,
        insert: false
      });
  }
}
function offsetSimpleStroke(path, offset, join, cap, limit) {
  offset = path.clockwise ? offset : -offset;
  var positiveOffset = offsetSimpleShape(path, offset, join, limit);
  var negativeOffset = offsetSimpleShape(path, -offset, join, limit);
  if (path.closed) {
    return positiveOffset.subtract(negativeOffset, {
      insert: false
    });
  } else {
    var inner = negativeOffset;
    var holes = new Array();
    if (negativeOffset instanceof _paper.CompoundPath) {
      holes = negativeOffset.children.filter(function (c) {
        return c.closed;
      });
      holes.forEach(function (h) {
        return h.remove();
      });
      inner = negativeOffset.children[0];
    }
    inner.reverse();
    var _final = connectSide(positiveOffset, inner, offset, cap);
    if (holes.length > 0) {
      for (var _i = 0, holes_1 = holes; _i < holes_1.length; _i++) {
        var hole = holes_1[_i];
        _final = _final.subtract(hole, {
          insert: false
        });
      }
    }
    return _final;
  }
}
function getNonSelfItersectionPath(path) {
  if (path.closed) {
    return path.unite(path, {
      insert: false
    });
  }
  return path;
}
function offsetPath(path, offset, join, limit) {
  var nonSIPath = getNonSelfItersectionPath(path);
  var result = nonSIPath;
  if (nonSIPath instanceof _paper.Path) {
    result = offsetSimpleShape(nonSIPath, offset, join, limit);
  } else {
    var offsetParts = nonSIPath.children.map(function (c) {
      if (c.segments.length > 1) {
        if (!isSameDirection(c, path)) {
          c.reverse();
        }
        var offseted = offsetSimpleShape(c, offset, join, limit);
        offseted = normalize(offseted);
        if (offseted.clockwise !== c.clockwise) {
          offseted.reverse();
        }
        if (offseted instanceof _paper.CompoundPath) {
          offseted.applyMatrix = true;
          return offseted.children;
        } else {
          return offseted;
        }
      } else {
        return null;
      }
    });
    var children = offsetParts.flat().filter(function (c) {
      return !!c;
    });
    result = new _paper.CompoundPath({
      children: children,
      insert: false
    });
  }
  result.copyAttributes(nonSIPath, false);
  result.remove();
  return result;
}
function offsetStroke(path, offset, join, cap, limit) {
  var nonSIPath = getNonSelfItersectionPath(path);
  var result = nonSIPath;
  if (nonSIPath instanceof _paper.Path) {
    result = offsetSimpleStroke(nonSIPath, offset, join, cap, limit);
  } else {
    var children = nonSIPath.children.flatMap(function (c) {
      return offsetSimpleStroke(c, offset, join, cap, limit);
    });
    result = children.reduce(function (c1, c2) {
      return c1.unite(c2, {
        insert: false
      });
    });
  }
  result.strokeWidth = 0;
  result.fillColor = nonSIPath.strokeColor;
  result.shadowBlur = nonSIPath.shadowBlur;
  result.shadowColor = nonSIPath.shadowColor;
  result.shadowOffset = nonSIPath.shadowOffset;
  return result;
}
// TO DO: does this need to be modified to work with multiple paperScopes?
var PaperOffset = /** @class */function () {
  function PaperOffset() {}
  PaperOffset.offset = function (path, offset, options) {
    options = options || {};
    var newPath = offsetPath(path, offset, options.join || 'miter', options.limit || 10);
    if (options.insert === undefined) {
      options.insert = true;
    }
    if (options.insert) {
      (path.parent || _paper.project.activeLayer).addChild(newPath);
    }
    return newPath;
  };
  PaperOffset.offsetStroke = function (path, offset, options) {
    options = options || {};
    var newPath = offsetStroke(path, offset, options.join || 'miter', options.cap || 'butt', options.limit || 10);
    if (options.insert === undefined) {
      options.insert = true;
    }
    if (options.insert) {
      (path.parent || _paper.project.activeLayer).addChild(newPath);
    }
    return newPath;
  };
  return PaperOffset;
}();

;// ./src/js/papertools/brush.mjs
function brush_typeof(o) { "@babel/helpers - typeof"; return brush_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, brush_typeof(o); }
function brush_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function brush_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, brush_toPropertyKey(o.key), o); } }
function brush_createClass(e, r, t) { return r && brush_defineProperties(e.prototype, r), t && brush_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function brush_toPropertyKey(t) { var i = brush_toPrimitive(t, "string"); return "symbol" == brush_typeof(i) ? i : i + ""; }
function brush_toPrimitive(t, r) { if ("object" != brush_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != brush_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function brush_callSuper(t, o, e) { return o = brush_getPrototypeOf(o), brush_possibleConstructorReturn(t, brush_isNativeReflectConstruct() ? Reflect.construct(o, e || [], brush_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function brush_possibleConstructorReturn(t, e) { if (e && ("object" == brush_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return brush_assertThisInitialized(t); }
function brush_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function brush_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (brush_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function brush_getPrototypeOf(t) { return brush_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, brush_getPrototypeOf(t); }
function brush_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && brush_setPrototypeOf(t, e); }
function brush_setPrototypeOf(t, e) { return brush_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, brush_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a brush tool for creating and modifying annotations.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 * @description The `BrushTool` constructor initialize a brush tool for creating and modifying annotations. It inherits from the `AnnotationUITool` class and includes methods to configure the tool's behavior, set the radius, set erase mode, and handle mouse events for drawing and erasing.
 */
var BrushTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
  * Create a BrushTool instance.
  * @param {paper.PaperScope} paperScope - The Paper.js PaperScope instance.
  * @property {paper.Tool} tool - The Paper.js tool instance for handling mouse events.
  * @property {boolean} eraseMode - A flag indicating whether the tool is in Erase Mode or Draw Mode.
  * @property {paper.Color} drawColor - The color for drawing strokes.
  * @property {paper.Color} eraseColor - The color for erasing strokes.
  * @property {number} radius - The current radius of the brush tool.
  * @property {paper.Shape.Circle} cursor - The Paper.js Shape.Circle representing the cursor.
  * @property {paper.Group} pathGroup - The Paper.js Group containing the drawing path and the cursor.
  * @description This constructor initializes a new brush tool instance with configurable properties, including the erase mode, draw and erase colors, brush radius, and user interaction handlers.
  */
  function BrushTool(paperScope) {
    var _this;
    brush_classCallCheck(this, BrushTool);
    _this = brush_callSuper(this, BrushTool, [paperScope]);
    var self = _this;
    _this.setToolbarControl(new BrushToolbar(_this));
    _this.eraseMode = false;
    _this.drawColor = new _paper.Color('green');
    _this.eraseColor = new _paper.Color('red');
    _this.drawColor.alpha = 0.5;
    _this.eraseColor.alpha = 0.5;
    _this.autoSimplify = false;
    _this.radius = 0;
    _this.cursor = new _paper.Shape.Circle(new _paper.Point(0, 0), _this.radius);
    _this.cursor.set({
      strokeWidth: 1,
      strokeColor: 'black',
      fillColor: _this.drawColor,
      opacity: 1,
      visible: false
    });
    _this.cursor.name = 'brushtool';
    _this.pathGroup = new _paper.Group([new _paper.Path(), new _paper.Path()]);
    self.project.toolLayer.addChild(_this.pathGroup);
    self.project.toolLayer.addChild(_this.cursor);
    _this.extensions.onActivate = function () {
      self.cursor.radius = self.radius / self.project.getZoom();
      self.cursor.strokeWidth = 1 / self.project.getZoom();
      self.cursor.visible = true;
      self.tool.minDistance = 3 / self.project.getZoom();
      self.tool.maxDistance = 10 / self.project.getZoom();
      self.targetLayer.addChild(self.pathGroup);
    };
    _this.extensions.onDeactivate = function (finished) {
      self.cursor.visible = false;
      self.project.toolLayer.addChild(self.pathGroup);
      if (finished) {
        self.finish();
      }
    };
    _this.tool.onMouseWheel = function (ev) {
      // console.log('Wheel event',ev);
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.deltaY == 0) return; //ignore lateral "scrolls"
      self.toolbarControl.updateBrushRadius({
        larger: ev.deltaY < 0
      });
    };
    /**
     * Handle the key down event for the brush tool.
     * @param {paper.KeyEvent} ev - The key down event.
     * @private
     * @description This method handles the key down event for the brush tool, toggling the erase mode using the 'e' key.
     */
    _this.tool.extensions.onKeyDown = function (ev) {
      if (ev.key == 'e') {
        if (self.eraseMode === false) {
          self.setEraseMode(true);
        } else {
          self.eraseMode = 'keyhold';
        }
      }
    };
    /**
     * Handle the key up event for the brush tool.
     * @param {paper.KeyEvent} ev - The key up event.
     * @private
     * @description This method handles the key up event for the brush tool, releasing the erase mode when the 'e' key is released.
     */
    _this.tool.extensions.onKeyUp = function (ev) {
      if (ev.key == 'e' && self.eraseMode == 'keyhold') {
        self.setEraseMode(false);
      }
    };
    return _this;
  }
  brush_inherits(BrushTool, _AnnotationUITool);
  return brush_createClass(BrushTool, [{
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      ev.preventDefault(); //TODO is this necessary?
      ev.stopPropagation();
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('MultiPolygon');
        this.refreshItems();
      }
      this.cursor.position = ev.original.point;
      var path = new _paper.Path([ev.point]);
      path.mode = this.eraseMode ? 'erase' : 'draw';
      path.radius = this.radius / this.project.getZoom();
      var strokeWidth = this.cursor.radius * 2 / this.targetLayer.scaling.x;
      this.pathGroup.lastChild.replaceWith(path);
      this.pathGroup.lastChild.set({
        strokeWidth: strokeWidth,
        fillColor: null,
        strokeCap: 'round'
      });
      if (path.mode == 'erase') {
        this.pathGroup.firstChild.fillColor = this.eraseColor;
        this.pathGroup.lastChild.strokeColor = this.eraseColor;
      } else {
        this.pathGroup.firstChild.fillColor = this.drawColor;
        this.pathGroup.lastChild.strokeColor = this.drawColor;
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(ev) {
      this.modifyArea();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.cursor.position = ev.original.point;
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      this.cursor.position = ev.original.point;
      if (this.item) {
        this.pathGroup.lastChild.add(ev.point);
        this.pathGroup.lastChild.smooth({
          type: 'continuous'
        });
      }
    }
    /**
     * Set the radius of the brush tool.
     * @param {number} r - The new radius value for the brush.
     * @description This method sets the radius of the brush tool, affecting the size of the brush strokes.
     */
  }, {
    key: "setRadius",
    value: function setRadius(r) {
      this.radius = r;
      this.cursor.radius = r / this.project.getZoom();
    }

    /**
     * Set the brush tool to automatically simplify shapes after applying the new brush stroke.
     * @param {number} r - The new radius value for the brush.
     * @description This method sets the radius of the brush tool, affecting the size of the brush strokes.
     */
  }, {
    key: "setAutoSimplify",
    value: function setAutoSimplify(shouldSimplify) {
      this.autoSimplify = !!shouldSimplify;
    }

    /**
         * Set the erase mode of the brush tool.
         * @param {boolean} erase - A flag indicating whether the tool should be in Erase Mode or Draw Mode.
         * @description This method toggles the erase mode of the brush tool, changing whether it adds or subtracts strokes.
         */
  }, {
    key: "setEraseMode",
    value: function setEraseMode(erase) {
      this.eraseMode = erase;
      this.cursor.fillColor = erase ? this.eraseColor : this.drawColor;
      this.toolbarControl.setEraseMode(this.eraseMode);
    }
  }, {
    key: "finish",
    value: function finish() {
      this.deactivate();
    }

    /**
     * Modify the drawn area based on the brush strokes.
     * This method is responsible for creating the final shape by modifying the drawn area with the brush strokes.
     * @private
     */
  }, {
    key: "modifyArea",
    value: function modifyArea() {
      var path = this.pathGroup.lastChild;
      var shape;
      var radius = path.radius / this.targetLayer.scaling.x;
      if (path.segments.length > 1) {
        shape = PaperOffset.offsetStroke(path, radius, {
          join: 'round',
          cap: 'round',
          insert: true
        });
        if (!shape.contains(path.segments[0].point)) {
          console.error('Oops! Bad stroke offset! Trying to correct');
          path.segments[0].point.x += 0.001;
          shape = PaperOffset.offsetStroke(path, radius, {
            join: 'round',
            cap: 'round',
            insert: true
          });
        }
      } else {
        shape = new _paper.Path.RegularPolygon({
          center: path.firstSegment.point,
          radius: radius,
          sides: 360
        });
      }
      shape.strokeWidth = 1 / this.project.getZoom();
      shape.strokeColor = 'black';
      shape.fillColor = 'yellow';
      shape.flatten();
      shape.name = 'shapeobject';
      if (!this.item.isBoundingElement) {
        var boundingItems = this.item.parent.children.filter(function (i) {
          return i.isBoundingElement;
        });
        shape.applyBounds(boundingItems);
      }
      path.visible = false;
      var result;
      if (this.autoSimplify) {
        shape = shape.toCompoundPath();
        this.doSimplify(shape);
      }
      if (this.eraseMode) {
        result = this.item.subtract(shape, {
          insert: false
        });
      } else {
        result = this.item.unite(shape, {
          insert: false
        });
        // The below code is useful for debugging tiny holes in united paths  
        // if(result?.children){
        //     console.log('Num children', result.children.length);
        //     result.children.forEach(c => console.log('area', c.area));
        // }
      }
      if (result) {
        result = result.toCompoundPath();
        var childrenToAdd = result.children.filter(function (c) {
          // filter out holes with tiny area (area <= 10) - an arbitrary, empirical threshold
          return c.area > 0 || Math.abs(c.area) > 10;
        });
        this.item.removeChildren();
        this.item.addChildren(childrenToAdd);
        result.remove();
      }
      shape.remove();
    }
  }]);
}(AnnotationUITool);


/**
 * Represents the Brush Tool's toolbar in the Annotation Toolkit program.
 * This toolbar provides options to set the brush radius and toggle Erase Mode.
 * @extends AnnotationUIToolbarBase
 * @memberof OSDPaperjsAnnotation.BrushTool
 */
var BrushToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
  * Create a BrushToolbar instance.
  * @param {BrushTool} brushTool - The parent BrushTool instance.
  */
  function BrushToolbar(brushTool) {
    var _this2;
    brush_classCallCheck(this, BrushToolbar);
    _this2 = brush_callSuper(this, BrushToolbar, [brushTool]);
    var i = makeFaIcon('fa-brush');
    i.classList.add('rotate-by');
    i.style.setProperty('--rotate-angle', '225deg');
    _this2.button.configure(i, 'Brush Tool');
    var fdd = document.createElement('div');
    fdd.classList.add('dropdown', 'brush-toolbar');
    fdd.setAttribute('data-tool', 'brush');
    _this2.dropdown.appendChild(fdd);
    var label = document.createElement('label');
    label.innerHTML = 'Radius';
    fdd.appendChild(label);
    var defaultRadius = 20;
    _this2.rangeInput = document.createElement('input');
    fdd.appendChild(_this2.rangeInput);
    Object.assign(_this2.rangeInput, {
      type: 'range',
      min: 1,
      max: 100,
      step: 1,
      value: defaultRadius
    });
    _this2.rangeInput.addEventListener('change', function () {
      brushTool.setRadius(this.value);
    });
    _this2.eraseButton = document.createElement('button');
    fdd.appendChild(_this2.eraseButton);
    _this2.eraseButton.innerHTML = 'Eraser';
    _this2.eraseButton.setAttribute('data-action', 'erase');
    _this2.eraseButton.addEventListener('click', function () {
      var erasing = this.classList.toggle('active');
      brushTool.setEraseMode(erasing);
    });
    setTimeout(function () {
      return brushTool.setRadius(defaultRadius);
    }, 0);
    return _this2;
  }
  /**
   * Check if the Brush Tool is enabled for the given mode.
   * @param {string} mode - The current mode of the Annotation Toolkit program.
   * @returns {boolean} A flag indicating if the Brush Tool is enabled for the given mode.
   */
  brush_inherits(BrushToolbar, _AnnotationUIToolbarB);
  return brush_createClass(BrushToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'Polygon', 'MultiPolygon'].includes(mode);
    }
    /**
     * Update the brush radius based on the provided update.
     * @param {Object} update - The update object specifying whether to make the brush radius larger or smaller.
     * @property {boolean} update.larger - A flag indicating whether to make the brush radius larger or smaller.
     */
  }, {
    key: "updateBrushRadius",
    value: function updateBrushRadius(update) {
      if (update.larger) {
        this.rangeInput.value = parseInt(this.rangeInput.value) + parseInt(this.rangeInput.step);
        this.rangeInput.dispatchEvent(new Event('change'));
      } else {
        this.rangeInput.value = parseInt(this.rangeInput.value) - parseInt(this.rangeInput.step);
        this.rangeInput.dispatchEvent(new Event('change'));
      }
    }
    /**
     * Set the Erase Mode on the toolbar.
     * @param {boolean} erasing - A flag indicating whether the Erase Mode is active or not.
     */
  }, {
    key: "setEraseMode",
    value: function setEraseMode(erasing) {
      erasing ? this.eraseButton.classList.add('active') : this.eraseButton.classList.remove('active');
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/paperitems/annotationitem.mjs
function annotationitem_typeof(o) { "@babel/helpers - typeof"; return annotationitem_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, annotationitem_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = annotationitem_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function annotationitem_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function annotationitem_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, annotationitem_toPropertyKey(o.key), o); } }
function annotationitem_createClass(e, r, t) { return r && annotationitem_defineProperties(e.prototype, r), t && annotationitem_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function annotationitem_toPropertyKey(t) { var i = annotationitem_toPrimitive(t, "string"); return "symbol" == annotationitem_typeof(i) ? i : i + ""; }
function annotationitem_toPrimitive(t, r) { if ("object" != annotationitem_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != annotationitem_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents an annotation item that can be used in a map.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var AnnotationItem = /*#__PURE__*/function () {
  /**
   * Creates a new AnnotationItem instance.
   * @param {Object} feature - The GeoJSON feature containing annotation data.
   * @throws {string} Throws an error if the GeoJSON geometry type is invalid.
   * @property {paper.Item|null} _paperItem - The associated paper item of the annotation.
   * @property {Object} _props - The properties of the annotation.
   * @description This constructor initializes a new annotation item based on the provided GeoJSON feature. It validates the GeoJSON geometry type and sets up the associated paper item and properties.
   */
  function AnnotationItem(feature) {
    var _feature$geometry;
    annotationitem_classCallCheck(this, AnnotationItem);
    if (GeometryTypes.includes(((_feature$geometry = feature.geometry) === null || _feature$geometry === void 0 ? void 0 : _feature$geometry.type) || feature.geometry) === false) {
      throw 'Bad GeoJSON Geometry type';
    }
    this._paperItem = null;
    this._props = feature.properties || {};
  }

  /**
   * Tests whether the geojson type and (optional) subtype are supported by this type of annotation item
   * @param { String } type 
   * @param  { String } [subtype] 
   * @returns { Boolean } The base class always returns false; inheritinc classes override this with class-specific logic
   */
  return annotationitem_createClass(AnnotationItem, [{
    key: "_supportsGeoJSONObj",
    value:
    /**
     * @param {Object} obj the GeoJSON object to test
     * @returns {Boolean} whether this object is supported
     */
    function _supportsGeoJSONObj(obj) {
      var _obj$geometry, _obj$geometry2;
      return this.constructor.supportsGeoJSONType((_obj$geometry = obj.geometry) === null || _obj$geometry === void 0 ? void 0 : _obj$geometry.type, (_obj$geometry2 = obj.geometry) === null || _obj$geometry2 === void 0 || (_obj$geometry2 = _obj$geometry2.properties) === null || _obj$geometry2 === void 0 ? void 0 : _obj$geometry2.subtype);
    }

    /**
     * Retrieves the coordinates of the annotation item.
     * @returns {Array} An array of coordinates.
     * @description This method returns an array of coordinates representing the position of the annotation item.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      return [];
    }
    /**
     * Retrieves the properties of the annotation item.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the annotation item.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      return {};
    }
    /**
     * Retrieves the style properties of the annotation item.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the annotation item in JSON format.
     */
  }, {
    key: "getStyleProperties",
    value: function getStyleProperties() {
      return this.paperItem.style.toJSON();
    }
    // static getGeometry(){}
  }, {
    key: "supportsGeoJSONType",
    value:
    /**
     * Tests whether a given GeoJSON geometry type and optional `properties.subtype` are supported
     * @param { String } type
     * @param { String } [subtype]
     */
    function supportsGeoJSONType(type, subtype) {
      return this.constructor.supportsGeoJSONType(type, subtype);
    }
    /**
     * 
     * @returns {Object} object with fields 'type' and optionally 'subtype'
     */
  }, {
    key: "getGeoJSONType",
    value: function getGeoJSONType() {
      return {
        type: undefined,
        subtype: undefined
      };
    }
    /**
     * Retrieves the label of the annotation item.
     * @returns {string} The label.
     * @description This method returns the label associated with the annotation item. It looks for the
     * display name of the associated paper item or falls back to the subtype or type from supported types.
     */
  }, {
    key: "getLabel",
    value: function getLabel() {
      if (this.paperItem.displayName) {
        return this.paperItem.displayName;
      } else {
        var typeInfo = this.getGeoJSONType();
        return typeInfo.subtype || typeInfo.type;
      }
    }
    /**
     * Retrieves the type of the annotation item.
     * @type {string}
     * @description This property returns the type from the supported types associated with the annotation item.
     */
  }, {
    key: "type",
    get: function get() {
      return this.getGeoJSONType().type;
    }
    /**
     * Retrieves the subtype of the annotation item.
     * @type {string}
     * @description This property returns the subtype from the supported types associated with the annotation item.
     */
  }, {
    key: "subtype",
    get: function get() {
      return this.getGeoJSONType().subtype;
    }
  }, {
    key: "paperItem",
    get: function get() {
      return this._paperItem;
    }

    /**
     * 
     * Sets the associated paper item of the annotation item.
     * @param {paper.Item|null} paperItem - The paper item.
     * @description This method sets the associated paper item of the annotation item. It also applies special properties
     * to the paper item to convert it into an annotation item.
     */,
    set: function set(paperItem) {
      this._paperItem = paperItem;
      //apply special properties that make the paper.Item an AnnotationItem
      convertPaperItemToAnnotation(this);
    }

    // default implmentation; can be overridden for custom behavior by subclasses
    /**
     * Sets the style properties of the annotation item.
     * @param {Object} properties - The style properties to set.
     * @description This method sets the style properties of the annotation item using the provided properties object.
     */
  }, {
    key: "setStyle",
    value: function setStyle(properties) {
      this._paperItem && this._paperItem.style.set(properties);
    }

    // default implementation; can be overridden for custom behavior by subclasses
    /**
     * Converts the annotation item to a GeoJSON feature.
     * @returns {Object} The GeoJSON feature.
     * @description This method converts the annotation item into a GeoJSON feature object. It includes the geometry,
     * properties, style, and other relevant information.
     */
  }, {
    key: "toGeoJSONFeature",
    value: function toGeoJSONFeature() {
      var geoJSON = {
        type: 'Feature',
        geometry: this.toGeoJSONGeometry(),
        properties: _objectSpread(_objectSpread({
          label: this.paperItem.displayName,
          selected: this.paperItem.selected
        }, this.getStyleProperties()), {}, {
          userdata: this.paperItem.data.userdata
        })
      };
      return geoJSON;
    }

    // default implementation; can be overridden for custom behavior by subclasses
    /**
     * Converts the annotation item to a GeoJSON geometry.
     * @returns {Object} The GeoJSON geometry.
     * @description This method converts the annotation item into a GeoJSON geometry object, which includes the type,
     * properties, and coordinates of the annotation.
     */
  }, {
    key: "toGeoJSONGeometry",
    value: function toGeoJSONGeometry() {
      var geom = {
        type: this.type,
        properties: this.getProperties(),
        coordinates: this.getCoordinates()
      };
      if (this.subtype) {
        geom.properties = Object.assign(geom.properties, {
          subtype: this.subtype
        });
      }
      return geom;
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type, subtype) {
      return false; // base class returns false
    }
  }, {
    key: "onTransform",
    value: function onTransform() {}
  }]);
}();


/**
 * Array of valid geometry types for GeoJSON.
 * @constant
 * @type {string[]}
 * @private
 * @description This array contains valid geometry types that can be used in GeoJSON features.
 */
var GeometryTypes = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', null];

/**
 * Array of registered constructors for creating AnnotationItem instances.
 * @private
 * @type {Function[]}
 * @description This array stores the registered constructors that can be used to create AnnotationItem instances.
 */
var _constructors = [];

/**
 * Represents a factory for creating and managing AnnotationItem instances.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var AnnotationItemFactory = /*#__PURE__*/function () {
  function AnnotationItemFactory() {
    annotationitem_classCallCheck(this, AnnotationItemFactory);
  } // this._constructors=[];
  /**
   * Register a constructor to the AnnotationItemFactory.
   * @static
   * @param {Function} ctor - The constructor function for creating AnnotationItem instances.
   * @throws {string} Throws an error if the provided constructor does not implement the necessary API.
   * @description This static method registers a constructor to the AnnotationItemFactory. It checks whether the constructor implements the required static accessor supportsGeoJSONType.
   */
  return annotationitem_createClass(AnnotationItemFactory, null, [{
    key: "register",
    value: function register(ctor) {
      //test whether the object has implemented the necessary API
      if (ctor.supportsGeoJSONType === AnnotationItem.supportsGeoJSONType) {
        console.error('Static accessor supportsGeoJSONType must be implemented');
        throw 'Static accessor supportsGeoJSONType must be implemented';
      }
      if (!_constructors.includes(ctor)) {
        _constructors.push(ctor);
      }
    }
    /**
     * Get a constructor for creating an AnnotationItem instance based on a GeoJSON feature.
     * @static
     * @param {Object} geoJSON - The GeoJSON feature object.
     * @returns {Function|undefined} A constructor function or undefined if no matching constructor is found.
     * @description This static method retrieves a constructor from the registered constructors based on the provided GeoJSON feature. It matches the geometry type and subtype to determine the appropriate constructor.
     */
  }, {
    key: "getConstructor",
    value: function getConstructor(geoJSON) {
      var _geoJSON$geometry, _geoJSON$geometry2;
      if (!('geometry' in geoJSON && 'properties' in geoJSON)) {
        console.error('Invalid GeoJSON Feature object. Returning undefined.');
        return;
      }
      var geomType = (_geoJSON$geometry = geoJSON.geometry) === null || _geoJSON$geometry === void 0 ? void 0 : _geoJSON$geometry.type;
      var geomSubtype = (_geoJSON$geometry2 = geoJSON.geometry) === null || _geoJSON$geometry2 === void 0 || (_geoJSON$geometry2 = _geoJSON$geometry2.properties) === null || _geoJSON$geometry2 === void 0 ? void 0 : _geoJSON$geometry2.subtype;
      var constructors = _constructors.filter(function (c) {
        return c.supportsGeoJSONType(geomType, geomSubtype);
      });
      return constructors.slice(-1)[0]; //return the most recent constructor that supports this type
    }
    /**
     * Create an AnnotationItem instance from a GeoJSON feature.
     * @static
     * @param {Object} geoJSON - The GeoJSON feature object.
     * @returns {paper.Item|undefined} A paper.Item instance or undefined if no matching constructor is found.
     * @description This static method creates an AnnotationItem instance from a GeoJSON feature. It retrieves a matching constructor based on the GeoJSON geometry type and subtype, and then creates an AnnotationItem instance using that constructor.
     */
  }, {
    key: "itemFromGeoJSON",
    value: function itemFromGeoJSON(geoJSON) {
      if (GeometryTypes.includes(geoJSON.type)) {
        geoJSON = {
          type: 'Feature',
          geometry: geoJSON,
          properties: {}
        };
      }
      var ctor = AnnotationItemFactory.getConstructor(geoJSON);
      if (ctor) {
        var _geoJSON$properties;
        var annotationItem = new ctor(geoJSON);
        annotationItem.paperItem.data.userdata = (_geoJSON$properties = geoJSON.properties) === null || _geoJSON$properties === void 0 ? void 0 : _geoJSON$properties.userdata;
        return annotationItem.paperItem;
      }
    }
    /**
     * Create an AnnotationItem instance from an existing AnnotationItem.
     * @static
     * @param {paper.Item} item - The paper.Item instance associated with an AnnotationItem.
     * @returns {paper.Item|undefined} A paper.Item instance created from the AnnotationItem, or undefined if the item is not associated with an AnnotationItem.
     * @description This static method creates a new paper.Item instance based on an existing AnnotationItem. It retrieves the underlying AnnotationItem and converts it to a GeoJSON feature. Then, it creates a new paper.Item using the `itemFromGeoJSON` method of the AnnotationItemFactory.
     */
  }, {
    key: "itemFromAnnotationItem",
    value: function itemFromAnnotationItem(item) {
      if (!item.annotationItem) {
        error('Only paper.Items constructed by AnnotationItem implementations are supported');
        return;
      }
      var geoJSON = {
        type: 'Feature',
        geometry: item.annotationItem.toGeoJSONGeometry(),
        properties: item.annotationItem._props
      };
      return AnnotationItemFactory.itemFromGeoJSON(geoJSON);
    }
  }]);
}();


/**
 * Convert a Paper.js item into an AnnotationItem.
 * @private
 * @param {AnnotationItem} annotationItem - The AnnotationItem instance.
 * @description This function takes an AnnotationItem instance and converts the associated paper item into an
 * AnnotationItem by enhancing it with special properties and behaviors.
 */
function convertPaperItemToAnnotation(annotationItem) {
  var item = annotationItem.paperItem;
  var constructor = annotationItem.constructor;
  var properties = annotationItem._props;
  AnnotationToolkit.registerFeature(item);
  item.onTransform = constructor.onTransform;

  //style
  annotationItem.setStyle(properties);

  //set fillOpacity property based on initial fillColor alpha value
  item.fillOpacity = item.fillColor ? item.fillColor.alpha : 1;

  //displayName
  item.displayName = properties.label || annotationItem.getLabel();
  item.annotationItem = annotationItem;

  //enhance replaceWith functionatily
  item.replaceWith = enhancedReplaceWith;

  //selected or not
  if ('selected' in properties) {
    item.selected = properties.selected;
  }
}

/**
 * Enhance the `replaceWith` functionality of Paper.js items.
 * @private
 * @param {paper.Item} newItem - The new item to replace with.
 * @returns {paper.Item} The replaced item.
 * @description This function enhances the `replaceWith` functionality of Paper.js items by providing additional
 * behaviors and properties for the replacement item.
 */
function enhancedReplaceWith(newItem) {
  if (!newItem.isGeoJSONFeature) {
    console.warn('An item with isGeoJSONFeature==false was used to replace an item.');
  }
  newItem._callbacks = this._callbacks;
  var rescale = osd.extend(true, this.rescale, newItem.rescale);
  newItem.style = this.style; //to do: make this work with rescale properties, so that rescale.strokeWidth doesn't overwrite other props
  newItem.rescale = rescale;
  //replace in the paper hierarchy
  this.emit('item-replaced', {
    item: newItem
  });
  newItem.project.emit('item-replaced', {
    item: newItem
  });
  _paper.Item.prototype.replaceWith.call(this, newItem);
  newItem.selected = this.selected;
  newItem.updateFillOpacity();
  newItem.applyRescale();
  newItem.project.view.update();
  return newItem;
}
;// ./src/js/paperitems/point.mjs
function point_typeof(o) { "@babel/helpers - typeof"; return point_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, point_typeof(o); }
function _construct(t, e, r) { if (point_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && point_setPrototypeOf(p, r.prototype), p; }
function point_toConsumableArray(r) { return point_arrayWithoutHoles(r) || point_iterableToArray(r) || point_unsupportedIterableToArray(r) || point_nonIterableSpread(); }
function point_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function point_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return point_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? point_arrayLikeToArray(r, a) : void 0; } }
function point_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function point_arrayWithoutHoles(r) { if (Array.isArray(r)) return point_arrayLikeToArray(r); }
function point_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function point_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function point_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, point_toPropertyKey(o.key), o); } }
function point_createClass(e, r, t) { return r && point_defineProperties(e.prototype, r), t && point_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function point_toPropertyKey(t) { var i = point_toPrimitive(t, "string"); return "symbol" == point_typeof(i) ? i : i + ""; }
function point_toPrimitive(t, r) { if ("object" != point_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != point_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function point_callSuper(t, o, e) { return o = point_getPrototypeOf(o), point_possibleConstructorReturn(t, point_isNativeReflectConstruct() ? Reflect.construct(o, e || [], point_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function point_possibleConstructorReturn(t, e) { if (e && ("object" == point_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return point_assertThisInitialized(t); }
function point_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function point_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (point_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function point_getPrototypeOf(t) { return point_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, point_getPrototypeOf(t); }
function point_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && point_setPrototypeOf(t, e); }
function point_setPrototypeOf(t, e) { return point_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, point_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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




// import { makeFaIcon } from "../utils/faIcon.mjs";

/**
 * Represents a point annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Point` class represents a point annotation item. It inherits from the `AnnotationItem` class and provides methods to work with point annotations.
 */
var Point = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Point instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @property {paper.Group} _paperItem - The associated paper item representing the point.
   * @description This constructor initializes a new point annotation item based on the provided GeoJSON object. It creates a visual representation of a point annotation with an icon and a circle.
   */
  function Point(geoJSON) {
    var _this;
    point_classCallCheck(this, Point);
    _this = point_callSuper(this, Point, [geoJSON]);
    if (geoJSON.geometry.type !== 'Point') {
      error('Bad geoJSON object: type !=="Point"');
    }
    var radius = 6.0;
    var coords = geoJSON.geometry.coordinates.slice(0, 2);
    var point = new _paper.Group();
    point.pivot = new _paper.Point(0, 0);
    point.applyMatrix = true;
    var circle = new _paper.Path.Circle(new _paper.Point(0, 0), radius);
    circle.scale(new _paper.Point(1, 0.5), new _paper.Point(0, 0));
    point.addChild(circle);
    var stem = new _paper.Path.Line(new _paper.Point(0, 0), new _paper.Point(0, -radius));
    point.addChild(stem);
    var ball = new _paper.Path.Circle(new _paper.Point(0, -radius * 1.5), radius / 2);
    point.addChild(ball);
    point.position = _construct(_paper.Point, point_toConsumableArray(coords));
    point.scaleFactor = point.project._scope.scaleByCurrentZoom(1);
    point.scale(point.scaleFactor, circle.bounds.center);
    point.rescale = point.rescale || {};
    point.rescale.size = function (z) {
      point.scale(1 / (point.scaleFactor * z));
      point.scaleFactor = 1 / z;
    };
    point.applyRescale();
    _this.paperItem = point;
    return _this;
  }
  /**
   * Set the style properties of the point.
   * @param {Object} props - The style properties to set.
   * @description This method sets the style properties of the point using the provided properties object.
   */
  point_inherits(Point, _AnnotationItem);
  return point_createClass(Point, [{
    key: "setStyle",
    value: function setStyle(props) {
      //override default implementation so it doesn't overwrite the rescale properties
      // let rescale = props.rescale;
      // delete props.rescale;
      props.rescale = osd.extend(true, props.rescale, this.paperItem.rescale);
      this.paperItem.style.set(props);
      // this.paperItem.children[0].style.set(props);
    }

    /**
     * Retrieves the supported types by the Point annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
  }, {
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'`
     */
    function getGeoJSONType() {
      return {
        type: 'Point'
      };
    }

    /**
     * Retrieves the coordinates of the point.
     * @returns {Array} An array containing the x and y coordinates.
     * @description This method returns an array of coordinates representing the position of the point.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      var circle = item.children[0];
      return [circle.bounds.center.x, circle.bounds.center.y];
    }
    /**
     * Retrieves the style properties of the point.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the point in JSON format.
     */
  }, {
    key: "getStyleProperties",
    value: function getStyleProperties() {
      return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Perform actions during a transformation on the point.
     * @static
     * @param {string} operation - The type of transformation operation.
     * @description This static method performs actions during a transformation on the point, such as rotation or scaling. It handles both rotation and scaling transformations of the point annotation.
     */
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type) {
      var subtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return type.toLowerCase() === 'point' && subtype === null;
    }
  }, {
    key: "onTransform",
    value: function onTransform() {
      var operation = arguments[0];
      switch (operation) {
        case 'rotate':
          {
            var angle = arguments[1];
            var center = arguments[2];
            this.rotate(-angle, center); //undo the rotation: return to original position and orientation
            var vector = this.position.subtract(center);
            var newpos = center.add(vector.rotate(angle));
            var delta = newpos.subtract(this.position);
            this.translate(delta);
            break;
          }
        case 'scale':
          {
            var p = arguments[1]; //reference position
            var r = arguments[2]; //rotation
            var m = arguments[3]; //matrix

            this.matrix.append(m.inverted()); //undo previous operation
            var pos = this.pivot.transform(this.matrix);
            // let pos = this.pivot;
            var a = pos.subtract(p); // initial vector, unrotated
            var ar = a.rotate(-r); // initial vector, rotated
            var br = ar.multiply(m.scaling); //scaled rotated vector
            var b = br.rotate(r); //scaled unrotated vector
            var _delta = b.subtract(a); //difference between scaled and unscaled position

            this.translate(_delta);
            break;
          }
      }
    }

    // /**
    //  * Get the icon text for the point's icon.
    //  * @private
    //  * @returns {string} - The icon text.
    //  */
    // get iconText(){
    //     if(!this._iconText){
    //         this._makeIcon();
    //     }
    //     return this._iconText;
    // }
    // /**
    //  * Get the icon font family for the point's icon.
    //  * @private
    //  * @returns {string} - The icon font family.
    //  */
    // get iconFontFamily(){
    //     if(!this._iconFontFamily){
    //         this._makeIcon();
    //     }
    //     return this._iconFontFamily;
    // }
    // /**
    //  * Get the icon font weight for the point's icon.
    //  * @private
    //  * @returns {string} - The icon font weight.
    //  */
    // get iconFontWeight(){
    //     if(!this._iconFontWeight){
    //         this._makeIcon();
    //     }
    //     return this._iconFontWeight;
    // }
  }]);
}(AnnotationItem);

;// ./src/js/papertools/point.mjs
function papertools_point_typeof(o) { "@babel/helpers - typeof"; return papertools_point_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, papertools_point_typeof(o); }
function papertools_point_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function papertools_point_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, papertools_point_toPropertyKey(o.key), o); } }
function papertools_point_createClass(e, r, t) { return r && papertools_point_defineProperties(e.prototype, r), t && papertools_point_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function papertools_point_toPropertyKey(t) { var i = papertools_point_toPrimitive(t, "string"); return "symbol" == papertools_point_typeof(i) ? i : i + ""; }
function papertools_point_toPrimitive(t, r) { if ("object" != papertools_point_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != papertools_point_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function papertools_point_callSuper(t, o, e) { return o = papertools_point_getPrototypeOf(o), papertools_point_possibleConstructorReturn(t, papertools_point_isNativeReflectConstruct() ? Reflect.construct(o, e || [], papertools_point_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function papertools_point_possibleConstructorReturn(t, e) { if (e && ("object" == papertools_point_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return papertools_point_assertThisInitialized(t); }
function papertools_point_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function papertools_point_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (papertools_point_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function papertools_point_getPrototypeOf(t) { return papertools_point_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, papertools_point_getPrototypeOf(t); }
function papertools_point_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && papertools_point_setPrototypeOf(t, e); }
function papertools_point_setPrototypeOf(t, e) { return papertools_point_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, papertools_point_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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



// import { paper } from '../paperjs.mjs';

/**
 * Represents the PointTool class that allows users to create and manipulate Point features on the Paper.js project.
 * This tool provides functionality for creating points on the map, moving them, and updating their properties.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 */
var PointTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Creates an instance of PointTool.
   * @constructor
   * @param {Object} paperScope - The Paper.js paper scope object, which is the context for working with Paper.js functionalities.
   * @description The constructor initializes the PointTool by calling the base class (AnnotationUITool) constructor and sets up the necessary event handlers.
   * It also creates and configures the cursor used to represent the point creation on the map.
   * @property {paper.Tool} tool - The Paper.js Tool object associated with the PointTool.
   * @property {paper.Item} cursor - The Paper.js item representing the cursor for point creation.
   * @property {boolean} dragging - A flag indicating whether the user is currently dragging a point.
   */
  function PointTool(paperScope) {
    var _this;
    papertools_point_classCallCheck(this, PointTool);
    _this = papertools_point_callSuper(this, PointTool, [paperScope]);
    var cursor = new Point({
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {
        label: 'Point Tool'
      }
    }).paperItem;
    cursor.visible = false;
    delete cursor.isGeoJSONFeature; // remove this field since this isn't really part of the GeoJSON structure

    _this.cursor = cursor;
    _this.dragging = false;
    _this.project.toolLayer.addChild(cursor);
    _this.setToolbarControl(new PointToolbar(_this));
    _this.extensions.onActivate = function () {
      _this.project.toolLayer.bringToFront();
      _this.setCursorProps();
    };
    _this.extensions.onDeactivate = function () {
      _this.project.toolLayer.sendToBack();
      _this.cursor.visible = false;
      _this.project.overlay.removeClass('point-tool-grab', 'point-tool-grabbing');
    };
    _this.onSelectionChanged = function () {
      _this.setCursorProps();
    };
    return _this;
  }
  papertools_point_inherits(PointTool, _AnnotationUITool);
  return papertools_point_createClass(PointTool, [{
    key: "setCursorProps",
    value: function setCursorProps() {
      if (this.itemToCreate) {
        this.cursor.fillColor = this.itemToCreate.fillColor;
        this.cursor.strokeColor = this.itemToCreate.strokeColor;
        this.cursor.visible = true;
      } else {
        this.cursor.visible = false;
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.cursor.position = ev.original.point;
      if (this.item.hitTest(ev.point)) {
        this.project.overlay.addClass('point-tool-grab');
      } else {
        this.project.overlay.removeClass('point-tool-grab');
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('Point');
        this.refreshItems();
        this.item.position = ev.point;
        this.cursor.visible = false;
        this.toolbarControl.updateInstructions('Point');
      } else {
        if (this.item && this.item.hitTest(ev.point)) {
          this.dragging = true;
          this.project.overlay.addClass('point-tool-grabbing');
        }
      }
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      if (this.dragging) {
        this.item && (this.item.position = this.item.position.add(ev.delta));
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.dragging = false;
      this.project.overlay.removeClass('point-tool-grabbing');
    }
  }]);
}(AnnotationUITool);


/**
 * Represents the toolbar for the point annotation tool.
 * @class
 * @memberof OSDPaperjsAnnotation.PointTool
 * @extends AnnotationUIToolbarBase
 */
var PointToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Creates an instance of PointToolbar.
   * @constructor
   * @param {Object} tool - The point annotation tool instance.
   * @description Initializes the PointToolbar by calling the base class (AnnotationUIToolbarBase) constructor and configuring the toolbar elements.
   * @property {Object} button - The configuration for the toolbar button.
   * @property {Object} instructions - The configuration for the toolbar instructions.
   */
  function PointToolbar(tool) {
    var _this2;
    papertools_point_classCallCheck(this, PointToolbar);
    _this2 = papertools_point_callSuper(this, PointToolbar, [tool]);
    var i = makeFaIcon('fa-map-pin');
    _this2.button.configure(i, 'Point Tool');
    _this2.instructions = document.createElement('span');
    _this2.instructions.classList.add('instructions');
    _this2.dropdown.appendChild(_this2.instructions);
    return _this2;
  }
  /**
   * Check if the toolbar is enabled for the specified mode.
   * @param {string} mode - The mode to check against.
   * @returns {boolean} Returns true if the toolbar is enabled for the mode, otherwise false.
   * @description Checks if the toolbar is enabled for the specified mode and updates the instructions.
   */
  papertools_point_inherits(PointToolbar, _AnnotationUIToolbarB);
  return papertools_point_createClass(PointToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      this.updateInstructions(mode);
      return ['new', 'Point'].includes(mode);
    }
    /**
     * Update the instructions on the toolbar based on the mode.
     * @param {string} mode - The mode for which the instructions are being updated.
     * @description Updates the instructions on the toolbar based on the specified mode.
     */
  }, {
    key: "updateInstructions",
    value: function updateInstructions(mode) {
      var text = mode == 'new' ? 'Click to drop a pin' : mode == 'Point' ? 'Drag to reposition' : '???';
      this.instructions.innerHTML = text;
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/paperitems/pointtext.mjs
function pointtext_typeof(o) { "@babel/helpers - typeof"; return pointtext_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, pointtext_typeof(o); }
function pointtext_construct(t, e, r) { if (pointtext_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && pointtext_setPrototypeOf(p, r.prototype), p; }
function pointtext_toConsumableArray(r) { return pointtext_arrayWithoutHoles(r) || pointtext_iterableToArray(r) || pointtext_unsupportedIterableToArray(r) || pointtext_nonIterableSpread(); }
function pointtext_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function pointtext_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return pointtext_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? pointtext_arrayLikeToArray(r, a) : void 0; } }
function pointtext_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function pointtext_arrayWithoutHoles(r) { if (Array.isArray(r)) return pointtext_arrayLikeToArray(r); }
function pointtext_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function pointtext_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function pointtext_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, pointtext_toPropertyKey(o.key), o); } }
function pointtext_createClass(e, r, t) { return r && pointtext_defineProperties(e.prototype, r), t && pointtext_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function pointtext_toPropertyKey(t) { var i = pointtext_toPrimitive(t, "string"); return "symbol" == pointtext_typeof(i) ? i : i + ""; }
function pointtext_toPrimitive(t, r) { if ("object" != pointtext_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != pointtext_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function pointtext_callSuper(t, o, e) { return o = pointtext_getPrototypeOf(o), pointtext_possibleConstructorReturn(t, pointtext_isNativeReflectConstruct() ? Reflect.construct(o, e || [], pointtext_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function pointtext_possibleConstructorReturn(t, e) { if (e && ("object" == pointtext_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return pointtext_assertThisInitialized(t); }
function pointtext_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function pointtext_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (pointtext_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function pointtext_getPrototypeOf(t) { return pointtext_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, pointtext_getPrototypeOf(t); }
function pointtext_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && pointtext_setPrototypeOf(t, e); }
function pointtext_setPrototypeOf(t, e) { return pointtext_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, pointtext_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a point with text annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `PointText` class represents a point with text annotation item. It inherits from the `AnnotationItem` class and provides methods to work with point text annotations.
 */
var PointText = /*#__PURE__*/function (_AnnotationItem) {
  /**
  * Create a new PointText instance.
  * @param {Object} geoJSON - The GeoJSON object containing annotation data.
  * @property {paper.Group} _paperItem - The associated paper item representing the point with text.
  * @description This constructor initializes a new point with text annotation item based on the provided GeoJSON object.
  */
  function PointText(geoJSON) {
    var _this;
    pointtext_classCallCheck(this, PointText);
    _this = pointtext_callSuper(this, PointText, [geoJSON]);
    if (geoJSON.geometry.type !== 'Point') {
      error('Bad geoJSON object: type !=="Point"');
    }
    var radius = 4.0;
    var coords = geoJSON.geometry.coordinates.slice(0, 2);
    var point = _this.paperItem = new _paper.Group();
    point.pivot = new _paper.Point(0, 0);
    point.applyMatrix = true;
    var circle = new _paper.Path.Circle(new _paper.Point(0, 0), radius);
    // circle.scale(new paper.Point(1, 0.5), new paper.Point(0, 0));

    point.addChild(circle);
    var textitem = new _paper.PointText({
      point: new _paper.Point(0, 0),
      pivot: new _paper.Point(0, 0),
      content: geoJSON.geometry.properties.content || 'PointText',
      fontSize: 18,
      strokeWidth: 1 //keep this constant
    });
    point.addChild(textitem);
    // To do: option to hide the point unless the text is moused over?
    // textitem.on({
    //     mouseenter: function(event) {
    //         circle.visible = true;
    //     },
    //     mouseleave: function(event) {
    //         circle.visible = false;
    //     }
    // });

    _this.refreshTextOffset();
    textitem.on('content-changed', function () {
      _this.refreshTextOffset();
    });
    point.position = pointtext_construct(_paper.Point, pointtext_toConsumableArray(coords));
    point.scaleFactor = point.project._scope.scaleByCurrentZoom(1);
    point.scale(point.scaleFactor, circle.bounds.center);
    // textitem.strokeWidth = point.strokeWidth / point.scaleFactor;

    point.rescale = point.rescale || {};
    point.rescale.size = function (z) {
      point.scale(1 / (point.scaleFactor * z));
      point.scaleFactor = 1 / z;
      textitem.strokeWidth = 0; //keep constant; reset after strokewidth is set on overall item
    };
    function handleFlip() {
      // const angle = point.view.getRotation(); 
      var angle = point.view.getFlipped() ? point.view.getRotation() : 180 - point.view.getRotation();
      point.rotate(-angle);
      point.scale(-1, 1);
      point.rotate(angle);
    }
    if (point.view.getFlipped()) {
      handleFlip();
    }
    var offsetAngle = point.view.getFlipped() ? 180 - point.view.getRotation() : -point.view.getRotation();
    point.rotate(offsetAngle);
    point.view.on('rotate', function (ev) {
      var angle = -ev.rotatedBy;
      point.rotate(angle);
    });
    point.view.on('flip', function () {
      handleFlip();
    });
    point.applyRescale();
    return _this;
  }
  /**
   * Set the style properties of the point with text.
   * @param {Object} props - The style properties to set.
   * @description This method sets the style properties of the point with text using the provided properties object.
   */
  pointtext_inherits(PointText, _AnnotationItem);
  return pointtext_createClass(PointText, [{
    key: "setStyle",
    value: function setStyle(props) {
      //override default implementation so it doesn't overwrite the rescale properties
      // let rescale = props.rescale;
      // delete props.rescale;
      props.rescale = osd.extend(true, props.rescale, this.paperItem.rescale);
      this.paperItem.style.set(props);
      // this.paperItem.children[0].style.set(props);
    }
    /**
     * Get the text item associated with the point.
     * @returns {paper.PointText} The associated text item.
     */
  }, {
    key: "textitem",
    get: function get() {
      return this.paperItem.children[1];
    }

    /**
     * Get the circle that represents the point.
     * @returns {paper.Path.Circle} The circle
     */
  }, {
    key: "circle",
    get: function get() {
      return this.paperItem.children[0];
    }

    /**
     * Retrieves the supported types by the PointText annotation item.
     * @static
     * @param { String } type
     * @param { String } [subtype]
     * @returns {Boolean} Whether this constructor supports the requested type/subtype
     */
  }, {
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'PointText'`
     */
    function getGeoJSONType() {
      return {
        type: 'Point',
        subtype: 'PointText'
      };
    }

    /**
    * Get the coordinates of the point.
    * @returns {Array<number>} The coordinates of the point.
    */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      var circle = item.children[0];
      return [circle.bounds.center.x, circle.bounds.center.y];
    }
    /**
     * Get the properties of the point.
     * @returns {Object} The properties of the point.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      return {
        content: item.children[1].content
      };
    }
    /**
     * Get the style properties of the point.
     * @returns {Object} The style properties of the point.
     */
  }, {
    key: "getStyleProperties",
    value: function getStyleProperties() {
      return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Handle transformation operations on the point.
     * @static
     * @param {string} operation - The type of transformation operation.
     * @description This static method handles transformation operations on the point annotation.
     */
  }, {
    key: "refreshTextOffset",
    value: function refreshTextOffset() {
      var flipped = this.textitem.view.getFlipped();
      var boundsNoRotate = this.textitem.getInternalBounds();
      var offsetX = boundsNoRotate.width / 2 / this.textitem.layer.scaling.x * (flipped ? 1 : -1);
      var offsetY = -boundsNoRotate.height / 2 / this.textitem.layer.scaling.x;
      var rotation = flipped ? 180 - this.textitem.view.getRotation() : this.textitem.view.getRotation();
      var offset = new _paper.Point(offsetX, offsetY).divide(this.textitem.view.getZoom()).rotate(-rotation);
      this.textitem.position = this.circle.bounds.center.add(offset);
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type, subtype) {
      return type.toLowerCase() === 'point' && (subtype === null || subtype === void 0 ? void 0 : subtype.toLowerCase()) === 'pointtext';
    }
  }, {
    key: "onTransform",
    value: function onTransform() {
      var operation = arguments[0];
      switch (operation) {
        case 'rotate':
          {
            var angle = arguments[1];
            var center = arguments[2];
            this.rotate(-angle, center); //undo the rotation: return to original position and orientation
            var vector = this.position.subtract(center);
            var newpos = center.add(vector.rotate(angle));
            var delta = newpos.subtract(this.position);
            this.translate(delta);
            break;
          }
        case 'scale':
          {
            var p = arguments[1]; //reference position
            var r = arguments[2]; //rotation
            var m = arguments[3]; //matrix

            this.matrix.append(m.inverted()); //undo previous operation
            var pos = this.pivot.transform(this.matrix);
            // let pos = this.pivot;
            var a = pos.subtract(p); // initial vector, unrotated
            var ar = a.rotate(-r); // initial vector, rotated
            var br = ar.multiply(m.scaling); //scaled rotated vector
            var b = br.rotate(r); //scaled unrotated vector
            var _delta = b.subtract(a); //difference between scaled and unscaled position

            this.translate(_delta);
            break;
          }
      }
    }
  }]);
}(AnnotationItem);

;// ./src/js/papertools/pointtext.mjs
function papertools_pointtext_typeof(o) { "@babel/helpers - typeof"; return papertools_pointtext_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, papertools_pointtext_typeof(o); }
function papertools_pointtext_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function papertools_pointtext_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, papertools_pointtext_toPropertyKey(o.key), o); } }
function papertools_pointtext_createClass(e, r, t) { return r && papertools_pointtext_defineProperties(e.prototype, r), t && papertools_pointtext_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function papertools_pointtext_callSuper(t, o, e) { return o = papertools_pointtext_getPrototypeOf(o), papertools_pointtext_possibleConstructorReturn(t, papertools_pointtext_isNativeReflectConstruct() ? Reflect.construct(o, e || [], papertools_pointtext_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function papertools_pointtext_possibleConstructorReturn(t, e) { if (e && ("object" == papertools_pointtext_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return papertools_pointtext_assertThisInitialized(t); }
function papertools_pointtext_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function papertools_pointtext_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (papertools_pointtext_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function papertools_pointtext_getPrototypeOf(t) { return papertools_pointtext_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, papertools_pointtext_getPrototypeOf(t); }
function papertools_pointtext_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && papertools_pointtext_setPrototypeOf(t, e); }
function papertools_pointtext_setPrototypeOf(t, e) { return papertools_pointtext_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, papertools_pointtext_setPrototypeOf(t, e); }
function pointtext_defineProperty(e, r, t) { return (r = papertools_pointtext_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function papertools_pointtext_toPropertyKey(t) { var i = papertools_pointtext_toPrimitive(t, "string"); return "symbol" == papertools_pointtext_typeof(i) ? i : i + ""; }
function papertools_pointtext_toPrimitive(t, r) { if ("object" != papertools_pointtext_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != papertools_pointtext_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The PointTextTool class empowers the annotation UI with the ability to add point-based text annotations.
 * This class extends the AnnotationUITool and is paired with the PointTextToolbar for interactive control.
 * @class
 * @memberof OSDPaperjsAnnotation
 * 
 */
var PointTextTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Initialize the PointTextTool with Paper.js scope, cursor representation, and toolbar controls.
   *
   * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
   *
   * @property {paper.PointText} cursor - The visual representation of the text cursor.
   */
  function PointTextTool(paperScope) {
    var _this;
    papertools_pointtext_classCallCheck(this, PointTextTool);
    _this = papertools_pointtext_callSuper(this, PointTextTool, [paperScope]);
    pointtext_defineProperty(_this, "onMouseDrag", function (ev) {
      if (this.dragging) {
        this.item && (this.item.position = this.item.position.add(ev.delta));
      }
    });
    _this.dragging = false;

    /**
     * The visual representation of the text cursor.
     * @type {paper.PointText}
     */
    var pointText = new PointText({
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
        properties: {
          subtype: 'PointText',
          content: 'Click to place'
        }
      },
      properties: {
        label: 'Text Tool'
      }
    });
    var cursor = _this.cursor = pointText.paperItem;
    cursor.isGeoJSONFeature = false;
    cursor.fillColor = 'grey';
    cursor.strokeColor = 'black';
    cursor.strokeWidth = 1;
    cursor.visible = false;
    _this.project.toolLayer.addChild(cursor);
    pointText.refreshTextOffset();
    cursor.applyRescale();

    /**
     * Set the toolbar control for the PointTextTool.
     * This function sets the toolbar control using the provided instance of PointTextToolbar.
     * @private
     * @param {PointTextToolbar} toolbarControl - The toolbar control instance to be set.
     */
    _this.setToolbarControl(new PointTextToolbar(_this));
    /**
     * Activate event handler for the PointTextTool.
     * This function is called when the tool is activated, and it handles the setup of cursor visibility and interaction behavior.
     * @private
     */
    _this.extensions.onActivate = function () {
      if (_this.itemToCreate) {
        // new item to be created - show the cursor
        _this.cursor.visible = true;
        pointText.refreshTextOffset();
        cursor.applyRescale();
      } else if (_this.item) {
        // modifying an existing item
        _this._updateTextInput();
      }
    };
    /**
     * Deactivate event handler for the PointTextTool.
     * This function is called when the tool is deactivated, and it handles cursor visibility and interaction cleanup.
     * @private
     */
    _this.extensions.onDeactivate = function () {
      _this.project.toolLayer.addChild(_this.cursor);
      _this.cursor.visible = false;
      _this.project.overlay.removeClass('point-tool-grab', 'point-tool-grabbing');
    };
    return _this;
  }
  papertools_pointtext_inherits(PointTextTool, _AnnotationUITool);
  return papertools_pointtext_createClass(PointTextTool, [{
    key: "onSelectionChanged",
    value: function onSelectionChanged() {
      this.cursor.visible = !!this.itemToCreate;
      this._updateTextInput();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.cursor.position = ev.original.point;
      if (this.item.hitTest(ev.point)) {
        // for some reason hit-testing needs to be done in transformed coordinates not original
        this.project.overlay.addClass('point-tool-grab');
      } else {
        this.project.overlay.removeClass('point-tool-grab');
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('Point', 'PointText');
        this.refreshItems();
        this.item.children[1].content = this.toolbarControl.getValue();
        this.item.position = ev.point;
        this.cursor.visible = false;
        this.toolbarControl.updateInstructions('Point:PointText');
      } else {
        if (this.item && this.item.hitTest(ev.point)) {
          // for some reason hit-testing needs to be done in transformed coordinates not original
          this.dragging = true;
          this.project.overlay.addClass('point-tool-grabbing');
        }
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.dragging = false;
      this.project.overlay.removeClass('point-tool-grabbing');
    }
  }, {
    key: "_updateTextInput",
    value: function _updateTextInput() {
      var text = this.item && this.item.annotationItem.subtype == 'PointText' ? this.item.children[1].content : '';
      this.toolbarControl.setItemText(text);
      this.cursor.children[1].content = text.length ? text : this.toolbarControl.input.getAttribute('placeholder');
    }
  }]);
}(AnnotationUITool);


/**
 * The PointTextToolbar class enhances the PointTextTool by providing an interactive toolbar for text annotation controls.
 * This class extends the AnnotationUIToolbarBase to manage the toolbar's behavior.
 * @class
 * @memberof OSDPaperjsAnnotation.PointTextTool
 * 
 * 
 */
var PointTextToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new instance of the PointTextToolbar, complementing the associated PointTextTool.
   *
   * @param {PointTextTool} tool - The corresponding PointTextTool instance.
   */
  function PointTextToolbar(tool) {
    var _this2;
    papertools_pointtext_classCallCheck(this, PointTextToolbar);
    _this2 = papertools_pointtext_callSuper(this, PointTextToolbar, [tool]);
    var self = _this2;
    var i = makeFaIcon('fa-font');
    _this2.button.configure(i, 'Text Tool');
    _this2.instructions = document.createElement('span');
    _this2.instructions.classList.add('instructions');
    _this2.dropdown.appendChild(_this2.instructions);
    _this2.input = document.createElement('input');
    _this2.input.setAttribute('type', 'text');
    _this2.input.setAttribute('placeholder', 'Enter text');
    _this2.dropdown.appendChild(_this2.input);
    _this2.input.addEventListener('input', function () {
      var value = self.getValue();
      if (self.tool.item && self.tool.item.annotationItem.subtype == 'PointText') {
        self.tool.item.children[1].content = value;
      }
      self.tool.cursor.children[1].content = value;
    });
    _this2.input.dispatchEvent(new Event('input'));
    return _this2;
  }
  /**
   * Update the input element's text content.
   *
   * @param {string} text - The text to be set in the input.
   */
  papertools_pointtext_inherits(PointTextToolbar, _AnnotationUIToolbarB);
  return papertools_pointtext_createClass(PointTextToolbar, [{
    key: "setItemText",
    value: function setItemText(text) {
      this.input.value = text;
    }
    /**
     * Retrieve the current value from the input element.
     *
     * @returns {string} The value from the input.
     */
  }, {
    key: "getValue",
    value: function getValue() {
      var input = this.input;
      return input.value.trim() || input.getAttribute('placeholder');
    }
    /**
     * Determine if the toolbar is enabled for the given annotation mode.
     *
     * @param {string} mode - The current annotation mode.
     * @returns {boolean} True if the toolbar is enabled, otherwise false.
     */
  }, {
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      this.updateInstructions(mode);
      return ['new', 'Point:PointText'].includes(mode);
    }

    /**
     * Update the instructional text based on the current annotation mode.
     *
     * @param {string} mode - The current annotation mode.
     */
  }, {
    key: "updateInstructions",
    value: function updateInstructions(mode) {
      var text = mode == 'new' ? 'Click to place' : mode == 'Point:PointText' ? 'Drag to reposition' : '???';
      this.instructions.innerHTML = text;
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/rectangle.mjs
function rectangle_typeof(o) { "@babel/helpers - typeof"; return rectangle_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, rectangle_typeof(o); }
function rectangle_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function rectangle_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, rectangle_toPropertyKey(o.key), o); } }
function rectangle_createClass(e, r, t) { return r && rectangle_defineProperties(e.prototype, r), t && rectangle_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function rectangle_toPropertyKey(t) { var i = rectangle_toPrimitive(t, "string"); return "symbol" == rectangle_typeof(i) ? i : i + ""; }
function rectangle_toPrimitive(t, r) { if ("object" != rectangle_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != rectangle_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function rectangle_callSuper(t, o, e) { return o = rectangle_getPrototypeOf(o), rectangle_possibleConstructorReturn(t, rectangle_isNativeReflectConstruct() ? Reflect.construct(o, e || [], rectangle_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function rectangle_possibleConstructorReturn(t, e) { if (e && ("object" == rectangle_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return rectangle_assertThisInitialized(t); }
function rectangle_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function rectangle_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (rectangle_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function rectangle_getPrototypeOf(t) { return rectangle_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, rectangle_getPrototypeOf(t); }
function rectangle_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && rectangle_setPrototypeOf(t, e); }
function rectangle_setPrototypeOf(t, e) { return rectangle_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, rectangle_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The RectangleTool class extends the AnnotationUITool and provides functionality for creating and modifying rectangles.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var RectangleTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Create a new RectangleTool instance.
  * @memberof OSDPaperjsAnnotation.RectangleTool
  * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
  * @property {string} mode - The current mode of the RectangleTool.
  * @property {paper.Path.Rectangle|null} creating - The currently creating rectangle.
  * @property {paper.Point|null} refPoint - The reference point used for resizing rectangles.
  * @property {paper.Point|null} ctrlPoint - The control point used for resizing rectangles.
  * @description This tool provides users with the ability to create new rectangles by clicking and dragging on the canvas, as well as modifying existing rectangles by resizing and moving them. It offers options to control the shape and position of the rectangles, making it a versatile tool for annotating and highlighting areas of interest.
  */
  function RectangleTool(paperScope) {
    var _this;
    rectangle_classCallCheck(this, RectangleTool);
    _this = rectangle_callSuper(this, RectangleTool, [paperScope]);
    var self = _this;
    var crosshairTool = new _paper.Group({
      visible: false
    });
    var h1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    var h2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    var v1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    var v2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    crosshairTool.addChildren([h1, h2, v1, v2]);
    _this.project.toolLayer.addChild(crosshairTool);
    _this.h1 = h1;
    _this.h2 = h2;
    _this.v1 = v1;
    _this.v2 = v2;
    _this.crosshairTool = crosshairTool;

    /**
     * The current mode of the RectangleTool, which can be 'creating', 'corner-drag', 'fill-drag', or 'modifying'.
     * @type {string}
     */
    _this.mode = null;
    /**
     * The currently creating rectangle during the drawing process.
     * @type {paper.Path.Rectangle|null}
     */
    _this.creating = null;
    _this.setToolbarControl(new RectToolbar(_this));
    _this.extensions.onActivate = _this.onSelectionChanged = function () {
      if (self.itemToCreate) {
        self.mode = 'creating';
        crosshairTool.visible = true;
        self.creating = null; //reset reference to actively creating item
        self.toolbarControl.updateInstructions('new');
      } else if (self.creating && self.creating.parent == self.item) {
        self.mode = 'creating';
        crosshairTool.visible = true;
        self.toolbarControl.updateInstructions('new');
      } else if (self.item) {
        self.creating = null; //reset reference to actively creating item
        self.mode = 'modifying';
        crosshairTool.visible = false;
        self.toolbarControl.updateInstructions('Point:Rectangle');
      } else {
        // self.creating=null;//reset reference to actively creating item
        // self.mode=null;
        // crosshairTool.visible = false;
        // self.toolbarControl.updateInstructions('Point:Rectangle');
        self.deactivate();
      }
    };
    _this.extensions.onDeactivate = function (finished) {
      if (finished) self.creating = null;
      crosshairTool.visible = false;
      self.mode = null;
      self.project.overlay.removeClass('rectangle-tool-resize');
      self.project.overlay.removeClass('rectangle-tool-move');
    };
    return _this;
  }
  rectangle_inherits(RectangleTool, _AnnotationUITool);
  return rectangle_createClass(RectangleTool, [{
    key: "rectangle",
    get: function get() {
      // handle the case where the actual rectangle is the first child of a group, or just the item itself
      return this.item.children && this.item.children[0] || this.item;
    }
  }, {
    key: "setCursorPosition",
    value: function setCursorPosition(point) {
      //to do: account for view rotation
      // let viewBounds=tool.view.bounds;
      var tool = this.tool;
      var pt = tool.view.projectToView(point);
      var left = tool.view.viewToProject(new _paper.Point(0, pt.y));
      var right = tool.view.viewToProject(new _paper.Point(tool.view.viewSize.width, pt.y));
      var top = tool.view.viewToProject(new _paper.Point(pt.x, 0));
      var bottom = tool.view.viewToProject(new _paper.Point(pt.x, tool.view.viewSize.height));
      // console.log(viewBounds)
      this.h1.segments[0].point = left;
      this.h2.segments[0].point = left;
      this.h1.segments[1].point = right;
      this.h2.segments[1].point = right;
      this.v1.segments[0].point = top;
      this.v2.segments[0].point = top;
      this.v1.segments[1].point = bottom;
      this.v2.segments[1].point = bottom;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('Point', 'Rectangle');
        this.refreshItems();
        var r = new _paper.Path.Rectangle(ev.point, ev.point);
        this.creating = r;
        this.item.removeChildren();
        this.item.addChild(r);
        this.mode = 'creating';
      } else if (this.item) {
        // try hit test on corners first
        var result = this.item.hitTest(ev.point, {
          fill: false,
          stroke: false,
          segments: true,
          tolerance: this.getTolerance(5)
        });
        if (result) {
          // crosshairTool.visible=true;
          this.mode = 'corner-drag';
          var idx = result.segment.path.segments.indexOf(result.segment);
          var oppositeIdx = (idx + 2) % result.segment.path.segments.length;
          this.refPoint = result.segment.path.segments[oppositeIdx].point;
          this.ctrlPoint = result.segment.point.clone();
          return;
        }

        // next hit test on "fill"
        if (this.item.contains(ev.point)) {
          // crosshairTool.visible=true;
          this.mode = 'fill-drag';
          return;
        }
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.setCursorPosition(ev.original.point);
      if (this.mode == 'modifying') {
        var hitResult = this.item.hitTest(ev.point, {
          fill: false,
          stroke: false,
          segments: true,
          tolerance: this.getTolerance(5)
        });
        if (hitResult) {
          this.project.overlay.addClass('rectangle-tool-resize');
        } else {
          this.project.overlay.removeClass('rectangle-tool-resize');
        }
        if (this.item.contains(ev.point)) {
          this.project.overlay.addClass('rectangle-tool-move');
        } else {
          this.project.overlay.removeClass('rectangle-tool-move');
        }
      }
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      var refPt, currPt, cursorPt, angle;
      var center = this.item.center;
      if (this.mode == 'creating') {
        angle = -(this.item.view.getRotation() + this.item.layer.getRotation());
        refPt = ev.downPoint;
        if (ev.modifiers.command || ev.modifiers.control) {
          var delta = ev.point.subtract(ev.downPoint);
          var axes = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(function (p) {
            return new _paper.Point(p[0], p[1]).rotate(angle);
          });
          var closestAxis = axes.sort(function (a, b) {
            return a.dot(delta) - b.dot(delta);
          })[0];
          var proj = delta.project(closestAxis);
          currPt = ev.downPoint.add(proj);
        } else {
          currPt = ev.point;
        }
      } else if (this.mode == 'corner-drag') {
        angle = this.rectangle.segments[1].point.subtract(this.rectangle.segments[0].point).angle;
        refPt = this.refPoint;
        if (ev.modifiers.command || ev.modifiers.control) {
          var _delta = ev.point.subtract(this.refPoint);
          var axis = this.ctrlPoint.subtract(this.refPoint);
          var _proj = _delta.project(axis);
          currPt = this.refPoint.add(_proj);
        } else {
          currPt = ev.point;
        }
      } else if (this.mode == 'fill-drag') {
        this.item.translate(ev.delta);
        return;
      } else {
        this.setCursorPosition(ev.original.point);
        return;
      }
      this.setCursorPosition(this.targetLayer.matrix.transform(currPt));
      // this.setCursorPosition(currPt);
      var r = new _paper.Rectangle(refPt.rotate(-angle, center), currPt.rotate(-angle, center));
      var corners = [r.topLeft, r.topRight, r.bottomRight, r.bottomLeft].map(function (p) {
        return p.rotate(angle, center);
      });
      this.rectangle.set({
        segments: corners
      });
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mode = 'modifying';
      this.crosshairTool.visible = false;
      this.creating = null;
      this.toolbarControl.updateInstructions('Point:Rectangle');
    }
  }]);
}(AnnotationUITool);


/**
 * The RectToolbar class extends the AnnotationUIToolbarBase and provides a toolbar for the RectangleTool.
 * @extends AnnotationUIToolbarBase
 * @memberof OSDPaperjsAnnotation.RectangleTool#
 */
var RectToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new RectToolbar instance.
   * @param {RectangleTool} tool - The RectangleTool instance.
   */
  function RectToolbar(tool) {
    var _this2;
    rectangle_classCallCheck(this, RectToolbar);
    _this2 = rectangle_callSuper(this, RectToolbar, [tool]);
    var i = makeFaIcon('fa-vector-square');
    _this2.button.configure(i, 'Rectangle Tool');
    _this2.instructions = document.createElement('span');
    _this2.instructions.innerHTML = 'Click and drag to create a rectangle';
    _this2.dropdown.appendChild(_this2.instructions);
    return _this2;
  }
  /**
   * Check if the toolbar is enabled for the specified mode.
   * @param {string} mode - The mode to check.
   * @returns {boolean} True if the toolbar is enabled for the mode, false otherwise.
   */
  rectangle_inherits(RectToolbar, _AnnotationUIToolbarB);
  return rectangle_createClass(RectToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'Point:Rectangle'].includes(mode);
    }
    /**
     * Update the instructions text based on the mode.
     * @param {string} mode - The current mode.
     */
  }, {
    key: "updateInstructions",
    value: function updateInstructions(mode) {
      var text = mode == 'new' ? 'Click and drag to create a rectangle' : mode == 'Point:Rectangle' ? 'Drag a corner to resize' : '???';
      this.instructions.innerHTML = text;
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/ellipse.mjs
function ellipse_typeof(o) { "@babel/helpers - typeof"; return ellipse_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ellipse_typeof(o); }
function ellipse_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ellipse_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ellipse_toPropertyKey(o.key), o); } }
function ellipse_createClass(e, r, t) { return r && ellipse_defineProperties(e.prototype, r), t && ellipse_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ellipse_toPropertyKey(t) { var i = ellipse_toPrimitive(t, "string"); return "symbol" == ellipse_typeof(i) ? i : i + ""; }
function ellipse_toPrimitive(t, r) { if ("object" != ellipse_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ellipse_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function ellipse_callSuper(t, o, e) { return o = ellipse_getPrototypeOf(o), ellipse_possibleConstructorReturn(t, ellipse_isNativeReflectConstruct() ? Reflect.construct(o, e || [], ellipse_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function ellipse_possibleConstructorReturn(t, e) { if (e && ("object" == ellipse_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return ellipse_assertThisInitialized(t); }
function ellipse_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function ellipse_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (ellipse_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function ellipse_getPrototypeOf(t) { return ellipse_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, ellipse_getPrototypeOf(t); }
function ellipse_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && ellipse_setPrototypeOf(t, e); }
function ellipse_setPrototypeOf(t, e) { return ellipse_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, ellipse_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents an Ellipse Tool in the Annotation Toolkit program.
 * This tool allows users to create and modify ellipses on the canvas.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 * @description The `EllipseToolbar` class provides a user interface toolbar for the ellipse annotation tool. It inherits from the `AnnotationUIToolbarBase` class and includes methods to configure, enable, and update instructions for the ellipse tool.
 */
var EllipseTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Create an EllipseTool instance.
   * @param {paper.PaperScope} paperScope - The Paper.js PaperScope instance.
   * @property {paper.Tool} tool - The Paper.js tool instance for handling mouse events.
   * @property {paper.Layer} toolLayer - The Paper.js project's tool layer where the crosshairTool is added.
   * @property {string|null} mode - The current mode of the Ellipse Tool.
   *     Possible values are 'creating', 'segment-drag', 'modifying', or null.
   * @property {paper.Path.Ellipse|null} creating - The currently active ellipse being created or modified.
   * @property {EllipseToolbar} toolbarControl - The EllipseToolbar instance associated with this EllipseTool.
   */
  function EllipseTool(paperScope) {
    var _this;
    ellipse_classCallCheck(this, EllipseTool);
    _this = ellipse_callSuper(this, EllipseTool, [paperScope]);
    var self = _this;
    _this.crosshairTool = new _paper.Group({
      visible: false
    });
    _this.h1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    _this.h2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    _this.v1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    _this.v2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    _this.crosshairTool.addChildren([_this.h1, _this.h2, _this.v1, _this.v2]);
    _this.project.toolLayer.addChild(_this.crosshairTool);
    _this.mode = null;
    _this.creating = null;
    _this.setToolbarControl(new EllipseToolbar(_this));
    _this.extensions.onActivate = _this.onSelectionChanged = function () {
      if (self.itemToCreate) {
        self.mode = 'creating';
        self.crosshairTool.visible = true;
        self.creating = null; //reset reference to actively creating item
        self.toolbarControl.updateInstructions('new');
      } else if (self.creating && self.creating.parent == self.item) {
        self.mode = 'creating';
        self.crosshairTool.visible = true;
        self.toolbarControl.updateInstructions('new');
      } else if (self.item) {
        self.creating = null; //reset reference to actively creating item
        self.mode = 'modifying';
        self.crosshairTool.visible = false;
        self.toolbarControl.updateInstructions('Point:Ellipse');
      } else {
        self.creating = null; //reset reference to actively creating item
        self.mode = null;
        self.crosshairTool.visible = false;
        self.toolbarControl.updateInstructions('Point:Ellipse');
      }
    };
    _this.extensions.onDeactivate = function (finished) {
      if (finished) self.creating = null;
      self.crosshairTool.visible = false;
      self.mode = null;
      self.project.overlay.removeClass('rectangle-tool-resize');
    };
    return _this;
  }
  ellipse_inherits(EllipseTool, _AnnotationUITool);
  return ellipse_createClass(EllipseTool, [{
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('Point', 'Ellipse');
        this.refreshItems();
        var r = new _paper.Path.Ellipse(ev.point, ev.point);
        this.creating = r;
        this.item.removeChildren();
        this.item.addChild(r);
        this.mode = 'creating';
      } else if (this.item) {
        // first do a hit test on the segments
        var result = this.item.hitTest(ev.point, {
          fill: false,
          stroke: false,
          segments: true,
          tolerance: this.getTolerance(5)
        });
        if (result) {
          this.mode = 'segment-drag';
          var idx = result.segment.path.segments.indexOf(result.segment);
          var oppositeIdx = (idx + 2) % result.segment.path.segments.length;
          //save reference to the original points of the ellipse before the drag started
          this.points = {
            opposite: result.segment.path.segments[oppositeIdx].point.clone(),
            drag: result.segment.point.clone(),
            p1: result.segment.next.point.clone(),
            p2: result.segment.previous.point.clone()
          };
          return;
        }
        // next hit test on "fill"
        if (this.item.contains(ev.point)) {
          // crosshairTool.visible=true;
          this.mode = 'fill-drag';
          return;
        }
      }
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      var currPt;
      var center = this.item.bounds.center;
      if (this.mode == 'creating') {
        var angle = -(this.item.view.getRotation() + this.item.layer.getRotation());
        if (this.item.view.getFlipped()) {
          angle = 180 - angle;
        }
        if (ev.modifiers.command || ev.modifiers.control) {
          var delta = ev.point.subtract(ev.downPoint);
          var axes = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(function (p) {
            return new _paper.Point(p[0], p[1]).rotate(angle);
          });
          var closestAxis = axes.sort(function (a, b) {
            return a.dot(delta) - b.dot(delta);
          })[0];
          var proj = delta.project(closestAxis);
          currPt = ev.downPoint.add(proj);
        } else {
          currPt = ev.point;
        }
        var r = new _paper.Rectangle(ev.downPoint.rotate(-angle, center), currPt.rotate(-angle, center));
        var ellipse = new _paper.Path.Ellipse(r);
        ellipse.rotate(angle, center);
        this.item.children[0].set({
          segments: ellipse.segments
        });
        ellipse.remove();
      } else if (this.mode == 'segment-drag') {
        var dragdelta = ev.point.subtract(this.points.opposite);
        var axis = this.points.drag.subtract(this.points.opposite);
        var _proj = dragdelta.project(axis);
        var _angle = axis.angle;
        if (ev.modifiers.command || ev.modifiers.control) {
          //scale proportionally
          var scalefactor = _proj.length / axis.length;
          var halfproj = _proj.divide(2);
          var _center = this.points.opposite.add(halfproj);
          var r1 = halfproj.length;
          var r2 = Math.abs(this.points.p1.subtract(this.points.opposite).multiply(scalefactor).cross(_proj.normalize()));
          var _ellipse = new _paper.Path.Ellipse({
            center: _center,
            radius: [r1, r2]
          }).rotate(_angle);
          this.item.children[0].set({
            segments: _ellipse.segments
          });
          _ellipse.remove();
        } else {
          //scale in one direction only
          var _halfproj = _proj.divide(2);
          var _center2 = this.points.opposite.add(_halfproj);
          var _r = _halfproj.length;
          var _r2 = Math.abs(this.points.p1.subtract(this.points.opposite).cross(_proj.normalize()));
          var _ellipse2 = new _paper.Path.Ellipse({
            center: _center2,
            radius: [_r, _r2]
          }).rotate(_angle);
          this.item.children[0].set({
            segments: _ellipse2.segments
          });
          _ellipse2.remove();
        }
      } else if (this.mode == 'fill-drag') {
        this.item.translate(ev.delta);
        return;
      } else {
        this.setCursorPosition(ev.original.point);
        return;
      }
      this.setCursorPosition(this.targetLayer.matrix.transform(currPt));
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.setCursorPosition(ev.original.point);
      if (this.mode == 'modifying') {
        var hitResult = this.item.hitTest(ev.point, {
          fill: false,
          stroke: false,
          segments: true,
          tolerance: this.getTolerance(5)
        });
        if (hitResult) {
          this.project.overlay.addClass('rectangle-tool-resize');
        } else {
          this.project.overlay.removeClass('rectangle-tool-resize');
        }
        if (this.item.contains(ev.point)) {
          this.project.overlay.addClass('rectangle-tool-move');
        } else {
          this.project.overlay.removeClass('rectangle-tool-move');
        }
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.mode = 'modifying';
      this.crosshairTool.visible = false;
      this.creating = null;
      this.toolbarControl.updateInstructions('Point:Ellipse');
    }

    /**
     * Sets the cursor position and updates the crosshairTool to provide visual feedback.
     * This function calculates the position of the crosshair lines based on the current cursor position.
     * The crosshairTool displays lines intersecting at the cursor position, providing a reference for alignment and positioning.
     * @private
     * @param {paper.Point} point - The current cursor position in Paper.js coordinate system.
     */
  }, {
    key: "setCursorPosition",
    value: function setCursorPosition(point) {
      //to do: account for view rotation
      // let viewBounds=tool.view.bounds;
      var pt = this.tool.view.projectToView(point);
      var left = this.tool.view.viewToProject(new _paper.Point(0, pt.y));
      var right = this.tool.view.viewToProject(new _paper.Point(this.tool.view.viewSize.width, pt.y));
      var top = this.tool.view.viewToProject(new _paper.Point(pt.x, 0));
      var bottom = this.tool.view.viewToProject(new _paper.Point(pt.x, this.tool.view.viewSize.height));
      // console.log(viewBounds)

      var h1 = this.h1;
      var h2 = this.h2;
      var v1 = this.v1;
      var v2 = this.v2;
      h1.segments[0].point = left;
      h2.segments[0].point = left;
      h1.segments[1].point = right;
      h2.segments[1].point = right;
      v1.segments[0].point = top;
      v2.segments[0].point = top;
      v1.segments[1].point = bottom;
      v2.segments[1].point = bottom;
    }
  }]);
}(AnnotationUITool);


/**
 * Represents an ellipse annotation tool's user interface toolbar.
 * @class
 * @memberof OSDPaperjsAnnotation.EllipseTool
 * @extends AnnotationUIToolbarBase
 * @description The `EllipseToolbar` class provides a user interface toolbar for the ellipse annotation tool. It inherits from the `AnnotationUIToolbarBase` class and includes methods to configure, enable, and update instructions for the ellipse tool.
 */
var EllipseToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new EllipseToolbar instance.
   * @param {AnnotationTool} tool - The annotation tool associated with the toolbar.
   * @description This constructor initializes a new `EllipseToolbar` instance by providing the associated annotation tool.
   */
  function EllipseToolbar(tool) {
    var _this2;
    ellipse_classCallCheck(this, EllipseToolbar);
    _this2 = ellipse_callSuper(this, EllipseToolbar, [tool]);
    var i = makeFaIcon('fa-circle');
    _this2.button.configure(i, 'Ellipse Tool');
    _this2.instructions = document.createElement('span');
    _this2.instructions.innerHTML = 'Click and drag to create an ellipse';
    _this2.dropdown.appendChild(_this2.instructions);
    return _this2;
  }
  /**
  * Check if the ellipse tool is enabled for the given mode.
  * @param {string} mode - The mode of the annotation tool.
  * @returns {boolean} Returns `true` if the mode is 'new' or 'Point:Ellipse', otherwise `false`.
  * @description This method checks if the ellipse tool is enabled for the given mode by comparing it with the supported modes.
  */
  ellipse_inherits(EllipseToolbar, _AnnotationUIToolbarB);
  return ellipse_createClass(EllipseToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'Point:Ellipse'].includes(mode);
    }
    /**
     * Update the instructions based on the annotation tool's mode.
     * @param {string} mode - The mode of the annotation tool.
     * @description This method updates the instructions text based on the annotation tool's mode. It provides appropriate instructions for different modes.
     */
  }, {
    key: "updateInstructions",
    value: function updateInstructions(mode) {
      var text = mode == 'new' ? 'Click and drag to create an ellipse' : mode == 'Point:Ellipse' ? 'Drag a point to resize' : '???';
      this.instructions.innerHTML = text;
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/polygon.mjs
function polygon_typeof(o) { "@babel/helpers - typeof"; return polygon_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, polygon_typeof(o); }
function polygon_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function polygon_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, polygon_toPropertyKey(o.key), o); } }
function polygon_createClass(e, r, t) { return r && polygon_defineProperties(e.prototype, r), t && polygon_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function polygon_toPropertyKey(t) { var i = polygon_toPrimitive(t, "string"); return "symbol" == polygon_typeof(i) ? i : i + ""; }
function polygon_toPrimitive(t, r) { if ("object" != polygon_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != polygon_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function polygon_callSuper(t, o, e) { return o = polygon_getPrototypeOf(o), polygon_possibleConstructorReturn(t, polygon_isNativeReflectConstruct() ? Reflect.construct(o, e || [], polygon_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function polygon_possibleConstructorReturn(t, e) { if (e && ("object" == polygon_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return polygon_assertThisInitialized(t); }
function polygon_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function polygon_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (polygon_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function polygon_getPrototypeOf(t) { return polygon_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, polygon_getPrototypeOf(t); }
function polygon_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && polygon_setPrototypeOf(t, e); }
function polygon_setPrototypeOf(t, e) { return polygon_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, polygon_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a polygon annotation tool that allows users to create and manipulate polygons on a canvas.
 * Inherits functionality from the AnnotationUITool class.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var PolygonTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Creates an instance of PolygonTool.
   * @constructor
   * @param {Object} paperScope - The Paper.js paper scope object, which provides context for working with Paper.js functionalities.
   * @description Initializes the PolygonTool by calling the base class (AnnotationUITool) constructor and setting up event handlers for drawing and editing polygons.
   * @property {paper.Tool} tool - The Paper.js Tool object associated with the PolygonTool.
   * @property {paper.Group} drawingGroup - The Paper.js Group used for drawing polygons.
   * @property {paper.Segment} draggingSegment - The currently dragged segment during editing.
   * @property {boolean} eraseMode - A flag indicating whether the tool is in erase mode.
   * @property {Object} simplifying - A flag indicating whether the tool is simplifying the drawn polygon.
   * @property {SimplifyJS} simplifier - An instance of the SimplifyJS library used for polygon simplification.
   */
  function PolygonTool(paperScope) {
    var _this2;
    polygon_classCallCheck(this, PolygonTool);
    _this2 = polygon_callSuper(this, PolygonTool, [paperScope]);
    var _this = _this2;
    var tool = _this2.tool;
    _this2._lastClickTime = 0;
    _this2.drawingGroup = new _paper.Group();
    _this2._currentItem = null;
    _this2._currentItemSelectedColor = null;
    _this2.project.toolLayer.addChild(_this2.drawingGroup);
    _this2.drawingGroup.visible = false;
    _this2.draggingSegment = null;
    _this2.eraseMode = false;
    _this2.simplifying = null;
    // this.simplifier = new SimplifyJS();
    _this2.setToolbarControl(new PolygonToolbar(_this2));

    /**
     * Event handler when the tool is activated.
     * Configures the tool settings and displays the drawing group on activation.
     * @private
     */
    _this2.extensions.onActivate = function () {
      tool.minDistance = 4 / _this.project.getZoom();
      tool.maxDistance = 20 / _this.project.getZoom();
      _this.drawingGroup.visible = true;
      _this.drawingGroup.selected = true;
      _this.targetLayer.addChild(_this.drawingGroup);
      _this._cacheCurrentItem();
    };
    /**
     * Event handler when the tool is deactivated.
     * Finalizes the current interaction if finished is true.
     * @private
     * @param {boolean} finished - A flag indicating whether the tool interaction is finished.
     */
    _this2.extensions.onDeactivate = function (finished) {
      if (finished) {
        _this.finish();
        _this.project.toolLayer.addChild(_this.drawingGroup);
        _this.drawingGroup.removeChildren();
        _this.drawingGroup.visible = false;
        _this.drawingGroup.selected = false;
        _this._restoreCachedItem();
        _this._currentItem = null;
      }
    };

    /**
     * Event handler for the key down event.
     * Handles keyboard shortcuts like toggling erase mode and undo/redo.
     * @private
     * @param {paper.KeyEvent} ev - The key event.
     */
    tool.extensions.onKeyDown = function (ev) {
      if (ev.key == 'e') {
        if (_this.eraseMode === false) {
          _this.setEraseMode(true);
        } else if (_this.eraseMode === true) {
          _this.eraseMode = 'keyhold';
        }
      }
      if ((ev.event.metaKey || ev.event.ctrlKey) && !ev.event.shiftKey && ev.event.key === 'z') {
        _this.undo();
      }
      if ((ev.event.metaKey || ev.event.ctrlKey) && ev.event.shiftKey && ev.event.key === 'z') {
        _this.redo();
      }
    };
    /**
     * Event handler for the key up event.
     * Handles releasing keys, such as exiting erase mode.
     * @private
     * @param {paper.KeyEvent} ev - The key event.
     */
    tool.extensions.onKeyUp = function (ev) {
      if (ev.key == 'e' && _this.eraseMode == 'keyhold') {
        _this.setEraseMode(false);
      }
    };
    return _this2;
  }
  polygon_inherits(PolygonTool, _AnnotationUITool);
  return polygon_createClass(PolygonTool, [{
    key: "_cacheCurrentItem",
    value: function _cacheCurrentItem() {
      this._currentItem = this.item;
      this._currentItem && (this._currentItem.selectedColor = this._currentItemSelectedColor);
    }
  }, {
    key: "_restoreCachedItem",
    value: function _restoreCachedItem() {
      this._currentItem && (this._currentItem.selectedColor = this._currentItemSelectedColor);
    }
  }, {
    key: "onSelectionChanged",
    value: function onSelectionChanged() {
      if (this.item !== this._currentItem) {
        this._restoreCachedItem();
        this._cacheCurrentItem();
        this.targetLayer.addChild(this.drawingGroup);
        this.drawingGroup.removeChildren();
        this.setEraseMode(this.eraseMode);
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      this.draggingSegment = null;
      var now = Date.now();
      var interval = now - this._lastClickTime;
      var dblClick = interval < 300;
      this._lastClickTime = now;
      this.simplifying && this.cancelSimplify();
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('MultiPolygon');
        this.refreshItems();
        this._cacheCurrentItem();
        this.saveHistory();
      }
      var dr = this.drawing();
      if (dr && dblClick) {
        this.finishCurrentPath();
        this.draggingSegment = null;
        return;
      }
      var hitResult = (dr && dr.path || this.item).hitTest(ev.point, {
        fill: false,
        stroke: true,
        segments: true,
        tolerance: this.getTolerance(5)
      });
      if (hitResult) {
        //if erasing and hitResult is a segment, hitResult.segment.remove()
        if (hitResult.type == 'segment' && this.eraseMode) {
          hitResult.segment.remove();
        }
        //if hitResult is a segment and NOT erasing, save reference to hitResult.segment for dragging it
        else if (hitResult.type == 'segment') {
          this.draggingSegment = hitResult.segment;
        }
        //if hitResult is a stroke, add a point:
        else if (hitResult.type == 'stroke') {
          var insertIndex = hitResult.location.index + 1;
          var ns = hitResult.item.insert(insertIndex, ev.point);
        }
      } else if (dr) {
        //already drawing, add point to the current path object
        if (ev.point.subtract(dr.path.lastSegment).length < 5 / this.project.getZoom()) return;
        dr.path.add(ev.point);
      } else {
        //not drawing yet, but start now!
        this.drawingGroup.removeChildren();
        this.drawingGroup.addChild(new _paper.Path([ev.point]));
        this.drawingGroup.visible = true;
        this.drawingGroup.selected = true;
        this.drawingGroup.selectedColor = this.eraseMode ? 'red' : null;
      }
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(ev) {
      var dr = this.drawing();
      if (dr && dr.path.segments.length > 1) {
        var hitResult = dr.path.hitTest(ev.point, {
          fill: false,
          stroke: false,
          segments: true,
          tolerance: this.getTolerance(5)
        });
        if (hitResult && hitResult.segment == dr.path.firstSegment) {
          this.finishCurrentPath();
        }
      } else if (this.draggingSegment) {
        this.draggingSegment = null;
        if (!this.item.isBoundingElement) {
          var boundingItems = this.item.parent.children.filter(function (i) {
            return i.isBoundingElement;
          });
          this.item.applyBounds(boundingItems);
        }
      }
      this.saveHistory();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      var dr = this.drawing();
      var hitResult = this.item && (dr && dr.path || this.item).hitTest(ev.point, {
        fill: false,
        stroke: true,
        segments: true,
        tolerance: this.getTolerance(5)
      });
      if (hitResult) {
        var action = hitResult.type + (this.eraseMode ? '-erase' : '');
        this.project.overlay.addClass('tool-action').setAttribute('data-tool-action', action);
      } else {
        this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action', '');
      }
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      var dr = this.drawing();
      if (dr) {
        dr.path.add(ev.point);
      } else if (this.draggingSegment) {
        this.draggingSegment.point = this.draggingSegment.point.add(ev.delta);
      }
    }
    /**
     * Retrieves the current drawing state, including the active path being drawn.
     * @returns {?{path: paper.Path}} The current drawing state or null if no path is being drawn.
     */
  }, {
    key: "drawing",
    value: function drawing() {
      return this.drawingGroup.lastChild && {
        path: this.drawingGroup.lastChild
      };
    }
    /**
     * Finalizes the current polygon drawing and performs necessary cleanup.
     */
  }, {
    key: "finish",
    value: function finish() {
      // this.finishCurrentPath();
      this.setEraseMode(false);
      this.draggingSegment = null;
      this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action', '');
      this.deactivate();
      this.drawingGroup.selected = false;
      this.drawingGroup.visible = false;
    }

    /**
     * Sets the erase mode, enabling or disabling removal of segments or entire polygons.
     * @param {boolean} erase - True to enable erase mode, false to disable.
     */
  }, {
    key: "setEraseMode",
    value: function setEraseMode(erase) {
      this.eraseMode = erase;
      this.item && (this.item.selectedColor = erase ? 'red' : null);
      this.drawingGroup.selectedColor = erase ? 'red' : null;
      this.toolbarControl.setEraseMode(erase);
    }
    /**
     * Completes the current polygon path and updates the annotation accordingly.
     */
  }, {
    key: "finishCurrentPath",
    value: function finishCurrentPath() {
      var dr = this.drawing();
      if (!dr || !this.item || !this.item.parent) return;
      dr.path.closed = true;
      var result = this.eraseMode ? this.item.subtract(dr.path, {
        insert: false
      }) : this.item.unite(dr.path, {
        insert: false
      });
      if (result) {
        result = result.toCompoundPath();
        if (!this.item.isBoundingElement) {
          var boundingItems = this.item.parent.children.filter(function (i) {
            return i.isBoundingElement;
          });
          result.applyBounds(boundingItems);
        }
        this.item.removeChildren();
        this.item.addChildren(result.children);
        this.item.children.forEach(function (child) {
          return child.selected = false;
        }); //only have the parent set selected status
        result.remove();
      }
      this.drawingGroup.removeChildren();
    }
    /**
     * Saves the current state of the annotation to the history stack for undo/redo functionality.
     */
  }, {
    key: "saveHistory",
    value: function saveHistory() {
      //push current state onto history stack
      var historyLength = 10;
      var idx = (this.item.history || []).position || 0;
      this.item.history = [{
        children: this.item.children.map(function (x) {
          return x.clone({
            insert: false,
            deep: true
          });
        }),
        drawingGroup: this.drawingGroup.children.map(function (x) {
          return x.clone({
            insert: false,
            deep: true
          });
        })
      }].concat((this.item.history || []).slice(idx, historyLength));
    }
    /**
     * Undoes the last annotation action, restoring the previous state.
     */
  }, {
    key: "undo",
    value: function undo() {
      var history = this.item.history || [];
      var idx = (history.position || 0) + 1;
      if (idx < history.length) {
        this.drawingGroup.removeChildren();
        this.item.removeChildren();
        this.item.children = history[idx].children.map(function (x) {
          return x.clone({
            insert: true,
            deep: true
          });
        });
        this.drawingGroup.children = history[idx].drawingGroup.map(function (x) {
          return x.clone({
            insert: true,
            deep: true
          });
        });
        history.position = idx;
      }
    }
    /**
     * Redoes the previously undone annotation action, restoring the next state.
     */
  }, {
    key: "redo",
    value: function redo() {
      var history = this.item.history || [];
      var idx = (history.position || 0) - 1;
      if (idx >= 0) {
        this.drawingGroup.removeChildren();
        this.item.removeChildren();
        this.item.children = history[idx].children.map(function (x) {
          return x.clone({
            insert: true,
            deep: true
          });
        });
        this.drawingGroup.children = history[idx].drawingGroup.map(function (x) {
          return x.clone({
            insert: true,
            deep: true
          });
        });
        history.position = idx;
      }
    }
  }]);
}(AnnotationUITool);

/**
 * Represents the toolbar for the PolygonTool, providing UI controls for polygon annotation.
 * Inherits functionality from the AnnotationUIToolbarBase class.
 * @extends AnnotationUIToolbarBase
 * @class
 * @memberof OSDPaperjsAnnotation.PolygonTool
 */
var PolygonToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new instance of the PolygonToolbar class.
   * @param {PolygonTool} polyTool - The associated PolygonTool instance.
   */
  function PolygonToolbar(polyTool) {
    var _this3;
    polygon_classCallCheck(this, PolygonToolbar);
    _this3 = polygon_callSuper(this, PolygonToolbar, [polyTool]);
    var i = makeFaIcon('fa-draw-polygon');
    _this3.button.configure(i, 'Polygon Tool');
    var fdd = document.createElement('div');
    fdd.classList.add('dropdown', 'polygon-toolbar');
    fdd.setAttribute('data-tool', 'polygon');
    _this3.dropdown.appendChild(fdd);
    var s = document.createElement('span');
    s.innerHTML = 'Click or Drag';
    fdd.appendChild(s);
    var simplifyDiv = document.createElement('div');
    fdd.appendChild(simplifyDiv);
    _this3.simplifyButton = document.createElement('button');
    _this3.simplifyButton.setAttribute('data-action', 'simplify');
    _this3.simplifyButton.innerHTML = 'Simplify';
    simplifyDiv.append(_this3.simplifyButton);
    _this3.simplifyButton.addEventListener('click', function () {
      polyTool.doSimplify();
      polyTool.saveHistory();
    });
    _this3.eraseButton = document.createElement('button');
    fdd.appendChild(_this3.eraseButton);
    _this3.eraseButton.setAttribute('data-action', 'erase');
    _this3.eraseButton.innerHTML = 'Eraser';
    _this3.eraseButton.addEventListener('click', function () {
      var erasing = this.classList.toggle('active');
      polyTool.setEraseMode(erasing);
    });
    var undoRedo = document.createElement('span');
    fdd.appendChild(undoRedo);
    _this3.undoButton = document.createElement('button');
    undoRedo.appendChild(_this3.undoButton);
    _this3.undoButton.setAttribute('data-action', 'undo');
    _this3.undoButton.setAttribute('title', 'Undo (ctrl-Z)');
    _this3.undoButton.innerHTML = '<';
    _this3.undoButton.addEventListener('click', function () {
      polyTool.undo();
    });
    _this3.redoButton = document.createElement('button');
    undoRedo.appendChild(_this3.redoButton);
    _this3.redoButton.setAttribute('data-action', 'redo');
    _this3.redoButton.setAttribute('title', 'Redo (ctrl-shift-Z)');
    _this3.redoButton.innerHTML = '>';
    _this3.redoButton.addEventListener('click', function () {
      polyTool.redo();
    });
    return _this3;
  }
  /**
   * Check if the toolbar is enabled for the given mode.
   * @param {string} mode - The annotation mode.
   * @returns {boolean} True if enabled, false otherwise.
   */
  polygon_inherits(PolygonToolbar, _AnnotationUIToolbarB);
  return polygon_createClass(PolygonToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'MultiPolygon', 'Polygon'].includes(mode);
    }
    /**
     * Set the erase mode for the toolbar, updating UI state.
     * @param {boolean} erasing - True to enable erase mode, false to disable.
     */
  }, {
    key: "setEraseMode",
    value: function setEraseMode(erasing) {
      erasing ? this.eraseButton.classList.add('active') : this.eraseButton.classList.remove('active');
    }
  }]);
}(AnnotationUIToolbarBase);

;// ./src/js/papertools/linestring.mjs
function linestring_typeof(o) { "@babel/helpers - typeof"; return linestring_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, linestring_typeof(o); }
function linestring_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function linestring_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, linestring_toPropertyKey(o.key), o); } }
function linestring_createClass(e, r, t) { return r && linestring_defineProperties(e.prototype, r), t && linestring_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function linestring_toPropertyKey(t) { var i = linestring_toPrimitive(t, "string"); return "symbol" == linestring_typeof(i) ? i : i + ""; }
function linestring_toPrimitive(t, r) { if ("object" != linestring_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != linestring_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function linestring_callSuper(t, o, e) { return o = linestring_getPrototypeOf(o), linestring_possibleConstructorReturn(t, linestring_isNativeReflectConstruct() ? Reflect.construct(o, e || [], linestring_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function linestring_possibleConstructorReturn(t, e) { if (e && ("object" == linestring_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return linestring_assertThisInitialized(t); }
function linestring_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function linestring_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (linestring_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function linestring_getPrototypeOf(t) { return linestring_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, linestring_getPrototypeOf(t); }
function linestring_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && linestring_setPrototypeOf(t, e); }
function linestring_setPrototypeOf(t, e) { return linestring_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, linestring_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The LinestringTool class extends the PolygonTool and provides functionality for creating and modifying linestrings.
 * @extends PolygonTool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var LinestringTool = /*#__PURE__*/function (_PolygonTool) {
  /**
  * The constructor initializes the LinestringTool by calling the base class (PolygonTool) constructor and sets up the necessary toolbar control (LinestringToolbar).
  * @memberof OSDPaperjsAnnotation.LinestringTool
  * @constructor
  * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
  * @property {paper.Shape.Circle} cursor - The cursor representing the pen for drawing linestrings. It is a Paper.js Circle shape.
  * @property {number} radius - The brush radius for drawing linestrings. This property controls the width of the linestring paths.
  * @property {paper.Path} draggingSegment - The segment that is being dragged during the mouse drag event. It is a Paper.js Path representing the segment.
  */
  function LinestringTool(paperScope) {
    var _this;
    linestring_classCallCheck(this, LinestringTool);
    _this = linestring_callSuper(this, LinestringTool, [paperScope]);
    var self = _this;
    var tool = _this.tool;
    _this.setToolbarControl(new LinestringToolbar(_this));
    var lastClickTime = 0;
    var drawColor = new _paper.Color('green');
    var eraseColor = new _paper.Color('red');
    _this.radius = 0;
    _this.cursor = new _paper.Shape.Circle(new _paper.Point(0, 0), _this.radius);
    _this.cursor.set({
      strokeWidth: 1,
      strokeColor: 'black',
      fillColor: drawColor,
      opacity: 1,
      visible: false
    });
    self.project.toolLayer.addChild(_this.cursor);
    _this.clickAction = 'startPath';
    _this.extensions.onActivate = function () {
      _this.cursor.radius = _this.radius / _this.project.getZoom();
      _this.cursor.strokeWidth = 1 / _this.project.getZoom();
      _this.refreshCursorVisibility();
      tool.minDistance = 4 / self.project.getZoom();
      tool.maxDistance = 10 / self.project.getZoom();
    };
    _this.extensions.onDeactivate = function (finished) {
      _this.cursor.visible = false;
      if (finished) {
        _this.finish();
      }
    };
    tool.onMouseWheel = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.deltaY == 0) return; //ignore lateral "scrolls"

      _this.toolbarControl.updateBrushRadius({
        larger: ev.deltaY < 0
      });
    };
    return _this;
  }

  /**
   * Set the brush radius for the linestring tool.
   * This function updates the brush radius used for drawing linestrings.
   * The new radius is adjusted according to the current zoom level.
   * @param {number} r - The new brush radius value to set.
   * 
   */
  linestring_inherits(LinestringTool, _PolygonTool);
  return linestring_createClass(LinestringTool, [{
    key: "setRadius",
    value: function setRadius(r) {
      this.radius = r;
      this.cursor.radius = r / this.project.getZoom();
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      var _this$item;
      this.draggingSegment = null;
      if (this.itemToCreate) {
        this.itemToCreate.initializeGeoJSONFeature('MultiLineString');
        this.refreshItems();
        this.startNewPath(ev);
        return;
      }
      var hitResult = (_this$item = this.item) === null || _this$item === void 0 ? void 0 : _this$item.hitTest(ev.point, {
        fill: false,
        stroke: false,
        segments: true,
        tolerance: this.getTolerance(5)
      });
      if (hitResult) {
        //if erasing and hitResult is a segment, hitResult.segment.remove()
        if (hitResult.type == 'segment' && this.eraseMode) {
          hitResult.segment.remove();
        }

        //if hitResult is a segment and NOT erasing, save reference to hitResult.segment for dragging it
        else if (hitResult.type == 'segment') {
          this.draggingSegment = hitResult.segment;
        }

        //if hitResult is a stroke, add a point (unless in erase mode):
        else if (hitResult.type == 'stroke' && !this.eraseMode) {
          var insertIndex = hitResult.location.index + 1;
          hitResult.item.insert(insertIndex, ev.point);
        }
      } else {
        //not drawing yet, but start now!
        if (!this.eraseMode) this.startNewPath(ev);
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      var _this$item2;
      this.cursor.position = ev.original.point;
      var hitResult = (_this$item2 = this.item) === null || _this$item2 === void 0 ? void 0 : _this$item2.hitTest(ev.point, {
        fill: false,
        stroke: false,
        segments: true,
        tolerance: this.getTolerance(5)
      });
      if (hitResult) {
        var action = hitResult.type + (this.eraseMode ? '-erase' : '');
        this.project.overlay.addClass('tool-action').setAttribute('data-tool-action', action);
        this.clickAction = action;
      } else {
        this.project.overlay.removeClass('tool-action').setAttribute('data-tool-action', '');
        this.clickAction = 'startPath';
      }
      this.refreshCursorVisibility();
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(ev) {
      this.cursor.position = ev.original.point;
      PolygonTool.prototype.onMouseDrag.call(this, ev);
      var dr = this.drawing();
      dr && (dr.path.segments = this.simplifier.simplify(dr.path.segments.map(function (s) {
        return s.point;
      })));
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(ev) {
      this.finishCurrentPath();
    }

    /**
     * Start a new linestring path when the user clicks the mouse.
     * This function initializes the creation of a new linestring path, sets up a drawing group to hold the path, and listens for user mouse events to add new points to the path.
     * @function startNewPath
     * @memberof OSDPaperjsAnnotation.LinestringTool#
     * @param {paper.MouseEvent} ev - The mouse event containing the click information.
     */
  }, {
    key: "startNewPath",
    value: function startNewPath(ev) {
      this.finishCurrentPath();
      this.drawingGroup.removeChildren();
      this.drawingGroup.addChild(new _paper.Path([ev.point]));
      // this.drawing = {path:this.drawingGroup.lastChild, index: 1};
      this.drawingGroup.visible = true;
      this.drawingGroup.selected = true;
      this.drawingGroup.selectedColor = this.eraseMode ? 'red' : null;
      var path = this.drawing().path;
      path.set({
        strokeWidth: this.radius * 2 / this.targetLayer.scaling.x / this.project.getZoom(),
        strokeColor: this.item.strokeColor,
        strokeJoin: 'round',
        strokeCap: 'round'
      });
    }
    //override finishCurrentPath so it doesn't close the path
    /**
     * Finish the current linestring path when the user releases the mouse.
     * This function finalizes the current linestring path by adding it to the main item and clears the drawing group.
     * @function finishCurrentPath
     * @memberof OSDPaperjsAnnotation.LinestringTool#
     */
  }, {
    key: "finishCurrentPath",
    value: function finishCurrentPath() {
      if (!this.drawing() || !this.item) return;
      var newPath = this.drawing().path;
      if (newPath.segments.length > 1) {
        this.item.addChild(this.drawing().path);
      }
      this.drawingGroup.removeChildren();
    }
  }, {
    key: "refreshCursorVisibility",
    value: function refreshCursorVisibility() {
      this.cursor.visible = !this.eraseMode && this.clickAction === 'startPath';
    }
  }]);
}(PolygonTool);

/**
 * The LinestringToolbar class extends the AnnotationUIToolbarBase and provides the toolbar controls for the LinestringTool.
 * The constructor initializes the LinestringToolbar by calling the base class (AnnotationUIToolbarBase) constructor and sets up the necessary toolbar controls.
 * @extends AnnotationUIToolbarBase
 * @class
 * @memberof OSDPaperjsAnnotation.LinestringTool
 * @param {OSDPaperjsAnnotation.LinestringTool} linestringTool - The LinestringTool instance associated with the toolbar.
 * @property {jQuery} rangeInput - The range input element for adjusting the brush radius in the toolbar.
 * @property {jQuery} eraseButton - The erase button element in the toolbar for toggling erase mode.
 *
 */
var LinestringToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new LinestringToolbar instance.
   * The constructor initializes the LinestringToolbar by calling the base class (AnnotationUIToolbarBase) constructor and sets up the necessary toolbar controls.
   * @constructor
   * @param {OSDPaperjsAnnotation.LinestringTool} linestringTool - The LinestringTool instance associated with the toolbar.
   */
  function LinestringToolbar(linestringTool) {
    var _this2;
    linestring_classCallCheck(this, LinestringToolbar);
    _this2 = linestring_callSuper(this, LinestringToolbar, [linestringTool]);
    _this2.linestringTool = linestringTool;
    var i = makeFaIcon('fa-pen-nib');
    _this2.button.configure(i, 'Linestring Tool');
    var fdd = document.createElement('div');
    fdd.classList.add('dropdown', 'linestring-toolbar');
    fdd.setAttribute('data-tool', 'linestring');
    _this2.dropdown.appendChild(fdd);
    var label = document.createElement('label');
    label.innerHTML = 'Set pen width:';
    fdd.appendChild(label);
    var defaultRadius = 4;
    _this2.rangeInput = document.createElement('input');
    fdd.appendChild(_this2.rangeInput);
    Object.assign(_this2.rangeInput, {
      type: 'range',
      min: 0.2,
      max: 12,
      step: 0.1,
      value: defaultRadius
    });
    _this2.rangeInput.addEventListener('change', function () {
      linestringTool.setRadius(this.value);
    });
    _this2.eraseButton = document.createElement('button');
    fdd.appendChild(_this2.eraseButton);
    _this2.eraseButton.innerHTML = 'Eraser';
    _this2.eraseButton.setAttribute('data-action', 'erase');
    _this2.eraseButton.addEventListener('click', function () {
      var erasing = this.classList.toggle('active');
      linestringTool.setEraseMode(erasing);
    });
    setTimeout(function () {
      return linestringTool.setRadius(defaultRadius);
    });
    return _this2;
  }
  /**
   * Update the brush radius based on the mouse wheel scroll direction.
   * The updateBrushRadius function is called when the user scrolls the mouse wheel in the LinestringToolbar.
   * It updates the brush radius value based on the direction of the mouse wheel scroll.
   * If the larger property of the update object is true, it increases the brush radius.
   * If the larger property of the update object is false, it decreases the brush radius.
   * @function
   * @param {Object} update - An object containing the update information.
   * @param {boolean} update.larger - A boolean value indicating whether the brush radius should be increased or decreased.
   */
  linestring_inherits(LinestringToolbar, _AnnotationUIToolbarB);
  return linestring_createClass(LinestringToolbar, [{
    key: "updateBrushRadius",
    value: function updateBrushRadius(update) {
      if (update.larger) {
        this.rangeInput.value = parseFloat(this.rangeInput.value) + parseFloat(this.rangeInput.step);
        this.rangeInput.dispatchEvent(new Event('change'));
      } else {
        this.rangeInput.value = parseFloat(this.rangeInput.value) - parseFloat(this.rangeInput.step);
        this.rangeInput.dispatchEvent(new Event('change'));
      }
    }
    /**
    * Check if the LinestringTool should be enabled for the current mode.
    * The isEnabledForMode function is called to determine if the LinestringTool should be enabled for the current mode.
    * It returns true if the mode is 'new', 'LineString', or 'MultiLineString', and false otherwise.
    * @function
    * @param {string} mode - The current mode of the tool.
    * @returns {boolean} - A boolean value indicating whether the LinestringTool should be enabled for the current mode.
    */
  }, {
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['new', 'LineString', 'MultiLineString'].includes(mode);
    }
    /**
     * Set the erase mode for the LinestringTool.
     * The setEraseMode function is called when the user clicks the erase button in the LinestringToolbar.
     * It sets the erase mode of the associated LinestringTool based on the value of the erasing parameter.
     * If erasing is true, it enables the erase mode in the LinestringTool by adding the 'active' class to the erase button.
     * If erasing is false, it disables the erase mode by removing the 'active' class from the erase button.
     * @function
     * @param {boolean} erasing - A boolean value indicating whether the erase mode should be enabled or disabled.
     */
  }, {
    key: "setEraseMode",
    value: function setEraseMode(erasing) {
      erasing ? this.eraseButton.classList.add('active') : this.eraseButton.classList.remove('active');
      this.linestringTool.refreshCursorVisibility();
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/select.mjs
function select_typeof(o) { "@babel/helpers - typeof"; return select_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, select_typeof(o); }
function select_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function select_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, select_toPropertyKey(o.key), o); } }
function select_createClass(e, r, t) { return r && select_defineProperties(e.prototype, r), t && select_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function select_toPropertyKey(t) { var i = select_toPrimitive(t, "string"); return "symbol" == select_typeof(i) ? i : i + ""; }
function select_toPrimitive(t, r) { if ("object" != select_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != select_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function select_callSuper(t, o, e) { return o = select_getPrototypeOf(o), select_possibleConstructorReturn(t, select_isNativeReflectConstruct() ? Reflect.construct(o, e || [], select_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function select_possibleConstructorReturn(t, e) { if (e && ("object" == select_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return select_assertThisInitialized(t); }
function select_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function select_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (select_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function select_getPrototypeOf(t) { return select_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, select_getPrototypeOf(t); }
function select_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && select_setPrototypeOf(t, e); }
function select_setPrototypeOf(t, e) { return select_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, select_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents the SelectTool class that extends the AnnotationUITool.
 * This tool allows users to select and manipulate GeoJSON feature items on the Paper.js project.
 * @class
 */
var SelectTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
   * Creates an instance of SelectTool.
   * @constructor
   * @param {Object} paperScope - The Paper.js paper scope object.
   * @property {Object} ps - Reference to the Paper.js project scope.
   * @property {SelectToolbar} toolbarControl - Sets the toolbar control for the SelectTool.
   * @property {paper.Path.Rectangle} selectionRectangle - The selection rectangle used for area-based selection.
   * @property {paper.Path.Rectangle} sr2 - A second selection rectangle with a dashed border.
   * @description This tool provides the ability to select and manipulate GeoJSON feature items on the canvas. Users can select items by clicking
   * on them or by performing area-based selection through click-and-drag. It also emits selection-related events for interaction and provides
   * functions to retrieve selected items and check for the existence of GeoJSON feature items.
   */
  function SelectTool(paperScope) {
    var _this;
    select_classCallCheck(this, SelectTool);
    _this = select_callSuper(this, SelectTool, [paperScope]);
    var self = _this;
    _this.ps = _this.project.paperScope;
    _this.setToolbarControl(new SelectToolbar(_this));
    var selectionRectangle = new _paper.Path.Rectangle({
      strokeWidth: 1,
      rescale: {
        strokeWidth: 1
      },
      strokeColor: 'black'
    });
    var sr2 = new _paper.Path.Rectangle({
      strokeWidth: 1,
      dashArray: [10, 10],
      rescale: {
        strokeWidth: 1,
        dashArray: [10, 10]
      },
      strokeColor: 'white'
    });
    _this.project.toolLayer.addChild(selectionRectangle);
    _this.project.toolLayer.addChild(sr2);
    selectionRectangle.applyRescale();
    sr2.applyRescale();
    selectionRectangle.visible = false;
    sr2.visible = false;
    _this.extensions.onActivate = function () {
      self.tool.onMouseMove = function (ev) {
        return self.onMouseMove(ev);
      };
    };
    _this.extensions.onDeactivate = function (shouldFinish) {
      self.project.overlay.removeClass('selectable-layer');
      self.tool.onMouseMove = null;
    };
    _this.tool.extensions.onKeyUp = function (ev) {
      if (ev.key == 'escape') {
        self.project.paperScope.findSelectedItems().forEach(function (item) {
          return item.deselect();
        });
      }
    };

    /**
     * Event handler for mouse up events.
     * @private
     * @param {Event} ev - The mouse up event.
     * @property {boolean} visible - Hide the selection rectangle.
     * @property {HitResult} hitResult - The result of the hit test to find the item under the mouse pointer.
     * @property {boolean} toggleSelection - Indicates whether the 'Control' or 'Meta' key was pressed during the event.
     * @property {HitResult[]} hitResults - An array of hit test results containing items found within the area.
     * @property {boolean} keepExistingSelection - Indicates whether the 'Control' or 'Meta' key was pressed during the event.
     * @property {Item[]} selectedItems - An array of selected items to be deselected.
     */
    _this.tool.onMouseUp = function (ev) {
      selectionRectangle.visible = false;
      sr2.visible = false;
      if (ev.downPoint.subtract(ev.point).length == 0) {
        //not a click-and-drag, do element selection
        var hitResult = self.hitTestPoint(ev);
        hitResult && self._isItemSelectable(hitResult.item) && hitResult.item.toggle(ev.modifiers.control || ev.modifiers.meta);
      } else {
        //click and drag, do area-based selection
        var hitResults = self.hitTestArea(ev);
        var keepExistingSelection = ev.modifiers.control || ev.modifiers.meta;
        if (!keepExistingSelection) {
          self.project.paperScope.findSelectedItems().forEach(function (item) {
            return item.deselect();
          });
        }
        hitResults.forEach(function (item) {
          return item.select(true);
        });
        //limit results to a single layer
        // hitResults.filter(item=>item.layer === hitResults[0].layer).forEach(item=>item.select(true))
      }
    };
    /**
     * Event handler for mouse drag events.
     * @private
     * @param {Event} ev - The mouse drag event.
     * @property {boolean} visible - Show the selection rectangle.
     * @property {Rectangle} r - The bounding rectangle of the selection area.
     */
    _this.tool.onMouseDrag = function (ev) {
      selectionRectangle.visible = true;
      sr2.visible = true;
      var r = new _paper.Rectangle(ev.downPoint, ev.point);
      selectionRectangle.set({
        segments: [r.topLeft, r.topRight, r.bottomRight, r.bottomLeft]
      });
      sr2.set({
        segments: [r.topLeft, r.topRight, r.bottomRight, r.bottomLeft]
      });
      // console.log(selectionRectangle.visible, selectionRectangle.segments)
    };
    return _this;
  }
  //   /**
  //    * Gets the selected items that are GeoJSON features.
  //    * This method retrieves all the items in the Paper.js project that are considered as GeoJSON features and are currently selected.
  //    * @returns {Array<Object>} An array of selected items that are GeoJSON features.
  //    */
  //     getSelectedItems(){
  //         return this.ps.project.selectedItems.filter(i=>i.isGeoJSONFeature);
  //     }
  /**
   * Checks if there are any GeoJSON feature items in the project.
   * This method searches through all the items in the Paper.js project and determines if there are any GeoJSON feature items.
   * @returns {boolean} Returns true if there are GeoJSON feature items, false otherwise.
   */
  select_inherits(SelectTool, _AnnotationUITool);
  return select_createClass(SelectTool, [{
    key: "doAnnotationItemsExist",
    value: function doAnnotationItemsExist() {
      return this.ps.project.getItems({
        match: function match(i) {
          return i.isGeoJSONFeature;
        }
      }).length > 0;
    }

    /**
     * Handles mouse movement events and emits selection-related events for items under the cursor.
     * When the mouse moves within the Paper.js project area, this method detects if it is over any item and triggers related selection events.
     * It updates the currently hovered item and layer, and applies a CSS class to the project's overlay for highlighting selectable layers.
     * @param {Object} ev - The mouse move event object containing information about the cursor position.
     */
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      if (ev.item && this._isItemSelectable(ev.item)) {
        if (this.currentItem != ev.item) ev.item.emit('selection:mouseenter') || true;
        if (this.currentLayer != ev.item.layer) ev.item.layer.emit('selection:mouseenter');
        this.currentItem = ev.item;
        this.currentLayer = this.currentItem.layer;
        this.project.overlay.addClass('selectable-layer');
      } else {
        this.currenItem && (this.currentItem.emit('selection:mouseleave', ev) || true);
        this.currentLayer && this.currentLayer.emit('selection:mouseleave', ev);
        this.project.overlay.removeClass('selectable-layer');
        this.currentItem = null;
        this.currentLayer = null;
      }
    }
    /**
     * Performs a hit test on a specific point and returns hit results for GeoJSON feature items.
     * This method performs a hit test on the provided point and filters the results to include only GeoJSON feature items.
     * It also adjusts the hit result if the initial hit is not on the GeoJSON feature itself, but on a child item.
     * @param {Object} ev - The mouse event object containing the point to perform the hit test on.
     * @returns {HitResult} The hit result object containing information about the hit test.
     */
  }, {
    key: "hitTestPoint",
    value: function hitTestPoint(ev) {
      var hitResult = this.ps.project.hitTest(ev.point, {
        fill: true,
        stroke: true,
        segments: true,
        tolerance: this.getTolerance(5),
        match: function match(i) {
          return i.item.isGeoJSONFeature || i.item.parent.isGeoJSONFeature;
        }
      });
      if (hitResult && !hitResult.item.isGeoJSONFeature) {
        hitResult.item = hitResult.item.parent;
      }
      return hitResult;
    }
    /**
     * Performs a hit test within an area and returns hit results for GeoJSON feature items.
     * This method performs a hit test within the provided area and returns hit results that include only GeoJSON feature items.
     * It supports options for testing against fully contained or overlapping items.
     * @param {Object} ev - The mouse event object containing the area for hit testing.
     * @param {boolean} [onlyFullyContained=false] - Flag to indicate if hit test should be performed only on fully contained items.
     * @returns {HitResult[]} An array of hit results containing GeoJSON feature items within the specified area.
     */
  }, {
    key: "hitTestArea",
    value: function hitTestArea(ev, onlyFullyContained) {
      var options = {
        match: function match(item) {
          return item.isGeoJSONFeature;
        }
      };
      var testRectangle = new _paper.Rectangle(ev.point, ev.downPoint);
      if (onlyFullyContained) {
        options.inside = testRectangle;
      } else {
        options.overlapping = testRectangle;
      }
      var hitResult = this.ps.project.getItems(options);
      return hitResult;
    }
  }, {
    key: "_isItemSelectable",
    value: function _isItemSelectable(item) {
      return true;
      return this.items.length == 0 || item.layer == this.targetLayer;
    }
  }]);
}(AnnotationUITool);

var SelectToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  function SelectToolbar(tool) {
    var _this2;
    select_classCallCheck(this, SelectToolbar);
    _this2 = select_callSuper(this, SelectToolbar, [tool]);
    _this2.dropdown.classList.add('select-dropdown');
    var i = makeFaIcon('fa-arrow-pointer');
    _this2.button.configure(i, 'Selection Tool');
    var s = document.createElement('div');
    s.setAttribute('data-active', 'select');
    _this2.dropdown.appendChild(s);
    var span = document.createElement('span');
    span.innerHTML = '(Ctrl)click to select items.';
    s.append(span);
    return _this2;
  }
  select_inherits(SelectToolbar, _AnnotationUIToolbarB);
  return select_createClass(SelectToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      var itemsExist = this.tool.doAnnotationItemsExist();
      return itemsExist && ['default', 'select', 'multiselection', 'Polygon', 'MultiPolygon', 'Point:Rectangle', 'Point:Ellipse', 'Point', 'LineString', 'MultiLineString', 'GeometryColletion:Raster'].includes(mode);
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/transform.mjs
function transform_typeof(o) { "@babel/helpers - typeof"; return transform_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, transform_typeof(o); }
function transform_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function transform_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, transform_toPropertyKey(o.key), o); } }
function transform_createClass(e, r, t) { return r && transform_defineProperties(e.prototype, r), t && transform_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function transform_toPropertyKey(t) { var i = transform_toPrimitive(t, "string"); return "symbol" == transform_typeof(i) ? i : i + ""; }
function transform_toPrimitive(t, r) { if ("object" != transform_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != transform_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function transform_callSuper(t, o, e) { return o = transform_getPrototypeOf(o), transform_possibleConstructorReturn(t, transform_isNativeReflectConstruct() ? Reflect.construct(o, e || [], transform_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function transform_possibleConstructorReturn(t, e) { if (e && ("object" == transform_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return transform_assertThisInitialized(t); }
function transform_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function transform_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (transform_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function transform_getPrototypeOf(t) { return transform_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, transform_getPrototypeOf(t); }
function transform_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && transform_setPrototypeOf(t, e); }
function transform_setPrototypeOf(t, e) { return transform_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, transform_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The TransformTool class extends the AnnotationUITool and provides functionality for transforming selected items on the canvas.
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var TransformTool = /*#__PURE__*/function (_AnnotationUITool) {
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
  function TransformTool(paperScope) {
    var _this;
    transform_classCallCheck(this, TransformTool);
    _this = transform_callSuper(this, TransformTool, [paperScope]);
    var self = _this;
    _this.ps = _this.project.paperScope;
    _this._mode = 'transform';
    _this._moving = [];
    _this._active = false;
    _this.setToolbarControl(new TransformToolbar(_this));
    _this._makeTransformToolObject(self.project.getZoom());
    _this.extensions.onActivate = function () {
      self._active = true;
      self.enableTransformToolObject();
    };
    _this.extensions.onDeactivate = function (shouldFinish) {
      self._active = false;
      self.project.overlay.removeClass('transform-tool-resize', 'transform-tool-rotate', 'transform-tool-move');
      if (shouldFinish) {
        self.disableTransformToolObject();
      }
    };
    return _this;
  }
  transform_inherits(TransformTool, _AnnotationUITool);
  return transform_createClass(TransformTool, [{
    key: "onSelectionChanged",
    value: function onSelectionChanged() {
      this.enableTransformToolObject();
    }

    /**
     * @param {boolean} alwaysRescaleUniformly Whether the tool should enforce uniform scaling to maintain width:height ratio
     */
  }, {
    key: "setUniformScaling",
    value: function setUniformScaling(alwaysRescaleUniformly) {
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
  }, {
    key: "_makeTransformToolObject",
    value: function _makeTransformToolObject(currentZoom) {
      var _this2 = this;
      var self = this;
      var cSize = 12; //control size

      if (this._transformTool) this._transformTool.remove();
      this._transformTool = new _paper.Group();
      this.project.toolLayer.addChild(this._transformTool);
      this._transformTool.applyMatrix = false;
      this._transformTool.transforming = [];
      this._transformTool.boundingRect = new _paper.Shape.Rectangle(new _paper.Point(0, 0), new _paper.Size(0, 0));
      this._transformTool.boundingDisplay = new _paper.Shape.Rectangle(new _paper.Point(0, 0), new _paper.Size(0, 0));
      this._transformTool.boundingRect.set({
        strokeWidth: 0,
        fillColor: new _paper.Color(0, 0, 0, 0.001)
      });
      this._transformTool.boundingDisplay.set({
        strokeWidth: 5,
        strokeColor: 'lightblue',
        rescale: {
          strokeWidth: 5
        }
      });
      this._transformTool.addChild(this._transformTool.boundingRect);
      this._transformTool.addChild(this._transformTool.boundingDisplay);

      //Resize operations
      this._transformTool.corners = [['topLeft', 'bottomRight'], ['topRight', 'bottomLeft'], ['bottomRight', 'topLeft'], ['bottomLeft', 'topRight']].reduce(function (acc, c) {
        var ctrl = new _paper.Shape.Rectangle(new _paper.Point(0, 0), new _paper.Size(cSize / currentZoom, cSize / currentZoom));
        ctrl.set({
          rescale: {
            size: function size(z) {
              return new _paper.Size(cSize / z, cSize / z);
            }
          },
          fillColor: 'red',
          strokeColor: 'black'
        });
        self._transformTool.addChild(ctrl);
        ctrl.anchor = c[0];
        ctrl.opposite = c[1];
        ctrl.onMouseDown = function (ev) {
          ev.stopPropagation();
        };

        // scaling operations
        ctrl.onMouseDrag = function (ev) {
          // first handle the bounding box
          var layerAngle = self.targetLayer.getRotation();
          var rotation = this.parent.rotation;
          var delta = ev.delta.rotate(-rotation);
          var refPos = this.parent.corners[this.opposite].position;
          if (self._alwaysRescaleUniformly || ev.modifiers.command || ev.modifiers.control) {
            delta = delta.project(this.position.subtract(refPos));
          }
          var oldPos = this.position;
          var newPos = this.position.add(delta);
          var oldSize = new _paper.Rectangle(refPos, oldPos).size;
          var newSize = new _paper.Rectangle(refPos, newPos).size;
          var scaleFactor = newSize.divide(oldSize);
          var refPosX = refPos.transform(this.parent.matrix);
          var refPosZ = this.parent.matrix.inverseTransform(this.parent.corners[this.opposite].refPos);
          refPosZ = self.targetMatrix.inverseTransform(refPosZ);
          this.parent.transforming.forEach(function (item) {
            var matrix = new _paper.Matrix().rotate(-layerAngle, refPosZ).scale(scaleFactor.width, scaleFactor.height, refPosZ).rotate(layerAngle, refPosZ);
            item.matrix.append(matrix);
            item.onTransform && item.onTransform('scale', refPosX, rotation, matrix);
          });
          this.parent.boundingRect.scale(scaleFactor.width, scaleFactor.height, refPos);
          this.parent.setBounds(true);
        };
        acc[c[0]] = ctrl;
        return acc;
      }, {});

      //Rotation operations
      this._transformTool.rotationHandle = new _paper.Shape.Circle(new _paper.Point(0, 0), cSize / currentZoom);
      this._transformTool.rotationHandle.set({
        fillColor: 'red',
        strokeColor: 'black',
        rescale: {
          radius: cSize
        }
      });
      this._transformTool.addChild(this._transformTool.rotationHandle);
      this._transformTool.rotationHandle.onMouseDown = function (ev) {
        ev.stopPropagation();
      };
      this._transformTool.rotationHandle.onMouseDrag = function (ev) {
        var parentMatrix = this.parent.matrix;
        var center = parentMatrix.transform(this.parent.boundingRect.position);
        var oldVec = ev.point.subtract(ev.delta).subtract(center);
        var newVec = ev.point.subtract(center);
        var angle = newVec.angle - oldVec.angle;
        this.parent.rotate(angle, center);
        this.parent.transforming.forEach(function (item) {
          var itemCenter = self.targetMatrix.inverseTransform(center);
          item.rotate(angle, itemCenter);
          item.onTransform && item.onTransform('rotate', angle, itemCenter);
        });
        Object.values(this.parent.corners).forEach(function (corner) {
          corner.refPos = corner.refPos.rotate(angle, center);
        });
      };

      //Translation operations
      this.onMouseDrag = function (ev) {
        if (!_this2._transformTool._moveOnDrag) return;

        // use original delta for the tool's display rectangle and handles
        _this2._transformTool.translate(ev.original.delta);

        // use transformed delta for the object we're transforming
        var delta = ev.delta;
        Object.values(_this2._transformTool.corners).forEach(function (corner) {
          corner.refPos = corner.refPos.add(ev.original.delta);
        });
        _this2._transformTool.transforming.forEach(function (item) {
          item.translate(delta);
          item.onTransform && item.onTransform('translate', delta);
        });
      };

      //(re)positioning the tool handles (corners, rotation control)
      this._transformTool.setBounds = function () {
        var useExistingBoundingRect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!useExistingBoundingRect) {
          var bounds = this.transforming.reduce(function (acc, item) {
            item.transform(self.targetLayer.matrix);
            acc.minX = acc.minX === null ? item.bounds.topLeft.x : Math.min(acc.minX, item.bounds.topLeft.x);
            acc.minY = acc.minY === null ? item.bounds.topLeft.y : Math.min(acc.minY, item.bounds.topLeft.y);
            acc.maxX = acc.maxX === null ? item.bounds.bottomRight.x : Math.max(acc.maxX, item.bounds.bottomRight.x);
            acc.maxY = acc.maxY === null ? item.bounds.bottomRight.y : Math.max(acc.maxY, item.bounds.bottomRight.y);
            item.transform(self.targetLayer.matrix.inverted());
            return acc;
          }, {
            minX: null,
            minY: null,
            maxX: null,
            maxY: null
          });

          // bounds = self.targetMatrix.transform(bounds);

          var topLeft = new _paper.Point(bounds.minX, bounds.minY);
          var bottomRight = new _paper.Point(bounds.maxX, bounds.maxY);
          var rect = new _paper.Rectangle(topLeft, bottomRight);
          this.matrix.reset();
          this.boundingRect.set({
            position: rect.center,
            size: rect.size
          });
          // this.transforming.forEach(item=>item.rotationAxis=new paper.Point(rect.center));
        }
        var br = this.boundingRect;
        this.boundingDisplay.set({
          position: br.position,
          size: br.bounds.size
        });
        Object.values(this.corners).forEach(function (c) {
          c.position = br.bounds[c.anchor];
          // if(!useExistingBoundingRect) c.refPt.position = c.position;
          if (!useExistingBoundingRect) c.refPos = c.position;
        });
        this.rotationHandle.set({
          position: br.position.subtract(new _paper.Point(0, br.bounds.size.height / 2 + this.rotationHandle.radius * 2))
        });
      };
      this._transformTool.transformItems = function (items) {
        //finish applying all transforms to previous items (called during disableTransformToolObject)
        this.transforming.forEach(function (item) {
          item.matrix.apply(true, true);
          item.onTransform && item.onTransform('complete');
        });

        //set up new objects for transforming, and reset matrices of the tool
        this.transforming = items;
        items.forEach(function (item) {
          return item.applyMatrix = false;
        });
        this.matrix.reset();
        this.boundingRect.matrix.reset();
        this.boundingDisplay.matrix.reset();
        this.setBounds();
      };
      this._transformTool.visible = false;
    }
    /**
     * A function that enables the TransformTool object for transforming selected items.
     * This function activates the TransformTool, bringing it to the front, and sets up items for transformation.
     */
  }, {
    key: "enableTransformToolObject",
    value: function enableTransformToolObject() {
      if (this.items.length > 0) {
        this.project.toolLayer.bringToFront();
        this._transformTool.visible = true;
        this._transformTool.transformItems(this.items);
      }
    }
    /**
     * A function that disables the TransformTool object after transforming selected items.
     * This function deactivates the TransformTool, sends it to the back, and resets item matrices.
     */
  }, {
    key: "disableTransformToolObject",
    value: function disableTransformToolObject() {
      this.project.toolLayer.sendToBack();
      this._transformTool.transformItems([]);
      this._transformTool.visible = false;
    }
    /**
     * A function that performs a hit test on the canvas to find the item under the specified coordinates.
     * This function is used to determine the item selected for transformation.
     * @param {paper.Point} coords - The coordinates to perform the hit test.
     * @returns {paper.HitResult} - The result of the hit test, containing the selected item.
     */
  }, {
    key: "hitTest",
    value: function hitTest(coords) {
      var hitResult = this.ps.project.hitTest(coords, {
        fill: true,
        stroke: true,
        segments: true,
        tolerance: this.getTolerance(5),
        match: function match(i) {
          return i.item.isGeoJSONFeature || i.item.parent.isGeoJSONFeature;
        }
      });
      if (hitResult && !hitResult.item.isGeoJSONFeature) {
        hitResult.item = hitResult.item.parent;
      }
      return hitResult;
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      if (!this._active) return;
      var hitResult = this.project.paperScope.project.hitTest(ev.original.point);
      if (hitResult) {
        if (Object.values(this._transformTool.corners).includes(hitResult.item)) {
          this.project.overlay.addClass('transform-tool-resize');
        } else {
          this.project.overlay.removeClass('transform-tool-resize');
        }
        if (this._transformTool.rotationHandle == hitResult.item) {
          this.project.overlay.addClass('transform-tool-rotate');
        } else {
          this.project.overlay.removeClass('transform-tool-rotate');
        }
        if ([this._transformTool.boundingRect, this._transformTool.boundingDisplay].includes(hitResult.item)) {
          this.project.overlay.addClass('transform-tool-move');
          this._transformTool._moveOnDrag = true;
        } else {
          this.project.overlay.removeClass('transform-tool-move');
          this._transformTool._moveOnDrag = false;
        }
      } else {
        this.project.overlay.removeClass('transform-tool-resize', 'transform-tool-rotate', 'transform-tool-move');
      }
    }
  }]);
}(AnnotationUITool);

/**
 * The TransformToolbar class extends the AnnotationUIToolbarBase and provides functionality for the transform tool's toolbar.
 * @memberof OSDPaperjsAnnotation.TransformTool
 * @extends AnnotationUIToolbarBase
 */
var TransformToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
   * Create a new TransformToolbar instance.
   * @memberof OSDPaperjsAnnotation.TransformToolbar
   * @constructor
   * @param {TransformTool} tool - The TransformTool instance associated with the toolbar.
   */
  function TransformToolbar(tool) {
    var _this3;
    transform_classCallCheck(this, TransformToolbar);
    _this3 = transform_callSuper(this, TransformToolbar, [tool]);
    _this3.dropdown.classList.add('transform-dropdown');
    var i = makeFaIcon('fa-up-down-left-right');
    _this3.button.configure(i, 'Transform Tool');
    return _this3;
  }
  /**
   * Checks if the transform tool is enabled for the specified mode.
   * The transform tool is enabled when there are selected items on the canvas.
   * @method
   * @param {string} mode - The current mode.
   * @returns {boolean} - True if the transform tool is enabled for the mode, otherwise false.
   */
  transform_inherits(TransformToolbar, _AnnotationUIToolbarB);
  return transform_createClass(TransformToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      var selectedItems = this.tool.project.paperScope.findSelectedItems();
      return selectedItems.length > 0 && ['select', 'multiselection', 'Polygon', 'MultiPolygon', 'Point:Rectangle', 'Point:Ellipse',
      // 'Point', // disable for Point because neither resize nor scaling work for that object type
      'LineString', 'GeometryCollection:Raster'].includes(mode) && new Set(selectedItems.map(function (item) {
        return item.layer;
      })).size == 1;
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/papertools/raster.mjs
function raster_typeof(o) { "@babel/helpers - typeof"; return raster_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, raster_typeof(o); }
function raster_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function raster_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, raster_toPropertyKey(o.key), o); } }
function raster_createClass(e, r, t) { return r && raster_defineProperties(e.prototype, r), t && raster_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function raster_toPropertyKey(t) { var i = raster_toPrimitive(t, "string"); return "symbol" == raster_typeof(i) ? i : i + ""; }
function raster_toPrimitive(t, r) { if ("object" != raster_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != raster_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function raster_callSuper(t, o, e) { return o = raster_getPrototypeOf(o), raster_possibleConstructorReturn(t, raster_isNativeReflectConstruct() ? Reflect.construct(o, e || [], raster_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function raster_possibleConstructorReturn(t, e) { if (e && ("object" == raster_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return raster_assertThisInitialized(t); }
function raster_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function raster_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (raster_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function raster_getPrototypeOf(t) { return raster_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, raster_getPrototypeOf(t); }
function raster_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && raster_setPrototypeOf(t, e); }
function raster_setPrototypeOf(t, e) { return raster_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, raster_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The RasterTool class extends the AnnotationUITool and provides functionality for rasterizing annotations.
 * @extends AnnotationUITool
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var RasterTool = /*#__PURE__*/function (_AnnotationUITool) {
  /**
  * Creates a new RasterTool instance.
  * The constructor initializes the RasterTool by calling the base class (AnnotationUITool) constructor and sets up the necessary toolbar control (RasterToolbar).
  * @memberof OSDPaperjsAnnotation.RasterTool
  * @constructor
  * @param {paper.PaperScope} paperScope - The Paper.js scope for the tool.
  */
  function RasterTool(paperScope) {
    var _this;
    raster_classCallCheck(this, RasterTool);
    _this = raster_callSuper(this, RasterTool, [paperScope]);
    _this.setToolbarControl(new RasterToolbar(_this));
    return _this;
  }
  /**
   * Rasterizes the current annotation item. It converts the vector annotation to a pixel-based raster.
   * After rasterization, it replaces the original annotation with the rasterized version.
   * The rasterized version includes both the raster image and the original annotation's geoJSON data.
   * @property {function} onLoad The function performs rasterization and replacement of the vector annotation with the rasterized version.
   * @property {Object} geoJSON geoJSON data representing the rasterized annotation item.
   * @property {string} geoJSON.type - The type of the geoJSON object (e.g., 'Feature').
   * @property {Object} geoJSON.geometry - The geometry information of the geoJSON object.
   * @property {string} geoJSON.geometry.type - The type of the geometry (e.g., 'GeometryCollection').
   * @property {Object} geoJSON.geometry.properties - Additional properties of the geometry.
   * @property {string} geoJSON.geometry.properties.subtype - The subtype of the geometry (e.g., 'Raster').
   * @property {Object} geoJSON.geometry.properties.raster - The raster data of the geometry.
   * @property {paper.Raster} geoJSON.geometry.properties.raster.data - The pixel-based raster data.
   * @property {Object} geoJSON.geometries - The list of geometries in the geometry collection.
   * @property {Object} geoJSON.properties - The properties of the geoJSON object.
   *
   */
  raster_inherits(RasterTool, _AnnotationUITool);
  return raster_createClass(RasterTool, [{
    key: "rasterize",
    value: function rasterize() {
      var self = this;
      var item = this.item;
      if (item) {
        var raster = this.project.overlay.getViewportRaster();
        item.layer.addChild(raster);
        raster.onLoad = function () {
          //get the subregion in pixel coordinates of the large raster by inverse transforming the bounding rect of the item
          var offset = new _paper.Point(this.width / 2, this.height / 2);
          var newBounds = new _paper.Rectangle(offset.add(this.matrix.inverseTransform(this.layer.matrix.transform(item.bounds.topLeft))).floor(), offset.add(this.matrix.inverseTransform(this.layer.matrix.transform(item.bounds.bottomRight))).ceil());
          var subraster = this.getSubRaster(newBounds);
          subraster.transform(this.layer.matrix.inverted());
          subraster.selectedColor = null;
          var geoJSON = {
            type: 'Feature',
            geometry: {
              type: 'GeometryCollection',
              properties: {
                subtype: 'Raster',
                raster: {
                  data: subraster
                }
              },
              geometries: [item]
            },
            properties: {}
          };
          item.replaceWith(_paper.Item.fromGeoJSON(geoJSON));
          self.refreshItems();
          this.remove();
        };
      }
    }
  }]);
}(AnnotationUITool);

/**
 * The RasterToolbar class extends the AnnotationUIToolbarBase and provides the toolbar functionality for the RasterTool.
 * @extends AnnotationUIToolbarBase
 * @class 
 * @memberof OSDPaperjsAnnotation.RasterTool
 */
var RasterToolbar = /*#__PURE__*/function (_AnnotationUIToolbarB) {
  /**
  * The constructor sets up the toolbar UI with a button to trigger rasterization.
  * It also adds a warning message regarding the irreversible nature of rasterization.   * @constructor
  * @param {RasterTool} tool - The RasterTool instance.
  */
  function RasterToolbar(tool) {
    var _this2;
    raster_classCallCheck(this, RasterToolbar);
    _this2 = raster_callSuper(this, RasterToolbar, [tool]);
    var i = makeFaIcon('fa-image');
    _this2.button.configure(i, 'raster Tool');
    var d = document.createElement('div');
    _this2.dropdown.appendChild(d);
    var button = document.createElement('button');
    button.innerHTML = 'Convert to raster';
    d.appendChild(button);
    var span = document.createElement('span');
    span.innerHTML = 'Warning: this cannot be undone!';
    d.appendChild(span);
    button.addEventListener('click', function () {
      return tool.rasterize();
    });
    return _this2;
  }
  /**
  * Checks if the RasterTool is enabled for the given mode.
  * @function
  * @param {string} mode - The mode of the annotation, such as 'MultiPolygon', 'Point:Rectangle', or 'Point:Ellipse'.
  * @returns {boolean} - Returns true if the RasterTool is enabled for the given mode, false otherwise.
  */
  raster_inherits(RasterToolbar, _AnnotationUIToolbarB);
  return raster_createClass(RasterToolbar, [{
    key: "isEnabledForMode",
    value: function isEnabledForMode(mode) {
      return ['Polygon', 'MultiPolygon', 'Point:Rectangle', 'Point:Ellipse'].includes(mode);
    }
  }]);
}(AnnotationUIToolbarBase);
;// ./src/js/annotationtoolbar.mjs
function annotationtoolbar_typeof(o) { "@babel/helpers - typeof"; return annotationtoolbar_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, annotationtoolbar_typeof(o); }
function annotationtoolbar_toConsumableArray(r) { return annotationtoolbar_arrayWithoutHoles(r) || annotationtoolbar_iterableToArray(r) || annotationtoolbar_unsupportedIterableToArray(r) || annotationtoolbar_nonIterableSpread(); }
function annotationtoolbar_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function annotationtoolbar_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return annotationtoolbar_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? annotationtoolbar_arrayLikeToArray(r, a) : void 0; } }
function annotationtoolbar_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function annotationtoolbar_arrayWithoutHoles(r) { if (Array.isArray(r)) return annotationtoolbar_arrayLikeToArray(r); }
function annotationtoolbar_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function annotationtoolbar_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function annotationtoolbar_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, annotationtoolbar_toPropertyKey(o.key), o); } }
function annotationtoolbar_createClass(e, r, t) { return r && annotationtoolbar_defineProperties(e.prototype, r), t && annotationtoolbar_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function annotationtoolbar_toPropertyKey(t) { var i = annotationtoolbar_toPrimitive(t, "string"); return "symbol" == annotationtoolbar_typeof(i) ? i : i + ""; }
function annotationtoolbar_toPrimitive(t, r) { if ("object" != annotationtoolbar_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != annotationtoolbar_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * A class for creating and managing annotation toolbars
 * @memberof OSDPaperjsAnnotation
 * @class 
 * 
 */
var AnnotationToolbar = /*#__PURE__*/function () {
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
  function AnnotationToolbar(paperScope, tools) {
    var _this = this;
    annotationtoolbar_classCallCheck(this, AnnotationToolbar);
    // tools should be an array of strings, or null/falsey
    if (tools && !Array.isArray(tools)) {
      throw 'Bad option: if present, tools must be an Array of tool names or constructors to use.';
    }
    this.ui = this._makeUI();
    this.paperScope = paperScope;
    this.currentMode = null;
    this.setModeTimeout = null;
    var toolLayer = new paperScope.Layer();
    toolLayer.isGeoJSONFeatureCollection = false;
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
      "default": DefaultTool,
      select: SelectTool,
      transform: TransformTool,
      style: StyleTool,
      rectangle: RectangleTool,
      ellipse: EllipseTool,
      point: PointTool,
      text: PointTextTool,
      polygon: PolygonTool,
      brush: BrushTool,
      wand: WandTool,
      linestring: LinestringTool,
      raster: RasterTool
    };
    this.tools = {};

    // if array of tools was passed in, use that. Otherwise use all available ones listed in the toolConstructors dictionary
    var toolsToUse = tools || Object.keys(this.toolConstructors);
    // make sure the default tool is always included
    if (toolsToUse.indexOf('default') == -1) {
      toolsToUse = ['default'].concat(annotationtoolbar_toConsumableArray(toolsToUse));
    }
    //activate our paperScope before creating the tools
    this.paperScope.activate();
    toolsToUse.forEach(function (t) {
      if (typeof t === 'string') {
        if (!_this.toolConstructors[t]) {
          console.warn("The requested tool is invalid: ".concat(t, ". No constructor found for that name."));
          return;
        }
      } else if (!(t instanceof ToolBase)) {
        console.warn("".concat(t, " must inherit from class ToolBase"));
        return;
      }
      var toolConstructor = t instanceof ToolBase ? t : _this.toolConstructors[t];
      var toolObj = _this.tools[t] = new toolConstructor(_this.paperScope);
      var toolbarControl = toolObj.getToolbarControl();
      if (toolbarControl) _this.addToolbarControl(toolbarControl);
      toolObj.addEventListener('deactivated', function (ev) {
        //If deactivation is triggered by another tool being activated, this condition will fail
        if (ev.target == _this.paperScope.getActiveTool()) {
          _this.tools["default"].activate();
        }
      });
    });
    this.tools["default"].activate();
    this.setMode();

    //items emit events on the paper project; add listeners to update the toolbar status as needed       
    paperScope.project.on({
      'item-replaced': function itemReplaced() {
        _this.setMode();
      },
      'item-selected': function itemSelected() {
        _this.setMode();
      },
      'item-deselected': function itemDeselected() {
        _this.setMode();
      },
      'item-removed': function itemRemoved() {
        _this.setMode();
      },
      'items-changed': function itemsChanged() {
        _this.setMode();
      }
    });
  }
  return annotationtoolbar_createClass(AnnotationToolbar, [{
    key: "element",
    get: function get() {
      return this._element;
    }

    /**
     * Sets the mode of the toolbar based on the currently selected items in the project. Individual tools will be enabled and disabled by this. If the currently active tool is not supported for the selected item(s) it will be deactivated.
     * 
     */
  }, {
    key: "setMode",
    value: function setMode() {
      var _this2 = this;
      var self = this;
      this.setModeTimeout && clearTimeout(this.setModeTimeout);
      this.setModeTimeout = setTimeout(function () {
        _this2.setModeTimeout = null;
        var selection = _this2.paperScope.findSelectedItems();
        var activeTool = _this2.paperScope.getActiveTool();
        if (selection.length === 0) {
          _this2.currentMode = 'select';
        } else if (selection.length === 1) {
          var item = selection[0];
          var def = item.annotationItem || {};
          var type = def.type;
          if (def.subtype) type += ':' + def.subtype;
          var mode = type === null ? 'new' : type;
          _this2.currentMode = mode;
        } else {
          _this2.currentMode = 'multiselection';
        }
        if (activeTool.getToolbarControl().isEnabledForMode(_this2.currentMode) === false) {
          activeTool.deactivate(true);
          _this2.tools["default"].activate();
        }
        Object.values(_this2.tools).forEach(function (toolObj) {
          var t = toolObj.getToolbarControl();
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
  }, {
    key: "addToolbarControl",
    value: function addToolbarControl(toolbarControl) {
      var button = toolbarControl.button.element;
      var dropdown = toolbarControl.dropdown;
      this._buttonbar.appendChild(button);
      this._dropdowns.appendChild(dropdown);
      toolbarControl.isEnabledForMode(this.currentMode) ? toolbarControl.button.enable() : toolbarControl.button.disable();
    }

    /**
     * Shows the Annotation Toolbar.
     */
  }, {
    key: "show",
    value: function show() {
      this.element.style.display = 'inline-block';
    }
    /**
     * Hides the Annotation Toolbar.
     */
  }, {
    key: "hide",
    value: function hide() {
      this.element.style.display = 'none';
    }

    /**
     * Destroys the Annotation Toolbar.
     *
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: "_makeUI",
    value: function _makeUI() {
      var _this3 = this;
      this._element = document.createElement('div');
      this._buttonbar = document.createElement('div');
      this._dropdowns = document.createElement('div');
      var dropdownContainer = document.createElement('div');
      this._element.appendChild(this._buttonbar);
      this._element.appendChild(dropdownContainer);
      dropdownContainer.appendChild(this._dropdowns);
      var classes = 'annotation-ui-drawing-toolbar btn-group btn-group-sm mode-selection'.split(' ');
      classes.forEach(function (c) {
        return _this3._element.classList.add(c);
      });
      dropdownContainer.classList.add('dropdowns-container');
      this._dropdowns.classList.add('dropdowns');
      this._buttonbar.classList.add('annotation-ui-buttonbar');
    }
  }]);
}();

;// ./src/js/utils/editablecontent.mjs
function editablecontent_typeof(o) { "@babel/helpers - typeof"; return editablecontent_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, editablecontent_typeof(o); }
function editablecontent_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function editablecontent_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, editablecontent_toPropertyKey(o.key), o); } }
function editablecontent_createClass(e, r, t) { return r && editablecontent_defineProperties(e.prototype, r), t && editablecontent_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function editablecontent_toPropertyKey(t) { var i = editablecontent_toPrimitive(t, "string"); return "symbol" == editablecontent_typeof(i) ? i : i + ""; }
function editablecontent_toPrimitive(t, r) { if ("object" != editablecontent_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != editablecontent_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * @class EditableContent
 * @param {Object} [opts] options
 * @param {String} [opts.initialContent] The initial content for the editable element. Default = 'Enter text...'
 * @param {IconFactory} [opts.iconFactory] An icon factory instance to use
 */
var EditableContent = /*#__PURE__*/function () {
  function EditableContent(opts) {
    var _this = this;
    editablecontent_classCallCheck(this, EditableContent);
    var defaultOpts = {
      initialContent: 'Enter text...',
      iconFactory: null
    };
    opts = Object.assign({}, defaultOpts, opts);
    this._element = document.createElement('span');
    this._textcontainer = document.createElement('span');
    this._textcontainer.classList.add('text-container');
    this._element.appendChild(this._textcontainer);
    this._textcontent = document.createElement('span');
    this._textcontent.classList.add('text-content');
    this._textcontainer.appendChild(this._textcontent);
    var ta = this._textarea = document.createElement('textarea');
    this._textcontainer.appendChild(ta);
    ta.setAttribute('rows', '1');
    this._button = document.createElement('span');
    this._element.appendChild(this._button);
    this._oldtext = '';

    // let buttonicon = document.createElement('span');
    var buttonicon = opts.iconFactory ? opts.iconFactory.makeFaIcon('fa-edit') : makeFaIcon('fa-edit');
    this._button.appendChild(buttonicon);
    buttonicon.classList.add('edit-button', 'onhover');
    this._element.classList.add('editablecontent');
    this._textarea.textContent = opts.initialContent;
    //this._textarea.setAttribute('contenteditable',true);

    this._textarea.addEventListener('focusout', function () {
      if (!_this._element.classList.contains('editing')) {
        return;
      }
      _this._element.classList.remove('editing');
      _this._updateText(true);
      // this._textarea.setAttribute('contenteditable',false);
    });
    this._textarea.addEventListener('keypress', function (ev) {
      if (!_this._element.classList.contains('editing')) {
        return;
      }
      ev.stopPropagation();
      if (ev.key == 'Enter' || ev.key == 'Escape') {
        ev.preventDefault();
        _this._textarea.blur();
      }
    });
    this._textarea.addEventListener('input', function () {
      _this._updateText();
    });
    this._element.addEventListener('keydown keyup', function (ev) {
      if (!_this._element.classList.contains('editing')) {
        return;
      }
      ev.stopPropagation();
    });
    this._button.addEventListener('click', function (ev) {
      if (_this._onEditClicked) _this._onEditClicked(ev);
      _this._element.classList.toggle('editing');
      _this._oldtext = _this._textarea.value.trim();
      _this._textarea.select();
    });
  }
  return editablecontent_createClass(EditableContent, [{
    key: "element",
    get: function get() {
      return this._element;
    }
  }, {
    key: "onChanged",
    get: function get() {
      return this._onChanged;
    },
    set: function set(func) {
      if (typeof func === 'function' || func === null) {
        this._onChanged = func;
      } else {
        throw 'Value must be a function or null';
      }
    }
  }, {
    key: "onEditClicked",
    get: function get() {
      return this._onEditClicked;
    },
    set: function set(func) {
      if (typeof func === 'function' || func === null) {
        this._onEditClicked = func;
      } else {
        throw 'Value must be a function or null';
      }
    }
    // private
    // sync the textcontent and textarea text and call the onChange callback if needed
  }, {
    key: "_updateText",
    value: function _updateText(trim) {
      var newtext = this._textarea.value;
      if (trim) {
        newtext = newtext.trim();
      }
      this._textcontent.textContent = newtext;
      if (newtext !== this._oldtext) {
        this.onChanged && this.onChanged(newtext);
      }
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this._textarea.value = text;
      this._textcontent.textContent = text;
    }
  }]);
}();
;// ./src/js/utils/domObjectFromHTML.mjs
function domObjectFromHTML(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.children.length === 1 ? template.content.children[0] : template.content.children;
}
;// ./src/js/featureui.mjs
function featureui_typeof(o) { "@babel/helpers - typeof"; return featureui_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, featureui_typeof(o); }
function featureui_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function featureui_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, featureui_toPropertyKey(o.key), o); } }
function featureui_createClass(e, r, t) { return r && featureui_defineProperties(e.prototype, r), t && featureui_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function featureui_toPropertyKey(t) { var i = featureui_toPrimitive(t, "string"); return "symbol" == featureui_typeof(i) ? i : i + ""; }
function featureui_toPrimitive(t, r) { if ("object" != featureui_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != featureui_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * A user interface for managing features.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var FeatureUI = /*#__PURE__*/function () {
  /**
   * Create a new FeatureUI instance.
   * @constructor
   * @param {paper.Item} paperItem - The paper item object.
   * @param {object} [opts] - The initialization options.
   * @param {IconFactory} [opts.iconFactory] - the IconFactory to use
   */
  function FeatureUI(paperItem, opts) {
    var _this = this;
    featureui_classCallCheck(this, FeatureUI);
    this.paperItem = paperItem;
    var el = this._element = makeFeatureElement();
    opts.iconFactory ? opts.iconFactory.convertFaIcons(el) : convertFaIcons(el);
    this.paperItem.FeatureUI = this;
    this._editableName = new EditableContent();
    el.querySelector('.feature-item.name').appendChild(this._editableName.element);
    this._editableName.onChanged = function (text) {
      _this.setLabel(text, 'user-defined');
    };
    this._editableName.onEditClicked = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    datastore.set(el, {
      feature: this
    });
    el.addEventListener('click', function (ev) {
      if (ev.target.matches('[data-action]')) {
        //don't bubble up
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var action = ev.target.dataset.action;
        switch (action) {
          case 'trash':
            _this.removeItem();
            break;
          case 'bounds':
            _this.useAsBoundingElement(true);
            break;
          case 'style':
            _this.openStyleEditor(ev);
            break;
          case 'zoom-to':
            _this.centerItem();
            break;
          default:
            console.log('No function set for action:', action);
        }
      }
    });
    el.addEventListener('click', function (ev) {
      ev.stopPropagation();
      _this.paperItem.toggle(ev.metaKey || ev.ctrlKey);
    });
    this.element = el;
    this.paperItem.on({
      'selected': function selected() {
        el.classList.add('selected');
        el.dispatchEvent(new Event('selected'));
      },
      'deselected': function deselected() {
        el.classList.remove('selected');
        el.dispatchEvent(new Event('deselected'));
      },
      'selection:mouseenter': function selectionMouseenter() {
        el.classList.add('item-hovered');
      },
      'selection:mouseleave': function selectionMouseleave() {
        el.classList.remove('item-hovered');
      },
      'item-replaced': function itemReplaced(ev) {
        // console.log('item-replaced',ev);
        //check label first because it is dynamically fetched from the referenced this.paperItem object
        if (_this.label.source == 'user-defined') {
          ev.item.displayName = _this.label;
        }
        _this.paperItem = ev.item;
        _this.paperItem.FeatureUI = _this;
        _this.updateLabel();
      },
      'display-name-changed': function displayNameChanged(ev) {
        _this.updateLabel();
      },
      'removed': function removed(ev) {
        if (ev.item == _this.paperItem) {
          _this.remove();
        }
      }
    });
    if (this.paperItem.selected) {
      this.paperItem.emit('selected');
    }
    this.label ? this.updateLabel() : this.setLabel('Creating...', 'initializing');
  }
  return featureui_createClass(FeatureUI, [{
    key: "label",
    get: function get() {
      return this.paperItem.displayName;
    },
    set: function set(l) {
      return this.setLabel(l);
    }
    /**
     * Set the label of the feature with a source.
     * @param {string} text - The new label of the feature.
     * @param {string} source - The source of the label (e.g. 'user-defined' or 'initializing').
     * @returns {string} The new label of the feature.
     */
  }, {
    key: "setLabel",
    value: function setLabel(text, source) {
      var l = new String(text);
      l.source = source;
      this.paperItem.displayName = l;
      this.updateLabel();
      return l;
    }
    /**
     * Update the label of the feature in the UI element.
     */
  }, {
    key: "updateLabel",
    value: function updateLabel() {
      // this._element.find('.feature-item.name').text(this.label);//.trigger('value-changed',[l]);
      this._editableName.setText(this.label);
    }
    /**
     * Remove the paper item associated with the feature.
     */
  }, {
    key: "removeItem",
    value: function removeItem() {
      //clean up paperItem
      this.paperItem.remove();
      this.paperItem.deselect();
    }
    /**
     * Remove the UI element associated with the feature.
     */
  }, {
    key: "remove",
    value: function remove() {
      this._element.remove();
      this._element.dispatchEvent(new Event('removed'));
    }

    /**
     * Use the feature as a bounding element.
     * @param {boolean} [toggle=false] - Whether to toggle the bounding element status or not.
     * @returns {boolean} Whether the feature is used as a bounding element or not.
     */
  }, {
    key: "useAsBoundingElement",
    value: function useAsBoundingElement() {
      var toggle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!this.paperItem.canBeBoundingElement) return false;
      var element = this._element.querySelector('[data-action="bounds"]');
      if (toggle) {
        element.classList.toggle('active');
      } else {
        element.classList.add('active');
      }
      var isActive = element.classList.contains('active');
      this.paperItem.isBoundingElement = isActive;
      return isActive;
    }
    /**
     * Open the style editor for the feature.
     */
  }, {
    key: "openStyleEditor",
    value: function openStyleEditor() {
      var heard = this.paperItem.project.emit('edit-style', {
        item: this.paperItem
      });
      if (!heard) {
        console.warn('No event listeners are registered for paperScope.project for event \'edit-style\'');
      }
    }
    /**
     * Center the feature in the viewport.
     * @param {boolean} [immediately=false] - Whether to center the feature immediately or not.
     */
  }, {
    key: "centerItem",
    value: function centerItem() {
      var immediately = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var viewport = this.paperItem.project.overlay.viewer.viewport;
      var bounds = this.paperItem.bounds;
      var center = viewport.imageToViewportCoordinates(bounds.center.x, bounds.center.y);
      var scale = 1.5;
      var xy = viewport.imageToViewportCoordinates(bounds.center.x - bounds.width / scale, bounds.center.y - bounds.height / scale);
      var wh = viewport.imageToViewportCoordinates(2 * bounds.width / scale, 2 * bounds.height / scale);
      var rect = new osd.Rect(xy.x, xy.y, wh.x, wh.y);
      var vb = viewport.getBounds();
      if (rect.width > vb.width || rect.height > vb.height) {
        viewport.fitBounds(rect, immediately);
      } else {
        viewport.panTo(center, immediately);
      }
    }
  }]);
}();

/**
  * Create an HTML element for the feature UI.
 * @private
 * @returns {jQuery} The jQuery object of the HTML element.
 */
function makeFeatureElement() {
  var html = "\n    <div class='feature'>\n        <div class='annotation-header hoverable-actions'>\n            <span class='onhover fa-solid fa-crop-simple bounding-element' data-action=\"bounds\" title='Bounding element'></span>\n            <span class='feature-item name'></span>\n            <span class='onhover fa-solid fa-palette' data-action='style' title='Open style editor'></span>\n            <span class='onhover fa-solid fa-binoculars' data-action='zoom-to' title='View this feature'></span>\n            <span class='onhover fa-solid fa-trash-can' data-action='trash' title='Remove'></span>\n        </div>\n    </div>\n    ";
  return domObjectFromHTML(html);
}
;// ./src/js/utils/draganddrop.mjs
function draganddrop_typeof(o) { "@babel/helpers - typeof"; return draganddrop_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, draganddrop_typeof(o); }
function draganddrop_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function draganddrop_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, draganddrop_toPropertyKey(o.key), o); } }
function draganddrop_createClass(e, r, t) { return r && draganddrop_defineProperties(e.prototype, r), t && draganddrop_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function draganddrop_toPropertyKey(t) { var i = draganddrop_toPrimitive(t, "string"); return "symbol" == draganddrop_typeof(i) ? i : i + ""; }
function draganddrop_toPrimitive(t, r) { if ("object" != draganddrop_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != draganddrop_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
var DragAndDrop = /*#__PURE__*/function () {
  /**
   * 
   * @param {Object} options 
   * @param {HTMLElement} options.parent the parent element
   * @param {String} options.selector the selector to use
   * @param {HTMLElement} options.dropTarget the element to drop onto
   * @param {function} [options.onDrop] a callback to call when drop occurs
      
   }}
   */
  function DragAndDrop(options) {
    var _this = this;
    draganddrop_classCallCheck(this, DragAndDrop);
    if (!options.parent) {
      console.error('element is required');
      return;
    }
    if (!options.selector) {
      console.error('selector is required');
      return;
    }
    if (!options.dropTarget) {
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
    this.droptarget.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      return false;
    });
    this.droptarget.addEventListener('dragleave', function (ev) {
      ev.preventDefault();
      return false;
    });
    this.droptarget.addEventListener('dragend', function (ev) {
      if (!_this.dragging) {
        return;
      }
      ev.preventDefault();
      _this.cleanupDropTarget();
      return false;
    });
    this.element.addEventListener('dragstart', function (ev) {
      if (ev.target.matches(_this.selector)) {
        ev.stopPropagation();
        _this.dragging = ev.target;
        _this.placeholder = ev.target.cloneNode(true);
        _this.placeholder.classList.add('draganddrop-placeholder');
        // this.dragging.parentNode.insertBefore(this.placeholder, this.dragging);
        ev.target.classList.add('draganddrop-dragging');
        _this.setupDropTarget();
      }
    });
    this.element.addEventListener('dragend', function (ev) {
      if (ev.target.matches(_this.selector)) {
        ev.stopPropagation();
        ev.target.classList.remove('draganddrop-dragging', 'draganddrop-hide');
        if (_this.placeholder) {
          _this.placeholder.remove();
        }
        _this.placeholder = null;
        _this.dragging = null;
        _this.cleanupDropTarget();
      }
    });
    this.element.addEventListener('dragleave', function (ev) {
      if (ev.target.matches(_this.selector)) {
        ev.stopPropagation();
      }
    });
    this.element.addEventListener('drop', function (ev) {
      if (_this.dragging && _this.placeholder.parentNode == _this.droptarget) {
        ev.stopPropagation();
        _this.placeholder.replaceWith(_this.dragging);
        _this.dragging = null;
        _this.placeholder = null;
        if (_this.onDrop) {
          _this.onDrop();
        }
      }
    });
    this.element.addEventListener('dragover', function (ev) {
      if (!_this.dragging) {
        return;
      }
      ev.preventDefault();
      _this.dragging.classList.add('draganddrop-hide');
      if (ev.target.matches(_this.selector)) {
        ev.stopPropagation();
        var top = ev.target.getBoundingClientRect().top;
        var bottom = ev.target.getBoundingClientRect().bottom;
        if (_this.placeholder == ev.target) {
          // console.log('returning');
          return;
        }
        if (ev.clientY < (top + bottom) / 2) {
          ev.target.parentNode.insertBefore(_this.placeholder, ev.target);
        } else {
          ev.target.parentNode.insertBefore(_this.placeholder, ev.target.nextSibling);
        }
      } else if (ev.target == _this.element) {
        _this.droptarget.appendChild(_this.placeholder);
        ev.stopPropagation();
      }
    });
  }

  /**
   * Add draggable attribute to children that match the selector passed in at creation
   */
  return draganddrop_createClass(DragAndDrop, [{
    key: "refresh",
    value: function refresh() {
      this.element.querySelectorAll(this.selector).forEach(function (element) {
        element.setAttribute('draggable', true);
      });
    }
  }, {
    key: "setupDropTarget",
    value: function setupDropTarget() {
      this.droptarget.classList.add('draganddrop-drop-target');
    }
  }, {
    key: "cleanupDropTarget",
    value: function cleanupDropTarget() {
      this.droptarget.classList.remove('draganddrop-drop-target');
    }
  }]);
}();
;// ./src/js/paperitems/placeholder.mjs
function placeholder_typeof(o) { "@babel/helpers - typeof"; return placeholder_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, placeholder_typeof(o); }
function placeholder_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function placeholder_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, placeholder_toPropertyKey(o.key), o); } }
function placeholder_createClass(e, r, t) { return r && placeholder_defineProperties(e.prototype, r), t && placeholder_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function placeholder_toPropertyKey(t) { var i = placeholder_toPrimitive(t, "string"); return "symbol" == placeholder_typeof(i) ? i : i + ""; }
function placeholder_toPrimitive(t, r) { if ("object" != placeholder_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != placeholder_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function placeholder_callSuper(t, o, e) { return o = placeholder_getPrototypeOf(o), placeholder_possibleConstructorReturn(t, placeholder_isNativeReflectConstruct() ? Reflect.construct(o, e || [], placeholder_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function placeholder_possibleConstructorReturn(t, e) { if (e && ("object" == placeholder_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return placeholder_assertThisInitialized(t); }
function placeholder_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function placeholder_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (placeholder_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function placeholder_getPrototypeOf(t) { return placeholder_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, placeholder_getPrototypeOf(t); }
function placeholder_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && placeholder_setPrototypeOf(t, e); }
function placeholder_setPrototypeOf(t, e) { return placeholder_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, placeholder_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a placeholder annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Placeholder` class represents a placeholder annotation item. It inherits from the `AnnotationItem` class and provides methods to work with placeholder annotations.
 */
var Placeholder = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Placeholder instance.
   * @property {paper.Path} paperItem - The associated paper item representing the placeholder.
   * @description This constructor initializes a new placeholder annotation item based on the provided GeoJSON object.
   */
  function Placeholder(styleOpts) {
    var _this;
    placeholder_classCallCheck(this, Placeholder);
    _this = placeholder_callSuper(this, Placeholder, [{
      type: 'Feature',
      geometry: null
    }]);
    _this.paperItem = new _paper.Path();
    // this.paperItem.style = this.paperItem.instructions = geoJSON;
    _this.paperItem.style = new _paper.Style(styleOpts);
    _this.paperItem.initializeGeoJSONFeature = initialize;
    return _this;
  }

  /**
   * Retrieves the supported types by the Placeholder annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  placeholder_inherits(Placeholder, _AnnotationItem);
  return placeholder_createClass(Placeholder, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === null`
     */
    function getGeoJSONType() {
      return {
        type: null
      };
    }

    /**
     * Retrieves the coordinates of the placeholder.
     * @returns {Array} An empty array.
     * @description This method returns an empty array since the Placeholder class does not have coordinates.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      return [];
    }
    /**
     * Retrieves the properties of the placeholder.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the placeholder.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      return item.style;
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type) {
      var subtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return type.toLowerCase() === null && subtype === null;
    }
  }]);
}(AnnotationItem);


/**
 * Initializes a GeoJSON feature based on the provided geometry type and subtype.
 * @param {string} geoJSONGeometryType - The GeoJSON geometry type.
 * @param {string} geometrySubtype - The subtype of the geometry.
 * @returns {paper.Item} The created paper item.
 * @private
 * @description This function initializes a GeoJSON feature using the provided geometry type and subtype, and returns the corresponding paper item.
 */
function initialize(geoJSONGeometryType, geometrySubtype) {
  var item = this;
  // let geoJSON = item.instructions;
  var geoJSON = {
    geometry: {
      type: geoJSONGeometryType,
      coordinates: [],
      properties: {
        subtype: geometrySubtype
      }
    },
    properties: item.style
  };
  var newItem = _paper.Item.fromGeoJSON(geoJSON);
  // newItem.selected=item.selected;
  item.replaceWith(newItem);
  return newItem;
}
;// ./src/js/featurecollectionui.mjs
function featurecollectionui_typeof(o) { "@babel/helpers - typeof"; return featurecollectionui_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, featurecollectionui_typeof(o); }
function featurecollectionui_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function featurecollectionui_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, featurecollectionui_toPropertyKey(o.key), o); } }
function featurecollectionui_createClass(e, r, t) { return r && featurecollectionui_defineProperties(e.prototype, r), t && featurecollectionui_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function featurecollectionui_toPropertyKey(t) { var i = featurecollectionui_toPrimitive(t, "string"); return "symbol" == featurecollectionui_typeof(i) ? i : i + ""; }
function featurecollectionui_toPrimitive(t, r) { if ("object" != featurecollectionui_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != featurecollectionui_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * A user interface for managing feature collections. The FeatureCollectionUI class provides a user
 *  interface to manage feature collections on a paper.Layer object. It allows users to create, edit,
 *  and organize features within the collection. The class includes various functionalities, such as 
 * adding and removing features, setting opacity and fill opacity for the paper layer, and more.
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var FeatureCollectionUI = /*#__PURE__*/function () {
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
  function FeatureCollectionUI(group, opts) {
    var _this = this;
    featurecollectionui_classCallCheck(this, FeatureCollectionUI);
    // this.toolbar = init.toolbar;
    this.element = makeFeatureCollectionElement();
    opts.iconFactory ? opts.iconFactory.convertFaIcons(this.element) : convertFaIcons(this.element);
    this._editableName = new EditableContent({
      iconFactory: opts.iconFactory
    });
    this.element.querySelector('.annotation-name.name').appendChild(this._editableName.element);
    this._editableName.onChanged = function (text) {
      _this.label = text;
    };
    this._editableName.onEditClicked = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this._featurelist = this.element.querySelector('.features-list');
    this._dragAndDrop = new DragAndDrop({
      parent: this.element,
      selector: '.features-list .feature',
      dropTarget: this._featurelist,
      onDrop: function onDrop() {
        _this.features.forEach(function (f) {
          return _this.group.addChild(f.paperItem);
        });
      }
    });
    this.group = group;
    // add paperjs event handlers
    this.group.on({
      'selection:mouseenter': function selectionMouseenter() {
        _this.element.classList.add('svg-hovered');
        _this.element.dispatchEvent(new Event('mouseover'));
      },
      'selection:mouseleave': function selectionMouseleave() {
        _this.element.classList.remove('svg-hovered');
        _this.element.dispatchEvent(new Event('mouseout'));
      },
      'selected': function selected() {
        _this.element.classList.add('selected');
        _this.element.dispatchEvent(new Event('selected'));
      },
      'deselected': function deselected() {
        _this.element.classList.remove('selected');
        _this.element.dispatchEvent(new Event('deselected'));
      },
      'display-name-changed': function displayNameChanged() {
        _this.updateLabel();
      },
      'removed': function removed() {
        _this.remove();
      },
      'child-added': function childAdded(ev) {
        var featureUI = ev.item.FeatureUI || new FeatureUI(ev.item, opts);
        _this._addFeature(featureUI);
      }
    });

    // expose this object as a property of the paper.js group
    this.group.featureCollectionUI = this;
    this.remove = function () {
      _this.element.remove();
    };
    /**
     * Get the number of features in the feature collection.
     * @member
     * @returns {number} The number of features.
     */
    this.numFeatures = function () {
      return _this.features.length;
    };

    /**
     * Add a feature to the feature collection UI element.
     * @member
     * @param {FeatureUI} f - The feature to add.
     * @returns {jQuery} The jQuery object of the feature element.
     */
    this._addFeature = function (f) {
      f.paperItem.updateFillOpacity();
      _this._featurelist.appendChild(f.element);
      _this._sortableDebounce && window.clearTimeout(_this._sortableDebounce);
      self._sortableDebounce = window.setTimeout(function () {
        return _this._dragAndDrop.refresh();
      }, 15);
      return f.element;
    };
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
    this.createFeature = function () {
      //define a new feature
      var props = this.group.defaultStyle;
      var clonedProperties = {
        fillColor: new _paper.Color(props.fillColor),
        strokeColor: new _paper.Color(props.strokeColor),
        rescale: osd.extend(true, {}, props.rescale),
        fillOpacity: props.fillOpacity,
        strokeOpacity: props.strokeOpacity,
        strokeWidth: props.strokeWidth
      };
      var placeholder = new Placeholder(clonedProperties);
      this.group.addChild(placeholder.paperItem);
      return placeholder.paperItem;
    };
    var setOpacity = function setOpacity(o) {
      _this.group.opacity = o;
    };
    var setFillOpacity = function setFillOpacity(o) {
      _this.group.fillOpacity = o;
    };
    this.ui = {
      setOpacity: setOpacity,
      setFillOpacity: setFillOpacity
    };
    datastore.set(this.element, {
      featureCollection: this
    });
    this.label = this.group.displayName;
    this.element.addEventListener('click', function (ev) {
      ev.stopPropagation();
    });
    this.element.querySelector('.toggle-list').addEventListener('click', function (ev) {
      var numFeatures = _this._featurelist.children.length;
      _this.element.querySelector('.num-annotations').textContent = numFeatures;
      _this.element.querySelector('.features-summary').dataset.numElements = numFeatures;
      _this.element.querySelector('.features').classList.toggle('collapsed');
      ev.stopPropagation();
      ev.preventDefault();
    });
    this.element.addEventListener('click', function (ev) {
      if (ev.target.matches('.annotation-header [data-action]')) {
        //don't bubble up
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        var action = ev.target.dataset.action;
        switch (action) {
          case 'trash':
            _this.removeLayer(true);
            break;
          case 'style':
            _this.openStyleEditor(ev);
            break;
          case 'show':
            _this.toggleVisibility();
            break;
          case 'hide':
            _this.toggleVisibility();
            break;
          default:
            console.log('No function set for action:', action);
        }
      }
    });
    this.element.querySelector('.new-feature').addEventListener('click', function (ev) {
      ev.stopPropagation();
      var item = _this.createFeature();
      item.select();
    });
    return this;
  }

  /**
  * Get the features in the feature collection.
  * @member
  * @returns {FeatureUI[]} The array of features.
  */
  return featurecollectionui_createClass(FeatureCollectionUI, [{
    key: "features",
    get: function get() {
      return Array.from(this._featurelist.querySelectorAll('.feature')).map(function (element) {
        return datastore.get(element, 'feature');
      });
    }
  }, {
    key: "label",
    get: function get() {
      return this.group.displayName;
    },
    set: function set(l) {
      return this.setLabel(l);
    }
    /**
     * Set the label of the feature collection with a source.
     * @param {string} text - The new label of the feature collection.
     * @param {string} source - The source of the label (e.g. 'user-defined' or 'initializing').
     * @returns {string} The new label of the feature collection.
     */
  }, {
    key: "setLabel",
    value: function setLabel(text, source) {
      var l = new String(text);
      l.source = source;
      this.group.displayName = l;
      this.updateLabel();
      return l;
    }
    /**
     * Update the label of the feature collection in the UI element.
     */
  }, {
    key: "updateLabel",
    value: function updateLabel() {
      this._editableName.setText(this.label);
    }
    /**
     * Toggle the visibility of the feature collection UI element and the paper group.
     */
  }, {
    key: "toggleVisibility",
    value: function toggleVisibility() {
      this.element.classList.toggle('annotation-hidden');
      this.group.visible = !this.element.classList.contains('annotation-hidden');
    }
    /**
     * Remove the paper layer associated with the feature collection.
     * @param {boolean} [confirm=true] - Whether to confirm before removing or not.
     */
  }, {
    key: "removeLayer",
    value: function removeLayer() {
      var confirm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (confirm && window.confirm('Remove this layer?') == true) {
        this.group.remove();
      } else {}
    }
    /**
     * Open the style editor for the feature collection.
     * @function 
     * @param {object} ev - The event object.
     */
  }, {
    key: "openStyleEditor",
    value: function openStyleEditor(ev) {
      var heard = this.group.project.emit('edit-style', {
        item: this.group
      });
      if (!heard) {
        console.warn('No event listeners are registered for paperScope.project for event \'edit-style\'');
      }
    }
  }]);
}();


/**
 * Create an HTML element for the feature collection UI.
 * @private
 * @returns {jQuery} The jQuery object of the HTML element.
 */
function makeFeatureCollectionElement() {
  var html = "\n    <div class='feature-collection'>\n        <div class='annotation-header hoverable-actions'>\n            <span class=\"visibility-toggle\"><span class=\"fa fa-eye\" data-action=\"hide\"></span><span class=\"fa fa-eye-slash\" data-action=\"show\"></span></span>\n            <span class='annotation-name name'></span>\n            <span class='onhover fa-solid fa-palette' data-action='style' title='Open style editor'></span>\n            <span class='onhover fa-solid fa-trash-can' data-action='trash' title='Remove feature collection'></span>\n        </div>\n        <div class=\"flex-row features\">\n            <div class=\"toggle-list btn-group btn-group-sm\"><button class=\"btn btn-default\"><span class='fa-solid fa-caret-down' data-action=\"collapse-down\"></span><span class='fa-solid fa-caret-up' data-action=\"collapse-up\"></span></button></div>\n            <div class=\"annotation-details\">\n                <div>\n                    <div class='features-summary feature-item name'><span class='num-annotations'></span> annotation element<span class='pluralize'></span></div>\n                    <div class='features-list'></div>\n                </div>\n                <div class='new-feature feature'><span class='fa fa-plus' data-action=\"add-feature\"></span>Add feature</div>\n            </div>\n        </div>\n    </div>\n    ";
  return domObjectFromHTML(html);
}
;// ./src/js/layerui.mjs
function layerui_typeof(o) { "@babel/helpers - typeof"; return layerui_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, layerui_typeof(o); }
function layerui_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function layerui_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, layerui_toPropertyKey(o.key), o); } }
function layerui_createClass(e, r, t) { return r && layerui_defineProperties(e.prototype, r), t && layerui_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function layerui_toPropertyKey(t) { var i = layerui_toPrimitive(t, "string"); return "symbol" == layerui_typeof(i) ? i : i + ""; }
function layerui_toPrimitive(t, r) { if ("object" != layerui_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != layerui_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function layerui_callSuper(t, o, e) { return o = layerui_getPrototypeOf(o), layerui_possibleConstructorReturn(t, layerui_isNativeReflectConstruct() ? Reflect.construct(o, e || [], layerui_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function layerui_possibleConstructorReturn(t, e) { if (e && ("object" == layerui_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return layerui_assertThisInitialized(t); }
function layerui_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function layerui_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (layerui_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function layerui_getPrototypeOf(t) { return layerui_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, layerui_getPrototypeOf(t); }
function layerui_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && layerui_setPrototypeOf(t, e); }
function layerui_setPrototypeOf(t, e) { return layerui_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, layerui_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * A user interface for managing layers of feature collections.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends OpenSeadragon.EventSource
 */
var LayerUI = /*#__PURE__*/function (_OpenSeadragon$EventS) {
  /**
   * Create a new LayerUI instance.
   * @constructor
   * @property {HTMLElement} element - The HTML element associated with the LayerUI instance. refer to typedef for subproperties
   * @param {AnnotationToolkit} annotationToolkit - The paper scope object.
   */
  function LayerUI(annotationToolkit, addFileButton) {
    var _this2;
    layerui_classCallCheck(this, LayerUI);
    _this2 = layerui_callSuper(this, LayerUI);
    var _this = _this2;
    _this2._tk = annotationToolkit;
    _this2.paperScope = _this2._tk.paperScope;
    _this2.paperScope.project.on('feature-collection-added', function (ev) {
      return _this2._onFeatureCollectionAdded(ev);
    });
    _this2.element = makeHTMLElement();
    _this2.iconFactory = new IconFactory(_this2.element.querySelector('.icon-factory-container'));
    _this2.iconFactory.convertFaIcons(_this2.element);
    _this2.element.querySelector('.new-feature-collection').addEventListener('click', function (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      _this2._tk.addEmptyFeatureCollectionGroup();
    });
    _this2.element.querySelector('.annotation-ui-feature-collections').addEventListener('click', function () {
      if (this.textContent.trim().length === 0) {
        _this._tk.addEmptyFeatureCollectionGroup();
      }
    });
    _this2.element.querySelector('.toggle-annotations').addEventListener('click', function () {
      var hidden = _this2.element.querySelectorAll('.annotation-ui-feature-collections .feature-collection.annotation-hidden');
      if (hidden.length > 0) {
        hidden.forEach(function (e) {
          e.querySelectorAll('[data-action="show"]').forEach(function (a) {
            return a.dispatchEvent(new Event('click', {
              bubbles: true
            }));
          });
        });
      } else {
        var fcs = _this2.element.querySelectorAll('.annotation-ui-feature-collections .feature-collection:not(.hidden) [data-action="hide"]');
        fcs.forEach(function (a) {
          return a.dispatchEvent(new Event('click', {
            bubbles: true
          }));
        });
      }
    });
    _this2._dragAndDrop = new DragAndDrop({
      parent: _this2.element,
      selector: '.feature-collection',
      dropTarget: _this2.element.querySelector('.annotation-ui-feature-collections'),
      onDrop: function onDrop() {
        _this2.element.querySelectorAll('.annotation-ui-feature-collections .feature-collection').forEach(function (g) {
          var fg = datastore.get(g, 'featureCollection');
          fg.group.bringToFront();
        });
      }
    });

    //set up delegated events

    _this2.element.addEventListener('selected', function (ev) {
      if (ev.target.matches('.feature')) {
        ev.stopPropagation();
        this.classList.add('selected');
        this.scrollIntoView({
          block: 'nearest'
        });
      }
    });
    _this2.element.addEventListener('deselected', function (ev) {
      if (ev.target.matches('.feature')) {
        ev.stopPropagation();
        this.classList.remove('selected');
      }
    });
    _this2.element.addEventListener('click', function (ev) {
      if (ev.target.matches('.toggle-list')) {
        this.closest('.features').classList.toggle('collapsed');
        ev.stopPropagation();
      }
    });
    _this2.element.addEventListener('value-changed', function () {
      _this2.element.querySelector('.feature.selected').dispatchEvent(new Event('selected'));
      _this2.element.querySelector('.feature-collection.active').dispatchEvent(new Event('selected'));
    });
    var totalOpacitySlider = _this2.element.querySelector('input.annotation-total-opacity');
    totalOpacitySlider.addEventListener('input', function () {
      setOpacity(this.value);
    });
    totalOpacitySlider.dispatchEvent(new Event('input'));
    var fillOpacitySlider = _this2.element.querySelector('input.annotation-fill-opacity');
    fillOpacitySlider.addEventListener('input', function () {
      _this.paperScope.view.fillOpacity = this.value;
    });
    fillOpacitySlider.dispatchEvent(new Event('input'));

    /**
     * Set the opacity of the feature collections.
     * @private
     * @param {number} o - The opacity value between 0 and 1.
     */
    function setOpacity(o) {
      var status = Array.from(_this.element.querySelectorAll('.feature-collection')).reduce(function (ac, el) {
        if (el.classList.contains('selected')) {
          ac.selected.push(el);
        } else if (el.matches(':hover,.svg-hovered')) {
          ac.hover.push(el);
        } else {
          ac.other.push(el);
        }
        return ac;
      }, {
        selected: [],
        hover: [],
        other: []
      });
      if (status.selected.length > 0) {
        status.selected.forEach(function (el) {
          var opacity = 1 * o;
          var fc = datastore.get(el, 'featureCollection');
          fc && fc.ui.setOpacity(opacity);
        });
        status.hover.concat(status.other).forEach(function (el) {
          var opacity = 0.25 * o;
          var fc = datastore.get(el, 'featureCollection');
          fc && fc.ui.setOpacity(opacity);
        });
      } else if (status.hover.length > 0) {
        status.hover.forEach(function (el) {
          var opacity = 1 * o;
          var fc = datastore.get(el, 'featureCollection');
          fc && fc.ui.setOpacity(opacity);
        });
        status.other.forEach(function (el) {
          var opacity = 0.25 * o;
          var fc = datastore.get(el, 'featureCollection');
          fc && fc.ui.setOpacity(opacity);
        });
      } else {
        status.other.forEach(function (el) {
          var opacity = 1 * o;
          var fc = datastore.get(el, 'featureCollection');
          fc && fc.ui.setOpacity(opacity);
        });
      }
    }
    return _this2;
  }
  /**
   * Hide the layer UI element.
   * 
   */
  layerui_inherits(LayerUI, _OpenSeadragon$EventS);
  return layerui_createClass(LayerUI, [{
    key: "hide",
    value: function hide() {
      this.element.classList.add('hidden');
      this.raiseEvent('hide');
    }
    /**
     * Show the layer UI element.
     * 
     */
  }, {
    key: "show",
    value: function show() {
      this.element.classList.remove('hidden');
      this.raiseEvent('show');
    }
    /**
     * Toggle the visibility of the layer UI element.
     */
  }, {
    key: "toggle",
    value: function toggle() {
      this.element.matches(':visible') ? this.hide() : this.show();
    }
    /**
     * Deactivate the layer UI element.
     */
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.element.classList.add('deactivated');
    }
    /**
     * Activate the layer UI element.
     */
  }, {
    key: "activate",
    value: function activate() {
      this.element.classList.remove('deactivated');
    }
    /**
     * Destroy the layer UI element.
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.raiseEvent('destroy');
      this.element.remove();
    }

    /**
     * Handle the feature collection added event.
     * @param {object} ev - The event object.
     * @private
     * 
     */
  }, {
    key: "_onFeatureCollectionAdded",
    value: function _onFeatureCollectionAdded(ev) {
      var grp = ev.group;
      var fc = new FeatureCollectionUI(grp, {
        iconFactory: this.iconFactory
      });
      this.element.querySelector('.annotation-ui-feature-collections').appendChild(fc.element);
      this._dragAndDrop.refresh();
      fc.element.dispatchEvent(new Event('element-added'));
      setTimeout(function () {
        fc.element.classList.add('inserted');
      }, 30); //this allows opacity fade-in to be triggered
    }
  }]);
}(osd.EventSource);

/**
 *  Create an HTML element for the layer UI.
 * @private
 * @returns {jQuery} The jQuery object of the HTML element.
 */
function makeHTMLElement() {
  var html = "\n        <div class=\"annotation-ui-mainwindow\" title=\"Annotations\">\n            <div><span class='fa-save'></span> <span class=\"annotation-ui-title\">Annotation Interface</span></div>\n            <div class='annotation-ui-toolbar annotation-visibility-controls'>                \n                <div class=\"visibility-buttons btn-group btn-group-sm disable-when-deactivated\" role=\"group\">\n                    <button class=\"btn btn-default toggle-annotations\" type=\"button\" title=\"Toggle annotations\">\n                        <span class=\"glyphicon glyphicon-eye-open fa fa-eye\"></span><span class=\"glyphicon glyphicon-eye-close fa fa-eye-slash\"></span>\n                    </button>\n                </div>\n                <span class=\"annotation-opacity-container disable-when-annotations-hidden\" title=\"Change total opacity\">\n                    <input class=\"annotation-total-opacity\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"1\">\n                </span>\n                <span class=\"annotation-opacity-container disable-when-annotations-hidden\" title=\"Change fill opacity\">\n                    <input class=\"annotation-fill-opacity\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"0.25\">\n                </span>\n            </div>\n            <div class='annotation-ui-feature-collections disable-when-annotations-hidden disable-when-deactivated'></div>\n            <div class='new-feature-collection disable-when-deactivated'><span class='glyphicon glyphicon-plus fa fa-plus'></span>Add Feature Collection</div>\n            <div class='icon-factory-container'></div>\n        </div>";
  var element = domObjectFromHTML(html);
  var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
  // element.attr('data-ui-id',guid);
  element.dataset.uiId = guid;
  return element;
}
;// ./src/js/utils/dialog.mjs
function dialog_typeof(o) { "@babel/helpers - typeof"; return dialog_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, dialog_typeof(o); }
function dialog_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function dialog_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, dialog_toPropertyKey(o.key), o); } }
function dialog_createClass(e, r, t) { return r && dialog_defineProperties(e.prototype, r), t && dialog_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function dialog_toPropertyKey(t) { var i = dialog_toPrimitive(t, "string"); return "symbol" == dialog_typeof(i) ? i : i + ""; }
function dialog_toPrimitive(t, r) { if ("object" != dialog_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != dialog_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Bare-bones dialog implementation of a dialog
 * @param {String} innerHTML 
 */
var Dialog = /*#__PURE__*/function () {
  function Dialog(_ref) {
    var _this = this;
    var innerHTML = _ref.innerHTML,
      title = _ref.title;
    dialog_classCallCheck(this, Dialog);
    var div = document.createElement('div');
    document.querySelector('body').appendChild(div);
    div.style.position = 'fixed';
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.left = 0;
    div.style.top = 0;
    var bg = document.createElement('div');
    div.appendChild(bg);
    bg.style.backgroundColor = 'gray';
    bg.style.opacity = 0.9;
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.position = 'absolute';
    var fg = document.createElement('div');
    fg.classList.add('ui-dialog');
    div.appendChild(fg);
    fg.style.setProperty('max-height', '80%');
    fg.style.setProperty('max-width', '80%');
    fg.style.left = '50%';
    fg.style.top = '50%';
    fg.style.transform = 'translate(-50%, -50%)';
    fg.style.overflow = 'auto';
    fg.style.position = 'relative';
    fg.style.backgroundColor = 'white';
    fg.style.display = 'inline-block';
    fg.style.padding = '2px';
    fg.style.borderRadius = '2px';
    var topbar = document.createElement('div');
    fg.appendChild(topbar);
    topbar.style.padding = '0.3em 0.6em';
    topbar.style.backgroundColor = 'rgb(233, 233, 233)';
    topbar.style.borderColor = 'rgb(220, 220, 220)';
    topbar.style.borderRadius = '2px';
    topbar.style.display = 'flex';
    var header = document.createElement('label');
    topbar.appendChild(header);
    header.innerText = title;
    header.style.fontWeight = 'bold';
    header.style.flexGrow = 1;
    var close = document.createElement('button');
    close.innerText = 'x';
    close.style.marginLeft = '1em';
    topbar.appendChild(close);
    close.addEventListener('click', function () {
      return _this.hide();
    });
    var contents = document.createElement('div');
    fg.appendChild(contents);
    contents.innerHTML = innerHTML;
    bg.addEventListener('click', function () {
      return _this.hide();
    });
    this.element = div;
    this.container = contents;
    this.background = bg;
    this.foreground = fg;
    this.topbar = topbar;
    this.hide();
  }
  return dialog_createClass(Dialog, [{
    key: "show",
    value: function show() {
      this.element.style.display = 'block';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.element.style.display = 'none';
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.element.style.display === 'none' ? this.show() : this.hide();
    }
  }]);
}();
function dialog(innerHTML) {
  return new Dialog(innerHTML);
}
;// ./src/js/filedialog.mjs
function filedialog_typeof(o) { "@babel/helpers - typeof"; return filedialog_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, filedialog_typeof(o); }
function filedialog_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function filedialog_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, filedialog_toPropertyKey(o.key), o); } }
function filedialog_createClass(e, r, t) { return r && filedialog_defineProperties(e.prototype, r), t && filedialog_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function filedialog_toPropertyKey(t) { var i = filedialog_toPrimitive(t, "string"); return "symbol" == filedialog_typeof(i) ? i : i + ""; }
function filedialog_toPrimitive(t, r) { if ("object" != filedialog_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != filedialog_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * The FileDialog class provides options for saving and loading feature collections as GeoJSON, exporting them as SVG or PNG files,
 * and storing them in local storage. It is designed to work with the AnnotationToolKit (atk) object to manage annotations.
 *
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var FileDialog = /*#__PURE__*/function () {
  /**
   * Creates an instance of the FileDialog class, which allows users to save and load feature collections in various formats.
   *
   * @constructor
   * @memberof OSDPaperjsAnnotation.FileDialog
   * @param {any} atk - The AnnotationToolKit object.
   * @param {object} opts - Additional options for the file dialog.
   */
  function FileDialog(atk, opts) {
    filedialog_classCallCheck(this, FileDialog);
    var _this = this;
    this.dialog = dialog({
      innerHTML: fileDialogHtml(),
      title: ''
    });
    this.element = this.dialog.container;
    this.element.querySelector('button[data-action="geojson-load"]').addEventListener('click', loadGeoJSON);
    this.element.querySelector('button[data-action="geojson-save"]').addEventListener('click', saveGeoJSON);
    this.element.querySelector('button[data-action="svg-export"]').addEventListener('click', exportSVG);
    this.element.querySelector('button[data-action="png-export"]').addEventListener('click', exportPNG);
    this.element.querySelector('button[data-action="ls-store"]').addEventListener('click', localstorageStore);
    this.element.querySelector('button[data-action="ls-load"]').addEventListener('click', localstorageLoad);
    function getFileName(appendIfNotBlank) {
      var _atk$viewer$world$get;
      // TODO: handle case of multiple images
      var output = ((_atk$viewer$world$get = atk.viewer.world.getItemAt(0)) === null || _atk$viewer$world$get === void 0 ? void 0 : _atk$viewer$world$get.source.name) || '';
      if (output.length > 0) {
        output += appendIfNotBlank;
      }
      return output;
    }
    function initDlg() {
      var _this$element$querySe, _this$element$querySe2;
      (_this$element$querySe = _this.element.querySelector('.featurecollection-list')) === null || _this$element$querySe === void 0 || _this$element$querySe.replaceChildren();
      (_this$element$querySe2 = _this.element.querySelector('.finalize')) === null || _this$element$querySe2 === void 0 || _this$element$querySe2.replaceChildren();
    }
    /**
     * Sets up the feature collection list in the dialog. This function populates the file dialog with a list of available feature collections.
     *
     * @private
     * @param {Array} fcarray - An array of feature collections.
     * @returns {jQuery} The feature collection list element.
     */
    function setupFeatureCollectionList(fcarray) {
      var list = _this.element.querySelector('.featurecollection-list');
      list.replaceChildren();
      fcarray.forEach(function (fc) {
        var label = fc.label || fc.displayName; //handle geoJSON objects or paper.Layers

        var d = document.createElement('div');
        list.appendChild(d);
        var input = document.createElement('input');
        d.appendChild(input);
        input.setAttribute('type', 'checkbox');
        input.setAttribute('checked', 'true');
        datastore.set(input, 'fc', fc);
        var l = document.createElement('label');
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
    function loadGeoJSON() {
      initDlg();
      var finput = document.createElement('input');
      finput.type = 'file';
      finput.accept = 'text/geojson,.geojson,text/json,.json';
      finput.addEventListener('change', function () {
        var file = this.files[0];
        var fr = new FileReader();
        var geoJSON = [];
        fr.onload = function () {
          try {
            geoJSON = JSON.parse(this.result);
          } catch (e) {
            alert('Bad file - JSON could not be parsed');
            return;
          }
          if (!Array.isArray(geoJSON)) geoJSON = [geoJSON];
          var type = Array.from(new Set(geoJSON.map(function (e) {
            return e.type;
          })));
          if (type.length == 0) {
            _this.element.find('.featurecollection-list').text('Bad file - no Features or FeatureCollections were found');
          }
          if (type.length > 1) {
            alert('Bad file - valid geoJSON consists of an array of objects with single type (FeatureCollection or Feature)');
            return;
          }

          //convert list of features into a featurecolletion
          if (type[0] == 'Feature') {
            var fc = [{
              type: 'FeatureCollection',
              features: geoJSON,
              properties: {
                label: file.name
              }
            }];
            geoJSON = fc;
          }
          setupFeatureCollectionList(geoJSON);
          var replaceButton = document.createElement('button');
          _this.element.querySelector('.finalize').appendChild(replaceButton);
          replaceButton.innerText = 'Replace existing layers';
          replaceButton.addEventListener('click', function () {
            return atk.addFeatureCollections(geoJSON, true);
          });
          var addButton = document.createElement('button');
          _this.element.querySelector('.finalize').appendChild(addButton);
          addButton.innerText = 'Add new layers';
          addButton.addEventListener('click', function () {
            return atk.addFeatureCollections(geoJSON, false);
          });
        };
        fr.readAsText(file);
      });

      // Normal dispatchEvent doesn't work; use the alternative below to open the file dialog
      finput['click']();
    }
    /**
     * Loads the feature collections from local storage and displays them in the file dialog. This function retrieves the feature collections stored in local storage
     * and sets up the feature collection list in the file dialog, providing options to add or replace existing layers.
     *
     * @private
     */
    function localstorageLoad() {
      initDlg();
      var geoJSON = [];
      var filename = getFileName();
      var lskeys = Object.keys(window.localStorage);
      var listContainer = _this.element.querySelector('.featurecollection-list');
      listContainer.innerText = '';
      var list = document.createElement('div');
      list.classList.add('localstorage-key-list');
      listContainer.appendChild(list);
      lskeys.sort(function (a, b) {
        return a.localeCompare(b);
      }).forEach(function (key) {
        var div = document.createElement('div');
        div.classList.add('localstorage-key');
        div.style.order = key == filename ? 0 : 1;
        div.innerText = key;
        list.appendChild(div);
      });
      list.querySelectorAll('.localstorage-key').forEach(function (e) {
        return e.addEventListener('click', function () {
          var lsdata = window.localStorage.getItem(this.textContent);
          if (!lsdata) {
            alert("No data found in local storage for key=".concat(this.textContent));
            return;
          }
          try {
            geoJSON = JSON.parse(lsdata);
          } catch (e) {
            alert('Bad data - JSON could not be parsed');
            return;
          }
          setupFeatureCollectionList(geoJSON);
          var replace = document.createElement('button');
          replace.innerText = 'Replace existing layers';
          replace.addEventListener('click', function () {
            return atk.addFeatureCollections(geoJSON, true);
          });
          _this.element.querySelector('.finalize').appendChild(replace);
          var add = document.createElement('button');
          add.innerText = 'Add new layers';
          add.addEventListener('click', function () {
            return atk.addFeatureCollections(geoJSON, false);
          });
          _this.element.querySelector('.finalize').appendChild(add);
        });
      });
    }
    /**
     * Saves the feature collections as a GeoJSON file and provides a download link. This function prepares the selected feature collections in GeoJSON format,
     * creates a Blob, and generates a download link for the user to save the file.
     *
     * @private
     */
    function saveGeoJSON() {
      initDlg();
      var fcs = atk.toGeoJSON();
      var list = setupFeatureCollectionList(fcs);
      var finishbutton = setupFinalize('Create file', 'Choose file name:', getFileName('-') + 'FeatureCollections.json');
      finishbutton.addEventListener('click', function () {
        var _this$parentElement$q;
        (_this$parentElement$q = this.parentElement.querySelector('.download-link')) === null || _this$parentElement$q === void 0 || _this$parentElement$q.remove();
        var toSave = Array.from(list.querySelectorAll('input:checked')).map(function (cb) {
          return datastore.get(cb, 'fc');
        });
        var txt = JSON.stringify(toSave);
        var blob = new Blob([txt], {
          type: 'text/json'
        });
        var filename = this.getAttribute('data-label');
        var dl = document.createElement('div');
        dl.classList.add('download-link');
        this.parentElement.insertBefore(dl, this.nextSibling);
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.target = '_blank';
        a.innerText = 'Download file';
        dl.appendChild(a);
      });
    }
    /**
     * Exports the feature collections as an SVG file and provides a download link. This function prepares the selected feature collections and exports them as an SVG file.
     * It generates a download link for the user to save the file in SVG format.
     *
     * @private
     */
    function exportSVG() {
      initDlg();
      // let fcs = atk.toGeoJSON();
      var fcs = atk.getFeatureCollectionGroups();
      var list = setupFeatureCollectionList(fcs);
      var finishbutton = setupFinalize('Create file', 'Choose file name:', getFileName('-') + 'FeatureCollections.svg');
      finishbutton.addEventListener('click', function () {
        var _this$parentElement$q2;
        (_this$parentElement$q2 = this.parentElement.querySelector('.download-link')) === null || _this$parentElement$q2 === void 0 || _this$parentElement$q2.remove();
        var toSave = Array.from(list.querySelectorAll('input:checked')).map(function (cb) {
          return datastore.get(cb, 'fc');
        });
        if (toSave.length > 0) {
          var p = new _paper.PaperScope();
          p.setup();
          toSave.forEach(function (s) {
            p.project.activeLayer.addChildren(s.layer.clone({
              insert: false,
              deep: true
            }).children);
          });
          var blob = new Blob([p.project.exportSVG({
            asString: true,
            bounds: 'content'
          })], {
            type: 'text/svg'
          });
          var filename = this.getAttribute('data-label');
          var dl = document.createElement('div');
          dl.classList.add('download-link');
          this.parentElement.insertBefore(dl, this.nextSibling);
          var a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = filename;
          a.target = '_blank';
          a.innerText = 'Download file';
          dl.appendChild(a);
        }
      });
    }
    /**
     * Exports the feature collections as a PNG file and provides a download link. This function prepares the selected feature collections and exports them as a rasterized PNG file.
     * It generates a download link for the user to save the file in PNG format.
     *
     * @private
     */
    function exportPNG() {
      initDlg();
      var fcs = atk.getFeatureCollectionGroups();
      var list = setupFeatureCollectionList(fcs);
      var finishbutton = setupFinalize('Create file', 'Choose file name:', getFileName('-') + 'raster.png');
      finishbutton.addEventListener('click', function () {
        var _this$parentElement$q3;
        (_this$parentElement$q3 = this.parentElement.querySelector('.download-link')) === null || _this$parentElement$q3 === void 0 || _this$parentElement$q3.remove();
        var toSave = Array.from(list.querySelectorAll('input:checked')).map(function (cb) {
          return datastore.get(cb, 'fc');
        });
        if (toSave.length > 0) {
          var p = new _paper.PaperScope();
          p.setup();
          toSave.forEach(function (s) {
            p.project.activeLayer.addChildren(s.layer.clone({
              insert: false,
              deep: true
            }).children);
          });
          // let blob = new Blob([p.project.activeLayer.rasterize({insert:false}).toDataURL()],{type:'image/png'});
          var filename = this.getAttribute('data-label');
          var dl = document.createElement('div');
          dl.classList.add('download-link');
          this.parentElement.insertBefore(dl, this.nextSibling);
          var a = document.createElement('a');
          a.href = p.project.activeLayer.rasterize({
            insert: false
          }).toDataURL();
          a.download = filename;
          a.target = '_blank';
          a.innerText = 'Download file';
          dl.appendChild(a);
        }
      });
    }
    /**
     * Stores the feature collections in the local storage.
     * @private 
     */
    function localstorageStore() {
      initDlg();
      var fcs = atk.toGeoJSON();
      var list = setupFeatureCollectionList(fcs);
      var finishbutton = setupFinalize('Save data', 'Local storage key:', getFileName(), true);
      finishbutton.addEventListener('click', function () {
        var toSave = Array.from(list.querySelectorAll('input:checked')).map(function (cb) {
          return datastore.get(cb, 'fc');
        });
        var txt = JSON.stringify(toSave);
        var filename = this.getAttribute('data-label');
        window.localStorage.setItem(filename, txt);
      });
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
    function setupFinalize(buttonText, editableLabel, editableContent, localstorage) {
      function testLocalstorage(localstorage, text, div) {
        if (localstorage) Object.keys(localStorage).includes(text) ? div.classList.add('key-exists') : div.classList.remove('key-exists');
      }
      var finalize = _this.element.querySelector('.finalize');
      var finishButton = document.createElement('button');
      finishButton.innerText = buttonText;
      finalize.appendChild(finishButton);
      var ec;
      if (editableLabel) {
        var div = document.createElement('div');
        var div2 = document.createElement('div');
        div.appendChild(div2);
        finalize.appendChild(div);
        div2.innerText = editableLabel;
        ec = new EditableContent();
        ec.setText(editableContent);
        div.appendChild(ec.element);
        if (localstorage) div.classList.add('localstorage-key-test');
        ec.onChanged = function (text) {
          finishButton.setAttribute('data-label', text);
          testLocalstorage(localstorage, text, div);
        };
        testLocalstorage(localstorage, editableContent, div);
      }
      finalize.appendChild(finishButton);
      finishButton.setAttribute('data-label', editableContent);
      return finishButton;
    }
    /**
     * Returns the HTML for the file dialog. This function generates the HTML markup for the file dialog, including the buttons and feature collection list.
     * @private
     * @returns {string} The HTML for the file dialog.
     */
    function fileDialogHtml() {
      return "\n                <div class=\"annotation-ui-filedialog\" title=\"Save and Load Feature Collections\">\n                    <div class=\"file-actions\">\n                        <div class='header'>1. Available actions</div>\n                        <button class='btn' data-action='geojson-load'>Load GeoJSON</button>\n                        <button class='btn' data-action='ls-load'>Load from browser</button>\n                        <hr>\n                        <button class='btn' data-action='geojson-save'>Save GeoJSON</button>\n                        <button class='btn' data-action='svg-export'>Export as SVG</button>\n                        <button class='btn' data-action='png-export'>Rasterize to PNG</button>\n                        <button class='btn' data-action='ls-store'>Store in browser</button>\n                    </div>\n                    <div class='featurecollection-selection'>\n                        <div class='header'>2. Select Feature Collections</div>\n                        <div class='featurecollection-list'></div>\n                    </div>\n                    <div class=\"finalize-panel\">\n                        <div class='header'>3. Finalize</div>\n                        <div class='finalize'>\n                        \n                        </div>\n                    </div>\n                </div>";
    }
  }
  /**
   * Shows the file dialog.
   */
  return filedialog_createClass(FileDialog, [{
    key: "show",
    value: function show() {
      // this.element.dialog('open');
      this.dialog.show();
    }
    /**
     * Hides the file dialog.
     */
  }, {
    key: "hide",
    value: function hide() {
      // this.element.dialog('close');
      this.dialog.hide();
    }
    /**
     * Toggles the visibility of the file dialog.
     */
  }, {
    key: "toggle",
    value: function toggle() {
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
  }]);
}();

;// ./src/js/annotationui.mjs
function annotationui_typeof(o) { "@babel/helpers - typeof"; return annotationui_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, annotationui_typeof(o); }
function annotationui_slicedToArray(r, e) { return annotationui_arrayWithHoles(r) || annotationui_iterableToArrayLimit(r, e) || annotationui_unsupportedIterableToArray(r, e) || annotationui_nonIterableRest(); }
function annotationui_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function annotationui_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return annotationui_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? annotationui_arrayLikeToArray(r, a) : void 0; } }
function annotationui_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function annotationui_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function annotationui_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function annotationui_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function annotationui_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, annotationui_toPropertyKey(o.key), o); } }
function annotationui_createClass(e, r, t) { return r && annotationui_defineProperties(e.prototype, r), t && annotationui_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function annotationui_toPropertyKey(t) { var i = annotationui_toPrimitive(t, "string"); return "symbol" == annotationui_typeof(i) ? i : i + ""; }
function annotationui_toPrimitive(t, r) { if ("object" != annotationui_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != annotationui_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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





addCSS('annotationui.css', 'annotationui');
addCSS('editablecontent.css', 'editablecontent');

/**
 * @memberof OSDPaperjsAnnotation
 * @class
 * A class for creating and managing the annotation UI
 */
var AnnotationUI = /*#__PURE__*/function () {
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
  function AnnotationUI(annotationToolkit, opts) {
    var _this = this;
    annotationui_classCallCheck(this, AnnotationUI);
    var defaultOpts = {
      autoOpen: true,
      featureCollections: [],
      addButton: true,
      addToolbar: true,
      tools: null,
      addLayerUI: true,
      addFileButton: true,
      buttonTogglesToolbar: true,
      buttonTogglesLayerUI: true
    };
    opts = this.options = Object.assign(defaultOpts, opts);
    var _viewer = this._viewer = annotationToolkit.viewer; // shorter alias
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
    this._fileDialog = new FileDialog(annotationToolkit, {
      appendTo: _viewer.element
    });
    this._filebutton = null;
    if (opts.addFileButton) {
      //Handles the click event of the file button.
      this._filebutton = annotationToolkit.overlay.addViewerButton({
        onClick: function onClick() {
          _this._fileDialog.toggle();
        },
        faIconClass: 'fa-save',
        tooltip: 'Save/Load Annotations'
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
    if (opts.autoOpen) {
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
        onClick: function onClick() {
          _this._isOpen = !_this._isOpen;
          if (_this._isOpen) {
            _this.options.buttonTogglesToolbar && _this._toolbar.show();
            _this.options.buttonTogglesLayerUI && _this._layerUI.show();
          } else {
            _this.options.buttonTogglesToolbar && _this._toolbar.hide();
            _this.options.buttonTogglesLayerUI && _this._layerUI.hide();
          }
        },
        faIconClass: 'fa-pencil',
        tooltip: 'Annotation Interface'
      });
    }
    if (opts.featureCollections) {
      annotationToolkit.loadGeoJSON(opts.featureCollections);
    }
  }

  /**
   * Destroys the AnnotationUI and cleans up its resources.
   */
  return annotationui_createClass(AnnotationUI, [{
    key: "destroy",
    value: function destroy() {
      this._layerUI.destroy();
      this._toolbar.destroy();
      if (this._button) {
        var idx = this._viewer.buttonGroup.buttons.indexOf(this._button);
        if (idx > -1) {
          this._viewer.buttonGroup.buttons.splice(idx, 1);
        }
        this._button.element.remove();
      }
      if (this._filebutton) {
        var _idx = this._viewer.buttonGroup.buttons.indexOf(this._filebutton);
        if (_idx > -1) {
          this._viewer.buttonGroup.buttons.splice(_idx, 1);
        }
        this._filebutton.element.remove();
      }
    }

    /**
     * Show the LayerUI interface
     */
  }, {
    key: "showUI",
    value: function showUI() {
      this.ui.show();
    }

    /**
     * Hide the LayerUI interface
     */
  }, {
    key: "hideUI",
    value: function hideUI() {
      this.ui.hide();
    }

    /**
     * Show the toolbar
     */
  }, {
    key: "showToolbar",
    value: function showToolbar() {
      this.toolbar.show();
    }

    /**
     * Hide the toolbar
     */
  }, {
    key: "hideToolbar",
    value: function hideToolbar() {
      this.toolbar.hide();
    }
  }, {
    key: "ui",
    get: function get() {
      return this._layerUI;
    }
  }, {
    key: "toolbar",
    get: function get() {
      return this._toolbar;
    }
  }, {
    key: "element",
    get: function get() {
      return this._layerUI.element;
    }

    /**
     * Set up the grid that adds the UI to the viewer
     */
  }, {
    key: "_addToViewer",
    value: function _addToViewer() {
      var container = document.createElement('div');
      this._viewer.element.appendChild(container);
      var top = document.createElement('div');
      var bottom = document.createElement('div');
      var center = document.createElement('div');
      var left = document.createElement('div');
      var right = document.createElement('div');
      var resizeRight = document.createElement('div');
      var classes = {
        'annotation-ui-grid': container,
        'top': top,
        'bottom': bottom,
        'center': center,
        'left': left,
        'right': right,
        'resize-right': resizeRight
      };
      Object.entries(classes).forEach(function (_ref) {
        var _ref2 = annotationui_slicedToArray(_ref, 2),
          name = _ref2[0],
          node = _ref2[1];
        return node.classList.add(name);
      });
      [center, right, left, top, bottom].forEach(function (div) {
        return container.appendChild(div);
      });
      center.appendChild(this._viewer.container);
      right.appendChild(resizeRight);
      right.appendChild(this.element);
      top.appendChild(this._toolbar.element);

      // keep a reference to the UI element
      var element = this.element;

      // add event handlers to do the resizing.
      var body = document.querySelector('body');
      var offset;
      resizeRight.addEventListener('mousedown', function (ev) {
        this.classList.add('resizing');
        body.classList.add('.annotation-ui-noselect');
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseleave', finishResize);
        document.addEventListener('mouseup', finishResize);
        offset = element.getBoundingClientRect().left - ev.x;
      });
      function moveHandler(ev) {
        if (resizeRight.classList.contains('resizing')) {
          if (ev.movementX) {
            var bounds = element.getBoundingClientRect();
            element.style.width = bounds.right - ev.x - offset + 'px';
          }
          ev.preventDefault();
        }
      }
      function finishResize(ev) {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseleave', finishResize);
        document.removeEventListener('mouseup', finishResize);
        body.classList.remove('.annotation-ui-noselect');
        resizeRight.classList.remove('resizing');
      }
    }
  }]);
}();

;// ./src/js/paper-extensions.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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




// monkey patch to fix view.zoom when negative scaling is applied
_paper.View.prototype.getZoom = function () {
  var scaling = this._decompose().scaling;
  // Use average since it can be non-uniform.
  return (Math.abs(scaling.x) + Math.abs(scaling.y)) / 2;
};

// monkey patch to fix non-rounded canvas sizes
_paper.CanvasView.prototype._setElementSize.base = function (width, height) {
  var element = this._element;
  width = Math.round(width);
  height = Math.round(height);
  if (element) {
    if (element.width !== width) element.width = width;
    if (element.height !== height) element.height = height;
  }
},
/**
 * Sets the rotation of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {number} degrees - The number of degrees to rotate.
 * @param {any} center - The center point of the rotation.
 */
_paper.View.prototype.setRotation = function (degrees, center) {
  var degreesToRotate = degrees - (this._rotation || 0);
  this.rotate(degreesToRotate, center);
  this._rotation = osd.positiveModulo(degrees, 360);
  this.emit('rotate', {
    rotatedBy: degreesToRotate,
    currentRotation: this._rotation,
    center: center
  });
};

/**
 * Sets the flip of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {Boolean} flipped - Whether the view is flipped or not.
 * @param { number } currentRotation - the current rotation of the viewer in degrees
 */
_paper.View.prototype.setFlipped = function (flipped, currentRotation) {
  var isFlipped = this.getFlipped();
  if (flipped !== isFlipped) {
    this.rotate(-currentRotation);
    this.scale(-1, 1);
    this.rotate(currentRotation);
    this.emit('flip', {
      flipped: flipped
    });
  }
};

/**
 * Gets the current flipped status of the of the view.
 * @function setRotation
 * @memberof OSDPaperjsAnnotation.paperjsOverlay#
 * @param {Boolean} flipped - Whether the view is flipped or not.
 */
_paper.View.prototype.getFlipped = function (flipped) {
  return this.scaling.x * this.scaling.y < 0;
};
Object.defineProperty(_paper.Item.prototype, 'hierarchy', hierarchyDef());
Object.defineProperty(_paper.Item.prototype, 'descendants', descendantsDef());
Object.defineProperty(_paper.Item.prototype, 'fillOpacity', itemFillOpacityPropertyDef());
Object.defineProperty(_paper.Item.prototype, 'strokeOpacity', itemStrokeOpacityPropertyDef());
Object.defineProperty(_paper.Item.prototype, 'rescale', itemRescalePropertyDef());
Object.defineProperty(_paper.Item.prototype, 'stroke', strokePropertyDefItem());
Object.defineProperty(_paper.Style.prototype, 'fillOpacity', fillOpacityPropertyDef());
Object.defineProperty(_paper.Style.prototype, 'strokeOpacity', strokeOpacityPropertyDef());
Object.defineProperty(_paper.Style.prototype, 'rescale', rescalePropertyDef());
Object.defineProperty(_paper.CompoundPath.prototype, 'descendants', descendantsDefCompoundPath()); //this must come after the Item prototype def to override it
Object.defineProperty(_paper.Project.prototype, 'hierarchy', hierarchyDef());
Object.defineProperty(_paper.Project.prototype, 'fillOpacity', itemFillOpacityPropertyDef());
Object.defineProperty(_paper.View.prototype, 'fillOpacity', viewFillOpacityPropertyDef());
Object.defineProperty(_paper.View.prototype, '_fillOpacity', {
  value: 1,
  writable: true
}); //initialize to opaque
Object.defineProperty(_paper.Project.prototype, 'strokeOpacity', itemStrokeOpacityPropertyDef());
_paper.Item.prototype.updateFillOpacity = updateFillOpacity;
_paper.Item.prototype.updateStrokeOpacity = updateStrokeOpacity;
_paper.Project.prototype.updateFillOpacity = updateFillOpacity;
_paper.View.prototype._multiplyOpacity = true;
_paper.Style.prototype.set = styleSet;
_paper.Item.prototype.applyRescale = applyRescale;

/**
 * Define the set method for a paper style object.
 * @private
 * @param {object|paper.Style} style - The style object to set.
 */
function styleSet(style) {
  var isStyle = style instanceof _paper.Style,
    values = isStyle ? style._values : style;
  if (values) {
    for (var key in values) {
      // console.log('setting',key)
      if (key in this._defaults || _paper.Style.prototype.hasOwnProperty(key)) {
        var value = values[key];
        this[key] = value && isStyle && value.clone ? value.clone() : value;
      }
    }
  }
}
/**
 * Item.updateFillOpacity (paper extension)
 * Update the fill opacity of a paper item and its descendants.
 */

function updateFillOpacity() {
  var _this = this;
  this._computedFillOpacity = this.hierarchy.filter(function (item) {
    return 'fillOpacity' in item && (item._multiplyOpacity || item == _this);
  }).reduce(function (prod, item) {
    return prod * item.fillOpacity;
  }, 1);
  if (this.fillColor) {
    this.fillColor.alpha = this._computedFillOpacity;
  }
}
/**
 * Item.updateStrokeOpacity (paper extension)
 * Update the stroke opacity of a paper item and its descendants.
 */
function updateStrokeOpacity() {
  var _this2 = this;
  if (this.strokeColor) {
    this.strokeColor.alpha = this.hierarchy.filter(function (item) {
      return 'strokeOpacity' in item && (item._multiplyOpacity || item == _this2);
    }).reduce(function (prod, item) {
      return prod * item.strokeOpacity;
    }, 1);
  }
}
/**
 * Define the fill opacity property for a paper style object.
 * The fill opacity property controls the opacity of the fill color in a style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} o - The fill opacity value. Should be a number between 0 and 1.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The fill opacity value. If not set, returns 1 (fully opaque).
 */
function fillOpacityPropertyDef() {
  return {
    set: function opacity(o) {
      this._fillOpacity = this._values.fillOpacity = o;
    },
    get: function opacity() {
      return typeof this._fillOpacity === 'undefined' ? 1 : this._fillOpacity;
    }
  };
}
/**
 * Define the stroke opacity property for a paper style object.
 * The stroke opacity property controls the opacity of the stroke color in a style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the stroke opacity property.
 *   @param {number} o - The stroke opacity value. Should be a number between 0 and 1.
 * @property {function} get - The getter function for the stroke opacity property.
 *   @returns {number} The stroke opacity value. If not set, returns 1 (fully opaque).
 */
function strokeOpacityPropertyDef() {
  return {
    set: function opacity(o) {
      this._strokeOpacity = this._values.strokeOpacity = o;
    },
    get: function opacity() {
      return typeof this._strokeOpacity === 'undefined' ? 1 : this._strokeOpacity;
    }
  };
}
/**
 * Define the fill opacity property for a paper item object.
 * The fill opacity property defines the opacity of the fill color used in a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} opacity - The opacity value for the fill color.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The opacity value of the fill color.
 */
function itemFillOpacityPropertyDef() {
  return {
    set: function opacity(o) {
      (this.style || this.defaultStyle).fillOpacity = o;
      this.descendants.forEach(function (item) {
        return item.updateFillOpacity();
      });
    },
    get: function opacity() {
      return (this.style || this.defaultStyle).fillOpacity;
    }
  };
}

/**
 * Define the stroke opacity property for a paper item object.
 * The stroke opacity property defines the opacity of the stroke color used in a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the stroke opacity property.
 *   @param {number} opacity - The opacity value for the stroke color.
 * @property {function} get - The getter function for the stroke opacity property.
 *   @returns {number} The opacity value of the stroke color.
 */
function itemStrokeOpacityPropertyDef() {
  return {
    set: function opacity(o) {
      (this.style || this.defaultStyle).strokeOpacity = o;
      this.descendants.forEach(function (item) {
        return item.updateStrokeOpacity();
      });
    },
    get: function opacity() {
      return (this.style || this.defaultStyle).strokeOpacity;
    }
  };
}

/**
 * Define the fill opacity property for a paper view object.
 * The fill opacity property defines the opacity of the fill color used in a paper view object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the fill opacity property.
 *   @param {number} opacity - The opacity value for the fill color.
 * @property {function} get - The getter function for the fill opacity property.
 *   @returns {number} The opacity value of the fill color.
 */
function viewFillOpacityPropertyDef() {
  return {
    set: function opacity(o) {
      this._fillOpacity = o;
      this._project.descendants.forEach(function (item) {
        return item.updateFillOpacity();
      });
    },
    get: function opacity() {
      return this._fillOpacity;
    }
  };
}

/**
 * Define the rescale property for a paper style object.
 * The rescale property defines the scaling factor applied to a paper style object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the rescale property.
 *   @param {number} rescale - The scaling factor value.
 * @property {function} get - The getter function for the rescale property.
 *   @returns {number} The scaling factor value.
 */
function rescalePropertyDef() {
  return {
    set: function rescale(o) {
      this._rescale = this._values.rescale = o;
    },
    get: function rescale() {
      return this._rescale;
    }
  };
}

/**
 * Define the rescale property for a paper item object.
 * The rescale property defines the scaling factor applied to a paper item object's style.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the rescale property.
 *   @param {number} rescale - The scaling factor value.
 * @property {function} get - The getter function for the rescale property.
 *   @returns {number} The scaling factor value.
 */
function itemRescalePropertyDef() {
  return {
    set: function rescale(o) {
      this._style.rescale = o;
    },
    get: function rescale() {
      return this._style.rescale;
    }
  };
}

/**
 * Define the hierarchy property for a paper item or project object.
 * The hierarchy property represents the parent-child relationship of paper item or project objects.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the hierarchy property.
 *   @returns {paper.Item[]} The array of paper item objects representing the hierarchy.
 */
function hierarchyDef() {
  return {
    get: function hierarchy() {
      return this.parent ? this.parent.hierarchy.concat(this) : this.project ? this.project.hierarchy.concat(this) : [this.view, this];
    }
  };
}
/**
 * Define the descendants property for a paper item or project object.
 * The descendants property represents all the descendants (children and their children) of a paper item or project object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array of paper item objects representing the descendants.
 */
function descendantsDef() {
  return {
    get: function descendants() {
      return (this.children ? this.children.map(function (child) {
        return child.descendants;
      }).flat() : []).concat(this.isGeoJSONFeature ? [this] : []);
    }
  };
}
/**
 * Define the descendants property for a paper compound path object.
 * The descendants property represents the compound path object itself as its only descendant.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array containing only the compound path object.
 */
function descendantsDefCompoundPath() {
  return {
    get: function descendants() {
      return [this];
    }
  };
}
function applyRescale() {
  var item = this;
  var rescale = item.rescale;
  if (rescale) {
    // // this accounts for view level zoom as well as the scale of the tiled image itself
    // let zoomFactor = item.hierarchy.reduce((val, item)=>{
    //     return item.scaling ? item.scaling.x * val : val;
    // }, 1);

    var zoomFactor = item.view.scaling.x * item.layer.scaling.x;
    Object.keys(rescale).forEach(function (prop) {
      if (typeof rescale[prop] === 'function') {
        item[prop] = rescale[prop](zoomFactor);
      } else {
        if (Array.isArray(rescale[prop])) {
          item[prop] = rescale[prop].map(function (i) {
            return i / zoomFactor;
          });
        } else {
          item[prop] = rescale[prop] / zoomFactor;
        }
      }
    });
  }
}
function strokePropertyDefItem() {
  return {
    get: function stroke() {
      return this._stroke;
    },
    set: function stroke(sw) {
      this._stroke = sw;
      this.strokeWidth = sw / (this.view.getZoom() * this.hierarchy.filter(function (i) {
        return i.tiledImage;
      })[0].scaling.x);
    }
  };
}

// patch isClockwise by adding a small epsilon value to account for floating point errors
_paper.PathItem.prototype.isClockwise = function () {
  return this.getArea() >= -0.00000001;
};
Object.defineProperty(_paper.PathItem.prototype, 'clockwise', {
  get: function cw() {
    return this.isClockwise();
  }
});

/*
 * Monkey patch paper boolean operations by getting rid of very short curves after splitting paths at intersections (see traceBoolean for modification)
 * Code modified from:
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */
/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

/**
 * @name CollisionDetection
 * @namespace
 * @private
 * @author Jan Boesenberg <jan.boesenberg@gmail.com>
 */
var CollisionDetection = /** @lends CollisionDetection */{
  /**
   * Finds collisions between axis aligned bounding boxes of items.
   *
   * This function takes the bounds of all items in the items1 and items2
   * arrays and calls findBoundsCollisions().
   *
   * @param {Array} items1 Array of items for which collisions should be
   *     found.
   * @param {Array} [items2] Array of items  that the first array should be
   *     compared with. If not provided, collisions between items within
   *     the first array will be returned.
   * @param {Number} [tolerance] If provided, the tolerance will be added to
   *     all sides of each bounds when checking for collisions.
   * @returns {Array} Array containing for the bounds at the same index in
   *     items1 an array of the indexes of colliding bounds in items2
   */
  findItemBoundsCollisions: function findItemBoundsCollisions(items1, items2, tolerance) {
    function getBounds(items) {
      var bounds = new Array(items.length);
      for (var i = 0; i < items.length; i++) {
        var rect = items[i].getBounds();
        bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
      }
      return bounds;
    }
    var bounds1 = getBounds(items1),
      bounds2 = !items2 || items2 === items1 ? bounds1 : getBounds(items2);
    return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
  },
  /**
   * Finds collisions between curves bounds. For performance reasons this
   * uses broad bounds of the curve, which can be calculated much faster than
   * the actual bounds. Broad bounds guarantee to contain the full curve,
   * but they are usually larger than the actual bounds of a curve.
   *
   * This function takes the broad bounds of all curve values in the curves1
   * and curves2 arrays and calls findBoundsCollisions().
   *
   * @param {Array} curves1 Array of curve values for which collisions should
   *     be found.
   * @param {Array} [curves2] Array of curve values that the first array
   *     should be compared with. If not provided, collisions between curve
   *     bounds within the first arrray will be returned.
   * @param {Number} [tolerance] If provided, the tolerance will be added to
   *     all sides of each bounds when checking for collisions.
   * @param {Boolean} [bothAxis] If true, the sweep is performed along both
   *     axis, and the results include collisions for both: `{ hor, ver }`.
   * @returns {Array} Array containing for the bounds at the same index in
   *     curves1 an array of the indexes of colliding bounds in curves2
   */
  findCurveBoundsCollisions: function findCurveBoundsCollisions(curves1, curves2, tolerance, bothAxis) {
    function getBounds(curves) {
      var min = Math.min,
        max = Math.max,
        bounds = new Array(curves.length);
      for (var i = 0; i < curves.length; i++) {
        var v = curves[i];
        bounds[i] = [min(v[0], v[2], v[4], v[6]), min(v[1], v[3], v[5], v[7]), max(v[0], v[2], v[4], v[6]), max(v[1], v[3], v[5], v[7])];
      }
      return bounds;
    }
    var bounds1 = getBounds(curves1),
      bounds2 = !curves2 || curves2 === curves1 ? bounds1 : getBounds(curves2);
    if (bothAxis) {
      var hor = this.findBoundsCollisions(bounds1, bounds2, tolerance || 0, false, true),
        ver = this.findBoundsCollisions(bounds1, bounds2, tolerance || 0, true, true),
        list = [];
      for (var i = 0, l = hor.length; i < l; i++) {
        list[i] = {
          hor: hor[i],
          ver: ver[i]
        };
      }
      return list;
    }
    return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
  },
  /**
   * Finds collisions between two sets of bounding rectangles.
   *
   * The collision detection is implemented as a sweep and prune algorithm
   * with sweep either along the x or y axis (primary axis) and immediate
   * check on secondary axis for potential pairs.
   *
   * Each entry in the bounds arrays must be an array of length 4 with
   * x0, y0, x1, and y1 as the array elements.
   *
   * The returned array has the same length as bounds1. Each entry
   * contains an array with all indices of overlapping bounds of
   * bounds2 (or bounds1 if bounds2 is not provided) sorted
   * in ascending order.
   *
   * If the second bounds array parameter is null, collisions between bounds
   * within the first bounds array will be found. In this case the indexed
   * returned for each bounds will not contain the bounds' own index.
   *
   *
   * @param {Array} boundsA Array of bounds objects for which collisions
   *     should be found.
   * @param {Array} [boundsB] Array of bounds that the first array should
   *     be compared with. If not provided, collisions between bounds within
   *     the first arrray will be returned.
   * @param {Number} [tolerance] If provided, the tolerance will be added to
   *     all sides of each bounds when checking for collisions.
   * @param {Boolean} [sweepVertical] If true, the sweep is performed along
   *     the y-axis.
   * @param {Boolean} [onlySweepAxisCollisions] If true, no collision checks
   *     will be done on the secondary axis.
   * @returns {Array} Array containing for the bounds at the same index in
   *     boundsA an array of the indexes of colliding bounds in boundsB
   */
  findBoundsCollisions: function findBoundsCollisions(boundsA, boundsB, tolerance, sweepVertical, onlySweepAxisCollisions) {
    var self = !boundsB || boundsA === boundsB,
      allBounds = self ? boundsA : boundsA.concat(boundsB),
      lengthA = boundsA.length,
      lengthAll = allBounds.length;

    // Binary search utility function.
    // For multiple same entries, this returns the rightmost entry.
    // https://en.wikipedia.org/wiki/Binary_search_algorithm#Procedure_for_finding_the_rightmost_element
    function binarySearch(indices, coord, value) {
      var lo = 0,
        hi = indices.length;
      while (lo < hi) {
        var mid = hi + lo >>> 1; // Same as Math.floor((hi + lo) / 2)
        if (allBounds[indices[mid]][coord] < value) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      return lo - 1;
    }

    // Set coordinates for primary and secondary axis depending on sweep
    // direction. By default we sweep in horizontal direction, which
    // means x is the primary axis.
    var pri0 = sweepVertical ? 1 : 0,
      pri1 = pri0 + 2,
      sec0 = sweepVertical ? 0 : 1,
      sec1 = sec0 + 2;
    // Create array with all indices sorted by lower boundary on primary
    // axis.
    var allIndicesByPri0 = new Array(lengthAll);
    for (var i = 0; i < lengthAll; i++) {
      allIndicesByPri0[i] = i;
    }
    allIndicesByPri0.sort(function (i1, i2) {
      return allBounds[i1][pri0] - allBounds[i2][pri0];
    });
    // Sweep along primary axis. Indices of active bounds are kept in an
    // array sorted by higher boundary on primary axis.
    var activeIndicesByPri1 = [],
      allCollisions = new Array(lengthA);
    for (var i = 0; i < lengthAll; i++) {
      var curIndex = allIndicesByPri0[i],
        curBounds = allBounds[curIndex],
        // The original index in boundsA or boundsB:
        origIndex = self ? curIndex : curIndex - lengthA,
        isCurrentA = curIndex < lengthA,
        isCurrentB = self || !isCurrentA,
        curCollisions = isCurrentA ? [] : null;
      if (activeIndicesByPri1.length) {
        // remove (prune) indices that are no longer active.
        var pruneCount = binarySearch(activeIndicesByPri1, pri1, curBounds[pri0] - tolerance) + 1;
        activeIndicesByPri1.splice(0, pruneCount);
        // Add collisions for current index.
        if (self && onlySweepAxisCollisions) {
          // All active indexes can be added, no further checks needed
          curCollisions = curCollisions.concat(activeIndicesByPri1);
          // Add current index to collisions of all active indexes
          for (var j = 0; j < activeIndicesByPri1.length; j++) {
            var activeIndex = activeIndicesByPri1[j];
            allCollisions[activeIndex].push(origIndex);
          }
        } else {
          var curSec1 = curBounds[sec1],
            curSec0 = curBounds[sec0];
          for (var j = 0; j < activeIndicesByPri1.length; j++) {
            var activeIndex = activeIndicesByPri1[j],
              activeBounds = allBounds[activeIndex],
              isActiveA = activeIndex < lengthA,
              isActiveB = self || activeIndex >= lengthA;

            // Check secondary axis bounds if necessary.
            if (onlySweepAxisCollisions || (isCurrentA && isActiveB || isCurrentB && isActiveA) && curSec1 >= activeBounds[sec0] - tolerance && curSec0 <= activeBounds[sec1] + tolerance) {
              // Add current index to collisions of active
              // indices and vice versa.
              if (isCurrentA && isActiveB) {
                curCollisions.push(self ? activeIndex : activeIndex - lengthA);
              }
              if (isCurrentB && isActiveA) {
                allCollisions[activeIndex].push(origIndex);
              }
            }
          }
        }
      }
      if (isCurrentA) {
        if (boundsA === boundsB) {
          // If both arrays are the same, add self collision.
          curCollisions.push(curIndex);
        }
        // Add collisions for current index.
        allCollisions[curIndex] = curCollisions;
      }
      // Add current index to active indices. Keep array sorted by
      // their higher boundary on the primary axis.s
      if (activeIndicesByPri1.length) {
        var curPri1 = curBounds[pri1],
          index = binarySearch(activeIndicesByPri1, pri1, curPri1);
        activeIndicesByPri1.splice(index + 1, 0, curIndex);
      } else {
        activeIndicesByPri1.push(curIndex);
      }
    }
    // Sort collision indices in ascending order.
    for (var i = 0; i < allCollisions.length; i++) {
      var collisions = allCollisions[i];
      if (collisions) {
        collisions.sort(function (i1, i2) {
          return i1 - i2;
        });
      }
    }
    return allCollisions;
  }
};

/*
 * Monkey patch paper boolean operations by getting rid of very short curves after splitting paths at intersections (see traceBoolean for modification)
 * Code modified from:
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

var PathItem = _paper.PathItem;
var Path = _paper.Path;
var CompoundPath = _paper.CompoundPath;
var Base = _paper.Base;
var Item = _paper.Item;
var Segment = _paper.Segment;
var Curve = _paper.Curve;
var CurveLocation = _paper.CurveLocation;
var Numerical = _paper.Numerical;

/*
 * Boolean Geometric Path Operations
 *
 * Supported
 *  - Path and CompoundPath items
 *  - Boolean Union
 *  - Boolean Intersection
 *  - Boolean Subtraction
 *  - Boolean Exclusion
 *  - Resolving a self-intersecting Path items
 *  - Boolean operations on self-intersecting Paths items
 *
 * @author Harikrishnan Gopalakrishnan <hari.exeption@gmail.com>
 * @author Jan Boesenberg <jan.boesenberg@gmail.com>
 * @author Jürg Lehni <juerg@scratchdisk.com>
 */
PathItem.inject(new function () {
  var min = Math.min,
    max = Math.max,
    abs = Math.abs,
    // Set up lookup tables for each operator, to decide if a given segment
    // is to be considered a part of the solution, or to be discarded, based
    // on its winding contribution, as calculated by propagateWinding().
    // Boolean operators return true if a segment with the given winding
    // contribution contributes to the final result or not. They are applied
    // to for each segment after the paths are split at crossings.
    operators = {
      unite: {
        '1': true,
        '2': true
      },
      intersect: {
        '2': true
      },
      subtract: {
        '1': true
      },
      // exclude only needs -1 to support reorientPaths() when there are
      // no crossings. The actual boolean code uses unsigned winding.
      exclude: {
        '1': true,
        '-1': true
      }
    };
  function getPaths(path) {
    return path._children || [path];
  }

  /*
   * Creates a clone of the path that we can modify freely, with its matrix
   * applied to its geometry. Calls #reduce() to simplify compound paths and
   * remove empty curves, #resolveCrossings() to resolve self-intersection
   * make sure all paths have correct winding direction.
   */
  function preparePath(path, resolve) {
    var res = path.clone(false).reduce({
      simplify: true
    }).transform(null, true, true);
    if (resolve) {
      // For correct results, close open paths with straight lines:
      var paths = getPaths(res);
      for (var i = 0, l = paths.length; i < l; i++) {
        var path = paths[i];
        if (!path._closed && !path.isEmpty()) {
          // Close with epsilon tolerance, to avoid tiny straight
          // that would cause issues with intersection detection.
          path.closePath(/*#=*/Numerical.EPSILON);
          path.getFirstSegment().setHandleIn(0, 0);
          path.getLastSegment().setHandleOut(0, 0);
        }
      }
      res = res.resolveCrossings().reorient(res.getFillRule() === 'nonzero', true);
    }
    return res;
  }
  function createResult(paths, simplify, path1, path2, options) {
    var result = new CompoundPath(Item.NO_INSERT);
    result.addChildren(paths, true);
    // See if the item can be reduced to just a simple Path.
    result = result.reduce({
      simplify: simplify
    });
    if (!(options && options.insert == false)) {
      // Insert the resulting path above whichever of the two paths appear
      // further up in the stack.
      result.insertAbove(path2 && path1.isSibling(path2) && path1.getIndex() < path2.getIndex() ? path2 : path1);
    }
    // Copy over the input path attributes, excluding matrix and we're done.
    result.copyAttributes(path1, true);
    return result;
  }
  function filterIntersection(inter) {
    // TODO: Change isCrossing() to also handle overlaps (hasOverlap())
    // that are actually involved in a crossing! For this we need proper
    // overlap range detection / merging first... But as we call
    // #resolveCrossings() first in boolean operations, removing all
    // self-touching areas in paths, this works for the known use cases.
    // The ideal implementation would deal with it in a way outlined in:
    // https://github.com/paperjs/paper.js/issues/874#issuecomment-168332391
    return inter.hasOverlap() || inter.isCrossing();
  }
  function traceBoolean(path1, path2, operation, options) {
    // Only support subtract and intersect operations when computing stroke
    // based boolean operations (options.split = true).
    if (options && (options.trace == false || options.stroke) && /^(subtract|intersect)$/.test(operation)) return splitBoolean(path1, path2, operation);
    // We do not modify the operands themselves, but create copies instead,
    // fas produced by the calls to preparePath().
    // NOTE: The result paths might not belong to the same type i.e.
    // subtract(A:Path, B:Path):CompoundPath etc.
    var _path1 = preparePath(path1, true),
      _path2 = path2 && path1 !== path2 && preparePath(path2, true),
      // Retrieve the operator lookup table for winding numbers.
      operator = operators[operation];
    // Add a simple boolean property to check for a given operation,
    // e.g. `if (operator.unite)`
    operator[operation] = true;
    // Give both paths the same orientation except for subtraction
    // and exclusion, where we need them at opposite orientation.
    if (_path2 && (operator.subtract || operator.exclude) ^ (_path2.isClockwise() ^ _path1.isClockwise())) _path2.reverse();
    // Split curves at crossings on both paths. Note that for self-
    // intersection, path2 is null and getIntersections() handles it.
    var crossings = divideLocations(CurveLocation.expand(_path1.getIntersections(_path2, filterIntersection))),
      paths1 = getPaths(_path1),
      paths2 = _path2 && getPaths(_path2),
      segments = [],
      curves = [],
      paths;
    function collectPaths(paths) {
      for (var i = 0, l = paths.length; i < l; i++) {
        var path = paths[i];
        Base.push(segments, path._segments);
        Base.push(curves, path.getCurves());
        // See if all encountered segments in a path are overlaps, to
        // be able to separately handle fully overlapping paths.
        path._overlapsOnly = true;
      }
    }
    function getCurves(indices) {
      var list = [];
      for (var i = 0, l = indices && indices.length; i < l; i++) {
        list.push(curves[indices[i]]);
      }
      return list;
    }
    if (crossings.length) {
      // Collect all segments and curves of both involved operands.
      collectPaths(paths1);
      if (paths2) collectPaths(paths2);

      // Monkey patch is here. Paths are split above in divideLocations.
      // Remove segments/curves with length less than geomEpsilon of 1e-7
      for (var _i = crossings.length - 1; _i > -1; _i--) {
        if (segments[_i].curve.length < 1e-7) {
          segments[_i].remove();
          segments.splice(_i, 1);
          curves.splice(_i, 1);
        }
      }
      var curvesValues = new Array(curves.length);
      for (var i = 0, l = curves.length; i < l; i++) {
        curvesValues[i] = curves[i].getValues();
      }
      var curveCollisions = CollisionDetection.findCurveBoundsCollisions(curvesValues, curvesValues, 0, true);
      var curveCollisionsMap = {};
      for (var i = 0; i < curves.length; i++) {
        var curve = curves[i],
          id = curve._path._id,
          map = curveCollisionsMap[id] = curveCollisionsMap[id] || {};
        map[curve.getIndex()] = {
          hor: getCurves(curveCollisions[i].hor),
          ver: getCurves(curveCollisions[i].ver)
        };
      }

      // Propagate the winding contribution. Winding contribution of
      // curves does not change between two crossings.
      // First, propagate winding contributions for curve chains starting
      // in all crossings:
      for (var i = 0, l = crossings.length; i < l; i++) {
        propagateWinding(crossings[i]._segment, _path1, _path2, curveCollisionsMap, operator);
      }
      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i],
          inter = segment._intersection;
        if (!segment._winding) {
          propagateWinding(segment, _path1, _path2, curveCollisionsMap, operator);
        }
        // See if all encountered segments in a path are overlaps.
        if (!(inter && inter._overlap)) segment._path._overlapsOnly = false;
      }
      paths = tracePaths(segments, operator);
    } else {
      // When there are no crossings, the result can be determined through
      // a much faster call to reorientPaths():
      paths = reorientPaths(
      // Make sure reorientPaths() never works on original
      // _children arrays by calling paths1.slice()
      paths2 ? paths1.concat(paths2) : paths1.slice(), function (w) {
        return !!operator[w];
      });
    }
    return createResult(paths, true, path1, path2, options);
  }
  function splitBoolean(path1, path2, operation) {
    var _path1 = preparePath(path1),
      _path2 = preparePath(path2),
      crossings = _path1.getIntersections(_path2, filterIntersection),
      subtract = operation === 'subtract',
      divide = operation === 'divide',
      added = {},
      paths = [];
    function addPath(path) {
      // Simple see if the point halfway across the open path is inside
      // path2, and include / exclude the path based on the operator.
      if (!added[path._id] && (divide || _path2.contains(path.getPointAt(path.getLength() / 2)) ^ subtract)) {
        paths.unshift(path);
        return added[path._id] = true;
      }
    }

    // Now loop backwards through all crossings, split the path and check
    // the new path that was split off for inclusion.
    for (var i = crossings.length - 1; i >= 0; i--) {
      var path = crossings[i].split();
      if (path) {
        // See if we can add the path, and if so, clear the first handle
        // at the split, because it might have been a curve.
        if (addPath(path)) path.getFirstSegment().setHandleIn(0, 0);
        // Clear the other side of the split too, which is always the
        // end of the remaining _path1.
        _path1.getLastSegment().setHandleOut(0, 0);
      }
    }
    // At the end, add what's left from our path after all the splitting.
    addPath(_path1);
    return createResult(paths, false, path1, path2);
  }

  /*
   * Creates linked lists between intersections through their _next and _prev
   * properties.
   *
   * @private
   */
  function linkIntersections(from, to) {
    // Only create the link if it's not already in the existing chain, to
    // avoid endless recursions. First walk to the beginning of the chain,
    // and abort if we find `to`.
    var prev = from;
    while (prev) {
      if (prev === to) return;
      prev = prev._previous;
    }
    // Now walk to the end of the existing chain to find an empty spot, but
    // stop if we find `to`, to avoid adding it again.
    while (from._next && from._next !== to) from = from._next;
    // If we're reached the end of the list, we can add it.
    if (!from._next) {
      // Go back to beginning of the other chain, and link the two up.
      while (to._previous) to = to._previous;
      from._next = to;
      to._previous = from;
    }
  }
  function clearCurveHandles(curves) {
    // Clear segment handles if they were part of a curve with no handles.
    for (var i = curves.length - 1; i >= 0; i--) curves[i].clearHandles();
  }

  /**
   * Reorients the specified paths.
   *
   * @param {Item[]} paths the paths of which the orientation needs to be
   *     reoriented
   * @param {Function} isInside determines if the inside of a path is filled.
   *     For non-zero fill rule this function would be implemented as follows:
   *
   *     function isInside(w) {
   *       return w != 0;
   *     }
   * @param {Boolean} [clockwise] if provided, the orientation of the root
   *     paths will be set to the orientation specified by `clockwise`,
   *     otherwise the orientation of the largest root child is used.
   * @return {Item[]} the reoriented paths
  */
  function reorientPaths(paths, isInside, clockwise) {
    var length = paths && paths.length;
    if (length) {
      var lookup = Base.each(paths, function (path, i) {
          // Build a lookup table with information for each path's
          // original index and winding contribution.
          this[path._id] = {
            container: null,
            winding: path.isClockwise() ? 1 : -1,
            index: i
          };
        }, {}),
        // Now sort the paths by their areas, from large to small.
        sorted = paths.slice().sort(function (a, b) {
          return abs(b.getArea()) - abs(a.getArea());
        }),
        // Get reference to the first, largest path and insert it
        // already.
        first = sorted[0];
      // create lookup containing potentially overlapping path bounds
      var collisions = CollisionDetection.findItemBoundsCollisions(sorted, null, Numerical.GEOMETRIC_EPSILON);
      if (clockwise == null) clockwise = first.isClockwise();
      // Now determine the winding for each path, from large to small.
      for (var i = 0; i < length; i++) {
        var path1 = sorted[i],
          entry1 = lookup[path1._id],
          containerWinding = 0,
          indices = collisions[i];
        if (indices) {
          var point = null; // interior point, only get it if required.
          for (var j = indices.length - 1; j >= 0; j--) {
            if (indices[j] < i) {
              point = point || path1.getInteriorPoint();
              var path2 = sorted[indices[j]];
              // As we run through the paths from largest to
              // smallest, for any current path, all potentially
              // containing paths have already been processed and
              // their orientation fixed. To achieve correct
              // orientation of contained paths based on winding,
              // find one containing path with different
              // "insideness" and set opposite orientation.
              if (path2.contains(point)) {
                var entry2 = lookup[path2._id];
                containerWinding = entry2.winding;
                entry1.winding += containerWinding;
                entry1.container = entry2.exclude ? entry2.container : path2;
                break;
              }
            }
          }
        }
        // Only keep paths if the "insideness" changes when crossing the
        // path, e.g. the inside of the path is filled and the outside
        // is not, or vice versa.
        if (isInside(entry1.winding) === isInside(containerWinding)) {
          entry1.exclude = true;
          // No need to delete excluded entries. Setting to null is
          // enough, as #setChildren() can handle arrays with gaps.
          paths[entry1.index] = null;
        } else {
          // If the containing path is not excluded, we're done
          // searching for the orientation defining path.
          var container = entry1.container;
          path1.setClockwise(container ? !container.isClockwise() : clockwise);
        }
      }
    }
    return paths;
  }

  /**
   * Divides the path-items at the given locations.
   *
   * @param {CurveLocation[]} locations an array of the locations to split the
   *     path-item at.
   * @param {Function} [include] a function that determines if dividing should
   *     happen at a given location.
   * @return {CurveLocation[]} the locations at which the involved path-items
   *     were divided
   * @private
   */
  function divideLocations(locations, include, clearLater) {
    var results = include && [],
      tMin = /*#=*/Numerical.CURVETIME_EPSILON,
      tMax = 1 - tMin,
      clearHandles = false,
      clearCurves = clearLater || [],
      clearLookup = clearLater && {},
      renormalizeLocs,
      prevCurve,
      prevTime;

    // When dealing with overlaps and crossings, divideLocations() is called
    // twice. If curve handles of curves that originally didn't have handles
    // are cleared after the first call , we loose  curve-time consistency
    // and CurveLocation#_time values become invalid.
    // In those situations, clearLater is passed as a container for all
    // curves of which the handles need to be cleared in the end.
    // Create a lookup table that allows us to quickly determine if a given
    // curve was resulting from an original curve without handles.
    function getId(curve) {
      return curve._path._id + '.' + curve._segment1._index;
    }
    for (var i = (clearLater && clearLater.length) - 1; i >= 0; i--) {
      var curve = clearLater[i];
      if (curve._path) clearLookup[getId(curve)] = true;
    }

    // Loop backwards through all sorted locations, from right to left, so
    // we can assume a predefined sequence for curve-time renormalization.
    for (var i = locations.length - 1; i >= 0; i--) {
      var loc = locations[i],
        // Retrieve curve-time before calling include(), because it may
        // be changed to the scaled value after splitting previously.
        // See CurveLocation#getCurve(), #resolveCrossings()
        time = loc._time,
        origTime = time,
        exclude = include && !include(loc),
        // Retrieve curve after calling include(), because it may cause
        // a change in the cached location values, see above.
        curve = loc._curve,
        segment;
      if (curve) {
        if (curve !== prevCurve) {
          // This is a new curve, update clearHandles setting.
          clearHandles = !curve.hasHandles() || clearLookup && clearLookup[getId(curve)];
          // Keep track of locations for later curve-time
          // renormalization within the curve.
          renormalizeLocs = [];
          prevTime = null;
          prevCurve = curve;
        } else if (prevTime >= tMin) {
          // Rescale curve-time when we are splitting the same curve
          // multiple times, if splitting was done previously.
          time /= prevTime;
        }
      }
      if (exclude) {
        // Store excluded locations for later renormalization, in case
        // the same curve is divided to their left.
        if (renormalizeLocs) renormalizeLocs.push(loc);
        continue;
      } else if (include) {
        results.unshift(loc);
      }
      prevTime = origTime;
      if (time < tMin) {
        segment = curve._segment1;
      } else if (time > tMax) {
        segment = curve._segment2;
      } else {
        // Split the curve at time, passing true for _setHandles to
        // always set the handles on the sub-curves even if the original
        // curve had no handles.
        var newCurve = curve.divideAtTime(time, true);
        // Keep track of curves without handles, so they can be cleared
        // again at the end.
        if (clearHandles) clearCurves.push(curve, newCurve);
        segment = newCurve._segment1;
        // Handle locations that need their curve-time renormalized
        // within the same curve after dividing at this location.
        for (var j = renormalizeLocs.length - 1; j >= 0; j--) {
          var l = renormalizeLocs[j];
          l._time = (l._time - time) / (1 - time);
        }
      }
      loc._setSegment(segment);
      // Create links from the new segment to the intersection on the
      // other curve, as well as from there back. If there are multiple
      // intersections on the same segment, we create linked lists between
      // the intersections through linkIntersections(), linking both ways.
      var inter = segment._intersection,
        dest = loc._intersection;
      if (inter) {
        linkIntersections(inter, dest);
        // Each time we add a new link to the linked list, we need to
        // add links from all the other entries to the new entry.
        var other = inter;
        while (other) {
          linkIntersections(other._intersection, inter);
          other = other._next;
        }
      } else {
        segment._intersection = dest;
      }
    }
    // Clear curve handles right away if we're not storing them for later.
    if (!clearLater) clearCurveHandles(clearCurves);
    return results || locations;
  }

  /**
   * Returns the winding contribution number of the given point in respect
   * to the shapes described by the passed curves.
   *
   * See #1073#issuecomment-226942348 and #1073#issuecomment-226946965 for a
   * detailed description of the approach developed by @iconexperience to
   * precisely determine the winding contribution in all known edge cases.
   *
   * @param {Point} point the location for which to determine the winding
   *     contribution
   * @param {Curve[]} curves The curves that describe the shape against which
   *     to check, as returned by {@link Path#curves} or
   *     {@link CompoundPath#curves}.
   * @param {Boolean} [dir=false] the direction in which to determine the
   *     winding contribution, `false`: in x-direction, `true`: in y-direction
   * @param {Boolean} [closed=false] determines how areas should be closed
   *     when a curve is part of an open path, `false`: area is closed with a
   *     straight line, `true`: area is closed taking the handles of the first
   *     and last segment into account
   * @param {Boolean} [dontFlip=false] controls whether the algorithm is
   *     allowed to flip direction if it is deemed to produce better results
   * @return {Object} an object containing the calculated winding number, as
   *     well as an indication whether the point was situated on the contour
   * @private
   */
  function getWinding(point, curves, dir, closed, dontFlip) {
    // `curves` can either be an array of curves, or an object containing of
    // the form `{ hor: [], ver: [] }` (see `curveCollisionsMap`), with each
    // key / value pair holding only those curves that can be crossed by a
    // horizontal / vertical line through the point to be checked.
    var curvesList = Array.isArray(curves) ? curves : curves[dir ? 'hor' : 'ver'];
    // Determine the index of the abscissa and ordinate values in the curve
    // values arrays, based on the direction:
    var ia = dir ? 1 : 0,
      // the abscissa index
      io = ia ^ 1,
      // the ordinate index
      pv = [point.x, point.y],
      pa = pv[ia],
      // the point's abscissa
      po = pv[io],
      // the point's ordinate
      // Use separate epsilons for winding contribution code.
      windingEpsilon = 1e-9,
      qualityEpsilon = 1e-6,
      paL = pa - windingEpsilon,
      paR = pa + windingEpsilon,
      windingL = 0,
      windingR = 0,
      pathWindingL = 0,
      pathWindingR = 0,
      onPath = false,
      onAnyPath = false,
      quality = 1,
      roots = [],
      vPrev,
      vClose;
    function addWinding(v) {
      var o0 = v[io + 0],
        o3 = v[io + 6];
      if (po < min(o0, o3) || po > max(o0, o3)) {
        // If the curve is outside the ordinates' range, no intersection
        // with the ray is possible.
        return;
      }
      var a0 = v[ia + 0],
        a1 = v[ia + 2],
        a2 = v[ia + 4],
        a3 = v[ia + 6];
      if (o0 === o3) {
        // A horizontal curve is not necessarily between two non-
        // horizontal curves. We have to take cases like these into
        // account:
        //          +-----+
        //     +----+     |
        //          +-----+
        if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
          onPath = true;
        }
        // If curve does not change in ordinate direction, windings will
        // be added by adjacent curves.
        // Bail out without updating vPrev at the end of the call.
        return;
      }
      // Determine the curve-time value corresponding to the point.
      var t = po === o0 ? 0 : po === o3 ? 1
        // If the abscissa is outside the curve, we can use any
        // value except 0 (requires special handling). Use 1, as it
        // does not require additional calculations for the point.
        : paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? 1 : Curve.solveCubic(v, io, po, roots, 0, 1) > 0 ? roots[0] : 1,
        a = t === 0 ? a0 : t === 1 ? a3 : Curve.getPoint(v, t)[dir ? 'y' : 'x'],
        winding = o0 > o3 ? 1 : -1,
        windingPrev = vPrev[io] > vPrev[io + 6] ? 1 : -1,
        a3Prev = vPrev[ia + 6];
      if (po !== o0) {
        // Standard case, curve is not crossed at its starting point.
        if (a < paL) {
          pathWindingL += winding;
        } else if (a > paR) {
          pathWindingR += winding;
        } else {
          onPath = true;
        }
        // Determine the quality of the winding calculation. Reduce the
        // quality with every crossing of the ray very close to the
        // path. This means that if the point is on or near multiple
        // curves, the quality becomes less than 0.5.
        if (a > pa - qualityEpsilon && a < pa + qualityEpsilon) quality /= 2;
      } else {
        // Curve is crossed at starting point.
        if (winding !== windingPrev) {
          // Winding changes from previous curve, cancel its winding.
          if (a0 < paL) {
            pathWindingL += winding;
          } else if (a0 > paR) {
            pathWindingR += winding;
          }
        } else if (a0 != a3Prev) {
          // Handle a horizontal curve between the current and
          // previous non-horizontal curve. See
          // #1261#issuecomment-282726147 for a detailed explanation:
          if (a3Prev < paR && a > paR) {
            // Right winding was not added before, so add it now.
            pathWindingR += winding;
            onPath = true;
          } else if (a3Prev > paL && a < paL) {
            // Left winding was not added before, so add it now.
            pathWindingL += winding;
            onPath = true;
          }
        }
        quality /= 4;
      }
      vPrev = v;
      // If we're on the curve, look at the tangent to decide whether to
      // flip direction to better determine a reliable winding number:
      // If the tangent is parallel to the direction, call getWinding()
      // again with flipped direction and return that result instead.
      return !dontFlip && a > paL && a < paR && Curve.getTangent(v, t)[dir ? 'x' : 'y'] === 0 && getWinding(point, curves, !dir, closed, true);
    }
    function handleCurve(v) {
      // Get the ordinates:
      var o0 = v[io + 0],
        o1 = v[io + 2],
        o2 = v[io + 4],
        o3 = v[io + 6];
      // Only handle curves that can cross the point's ordinate.
      if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
        // Get the abscissas:
        var a0 = v[ia + 0],
          a1 = v[ia + 2],
          a2 = v[ia + 4],
          a3 = v[ia + 6],
          // Get monotone curves. If the curve is outside the point's
          // abscissa, it can be treated as a monotone curve:
          monoCurves = paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? [v] : Curve.getMonoCurves(v, dir),
          res;
        for (var i = 0, l = monoCurves.length; i < l; i++) {
          // Calling addWinding() my lead to direction flipping, in
          // which case we already have the result and can return it.
          if (res = addWinding(monoCurves[i])) return res;
        }
      }
    }
    for (var i = 0, l = curvesList.length; i < l; i++) {
      var curve = curvesList[i],
        path = curve._path,
        v = curve.getValues(),
        res;
      if (!i || curvesList[i - 1]._path !== path) {
        // We're on a new (sub-)path, so we need to determine values of
        // the last non-horizontal curve on this path.
        vPrev = null;
        // If the path is not closed, connect the first and last segment
        // based on the value of `closed`:
        // - `false`: Connect with a straight curve, just like how
        //   filling open paths works.
        // - `true`: Connect with a curve that takes the segment handles
        //   into account, just like how closed paths behave.
        if (!path._closed) {
          vClose = Curve.getValues(path.getLastCurve().getSegment2(), curve.getSegment1(), null, !closed);
          // This closing curve is a potential candidate for the last
          // non-horizontal curve.
          if (vClose[io] !== vClose[io + 6]) {
            vPrev = vClose;
          }
        }
        if (!vPrev) {
          // Walk backwards through list of the path's curves until we
          // find one that is not horizontal.
          // Fall-back to the first curve's values if none is found:
          vPrev = v;
          var prev = path.getLastCurve();
          while (prev && prev !== curve) {
            var v2 = prev.getValues();
            if (v2[io] !== v2[io + 6]) {
              vPrev = v2;
              break;
            }
            prev = prev.getPrevious();
          }
        }
      }

      // Calling handleCurve() my lead to direction flipping, in which
      // case we already have the result and can return it.
      if (res = handleCurve(v)) return res;
      if (i + 1 === l || curvesList[i + 1]._path !== path) {
        // We're at the last curve of the current (sub-)path. If a
        // closing curve was calculated at the beginning of it, handle
        // it now to treat the path as closed:
        if (vClose && (res = handleCurve(vClose))) return res;
        if (onPath && !pathWindingL && !pathWindingR) {
          // If the point is on the path and the windings canceled
          // each other, we treat the point as if it was inside the
          // path. A point inside a path has a winding of [+1,-1]
          // for clockwise and [-1,+1] for counter-clockwise paths.
          // If the ray is cast in y direction (dir == true), the
          // windings always have opposite sign.
          pathWindingL = pathWindingR = path.isClockwise(closed) ^ dir ? 1 : -1;
        }
        windingL += pathWindingL;
        windingR += pathWindingR;
        pathWindingL = pathWindingR = 0;
        if (onPath) {
          onAnyPath = true;
          onPath = false;
        }
        vClose = null;
      }
    }
    // Use the unsigned winding contributions when determining which areas
    // are part of the boolean result.
    windingL = abs(windingL);
    windingR = abs(windingR);
    // Return the calculated winding contributions along with a quality
    // value indicating how reliable the value really is.
    return {
      winding: max(windingL, windingR),
      windingL: windingL,
      windingR: windingR,
      quality: quality,
      onPath: onAnyPath
    };
  }
  function propagateWinding(segment, path1, path2, curveCollisionsMap, operator) {
    // Here we try to determine the most likely winding number contribution
    // for the curve-chain starting with this segment. Once we have enough
    // confidence in the winding contribution, we can propagate it until the
    // next intersection or end of a curve chain.
    var chain = [],
      start = segment,
      totalLength = 0,
      winding;
    do {
      var curve = segment.getCurve();
      // We can encounter paths with only one segment, which would not
      // have a curve.
      if (curve) {
        var length = curve.getLength();
        chain.push({
          segment: segment,
          curve: curve,
          length: length
        });
        totalLength += length;
      }
      segment = segment.getNext();
    } while (segment && !segment._intersection && segment !== start);
    // Determine winding at three points in the chain. If a winding with
    // sufficient quality is found, use it. Otherwise use the winding with
    // the best quality.
    var offsets = [0.5, 0.25, 0.75],
      winding = {
        winding: 0,
        quality: -1
      },
      // Don't go too close to segments, to avoid special winding cases:
      tMin = 1e-3,
      tMax = 1 - tMin;
    for (var i = 0; i < offsets.length && winding.quality < 0.5; i++) {
      var length = totalLength * offsets[i];
      for (var j = 0, l = chain.length; j < l; j++) {
        var entry = chain[j],
          curveLength = entry.length;
        if (length <= curveLength) {
          var curve = entry.curve,
            path = curve._path,
            parent = path._parent,
            operand = parent instanceof CompoundPath ? parent : path,
            t = Numerical.clamp(curve.getTimeAt(length), tMin, tMax),
            pt = curve.getPointAtTime(t),
            // Determine the direction in which to check the winding
            // from the point (horizontal or vertical), based on the
            // curve's direction at that point. If tangent is less
            // than 45°, cast the ray vertically, else horizontally.
            dir = abs(curve.getTangentAtTime(t).y) < Math.SQRT1_2;
          // While subtracting, we need to omit this curve if it is
          // contributing to the second operand and is outside the
          // first operand.
          var wind = null;
          if (operator.subtract && path2) {
            // Calculate path winding at point depending on operand.
            var otherPath = operand === path1 ? path2 : path1,
              pathWinding = otherPath._getWinding(pt, dir, true);
            // Check if curve should be omitted.
            if (operand === path1 && pathWinding.winding || operand === path2 && !pathWinding.winding) {
              // Check if quality is not good enough...
              if (pathWinding.quality < 1) {
                // ...and if so, skip this point...
                continue;
              } else {
                // ...otherwise, omit this curve.
                wind = {
                  winding: 0,
                  quality: 1
                };
              }
            }
          }
          wind = wind || getWinding(pt, curveCollisionsMap[path._id][curve.getIndex()], dir, true);
          if (wind.quality > winding.quality) winding = wind;
          break;
        }
        length -= curveLength;
      }
    }
    // Now assign the winding to the entire curve chain.
    for (var j = chain.length - 1; j >= 0; j--) {
      chain[j].segment._winding = winding;
    }
  }

  /**
   * Private method to trace closed paths from a list of segments, according
   * to a the their winding number contribution and a custom operator.
   *
   * @param {Segment[]} segments array of segments to trace closed paths
   * @param {Function} operator the operator lookup table that receives as key
   *     the winding number contribution of a curve and returns a boolean
   *     value indicating whether the curve should be included in result
   * @return {Path[]} the traced closed paths
   */
  function tracePaths(segments, operator) {
    var paths = [],
      starts;
    function isValid(seg) {
      var winding;
      return !!(seg && !seg._visited && (!operator || operator[(winding = seg._winding || {}).winding]
      // Unite operations need special handling of segments
      // with a winding contribution of two (part of both
      // areas), which are only valid if they are part of the
      // result's contour, not contained inside another area.
      && !(operator.unite && winding.winding === 2
      // No contour if both windings are non-zero.
      && winding.windingL && winding.windingR)));
    }
    function isStart(seg) {
      if (seg) {
        for (var i = 0, l = starts.length; i < l; i++) {
          if (seg === starts[i]) return true;
        }
      }
      return false;
    }
    function visitPath(path) {
      var segments = path._segments;
      for (var i = 0, l = segments.length; i < l; i++) {
        segments[i]._visited = true;
      }
    }

    // If there are multiple possible intersections, find the ones that's
    // either connecting back to start or are not visited yet, and will be
    // part of the boolean result:
    function getCrossingSegments(segment, collectStarts) {
      var inter = segment._intersection,
        start = inter,
        crossings = [];
      if (collectStarts) starts = [segment];
      function collect(inter, end) {
        while (inter && inter !== end) {
          var other = inter._segment,
            path = other && other._path;
          if (path) {
            var next = other.getNext() || path.getFirstSegment(),
              nextInter = next._intersection;
            // See if this segment and the next are not visited yet,
            // or are bringing us back to the start, and are both
            // valid, meaning they're part of the boolean result.
            if (other !== segment && (isStart(other) || isStart(next) || next && isValid(other) && (isValid(next)
            // If next segment isn't valid, its intersection
            // to which we may switch may be, so check that.
            || nextInter && isValid(nextInter._segment)))) {
              crossings.push(other);
            }
            if (collectStarts) starts.push(other);
          }
          inter = inter._next;
        }
      }
      if (inter) {
        collect(inter);
        // Find the beginning of the linked intersections and loop all
        // the way back to start, to collect all valid intersections.
        while (inter && inter._previous) inter = inter._previous;
        collect(inter, start);
      }
      return crossings;
    }

    // Sort segments to give non-ambiguous segments the preference as
    // starting points when tracing: prefer segments with no intersections
    // over intersections, and process intersections with overlaps last:
    segments.sort(function (seg1, seg2) {
      var inter1 = seg1._intersection,
        inter2 = seg2._intersection,
        over1 = !!(inter1 && inter1._overlap),
        over2 = !!(inter2 && inter2._overlap),
        path1 = seg1._path,
        path2 = seg2._path;
      // Use bitwise-or to sort cases where only one segment is an overlap
      // or intersection separately, and fall back on natural order within
      // the path.
      return over1 ^ over2 ? over1 ? 1 : -1
      // NOTE: inter1 & 2 are objects, convert to boolean first
      // as otherwise toString() is called on them.
      : !inter1 ^ !inter2 ? inter1 ? 1 : -1
      // All other segments, also when comparing two overlaps
      // or two intersections, are sorted by their order.
      // Sort by path id to group segments on the same path.
      : path1 !== path2 ? path1._id - path2._id : seg1._index - seg2._index;
    });
    for (var i = 0, l = segments.length; i < l; i++) {
      var seg = segments[i],
        valid = isValid(seg),
        path = null,
        finished = false,
        closed = true,
        branches = [],
        branch,
        visited,
        handleIn;
      // If all encountered segments in a path are overlaps, we may have
      // two fully overlapping paths that need special handling.
      if (valid && seg._path._overlapsOnly) {
        // TODO: Don't we also need to check for multiple overlaps?
        var path1 = seg._path,
          path2 = seg._intersection._segment._path;
        if (path1.compare(path2)) {
          // Only add the path to the result if it has an area.
          if (path1.getArea()) paths.push(path1.clone(false));
          // Now mark all involved segments as visited.
          visitPath(path1);
          visitPath(path2);
          valid = false;
        }
      }
      // Do not start with invalid segments (segments that were already
      // visited, or that are not going to be part of the result).
      while (valid) {
        // For each segment we encounter, see if there are multiple
        // crossings, and if so, pick the best one:
        var first = !path,
          crossings = getCrossingSegments(seg, first),
          // Get the other segment of the first found crossing.
          other = crossings.shift(),
          finished = !first && (isStart(seg) || isStart(other)),
          cross = !finished && other;
        if (first) {
          path = new Path(Item.NO_INSERT);
          // Clear branch to start a new one with each new path.
          branch = null;
        }
        if (finished) {
          // If we end up on the first or last segment of an operand,
          // copy over its closed state, to support mixed open/closed
          // scenarios as described in #1036
          if (seg.isFirst() || seg.isLast()) closed = seg._path._closed;
          seg._visited = true;
          break;
        }
        if (cross && branch) {
          // If we're about to cross, start a new branch and add the
          // current one to the list of branches.
          branches.push(branch);
          branch = null;
        }
        if (!branch) {
          // Add the branch's root segment as the last segment to try,
          // to see if we get to a solution without crossing.
          if (cross) crossings.push(seg);
          branch = {
            start: path._segments.length,
            crossings: crossings,
            visited: visited = [],
            handleIn: handleIn
          };
        }
        if (cross) seg = other;
        // If an invalid segment is encountered, go back to the last
        // crossing and try other possible crossings, as well as not
        // crossing at the branch's root.
        if (!isValid(seg)) {
          // Remove the already added segments, and mark them as not
          // visited so they become available again as options.
          path.removeSegments(branch.start);
          for (var j = 0, k = visited.length; j < k; j++) {
            visited[j]._visited = false;
          }
          visited.length = 0;
          // Go back to the branch's root segment where the crossing
          // happened, and try other crossings. Note that this also
          // tests the root segment without crossing as it is added to
          // the list of crossings when the branch is created above.
          do {
            seg = branch && branch.crossings.shift();
            if (!seg || !seg._path) {
              seg = null;
              // If there are no segments left, try previous
              // branches until we find one that works.
              branch = branches.pop();
              if (branch) {
                visited = branch.visited;
                handleIn = branch.handleIn;
              }
            }
          } while (branch && !isValid(seg));
          if (!seg) break;
        }
        // Add the segment to the path, and mark it as visited.
        // But first we need to look ahead. If we encounter the end of
        // an open path, we need to treat it the same way as the fill of
        // an open path would: Connecting the last and first segment
        // with a straight line, ignoring the handles.
        var next = seg.getNext();
        path.add(new Segment(seg._point, handleIn, next && seg._handleOut));
        seg._visited = true;
        visited.push(seg);
        // If this is the end of an open path, go back to its first
        // segment but ignore its handleIn (see above for handleOut).
        seg = next || seg._path.getFirstSegment();
        handleIn = next && next._handleIn;
      }
      if (finished) {
        if (closed) {
          // Carry over the last handleIn to the first segment.
          path.getFirstSegment().setHandleIn(handleIn);
          path.setClosed(closed);
        }
        // Only add finished paths that cover an area to the result.
        if (path.getArea() !== 0) {
          paths.push(path);
        }
      }
    }
    return paths;
  }
  return /** @lends PathItem# */{
    /**
     * Returns the winding contribution number of the given point in respect
     * to this PathItem.
     *
     * @param {Point} point the location for which to determine the winding
     *     contribution
     * @param {Number} [dir=0] the direction in which to determine the
     *     winding contribution, `0`: in x-direction, `1`: in y-direction
     * @return {Object} an object containing the calculated winding number, as
     *     well as an indication whether the point was situated on the contour
     */
    _getWinding: function _getWinding(point, dir, closed) {
      return getWinding(point, this.getCurves(), dir, closed);
    },
    /**
     * {@grouptitle Boolean Path Operations}
     *
     * Unites the geometry of the specified path with this path's geometry
     * and returns the result as a new path item.
     *
     * @option [options.insert=true] {Boolean} whether the resulting item
     *     should be inserted back into the scene graph, above both paths
     *     involved in the operation
     *
     * @param {PathItem} path the path to unite with
     * @param {Object} [options] the boolean operation options
     * @return {PathItem} the resulting path item
     */
    unite: function unite(path, options) {
      return traceBoolean(this, path, 'unite', options);
    },
    /**
     * Intersects the geometry of the specified path with this path's
     * geometry and returns the result as a new path item.
     *
     * @option [options.insert=true] {Boolean} whether the resulting item
     *     should be inserted back into the scene graph, above both paths
     *     involved in the operation
     * @option [options.trace=true] {Boolean} whether the tracing method is
     *     used, treating both paths as areas when determining which parts
     *     of the paths are to be kept in the result, or whether the first
     *     path is only to be split at intersections, keeping the parts of
     *     the curves that intersect with the area of the second path.
     *
     * @param {PathItem} path the path to intersect with
     * @param {Object} [options] the boolean operation options
     * @return {PathItem} the resulting path item
     */
    intersect: function intersect(path, options) {
      return traceBoolean(this, path, 'intersect', options);
    },
    /**
     * Subtracts the geometry of the specified path from this path's
     * geometry and returns the result as a new path item.
     *
     * @option [options.insert=true] {Boolean} whether the resulting item
     *     should be inserted back into the scene graph, above both paths
     *     involved in the operation
     * @option [options.trace=true] {Boolean} whether the tracing method is
     *     used, treating both paths as areas when determining which parts
     *     of the paths are to be kept in the result, or whether the first
     *     path is only to be split at intersections, removing the parts of
     *     the curves that intersect with the area of the second path.
     *
     * @param {PathItem} path the path to subtract
     * @param {Object} [options] the boolean operation options
     * @return {PathItem} the resulting path item
     */
    subtract: function subtract(path, options) {
      return traceBoolean(this, path, 'subtract', options);
    },
    /**
     * Excludes the intersection of the geometry of the specified path with
     * this path's geometry and returns the result as a new path item.
     *
     * @option [options.insert=true] {Boolean} whether the resulting item
     *     should be inserted back into the scene graph, above both paths
     *     involved in the operation
     *
     * @param {PathItem} path the path to exclude the intersection of
     * @param {Object} [options] the boolean operation options
     * @return {PathItem} the resulting path item
     */
    exclude: function exclude(path, options) {
      return traceBoolean(this, path, 'exclude', options);
    },
    /**
     * Splits the geometry of this path along the geometry of the specified
     * path returns the result as a new group item. This is equivalent to
     * calling {@link #subtract(path)} and {@link #intersect(path)} and
     * putting the results into a new group.
     *
     * @option [options.insert=true] {Boolean} whether the resulting item
     *     should be inserted back into the scene graph, above both paths
     *     involved in the operation
     * @option [options.trace=true] {Boolean} whether the tracing method is
     *     used, treating both paths as areas when determining which parts
     *     of the paths are to be kept in the result, or whether the first
     *     path is only to be split at intersections.
     *
     * @param {PathItem} path the path to divide by
     * @param {Object} [options] the boolean operation options
     * @return {PathItem} the resulting path item
     */
    divide: function divide(path, options) {
      return options && (options.trace == false || options.stroke) ? splitBoolean(this, path, 'divide') : createResult([this.subtract(path, options), this.intersect(path, options)], true, this, path, options);
    },
    /*
     * Resolves all crossings of a path item by splitting the path or
     * compound-path in each self-intersection and tracing the result.
     * If possible, the existing path / compound-path is modified if the
     * amount of resulting paths allows so, otherwise a new path /
     * compound-path is created, replacing the current one.
     *
     * @return {PathItem} the resulting path item
     */
    resolveCrossings: function resolveCrossings() {
      var children = this._children,
        // Support both path and compound-path items
        paths = children || [this];
      function hasOverlap(seg, path) {
        var inter = seg && seg._intersection;
        return inter && inter._overlap && inter._path === path;
      }

      // First collect all overlaps and crossings while taking note of the
      // existence of both.
      var hasOverlaps = false,
        hasCrossings = false,
        intersections = this.getIntersections(null, function (inter) {
          return inter.hasOverlap() && (hasOverlaps = true) || inter.isCrossing() && (hasCrossings = true);
        }),
        // We only need to keep track of curves that need clearing
        // outside of divideLocations() if two calls are necessary.
        clearCurves = hasOverlaps && hasCrossings && [];
      intersections = CurveLocation.expand(intersections);
      if (hasOverlaps) {
        // First divide in all overlaps, and then remove the inside of
        // the resulting overlap ranges.
        var overlaps = divideLocations(intersections, function (inter) {
          return inter.hasOverlap();
        }, clearCurves);
        for (var i = overlaps.length - 1; i >= 0; i--) {
          var overlap = overlaps[i],
            path = overlap._path,
            seg = overlap._segment,
            prev = seg.getPrevious(),
            next = seg.getNext();
          if (hasOverlap(prev, path) && hasOverlap(next, path)) {
            seg.remove();
            prev._handleOut._set(0, 0);
            next._handleIn._set(0, 0);
            // If the curve that is left has no length, remove it
            // altogether. Check for paths with only one segment
            // before removal, since `prev.getCurve() == null`.
            if (prev !== seg && !prev.getCurve().hasLength()) {
              // Transfer handleIn when removing segment:
              next._handleIn.set(prev._handleIn);
              prev.remove();
            }
          }
        }
      }
      if (hasCrossings) {
        // Divide any remaining intersections that are still part of
        // valid paths after the removal of overlaps.
        divideLocations(intersections, hasOverlaps && function (inter) {
          // Check both involved curves to see if they're still valid,
          // meaning they are still part of their paths.
          var curve1 = inter.getCurve(),
            seg1 = inter.getSegment(),
            // Do not call getCurve() and getSegment() on the other
            // intersection yet, as it too is in the intersections
            // array and will be divided later. But check if its
            // current curve is valid, as required by some rare edge
            // cases, related to intersections on the same curve.
            other = inter._intersection,
            curve2 = other._curve,
            seg2 = other._segment;
          if (curve1 && curve2 && curve1._path && curve2._path) return true;
          // Remove all intersections that were involved in the
          // handling of overlaps, to not confuse tracePaths().
          if (seg1) seg1._intersection = null;
          if (seg2) seg2._intersection = null;
        }, clearCurves);
        if (clearCurves) clearCurveHandles(clearCurves);
        // Finally resolve self-intersections through tracePaths()
        paths = tracePaths(Base.each(paths, function (path) {
          Base.push(this, path._segments);
        }, []));
      }
      // Determine how to return the paths: First try to recycle the
      // current path / compound-path, if the amount of paths does not
      // require a conversion.
      var length = paths.length,
        item;
      if (length > 1 && children) {
        if (paths !== children) this.setChildren(paths);
        item = this;
      } else if (length === 1 && !children) {
        if (paths[0] !== this) this.setSegments(paths[0].removeSegments());
        item = this;
      }
      // Otherwise create a new compound-path and see if we can reduce it,
      // and attempt to replace this item with it.
      if (!item) {
        item = new CompoundPath(Item.NO_INSERT);
        item.addChildren(paths);
        item = item.reduce();
        item.copyAttributes(this);
        this.replaceWith(item);
      }
      return item;
    },
    /**
     * Fixes the orientation of the sub-paths of a compound-path, assuming
     * that non of its sub-paths intersect, by reorienting them so that they
     * are of different winding direction than their containing paths,
     * except for disjoint sub-paths, i.e. islands, which are oriented so
     * that they have the same winding direction as the the biggest path.
     *
     * @param {Boolean} [nonZero=false] controls if the non-zero fill-rule
     *     is to be applied, by counting the winding of each nested path and
     *     discarding sub-paths that do not contribute to the final result
     * @param {Boolean} [clockwise] if provided, the orientation of the root
     *     paths will be set to the orientation specified by `clockwise`,
     *     otherwise the orientation of the largest root child is used.
     * @return {PathItem} a reference to the item itself, reoriented
     */
    reorient: function reorient(nonZero, clockwise) {
      var children = this._children;
      if (children && children.length) {
        this.setChildren(reorientPaths(this.removeChildren(), function (w) {
          // Handle both even-odd and non-zero rule.
          return !!(nonZero ? w : w & 1);
        }, clockwise));
      } else if (clockwise !== undefined) {
        this.setClockwise(clockwise);
      }
      return this;
    },
    /**
     * Returns a point that is guaranteed to be inside the path.
     *
     * @bean
     * @type Point
     */
    getInteriorPoint: function getInteriorPoint() {
      var bounds = this.getBounds(),
        point = bounds.getCenter(true);
      if (!this.contains(point)) {
        // Since there is no guarantee that a poly-bezier path contains
        // the center of its bounding rectangle, we shoot a ray in x
        // direction and select a point between the first consecutive
        // intersections of the ray on the left.
        var curves = this.getCurves(),
          y = point.y,
          intercepts = [],
          roots = [];
        // Process all y-monotone curves that intersect the ray at y:
        for (var i = 0, l = curves.length; i < l; i++) {
          var v = curves[i].getValues(),
            o0 = v[1],
            o1 = v[3],
            o2 = v[5],
            o3 = v[7];
          if (y >= min(o0, o1, o2, o3) && y <= max(o0, o1, o2, o3)) {
            var monoCurves = Curve.getMonoCurves(v);
            for (var j = 0, m = monoCurves.length; j < m; j++) {
              var mv = monoCurves[j],
                mo0 = mv[1],
                mo3 = mv[7];
              // Only handle curves that are not horizontal and
              // that can cross the point's ordinate.
              if (mo0 !== mo3 && (y >= mo0 && y <= mo3 || y >= mo3 && y <= mo0)) {
                var x = y === mo0 ? mv[0] : y === mo3 ? mv[6] : Curve.solveCubic(mv, 1, y, roots, 0, 1) === 1 ? Curve.getPoint(mv, roots[0]).x : (mv[0] + mv[6]) / 2;
                intercepts.push(x);
              }
            }
          }
        }
        if (intercepts.length > 1) {
          intercepts.sort(function (a, b) {
            return a - b;
          });
          point.x = (intercepts[0] + intercepts[1]) / 2;
        }
      }
      return point;
    }
  };
}());

// Monkey patch the paper.js boolean operations to account for issues with floating point math
// when large coordinate values are used (1000 is an empiric value that seems to work reliably)
// See https://github.com/paperjs/paper.js/issues/2082 for discussion
var funcs = ['unite', 'intersect', 'subtract', 'exclude', 'divide'];
var _loop = function _loop() {
  var func = _funcs[_i2];
  var original = _paper.PathItem.prototype[func];
  _paper.PathItem.prototype[func] = function () {
    var path = arguments[0],
      numericThreshold = 1000,
      // empiric
      b1 = this.getBounds(),
      b2 = path.getBounds(),
      l = Math.min(b1.x, b2.x),
      r = Math.max(b1.x + b1.width, b2.x + b2.width),
      t = Math.min(b1.y, b2.y),
      b = Math.max(b1.y + b1.height, b2.y + b2.height);
    if (l > -numericThreshold && r < numericThreshold && t > -numericThreshold && b < numericThreshold) {
      // Our bounds are within the limit: no need to translate or scale, just call the original function
      return original.apply(this, arguments);
    }
    // One or more of our bounds is out of range
    // Calculate whether we need to scale or just translate
    var w = r - l,
      h = b - t,
      scaleX = Math.pow(2, Math.ceil(Math.log2(w / (2 * numericThreshold)))),
      scaleY = Math.pow(2, Math.ceil(Math.log2(h / (2 * numericThreshold)))),
      scale = Math.max(scaleX, scaleY),
      center = new _paper.Point((l + r) / 2, (t + b) / 2),
      offset = new _paper.Point(-Math.round(center.x), -Math.round(center.y));
    if (scale > 1) {
      // we need to scale the path(s) to make them fit within our numeric bounds
      this.scale(1 / scale, center);
      if (path !== this) {
        path.scale(1 / scale, center);
      }
    }

    // translate the path(s) by the offset
    this.translate(offset);
    if (path !== this) {
      path.translate(offset);
    }
    var result = original.apply(this, arguments);

    // restore the path(s)
    this.translate(offset.multiply(-1));
    result.translate(offset.multiply(-1));
    if (path !== this) {
      path.translate(offset.multiply(-1));
    }
    if (scale > 1) {
      // reset the scale back to the original values
      this.scale(scale, center);
      result.scale(scale, center);
      if (path !== this) {
        path.scale(scale, center);
      }
    }
    return result;
  };
};
for (var _i2 = 0, _funcs = funcs; _i2 < _funcs.length; _i2++) {
  _loop();
}

// // Monkey patch paper.Curve.getTimeOf to reduce values very close to end points
// // See https://github.com/paperjs/paper.js/issues/2082 for discussion
_paper.Curve.getTimeOf = function (v, point) {
  // Before solving cubics, compare the beginning and end of the curve
  // with zero epsilon:
  var p0 = new _paper.Point(v[0], v[1]),
    p3 = new _paper.Point(v[6], v[7]),
    geomEpsilon = 1e-7,
    t = point.isClose(p0, geomEpsilon) ? 0 : point.isClose(p3, geomEpsilon) ? 1 : null;
  if (t === null) {
    // Solve the cubic for both x- and y-coordinates and consider all
    // solutions, testing with the larger / looser geometric epsilon.
    var coords = [point.x, point.y],
      roots = [];
    for (var c = 0; c < 2; c++) {
      var count = _paper.Curve.solveCubic(v, c, coords[c], roots, 0, 1);
      for (var i = 0; i < count; i++) {
        var u = roots[i];
        if (point.isClose(_paper.Curve.getPoint(v, u), geomEpsilon)) return u;
      }
    }
  }
  return t;
};
;// ./src/js/osd-extensions.mjs
function osd_extensions_construct(t, e, r) { if (osd_extensions_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && osd_extensions_setPrototypeOf(p, r.prototype), p; }
function osd_extensions_setPrototypeOf(t, e) { return osd_extensions_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, osd_extensions_setPrototypeOf(t, e); }
function osd_extensions_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (osd_extensions_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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




Object.defineProperty(osd.Viewer.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(osd.TiledImage.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(osd.Viewport.prototype, 'paperLayer', paperLayerDef());
Object.defineProperty(osd.TiledImage.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(osd.Viewer.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(osd.Viewport.prototype, '_paperLayerMap', paperLayerMapDef());
Object.defineProperty(osd.Viewer.prototype, 'paperItems', paperItemsDef());
Object.defineProperty(osd.TiledImage.prototype, 'paperItems', paperItemsDef());
Object.defineProperty(osd.Viewport.prototype, 'paperItems', paperItemsDef());
osd.Viewer.prototype._setupPaper = _setupPaper;
osd.Viewport.prototype._setupPaper = _setupPaperForViewport;
osd.TiledImage.prototype._setupPaper = _setupPaperForTiledImage;
osd.Viewer.prototype.addPaperItem = addPaperItem;
osd.Viewport.prototype.addPaperItem = addPaperItem;
osd.TiledImage.prototype.addPaperItem = addPaperItem;

/**
 * Creates a PaperOverlay for this viewer. See {@link PaperOverlay} for options.
 * @returns {PaperOverlay} The overlay that was created
 */
osd.Viewer.prototype.createPaperOverlay = function () {
  var overlay = osd_extensions_construct(PaperOverlay, [this].concat(Array.prototype.slice.call(arguments)));
  return overlay;
};

/**
 * Define the paperItems property for a tiledImage.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperItems.
 *   @returns {paper.Item[]} The array of paper item objects representing the items belonging to this TiledImage.
 */
function paperItemsDef() {
  return {
    get: function paperItems() {
      return this.paperLayer.children;
    }
  };
}

/**
 * @private
 */
function _createPaperLayer(osdObject, paperScope) {
  var layer = new _paper.Layer({
    applyMatrix: false
  });
  paperScope.project.addLayer(layer);
  osdObject._paperLayerMap.set(paperScope, layer);
  return layer;
}

/**
 * Define the paperLayer property for a tiledImage.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperGroup.
 *   @returns {paper.Layer} The group that serves as the parent of all paper items belonging to this TiledImage.
 */
function paperLayerDef() {
  return {
    get: function paperLayer() {
      var numScopes = this._paperLayerMap.size;
      if (numScopes === 1) {
        return this._paperLayerMap.values().next().value;
      } else if (numScopes === 0) {
        return null;
      } else {
        return this._paperLayerMap.get(_paper) || null;
      }
    }
  };
}
/**
 * Define the _paperLayerMap property for a tiledImage. Initializes the Map object the first time it is accessed.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for paperGroup.
 *   @returns {Map} The mapping from paper.Scope to the layer within the scope corresponding to this object
 */
function paperLayerMapDef() {
  return {
    get: function _paperLayerMap() {
      if (!this.__paperLayerMap) {
        this.__paperLayerMap = new Map();
      }
      return this.__paperLayerMap;
    }
  };
}

/**
 * @private
 * @returns {paper.Layer}
 */
function _setupPaper(overlay) {
  return _createPaperLayer(this, overlay.paperScope);
}

/**
 * @private
 * 
 */
function _setupPaperForTiledImage(overlay) {
  var _this = this;
  var layer = _setupPaper.call(this, overlay);
  var tiledImage = this;
  layer.tiledImage = tiledImage;
  function updateMatrix() {
    var degrees = _this.getRotation();
    var bounds = _this.getBoundsNoRotate();
    var matrix = new _paper.Matrix();
    matrix.rotate(degrees, (bounds.x + bounds.width / 2) * overlay.scaleFactor, (bounds.y + bounds.height / 2) * overlay.scaleFactor);
    matrix.translate({
      x: bounds.x * overlay.scaleFactor,
      y: bounds.y * overlay.scaleFactor
    });
    matrix.scale(bounds.width * overlay.scaleFactor / _this.source.width);
    layer.matrix.set(matrix);
  }
  tiledImage.addHandler('bounds-change', updateMatrix);
  overlay.addHandler('update-scale', updateMatrix);
  updateMatrix();
}

/**
 * @private
 * 
 */
function _setupPaperForViewport(overlay) {
  var layer = _setupPaper.call(this, overlay);
  layer.viewport = this;
  layer.matrix.scale(overlay.scaleFactor);
  function updateMatrix() {
    layer.matrix.reset();
    layer.matrix.scale(overlay.scaleFactor);
  }
  overlay.addHandler('update-scale', updateMatrix);
}

/**
 * @private
 */
function addPaperItem(item) {
  if (this.paperLayer) {
    this.paperLayer.addChild(item);
    item.applyRescale();
  } else {
    console.error('No layer has been set up in the active paper scope for this object. Does a scope need to be activated?');
  }
}
;// ./src/js/paper-overlay.mjs
function paper_overlay_typeof(o) { "@babel/helpers - typeof"; return paper_overlay_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, paper_overlay_typeof(o); }
function paper_overlay_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function paper_overlay_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, paper_overlay_toPropertyKey(o.key), o); } }
function paper_overlay_createClass(e, r, t) { return r && paper_overlay_defineProperties(e.prototype, r), t && paper_overlay_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function paper_overlay_toPropertyKey(t) { var i = paper_overlay_toPrimitive(t, "string"); return "symbol" == paper_overlay_typeof(i) ? i : i + ""; }
function paper_overlay_toPrimitive(t, r) { if ("object" != paper_overlay_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != paper_overlay_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function paper_overlay_callSuper(t, o, e) { return o = paper_overlay_getPrototypeOf(o), paper_overlay_possibleConstructorReturn(t, paper_overlay_isNativeReflectConstruct() ? Reflect.construct(o, e || [], paper_overlay_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function paper_overlay_possibleConstructorReturn(t, e) { if (e && ("object" == paper_overlay_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return paper_overlay_assertThisInitialized(t); }
function paper_overlay_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function paper_overlay_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (paper_overlay_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function paper_overlay_getPrototypeOf(t) { return paper_overlay_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, paper_overlay_getPrototypeOf(t); }
function paper_overlay_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && paper_overlay_setPrototypeOf(t, e); }
function paper_overlay_setPrototypeOf(t, e) { return paper_overlay_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, paper_overlay_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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






(function (OpenSeadragon) {
  if (typeof OpenSeadragon === 'undefined') {
    console.error('[paper-overlay.mjs] requires OpenSeadragon and paper.js');
    return;
  }
  if (typeof _paper === 'undefined') {
    console.error('[paper-overlay.mjs] requires OpenSeadragon and paper.js');
    return;
  }
  if (OpenSeadragon.Viewer.prototype.PaperOverlays) {
    console.warn('Cannot redefine Viewer.prototype.PaperOverlays');
    return;
  }
  Object.defineProperty(OpenSeadragon.Viewer.prototype, 'PaperOverlays', {
    get: function PaperOverlays() {
      return this._PaperOverlays || (this._PaperOverlays = []);
    }
  });
})(osd);

/********************************************************************************************** */

/********************************************************************************************** */

/**
 *
 * Represents a PaperOverlay associated with an OpenSeadragon Viewer.
 * A PaperOverlay is a Paper.js overlay that can be either synced to the zoomable image or fixed to the viewer.
 *
 * @class
 * @memberof OSDPaperjsAnnotation
 */
var PaperOverlay = /*#__PURE__*/function (_OpenSeadragon$EventS) {
  /**
  * Creates an instance of the PaperOverlay.
  * overlayType: 'image' to zoom/pan with the image(s), 'viewer' stay fixed.
  * @param {OpenSeadragon.Viewer} viewer - The viewer object.
  * @param {Object} opts - The options for the overlay.
  * @param {string} [opts.overlayType='image'] - "image" or "viewer". The type of overlay: 'image' to zoom/pan with the image(s), 'viewer' stay fixed.
  * @property {OpenSeadragon.Viewer} viewer - The OpenSeadragon viewer object.
  * @property {string} overlayType - "image" or "viewer"
  * @property {paper.Scope} paperScope - the paper.Scope object for this overlay
  */
  function PaperOverlay(viewer, opts) {
    var _this2;
    paper_overlay_classCallCheck(this, PaperOverlay);
    _this2 = paper_overlay_callSuper(this, PaperOverlay);
    var defaultOpts = {
      overlayType: 'image'
    };
    opts = osd.extend(true, defaultOpts, opts);
    _this2.viewer = viewer;
    _this2.overlayType = opts.overlayType;
    viewer.PaperOverlays.push(_this2);
    var ctr = counter();
    _this2._id = 'paper-overlay-canvas-' + ctr;
    _this2._containerWidth = 0;
    _this2._containerHeight = 0;
    _this2._canvasdiv = document.createElement('div');
    _this2._canvasdiv.setAttribute('id', 'paper-overlay-' + ctr);
    _this2._canvasdiv.classList.add('paper-overlay');
    _this2._canvasdiv.style.position = 'absolute';
    _this2._canvasdiv.style.left = "0px";
    _this2._canvasdiv.style.top = "0px";
    _this2._canvasdiv.style.width = '100%';
    _this2._canvasdiv.style.height = '100%';
    _this2._canvas = document.createElement('canvas');
    _this2._canvas.setAttribute('id', _this2._id);
    _this2._canvasdiv.appendChild(_this2._canvas);
    viewer.canvas.appendChild(_this2._canvasdiv);
    _this2._viewerButtons = [];
    _this2.paperScope = new _paper.PaperScope();
    _this2.paperScope.overlay = _this2;
    var ps = _this2.paperScope.setup(_this2._canvas);
    _this2.paperScope.project.overlay = _this2;
    _this2.ps = ps;
    _this2._paperProject = ps.project;
    _this2._resize();
    if (_this2.overlayType == 'image') {
      // set up the viewport and tiledImages to create pape.Layers for each
      _this2.viewer.viewport._setupPaper(_this2); // depends on _setupPaper defined in osd-extensions.mjs

      for (var i = 0; i < viewer.world.getItemCount(); ++i) {
        var item = _this2.viewer.world.getItemAt(i);
        _this2._setupTiledImage(item);
      }
      _this2.onAddItem = function (self) {
        return function (ev) {
          var tiledImage = ev.item;
          self._setupTiledImage(tiledImage);
        };
      }(_this2);
      _this2.onRemoveItem = function (self) {
        return function (ev) {
          var tiledImage = ev.item;
          self._removeTiledImage(tiledImage);
        };
      }(_this2);

      // add handlers so that new items added to the scene are set up and removed appropriately
      viewer.world.addHandler('add-item', _this2.onAddItem);
      viewer.world.addHandler('remove-item', _this2.onRemoveItem);
      _this2._updatePaperView();
    } else if (_this2.overlayType == 'viewer') {
      // set up the viewer with a paper.Layer
      _this2.viewer._setupPaper(_this2); // depends on _setupPaper defined in osd-extensions.mjs
    } else {
      console.error('Unrecognized overlay type: ' + _this2.overlayType);
    }

    // TODO changes these from members to variables
    _this2.onViewerDestroy = function (self) {
      return function () {
        self.destroy(true);
      };
    }(_this2);
    _this2.onViewportChange = function (self) {
      return function () {
        self._updatePaperView();
      };
    }(_this2);
    _this2.onViewerResetSize = function (self) {
      return function (ev) {
        //need to setTimeout to wait for some value (viewport.getZoom()?) to actually be updated before doing our update
        //need to check for destroyed because this will get called as part of the viewer destroy chain, and we've set the timeout
        setTimeout(function () {
          if (self.destroyed) {
            return;
          }
          self._resize();
          self._updatePaperView();
        });
      };
    }(_this2);
    _this2.onViewerResize = function (self) {
      return function () {
        self._resize();
        self.paperScope.view.emit('resize', {
          size: new _paper.Size(self._containerWidth, self._containerHeight)
        });
        self._updatePaperView();
      };
    }(_this2);
    _this2.onViewerRotate = function (self) {
      return function (ev) {
        //TODO: change from this to self; confirm nothing breaks
        this._pivot = ev.pivot || this._getCenter();
      };
    }(_this2);
    _this2.onViewerFlip = function (self) {
      return function (ev) {
        self.paperScope.view.setFlipped(ev.flipped, viewer.viewport.getRotation(true));
      };
    }(_this2);
    viewer.addHandler('resize', _this2.onViewerResize);
    viewer.addHandler('reset-size', _this2.onViewerResetSize);
    viewer.addHandler('viewport-change', _this2.onViewportChange);
    viewer.addHandler('rotate', _this2.onViewerRotate);
    viewer.addHandler('flip', _this2.onViewerFlip);
    viewer.addOnceHandler('destroy', _this2.onViewerDestroy);
    return _this2;
  }

  /**
   * The scale factor for the overlay. Equal to the pixel width of the viewer's drawing canvas
   */
  paper_overlay_inherits(PaperOverlay, _OpenSeadragon$EventS);
  return paper_overlay_createClass(PaperOverlay, [{
    key: "scaleFactor",
    get: function get() {
      this._currentScaleFactor = this._currentScaleFactor || this.viewer.drawer.canvas.clientWidth;
      return this._currentScaleFactor;
    }
    /**
     * Adds a button to the viewer. The button is created with the provided parameters.
     * @param {Object} params - The parameters for the button.
     * @param {string} params.tooltip - The tooltip text for the button.
     * @param {string} params.onClick - The function to be called when the button is clicked.
     * @param {string} params.faIconClass - Font Awesome icon classes for the button icon.
     * @returns {any} The button object.
     */
  }, {
    key: "addViewerButton",
    value: function addViewerButton() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var prefixUrl = this.viewer.prefixUrl;
      var button = new osd.Button({
        tooltip: params.tooltip,
        srcRest: prefixUrl + "button_rest.png",
        srcGroup: prefixUrl + "button_grouphover.png",
        srcHover: prefixUrl + "button_hover.png",
        srcDown: prefixUrl + "button_pressed.png",
        onClick: params.onClick
      });
      if (params.faIconClass) {
        var i = makeFaIcon(params.faIconClass);
        i.style = 'position:absolute;top:calc(50% - 4px);left:50%;transform:translate(-50%, -50%);color:#01010187;';
        button.element.appendChild(i);
      }
      this.viewer.buttonGroup.buttons.push(button);
      this.viewer.buttonGroup.element.appendChild(button.element);
      this._viewerButtons.push(button);
      return button;
    }
    /**
     * Brings the overlay to the front, making it appear on top of other overlays.
     * This method changes the z-index of the overlay to bring it forward.
     * The overlay will appear on top of any other overlays that are currently on the viewer.
     */
  }, {
    key: "bringToFront",
    value: function bringToFront() {
      var _this3 = this;
      this.viewer.PaperOverlays.splice(this.viewer.PaperOverlays.indexOf(this), 1);
      this.viewer.PaperOverlays.push(this);
      this.viewer.PaperOverlays.forEach(function (overlay) {
        return _this3.viewer.canvas.appendChild(overlay._canvasdiv);
      });
      this.paperScope.activate();
    }
    /**
     * Sends the overlay to the back, making it appear behind other overlays.
     * This method changes the z-index of the overlay to send it backward.
     * The overlay will appear behind any other overlays that are currently on the viewer.
     */
  }, {
    key: "sendToBack",
    value: function sendToBack() {
      var _this4 = this;
      this.viewer.PaperOverlays.splice(this.viewer.PaperOverlays.indexOf(this), 1);
      this.viewer.PaperOverlays.splice(0, 0, this);
      this.viewer.PaperOverlays.forEach(function (overlay) {
        return _this4.viewer.canvas.appendChild(overlay._canvasdiv);
      });
      this.viewer.PaperOverlays[this.viewer.PaperOverlays.length - 1].paperScope.activate();
    }
    /**
     * Destroys the overlay and removes it from the viewer.
     * This method cleans up the resources associated with the overlay and removes it from the viewer.
     *
     * @param {boolean} viewerDestroyed - Whether the viewer has been destroyed.
     * If `viewerDestroyed` is true, it indicates that the viewer itself is being destroyed, and this method
     * will not attempt to remove the overlay from the viewer, as it will be automatically removed during the viewer's cleanup process.
     */
  }, {
    key: "destroy",
    value: function destroy(viewerDestroyed) {
      this.destroyed = true;
      this._canvasdiv.remove();
      this.paperScope.project && this.paperScope.project.remove();
      this.ps && this.ps.remove();
      if (!viewerDestroyed) {
        this.viewer.removeHandler('viewport-change', this.onViewportChange);
        this.viewer.removeHandler('resize', this.onViewerResize);
        this.viewer.removeHandler('reset-size', this.onViewerResetSize);
        this.viewer.removeHandler('rotate', this.onViewerRotate);
        this.viewer.removeHandler('flip', this.onViewerFlip);
        this.viewer.world.removeHandler('add-item', this.onAddItem);
        this.viewer.world.removeHandler('remove-item', this.onRemoveItem);
        this.setOSDMouseNavEnabled(true);
        this._viewerButtons.forEach(function (button) {
          button.element.remove();
        });
        this._viewerButtons = [];
        this.viewer.PaperOverlays.splice(this.viewer.PaperOverlays.indexOf(this), 1);
        if (this.viewer.PaperOverlays.length > 0) {
          this.viewer.PaperOverlays[this.viewer.PaperOverlays.length - 1].paperScope.activate();
        }
      }
    }
    /**
     * Clears the overlay by removing all paper items from the overlay's Paper.js project.
     * This method removes all Paper.js items (such as paths, shapes, etc.) that have been added to the overlay.
     * After calling this method, the overlay will be empty, and any content that was previously drawn on it will be removed.
     */
  }, {
    key: "clear",
    value: function clear() {
      this.paperScope.project.clear();
    }
    // ----------
    /**
     * Gets the canvas element of the overlay.
     *
     * @returns {HTMLCanvasElement} The canvas element.
     */
  }, {
    key: "canvas",
    value: function canvas() {
      return this._canvas;
    }
    // ----------
    /**
     * This method allows you to add CSS classes to the canvas element of the overlay.
     * Adding classes can be useful for styling the overlay or associating specific styles with it.
     * 
     * @param {string} c - The class name to add to the canvas element.
     * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
     */
  }, {
    key: "addClass",
    value: function addClass(c) {
      var _this$_canvas$classLi;
      (_this$_canvas$classLi = this._canvas.classList).add.apply(_this$_canvas$classLi, arguments);
      return this;
    }
    /**
     * This method allows you to remove CSS classes from the canvas element of the overlay.
     * Removing classes can be useful for updating the overlay's appearance or changing its associated styles.
     * @param {string} c - The class name to remove from the canvas element.
     * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
     */
  }, {
    key: "removeClass",
    value: function removeClass(c) {
      var _this$_canvas$classLi2;
      (_this$_canvas$classLi2 = this._canvas.classList).remove.apply(_this$_canvas$classLi2, arguments);
      return this;
    }
    /**
     * This method allows you to set custom attributes on the canvas element of the overlay.
     * Setting attributes can be useful for additional customization or to store metadata related to the overlay.
     *
     * @param {string} attr - The name of the attribute to set on the canvas element.
     * @param {string} value - The value to set for the specified attribute.
     * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
     */
  }, {
    key: "setAttribute",
    value: function setAttribute(attr, value) {
      this._canvas.setAttribute(attr, value);
      return this;
    }
    /**
     * This method allows you to add custom event listeners to the canvas element of the overlay.
     * You can listen for various events, such as mouse clicks or custom events, and perform actions accordingly.
     *
     * @param {string} event - The name of the event to listen for on the canvas element.
     * @param {function} listener - The function to call when the specified event is triggered.
     * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(event, listener) {
      this._canvas.addEventListener(event, listener);
      return this;
    }
    /**
     * This method allows you to remove a previously added event listener from the canvas element of the overlay.
     * If the specified event and listener pair match an existing event listener, it will be removed.
     *
     * @param {string} event - The name of the event to stop listening for on the canvas element.
     * @param {function} listener - The function that was previously registered as the event listener.
     * @returns {PaperOverlay} The PaperOverlay object itself, allowing for method chaining.
     */
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event, listener) {
      this._canvas.removeEventListener(event, listener);
      return this;
    }
    // returns: mouseNavEnabled status BEFORE the call (for reverting)
    // raises 'mouse-nav-enabled' event
    /**
     * This method allows you to enable or disable mouse navigation in the viewer associated with the overlay.
     * Mouse navigation includes actions such as panning and zooming.
     * It returns a boolean value indicating whether mouse navigation was enabled before the method call.
     *
     * @param {boolean} enabled - Whether to enable or disable mouse navigation.
     * @returns {boolean} Whether mouse navigation was enabled before the call.
     */
  }, {
    key: "setOSDMouseNavEnabled",
    value: function setOSDMouseNavEnabled() {
      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var wasMouseNavEnabled = this.viewer.isMouseNavEnabled();
      this.viewer.setMouseNavEnabled(enabled);
      if (enabled !== wasMouseNavEnabled) {
        this.viewer.raiseEvent('mouse-nav-changed', {
          enabled: enabled,
          overlay: this
        });
      }
      return wasMouseNavEnabled;
    }
    // ----------
    /**
     * This method allows you to enable or disable automatic rescaling of items within the overlay
     * based on the zoom level of the OpenSeadragon viewer.
     * When enabled, items in the overlay will be rescaled automatically as the viewer's zoom level changes.
     *
     * @param {boolean} shouldHandle - Whether to enable or disable automatic rescaling.
     * @see {@link rescaleItems}
     */
  }, {
    key: "autoRescaleItems",
    value: function autoRescaleItems() {
      var shouldHandle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _this = this;
      this.ps.view.off('zoom-changed', _rescale);
      if (shouldHandle) this.ps.view.on('zoom-changed', _rescale);
      function _rescale() {
        _this.rescaleItems();
      }
    }
    //-----------
    /**
     * Rescales all items in the overlay according to the current zoom level of the viewer.
     * This method manually rescales all Paper.js items that have the `rescale` property set to a truthy value.
     * The rescaling is based on the current zoom level of the viewer, ensuring that the items maintain their relative size on the viewer.
     * @see {@link autoRescaleItems}
     */
  }, {
    key: "rescaleItems",
    value: function rescaleItems() {
      this._paperProject.getItems({
        match: function match(o) {
          return o.rescale;
        }
      }).forEach(function (item) {
        item.applyRescale();
      });
    }

    /**
     * Convert from paper coordinate frame to the pixel on the underlying canvas element
     */
  }, {
    key: "paperToCanvasCoordinates",
    value: function paperToCanvasCoordinates(x, y) {
      var point = new osd.Point(x, y).divide(this.scaleFactor);
      return this.viewer.viewport.viewportToViewerElementCoordinates(point);
    }

    /**
     * Gets the image data from the viewer.
     * @memberof OSDPaperjsAnnotation.PaperOverlay#
     * @function getImageData
     * @param {number} x - The x coordinate of the top left corner of the image data.
     * @param {number} y - The y coordinate of the top left corner of the image data.
     * @param {number} w - The width of the image data.
     * @param {number} h - The height of the image data.
     * @returns {ImageData} The image data.
     */
  }, {
    key: "getImageData",
    value: function getImageData(x, y, w, h) {
      x = x || 0;
      y = y || 0;
      w = w == undefined ? this.viewer.drawer.canvas.width : w;
      h = h == undefined ? this.viewer.drawer.canvas.height : h;

      // deal with flipping the x coordinate if needed
      if (this.ps.view.getFlipped()) {
        x = this.viewer.drawer.canvas.width - x - w;
      }
      return this.viewer.drawer.canvas.getContext('2d', {
        willReadFrequently: true
      }).getImageData(x, y, w, h);
    }

    /**
     * Gets a raster object representing the viewport.
     * @memberof OSDPaperjsAnnotation.PaperOverlay#
     * @function getViewportRaster
     * @param {boolean} withImageData - Whether to include image data in the raster object.
     * @returns {any} The raster object.
     */
  }, {
    key: "getViewportRaster",
    value: function getViewportRaster() {
      var withImageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var view = this.paperScope.view;
      //TO DO: make this query subregions of the viewport directly instead of always returning the entire thing

      var center = view.viewToProject(new _paper.Point(view.viewSize.width / 2, view.viewSize.height / 2));
      var rotation = -1 * this.viewer.viewport.getRotation();
      var rasterDef = {
        insert: false
      };
      if (withImageData) rasterDef.canvas = this.viewer.drawer.canvas;else rasterDef.size = new _paper.Size(this.viewer.drawer.canvas.width, this.viewer.drawer.canvas.height);
      var raster = new _paper.Raster(rasterDef);
      raster.position = center;
      raster.rotate(rotation);
      var scaleFactor = view.viewSize.width / view.getZoom() / this.viewer.drawer.canvas.width;
      raster.scale(scaleFactor);
      if (view.getFlipped()) {
        var angle = view.getRotation();
        raster.rotate(-angle);
        raster.scale(-1, 1);
        raster.rotate(angle);
      }
      return raster;
    }

    //------------

    /**
     * _setupTiledImage
     * Depends on TiledImage._setupPaper being installed by osd-extensions.mjs
     * @private
     */
  }, {
    key: "_setupTiledImage",
    value: function _setupTiledImage(tiledImage) {
      tiledImage._setupPaper(this);
    }
    /**
     * @private
     */
  }, {
    key: "_removeTiledImage",
    value: function _removeTiledImage(tiledImage) {
      var _tiledImage$_paperLay, _tiledImage$_paperLay2;
      (_tiledImage$_paperLay = tiledImage._paperLayerMap) === null || _tiledImage$_paperLay === void 0 || (_tiledImage$_paperLay = _tiledImage$_paperLay.get(this.paperScope)) === null || _tiledImage$_paperLay === void 0 || _tiledImage$_paperLay.remove();
      (_tiledImage$_paperLay2 = tiledImage._paperLayerMap) === null || _tiledImage$_paperLay2 === void 0 || _tiledImage$_paperLay2["delete"](this.paperScope);
    }

    /**
     * Resizes the overlay to match the size of the viewer container.
     * This method updates the dimensions of the overlay's canvas element to match the size of the viewer container.
     * If the viewer container's size changes (e.g., due to a browser window resize), you can call this method to keep the overlay in sync with the viewer size.
     * Additionally, this method updates the Paper.js view size to match the new canvas dimensions.
     * @private
     */
  }, {
    key: "_resize",
    value: function _resize() {
      var update = false;
      if (this._containerWidth !== this.viewer.container.clientWidth) {
        this._containerWidth = this.viewer.container.clientWidth;
        this._canvasdiv.setAttribute('width', this._containerWidth);
        this._canvas.setAttribute('width', this._containerWidth);
        update = true;
      }
      if (this._containerHeight !== this.viewer.container.clientHeight) {
        this._containerHeight = this.viewer.container.clientHeight;
        this._canvasdiv.setAttribute('height', this._containerHeight);
        this._canvas.setAttribute('height', this._containerHeight);
        update = true;
      }
      if (update) {
        var previousScaleFactor = this._currentScaleFactor;
        this._currentScaleFactor = this.viewer.drawer.canvas.clientWidth;
        if (previousScaleFactor !== this._currentScaleFactor) {
          this.raiseEvent('update-scale', {
            scaleFactor: this._currentScaleFactor
          });
        }
        this.paperScope.view.viewSize = new _paper.Size(this._containerWidth, this._containerHeight);
        this.paperScope.view.update();
      }
    }
    /**
     * Updates the Paper.js view to match the zoom and center of the OpenSeadragon viewer.
     * This method synchronizes the Paper.js view with the current zoom and center of the OpenSeadragon viewer.
     * When the viewer's zoom or center changes, this method should be called to ensure that the Paper.js view is updated accordingly.
     * @private
     */
  }, {
    key: "_updatePaperView",
    value: function _updatePaperView() {
      if (this.overlayType === 'viewer') {
        return;
      }
      var viewportZoom = this.viewer.viewport.getZoom(true);
      var oldZoom = this.paperScope.view.getZoom();
      this.paperScope.view.setZoom(this.viewer.viewport._containerInnerSize.x * viewportZoom / this.scaleFactor);
      var center = this._getCenter();
      this.viewer.drawer.canvas.pixelRatio = window.devicePixelRatio;
      this.paperScope.view.center = new _paper.Point(center.x, center.y).multiply(this.scaleFactor);
      var degrees = this.viewer.viewport.getRotation(true);
      var pivot = this._getPivot();
      this.paperScope.view.setRotation(degrees, pivot);
      var newZoom = this.paperScope.view.getZoom();
      if (Math.abs(newZoom - oldZoom) > 0.0000001) {
        this.paperScope.view.emit('zoom-changed', {
          zoom: newZoom
        });
      }
      this.paperScope.view.update();
    }
  }, {
    key: "_getPivot",
    value: function _getPivot() {
      if (!this._pivot) return;
      return this._pivot.multiply(this.scaleFactor);
    }
  }, {
    key: "_getCenter",
    value: function _getCenter() {
      return this.viewer.viewport.getCenter(true);
    }
  }]);
}(osd.EventSource);
;

var counter = function () {
  var i = 1;
  return function () {
    return i++;
  };
}();
;// ./src/js/paperitems/multipolygon.mjs
function multipolygon_typeof(o) { "@babel/helpers - typeof"; return multipolygon_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, multipolygon_typeof(o); }
function multipolygon_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function multipolygon_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, multipolygon_toPropertyKey(o.key), o); } }
function multipolygon_createClass(e, r, t) { return r && multipolygon_defineProperties(e.prototype, r), t && multipolygon_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function multipolygon_toPropertyKey(t) { var i = multipolygon_toPrimitive(t, "string"); return "symbol" == multipolygon_typeof(i) ? i : i + ""; }
function multipolygon_toPrimitive(t, r) { if ("object" != multipolygon_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != multipolygon_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function multipolygon_callSuper(t, o, e) { return o = multipolygon_getPrototypeOf(o), multipolygon_possibleConstructorReturn(t, multipolygon_isNativeReflectConstruct() ? Reflect.construct(o, e || [], multipolygon_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function multipolygon_possibleConstructorReturn(t, e) { if (e && ("object" == multipolygon_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return multipolygon_assertThisInitialized(t); }
function multipolygon_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function multipolygon_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (multipolygon_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function multipolygon_getPrototypeOf(t) { return multipolygon_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, multipolygon_getPrototypeOf(t); }
function multipolygon_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && multipolygon_setPrototypeOf(t, e); }
function multipolygon_setPrototypeOf(t, e) { return multipolygon_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, multipolygon_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a multi-polygon annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `MultiPolygon` class represents a multi-polygon annotation item. It inherits from the `AnnotationItem` class and provides methods to work with multi-polygon annotations.
 */
var MultiPolygon = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new MultiPolygon instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type is invalid.
   * @property {paper.CompoundPath} _paperItem - The associated paper item representing the multi-polygon.
   * @description This constructor initializes a new multi-polygon annotation item based on the provided GeoJSON object.
   */
  function MultiPolygon(geoJSON) {
    var _this;
    multipolygon_classCallCheck(this, MultiPolygon);
    _this = multipolygon_callSuper(this, MultiPolygon, [geoJSON]);
    if (!_this._supportsGeoJSONObj(geoJSON)) {
      var _geoJSON$geometry;
      error("Bad geoJSON object: geometry type ".concat((_geoJSON$geometry = geoJSON.geometry) === null || _geoJSON$geometry === void 0 ? void 0 : _geoJSON$geometry.type, " is not supported by this factory."));
    }
    // GeoJSON Polygons are arrays of arrays of points. The first is the external linear ring, while the rest are internal "hole" linear rings.
    // GeoJSON MultiPolygons are arrays of Polygons.
    // For type==MultiPolygon, flatten the outer array
    var linearRings;
    if (geoJSON.geometry.type.toLowerCase() === 'multipolygon') {
      linearRings = geoJSON.geometry.coordinates.flat();
    } else {
      linearRings = geoJSON.geometry.coordinates;
    }
    var paths = linearRings.map(function (points) {
      var pts = points.map(function (point) {
        return new _paper.Point(point[0], point[1]);
      });
      return new _paper.Path(pts);
    });
    var poly = new _paper.CompoundPath({
      children: paths,
      fillRule: 'evenodd',
      closed: true
    });
    poly = poly.replaceWith(poly.unite(poly).toCompoundPath());
    poly.canBeBoundingElement = true;
    _this.paperItem = poly;
    return _this;
  }

  /**
   * Retrieves the supported types by the Ellipse annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  multipolygon_inherits(MultiPolygon, _AnnotationItem);
  return multipolygon_createClass(MultiPolygon, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type in ['MultiPolygon', 'Polygon']`
     */
    function getGeoJSONType() {
      var polygons = this.paperItem.children.filter(function (c) {
        return c.area > 0 && c.segments.length > 2;
      });
      var type = polygons.length > 1 ? 'MultiPolygon' : 'Polygon';
      return {
        type: type
      };
    }

    /**
     * Retrieves the coordinates of the multi-polygon.
     * @returns {Array} An array of arrays representing the coordinates of the polygons and holes.
     * @description This method returns an array of arrays representing the coordinates of the polygons and their holes in the multi-polygon.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      //filter out invalid children with less than 3 points
      var polygons = this.paperItem.children.filter(function (c) {
        return c.area > 0 && c.segments.length > 2;
      });
      var holes = this.paperItem.children.filter(function (c) {
        return c.area <= 0 && c.segments.length > 2;
      });
      var out = polygons.map(function (p) {
        return [p.segments.map(function (s) {
          return [s.point.x, s.point.y];
        })].concat(holes.filter(function (h) {
          return p.contains(h.segments[0].point);
        }).map(function (h) {
          return h.segments.map(function (s) {
            return [s.point.x, s.point.y];
          });
        }));
      });
      //Close each polygon by making the first point equal to the last (if needed)
      out.forEach(function (polylist) {
        polylist.forEach(function (array) {
          var first = array[0];
          var last = array.slice(-1)[0];
          if (first[0] !== last[0] || first[1] !== last[1]) {
            array.push([first[0], first[1]]);
          }
        });
      });
      if (out.length === 1) {
        out = out[0]; // unwrap the first element for type===Polygon
      }
      return out;
    }
    /**
     * Retrieves the properties of the multi-polygon.
     * @returns {undefined}
     * @description This method returns `undefined` since the MultiPolygon class does not have specific properties.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      return;
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type) {
      var subtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return ['polygon', 'multipolygon'].includes(type.toLowerCase()) && subtype === null;
    }
  }]);
}(AnnotationItem);

;// ./src/js/paperitems/linestring.mjs
function paperitems_linestring_typeof(o) { "@babel/helpers - typeof"; return paperitems_linestring_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, paperitems_linestring_typeof(o); }
function paperitems_linestring_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function paperitems_linestring_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, paperitems_linestring_toPropertyKey(o.key), o); } }
function paperitems_linestring_createClass(e, r, t) { return r && paperitems_linestring_defineProperties(e.prototype, r), t && paperitems_linestring_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function paperitems_linestring_toPropertyKey(t) { var i = paperitems_linestring_toPrimitive(t, "string"); return "symbol" == paperitems_linestring_typeof(i) ? i : i + ""; }
function paperitems_linestring_toPrimitive(t, r) { if ("object" != paperitems_linestring_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != paperitems_linestring_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function paperitems_linestring_callSuper(t, o, e) { return o = paperitems_linestring_getPrototypeOf(o), paperitems_linestring_possibleConstructorReturn(t, paperitems_linestring_isNativeReflectConstruct() ? Reflect.construct(o, e || [], paperitems_linestring_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function paperitems_linestring_possibleConstructorReturn(t, e) { if (e && ("object" == paperitems_linestring_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return paperitems_linestring_assertThisInitialized(t); }
function paperitems_linestring_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function paperitems_linestring_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (paperitems_linestring_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function paperitems_linestring_getPrototypeOf(t) { return paperitems_linestring_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, paperitems_linestring_getPrototypeOf(t); }
function paperitems_linestring_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && paperitems_linestring_setPrototypeOf(t, e); }
function paperitems_linestring_setPrototypeOf(t, e) { return paperitems_linestring_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, paperitems_linestring_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a linestring annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Linestring` class represents a linestring annotation item. It inherits from the `AnnotationItem` class and provides methods to work with linestring annotations.
 */
var Linestring = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Linestring instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type is invalid.
   * @property {paper.Group} _paperItem - The associated paper item representing the linestring.
   * @description This constructor initializes a new linestring annotation item based on the provided GeoJSON object.
   */
  function Linestring(geoJSON) {
    var _this;
    paperitems_linestring_classCallCheck(this, Linestring);
    _this = paperitems_linestring_callSuper(this, Linestring, [geoJSON]);
    if (geoJSON.geometry.type !== 'LineString') {
      error('Bad geoJSON object: type !=="LineString"');
    }
    var coords = geoJSON.geometry.coordinates; //array of points
    var pts = coords.map(function (point) {
      return new _paper.Point(point[0], point[1]);
    });
    var grp = new _paper.Group({
      children: [new _paper.Path(pts)]
    });
    // grp.config = geoJSON;
    // grp.config.properties.rescale && (delete grp.config.properties.rescale.strokeWidth);

    grp.fillColor = null;
    _this.paperItem = grp;
    return _this;
  }

  /**
   * Retrieves the supported types by the Linestring annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  paperitems_linestring_inherits(Linestring, _AnnotationItem);
  return paperitems_linestring_createClass(Linestring, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Linestring'`
     */
    function getGeoJSONType() {
      return {
        type: 'Linestring'
      };
    }
    /**
    * Retrieves the coordinates of the linestring.
    * @returns {Array} An array of arrays containing x and y coordinates of each point.
    * @description This method returns an array of arrays representing the coordinates of each point in the linestring.
    */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      return item.children.map(function (c) {
        return c.segments.map(function (s) {
          return [s.point.x, s.point.y];
        });
      });
    }
    /**
     * Retrieves the style properties of the linestring.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the linestring in JSON format.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      return {
        strokeWidths: item.children.map(function (c) {
          return c.strokeWidth;
        })
      };
    }
    /**
     * Sets the style properties of the linestring.
     * @param {Object} properties - The style properties to set.
     * @description This method sets the style properties of the linestring using the provided properties object.
     */
  }, {
    key: "setStyle",
    value: function setStyle(properties) {
      Object.assign({}, properties);
      if (properties.rescale) {
        delete properties.rescale['strokeWidth'];
      }
      this._paperItem.style.set(properties);
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type) {
      var subtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return type.toLowerCase() === 'linestring' && subtype === null;
    }
  }]);
}(AnnotationItem);

;// ./src/js/paperitems/multilinestring.mjs
function multilinestring_typeof(o) { "@babel/helpers - typeof"; return multilinestring_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, multilinestring_typeof(o); }
function multilinestring_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function multilinestring_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, multilinestring_toPropertyKey(o.key), o); } }
function multilinestring_createClass(e, r, t) { return r && multilinestring_defineProperties(e.prototype, r), t && multilinestring_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function multilinestring_toPropertyKey(t) { var i = multilinestring_toPrimitive(t, "string"); return "symbol" == multilinestring_typeof(i) ? i : i + ""; }
function multilinestring_toPrimitive(t, r) { if ("object" != multilinestring_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != multilinestring_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function multilinestring_callSuper(t, o, e) { return o = multilinestring_getPrototypeOf(o), multilinestring_possibleConstructorReturn(t, multilinestring_isNativeReflectConstruct() ? Reflect.construct(o, e || [], multilinestring_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function multilinestring_possibleConstructorReturn(t, e) { if (e && ("object" == multilinestring_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return multilinestring_assertThisInitialized(t); }
function multilinestring_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function multilinestring_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (multilinestring_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function multilinestring_getPrototypeOf(t) { return multilinestring_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, multilinestring_getPrototypeOf(t); }
function multilinestring_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && multilinestring_setPrototypeOf(t, e); }
function multilinestring_setPrototypeOf(t, e) { return multilinestring_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, multilinestring_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a multi-linestring annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `MultiLinestring` class represents a multi-linestring annotation item. It inherits from the `AnnotationItem` class and provides methods to work with multi-linestring annotations.
 */
var MultiLinestring = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new MultiLinestring instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type is invalid.
   * @property {paper.Group} _paperItem - The associated paper item representing the multi-linestring.
   * @description This constructor initializes a new multi-linestring annotation item based on the provided GeoJSON object.
   */
  function MultiLinestring(geoJSON) {
    var _this;
    multilinestring_classCallCheck(this, MultiLinestring);
    _this = multilinestring_callSuper(this, MultiLinestring, [geoJSON]);
    if (geoJSON.geometry.type !== 'MultiLineString') {
      error('Bad geoJSON object: type !=="MultiLineString"');
    }
    var coords = geoJSON.geometry.coordinates; //array of points
    var paths = coords.map(function (points, index) {
      var pts = points.map(function (point) {
        return new _paper.Point(point[0], point[1]);
      });
      var path = new _paper.Path(pts);
      path.strokeWidth = geoJSON.geometry.properties.strokeWidths[index];
      return new _paper.Path(pts);
    });
    var grp = new _paper.Group({
      children: paths
    });
    grp.fillColor = null;
    _this.paperItem = grp;
    return _this;
  }

  /**
   * Retrieves the supported types by the MultiLineString annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  multilinestring_inherits(MultiLinestring, _AnnotationItem);
  return multilinestring_createClass(MultiLinestring, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'MultiLineString'`
     */
    function getGeoJSONType() {
      return {
        type: 'MultiLineString'
      };
    }

    /**
     * Retrieves the coordinates of the multi-linestring.
     * @returns {Array} An array containing arrays of x and y coordinates for each point.
     * @description This method returns an array of arrays representing the coordinates of each point in the multi-linestring.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      return item.children.map(function (c) {
        return c.segments.map(function (s) {
          return [s.point.x, s.point.y];
        });
      });
    }
    /**
     * Retrieves the properties of the multi-linestring.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the multi-linestring, including stroke color and widths.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      return {
        strokeColor: item.children.length > 0 ? item.children[0].strokeColor : undefined,
        strokeWidths: item.children.map(function (c) {
          return c.strokeWidth;
        })
      };
    }
    /**
     * Retrieves the style properties of the multi-linestring.
     * @returns {Object} The style properties in JSON format.
     * @description This method returns the style properties of the multi-linestring in JSON format.
     */
  }, {
    key: "getStyleProperties",
    value: function getStyleProperties() {
      return this.paperItem.children[0].style.toJSON();
    }
    /**
     * Apply style properties to the multi-linestring annotation item.
     * @param {Object} properties - The style properties to set.
     * @description This method applies the provided style properties to the multi-linestring annotation item.
     */
  }, {
    key: "setStyle",
    value: function setStyle(properties) {
      Object.assign({}, properties);
      if (properties.rescale) {
        delete properties.rescale['strokeWidth'];
      }
      this._paperItem.style.set(properties);
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type) {
      var subtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return type.toLowerCase() === 'multilinestring' && subtype === null;
    }
  }]);
}(AnnotationItem);

;// ./src/js/paperitems/raster.mjs
function paperitems_raster_typeof(o) { "@babel/helpers - typeof"; return paperitems_raster_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, paperitems_raster_typeof(o); }
function paperitems_raster_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function paperitems_raster_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, paperitems_raster_toPropertyKey(o.key), o); } }
function paperitems_raster_createClass(e, r, t) { return r && paperitems_raster_defineProperties(e.prototype, r), t && paperitems_raster_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function paperitems_raster_toPropertyKey(t) { var i = paperitems_raster_toPrimitive(t, "string"); return "symbol" == paperitems_raster_typeof(i) ? i : i + ""; }
function paperitems_raster_toPrimitive(t, r) { if ("object" != paperitems_raster_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != paperitems_raster_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function paperitems_raster_callSuper(t, o, e) { return o = paperitems_raster_getPrototypeOf(o), paperitems_raster_possibleConstructorReturn(t, paperitems_raster_isNativeReflectConstruct() ? Reflect.construct(o, e || [], paperitems_raster_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function paperitems_raster_possibleConstructorReturn(t, e) { if (e && ("object" == paperitems_raster_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return paperitems_raster_assertThisInitialized(t); }
function paperitems_raster_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function paperitems_raster_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (paperitems_raster_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function paperitems_raster_getPrototypeOf(t) { return paperitems_raster_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, paperitems_raster_getPrototypeOf(t); }
function paperitems_raster_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && paperitems_raster_setPrototypeOf(t, e); }
function paperitems_raster_setPrototypeOf(t, e) { return paperitems_raster_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, paperitems_raster_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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




/*
 * Raster - contains pixel data for a rectangular region, with an optional clip mask
 * pseudo-GeoJSON definition:
 * {
 *   type: Feature
 *   geometry:{
 *     type: GeometryCollection,
 *     properties:{
 *       subtype: Raster,
 *       raster: {
 *          data: [Raster data],
 *          width: width of raster image,
 *          height: height of raster image,
 *          center: center of raster object [x, y],
 *          scaling: scaling applied to raster object [x, y],
 *          rotation: rotation applied to raster object,
 *       },
 *       transform: matrix
 *     }
 *     geometries:[ Array of GeoJSON Geometry objects ],
 *   }
 * 
 **/

/**
 * Represents a raster annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Raster` class represents a raster annotation item. It inherits from the `AnnotationItem` class and provides methods to work with raster annotations.
 */
var Raster = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Raster instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
   * @property {paper.Group} _paperItem - The associated paper item representing the raster.
   * @description This constructor initializes a new raster annotation item based on the provided GeoJSON object.
   */
  function Raster(geoJSON) {
    var _this;
    paperitems_raster_classCallCheck(this, Raster);
    _this = paperitems_raster_callSuper(this, Raster, [geoJSON]);
    if (geoJSON.geometry.type !== 'GeometryCollection' || geoJSON.geometry.properties.subtype !== 'Raster') {
      error('Bad geoJSON object: type !=="GeometryCollection" or subtype !=="Raster"');
    }

    //handle composition by geoJSON definition or by pre-constructed paper items
    var inputRaster = geoJSON.geometry.properties.raster;
    var inputClip = geoJSON.geometry.geometries;
    if (!inputRaster) {
      error('Bad input: geometry.properties.raster must hold raster data, or a paper.Raster object');
    }
    var raster;
    if (inputRaster.data instanceof _paper.Raster) {
      raster = inputRaster.data;
    } else {
      raster = new _paper.Raster(inputRaster.data);
      raster.translate(inputRaster.center[0], inputRaster.center[1]);
      raster.scale(inputRaster.scaling[0], inputRaster.scaling[1]);
      raster.rotate(inputRaster.rotation);
    }
    _this._rasterSelectedColor = new _paper.Color(0, 0, 0, 0);
    raster.selectedColor = _this._rasterSelectedColor;
    var grp = new _paper.Group([raster]);
    grp.updateFillOpacity = function () {
      _paper.Group.prototype.updateFillOpacity.call(this);
      raster.opacity = this.opacity * this._computedFillOpacity;
      if (grp.clipped) {
        grp.children[0].fillColor = null;
      }
    };
    if (inputClip.length > 0) {
      var clipGroup = new _paper.Group();
      grp.insertChild(0, clipGroup);
      grp.clipped = true; //do this after adding the items, so the stroke style is deleted
      inputClip.forEach(function (i) {
        var item = i instanceof _paper.Item ? _paper.Item.fromAnnotationItem(i) : _paper.Item.fromGeoJSON(i);
        delete item.isGeoJSONFeature; //so it doesn't trigger event handlers about new features being added/moved/removed
        item._annotationItem = item.annotationItem; //rename to private property
        delete item.annotationItem; //so it isn't found by descendants query
        setTimeout(function () {
          return item.strokeColor = (i.properties || i).strokeColor;
        });
        item.strokeWidth = (i.properties || i).strokeWidth;
        item.rescale = (i.properties || i).rescale;
        clipGroup.addChild(item);
      });
    }
    if (geoJSON.geometry.properties.transform) {
      grp.matrix = new _paper.Matrix(geoJSON.geometry.properties.transform);
    }
    grp.on('selected', function () {
      grp.clipped && (grp.children[0].selected = false);
    });
    _this.paperItem = grp;
    return _this;
  }

  /**
   * Retrieves the supported types by the Raster annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  paperitems_raster_inherits(Raster, _AnnotationItem);
  return paperitems_raster_createClass(Raster, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'GeometryCollection'` and `subtype === 'Raster'`
     */
    function getGeoJSONType() {
      return {
        type: 'GeometryCollection',
        subtype: 'Raster'
      };
    }

    /**
     * Convert the raster annotation to a GeoJSON geometry.
     * @returns {Object} The GeoJSON representation of the raster annotation.
     */
  }, {
    key: "toGeoJSONGeometry",
    value: function toGeoJSONGeometry() {
      var item = this.paperItem;
      var clipGroup = item.children[0];
      var raster = item.children[1];
      var geom = {
        type: 'GeometryCollection',
        properties: {
          subtype: 'Raster',
          raster: {
            data: raster.toDataURL(),
            center: [raster.bounds.center.x, raster.bounds.center.y],
            width: raster.width,
            height: raster.height,
            scaling: [raster.matrix.scaling.x, raster.matrix.scaling.y],
            rotation: raster.matrix.rotation
          },
          transform: item.matrix.values
        },
        geometries: clipGroup.children.map(function (item) {
          var feature = item._annotationItem.toGeoJSONFeature();
          var geometry = feature.geometry;
          if (!geometry.properties) {
            geometry.properties = {};
          }
          geometry.properties.strokeColor = feature.properties.strokeColor;
          geometry.properties.strokeWidth = feature.properties.strokeWidth;
          geometry.properties.rescale = feature.properties.rescale;
          return geometry;
        })
      };
      return geom;
    }
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type, subtype) {
      return type.toLowerCase() === 'geometrycollection' && (subtype === null || subtype === void 0 ? void 0 : subtype.toLowerCase()) === 'raster';
    }
  }]);
}(AnnotationItem);

;// ./src/js/paperitems/rectangle.mjs
function paperitems_rectangle_typeof(o) { "@babel/helpers - typeof"; return paperitems_rectangle_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, paperitems_rectangle_typeof(o); }
function paperitems_rectangle_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function paperitems_rectangle_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, paperitems_rectangle_toPropertyKey(o.key), o); } }
function paperitems_rectangle_createClass(e, r, t) { return r && paperitems_rectangle_defineProperties(e.prototype, r), t && paperitems_rectangle_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function paperitems_rectangle_toPropertyKey(t) { var i = paperitems_rectangle_toPrimitive(t, "string"); return "symbol" == paperitems_rectangle_typeof(i) ? i : i + ""; }
function paperitems_rectangle_toPrimitive(t, r) { if ("object" != paperitems_rectangle_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != paperitems_rectangle_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function paperitems_rectangle_callSuper(t, o, e) { return o = paperitems_rectangle_getPrototypeOf(o), paperitems_rectangle_possibleConstructorReturn(t, paperitems_rectangle_isNativeReflectConstruct() ? Reflect.construct(o, e || [], paperitems_rectangle_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function paperitems_rectangle_possibleConstructorReturn(t, e) { if (e && ("object" == paperitems_rectangle_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return paperitems_rectangle_assertThisInitialized(t); }
function paperitems_rectangle_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function paperitems_rectangle_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (paperitems_rectangle_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function paperitems_rectangle_getPrototypeOf(t) { return paperitems_rectangle_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, paperitems_rectangle_getPrototypeOf(t); }
function paperitems_rectangle_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && paperitems_rectangle_setPrototypeOf(t, e); }
function paperitems_rectangle_setPrototypeOf(t, e) { return paperitems_rectangle_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, paperitems_rectangle_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents a rectangle annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Rectangle` class represents a rectangle annotation item. It inherits from the `AnnotationItem` class and provides methods to work with rectangle annotations.
 */
var Rectangle = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Rectangle instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
   * @property {paper.CompoundPath} _paperItem - The associated paper item representing the rectangle.
   * @description This constructor initializes a new rectangle annotation item based on the provided GeoJSON object.
   */
  function Rectangle(geoJSON) {
    var _this;
    paperitems_rectangle_classCallCheck(this, Rectangle);
    _this = paperitems_rectangle_callSuper(this, Rectangle, [geoJSON]);
    if (geoJSON.geometry.type !== 'Point' || geoJSON.geometry.properties.subtype !== 'Rectangle') {
      error('Bad geoJSON object: type !=="Point" or subtype !=="Rectangle"');
    }
    var poly = new _paper.CompoundPath({
      children: [],
      fillRule: 'evenodd'
    });
    if (geoJSON.geometry.coordinates.length > 1) {
      var center = geoJSON.geometry.coordinates.slice(0, 2);
      var x = center[0] || 0;
      var y = center[1] || 0;
      var props = geoJSON.geometry.properties;
      var w = props.width || 0;
      var h = props.height || 0;
      var degrees = props.angle || 0;
      var corners = [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]; //array of array of points
      var pts = corners.map(function (point) {
        return new _paper.Point(point[0], point[1]);
      });
      var path = new _paper.Path(pts);
      poly.addChild(path);
      poly.closed = true;
      poly.rotate(degrees);
    }
    poly.canBeBoundingElement = true;
    _this.paperItem = poly;
    return _this;
  }

  /**
   * Retrieves the supported types by the Rectangle annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  paperitems_rectangle_inherits(Rectangle, _AnnotationItem);
  return paperitems_rectangle_createClass(Rectangle, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'Rectangle'`
     */
    function getGeoJSONType() {
      return {
        type: 'Point',
        subtype: 'Rectangle'
      };
    }

    /**
     * Retrieves the coordinates of the rectangle.
     * @returns {Array} An array containing the x and y coordinates of the rectangle.
     * @description This method returns an array containing the x and y coordinates of the rectangle.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      return [item.position.x, item.position.y];
    }
    /**
     * Retrieves the properties of the rectangle.
     * @returns {Object} An object containing the width, height, and angle of the rectangle.
     * @description This method returns an object containing the width, height, and angle properties of the rectangle.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      var path = item.children[0];
      var points = path.segments.map(function (s) {
        return s.point;
      });
      var top = points[1].subtract(points[0]);
      var left = points[0].subtract(points[3]);
      var w = top.length;
      var h = left.length;
      var angle = top.angleInDegrees;
      return {
        width: w,
        height: h,
        angle: angle
      };
    }

    /**
     * Perform transformation on the rectangle.
     * @static
     * @param {string} operation - The transformation operation to perform (rotate or scale).
     * @param {*} arguments - The arguments specific to the operation.
     * @description This static method performs transformation on the rectangle based on the specified operation and arguments.
     */
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type, subtype) {
      return type.toLowerCase() === 'point' && (subtype === null || subtype === void 0 ? void 0 : subtype.toLowerCase()) === 'rectangle';
    }
  }, {
    key: "onTransform",
    value: function onTransform() {
      var _this2 = this;
      var operation = arguments[0];
      switch (operation) {
        case 'scale':
          {
            var p = this.layer.matrix.inverseTransform(arguments[1]); //reference position
            var r = arguments[2]; //rotation
            var m = arguments[3]; //matrix

            this.matrix.append(m.inverted()); //undo previous default operation that was already applied

            //scale the midpoints of each edge of the rectangle per the transform operation
            //while projecting the operation onto the normal vector, to maintain rectanglar shape 
            var segments = this.children[0].segments;
            segments.map(function (s, i) {
              var c = s.point.transform(_this2.matrix); // first corner
              var s2 = segments[(i + 1) % 4]; // next segment
              var c2 = s2.point.transform(_this2.matrix); // next corner
              var vec = c2.subtract(c).divide(2); // vector from c to midpoint
              var mp = c.add(vec); // midpoint of the side

              mp.normal = vec.rotate(-90).normalize(); // normal vector for this side of the rectangle
              mp.segments = [s, s2]; // keep track of which segments are on each end of this side
              return mp;
            }).forEach(function (midpoint) {
              // now adjust each corner position to keep the sides of the rect parallel to their previous orientation
              var a = midpoint.subtract(p);
              var ar = a.rotate(-r);
              var br = ar.multiply(m.scaling);
              var b = br.rotate(r);
              var delta = b.subtract(a);
              var proj = delta.project(midpoint.normal);
              midpoint.segments.forEach(function (s) {
                var pt = s.point.transform(_this2.matrix).add(proj);
                s.point = _this2.matrix.inverseTransform(pt);
              });
            });
            break;
          }
      }
    }
  }]);
}(AnnotationItem);

;// ./src/js/paperitems/ellipse.mjs
function paperitems_ellipse_typeof(o) { "@babel/helpers - typeof"; return paperitems_ellipse_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, paperitems_ellipse_typeof(o); }
function paperitems_ellipse_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function paperitems_ellipse_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, paperitems_ellipse_toPropertyKey(o.key), o); } }
function paperitems_ellipse_createClass(e, r, t) { return r && paperitems_ellipse_defineProperties(e.prototype, r), t && paperitems_ellipse_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function paperitems_ellipse_toPropertyKey(t) { var i = paperitems_ellipse_toPrimitive(t, "string"); return "symbol" == paperitems_ellipse_typeof(i) ? i : i + ""; }
function paperitems_ellipse_toPrimitive(t, r) { if ("object" != paperitems_ellipse_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != paperitems_ellipse_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function paperitems_ellipse_callSuper(t, o, e) { return o = paperitems_ellipse_getPrototypeOf(o), paperitems_ellipse_possibleConstructorReturn(t, paperitems_ellipse_isNativeReflectConstruct() ? Reflect.construct(o, e || [], paperitems_ellipse_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function paperitems_ellipse_possibleConstructorReturn(t, e) { if (e && ("object" == paperitems_ellipse_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return paperitems_ellipse_assertThisInitialized(t); }
function paperitems_ellipse_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function paperitems_ellipse_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (paperitems_ellipse_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function paperitems_ellipse_getPrototypeOf(t) { return paperitems_ellipse_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, paperitems_ellipse_getPrototypeOf(t); }
function paperitems_ellipse_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && paperitems_ellipse_setPrototypeOf(t, e); }
function paperitems_ellipse_setPrototypeOf(t, e) { return paperitems_ellipse_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, paperitems_ellipse_setPrototypeOf(t, e); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * Represents an ellipse annotation item.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends AnnotationItem
 * @description The `Ellipse` class represents an ellipse annotation item. It inherits from the `AnnotationItem` class and provides methods to work with ellipse annotations.
 */
var Ellipse = /*#__PURE__*/function (_AnnotationItem) {
  /**
   * Create a new Ellipse instance.
   * @param {Object} geoJSON - The GeoJSON object containing annotation data.
   * @throws {string} Throws an error if the GeoJSON type or subtype is invalid.
   * @property {paper.CompoundPath} _paperItem - The associated paper item representing the ellipse.
   * @description This constructor initializes a new ellipse annotation item based on the provided GeoJSON object.
   */
  function Ellipse(geoJSON) {
    var _this;
    paperitems_ellipse_classCallCheck(this, Ellipse);
    _this = paperitems_ellipse_callSuper(this, Ellipse, [geoJSON]);
    if (geoJSON.geometry.type !== 'Point' || geoJSON.geometry.properties.subtype !== 'Ellipse') {
      error('Bad geoJSON object: type !=="Point" or subtype !=="Rectangle"');
    }
    var poly = new _paper.CompoundPath({
      children: [],
      fillRule: 'evenodd'
    });
    if (geoJSON.geometry.coordinates.length > 1) {
      var center = geoJSON.geometry.coordinates.slice(0, 2);
      var x = center[0] || 0;
      var y = center[1] || 0;
      var props = geoJSON.geometry.properties;
      var a = props.majorRadius || 0;
      var b = props.minorRadius || 0;
      var degrees = props.angle || 0;
      var ellipse = new _paper.Path.Ellipse({
        center: new _paper.Point(x, y),
        radius: new _paper.Size(a, b)
      });
      poly.addChild(ellipse);
      poly.rotate(degrees);
    }
    poly.canBeBoundingElement = true;
    _this.paperItem = poly;
    return _this;
  }
  /**
   * Retrieves the supported types by the Ellipse annotation item.
   * @static
   * @param { String } type
   * @param { String } [subtype]
   * @returns {Boolean} Whether this constructor supports the requested type/subtype
   */
  paperitems_ellipse_inherits(Ellipse, _AnnotationItem);
  return paperitems_ellipse_createClass(Ellipse, [{
    key: "getGeoJSONType",
    value:
    /**
     * Get the type of this object.
     * @returns { Object } with fields `type === 'Point'` and `subtype === 'Ellipse'`
     */
    function getGeoJSONType() {
      return {
        type: 'Point',
        subtype: 'Ellipse'
      };
    }

    /**
     * Retrieves the coordinates of the center of the ellipse.
     * @returns {Array} An array containing the x and y coordinates of the center.
     * @description This method returns an array of coordinates representing the position of the center of the ellipse.
     */
  }, {
    key: "getCoordinates",
    value: function getCoordinates() {
      var item = this.paperItem;
      return [item.position.x, item.position.y];
    }

    /**
     * Retrieves the properties of the ellipse.
     * @returns {Object} The properties object.
     * @description This method returns the properties associated with the ellipse.
     */
  }, {
    key: "getProperties",
    value: function getProperties() {
      var item = this.paperItem;
      var path = item.children[0];
      var points = path.segments.map(function (s) {
        return s.point;
      });
      var ax1 = points[2].subtract(points[0]);
      var ax2 = points[3].subtract(points[1]);
      var a, b;
      if (ax1.length > ax2.length) {
        a = ax1;
        b = ax2;
      } else {
        a = ax2;
        b = ax1;
      }
      var angle = a.angle;
      return {
        majorRadius: a.length / 2,
        minorRadius: b.length / 2,
        angle: angle
      };
    }
    /**
     * Handle transformation operations on the ellipse item.
     * @static
     * @param {...string} operation - The transformation operation.
     * @description This static method handles transformation operations on the ellipse item, such as rotation.
     */
  }], [{
    key: "supportsGeoJSONType",
    value: function supportsGeoJSONType(type, subtype) {
      return type.toLowerCase() === 'point' && (subtype === null || subtype === void 0 ? void 0 : subtype.toLowerCase()) === 'ellipse';
    }
  }, {
    key: "onTransform",
    value: function onTransform() {
      var operation = arguments[0];
      switch (operation) {
        case 'complete':
          {
            var curves = this.children[0].curves;
            var center = this.bounds.center;
            //take two adjacent curves (of the four total) and find the point on each closest to the center
            var nearpoints = curves.slice(0, 2).map(function (curve) {
              return {
                curve: curve,
                location: curve.getNearestLocation(center)
              };
            }).sort(function (a, b) {
              return a.location.distance - b.location.distance;
            });
            var closest = nearpoints[0].location.point;
            if (closest.equals(nearpoints[0].curve.segment1.point) || closest.equals(nearpoints[0].curve.segment2.point)) {
              //no recalculation of points/axes required, the nearest point is already one of our existing points, just return
              return;
            }
            var t = nearpoints[0].location.curve == nearpoints[0].curve ? nearpoints[0].location.time : 1; //if owned by the other curve, time == 1 by definition
            var b = closest.subtract(center); //minor axis
            var a = nearpoints[1].curve.getLocationAtTime(t).point.subtract(center); //major axis
            var ellipse = new _paper.Path.Ellipse({
              center: center,
              radius: [a.length, b.length]
            }).rotate(a.angle);
            this.children[0].set({
              segments: ellipse.segments
            });
            break;
          }
      }
    }
  }]);
}(AnnotationItem);

;// ./src/js/utils/hash.mjs
/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    License: Public domain. Attribution appreciated.
    A fast and simple 53-bit string hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
*/
var cyrb53 = function cyrb53(str) {
  var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/*
    cyrb53a beta (c) 2023 bryc (github.com/bryc)
    License: Public domain. Attribution appreciated.
    The original cyrb53 has a slight mixing bias in the low bits of h1.
    This shouldn't be a huge problem, but I want to try to improve it.
    This new version should have improved avalanche behavior, but
    it is not final, and changes to the algorithm are expected.
    So don't expect this function to produce the same output in the future!
*/
var cyrb53a_beta = function cyrb53a_beta(str) {
  var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (var i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  h1 ^= Math.imul(h1 ^ h2 >>> 15, 0x735a2d97);
  h2 ^= Math.imul(h2 ^ h1 >>> 15, 0xcaf649a9);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return 2097152 * (h2 >>> 0) + (h1 >>> 11);
};
;// ./src/js/annotationtoolkit.mjs
function annotationtoolkit_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = annotationtoolkit_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function annotationtoolkit_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return annotationtoolkit_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? annotationtoolkit_arrayLikeToArray(r, a) : void 0; } }
function annotationtoolkit_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function annotationtoolkit_typeof(o) { "@babel/helpers - typeof"; return annotationtoolkit_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, annotationtoolkit_typeof(o); }
function annotationtoolkit_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function annotationtoolkit_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, annotationtoolkit_toPropertyKey(o.key), o); } }
function annotationtoolkit_createClass(e, r, t) { return r && annotationtoolkit_defineProperties(e.prototype, r), t && annotationtoolkit_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function annotationtoolkit_toPropertyKey(t) { var i = annotationtoolkit_toPrimitive(t, "string"); return "symbol" == annotationtoolkit_typeof(i) ? i : i + ""; }
function annotationtoolkit_toPrimitive(t, r) { if ("object" != annotationtoolkit_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != annotationtoolkit_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function annotationtoolkit_callSuper(t, o, e) { return o = annotationtoolkit_getPrototypeOf(o), annotationtoolkit_possibleConstructorReturn(t, annotationtoolkit_isNativeReflectConstruct() ? Reflect.construct(o, e || [], annotationtoolkit_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function annotationtoolkit_possibleConstructorReturn(t, e) { if (e && ("object" == annotationtoolkit_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return annotationtoolkit_assertThisInitialized(t); }
function annotationtoolkit_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function annotationtoolkit_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (annotationtoolkit_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function annotationtoolkit_getPrototypeOf(t) { return annotationtoolkit_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, annotationtoolkit_getPrototypeOf(t); }
function annotationtoolkit_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && annotationtoolkit_setPrototypeOf(t, e); }
function annotationtoolkit_setPrototypeOf(t, e) { return annotationtoolkit_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, annotationtoolkit_setPrototypeOf(t, e); }
/**
 * OpenSeadragon annotation plugin based on paper.js
 * @version 0.4.13
 * 
 * Includes additional open source libraries which are subject to copyright notices
 * as indicated accompanying those segments of code.
 * 
 * Original code:
 * Copyright (c) 2022-2023, Thomas Pearce
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
 * * Neither the name of this project nor the names of its
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

















//extend paper prototypes to add functionality
//property definitions

Object.defineProperty(_paper.Item.prototype, 'displayName', displayNamePropertyDef());
Object.defineProperty(_paper.Item.prototype, 'featureCollection', featureCollectionPropertyDef());
Object.defineProperty(_paper.TextItem.prototype, 'content', textItemContentPropertyDef());
Object.defineProperty(_paper.Project.prototype, 'descendants', descendantsDefProject());

//extend remove function to emit events for GeoJSON type annotation objects
var origRemove = _paper.Item.prototype.remove;
_paper.Item.prototype.remove = function () {
  var _this = this;
  var childrenToFireRemove = this.getItems({
    match: function match(item) {
      return item.isGeoJSONFeatureCollection;
    }
  });
  (this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.project.emit('item-removed', {
    item: this
  });
  childrenToFireRemove.forEach(function (fc) {
    return _this.project.emit('item-removed', {
      item: fc
    });
  });
  origRemove.call(this);
  (this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.emit('removed', {
    item: this
  });
  childrenToFireRemove.forEach(function (fc) {
    return fc.emit('removed', {
      item: fc
    });
  });
};
//function definitions
_paper.Group.prototype.insertChildren = getInsertChildrenDef();
_paper.Color.prototype.toJSON = _paper.Color.prototype.toCSS; //for saving/restoring colors as JSON
_paper.Style.prototype.toJSON = styleToJSON;
_paper.View.prototype.getImageData = paperViewGetImageData;
_paper.PathItem.prototype.toCompoundPath = toCompoundPath;
_paper.PathItem.prototype.applyBounds = applyBounds;
_paper.Item.prototype.select = paperItemSelect;
_paper.Item.prototype.deselect = paperItemDeselect;
_paper.Item.prototype.toggle = paperItemToggle;
//to do: should these all be installed on project instead of scope?
_paper.PaperScope.prototype.findSelectedNewItem = findSelectedNewItem;
_paper.PaperScope.prototype.findSelectedItems = findSelectedItems;
_paper.PaperScope.prototype.findSelectedItem = findSelectedItem;
_paper.PaperScope.prototype.scaleByCurrentZoom = function (v) {
  return v / this.view.getZoom();
};
_paper.PaperScope.prototype.getActiveTool = function () {
  return this.tool ? this.tool._toolObject : null;
};

/**
 * A class for creating and managing annotation tools on an OpenSeadragon viewer.
 * @class 
 * @memberof OSDPaperjsAnnotation
 * @extends OpenSeadragon.EventSource
 */
var AnnotationToolkit = /*#__PURE__*/function (_OpenSeadragon$EventS) {
  /**
   * Create a new AnnotationToolkit instance.
   * @constructor
   * @param {OpenSeadragon.Viewer} openSeadragonViewer - The OpenSeadragon viewer object.
   * @param {object} [opts]
   * @param {object} [opts.addUI] a configuration object for the UI, if desired
   * @param {object} [opts.overlay] a PaperOverlay object to use
   * @param {object} [opts.destroyOnViewerClose] whether to destroy the toolkit and its overlay when the viewer closes
   * @param {object} [opts.cacheAnnotations] whether to keep annotations in memory for images which aren't currently open
   */
  function AnnotationToolkit(openSeadragonViewer) {
    var _this2;
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    annotationtoolkit_classCallCheck(this, AnnotationToolkit);
    _this2 = annotationtoolkit_callSuper(this, AnnotationToolkit);
    if (!opts) {
      opts = {};
    }
    _this2._defaultOptions = {
      addUI: false,
      overlay: null,
      destroyOnViewerClose: false,
      cacheAnnotations: false
    };
    _this2.options = Object.assign({}, _this2._defaultOptions, opts);
    _this2._defaultStyle = {
      fillColor: new _paper.Color('white'),
      strokeColor: new _paper.Color('black'),
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWidth: 1,
      rescale: {
        strokeWidth: 1
      }
    };
    _this2.viewer = openSeadragonViewer;

    // set up overlay. If one is passed in, use it. Otherwise, create one.
    if (_this2.options.overlay) {
      if (_this2.options.overlay instanceof PaperOverlay) {
        _this2.overlay = _this2.options.overlay;
      }
    } else {
      _this2.overlay = new PaperOverlay(_this2.viewer, {
        type: 'image'
      });
    }
    _this2.paperScope.project.defaultStyle = new _paper.Style();
    _this2.paperScope.project.defaultStyle.set(_this2.defaultStyle);

    // set the overlay to auto rescale items
    _this2.overlay.autoRescaleItems(true);

    // optionally destroy the annotation toolkit when the viewer closes
    if (_this2.options.destroyOnViewerClose) {
      _this2.viewer.addOnceHandler('close', function () {
        return _this2.destroy();
      });
    }

    //bind a reference to this to the viewer and the paperScope, for convenient access
    _this2.viewer.annotationToolkit = _this2;
    _this2.paperScope.annotationToolkit = _this2;
    _this2.viewer.world.addHandler('add-item', function (ev) {
      if (_this2.options.cacheAnnotations) {
        _this2._loadCachedAnnotations(ev.item);
      }
    });
    _this2.viewer.world.addHandler('remove-item', function (ev) {
      if (_this2.options.cacheAnnotations) {
        _this2._cacheAnnotations(ev.item);
      }
    }, false, 1);

    //register item constructors
    AnnotationItemFactory.register(MultiPolygon);
    AnnotationItemFactory.register(Placeholder);
    AnnotationItemFactory.register(Linestring);
    AnnotationItemFactory.register(MultiLinestring);
    AnnotationItemFactory.register(Raster);
    AnnotationItemFactory.register(Point);
    AnnotationItemFactory.register(PointText);
    AnnotationItemFactory.register(Rectangle);
    AnnotationItemFactory.register(Ellipse);
    _paper.Item.fromGeoJSON = AnnotationItemFactory.itemFromGeoJSON;
    _paper.Item.fromAnnotationItem = AnnotationItemFactory.itemFromAnnotationItem;
    _this2._cached = {};
    if (_this2.options.addUI) {
      var uiOpts = {};
      if (annotationtoolkit_typeof(opts.addUI) === 'object') {
        uiOpts = _this2.options.addUI;
      }
      _this2.addAnnotationUI(uiOpts);
    }
    return _this2;
  }

  /**
   * Get the default style for the annotation items.
   * 
   * @returns {object} The default style object.
   */
  annotationtoolkit_inherits(AnnotationToolkit, _OpenSeadragon$EventS);
  return annotationtoolkit_createClass(AnnotationToolkit, [{
    key: "defaultStyle",
    get: function get() {
      return this._defaultStyle;
    }

    /**
     * Get the default style for the annotation items.
     * 
     * @returns {object} The default style object.
     */
  }, {
    key: "annotationUI",
    get: function get() {
      return this._annotationUI;
    }

    /**
     * Get the paperScope associated with this toolkit
     * 
     * @returns {object} The paperScope object for this toolkit's PaperOverlay.
     */
  }, {
    key: "paperScope",
    get: function get() {
      return this.overlay.paperScope;
    }

    /**
     * Empty any cached annotations
     */
  }, {
    key: "clearCache",
    value: function clearCache() {
      this._cached = {};
    }

    /**
     * save the current feature collections to the cache
     * @param {TiledImage} tiledImage 
     * @private
     */
  }, {
    key: "_cacheAnnotations",
    value: function _cacheAnnotations(tiledImage) {
      try {
        var key = cyrb53(JSON.stringify(tiledImage.source));
        var featureCollections = tiledImage.paperLayer.getItems({
          match: function match(item) {
            return item.isGeoJSONFeatureCollection;
          }
        });
        this._cached[key] = featureCollections;
      } catch (e) {
        console.error('Error with caching', e);
      }
    }
  }, {
    key: "_loadCachedAnnotations",
    value: function _loadCachedAnnotations(tiledImage) {
      try {
        var key = cyrb53(JSON.stringify(tiledImage.source));
        var featureCollections = this._cached[key] || [];
        var _iterator = annotationtoolkit_createForOfIteratorHelper(featureCollections),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var fcGroup = _step.value;
            this._addFeatureCollectionGroupToLayer(fcGroup, tiledImage.paperLayer);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } catch (e) {
        console.error('Error with fetching from cache', e);
      }
    }

    /**
     * Add an annotation UI to the toolkit.
     * 
     * @param {object} [opts={}] - The options for the annotation UI.
     * @returns {AnnotationUI} The annotation UI object.
     */
  }, {
    key: "addAnnotationUI",
    value: function addAnnotationUI() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!this._annotationUI) this._annotationUI = new AnnotationUI(this, opts);
      return this._annotationUI;
    }
    /**
     * Destroy the toolkit and its components.
     */
  }, {
    key: "destroy",
    value: function destroy() {
      this.raiseEvent('before-destroy');
      var tool = this.paperScope && this.paperScope.getActiveTool();
      if (tool) tool.deactivate(true);
      this.viewer.annotationToolkit = null;
      this._annotationUI && this._annotationUI.destroy();
      this.overlay.destroy();
      this.raiseEvent('destroy');
    }
    /**
     * Close the toolkit and remove its feature collections.
     */
  }, {
    key: "close",
    value: function close() {
      this.raiseEvent('before-close');
      var tool = this.paperScope && this.paperScope.getActiveTool();
      if (tool) tool.deactivate(true);
      this.addFeatureCollections([], true);
    }
    /**
     * Set the global visibility of the toolkit.
     * @param {boolean} [show=false] - Whether to show or hide the toolkit.
     */
  }, {
    key: "setGlobalVisibility",
    value: function setGlobalVisibility() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.paperScope.view._element.setAttribute('style', 'visibility:' + (show ? 'visible;' : 'hidden;'));
    }
    /**
     * Add feature collections to the toolkit from GeoJSON objects.
     * @param {object[]} featureCollections - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     * @param {OpenSeadragon.TiledImage | OpenSeadragon.Viewport | false} [parentImage] - which image to add the feature collections to
     */
  }, {
    key: "addFeatureCollections",
    value: function addFeatureCollections(featureCollections, replaceCurrent, parentImage) {
      this.loadGeoJSON(featureCollections, replaceCurrent, parentImage);
      this.overlay.rescaleItems();
      this.paperScope.project.emit('items-changed');
    }
    /**
     * Get the feature collection groups that the toolkit is managing.
     * @param {paper.Layer} [parentLayer]  The layer to find feature collections within. If not specified, finds across all layers.
     * @returns {paper.Group[]} The array of paper groups representing feature collections.
     */
  }, {
    key: "getFeatureCollectionGroups",
    value: function getFeatureCollectionGroups(parentLayer) {
      // return this.overlay.paperScope.project.layers.filter(l=>l.isGeoJSONFeatureCollection);
      return this.paperScope.project.getItems({
        match: function match(item) {
          return item.isGeoJSONFeatureCollection && (parentLayer ? item.layer === parentLayer : true);
        }
      });
    }
    /**
     * Get the features in the toolkit.
     * @returns {paper.Item[]} The array of paper item objects representing features.
     */
  }, {
    key: "getFeatures",
    value: function getFeatures() {
      return this.paperScope.project.getItems({
        match: function match(i) {
          return i.isGeoJSONFeature;
        }
      });
    }
    /**
    * Register an item as a GeoJSONFeature that the toolkit should track
    * @param {paper.Item} item - The item to track as a geoJSONFeature
    */
  }, {
    key: "toGeoJSON",
    value:
    /**
     * Convert the feature collections in the toolkit to GeoJSON objects.
     * @param {Object} [options] 
     * @param {Layer} [options.layer] The specific layer to use
     * @returns {Object[]} The array of GeoJSON objects representing feature collections.
     */
    function toGeoJSON(options) {
      var defaults = {
        layer: null
      };
      options = Object.assign(defaults, options);
      var parent = options.layer || this.paperScope.project;
      //find all featureCollection items and convert to GeoJSON compatible structures
      return parent.getItems({
        match: function match(i) {
          return i.isGeoJSONFeatureCollection;
        }
      }).map(function (grp) {
        var geoJSON = {
          type: 'FeatureCollection',
          features: grp.descendants.filter(function (d) {
            return d.annotationItem;
          }).map(function (d) {
            return d.annotationItem.toGeoJSONFeature();
          }),
          properties: {
            defaultStyle: grp.defaultStyle.toJSON(),
            userdata: grp.data.userdata
          },
          label: grp.displayName
        };
        return geoJSON;
      });
    }

    /**
     * Convert the feature collections in the project to a JSON string.
     * @param {function} [replacer] - The replacer function for JSON.stringify().
     * @param {number|string} [space] - The space argument for JSON.stringify().
     * @returns {string} The JSON string representing the feature collections.
     */
  }, {
    key: "toGeoJSONString",
    value: function toGeoJSONString(replacer, space) {
      return JSON.stringify(this.toGeoJSON(), replacer, space);
    }
    /**
     * Load feature collections from GeoJSON objects and add them to the project.
     * @param {object[]} geoJSON - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     * @param {OpenSeadragon.TiledImage | OpenSeadragon.Viewport | false} [parentImage] - Which image (or viewport) to add the object to
     * @param {boolean} [pixelCoordinates]
     */
  }, {
    key: "loadGeoJSON",
    value: function loadGeoJSON(geoJSON, replaceCurrent, parentImage) {
      var _this3 = this;
      var parentLayer = parentImage ? parentImage.paperLayer : false;
      if (replaceCurrent) {
        this.getFeatureCollectionGroups(parentImage).forEach(function (grp) {
          return grp.remove();
        });
      }
      if (!Array.isArray(geoJSON)) {
        geoJSON = [geoJSON];
      }
      geoJSON.forEach(function (obj) {
        if (obj.type == 'FeatureCollection') {
          var group = _this3._createFeatureCollectionGroup({
            label: obj.label,
            parent: parentLayer
          });
          var props = obj.properties || {};
          group.data.userdata = Object.assign({}, props.userdata);
          group.defaultStyle.set(props.defaultStyle);
          obj.features.forEach(function (feature) {
            var item = _paper.Item.fromGeoJSON(feature);
            group.addChild(item);
          });
        } else {
          console.warn('GeoJSON object not loaded: wrong type. Only FeatureCollection objects are currently supported');
        }
      });
    }

    /**
     * Add a new, empty FeatureCollection with default label and parent
     * @returns {paper.Group} The paper group object representing the feature collection.
     */
  }, {
    key: "addEmptyFeatureCollectionGroup",
    value: function addEmptyFeatureCollectionGroup() {
      return this._createFeatureCollectionGroup();
    }

    /**
     * Create a new feature collection group in the project scope.
     * @private
     * @param {Object} [opts] - Object with fields label and parent
     * @returns {paper.Group} The paper group object representing the feature collection.
     */
  }, {
    key: "_createFeatureCollectionGroup",
    value: function _createFeatureCollectionGroup() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var defaultOpts = {
        label: null,
        parent: null
      };
      opts = Object.assign({}, defaultOpts, opts);
      var displayLabel = opts.label;
      var parent = opts.parent;
      if (!parent) {
        var numItems = this.viewer.world.getItemCount();
        if (numItems == 1) {
          parent = this.viewer.world.getItemAt(0).paperLayer;
        } else if (numItems == 0) {
          parent = this.viewer.viewport.paperLayer;
        } else {
          //TODO: Update the UI and associated APIs to allow selecting specific tiled images for multi-image use
          console.warn('Use of AnnotationToolkit with multi-image is not yet fully supported. All annotations will be added to the top-level tiled image.');
          parent = this.viewer.world.getItemAt(numItems - 1).paperLayer;
        }
      }
      if (!parent) {
        console.error('Failed to create feature collection group: no parent could be found');
        return;
      }
      var grp = new _paper.Group();
      this._addFeatureCollectionGroupToLayer(grp, parent);
      var grpNum = this.getFeatureCollectionGroups().length;
      grp.name = grp.displayName = displayLabel !== null ? displayLabel : "Annotation Group ".concat(grpNum);
      grp.defaultStyle = new _paper.Style(this.paperScope.project.defaultStyle);
      return grp;
    }
  }, {
    key: "_addFeatureCollectionGroupToLayer",
    value: function _addFeatureCollectionGroupToLayer(fcGroup, layer) {
      layer.addChild(fcGroup);
      AnnotationToolkit.registerFeatureCollection(fcGroup);
      this.paperScope.project.emit('feature-collection-added', {
        group: fcGroup
      });
      // re-insert children to trigger events
      if (fcGroup.children) {
        fcGroup.insertChildren(0, fcGroup.children);
      }
    }

    /**
     * Make a placeholder annotation item
     * @param {Object} style - options (e.g strokeColor) to pass to the paper item
     */
  }, {
    key: "makePlaceholderItem",
    value: function makePlaceholderItem(style) {
      return new Placeholder(style);
    }
  }], [{
    key: "registerFeature",
    value: function registerFeature(item) {
      item.isGeoJSONFeature = true;
    }
    /**
    * Register a group as a GeoJSONFeatureCollection that the toolkit should track
    * @param {paper.Group} group - The group to track as a geoJSONFeatureCollection
    */
  }, {
    key: "registerFeatureCollection",
    value: function registerFeatureCollection(group) {
      group.isGeoJSONFeatureCollection = true;
    }
  }]);
}(osd.EventSource);
;


// private functions

/**
 * Create a compound path from a path item.
 * @private
 * @returns {paper.CompoundPath} The compound path object.
 */
function toCompoundPath() {
  if (this.constructor !== _paper.CompoundPath) {
    var np = new _paper.CompoundPath({
      children: [this],
      fillRule: 'evenodd'
    });
    np.selected = this.selected;
    this.selected = false;
    return np;
  }
  return this;
}
/**
 * Apply bounds to a path item.
 * @private
 * @param {paper.Item[]} boundingItems - The array of paper items to use as bounds.
 */
function applyBounds(boundingItems) {
  if (boundingItems.length == 0) return;
  var intersection;
  if (boundingItems.length == 1) {
    var bounds = boundingItems[0];
    intersection = bounds.intersect(this, {
      insert: false
    });
  } else if (boundingItems.length > 1) {
    var _bounds = new _paper.CompoundPath(boundingItems.map(function (b) {
      return b.clone().children;
    }).flat());
    intersection = _bounds.intersect(this, {
      insert: false
    });
    _bounds.remove();
  }
  if (this.children) {
    //compound path
    this.removeChildren();
    this.addChildren(intersection.children ? intersection.children : [intersection]);
  } else {
    //simple path
    this.segments = intersection.segments ? intersection.segments : intersection.firstChild.segments;
  }
}
/**
 * Select a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemSelect(keepOtherSelectedItems) {
  if (!keepOtherSelectedItems) {
    this.project._scope.findSelectedItems().forEach(function (item) {
      return item.deselect();
    });
  }
  this.selected = true;
  this.emit('selected');
  this.project.emit('item-selected', {
    item: this
  });
}
/**
 * Deselect a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemDeselect(keepOtherSelectedItems) {
  if (!keepOtherSelectedItems) {
    this.project._scope.findSelectedItems().forEach(function (item) {
      return item.deselect(true);
    });
    return;
  }
  this.selected = false;
  this.emit('deselected');
  this.project.emit('item-deselected', {
    item: this
  });
}
/**
 * Toggle the selection of a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemToggle(keepOtherSelectedItems) {
  this.selected ? this.deselect(keepOtherSelectedItems) : this.select(keepOtherSelectedItems);
}

/**
 * Find the selected new item in the project scope.
 * @private
 * @returns {paper.Item} The selected new item, or null if none exists.
 */
function findSelectedNewItem() {
  //to do: change this to use type=='Feature' and geometry==null to match GeoJSON spec and AnnotationItemPlaceholder definition
  return this.project.getItems({
    selected: true,
    match: function match(i) {
      return i.isGeoJSONFeature && i.initializeGeoJSONFeature;
    }
  })[0];
}
/**
 * Find the selected items in the project scope.
 * @private
 * @returns {paper.Item[]} The array of selected items, or an empty array if none exists.
 */
function findSelectedItems() {
  return this.project.getItems({
    selected: true,
    match: function match(i) {
      return i.isGeoJSONFeature;
    }
  });
}
/**
 * Find the first selected item in the project scope.
 * @private
 * @returns {paper.Item} The first selected item, or null if none exists.
 */
function findSelectedItem() {
  return this.findSelectedItems()[0];
}

/**
 * Define the display name property for a paper item object.
 * The display name property defines the name used to identify a paper item object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} set - The setter function for the display name property.
 *   @param {string} input - The display name value.
 * @property {function} get - The getter function for the display name property.
 *   @returns {string} The display name value.
 */
function displayNamePropertyDef() {
  return {
    set: function displayName(input) {
      if (Array.isArray(input)) {
        this._displayName = new String(input[0]);
        this._displayName.source = input[1];
      } else {
        this._displayName = input;
      }
      this.name = this._displayName;
      this.emit('display-name-changed', {
        displayName: this._displayName
      });
    },
    get: function displayName() {
      return this._displayName;
    }
  };
}

/**
 * Define the featureCollection property for a paper item object.
 * @private
 */
function featureCollectionPropertyDef() {
  return {
    get: function fc() {
      return this.hierarchy.filter(function (i) {
        return i.isGeoJSONFeatureCollection;
      })[0];
    }
  };
}

/**
 * Define the descendants property for a paper project object.
 * The descendants property represents all the descendants (layers and their children) of a paper project object.
 * @private
 * @returns {object} The property descriptor object.
 * @property {function} get - The getter function for the descendants property.
 *   @returns {paper.Item[]} The array of paper item objects representing the descendants.
 */
function descendantsDefProject() {
  return {
    get: function descendants() {
      // return this.layers ? this.layers.filter(layer=>layer.isGeoJSONFeatureCollection).map(child=>child.descendants).flat() : [this];
      return this.layers ? this.getItems({
        match: function match(item) {
          return item.isGeoJSONFeatureCollection;
        }
      }).map(function (child) {
        return child.descendants;
      }).flat() : [this];
    }
  };
}

/**
 * Convert a paper style object to a JSON object.
 * @private
 * @returns {object} The JSON object representing the style.
 */
function styleToJSON() {
  var _this4 = this;
  var output = {};
  Object.keys(this._values).forEach(function (key) {
    output[key] = _this4[key]; //invoke getter
  });
  return output;
}
/**
 * Get the image data of a paper view element.
 * @private
 * @returns {ImageData} The image data object of the view element.
 */
function paperViewGetImageData() {
  return this.element.getContext('2d').getImageData(0, 0, this.element.width, this.element.height);
}

/**
 * Get the insert children method definition for a paper group object.
 * The insert children method emits events when children are added to the paper group object.
 * @private
 * @returns {function} The insert children method that emits events when children are added.
 */
function getInsertChildrenDef() {
  var origInsertChildren = _paper.Group.prototype.insertChildren.original || _paper.Group.prototype.insertChildren;
  function insertChildren() {
    var _this5 = this;
    var output = origInsertChildren.apply(this, arguments);
    var index = arguments[0],
      children = Array.from(arguments[1]);
    children && children.forEach(function (child, i) {
      if (child.isGeoJSONFeature) {
        var idx = typeof index !== 'undefined' ? index + 1 : -1;
        _this5.emit('child-added', {
          item: child,
          index: idx
        });
      }
    });
    return output;
  }
  insertChildren.original = origInsertChildren;
  return insertChildren;
}

/**
 * Define the fill opacity property for a paper style object.
 *  @private
 *  @returns {object} The property descriptor object with the following properties:
 * - get: A function that returns the text of the item.
 * - set: A function that sets the text of the item and causes the 'content-changed' event to be fired.
 */
function textItemContentPropertyDef() {
  var _set = _paper.TextItem.prototype._setContent || Object.getOwnPropertyDescriptor(_paper.TextItem.prototype, 'content').set;
  _paper.TextItem.prototype._setContent = _set;
  return {
    get: function get() {
      return this._content;
    },
    set: function set(content) {
      _set.call(this, content);
      this.emit('content-changed');
    }
  };
}
;// ./src/js/rotationcontrol.mjs
function rotationcontrol_callSuper(t, o, e) { return o = rotationcontrol_getPrototypeOf(o), rotationcontrol_possibleConstructorReturn(t, rotationcontrol_isNativeReflectConstruct() ? Reflect.construct(o, e || [], rotationcontrol_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function rotationcontrol_possibleConstructorReturn(t, e) { if (e && ("object" == rotationcontrol_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return rotationcontrol_assertThisInitialized(t); }
function rotationcontrol_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function rotationcontrol_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (rotationcontrol_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function rotationcontrol_getPrototypeOf(t) { return rotationcontrol_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, rotationcontrol_getPrototypeOf(t); }
function rotationcontrol_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && rotationcontrol_setPrototypeOf(t, e); }
function rotationcontrol_setPrototypeOf(t, e) { return rotationcontrol_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, rotationcontrol_setPrototypeOf(t, e); }
function rotationcontrol_typeof(o) { "@babel/helpers - typeof"; return rotationcontrol_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, rotationcontrol_typeof(o); }
function rotationcontrol_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function rotationcontrol_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, rotationcontrol_toPropertyKey(o.key), o); } }
function rotationcontrol_createClass(e, r, t) { return r && rotationcontrol_defineProperties(e.prototype, r), t && rotationcontrol_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function rotationcontrol_toPropertyKey(t) { var i = rotationcontrol_toPrimitive(t, "string"); return "symbol" == rotationcontrol_typeof(i) ? i : i + ""; }
function rotationcontrol_toPrimitive(t, r) { if ("object" != rotationcontrol_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != rotationcontrol_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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
 * @memberof OSDPaperjsAnnotation
 */
var RotationControlOverlay = /*#__PURE__*/function () {
  /**
   * Creates an instance of the RotationControlOverlay.
   *
   * @param {any} viewer - The viewer object.
   */
  function RotationControlOverlay(viewer) {
    var _this = this,
      _button$element$query;
    rotationcontrol_classCallCheck(this, RotationControlOverlay);
    var overlay = this.overlay = new PaperOverlay(viewer, {
      overlayType: 'viewer'
    });
    var tool = this.tool = new RotationControlTool(this.overlay.paperScope, this);
    this.dummyTool = new this.overlay.paperScope.Tool(); //to capture things like mouseMove, keyDown etc (when actual tool is not active)
    this.dummyTool.activate();
    this._mouseNavEnabledAtActivation = true;
    var button = overlay.addViewerButton({
      faIconClass: 'fa-rotate',
      tooltip: 'Rotate viewer',
      onClick: function onClick() {
        tool.active ? _this.deactivate() : _this.activate();
      }
    });
    (_button$element$query = button.element.querySelector('svg.icon')) === null || _button$element$query === void 0 || _button$element$query.style.setProperty('width', '1em');
  }
  /**
   * Activates the rotation control.
   */
  return rotationcontrol_createClass(RotationControlOverlay, [{
    key: "activate",
    value: function activate() {
      this._mouseNavEnabledAtActivation = this.overlay.viewer.isMouseNavEnabled();
      this.tool.activate();
      this.tool.active = true;
      this.overlay.bringToFront();
    }
    /**
     * Deactivates the rotation control.
     */
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.tool.deactivate(true);
      this.dummyTool.activate();
      this.overlay.viewer.setMouseNavEnabled(this._mouseNavEnabledAtActivation);
      this.tool.active = false;
      this.overlay.sendToBack();
    }
  }]);
}();
/**
 * @class 
 * @memberof OSDPaperjsAnnotation
 * @extends ToolBase
 * 
 */
var RotationControlTool = /*#__PURE__*/function (_ToolBase) {
  /**
   * Creates an instance of the RotationControlTool.
   * @constructor
   * @param {any} paperScope - The paper scope object.
   * @param {any} rotationOverlay - The rotation overlay object.
   */
  function RotationControlTool(paperScope, rotationOverlay) {
    var _this2;
    rotationcontrol_classCallCheck(this, RotationControlTool);
    _this2 = rotationcontrol_callSuper(this, RotationControlTool, [paperScope]);
    var self = _this2;
    var bounds = paperScope.view.bounds;
    var widget = new RotationControlWidget(paperScope.view.bounds.center, setAngle, close);
    paperScope.view.on('flip', function () {
      widget.closeButton.scale(-1, 1, widget.item.bounds.center);
    });
    var viewer = paperScope.overlay.viewer;
    viewer.addHandler('rotate', function (ev) {
      return widget.setCurrentRotation(ev.degrees);
    });
    paperScope.view.on('resize', function (ev) {
      var pos = widget.item.position;
      var w = pos.x / bounds.width;
      var h = pos.y / bounds.height;
      bounds = paperScope.view.bounds; //new bounds after the resize
      widget.item.position = new _paper.Point(w * bounds.width, h * bounds.height);
    });
    widget.item.visible = false;
    self.project.toolLayer.addChild(widget.item);

    //add properties to this.tools so that they properly appear on html
    _this2.tool.onMouseDown = function (ev) {};
    _this2.tool.onMouseDrag = function (ev) {};
    _this2.tool.onMouseMove = function (ev) {
      widget.setLineOrientation(ev.point);
    };
    _this2.tool.onMouseUp = function () {};
    _this2.tool.extensions.onKeyDown = function (ev) {
      if (ev.key == 'escape') {
        rotationOverlay.deactivate();
      }
    };
    _this2.extensions.onActivate = function () {
      if (widget.item.visible == false) {
        widget.item.position = paperScope.view.bounds.center; //reset to center when activated, so that if it gets lost off screen it's easy to recover
      }
      widget.item.visible = true;
      widget.item.opacity = 1;
    };
    _this2.extensions.onDeactivate = function (finished) {
      if (finished) {
        widget.item.visible = false;
      }
      widget.item.opacity = 0.3;
    };
    /**
     * Sets the angle of the rotation.
     * @memberof OSDPaperjsAnnotation.RotationControlTool#
     * @param {number} angle - The angle to set.
     * @param {any} pivot - The pivot point for the rotation.
     */
    function setAngle(angle, pivot) {
      if (!pivot) {
        var widgetCenter = new osd.Point(widget.item.position.x, widget.item.position.y);
        pivot = viewer.viewport.pointFromPixel(widgetCenter);
      }
      viewer.viewport.rotateTo(angle, pivot, true);
    }
    function close() {
      rotationOverlay.deactivate();
    }
    return _this2;
  }
  rotationcontrol_inherits(RotationControlTool, _ToolBase);
  return rotationcontrol_createClass(RotationControlTool);
}(ToolBase);



/**
 * Creates a rotation control widget.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @param {paper.Point} center - The center point of the widget.
 * @param {Function} setAngle - The function to set the rotation angle.
 * @returns {object} The rotation control widget object.
 */
function RotationControlWidget(center, setAngle, close) {
  var width = center.x * 2;
  var height = center.y * 2;
  var radius = Math.min(width / 5, height / 5, 30);
  var innerRadius = radius * 0.3;
  var baseAngle = new _paper.Point(0, -1).angle; //make north the reference direction for 0 degrees (even though normally it would be east)

  //group will contain all the elements of the GUI control
  var group = new _paper.Group({
    insert: false
  });

  //circle is the central region with crosshair and cardinal points
  var circle = new _paper.Path.Circle({
    center: new _paper.Point(0, 0),
    radius: radius
  });
  circle.fillColor = new _paper.Color(0, 0, 0, 0.01); //nearly transparent fill so the fill can be clickable
  circle.strokeColor = 'black';
  circle.strokeWidth = 2;

  //crosshair to focus on central point of circle
  [0, 90, 180, 270].map(function (angle) {
    var crosshair = new _paper.Path.Line(new _paper.Point(0, innerRadius), new _paper.Point(0, radius));
    crosshair.rotate(angle, new _paper.Point(0, 0));
    crosshair.fillColor = null;
    crosshair.strokeColor = 'black';
    crosshair.strokeWidth = 2;
    group.addChild(crosshair);
  });

  //controls for north, east, south, west    
  var cardinalControls = [0, 90, 180, 270].map(function (angle) {
    var rect = new _paper.Path.Rectangle(new _paper.Point(-innerRadius, 0), new _paper.Size(innerRadius * 2, -1 * (radius + innerRadius * 1.5)));
    var control = rect.subtract(circle, {
      insert: false
    });
    rect.remove();
    control.rotate(angle, new _paper.Point(0, 0));
    control.fillColor = new _paper.Color(100, 100, 100, 0.5);
    control.strokeColor = 'black';
    control._angle = angle;
    group.addChild(control);
    return control;
  });

  //add circle after others so it can capture mouse events
  group.addChild(circle);

  //dot indicating current rotation status of the image
  var currentRotationIndicator = new _paper.Path.Circle({
    center: new _paper.Point(0, -radius),
    radius: innerRadius / 1.5
  });
  currentRotationIndicator.set({
    fillColor: 'yellow',
    strokeColor: 'black',
    applyMatrix: false
  }); //applyMatrix=false so the rotation property saves current value
  group.addChild(currentRotationIndicator);

  //line with arrows indicating that any spot on the image can be grabbed in order to perform rotation
  var rotationLineControl = new _paper.Group({
    applyMatrix: false
  });
  var arrowControl = new _paper.Group({
    applyMatrix: false
  });
  var rcc = new _paper.Color(0.3, 0.3, 0.3, 0.8);
  var lineControl = new _paper.Path.Line(new _paper.Point(0, -innerRadius), new _paper.Point(0, -Math.max(width, height)));
  lineControl.strokeColor = rcc;
  lineControl.strokeWidth = 1;
  lineControl.applyMatrix = false;
  rotationLineControl.addChild(lineControl);
  rotationLineControl.addChild(arrowControl);
  var aa = 94;
  var ah1 = new _paper.Path.RegularPolygon(new _paper.Point(-innerRadius * 1.2, 0), 3, innerRadius * 0.8);
  ah1.rotate(-aa);
  var ah2 = new _paper.Path.RegularPolygon(new _paper.Point(innerRadius * 1.2, 0), 3, innerRadius * 0.8);
  ah2.rotate(aa);
  var connector = new _paper.Path.Arc(new _paper.Point(-innerRadius * 1.2, 0), new _paper.Point(0, -innerRadius / 4), new _paper.Point(innerRadius * 1.2, 0));
  var connectorbg = connector.clone();
  arrowControl.addChildren([connectorbg, connector, ah1, ah2]);
  arrowControl.fillColor = 'yellow';
  connector.strokeWidth = innerRadius / 2;
  connectorbg.strokeWidth = connector.strokeWidth + 2;
  connectorbg.strokeColor = rcc;
  ah1.strokeColor = rcc;
  ah2.strokeColor = rcc;
  connector.strokeColor = 'yellow';
  connector.fillColor = null;
  group.addChild(rotationLineControl);

  // close button
  var closeButton = new _paper.Group({
    insert: false
  });
  closeButton.addChild(new _paper.Path.Circle({
    radius: innerRadius
  }));
  closeButton.addChild(new _paper.Path.Line(new _paper.Point(-innerRadius / 2, -innerRadius / 2), new _paper.Point(innerRadius / 2, innerRadius / 2)));
  closeButton.addChild(new _paper.Path.Line(new _paper.Point(innerRadius / 2, -innerRadius / 2), new _paper.Point(-innerRadius / 2, innerRadius / 2)));
  closeButton.set({
    fillColor: 'red',
    strokeColor: 'black',
    opacity: 0.7
  });
  closeButton.position = new _paper.Point(radius * 1.5, -radius * 1.5), group.addChild(closeButton);
  group.pivot = circle.bounds.center; //make the center of the circle the pivot for the entire  controller
  group.position = center; //set position after adding all children so it is applied to all

  //define API

  /**
  * The rotation control widget object.
  *     
  * @memberof OSDPaperjsAnnotation.RotationControlWidget
  * @property {paper.Group} item - The group containing all the elements of the widget.
  * @property {paper.Path.Circle} circle - The central region with crosshair and cardinal points.
  * @property {Array<paper.Path.Rectangle>} cardinalControls - The controls for north, east, south, west.
  * @property {paper.Group} rotationLineControl - The line with arrows indicating the spot for grabbing to perform rotation.
  * @example
  * // Usage example:
  * const rotationControl = new OSDPaperjsAnnotation.RotationControlWidget(centerPoint, setRotationAngle);
  * paper.project.activeLayer.addChild(rotationControl.item);
  * 
  * // Set the current rotation angle
  * rotationControl.setCurrentRotation(45);
  * 
  * // Set the line orientation for control
  * const orientationPoint = new paper.Point(150, 150);
  * rotationControl.setLineOrientation(orientationPoint, true);
  */
  var widget = {};
  //add items
  widget.item = group;
  widget.circle = circle;
  widget.cardinalControls = cardinalControls;
  widget.rotationLineControl = rotationLineControl;
  widget.closeButton = closeButton;

  //add API functions
  /**
  * Sets the current rotation angle.
  * @memberof OSDPaperjsAnnotation.RotationControlWidget#
  * @method setCurrentRotation
  * @param {number} angle - The angle to set.
  */
  widget.setCurrentRotation = function (angle) {
    // console.log('setCurrentRotation',angle);
    currentRotationIndicator.rotate(angle - currentRotationIndicator.rotation, circle.bounds.center);
  };
  /**
   * Sets the orientation of the line control.
   * @memberof OSDPaperjsAnnotation.RotationControlWidget#
   * @method setLineOrientation
   * @param {paper.Point} point - The point representing the orientation.
   * @param {boolean} [makeVisible=false] - Whether to make the control visible.
   */
  widget.setLineOrientation = function (point) {
    var makeVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var vector = point.subtract(circle.bounds.center);
    var angle = vector.angle - baseAngle;
    var length = vector.length;
    rotationLineControl.rotate(angle - rotationLineControl.rotation, circle.bounds.center);
    rotationLineControl.visible = makeVisible || length > radius + innerRadius * 1.5;
    arrowControl.position = new _paper.Point(0, -length);
    lineControl.segments[1].point = new _paper.Point(0, -length);
  };

  //add intrinsic item-level controls
  cardinalControls.forEach(function (control) {
    control.onClick = function () {
      setAngle(control._angle);
    };
  });
  currentRotationIndicator.onMouseDrag = function (ev) {
    var dragAngle = ev.point.subtract(circle.bounds.center).angle;
    var angle = dragAngle - baseAngle;
    setAngle(angle);
  };
  arrowControl.onMouseDown = function (ev) {
    arrowControl._angleOffset = currentRotationIndicator.rotation - ev.point.subtract(circle.bounds.center).angle;
  };
  arrowControl.onMouseDrag = function (ev) {
    var hitResults = this.project.hitTestAll(ev.point).filter(function (hr) {
      return cardinalControls.includes(hr.item);
    });
    var angle;
    if (hitResults.length > 0) {
      //we are over a cardinal direction control object; snap the line to that angle
      // angle = -hitResults[0].item._angle + arrowControl._angleOffset;
      ev.point = hitResults[0].item.bounds.center;
    }
    angle = ev.point.subtract(circle.bounds.center).angle + arrowControl._angleOffset;
    setAngle(angle);
    widget.setLineOrientation(ev.point, true);
  };
  // arrowControl.onMouseUp = function(ev){
  //     // console.log('arrow mouseup',ev)

  // }
  circle.onMouseDrag = function (ev) {
    widget.item.position = widget.item.position.add(ev.delta);
  };
  closeButton.onClick = function () {
    close();
  };
  return widget;
}
;// ./src/js/overlays/screenshot/changedpi.mjs
function changedpi_toConsumableArray(r) { return changedpi_arrayWithoutHoles(r) || changedpi_iterableToArray(r) || changedpi_unsupportedIterableToArray(r) || changedpi_nonIterableSpread(); }
function changedpi_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function changedpi_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return changedpi_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? changedpi_arrayLikeToArray(r, a) : void 0; } }
function changedpi_iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function changedpi_arrayWithoutHoles(r) { if (Array.isArray(r)) return changedpi_arrayLikeToArray(r); }
function changedpi_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Adapted by Thomas Pearce from https://github.com/shutterstock/changeDPI/, downloaded 9/29/2023

// The MIT License (MIT)
// =====================
// Copyright (c) `2018` `Shutterstock, Inc.`

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function createPngDataTable() {
  /* Table of CRCs of all 8-bit messages. */
  var crcTable = new Int32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}
function calcCrc(buf) {
  var c = -1;
  if (!pngDataTable) pngDataTable = createPngDataTable();
  for (var n = 0; n < buf.length; n++) {
    c = pngDataTable[(c ^ buf[n]) & 0xFF] ^ c >>> 8;
  }
  return c ^ -1;
}
var pngDataTable;
var PNG = 'image/png';
var JPEG = 'image/jpeg';

// those are 3 possible signature of the physBlock in base64.
// the pHYs signature block is preceed by the 4 bytes of lenght. The length of
// the block is always 9 bytes. So a phys block has always this signature:
// 0 0 0 9 p H Y s.
// However the data64 encoding aligns we will always find one of those 3 strings.
// this allow us to find this particular occurence of the pHYs block without
// converting from b64 back to string
var b64PhysSignature1 = 'AAlwSFlz';
var b64PhysSignature2 = 'AAAJcEhZ';
var b64PhysSignature3 = 'AAAACXBI';
var _P = 'p'.charCodeAt(0);
var _H = 'H'.charCodeAt(0);
var _Y = 'Y'.charCodeAt(0);
var _S = 's'.charCodeAt(0);
function changeDpiBlob(blob, dpi) {
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var headerChunk = blob.slice(0, 33);
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      var dataArray = new Uint8Array(fileReader.result);
      var tail = blob.slice(33);
      var changedArray = changeDpiOnArray(dataArray, dpi, blob.type);
      resolve(new Blob([changedArray, tail], {
        type: blob.type
      }));
    };
    fileReader.readAsArrayBuffer(headerChunk);
  });
}
function changeDpiDataUrl(base64Image, dpi) {
  var dataSplitted = base64Image.split(',');
  var format = dataSplitted[0];
  var body = dataSplitted[1];
  var type;
  var headerLength;
  var overwritepHYs = false;
  if (format.indexOf(PNG) !== -1) {
    type = PNG;
    var b64Index = detectPhysChunkFromDataUrl(body);
    // 28 bytes in dataUrl are 21bytes, length of phys chunk with everything inside.
    if (b64Index >= 0) {
      headerLength = Math.ceil((b64Index + 28) / 3) * 4;
      overwritepHYs = true;
    } else {
      headerLength = 33 / 3 * 4;
    }
  }
  if (format.indexOf(JPEG) !== -1) {
    type = JPEG;
    headerLength = 18 / 3 * 4;
  }
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var stringHeader = body.substring(0, headerLength);
  var restOfData = body.substring(headerLength);
  var headerBytes = atob(stringHeader);
  var dataArray = new Uint8Array(headerBytes.length);
  for (var i = 0; i < dataArray.length; i++) {
    dataArray[i] = headerBytes.charCodeAt(i);
  }
  var finalArray = changeDpiOnArray(dataArray, dpi, type, overwritepHYs);
  var base64Header = btoa(String.fromCharCode.apply(String, changedpi_toConsumableArray(finalArray)));
  return [format, ',', base64Header, restOfData].join('');
}
function detectPhysChunkFromDataUrl(data) {
  var b64index = data.indexOf(b64PhysSignature1);
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature2);
  }
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature3);
  }
  // if b64index === -1 chunk is not found
  return b64index;
}
function searchStartOfPhys(data) {
  var length = data.length - 1;
  // we check from the end since we cut the string in proximity of the header
  // the header is within 21 bytes from the end.
  for (var i = length; i >= 4; i--) {
    if (data[i - 4] === 9 && data[i - 3] === _P && data[i - 2] === _H && data[i - 1] === _Y && data[i] === _S) {
      return i - 3;
    }
  }
}
function changeDpiOnArray(dataArray, dpi, format, overwritepHYs) {
  if (format === JPEG) {
    dataArray[13] = 1; // 1 pixel per inch or 2 pixel per cm
    dataArray[14] = dpi >> 8; // dpiX high byte
    dataArray[15] = dpi & 0xff; // dpiX low byte
    dataArray[16] = dpi >> 8; // dpiY high byte
    dataArray[17] = dpi & 0xff; // dpiY low byte
    return dataArray;
  }
  if (format === PNG) {
    var physChunk = new Uint8Array(13);
    // chunk header pHYs
    // 9 bytes of data
    // 4 bytes of crc
    // this multiplication is because the standard is dpi per meter.
    dpi *= 39.3701;
    physChunk[0] = _P;
    physChunk[1] = _H;
    physChunk[2] = _Y;
    physChunk[3] = _S;
    physChunk[4] = dpi >>> 24; // dpiX highest byte
    physChunk[5] = dpi >>> 16; // dpiX veryhigh byte
    physChunk[6] = dpi >>> 8; // dpiX high byte
    physChunk[7] = dpi & 0xff; // dpiX low byte
    physChunk[8] = physChunk[4]; // dpiY highest byte
    physChunk[9] = physChunk[5]; // dpiY veryhigh byte
    physChunk[10] = physChunk[6]; // dpiY high byte
    physChunk[11] = physChunk[7]; // dpiY low byte
    physChunk[12] = 1; // dot per meter....

    var crc = calcCrc(physChunk);
    var crcChunk = new Uint8Array(4);
    crcChunk[0] = crc >>> 24;
    crcChunk[1] = crc >>> 16;
    crcChunk[2] = crc >>> 8;
    crcChunk[3] = crc & 0xff;
    if (overwritepHYs) {
      var startingIndex = searchStartOfPhys(dataArray);
      dataArray.set(physChunk, startingIndex);
      dataArray.set(crcChunk, startingIndex + 13);
      return dataArray;
    } else {
      // i need to give back an array of data that is divisible by 3 so that
      // dataurl encoding gives me integers, for luck this chunk is 17 + 4 = 21
      // if it was we could add a text chunk contaning some info, untill desired
      // length is met.

      // chunk structur 4 bytes for length is 9
      var chunkLength = new Uint8Array(4);
      chunkLength[0] = 0;
      chunkLength[1] = 0;
      chunkLength[2] = 0;
      chunkLength[3] = 9;
      var finalHeader = new Uint8Array(54);
      finalHeader.set(dataArray, 0);
      finalHeader.set(chunkLength, 33);
      finalHeader.set(physChunk, 37);
      finalHeader.set(crcChunk, 50);
      return finalHeader;
    }
  }
}
;// ./src/js/overlays/screenshot/screenshot.mjs
function screenshot_callSuper(t, o, e) { return o = screenshot_getPrototypeOf(o), screenshot_possibleConstructorReturn(t, screenshot_isNativeReflectConstruct() ? Reflect.construct(o, e || [], screenshot_getPrototypeOf(t).constructor) : o.apply(t, e)); }
function screenshot_possibleConstructorReturn(t, e) { if (e && ("object" == screenshot_typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return screenshot_assertThisInitialized(t); }
function screenshot_assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function screenshot_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (screenshot_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function screenshot_getPrototypeOf(t) { return screenshot_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, screenshot_getPrototypeOf(t); }
function screenshot_inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && screenshot_setPrototypeOf(t, e); }
function screenshot_setPrototypeOf(t, e) { return screenshot_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, screenshot_setPrototypeOf(t, e); }
function screenshot_typeof(o) { "@babel/helpers - typeof"; return screenshot_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, screenshot_typeof(o); }
function screenshot_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ screenshot_regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == screenshot_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(screenshot_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function screenshot_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function screenshot_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { screenshot_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { screenshot_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function screenshot_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function screenshot_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, screenshot_toPropertyKey(o.key), o); } }
function screenshot_createClass(e, r, t) { return r && screenshot_defineProperties(e.prototype, r), t && screenshot_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function screenshot_toPropertyKey(t) { var i = screenshot_toPrimitive(t, "string"); return "symbol" == screenshot_typeof(i) ? i : i + ""; }
function screenshot_toPrimitive(t, r) { if ("object" != screenshot_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != screenshot_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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







var ScreenshotOverlay = /*#__PURE__*/function () {
  /**
   * Creates an instance of the ScreenshotOverlay.
   *
   * @param {OpenSeadragon.Viewer} viewer - The OpenSeadragon viewer object.
   * @param {Object} [options]
   * @param {String} [options.downloadMessage] - A message to display in the download window
   */
  function ScreenshotOverlay(viewer, options) {
    var _this = this,
      _button$element$query;
    screenshot_classCallCheck(this, ScreenshotOverlay);
    this.viewer = viewer;
    var overlay = this.overlay = new PaperOverlay(viewer, {
      overlayType: 'viewer'
    });
    var tool = this.tool = new ScreenshotTool(this.overlay.paperScope, this);
    this.dummyTool = new this.overlay.paperScope.Tool(); //to capture things like mouseMove, keyDown etc (when actual tool is not active)
    this.dummyTool.activate();
    this._mouseNavEnabledAtActivation = true;
    var button = overlay.addViewerButton({
      faIconClass: 'fa-camera',
      tooltip: 'Take Screenshot',
      onClick: function onClick() {
        tool.active ? _this.deactivate() : _this.activate();
      }
    });
    (_button$element$query = button.element.querySelector('svg.icon')) === null || _button$element$query === void 0 || _button$element$query.style.setProperty('width', '1em');
    this._makeDialog(options); //creates this.dialog

    this.tool.addEventListener('region-selected', function (bounds) {
      return _this._setupScreenshotDialog(bounds);
    });
  }
  /**
   * Activates the overlay.
   */
  return screenshot_createClass(ScreenshotOverlay, [{
    key: "activate",
    value: function activate() {
      var reactivate = this.overlay.setOSDMouseNavEnabled(false);
      this._mouseNavEnabledAtActivation = this._mouseNavEnabledAtActivation || reactivate;
      this.overlay.bringToFront();
      this.tool.activate();
    }
    /**
     * Deactivates the overlay.
     */
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.dialog.classList.add('hidden');
      this.tool.deactivate(true);
      this.dummyTool.activate();
      this.overlay.setOSDMouseNavEnabled(this._mouseNavEnabledAtActivation);
      this._mouseNavEnabledAtActivation = false;
      this.overlay.sendToBack();
    }
  }, {
    key: "_startRegion",
    value: function _startRegion() {
      this.dialog.classList.add('hidden');
      this.tool.activate();
    }
  }, {
    key: "_makeDialog",
    value: function _makeDialog(options) {
      var _this2 = this;
      var html = "<div class=\"screenshot-dialog hidden\">\n            <div class=\"size\">\n                <h3>Aspect Ratio</h3>\n                <label>Lock</label><input class=\"lock-aspect-ratio\" type=\"checkbox\"/>\n                <input type=\"number\" min=\"0\" value=\"1\" class=\"aspect-width\"/> x <input type=\"number\" min=\"0\" value=\"1\" class=\"aspect-height\"/>\n                <button class=\"apply-aspect-ratio\">Apply</button>\n            </div>\n            <hr>\n            <div>\n                <h3>Selected Region</h3>\n                <div class=\"size\">\n                    <div><input class=\"region-width region-dim\" type=\"number\" min=\"0\"/> x <input class=\"region-height region-dim\" type=\"number\" min=\"0\"/> px \n                    (<span class=\"region-width-mm\"></span> x <span class=\"region-height-mm\"></span> mm)</div>\n                </div>\n                <div class=\"scalebar\">\n                    <label>Include scale bar:</label> <input class=\"include-scalebar\"type=\"checkbox\">\n                    <div class=\"scalebar-opts\">\n                    <p>Enter desired scale bar width in millimeters and height in pixels.<br>Width will be rounded to the nearest pixel.</p>\n                    <label>Width (mm):</label><input class=\"scalebar-width\" type=\"number\" min=\"0.001\" step=\"0.01\">\n                    <label>Height (px):</label><input class=\"scalebar-height\" type=\"number\" min=\"1\" step=\"1\">\n                    </div>\n                </div> \n            <div>\n            <hr>\n            <div class=\"screenshot-results\">\n                <div class=\"instructions\">\n                    <h3>Create your screenshot</h3>\n                    <div>\n                        <label>Select size:</label>\n                        <select class=\"select-size\"></select>\n                        <button class=\"create-screenshot\">Create</button>\n                    </div>\n                    \n                </div>\n                <div class=\"download\">\n                    <h3>View/Download</h3>\n                    <div class=\"download-message\">".concat((options === null || options === void 0 ? void 0 : options.downloadMessage) || '', "</div>\n                    <div><a class=\"open-screenshot screenshot-link\" target=\"_blank\"><button>Open in new tab</button></a> | \n                    <a class=\"download-screenshot screenshot-link\" download=\"screenshot.png\"><button>Download</button></a></div>\n                    <div><button class=\"cancel-screenshot\">Change size</button></div>\n                </div>\n                <div class=\"pending-message\"><h3>View/Download</h3>\n                Creating your screenshot...\n                <div class=\"screenshot-progress\">\n                    <progress></progress>\n                    <div>Loaded <span class=\"loaded\"></span> of <span class=\"total\"><span> tiles</div>\n                </div>\n                <div><button class=\"cancel-screenshot\">Change size</button></div>\n                </div>\n            </div>\n            <hr>\n            <button class='rect'>Select a new area</button> | <button class='close'>Close</button>\n        </div>");
      var css = "<style data-type=\"screenshot-tool\">\n            .screenshot-dialog{\n                position: absolute;\n                top: 50%;\n                left: 50%;\n                transform: translate(-50%, -50%);\n                padding: 1em;\n                border: thin black solid;\n                background-color: white;\n                color: black;\n            }\n            .screenshot-dialog.hidden{\n                display:none;\n            }\n            .screenshot-dialog h3{\n                margin: 0.1em 0;\n            }\n            .screenshot-dialog input[type=number]{\n                width: 5em;\n            }\n            .screenshot-results>*{\n                display:none;\n                min-height:6em;\n            }\n            .screenshot-results.created .download{\n                display:block;\n            }\n            .screenshot-results.pending .pending-message{\n                display:block;\n            }\n            .screenshot-results:not(.created):not(.pending) .instructions{\n                display:block;\n            }\n            .screenshot-link{\n                display:inline-block;\n                margin-bottom: 0.5em;\n            }\n            .screenshot-dialog .download-message:not(:empty){\n                margin-bottom:1em;\n            }\n            .scalebar-opts.hidden{\n                visibility:hidden;\n            }\n        </style>";
      if (!document.querySelector('style[data-type="screenshot-tool"]')) {
        document.querySelector('head').appendChild(domObjectFromHTML(css));
      }
      var el = domObjectFromHTML(html);
      this.viewer.container.appendChild(el);
      el.addEventListener('mousemove', function (ev) {
        return ev.stopPropagation();
      });
      el.querySelectorAll('.close').forEach(function (e) {
        return e.addEventListener('click', function () {
          return _this2.deactivate();
        });
      });
      el.querySelectorAll('.rect').forEach(function (e) {
        return e.addEventListener('click', function () {
          return _this2._startRegion();
        });
      });
      el.querySelectorAll('.cancel-screenshot').forEach(function (e) {
        return e.addEventListener('click', function () {
          return el.querySelector('.screenshot-results').classList.remove('pending', 'created');
        });
      });
      el.querySelectorAll('.create-screenshot').forEach(function (e) {
        return e.addEventListener('click', function () {
          var sel = el.querySelector('.select-size');
          var selectedOption = sel.options[sel.selectedIndex];
          var data = JSON.parse(selectedOption.getAttribute('data-dims'));
          _this2.dialog.querySelector('.screenshot-results').classList.add('pending');
          _this2._createScreenshot(data).then(function (blobURL) {
            var x = _this2.dialog.querySelector('.screenshot-results');
            x.classList.remove('pending');
            x.classList.add('created');
            _this2.dialog.querySelector('.screenshot-link').href = _this2.blobURL;
          })["catch"](function (e) {
            alert('There was a problem creating the screenshot. ' + e);
          });
        });
      });
      el.querySelectorAll('button.download-screenshot').forEach(function (e) {
        return e.addEventListener('click', function () {
          var a = el.querySelectorAll('a.download-screenshot');
          a.dispatchEvent(new Event('change'));
        });
      });
      el.querySelectorAll('.aspect-width').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          return _this2.tool.setAspectWidth(Number(ev.target.value));
        });
        e.dispatchEvent(new Event('change'));
      });
      el.querySelectorAll('.aspect-height').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          return _this2.tool.setAspectHeight(Number(ev.target.value));
        });
        e.dispatchEvent(new Event('change'));
      });
      el.querySelectorAll('.lock-aspect-ratio').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          return _this2.tool.setAspectLocked(ev.target.checked);
        });
        e.dispatchEvent(new Event('change'));
      });
      el.querySelectorAll('.apply-aspect-ratio').forEach(function (e) {
        return e.addEventListener('click', function (ev) {
          return _this2._applyAspectRatio();
        });
      });
      el.querySelectorAll('.region-dim').forEach(function (e) {
        return e.addEventListener('change', function () {
          return _this2._updateROI();
        });
      });
      el.querySelectorAll('.scalebar-width').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          return _this2._scalebarWidth = Number(ev.target.value);
        }, _this2._resetScreenshotResults());
        e.dispatchEvent(new Event('change'));
      });
      el.querySelectorAll('.scalebar-height').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          return _this2._scalebarHeight = Number(ev.target.value);
        }, _this2._resetScreenshotResults());
        e.dispatchEvent(new Event('change'));
      });
      el.querySelectorAll('.include-scalebar').forEach(function (e) {
        e.addEventListener('change', function (ev) {
          _this2._includeScalebar = ev.target.checked;
          var opts = el.querySelector('.scalebar-opts');
          _this2._includeScalebar ? opts.classList.remove('hidden') : opts.classList.add('hidden');
          _this2._resetScreenshotResults();
        });
        e.dispatchEvent(new Event('change'));
      });
      this.dialog = el;
    }
  }, {
    key: "_updateROI",
    value: function _updateROI() {
      var w = this.dialog.querySelector('.region-width').value;
      var h = this.dialog.querySelector('.region-height').value;
      this._currentBounds.width = Number(w);
      this._currentBounds.height = Number(h);
      this._setupScreenshotDialog(this._currentBounds);
      if (this.dialog.querySelector('.lock-aspect-ratio').checked) {
        this._applyAspectRatio();
      }
    }
  }, {
    key: "_applyAspectRatio",
    value: function _applyAspectRatio() {
      // adjust by the smallest amount to match the aspect ratio
      var currentRatio = this._currentBounds.width / this._currentBounds.height;
      var desiredRatio = this.tool._aspectWidth / this.tool._aspectHeight;
      if (currentRatio / desiredRatio > 1) {
        this._currentBounds.width = Math.round(this._currentBounds.height * desiredRatio);
        this._setupScreenshotDialog(this._currentBounds);
      } else if (currentRatio / desiredRatio < 1) {
        this._currentBounds.height = Math.round(this._currentBounds.width / desiredRatio);
        this._setupScreenshotDialog(this._currentBounds);
      }
    }
  }, {
    key: "_setupScreenshotDialog",
    value: function _setupScreenshotDialog(bounds) {
      // this.tool.deactivate();
      this._resetScreenshotResults();
      this._currentBounds = bounds;
      this.dialog.querySelector('.region-width').value = bounds.width;
      this.dialog.querySelector('.region-height').value = bounds.height;
      var vp = this.viewer.viewport;
      var ti = this.viewer.world.getItemAt(this.viewer.currentPage());
      var boundsRect = new osd.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
      var viewportRect = vp.viewerElementToViewportRectangle(boundsRect);
      var imageBounds = vp.viewportToImageRectangle(viewportRect);
      var scaleFactor = Math.max(imageBounds.width, imageBounds.height) / Math.max(boundsRect.width, boundsRect.height);
      var imageRect = {
        width: boundsRect.width * scaleFactor,
        height: boundsRect.height * scaleFactor
      };
      var calculated_mm = false;
      this._mpp = null;
      this.dialog.querySelector('.include-scalebar').disabled = true;
      if (this.viewer.world.getItemCount() === 1) {
        var mpp = this.viewer.world.getItemAt(0).source.mpp;
        if (mpp) {
          this.dialog.querySelector('.region-width-mm').textContent = '' + (mpp.x / 1000 * imageRect.width).toFixed(3);
          this.dialog.querySelector('.region-height-mm').textContent = '' + (mpp.y / 1000 * imageRect.height).toFixed(3);
          calculated_mm = true;
          this.dialog.querySelector('.include-scalebar').disabled = false;
          this._mpp = mpp;
        }
      }
      if (!calculated_mm) {
        this.dialog.querySelectorAll('.region-width-mm, .region-height-mm').forEach(function (e) {
          return e.textContent = '??';
        });
      }
      var select = this.dialog.querySelector('.select-size');
      select.textContent = '';
      var w = imageRect.width;
      var h = imageRect.height;
      var maxDim = 23767;
      var maxArea = 268435456;
      while (w > bounds.width && h > bounds.height) {
        var _data = {
          w: Math.round(w),
          h: Math.round(h),
          imageBounds: imageBounds,
          scaleFactor: w / imageRect.width
        };
        var _option = document.createElement('option');
        select.appendChild(_option);
        _option.textContent = "".concat(Math.round(w), " x ").concat(Math.round(h));
        _option.setAttribute('data-dims', JSON.stringify(_data));
        if (w > maxDim || h > maxDim || w * h > maxArea) {
          // if the canvas is too big, don't even offer it as an option
          _option.setAttribute('disabled', true);
        }
        w = w / 2;
        h = h / 2;
      }
      var data = {
        w: bounds.width,
        h: bounds.height,
        imageBounds: imageBounds,
        scaleFactor: bounds.width / imageRect.width
      };
      var option = document.createElement('option');
      select.appendChild(option);
      option.textContent = "".concat(Math.round(w), " x ").concat(Math.round(h));
      option.setAttribute('data-dims', JSON.stringify(data));
      this.dialog.classList.remove('hidden');
    }
  }, {
    key: "_resetScreenshotResults",
    value: function _resetScreenshotResults() {
      var _this$dialog;
      (_this$dialog = this.dialog) === null || _this$dialog === void 0 || _this$dialog.querySelector('.screenshot-results').classList.remove('created', 'pending');
    }
  }, {
    key: "_setProgress",
    value: function _setProgress(loaded, total) {
      if (this.dialog) {
        var progress = this.dialog.querySelector('progress');
        progress.value = loaded;
        progress.max = total;
        this.dialog.querySelector('.loaded').textContent = loaded;
        this.dialog.querySelector('.total').textContent = total;
      }
    }
  }, {
    key: "_createScreenshot",
    value: function _createScreenshot(data) {
      var _this3 = this;
      var w = data.w;
      var h = data.h;
      var ib = data.imageBounds;
      var imageBounds = new osd.Rect(ib.x, ib.y, ib.width, ib.height, ib.degrees);
      var scaleFactor = data.scaleFactor;
      return new Promise(function (resolve, reject) {
        try {
          //make div for new viewer
          var pixelRatio = osd.pixelDensityRatio;
          w = w / pixelRatio;
          h = h / pixelRatio;
          var d = document.createElement('div');
          document.body.appendChild(d);
          d.style.cssText = "width:".concat(w, "px;height:").concat(h, "px;position:fixed;left:-").concat(w * 2, "px;");
          var ts = _this3.viewer.tileSources[_this3.viewer.currentPage()];
          var ti = _this3.viewer.world.getItemAt(_this3.viewer.currentPage());
          var ssViewer = osd({
            element: d,
            tileSources: [ts],
            crossOriginPolicy: _this3.viewer.crossOriginPolicy,
            prefixUrl: _this3.viewer.prefixUrl,
            immediateRender: true
          });
          ssViewer.viewport.setRotation(_this3.viewer.viewport.getRotation(true), true);
          ssViewer.addHandler('tile-drawn', function (ev) {
            // console.log(ev.tiledImage.coverage, ev.tile.level, ev.tile.x, ev.tile.y);
            var coverage = ev.tiledImage.coverage;
            var levels = Object.keys(coverage);
            var maxLevel = levels[levels.length - 1];
            if (ev.tile.level == maxLevel) {
              var full = coverage[maxLevel];
              var status = Object.values(full).map(function (o) {
                return Object.values(o);
              }).flat();
              // console.log(`Loaded ${loaded.filter(l=>l).length} of ${loaded.length} tiles`);
              _this3._setProgress(status.filter(function (x) {
                return x;
              }).length, status.length);
            }
          });
          ssViewer.addHandler('open', function () {
            ssViewer.world.getItemAt(0).setRotation(ti.getRotation(true), true);
            ssViewer.world.getItemAt(0).addOnceHandler('fully-loaded-change', function (ev) {
              // draw scalebar if requested
              if (_this3._includeScalebar && _this3._mpp) {
                var pixelWidth = Math.round(_this3._scalebarWidth * 1000 / _this3._mpp.x * scaleFactor);
                var pixelHeight = Math.round(_this3._scalebarHeight);
                var canvas = ssViewer.drawer.canvas;
                var context = canvas.getContext('2d');
                var canvasWidth = canvas.width;
                var canvasHeight = canvas.height;
                context.fillRect(canvasWidth - pixelHeight, canvasHeight - pixelHeight, -pixelWidth, -pixelHeight);
              }
              ssViewer.drawer.canvas.toBlob(/*#__PURE__*/function () {
                var _ref = screenshot_asyncToGenerator(/*#__PURE__*/screenshot_regeneratorRuntime().mark(function _callee(blob) {
                  var container;
                  return screenshot_regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        if (!(pixelRatio != 1)) {
                          _context.next = 4;
                          break;
                        }
                        _context.next = 3;
                        return changeDpiBlob(blob, 96 * pixelRatio);
                      case 3:
                        blob = _context.sent;
                      case 4:
                        if (_this3.blobURL) {
                          URL.revokeObjectURL(_this3.blobURL);
                        }
                        _this3.blobURL = URL.createObjectURL(blob);
                        resolve(_this3.blobURL);
                        container = ssViewer.element;
                        ssViewer.destroy();
                        container.remove();
                      case 10:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }());
            });
            // ssViewer.viewport.panTo(bounds.getCenter(), true);
            var bounds = ssViewer.viewport.imageToViewportRectangle(imageBounds);
            ssViewer.viewport.fitBounds(bounds);
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }]);
}();
/**
 * @class 
 * @extends ToolBase
 * 
 */
var ScreenshotTool = /*#__PURE__*/function (_ToolBase) {
  function ScreenshotTool(paperScope, overlay) {
    var _this4;
    screenshot_classCallCheck(this, ScreenshotTool);
    _this4 = screenshot_callSuper(this, ScreenshotTool, [paperScope]);
    var self = _this4;
    _this4._ps = paperScope;
    _this4.compoundPath = new _paper.CompoundPath({
      children: [],
      fillRule: 'evenodd'
    });
    _this4.compoundPath.visible = false;
    _this4.compoundPath.fillColor = 'black';
    _this4.compoundPath.opacity = 0.3;
    _this4.project.toolLayer.addChild(_this4.compoundPath);
    _this4.crosshairTool = new _paper.Group();
    var h1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    var h2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    var v1 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'black'
    });
    var v2 = new _paper.Path({
      segments: [new _paper.Point(0, 0), new _paper.Point(0, 0)],
      strokeScaling: false,
      strokeWidth: 1,
      strokeColor: 'white',
      dashArray: [6, 6]
    });
    _this4.crosshairTool.addChildren([h1, h2, v1, v2]);
    _this4.project.toolLayer.addChild(_this4.crosshairTool);
    _this4.crosshairTool.visible = false;
    _this4._aspectHeight = 1;
    _this4._aspectWidth = 1;
    _this4._aspectLocked = false;

    //add properties to this.tools so that they properly appear on html
    _this4.tool.onMouseDown = function (ev) {
      _this4.crosshairTool.visible = false;
      _this4.compoundPath.visible = true;
      _this4.compoundPath.removeChildren();
      _this4.compoundPath.addChild(new _paper.Path.Rectangle(_this4._ps.view.bounds));
      window.cp = _this4.compoundPath;
    };
    _this4.tool.onMouseDrag = function (ev) {
      _this4.compoundPath.removeChildren(1);
      var point = _this4.getPoint(ev);
      _this4.compoundPath.addChild(new _paper.Path.Rectangle(ev.downPoint, point));
    };
    _this4.tool.onMouseMove = function (ev) {
      _this4.crosshairTool.visible = true;
      setCursorPosition(self.tool, ev.point);
    };
    _this4.tool.onMouseUp = function (ev) {
      var point = _this4.getPoint(ev);
      _this4.broadcast('region-selected', new _paper.Rectangle(ev.downPoint, point));
      // this.compoundPath.visible = false;
    };
    _this4.tool.extensions.onKeyDown = function (ev) {
      if (ev.key == 'escape') {
        overlay.deactivate();
      }
    };
    _this4.extensions.onActivate = function () {
      _this4.crosshairTool.visible = true;
      _this4.compoundPath.visible = false;
    };
    _this4.extensions.onDeactivate = function (finished) {
      _this4.crosshairTool.visible = false;
      _this4.compoundPath.visible = false;
    };
    function setCursorPosition(tool, point) {
      var pt = tool.view.projectToView(point);
      var left = tool.view.viewToProject(new _paper.Point(0, pt.y));
      var right = tool.view.viewToProject(new _paper.Point(tool.view.viewSize.width, pt.y));
      var top = tool.view.viewToProject(new _paper.Point(pt.x, 0));
      var bottom = tool.view.viewToProject(new _paper.Point(pt.x, tool.view.viewSize.height));
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
    return _this4;
  }
  screenshot_inherits(ScreenshotTool, _ToolBase);
  return screenshot_createClass(ScreenshotTool, [{
    key: "activate",
    value: function activate() {
      this.tool.activate();
      this.crosshairTool.visible = true;
      this.compoundPath.visible = false;
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.crosshairTool.visible = false;
      this.compoundPath.visible = false;
    }
  }, {
    key: "setAspectHeight",
    value: function setAspectHeight(h) {
      this._aspectHeight = h;
    }
  }, {
    key: "setAspectWidth",
    value: function setAspectWidth(w) {
      this._aspectWidth = w;
    }
  }, {
    key: "setAspectLocked",
    value: function setAspectLocked(l) {
      this._aspectLocked = l;
    }
  }, {
    key: "getPoint",
    value: function getPoint(ev) {
      var point = ev.point;
      if (this._aspectLocked) {
        var delta = ev.point.subtract(ev.downPoint);
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
          point.y = ev.downPoint.y + (delta.y < 0 ? -1 : 1) * Math.abs(delta.x) * this._aspectHeight / this._aspectWidth;
        } else {
          point.x = ev.downPoint.x + (delta.x < 0 ? -1 : 1) * Math.abs(delta.y) * this._aspectWidth / this._aspectHeight;
        }
      }
      return point;
    }
  }]);
}(ToolBase);


;// ./src/js/osdpaperjsannotation.mjs
/**
 * OpenSeadragon paperjs overlay plugin based on paper.js
 * @version 0.4.13
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

// import './importcss.mjs';



























/**
 *
 * This is a namespace that contains documentation elements belonging to OSDPaperJSAnnotation
 *
 * @namespace OSDPaperjsAnnotation
 */

var OSDPaperjsAnnotation = {
  AnnotationToolkit: AnnotationToolkit,
  AnnotationToolbar: AnnotationToolbar,
  FeatureCollectionUI: FeatureCollectionUI,
  FeatureUI: FeatureUI,
  FileDialog: FileDialog,
  LayerUI: LayerUI,
  PaperOffset: PaperOffset,
  PaperOverlay: PaperOverlay,
  RotationControlOverlay: RotationControlOverlay,
  ScreenshotOverlay: ScreenshotOverlay,
  AnnotationUITool: AnnotationUITool,
  ToolBase: ToolBase,
  BrushTool: BrushTool,
  DefaultTool: DefaultTool,
  EllipseTool: EllipseTool,
  LinestringTool: LinestringTool,
  PointTool: PointTool,
  PointTextTool: PointTextTool,
  PolygonTool: PolygonTool,
  RasterTool: RasterTool,
  RectangleTool: RectangleTool,
  SelectTool: SelectTool,
  StyleTool: StyleTool,
  TransformTool: TransformTool,
  WandTool: WandTool
};

// export various classes and functions so they can be imported by name

var __webpack_exports__AnnotationToolbar = __webpack_exports__.jG;
var __webpack_exports__AnnotationToolkit = __webpack_exports__.yV;
var __webpack_exports__AnnotationUITool = __webpack_exports__.YV;
var __webpack_exports__BrushTool = __webpack_exports__.ls;
var __webpack_exports__DefaultTool = __webpack_exports__.Ge;
var __webpack_exports__EllipseTool = __webpack_exports__.dH;
var __webpack_exports__FeatureCollectionUI = __webpack_exports__.fy;
var __webpack_exports__FeatureUI = __webpack_exports__.$_;
var __webpack_exports__FileDialog = __webpack_exports__.fm;
var __webpack_exports__LayerUI = __webpack_exports__.Wi;
var __webpack_exports__LinestringTool = __webpack_exports__.KW;
var __webpack_exports__PaperOffset = __webpack_exports__.Cz;
var __webpack_exports__PaperOverlay = __webpack_exports__.Fv;
var __webpack_exports__PointTextTool = __webpack_exports__.Mf;
var __webpack_exports__PointTool = __webpack_exports__.L_;
var __webpack_exports__PolygonTool = __webpack_exports__.tD;
var __webpack_exports__RasterTool = __webpack_exports__.Ue;
var __webpack_exports__RectangleTool = __webpack_exports__.Sk;
var __webpack_exports__RotationControlOverlay = __webpack_exports__.M$;
var __webpack_exports__ScreenshotOverlay = __webpack_exports__.RV;
var __webpack_exports__SelectTool = __webpack_exports__.HA;
var __webpack_exports__StyleTool = __webpack_exports__.wN;
var __webpack_exports__ToolBase = __webpack_exports__.YQ;
var __webpack_exports__TransformTool = __webpack_exports__.Bg;
var __webpack_exports__WandTool = __webpack_exports__.FY;
export { __webpack_exports__AnnotationToolbar as AnnotationToolbar, __webpack_exports__AnnotationToolkit as AnnotationToolkit, __webpack_exports__AnnotationUITool as AnnotationUITool, __webpack_exports__BrushTool as BrushTool, __webpack_exports__DefaultTool as DefaultTool, __webpack_exports__EllipseTool as EllipseTool, __webpack_exports__FeatureCollectionUI as FeatureCollectionUI, __webpack_exports__FeatureUI as FeatureUI, __webpack_exports__FileDialog as FileDialog, __webpack_exports__LayerUI as LayerUI, __webpack_exports__LinestringTool as LinestringTool, __webpack_exports__PaperOffset as PaperOffset, __webpack_exports__PaperOverlay as PaperOverlay, __webpack_exports__PointTextTool as PointTextTool, __webpack_exports__PointTool as PointTool, __webpack_exports__PolygonTool as PolygonTool, __webpack_exports__RasterTool as RasterTool, __webpack_exports__RectangleTool as RectangleTool, __webpack_exports__RotationControlOverlay as RotationControlOverlay, __webpack_exports__ScreenshotOverlay as ScreenshotOverlay, __webpack_exports__SelectTool as SelectTool, __webpack_exports__StyleTool as StyleTool, __webpack_exports__ToolBase as ToolBase, __webpack_exports__TransformTool as TransformTool, __webpack_exports__WandTool as WandTool };

//# sourceMappingURL=main.mjs.map