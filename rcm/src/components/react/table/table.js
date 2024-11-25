import React, { useContext, useEffect, useState } from "react";
import Webix from "../../webix/webix";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import SelectImageContext from "../../../context/selectImageContext";
import DataTable from "../../webix/table/table";
import foldersModel from "../../../models/foldersModel";
import tableService from "../../../services/tableService";
import tableModel from "../../../models/tableModel";

export default function Table() {
  const {selectedFolder} = useContext(SelectedFolderContext);
  const {selectedImage, setSelectedImage} = useContext(SelectImageContext);
  const [dataTable] = useState(new DataTable())

  useEffect(() => {
    if (selectedFolder) {
      const yamlData = foldersModel.getYamlData(selectedFolder);
      tableModel.setYamlData(yamlData);
      // TODO: alternative data source
      // const data = foldersModel.getFolderRegistrationData(selectedFolder);
      const data = foldersModel.getFolderRegistrationDataSimplified(selectedFolder);
      if (data) {
        dataTable.parseData(data);
        const dataTableView = dataTable.getDatatable()
        const firstImageID = dataTableView.getFirstId()
        dataTableView.select(firstImageID);
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
    <Webix componentUI={dataTable.getUI()}/>
  )
}
