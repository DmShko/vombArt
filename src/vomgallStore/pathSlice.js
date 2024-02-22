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
  
      },

      changePathName(state, action) {
        state.logicPath.name = action.payload.data;
      },

      changeCommunity(state, action) {
        state.logicPath.community = action.payload.data;
      },

      updatePathStyle(state, action) {
        
        let updatePathStyle = state.logicPath.style;
        let mostPathStyle = Object.keys(state.logicPath.style).map(element => element.toLowerCase());

        // if user add style, that need write his to 'PathStyle'
        if(state.logicPath.style !== undefined && state.logicPath.style !== null) {
          for(const value of action.payload.data) {
            
            if(mostPathStyle.find(element => element === value.toLowerCase()) === undefined) {
              
              updatePathStyle = {...updatePathStyle, [value.toLowerCase()]: false}
            }
            
          }
        }
        
   
        state.logicPath.style = updatePathStyle;
     
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
    updatePathStyle,
} = pathSlice.actions;
export default pathSlice.reducer;