import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import studentReducer from '../features/student/studentSlice'
import industryReducer from '../features/industry/industrySlice'
import adminReducer from '../features/admin/adminSlice'
import notificationReducer from '../features/notifications/notificationSlice'
import messageReducer from '../features/messages/messageSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    industry: industryReducer,
    admin: adminReducer,
    notifications: notificationReducer,
    messages: messageReducer,
    ui: uiReducer
  }
})
