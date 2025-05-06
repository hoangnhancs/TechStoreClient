import { createSlice } from "@reduxjs/toolkit"
import { Basket, Item } from "../../lib/types"

interface BasketState {
    selectedItems: Item[]
    basket: Basket
}

const initialState = {
  selectedItems: [] as Item[],
  basket: {id: "", userId: "", items: []} as Basket,
};

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
            state.basket = { id: "", userId: "", items: [] } as Basket;
        }
    }
})

export const { setBasketStates, clearBasketStates } = basketSlice.actions
export default basketSlice.reducer