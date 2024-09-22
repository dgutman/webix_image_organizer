import React, { useContext, useEffect } from "react";
import Webix from "../../webix/webix";
import Image from "../../webix/image/image";
import SelectImageContext from "../../../context/selectImageContext";
import zStackFrameContext from "../../../context/zStackFrameContext";

const imageTemplate = new Image();

export default function RightPanel() {
  const { selectedImage } = useContext(SelectImageContext);
  const { zStackFrame } = useContext(zStackFrameContext);

  useEffect(() => {
    const setImage = async () => {
      if (selectedImage) {
        await imageTemplate.setImage(selectedImage, false, true);
      }
    }
    setImage();
  }, [selectedImage])

  useEffect(() => {
    const setImage = async () => {
      if (selectedImage && zStackFrame >= 0) {
        await imageTemplate.setImage(selectedImage, false, true, zStackFrame, true);
      }
    }
    setImage();
  }, [zStackFrame])

  return (
    <div className="right-panel">
      <Webix
        componentUI={imageTemplate.getUI()}
      />
    </div>
  )
}