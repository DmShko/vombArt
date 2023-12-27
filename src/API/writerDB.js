// import { onAuthStateChanged   } from "firebase/auth";
// import { createAsyncThunk } from "@reduxjs/toolkit";

import { getDatabase, ref, set } from "firebase/database";

function writeUserData(path, data, date, mode) {
  
  const db = getDatabase();
  if(mode === false) {
    set(ref(db, path), {
      date: date.datedata + '/' + date.yeardata, time: date.timedata, second: date.dateSeconds, ...data,
    });
  } else {
    set(ref(db, path),{...data});
  };
};

export default writeUserData;
