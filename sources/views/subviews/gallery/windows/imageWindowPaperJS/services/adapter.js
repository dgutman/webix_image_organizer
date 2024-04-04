// Based on:
// adapter.mjs
// https://github.com/pearcetm/osd-paperjs-annotation/blob/main/demo/dsa/adapter.mjs

/**
Copyright (c) 2022-2024 Thomas Pearce (https://github.com/pearcetm)

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

// Convert a DSA annotation element into a GeoJSON Feature

function annotationToFeatureCollections(dsa) {
	// console.log('Converting from DSA:',dsa);
	let featureCollections = [];
	if (dsa?.annotation?.attributes?.geojslayer) {
		featureCollections.push(dsa.annotation.attributes.geojslayer);
	}
	else {
		let groups = dsa.annotation.elements.reduce((acc, f) => {
			let label = "group" in f ? f.group : dsa.annotation.name;
			if (!acc[label]) {
				acc[label] = [];
				acc[label].group = f.group;
			}
			acc[label].push(f);
			return acc;
		}, {});
		Object.keys(groups).forEach((label) => {
			let elements = groups[label];
			let description = dsa.annotation.description;
			featureCollections.push(
				elementArrayToFeatureCollection(
					dsa._id,
					label,
					elements,
					description,
					elements.group
				)
			);
		});
	}

	return featureCollections;
}

function elementArrayToFeatureCollection(annotationId, label, elements, description, groupName) {
	let grouped = elements.reduce((acc, f) => {
		let feature = elementToFeature(f);
		if (f.user && f.user.MultiPolygon) {
			if (!acc.multiPolygons[f.user.MultiPolygon]) {
				acc.multiPolygons[f.user.MultiPolygon] = feature;
				acc.featurelist.push(feature);
			}
			else {
				acc.multiPolygons[f.user.MultiPolygon]
					.geometry.coordinates
					.push(feature.geometry.coordinates[0]); // access first element to unwrap before appending
			}
		}
		else if (f.user && f.user.MultiLineString) {
			if (!acc.multiLineStrings[f.user.MultiLineString]) {
				// feature.geometry.coordinates = [feature.geometry.coordinates]; //wrap the first in an array
				acc.multiLineStrings[f.user.MultiLineString] = feature;
				acc.featurelist.push(feature);
			}
			else {
				acc.multiLineStrings[f.user.MultiLineString]
					.geometry
					.coordinates
					.push(feature.geometry.coordinates[0]); // access first element to unwrap before appending
			}
		}
		else if (f.user && f.user.MultiPoint) {
			if (!acc.multiPoints[f.user.MultiPoint]) {
				// feature.geometry.coordinates = [feature.geometry.coordinates]; //wrap the first in an array
				acc.multiPoints[f.user.MultiPoint] = feature;
				acc.featurelist.push(feature);
			}
			else {
				acc.multiPoints[f.user.MultiPoint]
					.geometry
					.coordinates
					.push(feature.geometry.coordinates[0]); // access first element to unwrap before appending
			}
		}
		else {
			acc.featurelist.push(feature);
		}
		return acc;
	}, {featurelist: [], multiPolygons: {}, multiLineStrings: {}, multiPoints: {}});

	let fc = {
		type: "FeatureCollection",
		features: grouped.featurelist,
		label,
		properties: {
			userdata: {
				dsa: {
					annotationId,
					group: groupName,
					annotationDescription: description
				}
			},
		}
	};
	return fc;
}

function elementToFeature(element) {
	function mapElementToGeometryType(e) {
		let g = {
			type: null,
			coordinates: [],
			properties: {
				label: e.label ? e.label.value : undefined,
			}
		};

		if (e.type === "polyline" && e.closed === true) {
			g.type = "MultiPolygon";
			g.coordinates = [[e.points].concat(e.holes || [])];
		}
		else if (e.type === "polyline" && e.closed === false) {
			g.type = "MultiLineString";
			g.coordinates = [[e.points]];
			g.properties.strokeWidths = [e.lineWidth];
		}
		else if (e.type === "arrow") {
			g.type = "LineString";
			g.coordinates = [e.points];
			g.properties.subtype = "Arrow";
		}
		else if (e.type === "rectangle") {
			g.type = "Point";
			g.properties.subtype = "Rectangle";
			g.coordinates = e.center.slice(0, 2);
			g.properties.width = e.width;
			g.properties.height = e.height;
			g.properties.angle = e.rotation * 180 / Math.PI;
		}
		else if (e.type === "rectanglegrid") {
			g.type = "Point";
			g.properties.subtype = "RectangleGrid";
			g.coordinates = e.origin.slice(0, 2);
			g.properties.gridWidth = e.gridWidth;
			// to do: get remainder of properties copied correctly (currently unused by DSA)
		}
		else if (e.type === "circle") {
			g.type = "Point";
			g.properties.subtype = "Ellipse";
			g.coordinates = e.center.slice(0, 2);
			g.properties.majorRadius = e.radius;
			g.properties.minorRadius = e.radius;
			g.properties.angle = 0;
		}
		else if (e.type === "ellipse") {
			g.type = "Point";
			g.properties.subtype = "Ellipse";
			g.coordinates = e.center.slice(0, 2);
			g.properties.majorRadius = e.width / 2;
			g.properties.minorRadius = e.height / 2;
			g.properties.angle = e.rotation * 180 / Math.PI;
		}
		else if (e.type === "point") {
			if (e.user && (e.user.subtype === "pointtext" || e.user.text)) {
				g.type = "Point";
				g.properties.subtype = "PointText";
				g.coordinates = e.center.slice(0, 2);
				g.properties.content = e.user.text;
			}
			else if (e.user && e.user.subtype === "raster") {
				g = e.user.json;
			}
			else {
				g.type = "Point";
				g.coordinates = e.center.slice(0, 2);
			}
		}
		return g.type ? g : error("No GeoJSON Geometry defined for annotation type", e);
	}
	// zero is stored in DSA as very small float; set back to zero here
	if (element.lineWidth < 0.001) {
		element.lineWidth = 0;
	}
	let f = {
		type: "Feature",
		geometry: mapElementToGeometryType(element),
		properties: {
			userdata: {id: element.id},
			fillColor: element.fillColor || "rgba(255, 255, 255, 0)", // default to white transparent
			strokeColor: element.lineColor || "rgba(0, 0, 0, 0)", // default to black transparent
			strokeWidth: typeof element.lineWidth === "undefined" ? 1 : element.lineWidth,
			rescale: {
				strokeWidth: typeof element.lineWidth === "undefined" ? 1 : element.lineWidth,
			},
			label: element.label ? element.label.value : undefined,
		}
	};


	return f;
}

function featureCollectionsToElements(fcArray) {
	let elements = fcArray.map(geojson =>
		// let obj = {};
		// let userdata = (geojson.properties && geojson.properties.userdata) || {};
		// let dsainfo = userdata.dsa || {};
		// obj.name = geojson.label;
		// obj.description = "description" in dsainfo ? dsainfo.description : 'Created by AnnotationToolkit DSA Adapter v1';
		// obj.attributes = {}
		geojson.features.map(featureToElement).flat().map((element) => {
			element.group = `${geojson.label}`;
			return element;
		})).flat();

	return elements;
}

// convert a GeoJSON Feature into a DSA annotation element
function featureToElement(feature) {
	let g = feature.geometry;
	let p = feature.properties;
	let e = {
		type: null,
		label: {
			value: p.label
		},
		fillColor: p.fillColor ? getColorString(p.fillColor, true) : undefined,
		lineColor: p.strokeColor ? getColorString(p.strokeColor) : undefined,
		lineWidth: Math.max(
			0.0001,
			parseFloat(
				p.rescale && p.rescale.strokeWidth
					? p.rescale.strokeWidth
					: p.strokeWidth
			)
		), // convert zero to very small number
	};

	if (g.type === "MultiPolygon") {
		let multiPolygonID = makeGUID();
		e = g.coordinates.map((c) => {
			let newFeature = {
				properties: p,
				geometry: Object.assign({}, g),
			};
			newFeature.geometry.coordinates = c;
			newFeature.geometry.type = "Polygon";
			let singlePoly = featureToElement(newFeature);
			singlePoly.user = Object.assign({}, singlePoly.user, {MultiPolygon: multiPolygonID});
			return singlePoly;
		});
	}
	if (g.type === "Polygon") {
		e.type = "polyline";
		e.closed = true;
		let pointArrays = g.coordinates.map(c => c.map(p => [p[0], p[1], 0]));
		e.points = pointArrays[0];
		e.holes = pointArrays.slice(1);
	}
	if (g.type === "MultiLineString") {
		// assign stroke width to each item individually from within geometry.properties.strokeWidths
		let strokeWidths = g.properties.strokeWidths;
		delete g.properties.strokeWidths;
		let multiLineStringID = makeGUID();
		e = g.coordinates.map((c, index) => {
			let newFeature = {
				properties: Object.assign({}, p),
				geometry: Object.assign({}, g),
			};
			newFeature.properties.strokeWidth = strokeWidths[index];
			newFeature.geometry.coordinates = c;
			newFeature.geometry.type = "LineString";
			let singleLineString = featureToElement(newFeature);
			singleLineString.user = Object.assign(
				{},
				singleLineString.user,
				{MultiLineString: multiLineStringID}
			);
			return singleLineString;
		});
	}
	if (g.type === "LineString" && !g.properties.subtype) {
		e.type = "polyline";
		e.closed = false;
		e.points = g.coordinates.map(p => [p[0], p[1], 0]);
	}
	if (g.type === "LineString" && g.properties.subtype === "Arrow") {
		e.type = "arrow";
		e.points = g.coordinates.slice(0, 2).map(p => [p[0], p[1], 0]);
	}
	if (g.type === "Point" && !g.properties.subtype) {
		e.type = "point";
		e.center = [g.coordinates[0], g.coordinates[1], 0];
	}
	if (g.type === "Point" && g.properties.subtype === "Rectangle") {
		e.type = "rectangle";
		e.center = [g.coordinates[0], g.coordinates[1], 0];
		e.width = g.properties.width;
		e.height = g.properties.height;
		e.rotation = g.properties.angle * Math.PI / 180;
	}
	if (g.type === "Point" && g.properties.subtype === "Ellipse") {
		e.type = "ellipse";
		e.center = [g.coordinates[0], g.coordinates[1], 0];
		e.width = g.properties.majorRadius * 2;
		e.height = g.properties.minorRadius * 2;
		e.rotation = g.properties.angle * Math.PI / 180;

		if (g.properties.majorRadius === g.properties.minorRadius) {
			e.type = "circle";
			e.radius = e.width;
			delete e.width;
			delete e.height;
			delete e.rotation;
		}
	}
	if (g.type === "Point" && g.properties.subtype === "PointText") {
		e.type = "point";
		e.center = [g.coordinates[0], g.coordinates[1], 0];
		e.user = {text: g.properties.content, subtype: "pointtext"};
	}
	if (g.type === "Point" && g.properties.subtype === "RectangleGrid") {
		// not currently used
		e.type = "griddata";
		e.origin = [g.coordinates[0], g.coordinates[1], 0];
		e.gridWidth = g.properties.gridWidth;
	}
	if (g.type === "GeometryCollection" && g.properties.subtype === "Raster") {
		e.type = "point";
		e.center = [g.properties.raster.center[0], g.properties.raster.center[1], 0];
		e.user = {
			subtype: "raster",
			json: g,
		};
	}

	return e;
}

function makeGUID() {
	let guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		let r = Math.random() * 16 | 0;
		let v = c === "x" ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
	return guid;
}

function getColorString(color, useParentFillOpacity) {
	let clone = color.clone();
	if (useParentFillOpacity) {
		clone.alpha = color._owner.fillOpacity;
	}
	let string = clone.toCSS();
	return string;
}

export default {
	annotationToFeatureCollections,
	featureCollectionsToElements
};
