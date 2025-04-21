import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://thriftwebsite.fly.dev';


// Async thunk for posting a new listing
export const postListing = createAsyncThunk('sell/postListing', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseURL}/api/sell/form`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching items based on category
export const fetchItems = createAsyncThunk('sell/fetchItems', async ({ category, page = 1, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseURL}/api/product/items?category=${category}`);
    console.log('API Response:', response.data);
    console.log("Fetching from:", `${process.env.REACT_APP_API_URL}/api/product/items?category=${category}`);

    return { category, items: response.data }; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const sellSlice = createSlice({
  name: 'sell',
  initialState: {
    items: {}, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(postListing.fulfilled, (state, action) => {
        state.loading = false;
        const category = action.payload.category; 
        if (!state.items[category]) {
          state.items[category] = []; 
        }
        state.items[category].push(action.payload.item);
      })
      .addCase(postListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        const { category, items } = action.payload; 
        state.items[category] = items; 
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellSlice.reducer;
