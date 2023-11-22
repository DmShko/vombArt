import { signInWithEmailAndPassword  } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const singInAPI = createAsyncThunk(
  'singIn/singInAPI', 
  
  async function ({ email, password }) {
 
   return await signInWithEmailAndPassword (auth, email, password)
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

export default singInAPI

