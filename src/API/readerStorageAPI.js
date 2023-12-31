import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const readerStorAPI = createAsyncThunk(
  'readStorage/readerStorAPI', 
  async function ({path, elementId}, {rejectWithValue}) {

    const storage = getStorage();
  
    return await getDownloadURL(ref(storage,`${path}`))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        // console.log(url);
     
        return {elementId, url};
    
      })
      .catch((error) => {
        // Handle any errors
      
        return rejectWithValue();
      });
    
});

export default readerStorAPI