// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       // state.items.push(action.payload);
//       const existingCartItem = state.items.find(
//         (item) => item._id === action.payload._id,
//       );
//       if (!existingCartItem) {
//         state.items.push({ ...action.payload, quantity: 1 });
//       } else {
//         existingCartItem.quantity += 1;
//       }
//     },
//     removeToCart: (state, action) => {
//       const filterCart = state.items.filter(
//         (item) => item._id !== action.payload,
//       );
//       state.items = filterCart;
//     },
//   },
// });

// export const { addToCart, removeToCart } = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // console.log(action.payload);
      state.cart = action.payload;
      // state.cart.push(action.payload);
      // const existingCartItem = state.items.find(
      //   (item) => item._id === action.payload._id,
      // );
      // if (!existingCartItem) {
      //   state.items.push({ ...action.payload, quantity: 1 });
      // } else {
      //   existingCartItem.quantity += 1;
      // }
    },
    removeToCart: (state, action) => {
      const filterCart = state.cart.filter(
        (item) => item._id !== action.payload,
      );
      state.cart = filterCart;
    },
  },
});

export const { addToCart, removeToCart } = cartSlice.actions;

export default cartSlice.reducer;
