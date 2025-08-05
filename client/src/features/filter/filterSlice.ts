import { createSlice } from "@reduxjs/toolkit";
import { Brand } from "../../lib/types";

const initialState = {
    filter: {} as Record<number, number[]>,
    priceSort: 'asc' as 'asc' | 'desc' | 'discount',
    searchQuery: '' as string,
    brand: [] as Brand[],
    notiCreateAtSort: 'desc' as 'asc' | 'desc',
    notiStatusFilter: 'all' as 'read' | 'unread' | 'all',
    notiTypeFilter: 'all' as 'all' | 'review' | 'comment' | 'system'
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
        setPriceSort: (state, action: { payload: 'asc' | 'desc' | 'discount' }) => {
            state.priceSort = action.payload;
        },
        setSearchQuery: (state, action: { payload: string }) => {
            state.searchQuery = action.payload;
        },
        setBrand: (state, action: { payload: Brand[] }) => {
            state.brand = action.payload;
        },
        setNotiCreateAtSort: (state, action: { payload: 'asc' | 'desc' }) => {
            state.notiCreateAtSort = action.payload;
        },
        setNotiStatusFilter: (state, action: { payload: 'read' | 'unread' | 'all' }) => {
            state.notiStatusFilter = action.payload;
        },
        setNotiTypeFilter: (state, action: { payload: 'all' | 'review' | 'comment' | 'system' }) => {
            state.notiTypeFilter = action.payload;
        },
    },
})

export const {
  setFilter,
  clearFilterByTagId, clearAllFilters,
  setPriceSort,
  setSearchQuery,
  setBrand,
  setNotiCreateAtSort,
  setNotiStatusFilter,
  setNotiTypeFilter
} = filterSlice.actions;
export default filterSlice.reducer;