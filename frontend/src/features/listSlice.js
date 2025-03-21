import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



export const getChatId = createAsyncThunk('listing/getChatId', async (userId) => {
    const response = await fetch(`http://localhost:5000/listing/getChatId/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  });

  export const getCombineInfo = createAsyncThunk('listing/getInfo', async (chatIds) => {
    const response = await fetch(`http://localhost:5000/listing/getInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({chatIds})
    });

    const data = await response.json();

    return data;
  });

  const initialState = {
    chatId: [],
    combineInfo : [],
    loading: false,
    error: null,
  };
  const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
      // You can add any reducers here for local actions if needed
    },
    extraReducers: (builder) => {
      builder
        .addCase(getChatId.pending, (state) => {
          state.loading = true;
          state.error = null; 
        })
        .addCase(getChatId.fulfilled, (state, action) => {
          state.loading = false;
          if (Array.isArray(action.payload)) {
            state.chatId = action.payload.map(item => item.chat_id);
        } else {
            
            state.chatId = [];
        }
        })
        .addCase(getChatId.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message; 
        })
        .addCase(getCombineInfo.pending, (state)=>{
            state.loading = true;
            state.error = null; 
        })
        .addCase(getCombineInfo.fulfilled, (state, action)=>{
            state.loading = false;
            state.combineInfo = action.payload; 
        })
        .addCase(getCombineInfo.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message; 
        })
    },
  });
  
  export default listSlice.reducer;