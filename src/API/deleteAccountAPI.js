import { deleteUser  } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const deleteAccAPI = createAsyncThunk(
  'deleteAccount/deletAccAPI', 
  
  async function () {
 
   return await deleteUser (auth.currentUser)
    .then(() => {
      
    })
    .catch((error) => {
      
      // return rejectWithValue(error);
      
    });
});

export default deleteAccAPI

