import { updateEmail } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const changeEmAPI = createAsyncThunk(
  'changeEmail/changeEmAPI', 
  
  async function (email, {rejectWithValue}) {
 
   return await updateEmail(auth.currentUser, email)
    .then(() => {
      
    })
    .catch((error) => {
      
      return rejectWithValue(error.message);
      
    });
});

export default changeEmAPI

