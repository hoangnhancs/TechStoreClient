import { createSlice } from "@reduxjs/toolkit";
import { Brand } from "../../lib/types";


const initialState = {
    filter: {} as Record<number, number[]>,
    priceSort: 'asc' as 'asc' | 'desc',
    searchQuery: '' as string,
    brand: [] as Brand[],
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
        setBrand: (state, action: { payload: Brand[] }) => {
            state.brand = action.payload;
        },
    },
})

export const {
  setFilter,
  clearFilterByTagId, clearAllFilters,
  setPriceSort,
  setSearchQuery,
  setBrand
} = filterSlice.actions;
export default filterSlice.reducer;