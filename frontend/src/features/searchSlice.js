import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action to fetch search results from backend
export const fetchSearchResults = createAsyncThunk(
    "search/fetchSearchResults",
    async (query, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/search?query=${query}`);
            const data = await response.json();
            console.log(data);
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
