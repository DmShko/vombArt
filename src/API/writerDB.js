// import { onAuthStateChanged   } from "firebase/auth";
// import { createAsyncThunk } from "@reduxjs/toolkit";

import { getDatabase, ref, set } from "firebase/database";

function writeUserData(path, data) {
      const db = getDatabase();
  set(ref(db, path), {
    name: data.name, message: data.message, date: '', time: '',
  });
}

export default writeUserData;
