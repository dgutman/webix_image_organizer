import { useContext, useEffect, useState } from "react";
import { extend, ProgressBar } from "webix";

import Webix from "../../webix/webix";
import openseadragon from "openseadragon";

import MouseCoords from "../../webix/mouseCoords/mouseCoords";
import ZStack from "../../webix/zStack/zStack";
import Image from "../../webix/image/image";
import ColorMap from "../../webix/colorMap/colorMap";
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
  const { selectedFolder } = useContext(SelectedFolderContext);
  const { selectedImage } = useContext(SelectImageContext);
  const { setZStackFrame } = useContext(zStackFrameContext);
  const [mouseTracker, setMouseTracker] = useState(null);
  const [macroscopicImage, setMacroscopicImage] = useState(null);
  const [isLoadingMacroscopic, setIsLoadingMacroscopic] = useState(false);

  async function setSelectedImage() {
    // Wait for OpenSeaDragon viewer to be ready
    if (!imageTemplate.openSeaDragonViewer) {
      return;
    }

    // Don't interfere if we're loading macroscopic image
    if (isLoadingMacroscopic) {
      return;
    }

    // Clear all overlays first when switching images
    imageTemplate.openSeaDragonViewer.clearOverlays();

    if (selectedFolder) {
      const images = foldersModel.getFolderRegistrationDataSimplified(selectedFolder);
      if (images && Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          let overlayOptions = imagesModel.getOverlayOptions(images[i]);
          while (!overlayOptions) {
            await new Promise(resolve => setTimeout(resolve, 10));
            overlayOptions = imagesModel.getOverlayOptions(images[i]);
          }
          const clearOverlaysFlag = i === 0 ? true : false;
          const areaStyle = {
            color: constants.COLOR_MAP[imagesModel.getImageType(images[i])],
            borderStyle: "dashed",
            borderWidth: "2px",
          }
          imageTemplate.addArea(overlayOptions, areaStyle, clearOverlaysFlag);
        }
      }
    }
    if (selectedImage) {
      // Check if zStack components are available before using them
      if (zStack.clickStopButtonHandler) {
        zStack.clickStopButtonHandler();
      }
      const zStackSlider = zStack.getSlider();
      const zStackPlayControl = zStack.getPlayControl();
      const zStackPauseControl = zStack.getPauseControl();
      const zStackStopControl = zStack.getStopControl();

      if (zStackSlider && zStackPlayControl && zStackPauseControl && zStackStopControl) {
        zStackSlider.disable();
        zStackPlayControl.disable();
        zStackPauseControl.disable();
        zStackStopControl.disable();
        zStack.hideControls();
      }

      let overlayOptions = imagesModel.getOverlayOptions(selectedImage);
      while (!overlayOptions) {
        await new Promise(resolve => setTimeout(resolve, 10));
        overlayOptions = imagesModel.getOverlayOptions(selectedImage);
      }
      const clearOverlaysFlag = false
      const areaStyle = {
        color: constants.COLOR_MAP[imagesModel.getImageType(selectedImage)],
        borderStyle: "solid",
        borderWidth: "4px",
      };
      imageTemplate.addArea(overlayOptions, areaStyle, clearOverlaysFlag);
      const imageType = imagesModel.getImageType(selectedImage);
      if (imageType === constants.IMAGE_TYPE.VIVA_STACK) {
        const slicesCount = selectedImage?.slices;
        console.log('LeftPanel: Using slices count for Z-stack controls:', slicesCount);
        if (slicesCount && slicesCount > 0) {
          zStack.showControls();
          zStackSlider.define("min", 0);
          zStackSlider.define("max", slicesCount - 1);
          zStackSlider.setValue(0);
          zStackSlider.enable();
          zStackPlayControl.enable();
          zStackPauseControl.enable();
          zStackStopControl.enable();
        }
      }
    }
  }

  useEffect(() => {
    setMacroscopicImage(null);
    const setImage = async () => {
      if (selectedFolder) {
        console.log('LeftPanel: Loading macroscopic image for folder:', selectedFolder?.name);
        setIsLoadingMacroscopic(true);
        const newMacroscopicImage = foldersModel.getFolderMacroscopicImages(selectedFolder);
        console.log('LeftPanel: Macroscopic image data:', newMacroscopicImage);
        await imageTemplate.setImage(newMacroscopicImage, true);
        const template = imageTemplate.getTemplate();
        if (!template.showProgress) {
          extend(template, ProgressBar);
        }
        template.showProgress({ icon: "wxi-sync large-progress" });
        setMacroscopicImage(newMacroscopicImage);
        setIsLoadingMacroscopic(false);
      }
    }
    setImage();
  }, [selectedFolder]);

  // Handle image selection and overlay updates
  useEffect(() => {
    if (macroscopicImage && selectedImage) {
      setSelectedImage();
    }
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
      const zStackSlider = zStack.getSlider();
      zStackSlider.attachEvent("onChange", (value) => {
        setZStackFrame(value);
      });
      const viewer = imageTemplate.getOSDViewer();
      if (viewer) {
        if (!mouseTracker) {
          const newMouseTracker = new openseadragon.MouseTracker({
            element: viewer.container,
            moveHandler: (event) => {
              const tiledImage = viewer.world.getItemAt(0);
              if (tiledImage) {
                const webPoint = event.position;
                const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
                const imagePoint = tiledImage.viewportToImageCoordinates(viewportPoint);
                mouseCoords.setMouseCoords({ imagePoint, viewportPoint, webPoint });
              }
            }
          });
          setMouseTracker(newMouseTracker);
        }
        const template = imageTemplate.getTemplate();
        viewer.world.addHandler("add-item", () => {
          setSelectedImage();
          if (template.hideProgress) {
            template.hideProgress();
          }
        });
      }
    };
    attachEvents();
  }, [selectedFolder, selectedImage])

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
