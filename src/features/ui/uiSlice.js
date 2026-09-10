import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    sidebarOpen: false
  },
  reducers: {
    pushToast: {
      reducer(state, action) { state.toasts.push(action.payload) },
      prepare(message, type = 'info') {
        return { payload: { id: `${Date.now()}-${Math.random()}`, message, type } }
      }
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebar(state, action) {
      state.sidebarOpen = action.payload
    }
  }
})

export const { pushToast, dismissToast, toggleSidebar, setSidebar } = uiSlice.actions
export default uiSlice.reducer
