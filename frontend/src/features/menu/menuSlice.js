// features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMenuItemsByStore = createAsyncThunk(
  "menu/fetchByStore",
  async (storId, thunkAPI) => {
    const res = await fetch(`http://localhost:5000/api/menu/${storId}`);
    const data = await res.json();

    //修正誤判條件：Array.isArray
    if (!Array.isArray(data)) {
      console.error("錯誤API 回傳應該是陣列，但不是：", data);
      return thunkAPI.rejectWithValue("資料格式錯誤");
    }

    console.log("回傳菜單陣列：", data);
    return data.sort((a, b) => a.price - b.price); //  排序
  }
);


const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    cart: [],
    lastOrder: null,
    status: "idle",
  },
  reducers: {
    
    addToCart: (state, action) => {
      const { id, note } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        state.cart.push({ ...item, note: note || "" });
      }
    },
    removeFromCart: (state, action) => {
      state.cart.splice(action.payload, 1);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    saveOrder: (state, action) => {
      state.lastOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItemsByStore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItemsByStore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // ✅ 是排好序的陣列
      })
      .addCase(fetchMenuItemsByStore.rejected, (state, action) => {
        console.error(" 抓取菜單失敗：", action.payload || action.error.message);
        state.status = "failed";
        state.items = []; // 避免後續 .map 錯誤
      });
  }
});

export const { addToCart, removeFromCart, clearCart, saveOrder } = menuSlice.actions;
export default menuSlice.reducer;
