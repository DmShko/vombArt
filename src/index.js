import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App  from './App.jsx';
import { store, persistor } from './vomgallStore/index'
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import './firebase'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Provider store={store}>
      <BrowserRouter basename="/vombArt">
        <PersistGate loading={null} persistor={persistor}>
           <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>

  </React.StrictMode>
);
