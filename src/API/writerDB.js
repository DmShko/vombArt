import { onAuthStateChanged   } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { auth } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";

function writeUserData(path, data) {
      const db = getDatabase();
  set(ref(db, path), {
    [data.name]:{name: data.name, message: data.message, date: '', time: ''},
  });
}

export default writeUserData;
