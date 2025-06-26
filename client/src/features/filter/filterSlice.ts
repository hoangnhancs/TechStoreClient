import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filter: {} as Record<number, number[]>,
    priceSort: 'asc' as 'asc' | 'desc',
    searchQuery: '' as string,
}
const filterSlice = createSlice({
    initialState,
    name: 'filter',
    reducers: {
        setFilter: (state, action: { payload: Record<number, number[]> }) => {
            state.filter = action.payload;
        },
        clearFilterByTagId: (state, action: { payload: number }) => {
            const tagId = action.payload;
            delete state.filter[tagId];
        },
        clearAllFilters: () => {
            return initialState;
        },
        setPriceSort: (state, action: { payload: 'asc' | 'desc' }) => {
            state.priceSort = action.payload;
        },
        setSearchQuery: (state, action: { payload: string }) => {
            state.searchQuery = action.payload;
        },
    },
})

export const {
  setFilter,
  clearFilterByTagId, clearAllFilters,
  setPriceSort,
  setSearchQuery,
} = filterSlice.actions;
export default filterSlice.reducer;