import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const getUserItem = createAsyncThunk('listing/getUserItem', async (userId) => {
    const response = await fetch(`http://localhost:5000/listing/getUserItem/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
 
    const data = await response.json();
 
    return data;
  });

  export const updateUserItem = createAsyncThunk('listing/updateUserItem', async (updatedItem) => {
    const response = await fetch(`http://localhost:5000/listing/getUserItem`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    
      body: JSON.stringify(updatedItem)
 
    });

    const data = await response.json();
  
    return data;
  });


  export const deleteUserItem = createAsyncThunk('listing/deleteUserItem', async ({userId, id}) => {
    const response = await fetch(`http://localhost:5000/listing/deleteUserItem/${userId}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
  
    const data = await response.json();

    return data;
  });

  const initialState = {
    items: [],
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
        .addCase(getUserItem.pending, (state) => {
          state.loading = true;
          state.error = null; 
        })
        .addCase(getUserItem.fulfilled, (state, action) => {
          state.loading = false;
          state.items = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(getUserItem.rejected, (state, action) => {
       state.loading = false;
        state.error = action.error.message;
        }

        )
        .addCase(updateUserItem.fulfilled, (state, action) => {
        
            const updatedItem = action.payload;
            const index = state.items.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                state.items[index] = updatedItem;
            }
        })
        .addCase(deleteUserItem.fulfilled, (state, action) => {
          
            state.items = state.items.filter(item => item.id !== action.payload.id);
        });
    },
  });



  export default listSlice.reducer;
  