import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import singOutAPI from '../API/singOutAPI';

const singOutSliceInitialState = {

  isLoading: false,
  error: '',
 
};

const singOutSlice = createSlice({
  name: 'singOut',
  initialState: singOutSliceInitialState,
  reducers: {
    
  },
  extraReducers: 

  builder => {
    builder.addCase(singOutAPI.pending, (state) => {
      state.isLoading = true; state.error = null;
    });
          
    builder.addCase(singOutAPI.fulfilled, (state, action) => {

      state.isLoading = false;
    
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

export default singOutSlice.reducer;