'use client'

import { createSlice } from "@reduxjs/toolkit"

export const contactModal = createSlice({
    name:"contactModalRedux",
    initialState:{
        value:false
    },
    reducers:{
        getContactModal:(state,action) => {
            state.value = action?.payload?.contactModalRedux
        }
    }
})

export const {getContactModal} = contactModal.actions
export default contactModal.reducer