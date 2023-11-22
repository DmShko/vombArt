import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import singUpAPI  from '../API/singUpAPI';

const singUpSliceInitialState = {

  isLoading: false,
  error: '',
  token: '',
  usersId: '',

};

const singUpSlice = createSlice({
  name: 'singUp',
  initialState: singUpSliceInitialState,

  reducers: {
    change(state, action) {
      switch(action.payload.operation){
        case 'changeusersId':
          state.usersId = action.payload.data;
          break;
        default: break;
      }
    },
  },

  extraReducers:  
    builder => {
      builder.addCase(singUpAPI.pending, (state) => {
        state.isLoading = true; state.error = null;
      });
            
      builder.addCase(singUpAPI.fulfilled, (state, action) => {

        state.isLoading = false;
        state.token = action.payload.user.accessToken;
        
        state.usersId = action.payload.user.uid;
      
        Notiflix.Notify.success(`User '${action.payload.user.email}' created.`, {width: '450px', position: 'center-top', fontSize: '24px',});
        // some actions with 'action'...
      });
            
      builder.addCase(singUpAPI.rejected, (state, action) => {
                    
        state.isLoading = false;
        state.error = action.payload;
                
        Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
        
      });
    },
  }
);

export default singUpSlice.reducer;

