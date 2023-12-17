import { signInWithEmailAndPassword  } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import Notiflix from 'notiflix';

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
      Notiflix.Notify.warning(`${error.code}`, {width: '450px', position: 'center-top', fontSize: '24px',});
      // return error.code;
      // ..
    });
});

export default singInAPI

