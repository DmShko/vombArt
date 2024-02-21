import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import singInAPI from '../API/singInAPI';

const singInSliceInitialState = {

  items: [],
  isLoading: false,
  error: '',
  token: '',
  isSingIn: false,
  singInId: '',
};

const singInSlice = createSlice({
  name: 'singIn',
  initialState: singInSliceInitialState,
  reducers: {
    changeSingIn(state, action) {
      switch(action.payload.operation){
        case 'changeisSingIn':
         
          state.isSingIn = action.payload.data;
          break;

        case 'changeToken':
         
          state.token = action.payload.data;
          break;
        case 'changeSingInId':
         
          state.singInId = action.payload.data;
          break;
        default: break;
      }
    },
  },
  extraReducers: 

  builder => {
    builder.addCase(singInAPI.pending, (state) => {
      state.isLoading = true; state.error = null;
    });
          
    builder.addCase(singInAPI.fulfilled, (state, action) => {

      state.isLoading = false;
      state.isSingIn = true;
    
      // if(typeof(action.payload) !== 'string') {
        state.token = action.payload.user.accessToken;
        state.singInId = action.payload.user.uid;
      // }

      Notiflix.Notify.success('User is logged in.', {width: '450px', position: 'center-top', fontSize: '24px',});
      // some actions with 'action'...
    });
          
    builder.addCase(singInAPI.rejected, (state, action) => {
                  
      state.isLoading = false;
      state.error = action.payload;
      
      // auth/invalid-login-credentials       
      Notiflix.Notify.warning(`${action.payload}`, {width: '450px', position: 'center-top', fontSize: '24px',});
      
    });
  },
}
);

export const {
  changeSingIn
} = singInSlice.actions;
export default singInSlice.reducer;