import { useState, useEffect } from 'react';
import './styles/App.css';
import Header from "./components/react/header/header";
import Main from "./components/react/main/main";
import SelectedFolderContext from './context/selectedFolderContext';
import foldersModel from './models/foldersModel';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const selectedFolderValue = { selectedFolder, setSelectedFolder };

  useEffect(() => {
    if (selectedFolder) {
      console.log(foldersModel.getFolderName(selectedFolder));
    }
  }, [selectedFolder]);

  return (
    <SelectedFolderContext.Provider value={selectedFolderValue}>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <main className="App-main">
          <Main />
        </main>
      </div>
    </SelectedFolderContext.Provider>
  );
}

export default App;
