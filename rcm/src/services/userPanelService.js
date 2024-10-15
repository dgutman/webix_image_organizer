import userPanel from "../components/webix/header/userPanel";
let changeEvent;

function attachEvents(selectedFolderContext) {
  const [, setSelectedFolder] = selectedFolderContext;
  const dropDown = userPanel.getDropDown();
  if (!changeEvent) {
    changeEvent = dropDown.attachEvent("onChange", (newValue) => {
      const optionsList = userPanel.getOptionsList();
      const selectedItem = optionsList.getItem(newValue);
      setSelectedFolder(selectedItem);
    })
  }
}

function detachEvents() {
  if (changeEvent) {
    const dropDown = userPanel.getDropDown();
    if (dropDown) {
      dropDown.detachEvent(changeEvent)
    }
    changeEvent = null;
  }
}

const module = {
  attachEvents,
  detachEvents,
}

export default module;
