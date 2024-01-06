import { getStorage, ref, deleteObject  } from "firebase/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

const deleteStorAPI = createAsyncThunk(
  'deleteStorage/deleteStorAPI', 
  async function (path) {

    const storage = getStorage();

    return await deleteObject (ref(storage, path))
      .then(() => {
       
        
    
      })
      .catch((error) => {
      
        return error.message;

      });
    
});

export default deleteStorAPI