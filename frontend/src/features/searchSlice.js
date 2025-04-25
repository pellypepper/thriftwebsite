import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// Async action to fetch search results from backend
export const fetchSearchResults = createAsyncThunk(
    "search/fetchSearchResults",
    async (query, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseURL}/api/product/search?query=${query}`);
            const data = await response.json();
   
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        query: "",
        results: [],
        loading: false,
        error: null
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearch: (state) => {
            state.query = "";
            state.results = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
