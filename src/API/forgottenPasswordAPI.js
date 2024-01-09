import { sendPasswordResetEmail    } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const forgottenPassAPI = createAsyncThunk(
  'forgottenPassword/forgottenPassAPI', 
  
  async function (email) {
    console.log(email)
   return await sendPasswordResetEmail(auth, email)
    .then(() => {
      
    })
    .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;

    });
});

export default forgottenPassAPI

