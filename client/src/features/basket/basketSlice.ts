import { createSlice } from "@reduxjs/toolkit"
import { Basket } from "../../lib/types"

interface BasketState {
    selectedItems: string[]
    basket: Basket
}

const initialState = {
    selectedItems: [] as string[],
    basket: {} as Basket
}

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasketStates: (state, action: {payload: BasketState}) => {
            state.selectedItems = action.payload.selectedItems;
            state.basket = action.payload.basket;
        },
        clearBasketStates: (state) => {
            state.selectedItems = [];
            state.basket = {} as Basket;
        }
    }
})

export const { setBasketStates, clearBasketStates } = basketSlice.actions
export default basketSlice.reducer