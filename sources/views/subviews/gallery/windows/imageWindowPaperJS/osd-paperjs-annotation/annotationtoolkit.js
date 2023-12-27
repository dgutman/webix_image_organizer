// Based on:
// annotationtookit.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/src/js/annotationtoolkit.mjs

/**
 * OpenSeadragon annotation plugin based on paper.js
 * @version 0.1.2
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

import {PaperOverlay} from "./paper-overlay";
import {AnnotationItemFactory} from "./paperitems/annotationitem";
import {Ellipse} from "./paperitems/ellipse";
import {Linestring} from "./paperitems/linestring";
import {MultiLinestring} from "./paperitems/multilinestring";
import {MultiPolygon} from "./paperitems/multipolygon";
import {Placeholder} from "./paperitems/placeholder";
import {Point} from "./paperitems/point";
import {PointText} from "./paperitems/pointtext";
import {Raster} from "./paperitems/raster";
import {Rectangle} from "./paperitems/rectangle";

// to do:
// - Add configuration options (as a class, modeled after OpenSeadragon??)
// --- Document configuration options. JSDocs?

// extend paper prototypes to add functionality
// property definitions
Object.defineProperty(paper.Item.prototype, "hierarchy", hierarchyDef());
Object.defineProperty(paper.Item.prototype, "descendants", descendantsDef());
Object.defineProperty(paper.Item.prototype, "displayName", displayNamePropertyDef());
Object.defineProperty(paper.Item.prototype, "fillOpacity", itemFillOpacityPropertyDef());
Object.defineProperty(paper.Item.prototype, "strokeOpacity", itemStrokeOpacityPropertyDef());
Object.defineProperty(paper.Item.prototype, "rescale", itemRescalePropertyDef());
Object.defineProperty(paper.Style.prototype, "fillOpacity", fillOpacityPropertyDef());
Object.defineProperty(paper.Style.prototype, "strokeOpacity", strokeOpacityPropertyDef());
Object.defineProperty(paper.Style.prototype, "rescale", rescalePropertyDef());
Object.defineProperty(paper.CompoundPath.prototype, "descendants", descendantsDefCompoundPath());// this must come after the Item prototype def to override it
Object.defineProperty(paper.Project.prototype, "hierarchy", hierarchyDef());
Object.defineProperty(paper.Project.prototype, "descendants", descendantsDefProject());
Object.defineProperty(paper.Project.prototype, "fillOpacity", itemFillOpacityPropertyDef());
Object.defineProperty(paper.View.prototype, "fillOpacity", viewFillOpacityPropertyDef());
Object.defineProperty(paper.View.prototype, "_fillOpacity", {value: 1, writable: true});// initialize to opaque
Object.defineProperty(paper.Project.prototype, "strokeOpacity", itemStrokeOpacityPropertyDef());
Object.defineProperty(paper.TextItem.prototype, "content", textItemContentPropertyDef());

// extend remove function to emit events for GeoJSON type annotation objects
let origRemove = paper.Item.prototype.remove;
paper.Item.prototype.remove = function() {
	(this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.project.emit("item-removed", {item: this});
	origRemove.call(this);
	(this.isGeoJSONFeature || this.isGeoJSONFeatureCollection) && this.emit("removed", {item: this});
};
// function definitions
paper.Group.prototype.insertChildren = getInsertChildrenDef();
paper.Color.prototype.toJSON = paper.Color.prototype.toCSS;// for saving/restoring colors as JSON
paper.Style.prototype.toJSON = styleToJSON;
paper.Style.prototype.set = styleSet;
paper.View.prototype.getImageData = paperViewGetImageData;
paper.View.prototype._multiplyOpacity = true;
paper.PathItem.prototype.toCompoundPath = toCompoundPath;
paper.PathItem.prototype.applyBounds = applyBounds;
paper.Item.prototype.select = paperItemSelect;
paper.Item.prototype.deselect = paperItemDeselect;
paper.Item.prototype.toggle = paperItemToggle;
paper.Item.prototype.updateFillOpacity = updateFillOpacity;
paper.Item.prototype.updateStrokeOpacity = updateStrokeOpacity;
paper.Project.prototype.updateFillOpacity = updateFillOpacity;
// to do: should these all be installed on project instead of scope?
paper.PaperScope.prototype.findSelectedNewItem = findSelectedNewItem;
paper.PaperScope.prototype.findSelectedItems = findSelectedItems;
paper.PaperScope.prototype.findSelectedItem = findSelectedItem;
paper.PaperScope.prototype.createFeatureCollectionLayer = createFeatureCollectionLayer;
paper.PaperScope.prototype.scaleByCurrentZoom = function (v) { return v / this.view.getZoom(); };
// eslint-disable-next-line max-len
paper.PaperScope.prototype.getActiveTool = function () { return this.tool ? this.tool._toolObject : null; };

/**
 * A class for creating and managing annotation tools on an OpenSeadragon viewer.
 * @class
 * @memberof OSDPaperjsAnnotation
 * @extends OpenSeadragon.EventSource
 */
