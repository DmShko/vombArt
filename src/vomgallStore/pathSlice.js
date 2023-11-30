import { createSlice } from '@reduxjs/toolkit'

const pathInitialState = {

  logicPath: {

      community: false,
      name: 'Admin',
      arts: {
        lirics: false,
        music: false,
        draw: false
      },
      style: {
        oil: false,
        watercolor: false,
        digital: false,
        mix: false,
        poem: false,
        liric: false,
        classic: false,
        pop: false,
      },
      items: {
        
      }
  }
};

const pathSlice = createSlice({
    
    name: 'path',
    initialState: pathInitialState,
    
    reducers: {

      changePath(state, action) {

        // separate chage 'arts'
        if(action.payload.changeElement.split('.')[0] === 'arts') state.logicPath.arts[action.payload.changeElement.split('.')[1]] = action.payload.data;

         // separate chage 'style'
        if(action.payload.changeElement.split('.')[0] === 'style') state.logicPath.style[action.payload.changeElement.split('.')[1]] = action.payload.data;
      },

      addPath(state, action) {
        state.logicPath.action.payload.changeElement = action.payload.data;
      },
    }

  }
);

export const {
    changePath
} = pathSlice.actions;
export default pathSlice.reducer;