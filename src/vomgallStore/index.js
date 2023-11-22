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


const rootReducer = combineReducers(
    {
        singIn: singInReducer,
        singOut: singOutReducer,
        singUp: singUpReducer,
        gallery: galleryReducer,
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