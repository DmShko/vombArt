import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import changeEmAPI from '../API/changeEmailAPI';

const changeEmailSliceInitialState = {

  error: '',

};

const changeEmailSlice = createSlice({
    name: 'changeEmail',
    initialState: changeEmailSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(changeEmAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(changeEmAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('Email changed', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
                
        builder.addCase(changeEmAPI.rejected, (state, action) => {
                        
          console.log(action)
            
          Notiflix.Notify.warning(`${action.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export default changeEmailSlice.reducer;