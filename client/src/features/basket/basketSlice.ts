import { createSlice } from "@reduxjs/toolkit"
import { Basket, Item } from "../../lib/types"

interface BasketState {
    selectedItems: Item[]
    basket: Basket
}

const initialState = {
  selectedItems: JSON.parse(
    localStorage.getItem("selectedItems") || "[]"
  ) as Item[],
  basket: JSON.parse(localStorage.getItem("basket") || "{}") as Basket,
};

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasketStates: (state, action: {payload: BasketState}) => {
            state.selectedItems = action.payload.selectedItems;
            state.basket = action.payload.basket;
            localStorage.setItem(
              "selectedItems",
              JSON.stringify(state.selectedItems)
            );
            localStorage.setItem("basket", JSON.stringify(state.basket));
        },
        clearBasketStates: (state) => {
            state.selectedItems = [];
            state.basket = {} as Basket;
            localStorage.removeItem("selectedItems");
            localStorage.removeItem("basket");
        }
    }
})

export const { setBasketStates, clearBasketStates } = basketSlice.actions
export default basketSlice.reducer