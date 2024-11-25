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

  useEffect(() => {
    const template = imageTemplate.getTemplate();
    if (!template.showProgress) {
      extend(template, ProgressBar);
    }
    template.showProgress({icon: "wxi-sync large-progress"});
    const setImage = async () => {
      if (selectedImage) {
        imageTemplate.showOSD();
        const imageType = imagesModel.getImageType(selectedImage);
        if (imageType === constants.IMAGE_TYPE.VIVA_STACK) {
          const imageID = imagesModel.getImageYamlID(selectedImage)
          const framesInfo = await ajaxActions.getTileFrameInfo(imageID);
          /** @type {Array} */
          const frames = framesInfo.frames;
          const max = frames.at(-1);
          await imageTemplate.setImage(selectedImage, false, true, max, true);
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
      viewer.world.addHandler("add-item", () => {
        if (template.hideProgress) {
          template.hideProgress();
        }
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