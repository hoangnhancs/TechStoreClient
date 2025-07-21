import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    orderEndDate: new Date(Date.now()).toISOString(),
    analysEndDate: new Date(Date.now()).toISOString(), 
    analysStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
}

export const orderSlice = createSlice({
    initialState,
    name: 'order',
    reducers: {
        setAnalysStartDate: (state, action: { payload: { startDate: string } }) => {
            state.analysStartDate = action.payload.startDate;
        },
        setAnalysEndDate: (state, action: { payload: { endDate: string } }) => {
            state.analysEndDate = action.payload.endDate;
        },
        setOrderStartDate: (state, action: { payload: { startDate: string } }) => {
            state.orderStartDate = action.payload.startDate;
        },
        setOrderEndDate: (state, action: { payload: { endDate: string } }) => {
            state.orderEndDate = action.payload.endDate;
        },
    }
})

export const { setAnalysStartDate, setAnalysEndDate, setOrderStartDate, setOrderEndDate } = orderSlice.actions;
export default orderSlice.reducer;