import { createSlice } from '@reduxjs/toolkit'

const galleryInitialState = {
  users: [
    {
      name: 'Admin',
      arts: {
        lirics: { name: 'Lirics', style: ['Poem', 'Liric'] },
        music: { name: 'Music', style: ['Classic', 'Pop'] },
        draw: {
          name: 'Drawing',
          style: ['Oil', 'Watercolor', 'Digital', 'Mix'],
        },
      },
      uid: '',
      status: false,
    },
  ],
  itemsBuffer: null,
  messagesBuffer: null,
  searchedUser: true,
  buttonTargetName: '',
  load: false,
  date: null,
  colorActive: '',
  loadFiles: null,
  pageSelector: 5,
  pageQuantity: [],
  pageBuffer: [],
};

const gallerySlice = createSlice({
    name: 'gallery',
    initialState: galleryInitialState,
    
    reducers: {

      change(state, action) {
        switch (action.payload.operation) {
          case 'changeButtonTargetName':
            state.buttonTargetName = action.payload.data;
            break;
          case 'changeUserStatus':
            state.users.find(
              value => value.uid === action.payload.data.id
            ).status = action.payload.data.status;
            break;
          case 'changeUsers':
            state.users = [...state.users, action.payload.data];
            break;
          case 'changeAllUserStatus':
            state.users.find(
              value => value.uid === action.payload.data.id
            ).status = action.payload.data.status;
            break;
          case 'addUserStyle':
            state.users
              .find(value => value.name === action.payload.currentUserName)
              .arts[action.payload.artsName].style.push(action.payload.data);
            break;
          case 'deleteUserStyle':
            state.users.find(
              value => value.name === action.payload.currentUserName
            ).arts[action.payload.artsName].style = state.users
              .find(value => value.name === action.payload.currentUserName)
              .arts[action.payload.artsName].style.filter(
                value => value !== action.payload.data
              );
            break;
          case 'changeItemsBuffer':
            state.itemsBuffer = action.payload.data;
            break;
          case 'changeMessagesBuffer':
            state.messagesBuffer = action.payload.data;
            break;
          case 'changeLoad':
            state.load = action.payload.data;
            break;
          case 'changeDate':
            state.date = action.payload.data;
            break;
          case 'changeLoadFiles':
            state.loadFiles = action.payload.data;
            break;
          case 'changeColorActive':
            state.colorActive = action.payload.data;
            break;
          case 'changePageSelector':
            state.pageSelector = action.payload.data;
            break;
          case 'changePageQuantity':
            state.pageQuantity = action.payload.data;
            break;
          case 'changePageBuffer':
            state.pageBuffer = action.payload.data;
            break;
          default:
            break;
        }
      },
    }

  }
);

export const {
  change
} = gallerySlice.actions;
export default gallerySlice.reducer;