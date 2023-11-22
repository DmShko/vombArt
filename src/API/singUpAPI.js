import { createUserWithEmailAndPassword } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const singUpAPI = createAsyncThunk(
  'singUp/singUpAPI', 
  
  async function ({ email, password }) {
 
   return await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 

      return userCredential;
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // return error.message;
      // ..
    });
});

export default singUpAPI

