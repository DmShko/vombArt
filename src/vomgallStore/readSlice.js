import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import readerStorageAPI from '../API/readerStorageAPI';

const readStorageSliceInitialState = {

  itemsURL: [],
  isLoading: false,
  error: false,
  errorElementId: '',
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
              case 'clearErrorElementId':
                state.errorElementId = '';
                break;
              case 'clearUserFotoElement':
                state.itemsURL = state.itemsURL.filter(element => element.id !== action.payload.data.id);
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
          
            if(action.payload !== undefined && state.itemsURL.length !== 0) {

                // if element exist, then delete his
                if(state.itemsURL.find(element => element.id === action.payload.elementId)) {
                    state.itemsURL = state.itemsURL.filter(element => element.id !== action.payload.elementId);
                }

                // and add his again
                state.itemsURL.push({id: action.payload.elementId, url: action.payload.url,}); 
                     
            } else {
                // and element to empty itemsURL array
                state.itemsURL.push({id: action.payload.elementId, url: action.payload.url,}); 
            }
            
            // Notiflix.Notify.success('ItemsURL is logged in.', {width: '450px', position: 'center-top', fontSize: '24px',});
            // some actions with 'action'...
        });
                
        builder.addCase(readerStorageAPI.rejected, (state, action) => {

            state.isLoading = false;
            state.error = true;

            // first this row, otherwise will be show error many times 
            if(state.errorElementId === '')
                Notiflix.Notify.warning('File not found in storage', {width: '450px', position: 'center-top', fontSize: '24px',});

            //error key for show error once (see SharedLayout 77 row)
            state.errorElementId = action.meta.arg.elementId;
            
        });
    },
    }
);

export const {
    changeReadStorage
} = readStorageSlice.actions;
export default readStorageSlice.reducer;