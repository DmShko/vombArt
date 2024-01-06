import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import deleteAccountAPI from '../API/deleteAccountAPI';

const deleteAccountSliceInitialState = {

  error: '',
  accountIsDeleted: false,

};

const deleteAccountSlice = createSlice({
    name: 'deleteAccount',
    initialState: deleteAccountSliceInitialState,
    reducers: {
      changeDelAccount(state, action) {
        switch (action.payload.operation) {
          case 'changeAccountIsDeleted':
            state.accountIsDeleted = action.payload.data;
            break;
          default:
            break;
        }
      }
    },
    extraReducers: 

    builder => {
        builder.addCase(deleteAccountAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(deleteAccountAPI.fulfilled, (state, action) => {

            state.isLoading = false;
            // state.accountIsDeleted = true;

            Notiflix.Notify.success('Account deleted', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
                
        builder.addCase(deleteAccountAPI.rejected, (state, action) => {
                        
          console.log(action)
            
          Notiflix.Notify.warning(`${action.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export const {
  changeDelAccount
} = deleteAccountSlice.actions;

export default deleteAccountSlice.reducer;