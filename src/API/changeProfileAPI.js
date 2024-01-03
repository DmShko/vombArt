import { updateProfile  } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const changeProAPI = createAsyncThunk(
  'changeProfile/changeProAPI', 
  
  async function (data, {rejectWithValue}) {

   return await updateProfile (auth.currentUser, {email: data})
    .then(() => {
      
    })
    .catch((error) => {
      
      return rejectWithValue();
      
    });
});

export default changeProAPI

