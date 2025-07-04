'use client'

import { createSlice } from "@reduxjs/toolkit"

export const featuredOffplanPropertySlice = createSlice({
    name:"featuredOffplanProperty",
    initialState:{
        value:[]
    },
    reducers:{
        getFeaturedOffplanProperty:(state,action) => {
            state.value = action?.payload?.featuredOffplanProperty
        }
    }
})

export const {getFeaturedOffplanProperty} = featuredOffplanPropertySlice.actions
export default featuredOffplanPropertySlice.reducer