import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const readerStorAPI = createAsyncThunk(
  'readStorage/readerStorAPI', 
  async function (path, elementId) {

    const storage = getStorage();
     
    return await getDownloadURL(ref(storage, `${path}.jpg`))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
       
        return {id: elementId, URL: url};
    
      })
      .catch((error) => {
        // Handle any errors
        return error.message;
      });
    
});

export default readerStorAPI