import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import changeProAPI from '../API/changeProfileAPI';

const changeProfileSliceInitialState = {

  error: '',

};

const changeProfileSlice = createSlice({
    name: 'changeProfile',
    initialState: changeProfileSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(changeProAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(changeProAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('Profile changed', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
                
        builder.addCase(changeProAPI.rejected, (state, action) => {
                        
          Notiflix.Notify.warning(`${action.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export default changeProfileSlice.reducer;