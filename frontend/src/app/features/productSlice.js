import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
  },
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      console.log("slice", action.payload);
      if (action.payload) {
        state.cart.push(action.payload);
      }
    },
  },
});

export const { setProduct, setCart } = productSlice.actions;

export default productSlice.reducer;
