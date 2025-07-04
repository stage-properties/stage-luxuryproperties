'use client'

import { createSlice } from "@reduxjs/toolkit"

export const searchResultSlice = createSlice({
    name:"searchResultFilter",
    initialState:{
        value:[]
    },
    reducers:{
        getFilteredSearchResults:(state,action) => {
            state.value = action?.payload?.searchResultFilter
        }
    }
})

export const {getFilteredSearchResults} = searchResultSlice.actions
export default searchResultSlice.reducer