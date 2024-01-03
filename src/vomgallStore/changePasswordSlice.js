import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import changePassAPI from '../API/changePasswordAPI';

const changePasswordSliceInitialState = {

  error: '',

};

const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState: changePasswordSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(changePassAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(changePassAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('Password changed', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
                
        builder.addCase(changePassAPI.rejected, (state, action) => {
                        
          Notiflix.Notify.warning(`${action.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export default changePasswordSlice.reducer;