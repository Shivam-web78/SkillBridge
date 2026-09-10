import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../services/mockApi'

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (userId) => {
  return await api.apiGetNotifications(userId)
})

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id) => {
  await api.apiMarkNotificationRead(id)
  return id
})

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async (userId) => {
  await api.apiMarkAllNotificationsRead(userId)
  return userId
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const n = state.items.find(n => n.id === action.payload)
        if (n) n.read = true
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach(n => { n.read = true })
      })
  }
})

export default notificationSlice.reducer
