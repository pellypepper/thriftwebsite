
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import chatReducer from './features/chatSlice';
import sellReducer from './features/sellSlice';
import searchReducer from './features/searchSlice';
import inboxReducer from './features/inboxSlice'
import listReducer from './features/listSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    sell: sellReducer, 
    search: searchReducer ,
    inbox: inboxReducer,
    list: listReducer
  }
});
export default store;
