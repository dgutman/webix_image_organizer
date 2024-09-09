import React, { useContext, useEffect } from "react";
import Webix from "../../webix/webix";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import SelectImageContext from "../../../context/selectImageContext";
import DataTable from "../../webix/table/table";
import foldersModel from "../../../models/foldersModel";
import tableService from "../../../services/tableService";
import tableModel from "../../../models/tableModel";

const dataTable = new DataTable();

export default function Table() {
  const {selectedFolder} = useContext(SelectedFolderContext);
  const {selectedImage, setSelectedImage} = useContext(SelectImageContext);

  useEffect(() => {
    if (selectedFolder) {
      const yamlData = foldersModel.getYamlData(selectedFolder);
      tableModel.setYamlData(yamlData);
      const data = foldersModel.getFolderRegistrationData(selectedFolder);
      if (data) {
        dataTable.parseData(data);
      }
    }
  }, [selectedFolder]);
  
  useEffect(() => {
    const attachEvents = () => {
      const dataTableView = dataTable.getDatatable();
      tableService.attachEvents(dataTableView, [selectedImage, setSelectedImage]);
    }
    attachEvents();
    return () => {
      dataTable.destructor();
    }
  });
  
  return (
    <Webix
    componentUI={dataTable.getUI()}/>
  )
}
