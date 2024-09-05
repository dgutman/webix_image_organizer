// TODO: implement
// import LoginWindowView from "../../webix/auth/auth";
import Webix from "../../webix/webix";
import userPanel from "../../webix/header/userPanel";
import { useEffect, useContext } from "react";
// import ImagesContext from "../../../context/imagesContext";
// import SelectImageContext from "../../../context/selectImageContext";
import userPanelService from "../../../services/userPanelService";
import FoldersContext from "../../../context/folderContext";
import SelectedFolderContext from "../../../context/selectedFolderContext";

export default function Header() {
  // const images = useContext(ImagesContext);
  // const {selectedImage, setSelectedImage} = useContext(SelectImageContext);

  const folders = useContext(FoldersContext);
  const {selectedFolder, setSelectedFolder} = useContext(SelectedFolderContext);

  // useEffect(() => {
  //   userPanel.updateOptions(images);
  // }, [images]);

  useEffect(() => {
    if (folders?.length > 0) {
      userPanel.updateOptions(folders);
    } 
  }, [folders])

  // useEffect(() => {
  //   const attachEvents = () => {
  //     userPanelService.attachEvents(
  //       [selectedImage, setSelectedImage]
  //     );
  //   }
  //   attachEvents();
  //   return () => {
  //     userPanelService.detachEvents();
  //   }
  // }, [])

  useEffect(() => {
    const attachEvents = () => {
      userPanelService.attachEvents(
        [selectedFolder, setSelectedFolder]
      )
    }
    attachEvents();
    return () => {
      userPanelService.detachEvents();
    }
  })


  return (
    // <SelectImageContext.Provider value={selectedImage}>
    <SelectedFolderContext.Provider value={selectedFolder}>
      <Webix 
        componentUI={userPanel.getUI()} 
      />
    </SelectedFolderContext.Provider>
    // </SelectImageContext.Provider>
  )
}
