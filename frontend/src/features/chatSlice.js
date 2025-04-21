import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createChat = createAsyncThunk('chat/createChat', async (chatDetails) => {
  const response = await fetch('http://localhost:8080/chat/create-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chatDetails),
  });
  const data = await response.json();

  return data;
});

export const sendMessage = createAsyncThunk(
  'chat/sendMessage', 
  async (messageData, { rejectWithValue }) => {
    try {
      const { chat_id, sender_id, message_text, message_sender } = messageData;
          
      if (!chat_id || !sender_id || !message_text || !message_sender) {
       
        return rejectWithValue('Missing required message fields');
      }
      console.log(messageData)
      const response = await fetch('http://localhost:8080/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMessages = createAsyncThunk('chat/getMessages', async (chat_id) => {
  const response = await fetch(`http://localhost:8080/chat/get-messages/${chat_id}`);
  const data = await response.json();

  return data;
});

export const deleteMessages = createAsyncThunk(
  'chat/deleteMessages', 
  async (chat_id) => {   
  
    const response = await fetch(`http://localhost:8080/chat/delete-message/${chat_id}`, {
      method: 'DELETE',
    });
    const data = await response.json();

    return data;
  }
);

export const getUsers = createAsyncThunk('chat/getUsers', async (userDetails) => {
  const response = await fetch(`http://localhost:8080/chat/getUser/${userDetails}`);

  return response.json();
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatId: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
 
    builder
      .addCase(createChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.chat_id) {
          state.chatId = action.payload.chat_id;
          console.log('Updated chatId in Redux state:', state.chatId); 
        } else {
          console.error('Error: chat_id not found in payload');
        }
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    
 
    .addCase(sendMessage.pending, (state) => {
      state.loading = true;
    })
    .addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
  
    })
    .addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })


    .addCase(getMessages.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    })
    .addCase(getMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })


    .addCase(deleteMessages.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteMessages.fulfilled, (state, action) => {
      state.loading = false;
 
      const deletedChatId = action.payload.chat_id;
      state.messages = state.messages.filter(msg => msg.chat_id !== deletedChatId);
    })
    .addCase(deleteMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    // Handle errors globally
    .addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.error = action.error.message;
      }
    );
  },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
