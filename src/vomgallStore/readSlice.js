import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import readerStorageAPI from '../API/readerStorageAPI';

const readStorageSliceInitialState = {

  itemsURL: [],
  isLoading: false,
  error: false,

};

const readStorageSlice = createSlice({
    name: 'readStorage',
    initialState: readStorageSliceInitialState,
    reducers: {

        changeReadStorage(state, action) {
            switch (action.payload.operation) {
              case 'changeItemsURL':
                state.itemsURL = [];
                break;
              default: break;
            }
        },
        
    },
    extraReducers: 

    builder => {
        builder.addCase(readerStorageAPI.pending, (state) => {
            state.isLoading = true; state.error = false;
        });
                
        builder.addCase(readerStorageAPI.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isSingIn = true;
            state.error = false;
            
            console.log(action.payload);
            if(action.payload !== undefined) {
                state.itemsURL.push({id: action.payload.elementId, url: action.payload.url,});
            }
            
            // Notiflix.Notify.success('ItemsURL is logged in.', {width: '450px', position: 'center-top', fontSize: '24px',});
            // some actions with 'action'...
        });
                
        builder.addCase(readerStorageAPI.rejected, (state, action) => {
                        
            state.isLoading = false;
            state.error = true;

            Notiflix.Notify.warning('File not found in storage', {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export const {
    changeReadStorage
} = readStorageSlice.actions;
export default readStorageSlice.reducer;