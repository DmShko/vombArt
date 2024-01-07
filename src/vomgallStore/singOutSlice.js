import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import singOutAPI from '../API/singOutAPI';

const singOutSliceInitialState = {

  isLoading: false,
  isLogOut: false,
  error: '',
};

const singOutSlice = createSlice({
  name: 'singOut',
  initialState: singOutSliceInitialState,
  reducers: {
   
      changeSingOut(state, action) {
        switch (action.payload.operation) {
          case 'changeisLogOut':
            state.isLogOut = action.payload.data;
            break;
          default:
            break;
        }
      }

  },
  extraReducers: 

  builder => {
    builder.addCase(singOutAPI.pending, (state) => {
      state.isLoading = true; state.error = null;
    });
          
    builder.addCase(singOutAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.isLogOut = true;
      Notiflix.Notify.success('User is logged out.', {width: '450px', position: 'center-top', fontSize: '24px',});
      // some actions with 'action'...
    });
          
    builder.addCase(singOutAPI.rejected, (state, action) => {
                  
      state.isLoading = false;
      state.error = action.payload;
              
      Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
      
    });
  },
}
);


export const {
  changeSingOut
} = singOutSlice.actions;
export default singOutSlice.reducer;