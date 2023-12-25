import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const readerStorAPI = createAsyncThunk(
  'readStorage/readerStorAPI', 
  async function ({path, elementId}) {

    const storage = getStorage();
  
    console.log(elementId); 
    return await getDownloadURL(ref(storage,`${path}`))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        // console.log(url);
     
        return {elementId, url};
    
      })
      .catch((error) => {
        // Handle any errors
      
        return error.message;
      });
    
});

export default readerStorAPI