import { useContext, useEffect } from "react";
import { extend, ProgressBar } from "webix";

import Webix from "../../webix/webix";
import Image from "../../webix/image/image";
import SelectImageContext from "../../../context/selectImageContext";
import zStackFrameContext from "../../../context/zStackFrameContext";
import constants from "../../../constants";
import imagesModel from "../../../models/imagesModel";
import ajaxActions from "../../../services/ajaxActions";

const imageTemplate = new Image();

export default function RightPanel() {
  const { selectedImage } = useContext(SelectImageContext);
  const { zStackFrame } = useContext(zStackFrameContext);

  // Temporary global reference for debugging
  useEffect(() => {
    window.rightPanelViewer = imageTemplate;
    window.rightPanelOSDViewer = imageTemplate.openSeaDragonViewer;
    console.log('RightPanel: Made viewer globally accessible as window.rightPanelViewer');
    console.log('RightPanel: Made OSD viewer globally accessible as window.rightPanelOSDViewer');
  }, []);

  useEffect(() => {
    const template = imageTemplate.getTemplate();
    if (template && !template.showProgress) {
      extend(template, ProgressBar);
    }
    if (template && template.showProgress) {
      template.showProgress({ icon: "wxi-sync large-progress" });
    }
    const setImage = async () => {
      if (selectedImage) {
        imageTemplate.showOSD();
        const imageType = imagesModel.getImageType(selectedImage);
        if (imageType === constants.IMAGE_TYPE.VIVA_STACK) {
          console.log('RightPanel: Starting VivaStack processing for image:', selectedImage?.yamlId);
          const imageID = imagesModel.getImageYamlID(selectedImage)

          // Try to use slices count from the image data first
          const slicesCount = selectedImage?.slices;
          console.log('RightPanel: Slices count from image data:', slicesCount);

          if (slicesCount && slicesCount > 0) {
            console.log('RightPanel: Using FAST path - slices count:', slicesCount);
            const startTime = performance.now();
            await imageTemplate.setImage(selectedImage, false, true, slicesCount, true);
            const endTime = performance.now();
            console.log(`RightPanel: setImage took ${endTime - startTime} milliseconds`);
          } else {
            console.log('RightPanel: Using SLOW path - fetching quad_info for:', imageID);
            const startTime = performance.now();
            const framesInfo = await ajaxActions.getTileFrameInfo(imageID);
            const apiTime = performance.now();
            console.log(`RightPanel: getTileFrameInfo API call took ${apiTime - startTime} milliseconds`);
            console.log('RightPanel: Received frame info:', framesInfo);
            /** @type {Array} */
            const frames = framesInfo.frames;
            const max = frames.at(-1);
            console.log('RightPanel: About to call setImage with max frame:', max);
            await imageTemplate.setImage(selectedImage, false, true, max, true);
            const endTime = performance.now();
            console.log(`RightPanel: setImage took ${endTime - apiTime} milliseconds`);
            console.log(`RightPanel: Total time ${endTime - startTime} milliseconds`);
          }
        }

        else {
          await imageTemplate.setImage(selectedImage, false, true);
        }
      }
      else {
        imageTemplate.showNoImageSelected();
        template.hideProgress();
      }
    }
    setImage();
  }, [selectedImage])

  useEffect(() => {
    if (zStackFrame !== null) {
      imageTemplate.showFrame(zStackFrame);
    }
  }, [zStackFrame])

  useEffect(() => {
    const attachEvents = async => {
      const template = imageTemplate.getTemplate();
      const viewer = imageTemplate.getOSDViewer();

      // Use the 'open' event instead of tracking individual 'add-item' events
      viewer.addHandler("open", () => {
        console.log('OpenSeaDragon: Open event fired - all tile sources loaded');
        const template = imageTemplate.getTemplate();
        if (template && template.hideProgress) {
          template.hideProgress();
        }
      });

      // Track when tiles are actually loaded and visible
      viewer.addHandler("tile-loaded", () => {
        // Tile loaded - no need to log every single tile
      });

      viewer.addHandler("tile-drawn", () => {
        // Tile drawn - no need to log every single tile
      });

      viewer.addHandler("update", () => {
        // Viewport updated - no need to log every update
      });
    }
    attachEvents();
  }, [])

  return (
    <div className="right-panel">
      <Webix
        componentUI={imageTemplate.getUI()}
      />
    </div>
  )
}