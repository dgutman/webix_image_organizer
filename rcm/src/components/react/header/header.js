import Webix from "../../webix/webix";
import userPanel from "../../webix/header/userPanel";
import { useEffect, useContext, useState } from "react";
import userPanelService from "../../../services/userPanelService";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import ajaxActions from "../../../services/ajaxActions";

export default function Header() {
  const {selectedFolder, setSelectedFolder} = useContext(SelectedFolderContext);
  const [folders, setFolders] = useState([])
  // TODO: delete
  // const [folderID] = useState("666b35d5fa042d3a8432a4fb");
  // const [testDatasetFolderID] = useState("660eeac3ee87269983c8436e");
  const [testDatasetFolderID] = useState("66104727ee87269983c87412");
  const [folderType] = useState("folder");

  useEffect(() => {
    if (folders?.length > 0) {
      userPanel.updateOptions(folders);
      const optionsList = userPanel.getOptionsList();
      const firstItemId = optionsList.getFirstId()
      const dropDown = userPanel.getDropDown();
      dropDown.setValue(firstItemId);
    } 
  }, [folders])

  useEffect(() => {
    const fetchData = async () => {
      const subFolders = await ajaxActions.getSubFolders(folderType, testDatasetFolderID);
      setFolders(subFolders ?? []);
    }
    const attachEvents = () => {
      userPanelService.attachEvents(
        [selectedFolder, setSelectedFolder]
      )
    }
    attachEvents();
    fetchData();
    return () => {
      userPanelService.detachEvents();
    }
  }, []);

  return (
      <Webix 
        componentUI={userPanel.getUI()}
      />
  )
}
