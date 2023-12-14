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
  fractionPageQuantity: [],
  fractions: 1,
  pageBuffer: [],
  lastWindowSize: 0,
  selectfractionPage: 0,
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
          case 'changeItemsUrl':
            state.itemsBuffer.find(element => element.id === action.payload.id).url = action.payload.url;
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
          case 'changeLastWindowSize':
            state.lastWindowSize = action.payload.data;
            break;
          case 'changeFractionPageQuantity':
            state.fractionPageQuantity = action.payload.data;
            break;
          case 'changeFractions':
            state.fractions = action.payload.data;
            break;
          case 'changeSelectfractionPage':
            state.selectfractionPage = action.payload.data;
              break;
          case 'changePageBuffer':
            state.pageBuffer = action.payload.data;
            break;
          case 'changePageQuantityActive':
            state.pageQuantity.find(value => value.name === Number(action.payload.data)).active = 
            !state.pageQuantity.find(value => value.name === Number(action.payload.data)).active;
            break;
          case 'changePageQuantityReset':
            state.pageQuantity.find(value => value.name === Number(action.payload.data)).active = false;
            break;
          case 'changeFractionPageQuantityActive':
           
            state.fractionPageQuantity.forEach(element => element.forEach(element =>{
          
              if(element.name === Number(action.payload.data))  element.active = 
              !element.active ;

            }));
            break;
          case 'changeFractionPageQuantityReset':
            state.fractionPageQuantity.forEach(element => element.forEach(element => {

              element.active = false;

            })); 
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