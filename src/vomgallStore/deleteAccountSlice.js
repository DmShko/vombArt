import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import deleteAccountAPI from '../API/deleteAccountAPI';

const deleteAccountSliceInitialState = {

  error: '',

};

const deleteAccountSlice = createSlice({
    name: 'deleteAccount',
    initialState: deleteAccountSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(deleteAccountAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(deleteAccountAPI.fulfilled, (state, action) => {

            state.isLoading = false;

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

export default deleteAccountSlice.reducer;