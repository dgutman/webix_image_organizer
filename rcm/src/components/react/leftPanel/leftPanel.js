import Webix from "../../webix/webix";

import MouseCoords from "../../webix/mouseCoords/mouseCoords";
import ZStack from "../../webix/zStack/zStack";
import Image from "../../webix/image/image";
import ColorMap from "../../webix/colorMap/colorMap";
import { useCallback, useContext, useEffect } from "react";
// import SelectImageContext from "../../../context/selectImageContext";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import foldersModel from "../../../models/foldersModel";
const mouseCoords = new MouseCoords();
const zStack = new ZStack();
const imageTemplate = new Image();
const colorMap = new ColorMap();

export default function LeftPanel() {
  // const {selectedImage} = useContext(SelectImageContext);
  const {selectedFolder} = useContext(SelectedFolderContext);

  useEffect(() => {
    const setImage = async () => {
      // TODO: delete console.log
      if (selectedFolder) {
        const macroscopicImages = foldersModel.getFolderMacroscopicImages(selectedFolder);
        if (macroscopicImages?.length > 0) {
          if (macroscopicImages[0]) {
            await imageTemplate.setImage(macroscopicImages[0]);
            // imageTemplate.createViewer();
          }
        }
      }
    }
    setImage();
  }, [selectedFolder]);

  useEffect(() => {
    return () => {
      imageTemplate.destructor();
    }
  }, [])

  return (
    <div className="left-panel">
      <div className="left-panel-row-1-1">
        <Webix 
          componentUI={mouseCoords.getUI()}
        />
        <Webix
          componentUI={zStack.getUI()}
        />
      </div>
      <div className="left-panel-row-2-1">
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
