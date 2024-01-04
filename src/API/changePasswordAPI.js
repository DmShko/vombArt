import { updatePassword } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const changePassAPI = createAsyncThunk(
  'changePassword/changePassAPI', 
  
  async function (password) {

   return await updatePassword(auth.currentUser, password)
    .then(() => {
      
    })
    .catch((error) => {
      
      // return rejectWithValue(error.response);
      
    });
});

export default changePassAPI

