import { createSlice } from '@reduxjs/toolkit'

const pathInitialState = {

  logicPath: {

      community: false,
      name: '',
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

         // separate chage 'style'
         if(action.payload.changeElement  === 'name') state.logicPath.name = action.payload.data;
      },

      addPath(state, action) {
        state.logicPath.action.payload.changeElement = action.payload.data;
      },

      addStyleToPath(state, action) {
        
        state.logicPath.style = {...state.logicPath.style, [action.payload.data]: false};
      },

      deleteStyleToPath(state, action) {
        let newPathStyle = {};
        for(const key in state.logicPath.style) {
          
          if(key !== action.payload.data) {
            newPathStyle = {...newPathStyle, [key]: state.logicPath.style[key]}
          }
          
        }
        state.logicPath.style = newPathStyle;

        console.log(state.logicPath.style);
  
      },

      changePathName(state, action) {
        state.logicPath.name = action.payload.data;
      },

      changeCommunity(state, action) {
        state.logicPath.community = action.payload.data;
      },
    }

  }
);

export const {
    changePath,
    changePathName,
    changeCommunity,
    addStyleToPath,
    deleteStyleToPath,
} = pathSlice.actions;
export default pathSlice.reducer;