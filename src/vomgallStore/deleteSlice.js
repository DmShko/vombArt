import { createSlice } from '@reduxjs/toolkit'
import Notiflix from 'notiflix';

import deleteStorageAPI from '../API/deleteStorageAPI';

const deleteStorageSliceInitialState = {

  isLoading: false,
  ifDeleteAll: false,
  error: '',

};

const deleteStorageSlice = createSlice({
    name: 'deleteStorage',
    initialState: deleteStorageSliceInitialState,
    reducers: {
        changeDelete(state, action) {
            switch (action.payload.operation) {
              case 'setifDeleteAll':
                state.ifDeleteAll = action.payload.data;
                break;
              default:
                break;
            }
        },
    },
    extraReducers: 

    builder => {
        builder.addCase(deleteStorageAPI.pending, (state) => {
            state.isLoading = true; state.error = null;
        });
                
        builder.addCase(deleteStorageAPI.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isSingIn = true;
            console.log(action.payload);
            if(action.payload !== undefined)
            state.itemsURL.push({id: action.payload.elementId, url: action.payload.url,});

            if(state.ifDeleteAll) {
                Notiflix.Notify.success('Items is deleted.', {width: '450px', position: 'center-top', fontSize: '24px',});
                state.ifDeleteAll = false;
            }; 
            // some actions with 'action'...
        });
                
        builder.addCase(deleteStorageAPI.rejected, (state, action) => {
                        
            state.isLoading = false;
          
            state.error = action.payload;
                    
            
            Notiflix.Notify.warning(`${state.error}`, {width: '450px', position: 'center-top', fontSize: '24px',});
            
        });
    },
    }
);

export const {
    changeDelete
} = deleteStorageSlice.actions;
export default deleteStorageSlice.reducer;