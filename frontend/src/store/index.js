/ src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import chatReducer from '../features/chatSlice';
import sellReducer from '../features/sellSlice';
import searchReducer from '../features/searchSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    sell: sellReducer, 
    search: searchReducer 
  }
});