import { createSlice } from "@reduxjs/toolkit"

interface CounterActionData {
    amount: number
    description?: string
    userId?: string
    createdAt?: Date
}

const initialState = {
    count: 0,
}

const counterSlice = createSlice({
    initialState,
    name: 'counter',
    reducers : {
        increment: (state, action: {payload: CounterActionData}) => {
            state.count += action.payload.amount
        },
        decrement: (state, action: {payload: CounterActionData}) => {
            state.count -= action.payload.amount
        }
    }
})

export const {increment, decrement} = counterSlice.actions
export default counterSlice.reducer
