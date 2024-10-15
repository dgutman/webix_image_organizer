import Webix from "../../webix/webix";
import openseadragon from "openseadragon";
import { extend, ProgressBar } from "webix";

import MouseCoords from "../../webix/mouseCoords/mouseCoords";
import ZStack from "../../webix/zStack/zStack";
import Image from "../../webix/image/image";
import ColorMap from "../../webix/colorMap/colorMap";
import { useContext, useEffect, useState } from "react";
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
  const { setZStackFrame } = useContext(zStackFrameContext);
  const [ mouseTracker, setMouseTracker ] = useState(null);
  const [ macroscopicImage, setMacroscopicImage ] = useState(null);

  async function setSelectedImage() {
    if (selectedImage) {
      const zStackControl = zStack.getSlider();
      zStackControl.disable();
      let overlayOptions = imagesModel.getOverlayOptions(selectedImage);
      while(!overlayOptions) {
        overlayOptions = imagesModel.getOverlayOptions(selectedImage);
      }
      imageTemplate.addArea(overlayOptions, constants.COLOR_MAP[imagesModel.getImageType(selectedImage)]);
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

  useEffect(() => {
    const setImage = async () => {
      if (selectedFolder) {
        const newMacroscopicImage = foldersModel.getFolderMacroscopicImages(selectedFolder);
        setMacroscopicImage(newMacroscopicImage);
        const template = imageTemplate.getTemplate();
        if (!template.showProgress) {
          extend(template, ProgressBar);
        }
        template.showProgress();
        await imageTemplate.setImage(newMacroscopicImage, true);
      }
    }
    setImage();
  }, [selectedFolder]);

  useEffect(() => {
    setSelectedImage();
  }, [selectedImage, macroscopicImage]);

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
      const template = imageTemplate.getTemplate();
      viewer.world.addHandler("add-item", () => {
        if (template.hideProgress) {
          template.hideProgress();
        }
      });
    };
    attachEvents();
  }, [])

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
