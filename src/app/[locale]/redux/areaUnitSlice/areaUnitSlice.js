import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "ft²", // Default area unit
};

const areaUnitSlice = createSlice({
  name: "areaUnit",
  initialState,
  reducers: {
    setAreaUnit: (state, action) => {
      state.value = action.payload;
    },
    resetAreaUnit: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { setAreaUnit, resetAreaUnit } = areaUnitSlice.actions;
export default areaUnitSlice.reducer;