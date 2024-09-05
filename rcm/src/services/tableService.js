import tableModel from "../models/tableModel";
import ajaxActions from "./ajaxActions";

function attachEvents(datatable, selectedImageContext) {
  if (!datatable) {
    debugger;
  }
  const [, setSelectedImage] = selectedImageContext;
  datatable.attachEvent("onAfterSelect", async (selection) => {
    const selectionID = selection.id;
    const item = datatable.getItem(selectionID);
    const itemYamlID = tableModel.getItemYamlID(item);
    // const imageID = findImageIDFromYaml(itemYamlID);
    const image = await ajaxActions.getItem(itemYamlID);
    setSelectedImage(image);
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
}

export default tableService;
