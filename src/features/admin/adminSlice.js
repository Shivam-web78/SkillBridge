import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../services/mockApi'

export const fetchAllStudents = createAsyncThunk('admin/fetchStudents', async () => {
  return await api.apiGetAllStudents()
})

export const fetchAllIndustries = createAsyncThunk('admin/fetchIndustries', async () => {
  return await api.apiGetAllIndustries()
})

export const fetchAdminAnalytics = createAsyncThunk('admin/fetchAnalytics', async () => {
  return await api.apiGetAdminAnalytics()
})

export const fetchVerificationRequests = createAsyncThunk('admin/fetchVerificationRequests', async () => {
  return await api.apiGetVerificationRequests()
})

export const verifyIndustry = createAsyncThunk('admin/verifyIndustry', async ({ companyId, approve }) => {
  await api.apiVerifyIndustry(companyId, approve)
  return { companyId, approve }
})

export const verifyCertificate = createAsyncThunk('admin/verifyCertificate', async ({ certId, studentId, approve }) => {
  await api.apiVerifyCertificate(certId, studentId, approve)
  return { certId, approve }
})

export const fetchFacultyOpportunities = createAsyncThunk('admin/fetchFacultyOpportunities', async () => {
  return await api.apiGetFacultyOpportunities()
})

export const fetchCollaborations = createAsyncThunk('admin/fetchCollaborations', async () => {
  return await api.apiGetCollaborations()
})

const initialState = {
  students: [],
  industries: [],
  analytics: null,
  verificationRequests: [],
  facultyOpportunities: [],
  collaborations: []
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.fulfilled, (state, action) => { state.students = action.payload })
      .addCase(fetchAllIndustries.fulfilled, (state, action) => { state.industries = action.payload })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => { state.analytics = action.payload })
      .addCase(fetchVerificationRequests.fulfilled, (state, action) => { state.verificationRequests = action.payload })
      .addCase(verifyIndustry.fulfilled, (state, action) => {
        state.verificationRequests = state.verificationRequests.filter(v => !(v.type === 'industry' && v.refId === action.payload.companyId))
        const ind = state.industries.find(i => i.userId === action.payload.companyId)
        if (ind) ind.verified = action.payload.approve
      })
      .addCase(verifyCertificate.fulfilled, (state, action) => {
        state.verificationRequests = state.verificationRequests.filter(v => v.refId !== action.payload.certId)
      })
      .addCase(fetchFacultyOpportunities.fulfilled, (state, action) => { state.facultyOpportunities = action.payload })
      .addCase(fetchCollaborations.fulfilled, (state, action) => { state.collaborations = action.payload })
  }
})

export default adminSlice.reducer