class AnnotationToolkit extends OpenSeadragon.EventSource {
	/**
     * Create a new AnnotationToolkit instance.
     * @constructor
     * @param {OpenSeadragon.Viewer} openSeadragonViewer - The OpenSeadragon viewer object.
     * @param {object} [opts] - The configuration options(not yet supported).
     */
	constructor(openSeadragonViewer, opts) {
		super();
		// TO DO: make the options object actually do something
		if (opts) {
			console.warn("Configuration options for AnnotationToolkit are not yet supported");
		}

		this._defaultStyle = {
			fillColor: new paper.Color("white"),
			strokeColor: new paper.Color("black"),
			fillOpacity: 0.1,
			strokeOpacity: 1,
			strokeWidth: 1,
			rescale: {
				strokeWidth: 1
			}
		};
		this.viewer = openSeadragonViewer;

		this.viewer.addOnceHandler("close", () => this.destroy()); // TO DO: make this an option, not a hard-coded default

		this.overlay = new PaperOverlay(this.viewer);

		this.overlay.paperScope.project.defaultStyle = new paper.Style();
		this.overlay.paperScope.project.defaultStyle.set(this.defaultStyle);
		this.overlay.autoRescaleItems(true);

		// OpenSeadragon.extend(AnnotationToolkit.prototype, OpenSeadragon.EventSource.prototype);
		// OpenSeadragon.EventSource.call(this);

		this.viewer.annotationToolkit = this;

		AnnotationItemFactory.register(MultiPolygon);
		AnnotationItemFactory.register(Placeholder);
		AnnotationItemFactory.register(Linestring);
		AnnotationItemFactory.register(MultiLinestring);
		AnnotationItemFactory.register(Raster);
		AnnotationItemFactory.register(Point);
		AnnotationItemFactory.register(PointText);
		AnnotationItemFactory.register(Rectangle);
		AnnotationItemFactory.register(Ellipse);

		paper.Item.fromGeoJSON = AnnotationItemFactory.itemFromGeoJSON;
		paper.Item.fromAnnotationItem = AnnotationItemFactory.itemFromAnnotationItem;
	}

	/**
     * Get the default style for the annotation items.
     *
     * @returns {object} The default style object.
     */
	get defaultStyle() {
		return this._defaultStyle;
	}

	/**
     * Destroy the toolkit and its components.
     */
	destroy() {
		this.raiseEvent("before-destroy");
		let tool = this.overlay.paperScope && this.overlay.paperScope.getActiveTool();
		if (tool) tool.deactivate(true);

		this.viewer.annotationToolkit = null;
		this._annotationUI && this._annotationUI.destroy();
		this.overlay.destroy();
	}

	/**
     * Close the toolkit and remove its feature collections.
     */
	close() {
		this.raiseEvent("before-close");
		let tool = this.overlay.paperScope && this.overlay.paperScope.getActiveTool();
		if (tool) tool.deactivate(true);

		this.addFeatureCollections([], true);
	}

	/**
     * Set the global visibility of the toolkit.
     * @param {boolean} [show=false] - Whether to show or hide the toolkit.
     */
	setGlobalVisibility(show = false) {
		this.overlay.paperScope.view._element.setAttribute("style", "visibility:" + (show ? "visible;" : "hidden;"));
	}

	/**
     * Add feature collections to the toolkit from GeoJSON objects.
     * @param {object[]} featureCollections - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     */
	addFeatureCollections(featureCollections, replaceCurrent) {
		this.loadGeoJSON(featureCollections, replaceCurrent);
		this.overlay.rescaleItems();
		this.overlay.paperScope.project.emit("items-changed");
	}

	/**
     * Get the feature collection layers in the toolkit.
     * @returns {paper.Layer[]} The array of paper layer objects representing feature collections.
     */
	getFeatureCollectionLayers() {
		return this.overlay.paperScope.project.layers.filter(l => l.isGeoJSONFeatureCollection);
	}

	/**
     * Get the features in the toolkit.
     * @returns {paper.Item[]} The array of paper item objects representing features.
     */
	getFeatures() {
		return this.overlay.paperScope.project.getItems({match: i => i.isGeoJSONFeature});
	}

