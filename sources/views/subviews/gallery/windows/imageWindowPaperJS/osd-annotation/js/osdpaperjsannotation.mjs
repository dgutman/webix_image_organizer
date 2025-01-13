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

import { AnnotationToolkit } from './annotationtoolkit.mjs';
import { AnnotationToolbar } from './annotationtoolbar.mjs';
import { FeatureCollectionUI } from './featurecollectionui.mjs';
import { FeatureUI } from './featureui.mjs';
import { FileDialog } from './filedialog.mjs';
import { LayerUI } from './layerui.mjs';
import { PaperOffset } from './paper-offset.mjs';
import { PaperOverlay } from './paper-overlay.mjs';
import { RotationControlOverlay } from './rotationcontrol.mjs';
import { ScreenshotOverlay } from './overlays/screenshot/screenshot.mjs';
import { AnnotationUITool } from './papertools/annotationUITool.mjs';
import { ToolBase } from './papertools/base.mjs';
import { BrushTool } from './papertools/brush.mjs';
import { DefaultTool } from './papertools/default.mjs';
import { EllipseTool } from './papertools/ellipse.mjs';
import { LinestringTool } from './papertools/linestring.mjs';
import { PointTool } from './papertools/point.mjs';
import { PointTextTool } from './papertools/pointtext.mjs';
import { PolygonTool } from './papertools/polygon.mjs';
import { RasterTool } from './papertools/raster.mjs';
import { RectangleTool } from './papertools/rectangle.mjs';
import { SelectTool } from './papertools/select.mjs';
import { StyleTool } from './papertools/style.mjs';
import { TransformTool } from './papertools/transform.mjs';
import { WandTool } from './papertools/wand.mjs';

/**
 *
 * This is a namespace that contains documentation elements belonging to OSDPaperJSAnnotation
 *
 * @namespace OSDPaperjsAnnotation
 */

export const OSDPaperjsAnnotation = {
    AnnotationToolkit: AnnotationToolkit,
    AnnotationToolbar: AnnotationToolbar,
    FeatureCollectionUI :FeatureCollectionUI,
    FeatureUI:FeatureUI,
    FileDialog:FileDialog,
    LayerUI:LayerUI,
    PaperOffset: PaperOffset,
    PaperOverlay: PaperOverlay,
    RotationControlOverlay: RotationControlOverlay,
    ScreenshotOverlay: ScreenshotOverlay,
    AnnotationUITool: AnnotationUITool,
    ToolBase:ToolBase,
    BrushTool: BrushTool,
    DefaultTool:DefaultTool,
    EllipseTool:EllipseTool,
    LinestringTool:LinestringTool,
    PointTool:PointTool,
    PointTextTool:PointTextTool,
    PolygonTool:PolygonTool,
    RasterTool:RasterTool,
    RectangleTool:RectangleTool,
    SelectTool:SelectTool,
    StyleTool:StyleTool,
    TransformTool:TransformTool,
    WandTool:WandTool

}


// export various classes and functions so they can be imported by name
export {
    AnnotationToolkit,
    AnnotationToolbar,
    FeatureCollectionUI,
    FeatureUI,
    FileDialog,
    LayerUI,
    PaperOffset,
    PaperOverlay,
    RotationControlOverlay,
    ScreenshotOverlay,
    AnnotationUITool,
    ToolBase,
    BrushTool,
    DefaultTool,
    EllipseTool,
    LinestringTool,
    PointTool,
    PointTextTool,
    PolygonTool,
    RasterTool,
    RectangleTool,
    SelectTool,
    StyleTool,
    TransformTool,
    WandTool

}