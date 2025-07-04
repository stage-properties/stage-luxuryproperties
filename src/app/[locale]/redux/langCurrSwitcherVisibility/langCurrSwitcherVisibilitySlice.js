import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false, // Use a meaningful state key
};

const langSwitcherVisibilitySlice = createSlice({
  name: "langSwitcherVisibility",
  initialState,
  reducers: {
    setLangSwitcherVisibility: (state, action) => {
      state.value = !!action.payload; // Updating the state correctly
    },
  },
});

export const { setLangSwitcherVisibility } = langSwitcherVisibilitySlice.actions;
export default langSwitcherVisibilitySlice.reducer;