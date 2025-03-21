import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async actions using createAsyncThunk
export const createChat = createAsyncThunk('chat/createChat', async (chatDetails) => {
  const response = await fetch('http://localhost:5000/chat/create-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chatDetails),
  });
  const data = await response.json();
  console.log(data);
  return data;
});

export const sendMessage = createAsyncThunk(
  'chat/sendMessage', 
  async (messageData, { rejectWithValue }) => {
    try {
      const { chat_id, sender_id, message_text, message_sender } = messageData;
          
      if (!chat_id || !sender_id || !message_text || !message_sender) {
        console.error('Missing required fields:', { chat_id, sender_id, message_text, message_sender });
        return rejectWithValue('Missing required message fields');
      }
      
      const response = await fetch('http://localhost:5000/chat/send-message', {
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
  const response = await fetch(`http://localhost:5000/chat/get-messages/${chat_id}`);
  const data = await response.json();
  console.log(data);
  return data;
});

export const getUsers = createAsyncThunk('chat/getUsers', async (userDetails) => {
    const response = await fetch(`http://localhost:5000/chat/getUser/${userDetails}`);
      console.log(response);
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
  reducers: {},
  extraReducers: (builder) => {
    // Handle createChat
    builder.addCase(createChat.fulfilled, (state, action) => {
        if (action.payload.chat_id) {
            state.chatId = action.payload.chat_id;
            console.log('Updated chatId in Redux state:', state.chatId); 
          } else {
            console.error('Error: chat_id not found in payload');
          }
    });
    
    // Handle sendMessage
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.messages.push(action.payload);
    });

    // Handle getMessages
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });

    // Handle errors
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.error = action.error.message;
      }
    );
  },
});

export default chatSlice.reducer;
