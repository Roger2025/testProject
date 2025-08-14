import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    items: [],
    storeName: "",
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existing = state.items.find(
        (item) => item.name === newItem.name && item.remark === newItem.remark
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((_, index) => index !== action.payload);
    },
    incrementQuantity: (state, action) => {
      const item = state.items[action.payload];
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.items[action.payload];
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items.splice(action.payload, 1);
      }
    },
    clearItems: (state) => {
      state.items = [];
    },
    setStoreName: (state, action) => {
      state.storeName = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearItems,
  setStoreName,
} = orderSlice.actions;

export default orderSlice.reducer;
