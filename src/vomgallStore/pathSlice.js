import { createSlice } from '@reduxjs/toolkit'

const pathInitialState = {

  logicPath: {

      email: '',
      arts: {
        lirics: false,
        music: false,
        drawing: false
      },
      style: {
        oil: false,
        watercolor: false,
        digital: false,
        mix: false,
      },
      iid:'',
      
  }
};

const pathSlice = createSlice({
    
    name: 'path',
    initialState: pathInitialState,
    
    reducers: {

      changePath(state, action) {
        state.action.payload.changeElement = action.payload.data;
      },

      addPath(state, action) {
        state.action.payload.changeElement = action.payload.data;
      },
    }

  }
);

export const {
    changePath
} = pathSlice.actions;
export default pathSlice.reducer;