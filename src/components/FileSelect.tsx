import React, { SetStateAction, useEffect, useState } from "react";
import CsvFile from "../types/CsvFile";


const FileSelect = (csvFile: CsvFile) => {
  // const [csvFile, setCsvFile] = useState(new Blob());

  const getFile= async(file: HTMLInputElement) => {
    if (!file.files || file.files[0]){
      return null;
    }
    // setCsvFile(file.files[0]);
    return file.files[0];
  }
  return(
    <>
      <p>CSVファイルを選択してください。</p>
      <input
        type="file"
        ref={(file: HTMLInputElement) => getFile(file)}
        accept="text/csv"
      />
    </>
  );
}

export default FileSelect;