import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import sellReducer from './features/sellSlice';
import searchReducer from './features/searchSlice';
import listReducer from './features/listSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        sell: sellReducer,
        search: searchReducer,
        list: listReducer
    },
});

export default store;