	/**
     * Convert the feature collections in the toolkit to GeoJSON objects.
     * @returns {object[]} The array of GeoJSON objects representing feature collections.
     */
	toGeoJSON() {
		// find all featureCollection items and convert to GeoJSON compatible structures
		return this.overlay.paperScope.project.getItems({match: i => i.isGeoJSONFeatureCollection}).map(layer => {
			let geoJSON = {
				type: "FeatureCollection",
				features: layer.descendants.filter(d => d.annotationItem).map(d => d.annotationItem.toGeoJSONFeature()),
				properties: {
					defaultStyle: layer.defaultStyle.toJSON(),
					userdata: layer.userdata
				},
				label: layer.displayName
			};
			return geoJSON;
		});
	}

	/**
     * Convert the feature collections in the toolkit to a JSON string.
     * @param {function} [replacer] - The replacer function for JSON.stringify().
     * @param {number|string} [space] - The space argument for JSON.stringify().
     * @returns {string} The JSON string representing the feature collections.
     */
	toGeoJSONString(replacer, space) {
		return JSON.stringify(this.toGeoJSON(), replacer, space);
	}

	/**
     * Load feature collections from GeoJSON objects and add them to the toolkit.
     * @param {object[]} geoJSON - The array of GeoJSON objects representing feature collections.
     * @param {boolean} replaceCurrent - Whether to replace the current feature collections or not.
     */
	loadGeoJSON(geoJSON, replaceCurrent) {
		if (replaceCurrent) {
			this.overlay.paperScope.project.getItems({match: i => i.isGeoJSONFeatureCollection}).forEach(layer => layer.remove());
		}
		if (!Array.isArray(geoJSON)) {
			geoJSON = [geoJSON];
		}
		geoJSON.forEach(obj => {
			if (obj.type == "FeatureCollection") {
				let layer = this.overlay.paperScope.createFeatureCollectionLayer(obj.label);
				let props = (obj.properties || {});
				layer.userdata = Object.assign({}, props.userdata);
				layer.defaultStyle.set(props.defaultStyle);
				obj.features.forEach(feature => {
					let item = paper.Item.fromGeoJSON(feature);
					layer.addChild(item);
				});
			}
			else {
				console.warn("GeoJSON object not loaded: wrong type. Only FeatureCollection objects are currently supported");
			}
		});
	}
};

export {AnnotationToolkit as AnnotationToolkit};


// private functions

/**
 * Create a compound path from a path item.
 * @private
 * @returns {paper.CompoundPath} The compound path object.
 */
