import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiLogin, apiDemoLogin, apiRegister, apiResetPassword } from '../../services/mockApi'

const SESSION_KEY = 'skillbridge_session_v1'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

const persisted = loadSession()

const initialState = {
  user: persisted?.user || null,
  token: persisted?.token || null,
  status: 'idle',
  error: null
}

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try { return await apiLogin(payload) } catch (e) { return rejectWithValue(e.message) }
})

export const demoLogin = createAsyncThunk('auth/demoLogin', async (role, { rejectWithValue }) => {
  try { return await apiDemoLogin(role) } catch (e) { return rejectWithValue(e.message) }
})

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try { return await apiRegister(payload) } catch (e) { return rejectWithValue(e.message) }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try { return await apiResetPassword(payload) } catch (e) { return rejectWithValue(e.message) }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      saveSession(null)
    },
    clearAuthError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => [login.pending.type, demoLogin.pending.type, register.pending.type].includes(action.type),
        (state) => { state.status = 'loading'; state.error = null }
      )
      .addMatcher(
        (action) => [login.fulfilled.type, demoLogin.fulfilled.type, register.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded'
          state.user = action.payload.user
          state.token = action.payload.token
          saveSession({ user: action.payload.user, token: action.payload.token })
        }
      )
      .addMatcher(
        (action) => [login.rejected.type, demoLogin.rejected.type, register.rejected.type].includes(action.type),
        (state, action) => { state.status = 'failed'; state.error = action.payload || 'Something went wrong.' }
      )
  }
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
