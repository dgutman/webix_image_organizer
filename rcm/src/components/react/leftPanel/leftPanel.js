import Webix from "../../webix/webix";
import openseadragon from "openseadragon";

import MouseCoords from "../../webix/mouseCoords/mouseCoords";
import ZStack from "../../webix/zStack/zStack";
import Image from "../../webix/image/image";
import ColorMap from "../../webix/colorMap/colorMap";
import { useCallback, useContext, useEffect, useState } from "react";
import SelectImageContext from "../../../context/selectImageContext";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import foldersModel from "../../../models/foldersModel";
import "../../../styles/leftPanel.css"
import "../../../styles/osdViewer.css";
import imagesModel from "../../../models/imagesModel";
import constants from "../../../constants";
import ajaxActions from "../../../services/ajaxActions";
import zStackFrameContext from "../../../context/zStackFrameContext";

const mouseCoords = new MouseCoords();
const zStack = new ZStack();
const imageTemplate = new Image();
const colorMap = new ColorMap();

export default function LeftPanel() {
  const {selectedFolder} = useContext(SelectedFolderContext);
  const {selectedImage} = useContext(SelectImageContext);
  const { zStackFrame, setZStackFrame } = useContext(zStackFrameContext);
  const [ mouseTracker, setMouseTracker ] = useState(null);

  useEffect(() => {
    const setImage = async () => {
      if (selectedFolder) {
        const macroscopicImage = foldersModel.getFolderMacroscopicImages(selectedFolder);
        await imageTemplate.setImage(macroscopicImage, true);
      }
    }
    setImage();
  }, [selectedFolder]);

  useEffect(() => {
    const setSelectedImage = async () => {
      if (selectedImage) {
        const zStackControl = zStack.getSlider();
        zStackControl.disable();
        const overlayOptions = imagesModel.getOverlayOptions(selectedImage);
        setTimeout(() => {
          imageTemplate.addArea(overlayOptions, constants.COLOR_MAP[imagesModel.getImageType(selectedImage)]);
        }, 2000);
        const imageType = imagesModel.getImageType(selectedImage);
        if (imageType === constants.IMAGE_TYPE.VIVA_STACK) {
          const imageID = imagesModel.getImageYamlID(selectedImage)
          const framesInfo = await ajaxActions.getTileFrameInfo(imageID);
          /** @type {Array} */
          const frames = framesInfo.frames;
          const min = frames[0];
          const max = frames.at(-1);
          zStackControl.define("min", min);
          zStackControl.define("max", max);
          zStackControl.setValue(0);
          zStackControl.enable();
        }
      }
    }
    setSelectedImage();
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      imageTemplate.destructor();
      if (mouseTracker) {
        mouseTracker.destroy();
      }
    }
  }, []);

  useEffect(() => {
    const attachEvents = async () => {
      /** @type {webix.ui.slider} */
      const zStackControl = zStack.getSlider();
      zStackControl.attachEvent("onChange", (value) => {
        setZStackFrame(value);
      });
      const viewer = imageTemplate.getOSDViewer();
      if (!mouseTracker) {
        const newMouseTracker =  new openseadragon.MouseTracker({
          element: viewer.container,
          moveHandler: (event) => {
            const tiledImage = viewer.world.getItemAt(0);
            if (tiledImage) {
              const webPoint = event.position;
              const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
              const imagePoint = tiledImage.viewportToImageCoordinates(viewportPoint);
              mouseCoords.setMouseCoords({imagePoint, viewportPoint, webPoint});
            }
          }
        });
        setMouseTracker(newMouseTracker);
      }
    };
    attachEvents();
  })

  return (
    <div className="left-panel">
      <div className="left-panel__row-1-1">
        <Webix 
          componentUI={mouseCoords.getUI()}
        />
        <Webix
          componentUI={zStack.getUI()}
        />
      </div>
      <div className="left-panel__row-2-1">
        <Webix
          componentUI={imageTemplate.getUI()}
        />
        <Webix
          componentUI={colorMap.getUI()}
        />
      </div>
    </div>
  )
}
