import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BasicUser } from "../../lib/types";

type UserState = {
  currentUser: BasicUser | null;
  isInitialized: boolean;
};

const initialState: UserState = {
  currentUser: null,
  isInitialized: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<BasicUser>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
      state.isInitialized = true;
    },
    setUserInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setCurrentUser, clearCurrentUser, setUserInitialized } = userSlice.actions;
export default userSlice.reducer;
