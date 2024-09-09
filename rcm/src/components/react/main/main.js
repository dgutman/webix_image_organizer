import { useEffect, useState } from "react";

import Images from "../images/images";
import Table from "../table/table";
import SelectImageContext from "../../../context/selectImageContext";
import imagesModel from "../../../models/imagesModel";

export default function Main() {
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageValue = { selectedImage, setSelectedImage };

  useEffect(() => {
    if (selectedImage) {
      console.log(imagesModel.getImageName(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <SelectImageContext.Provider value={selectedImageValue}>
        <Images />
        <Table />
      </SelectImageContext.Provider>
    </>
  )
}
