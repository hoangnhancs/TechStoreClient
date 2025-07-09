import { createSlice } from "@reduxjs/toolkit";
import { Basket, Item } from "../../lib/types";

interface BasketState {
  selectedItems: Item[];
  basket: Basket;
}

const initialState = {
  selectedItems: [] as Item[],
  basket: { id: "", userId: "", items: [] } as Basket,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasketStates: (state, action: { payload: BasketState }) => {
      state.selectedItems = action.payload.selectedItems;
      state.basket = action.payload.basket;
    },
    clearBasketStates: (state) => {
      state.selectedItems = [];
      state.basket = { id: "", userId: "", items: [] } as Basket;
    },
    setBasket: (state, action: { payload: Basket }) => {
      const newBasket = action.payload;
      state.basket = action.payload;

      if (state.selectedItems.length > 0) {
        const updatedSelectedItems: Item[] = [] 
        const newBasketProductIds = new Set(newBasket.items.map((item) => item.productId));
        state.selectedItems.forEach((selectedItem) => {
          if (newBasketProductIds.has(selectedItem.productId)) {
            const correspondingItem = newBasket.items.find((item) => item.productId === selectedItem.productId);
            if (correspondingItem) {
              updatedSelectedItems.push(correspondingItem);
            }
          }
        })
        state.selectedItems = updatedSelectedItems;
      }
    },

    setSelectedItems: (state, action: { payload: Item[] }) => {
      state.selectedItems = action.payload;
    },

    addItem: (state, action: { payload: Item }) => {
      const newItem = action.payload;
      const existingItemInBasket = state.basket.items.find(
        (item) => item.productId === newItem.productId
      );
      if (existingItemInBasket) {
        existingItemInBasket.quantity += newItem.quantity;
      } else {
        state.basket.items.push(newItem);
      }
      const existingItemInSelected = state.selectedItems.find(
        (item) => item.productId === newItem.productId
      );
      if (existingItemInSelected) {
        existingItemInSelected.quantity += newItem.quantity;
      } 
    },
    removeItemFromBasket: (state, action: { payload: Item }) => {
      const itemToRemove = action.payload;
      state.basket.items = state.basket.items.filter(
        (item) => item.productId !== itemToRemove.productId
      );
    },
    removeItemFromSelected: (state, action: { payload: Item }) => {
      const itemToRemove = action.payload;
      state.selectedItems = state.selectedItems.filter(
        (item) => item.productId !== itemToRemove.productId
      );
    },
  },
});

export const {
  setBasketStates,
  clearBasketStates,
  setBasket,
  setSelectedItems,
  addItem,
  removeItemFromBasket,
  removeItemFromSelected,
} = basketSlice.actions;
export default basketSlice.reducer;
