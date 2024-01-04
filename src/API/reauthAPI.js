import { reauthenticateWithCredential   } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const reauthUserAPI = createAsyncThunk(
  'reauthUser/reauthUserAPI', 
  
  async function ({ email, password }, {rejectWithValue}) {
    
   return await reauthenticateWithCredential(auth.currentUser, email, password)
    .then(() => {
      
    })
    .catch((error) => {
      
      return rejectWithValue();
      
    });
});

export default reauthUserAPI

