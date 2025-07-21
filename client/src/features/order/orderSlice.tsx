import { createSlice } from "@reduxjs/toolkit";
import dayjs from 'dayjs';

const initialState = {
  orderStartDate: dayjs().subtract(7, 'day').startOf('day').toISOString(), // YYYY-MM-DDT00:00:00.000Z
  orderEndDate: dayjs().endOf('day').toISOString(), // YYYY-MM-DDT23:59:59.999Z
  analysStartDate: dayjs().subtract(7, 'day').startOf('day').toISOString(),
  analysEndDate: dayjs().endOf('day').toISOString(),
};

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