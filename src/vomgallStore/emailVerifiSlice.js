import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import changeVeriAPI from '../API/emailVerifiAPI';

const verifiSliceInitialState = {

  error: '',

};

const verifiSlice = createSlice({
    name: 'changeProfile',
    initialState: verifiSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(changeVeriAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(changeVeriAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('Verifi email send', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
    },
    }
);

export default verifiSlice.reducer;