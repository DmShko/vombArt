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
   
      console.log(action.payload);
    //   Notiflix.Notify.success('User is logged in.', {width: '450px', position: 'center-top', fontSize: '24px',});
      // some actions with 'action'...
    });
          
    builder.addCase(getUserAPI.rejected, (state, action) => {
                  
      state.isLoading = false;
      state.error = action.payload;
              
      Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
      
    });
  },
}
);

export const {
  changeSingIn
} = singInSlice.actions;
export default singInSlice.reducer;