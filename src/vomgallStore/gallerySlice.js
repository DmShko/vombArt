import { createSlice } from '@reduxjs/toolkit'

const galleryInitialState = {
  users: [],
  account: {},
  personal: {sex: '', age: '', phone: ''},
  itemsBuffer: null,
  personalMessagesBuffer: {},
  selectedPerson: '',
  messagesBuffer: [],
  itemsMessagesBuffer: [],
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
  selectedItems: [],
  heartsStatistic: {},
  viewsStatistic: {},
  levelStatistic: {},
  currentItemId: '',
  typeOfFile: '',
  answerId:'',
  scrollIsEnd: true,
  mesBuffLength: 0,
  itemMesBuffLength: 0,
  settings: {
    languageSelector: 'English',
    checkDesign: false,
    checkPhone: false,
    checkEmail: false,
    checkSound: false,
    checkColorSchem: false,
    inputSoundSelector: 'Sound_1',
    outputSoundSelector: 'Sound_1',
  },
  actualUserLength: 0,
  actualUsers: [],
  dayNight: false,
  modalPersonalIsOpen: false,
};

// {
//   userName: 'Admin',
//   email: 'admin@gmail.com',
//   arts: {
//     lirics: { name: 'Lirics', style: ['Poem', 'Liric'] },
//     music: { name: 'Music', style: ['Classic', 'Pop'] },
//     draw: {
//       name: 'Drawing',
//       style: ['Oil', 'Watercolor', 'Digital', 'Mix'],
//     },
//   },
//   uid: '',
//   status: false,
// },

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
          case 'changeUserName':
            state.users.find(
              value => value.email === action.payload.data.email
            ).userName = action.payload.data.userName;
            break;
          case 'changeUserFotoURL':
            state.users.find(
              value => value.uid === action.payload.data.id
            ).urlFoto = action.payload.data.value;
            break;
          case 'changeUsers':
            state.users = [...state.users, action.payload.data];
            break;
          case 'deleteUsers':
            state.users = state.users.filter(element => element.uid !== action.payload.data.id);
            break;
          case 'updateUsersArray':
            console.log(action.payload.data)
            state.users = action.payload.data;
            break;
          case 'changeAllUserStatus':
            state.users.find(
              value => value.status = action.payload.data.status
            );
            break;
          case 'addUserStyle':
            state.users
              .find(value => value.userName === action.payload.currentUserName)
              .arts[action.payload.artsName].style.push(action.payload.data);
            break;
          case 'deleteUserStyle':
            state.users.find(
              value => value.userName === action.payload.currentUserName
            ).arts[action.payload.artsName].style = state.users
              .find(value => value.userName === action.payload.currentUserName)
              .arts[action.payload.artsName].style.filter(
                value => value !== action.payload.data
              );
            break;
          case 'changeItemsBuffer':
            state.itemsBuffer = action.payload.data;
            break;
          case 'changeItemsUrl':
            if(state.itemsBuffer !== null && state.itemsBuffer.length !== 0)
            state.itemsBuffer.find(element => element.id === action.payload.id).url = action.payload.url;
            break;
          case 'changeMessagesBuffer':
            state.messagesBuffer = action.payload.data;
            break;
          case 'deleteMessage':
            state.messagesBuffer = state.messagesBuffer.filter(element => element.id !== action.payload.data);
            break;
          case 'changePersonalMessagesBuffer':
            state.personalMessagesBuffer = action.payload.data;
            break;
          case 'deletePersonalMessagesBuffer':
            state.personalMessagesBuffer = state.personalMessagesBuffer.filter(element => element.id !== action.payload.data);
            break;
          case 'changeSelectedPerson':
            state.selectedPerson = action.payload.data;
            break;
          case 'changeItemsMessagesBuffer':
            state.itemsMessagesBuffer = action.payload.data;
            break;
          case 'deleteItemsMessage':
            state.itemsMessagesBuffer = state.itemsMessagesBuffer.filter(element => element.id !== action.payload.data);
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
          case 'changeCurrentItemId':
            state.currentItemId = action.payload.data;
            break;
          case 'changeTypeOfFile':
            state.typeOfFile = action.payload.data;
            break;
          case 'changePageQuantityActive':
            state.pageQuantity.find(value => value.name === Number(action.payload.data)).active = 
            !state.pageQuantity.find(value => value.name === Number(action.payload.data)).active;
            break;
          case 'changePageQuantityReset':
            state.pageQuantity.find(value => value.name === Number(action.payload.data)).active = false;
            break;
          case 'changeHeartsStatistic':

            if(action.payload.mode === 'addUserField') {
             
              state.heartsStatistic = {...state.heartsStatistic, [action.payload.data] : []};
            }
            if(action.payload.mode === 'deleteHeart') {
             
             state.heartsStatistic[action.payload.data.user] =
             state.heartsStatistic[action.payload.data.user].filter(element => element !== action.payload.data.item);
            }
            if(action.payload.mode === 'addItem') {
              if(state.heartsStatistic[action.payload.data.user].includes(action.payload.data.item) === false) 
                state.heartsStatistic[action.payload.data.user].push(action.payload.data.item); 
            }
            if(action.payload.mode === 'update') {
              state.heartsStatistic = action.payload.data;
            }
            break;

          case 'changeViewsStatistic':

            if(action.payload.mode === 'addItem') {
             
              state.viewsStatistic = {...state.viewsStatistic, [action.payload.data] : 0};
            }
            if(action.payload.mode === 'deleteView') {
             
              delete state.viewsStatistic[action.payload.data];
            }
            if(action.payload.mode === 'addValue') {
              state.viewsStatistic[action.payload.data] = state.viewsStatistic[action.payload.data] + 1; 
            }
            if(action.payload.mode === 'update') {
              state.viewsStatistic = action.payload.data;
            }
          break;

          case 'changeLevelStatistic':

            if(action.payload.mode === 'addItem') {
             
              state.levelStatistic = {...state.levelStatistic, [action.payload.data] : 0};
            }
            if(action.payload.mode === 'deleteLevel') {
             
              delete state.levelStatistic[action.payload.data];
            }
            if(action.payload.mode === 'addValue') {
              state.levelStatistic[action.payload.data.item] = action.payload.data.level; 
            }
            if(action.payload.mode === 'update') {
              state.levelStatistic = action.payload.data;
            }
            
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
          case 'updateSelectedItems':
            state.selectedItems = action.payload.data;
            break;
          case 'changeSelectedItems':
            // add/delete item from itemClickId on click
            state.selectedItems.find(element => element === action.payload.data) === undefined ? 
            state.selectedItems = [...state.selectedItems, action.payload.data]: state.selectedItems = state.selectedItems.filter(element => element !== action.payload.data);
            break;
          case 'updateAnswerId':
            state.answerId = action.payload.data;
            break;
          case 'updateScrollIsEnd':
            state.scrollIsEnd = action.payload.data;
            break;
          case 'updateMesBuffLength':
            state.mesBuffLength = action.payload.data;
            break;
          case 'updateItemMesBuffLength':
            state.itemMesBuffLength = action.payload.data;
            break;
          case 'updateSettings':
            
            if(action.payload.data.item === 'languageSelector') state.settings['languageSelector'] = action.payload.data.value;
            if(action.payload.data.item === 'checkDesign') state.settings['checkDesign'] = action.payload.data.value;
            if(action.payload.data.item === 'checkPhone') state.settings['checkPhone'] = action.payload.data.value;
            if(action.payload.data.item === 'checkEmail') state.settings['checkEmail'] = action.payload.data.value;
            if(action.payload.data.item === 'checkColorSchem') state.settings['checkColorSchem'] = action.payload.data.value;
            if(action.payload.data.item === 'checkSound') state.settings['checkSound'] = action.payload.data.value;
            if(action.payload.data.item === 'inputSoundSelector') state.settings['inputSoundSelector'] = action.payload.data.value;
            if(action.payload.data.item === 'outputSoundSelector') state.settings['outputSoundSelector'] = action.payload.data.value;
            
            break;
          case 'changeAccountArray':
            state.account = action.payload.data;
            break;
          case 'updateAccountData':
            state.account = {...state.account, url: action.payload.data.url};
            break;
          case 'updateActualUserLength':
            state.actualUserLength = action.payload.data;
            break;
          case 'tempActualUsers':
            state.actualUsers = action.payload.data;
            break;
          case 'changeActualUsers':
            state.actualUsers = [...state.actualUsers, action.payload.data];
            break;
          case 'changePersonal':
            state.personal = {...state.personal, [action.payload.data.element]: [action.payload.data.value]};
            break;
          case 'updatePersonal':
            state.personal = action.payload.data;
            break;
          case 'changeDayNight':
            state.dayNight = action.payload.data;
            break;
          case 'changeModalPersonalIsOpen':
            state.modalPersonalIsOpen = action.payload.data;
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