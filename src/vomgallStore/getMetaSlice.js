import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import getMetaAPI from '../API/getMetaDataAPI';

const getMetaAPISliceInitialState = {

  error: '',
  itemsMetaData: [],

};

const getMetaAPISlice = createSlice({
    name: 'getMeta',
    initialState: getMetaAPISliceInitialState,
    reducers: {

        changeItemsMetaData(state, action) {
            switch (action.payload.operation) {

              case 'deleteElement':
                state.itemsMetaData = state.itemsMetaData.filter(element => element.id !== action.payload.data);
                break;
              case 'updateMetaData':
                state.itemsMetaData = action.payload.data;
                break;
              default:
                break;
            }
        }
       
    },
    extraReducers: 

    builder => {
        builder.addCase(getMetaAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(getMetaAPI.fulfilled, (state, action) => {

            state.isLoading = false;
           
            state.itemsMetaData.push({id: action.payload.fullPath.split('/')[action.payload.fullPath.split('/').length - 1] , path: action.payload.fullPath});

            Notiflix.Notify.success('Meta data is ready', {width: '450px', position: 'center-top', fontSize: '24px',});
           
            // some actions with 'action'...
        });
    },
    }
);
export const {
    changeItemsMetaData
} = getMetaAPISlice.actions;
export default getMetaAPISlice.reducer;