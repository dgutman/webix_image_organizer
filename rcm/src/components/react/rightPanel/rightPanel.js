import React, { useContext, useEffect } from "react";
import Webix from "../../webix/webix";
import Image from "../../webix/image/image";
import SelectImageContext from "../../../context/selectImageContext";

const imageTemplate = new Image();

export default function RightPanel() {
  const {selectedImage} = useContext(SelectImageContext);

  useEffect(() => {
    const setImage = async () => {
      if (selectedImage) {
        await imageTemplate.setImage(selectedImage);
      }
    }
    setImage();
  }, [selectedImage])

  return (
    <div className="right-panel">
      <Webix
        componentUI={imageTemplate.getUI()}
      />
    </div>
  )
}