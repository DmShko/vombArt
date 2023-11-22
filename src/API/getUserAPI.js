import { onAuthStateChanged   } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";

const getUserAPI = () => {
 
    return onAuthStateChanged(auth, (user) => { 
      
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
     
        return user.uid;
        // ...
      } else {
        // User is signed out
        // ...
        return 'is signed out';
      }
    
    });
}

export default getUserAPI
