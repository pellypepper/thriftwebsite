import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const sendClerkDataToBackend = createAsyncThunk(
  'auth/sendClerkData',
  async ({ user, token }) => {
 
    if (!user || !user.id) {
      throw new Error('Invalid user data: missing user ID');
    }

    // Extract email from primaryEmailAddress object
    const email = user.primaryEmailAddress?.emailAddress;
    
  
    const userData = {
      clerkId: user.id,
      email: email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      username: user.username || `${user.firstName}${user.lastName}`.toLowerCase() 
    };



    const response = await fetch('http://localhost:5000/user/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sync Clerk data');
    }
    
    return response.json();
  }
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (token) => {
    const response = await fetch('http://localhost:5000/user/acct', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    clerkSyncStatus: 'idle'
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.clerkSyncStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Handle Clerk data sync states
      .addCase(sendClerkDataToBackend.pending, (state) => {
        state.clerkSyncStatus = 'loading';
      })
      .addCase(sendClerkDataToBackend.fulfilled, (state) => {
        state.clerkSyncStatus = 'succeeded';
      })
      .addCase(sendClerkDataToBackend.rejected, (state, action) => {
        state.clerkSyncStatus = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setUser, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;