function toCompoundPath() {
	if (this.constructor !== paper.CompoundPath) {
		let np = new paper.CompoundPath({children: [this], fillRule: "evenodd"});
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
	if (boundingItems.length == 0)
		return;
	let intersection;
	if (boundingItems.length == 1) {
		let bounds = boundingItems[0];
		intersection = bounds.intersect(this, {insert: false});
	}
	else if (bounding.length > 1) {
		let bounds = new paper.CompoundPath(bounding.map(b => b.clone().children).flat());
		intersection = bounds.intersect(this, {insert: false});
		bounds.remove();
	}
	if (this.children) {
		// compound path
		this.removeChildren();
		this.addChildren(intersection.children ? intersection.children : [intersection]);
	}
	else {
		// simple path
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
		this.project._scope.findSelectedItems().forEach(item => item.deselect());
	}
	this.selected = true;
	this.emit("selected");
	this.project.emit("item-selected", {item: this});
}
/**
 * Deselect a paper item and emit events.
 * @private
 * @param {boolean} [keepOtherSelectedItems=false] - Whether to keep other selected items or not.
 */
function paperItemDeselect(keepOtherSelectedItems) {
	if (!keepOtherSelectedItems) {
		this.project._scope.findSelectedItems().forEach(item => item.deselect(true));
		return;
	}
	this.selected = false;
	this.emit("deselected");
	this.project.emit("item-deselected", {item: this});
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
	// to do: change this to use type=='Feature' and geometry==null to match GeoJSON spec and AnnotationItemPlaceholder definition
	return this.project.getItems({selected: true, match: function (i) { return i.isGeoJSONFeature && i.initializeGeoJSONFeature; }})[0];
}
/**
 * Find the selected items in the project scope.
 * @private
 * @returns {paper.Item[]} The array of selected items, or an empty array if none exists.
 */
function findSelectedItems() {
	return this.project.getItems({selected: true, match: function (i) { return i.isGeoJSONFeature; }});
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
 * Create a new feature collection layer in the project scope.
 * @private
 * @param {string} [displayLabel=null] - The display label for the feature collection layer.
 * @returns {paper.Layer} The paper layer object representing the feature collection.
 */
function createFeatureCollectionLayer(displayLabel = null) {
	let layer = new paper.Layer();
	this.project.addLayer(layer);
	layer.isGeoJSONFeatureCollection = true;
	let layerNum = this.project.layers.filter(l => l.isGeoJSONFeatureCollection).length;
	layer.name = displayLabel !== null ? displayLabel : `Annotation Layer ${layerNum}`;
	layer.displayName = layer.name;
	layer.defaultStyle = new paper.Style(this.project.defaultStyle);
	return layer;
}

/**
 * @private
 * Update the fill opacity of a paper item and its descendants.
 */

function updateFillOpacity() {
	this._computedFillOpacity = this.hierarchy.filter(item => "fillOpacity" in item && (item._multiplyOpacity || item == this)).reduce((prod, item) => prod * item.fillOpacity, 1);
	if (this.fillColor) {
		this.fillColor.alpha = this._computedFillOpacity;
	}
}
/**
 * @private
 * Update the stroke opacity of a paper item and its descendants.
 */
function updateStrokeOpacity() {
	if (this.strokeColor) {
		this.strokeColor.alpha = this.hierarchy.filter(item => "strokeOpacity" in item && (item._multiplyOpacity || item == this)).reduce((prod, item) => prod * item.strokeOpacity, 1);
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
			return typeof this._fillOpacity === "undefined" ? 1 : this._fillOpacity;
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
			return typeof this._strokeOpacity === "undefined" ? 1 : this._strokeOpacity;
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
			this.descendants.forEach(item => item.updateFillOpacity());
		},
		get: function opacity() {
			return (this.style || this.defaultStyle).fillOpacity;
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
			this._project.descendants.forEach(item => item.updateFillOpacity());
		},
		get: function opacity() {
			return this._fillOpacity;
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
			this._strokeOpacity = o;
			this.descendants.forEach(item => item.updateStrokeOpacity());
		},
		get: function opacity() {
			return typeof this._strokeOpacity === "undefined" ? 1 : this._strokeOpacity;
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
			}
			else {
				this._displayName = input;
			}
			this.name = this._displayName;
			this.emit("display-name-changed", {displayName: this._displayName});
		},
		get: function displayName() {
			return this._displayName;
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
			return (this.children ? this.children.map(child => child.descendants).flat() : []).concat(this.isGeoJSONFeature ? [this] : []);
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
			return this.layers ? this.layers.filter(layer => layer.isGeoJSONFeatureCollection).map(child => child.descendants).flat() : [this];
		}
	};
}
/**
 * Define the set method for a paper style object.
 * @private
 * @param {object|paper.Style} style - The style object to set.
 */
function styleSet(style) {
	var isStyle = style instanceof paper.Style,
		values = isStyle ? style._values : style;
	if (values) {
		for (var key in values) {
			// console.log('setting',key)
			if (key in this._defaults || paper.Style.prototype.hasOwnProperty(key)) {
				var value = values[key];
				this[key] = value && isStyle && value.clone
					? value.clone() : value ;
			}
		}
	}
}
/**
 * Convert a paper style object to a JSON object.
 * @private
 * @returns {object} The JSON object representing the style.
 */
function styleToJSON() {
	let output = {};
	Object.keys(this._values).forEach(key => {
		output[key] = this[key];// invoke getter
	});
	return output;
}
/**
 * Get the image data of a paper view element.
 * @private
 * @returns {ImageData} The image data object of the view element.
 */
function paperViewGetImageData() {
	return this.element.getContext("2d").getImageData(0, 0, this.element.width, this.element.height);
}

/**
 * Get the insert children method definition for a paper group object.
 * The insert children method emits events when children are added to the paper group object.
 * @private
 * @returns {function} The insert children method that emits events when children are added.
 */
function getInsertChildrenDef() {
	let origInsertChildren = paper.Group.prototype.insertChildren.original || paper.Group.prototype.insertChildren;
	function insertChildren() {
		let output = origInsertChildren.apply(this, arguments);
		let index = arguments[0], children = Array.from(arguments[1]);
		children && children.forEach((child, i) => {
			if (child.isGeoJSONFeature) {
				let idx = typeof index !== "undefined" ? index + 1 : -1;
				this.emit("child-added", {item: child, index: idx});
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
 * - get: A function that returns the fill opacity value (a number between 0 and 1).
 * - set: A function that sets the fill opacity value (a number between 0 and 1).
 */
function textItemContentPropertyDef() {
	let _set = paper.TextItem.prototype._setContent || Object.getOwnPropertyDescriptor(paper.TextItem.prototype, "content").set;
	paper.TextItem.prototype._setContent = _set;
	return {
		get: function() {
			return this._content;
		},
		set: function(content) {
			_set.call(this, content);
			this.emit("content-changed");
		}
	};
}