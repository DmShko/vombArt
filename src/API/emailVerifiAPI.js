import { sendEmailVerification   } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const changeVeriAPI = createAsyncThunk(
  'changeVerifi/changeVeriAPI', 
  
  async function () {

   return await sendEmailVerification(auth.currentUser)
    .then(() => {
      
    })
});

export default changeVeriAPI

