'use client'

import { createSlice } from "@reduxjs/toolkit"

export const allTeams = createSlice({
    name:"allTeams",
    initialState:{
        value:[]
    },
    reducers:{
        getAllTeams:(state,action) => {
            state.value = action?.payload?.allTeams
        }
    }
})

export const {getAllTeams} = allTeams.actions
export default allTeams.reducer