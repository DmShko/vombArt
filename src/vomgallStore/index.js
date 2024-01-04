import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// my reducers
import singUpReducer from './singUpSlice';
import singInReducer from './singInSlice';
import singOutReducer from './singOutSlice';
import galleryReducer from './gallerySlice';
import pathReducer from './pathSlice';
import readStorageReducer from './readSlice.js';
import deleteStorageReducer from './deleteSlice.js';
import changeEmailReducer from './changeEmailSlice.js';
import changePasswordReducer from './changePasswordSlice.js';
import changeProfileReducer from './changeProfileSlice.js';
import verifiReducer from './emailVerifiSlice.js';
import deleteAccountReducer from './deleteAccountSlice.js';
import reauthUserReducer from './reauthUserSlice.js';

const rootReducer = combineReducers(
    {
        singIn: singInReducer,
        singOut: singOutReducer,
        singUp: singUpReducer,
        gallery: galleryReducer,
        path: pathReducer,
        readStorage: readStorageReducer,
        deleteStorage: deleteStorageReducer,
        changeEmail: changeEmailReducer,
        changePassword: changePasswordReducer,
        changeProfile: changeProfileReducer,
        verifi: verifiReducer,
        deleteAccount: deleteAccountReducer,
        reauthUser: reauthUserReducer,
         //...or more redusers
    }
);

const persistConfig = {
    // 'key' is indeficate of one or more storage
    key: 'root',
    storage,
   
};

// basic reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    }
);

export const persistor = persistStore(store);