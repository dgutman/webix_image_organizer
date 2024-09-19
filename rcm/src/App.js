import { useState, useEffect } from 'react';
import './styles/App.css';
import Header from "./components/react/header/header";
import Main from "./components/react/main/main";
import ajax from './services/ajaxActions';
// import imagesModel from './models/imagesModel';
// import ImagesContext from './context/imagesContext';
// import SelectImageContext from './context/selectImageContext';
import FoldersContext from './context/folderContext';
import SelectedFolderContext from './context/selectedFolderContext';
import foldersModel from './models/foldersModel';

function App() {
  // const [images, setImages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const selectedImageValue = { selectedImage, setSelectedImage };
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const selectedFolderValue = { selectedFolder, setSelectedFolder };

  // TODO: delete
  const folderID = "666b35d5fa042d3a8432a4fb";
  // const testDatasetFolderID = "660eeac3ee87269983c8436e";
  const testDatasetFolderID = "66104727ee87269983c87412"
  const folderType = "folder";


  useEffect(() => {
    const fetchData = async () => {
      // const imgs = await ajax.getItems(folderID);
      // setImages(imgs)
      // imagesModel.setImages(images);
      const subFolders = await ajax.getSubFolders(folderType, testDatasetFolderID);
      setFolders(subFolders);
      foldersModel.setFolders(folders);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      console.log(foldersModel.getFolderName(selectedFolder));
    }
  }, [selectedFolder]);

  return (
    // <ImagesContext.Provider value={images}>
    <SelectedFolderContext.Provider value={selectedFolderValue}>
    <FoldersContext.Provider value={folders}>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <main className="App-main">
          <Main />
        </main>
      </div>
    </FoldersContext.Provider>
    </SelectedFolderContext.Provider>
    // </ImagesContext.Provider>
  );
}

export default App;