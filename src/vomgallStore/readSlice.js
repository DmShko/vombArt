import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import readerStorageAPI from '../API/readerStorageAPI';

const readStorageSliceInitialState = {

  itemsURL: [],
  isLoading: false,
  error: '',

};

const readStorageSlice = createSlice({
    name: 'readStorage',
    initialState: readStorageSliceInitialState,
    reducers: {
        
    },
    extraReducers: 

    builder => {
        builder.addCase(readerStorageAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(readerStorageAPI.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isSingIn = true;
            console.log(action.payload);
            if(action.payload !== undefined)
            state.itemsURL.push({id: action.payload.elementId, url: action.payload.url,});

            // Notiflix.Notify.success('ItemsURL is logged in.', {width: '450px', position: 'center-top', fontSize: '24px',});
            // some actions with 'action'...
        });
                
        builder.addCase(readerStorageAPI.rejected, (state, action) => {
                        
            state.isLoading = false;
          
            state.error = action.payload;
                    
            Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

// export const {
//   changeSingIn
// } = singInSlice.actions;
export default readStorageSlice.reducer;