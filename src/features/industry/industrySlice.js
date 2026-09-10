import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../services/mockApi'

export const fetchIndustryProfile = createAsyncThunk('industry/fetchProfile', async (userId) => {
  return await api.apiGetIndustryProfile(userId)
})

export const updateIndustryProfile = createAsyncThunk('industry/updateProfile', async ({ userId, updates }) => {
  return await api.apiUpdateIndustryProfile(userId, updates)
})

export const postInternship = createAsyncThunk('industry/postInternship', async ({ companyId, data }) => {
  return await api.apiPostInternship(companyId, data)
})

export const postJob = createAsyncThunk('industry/postJob', async ({ companyId, data }) => {
  return await api.apiPostJob(companyId, data)
})

export const fetchCompanyOpportunities = createAsyncThunk('industry/fetchOpportunities', async (companyId) => {
  return await api.apiGetCompanyOpportunities(companyId)
})

export const fetchCandidates = createAsyncThunk('industry/fetchCandidates', async ({ oppId, type }) => {
  const candidates = await api.apiGetCandidatesForOpportunity(oppId, type)
  return { oppId, type, candidates }
})

export const fetchCompanyApplications = createAsyncThunk('industry/fetchApplications', async (companyId) => {
  return await api.apiGetAllApplicationsForCompany(companyId)
})

export const updateApplicationStatus = createAsyncThunk('industry/updateApplicationStatus', async ({ applicationId, status }) => {
  return await api.apiUpdateApplicationStatus(applicationId, status)
})

export const bulkShortlist = createAsyncThunk('industry/bulkShortlist', async (applicationIds) => {
  await api.apiBulkShortlist(applicationIds)
  return applicationIds
})

export const shortlistCandidateDirect = createAsyncThunk('industry/shortlistDirect', async ({ companyId, studentId, oppId, type }) => {
  return await api.apiShortlistCandidateDirect(companyId, studentId, oppId, type)
})

const initialState = {
  profile: null,
  internships: [],
  jobs: [],
  candidatesByOpp: {},
  applications: [],
  loading: {},
  error: null
}

const industrySlice = createSlice({
  name: 'industry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustryProfile.fulfilled, (state, action) => { state.profile = action.payload })
      .addCase(updateIndustryProfile.fulfilled, (state, action) => { state.profile = action.payload })
      .addCase(postInternship.fulfilled, (state, action) => { state.internships.unshift(action.payload) })
      .addCase(postJob.fulfilled, (state, action) => { state.jobs.unshift(action.payload) })
      .addCase(fetchCompanyOpportunities.fulfilled, (state, action) => {
        state.internships = action.payload.internships
        state.jobs = action.payload.jobs
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.candidatesByOpp[`${action.payload.type}-${action.payload.oppId}`] = action.payload.candidates
      })
      .addCase(fetchCompanyApplications.fulfilled, (state, action) => { state.applications = action.payload })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const idx = state.applications.findIndex(a => a.id === action.payload.id)
        if (idx !== -1) state.applications[idx] = { ...state.applications[idx], ...action.payload }
      })
      .addCase(bulkShortlist.fulfilled, (state, action) => {
        state.applications = state.applications.map(a => action.payload.includes(a.id) ? { ...a, status: 'Shortlisted' } : a)
      })
  }
})

export default industrySlice.reducer
