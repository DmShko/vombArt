import { updatePassword } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const changePassAPI = createAsyncThunk(
  'changePassword/changePassAPI', 
  
  async function (password, {rejectWithValue}) {

   return await updatePassword(auth.currentUser, password)
    .then(() => {
      
    })
    .catch((error) => {
      
      return rejectWithValue();
      
    });
});

export default changePassAPI

