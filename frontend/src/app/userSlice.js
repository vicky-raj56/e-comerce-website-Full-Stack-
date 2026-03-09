import { createSlice } from "@reduxjs/toolkit";
// initialState ka code yah pe write kara hu
// const initialState = {

// }

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      ((state.user = null),
        localStorage.removeItem("userInfo"),
        localStorage.removeItem("accessToken"),
        localStorage.removeItem("refreshToken"));
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
