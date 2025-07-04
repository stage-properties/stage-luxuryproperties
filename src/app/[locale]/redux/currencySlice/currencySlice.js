import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "AED", // Default currency
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.value = action.payload;
    },
    resetCurrency: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { setCurrency, resetCurrency } = currencySlice.actions;
export default currencySlice.reducer;