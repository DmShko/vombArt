import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import reauthUserAPI from '../API/reauthAPI';

const reauthUserSliceInitialState = {

  error: '',

};

const reauthUserSlice = createSlice({
    name: 'reauthUser',
    initialState: reauthUserSliceInitialState,
    reducers: {
       
    },
    extraReducers: 

    builder => {
        builder.addCase(reauthUserAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(reauthUserAPI.fulfilled, (state, action) => {

            state.isLoading = false;

            Notiflix.Notify.success('Account deleted', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
                
        builder.addCase(reauthUserAPI.rejected, (state, action) => {
                        
          console.log(action)
            
          Notiflix.Notify.warning(`${action.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export default reauthUserSlice.reducer;