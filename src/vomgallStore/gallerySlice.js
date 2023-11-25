import { createSlice } from '@reduxjs/toolkit'

const galleryInitialState = {

  users: [
    {
      name: 'Admin',
      arts:{
        lirics:{name: 'Lirics', style: []},
        music:{name: 'Music', style: []},
        draw: {name: 'Drawing', style: ['Oil', 'Watercolor', 'Digital', 'Mix']}
      },
      uid:'',
      status: false,
    },
  ], 
  searchedUser: true,
  buttonTargetName: '',

};

const gallerySlice = createSlice({
    name: 'gallery',
    initialState: galleryInitialState,
    
    reducers: {

      change(state, action) {
        switch(action.payload.operation){
          case 'changeButtonTargetName':
            state.buttonTargetName = action.payload.data;
            break;
          case 'changeUserStatus':
            state.users.find(value => value.uid === action.payload.data.id).status = action.payload.data.status;
            break;
          case 'changeUsers':
            state.users = [...state.users, action.payload.data];
            break;
          case 'changeAllUserStatus':
            state.users.find(value => value.uid === action.payload.data.id).status = action.payload.data.status;
            break;
          default: break;
        }
      },
    }

  }
);

export const {
  change
} = gallerySlice.actions;
export default gallerySlice.reducer;