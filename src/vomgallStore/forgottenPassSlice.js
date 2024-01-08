import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import forgottenPassAPI from '../API/forgottenPasswordAPI';

const forgottenPassAPISliceInitialState = {

  error: '',

};

const forgottenPasswordSlice = createSlice({
    name: 'forgottenPassword',
    initialState: forgottenPassAPISliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(forgottenPassAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(forgottenPassAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('New password email send', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });

        builder.addCase(forgottenPassAPI.rejected, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.warning('New password email error', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
    },
    }
);

export default forgottenPasswordSlice.reducer;