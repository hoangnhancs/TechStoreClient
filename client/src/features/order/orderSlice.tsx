import { createSlice } from "@reduxjs/toolkit";
import dayjs from 'dayjs';

const initialState = {
  orderStartDate: dayjs().subtract(7, 'day').startOf('day').toISOString(), // YYYY-MM-DDT00:00:00.000Z
  orderEndDate: dayjs().endOf('day').toISOString(), // YYYY-MM-DDT23:59:59.999Z
  analysStartDate: dayjs().subtract(7, 'day').startOf('day').toISOString(),
  analysEndDate: dayjs().endOf('day').toISOString(),
  orderStatus: "",
  ordersPage: 0,
  ordersRowsPerPage: 5,
  confirmStartDate: dayjs().subtract(7, 'day').startOf('day').toISOString(),
  confirmEndDate: dayjs().endOf('day').toISOString(),
  confirmPage: 0,
  confirmRowsPerPage: 5,
  myOrdersStartDate: "",
  myOrdersEndDate: "",
  myOrdersStatus: "",
  myOrdersPmtStatus: "",
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
        setOrderStatus: (state, action: { payload: { status: string } }) => {
            state.orderStatus = action.payload.status;
        },
        setOrdersPage: (state, action: { payload: { page: number } }) => {
            state.ordersPage = action.payload.page;
        },
        setOrdersRowsPerPage: (state, action: { payload: { rowsPerPage: number } }) => {
            state.ordersRowsPerPage = action.payload.rowsPerPage;
        },
        setConfirmStartDate: (state, action: { payload: { startDate: string } }) => {
            state.confirmStartDate = action.payload.startDate;
        },
        setConfirmEndDate: (state, action: { payload: { endDate: string } }) => {
            state.confirmEndDate = action.payload.endDate;
        },
        setConfirmPage: (state, action: { payload: { page: number } }) => {
            state.confirmPage = action.payload.page;
        },
        setConfirmRowsPerPage: (state, action: { payload: { rowsPerPage: number } }) => {
            state.confirmRowsPerPage = action.payload.rowsPerPage;
        },
        setMyOrdersStartDate: (state, action: { payload: { startDate: string } }) => {
            state.myOrdersStartDate = action.payload.startDate;
        },
        setMyOrdersEndDate: (state, action: { payload: { endDate: string } }) => {
            state.myOrdersEndDate = action.payload.endDate;
        },
        setMyOrdersStatus: (state, action: { payload: { status: string } }) => {
            state.myOrdersStatus = action.payload.status;
        },
        setMyOrdersPmtStatus: (state, action: { payload: { pmtStatus: string } }) => {
            state.myOrdersPmtStatus = action.payload.pmtStatus;
        },
    }
})

export const {
  setAnalysStartDate,
  setAnalysEndDate,
  setOrderStartDate,
  setOrderEndDate,
  setOrderStatus,
  setOrdersPage,
  setOrdersRowsPerPage,
  setConfirmStartDate,
  setConfirmEndDate,
  setConfirmPage,
  setConfirmRowsPerPage,
  setMyOrdersStartDate,
  setMyOrdersEndDate,
  setMyOrdersStatus,
  setMyOrdersPmtStatus,
} = orderSlice.actions;
export default orderSlice.reducer;