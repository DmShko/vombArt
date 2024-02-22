import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import getUserAPI from '../API/getUserAPI';

const getUserSliceInitialState = {
 
  currentUserId: '',
  isLoading: false,
  error: false,
};

const getUserSlice = createSlice({
  name: 'getUser',
  initialState: getUserSliceInitialState,
  reducers: {
   
  },
  extraReducers: 

  builder => {
    builder.addCase(getUserAPI.pending, (state) => {
      state.isLoading = true; 
      state.error = null;
    });
          
    builder.addCase(getUserAPI.fulfilled, (state, action) => {

      state.isLoading = false;
      
    });
          
    builder.addCase(getUserAPI.rejected, (state, action) => {
                  
      state.isLoading = false;
      state.error = action.payload;
              
      Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
      
    });
  },
}
);

export default getUserSlice.reducer;