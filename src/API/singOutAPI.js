import { signOut  } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const logInAPI = createAsyncThunk(
  'logIn/logInAPI', 
  
  async function () {
 
   return await signOut (auth)
    .then((userCredential) => {
      // Signed up 

      return userCredential;
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      return error.message;
      // ..
    });
});

export default logInAPI

