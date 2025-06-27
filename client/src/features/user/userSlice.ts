import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../lib/types";

type UserState = {
  currentUser: User | null;
};

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
