import React, { useContext, useEffect, useState } from "react";
import Webix from "../../webix/webix";
import SelectedFolderContext from "../../../context/selectedFolderContext";
import SelectImageContext from "../../../context/selectImageContext";
import DataTable from "../../webix/table/table";
import foldersModel from "../../../models/foldersModel";
import tableService from "../../../services/tableService";
import tableModel from "../../../models/tableModel";

export default function Table() {
  const { selectedFolder } = useContext(SelectedFolderContext);
  const { selectedImage, setSelectedImage } = useContext(SelectImageContext);
  const [dataTable] = useState(new DataTable())

  useEffect(() => {
    if (selectedFolder) {
      console.log('Table: selectedFolder changed to:', selectedFolder?.name, selectedFolder);
      const yamlData = foldersModel.getYamlData(selectedFolder);
      tableModel.setYamlData(yamlData);

      // Try simplified registration data first, fall back to full registration data
      let data = foldersModel.getFolderRegistrationDataSimplified(selectedFolder);
      if (!data) {
        console.log('Table: Trying fallback to full registration data');
        data = foldersModel.getFolderRegistrationData(selectedFolder);
      }
      console.log('Table: registration data for folder:', selectedFolder?.name, data);
      console.log('Table: folder meta data:', selectedFolder?.meta);
      if (data) {
        dataTable.parseData(data);
        const dataTableView = dataTable.getDatatable()
        const firstImageID = dataTableView.getFirstId()
        console.log('Table: first image ID:', firstImageID);
        dataTableView.select(firstImageID);
      } else {
        console.log('Table: No registration data found for folder:', selectedFolder?.name);
        // Clear the table when no data is available
        dataTable.parseData([]);
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
    <Webix componentUI={dataTable.getUI()} />
  )
}
