import { getStorage, ref, getMetadata } from "firebase/storage";
import { createAsyncThunk } from "@reduxjs/toolkit";


const getMetaAPI = createAsyncThunk(
  'getMeta/getMetaAPI', 
  
  async function (path, {rejectWithValue}) {

   const storage = getStorage();
   const listRef = ref(storage, path);

   return await getMetadata(listRef)
    .then((metadata) => {
      return metadata;
    })
    .catch((error) => {
      
      return rejectWithValue(error.message);
      
    });
});

export default getMetaAPI

