// import { onAuthStateChanged   } from "firebase/auth";
// import { createAsyncThunk } from "@reduxjs/toolkit";

import { getDatabase, ref, set } from "firebase/database";

function writeUserData(path, data, date) {
  
  console.log(data);
  const db = getDatabase();
  set(ref(db, path), {
    date: date.datedata + '/' + date.yeardata, time: date.timedata, ...data,
  });
}

export default writeUserData;
