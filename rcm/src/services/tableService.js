import tableModel from "../models/tableModel";

function attachEvents(datatable, selectedImageContext) {
  const [, setSelectedImage] = selectedImageContext;
  datatable.attachEvent("onAfterSelect", async (selection) => {
    const selectionID = selection.id;
    const item = datatable.getItem(selectionID);
    setSelectedImage(item);
  });
}

function findImageIDFromYaml(yamlID) {
  const yamlData = tableModel.getYamlData();
  const item = yamlData.find((i) => {
    return i._id === yamlID;
  });
  return item?.largeImage?.fileId;
}

const tableService = {
  attachEvents,
  findImageIDFromYaml
}

export default tableService;
