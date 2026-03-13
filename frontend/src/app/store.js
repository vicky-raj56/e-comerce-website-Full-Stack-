import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "./userSlice.js";
import productReducer from "./features/productSlice.js";
import cartReducer from "./features/cartSlice.js";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["products"],
};

const persisteReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persisteReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
