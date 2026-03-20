import { createSlice } from "@reduxjs/toolkit";
// initialState ka code yah pe write kara hu
// const initialState = {

// }

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    accessToken: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userData = null;
      state.accessToken = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
