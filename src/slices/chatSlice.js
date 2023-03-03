import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatInfo:localStorage.getItem('chatData')?JSON.parse(localStorage.getItem('chatData')): 'Mern Wasim1',
  },
  reducers: {
    chatUserInfo: (state,action) => {
    state.chatInfo=action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { chatUserInfo} = chatSlice.actions

export default chatSlice.reducer