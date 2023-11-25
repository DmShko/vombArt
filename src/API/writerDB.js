import { onAuthStateChanged   } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";

function writeUserData(path, day, time, message) {
      const db = getDatabase();
  set(ref(db, path), {
    day: day,
    time: time,
    message : message
  });
}


export default writeUserData;
