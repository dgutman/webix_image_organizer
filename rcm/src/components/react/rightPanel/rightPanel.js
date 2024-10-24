import { useContext, useEffect } from "react";
import { extend, ProgressBar } from "webix";

import Webix from "../../webix/webix";
import Image from "../../webix/image/image";
import SelectImageContext from "../../../context/selectImageContext";
import zStackFrameContext from "../../../context/zStackFrameContext";

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
        await imageTemplate.setImage(selectedImage, false, true);
      }
    }
    setImage();
  }, [selectedImage])

  useEffect(() => {
    const template = imageTemplate.getTemplate();
    if (!template.showProgress) {
      extend(template, ProgressBar);
    }
    template.showProgress({icon: "wxi-sync large-progress"});
    const setImage = async () => {
      if (selectedImage && zStackFrame >= 0) {
        await imageTemplate.setImage(selectedImage, false, true, zStackFrame, true);
      }
    }
    setImage();
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