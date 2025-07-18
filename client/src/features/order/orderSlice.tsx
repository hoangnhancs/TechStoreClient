import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    endDate: new Date(Date.now()).toISOString(), 
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
}

export const orderSlice = createSlice({
    initialState,
    name: 'order',
    reducers: {
        setStartDate: (state, action: { payload: { startDate: string } }) => {
            state.startDate = action.payload.startDate;
        },
        setEndDate: (state, action: { payload: { endDate: string } }) => {
            state.endDate = action.payload.endDate;
        },
    }
})

export const { setStartDate, setEndDate } = orderSlice.actions;
export default orderSlice.reducer;