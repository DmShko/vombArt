import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import singUpAPI  from '../API/singUpAPI';

const singUpSliceInitialState = {

  isLoading: false,
  error: '',
  token: '',
  usersId: '',
  email:'',
  userName:'',
  userExist: false,
};

const singUpSlice = createSlice({
  name: 'singUp',
  initialState: singUpSliceInitialState,

  reducers: {
    changeSingUp(state, action) {
      switch(action.payload.operation){
        case 'changeusersId':
          state.usersId = action.payload.data;
          break;
        case 'changeUserName':
          state.userName = action.payload.data;
          break;
        case 'changeUserExist':
            state.userExist = action.payload.data;
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
        state.email = action.payload.user.email;
        state.usersId = action.payload.user.uid;
        state.userExist = false;
      
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
export const {
  changeSingUp
} = singUpSlice.actions;
export default singUpSlice.reducer;

