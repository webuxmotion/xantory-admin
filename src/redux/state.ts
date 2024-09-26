import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  number: number;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: true,
  number: 46,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setNumber: (state, action: PayloadAction<number>) => {
      state.number = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setNumber } = globalSlice.actions;

export default globalSlice.reducer;