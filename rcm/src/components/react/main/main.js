import { useEffect, useState } from "react";

import Images from "../images/images";
import Table from "../table/table";
import SelectImageContext from "../../../context/selectImageContext";

export default function Main() {
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageValue = { selectedImage, setSelectedImage };

  return (
    <>
      <SelectImageContext.Provider value={selectedImageValue}>
        <Images />
        <Table />
      </SelectImageContext.Provider>
    </>
  )
}
