import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../services/mockApi'

export const fetchConversations = createAsyncThunk('messages/fetchConversations', async (userId) => {
  return await api.apiGetConversations(userId)
})

export const fetchThread = createAsyncThunk('messages/fetchThread', async ({ userId, partnerId }) => {
  const thread = await api.apiGetThread(userId, partnerId)
  return { partnerId, thread }
})

export const sendMessage = createAsyncThunk('messages/send', async ({ from, to, text }) => {
  return await api.apiSendMessage(from, to, text)
})

export const fetchMessagablePeople = createAsyncThunk('messages/fetchPeople', async (role) => {
  return await api.apiListMessagablePeople(role)
})

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    activeThread: [],
    activePartnerId: null,
    messagablePeople: []
  },
  reducers: {
    setActivePartner(state, action) { state.activePartnerId = action.payload }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => { state.conversations = action.payload })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.activeThread = action.payload.thread
        state.activePartnerId = action.payload.partnerId
      })
      .addCase(sendMessage.fulfilled, (state, action) => { state.activeThread.push(action.payload) })
      .addCase(fetchMessagablePeople.fulfilled, (state, action) => { state.messagablePeople = action.payload })
  }
})

export const { setActivePartner } = messageSlice.actions
export default messageSlice.reducer
