import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../services/mockApi'

export const fetchStudentProfile = createAsyncThunk('student/fetchProfile', async (userId) => {
  return await api.apiGetStudentProfile(userId)
})

export const updateStudentProfile = createAsyncThunk('student/updateProfile', async ({ userId, updates }) => {
  return await api.apiUpdateStudentProfile(userId, updates)
})

export const uploadResume = createAsyncThunk('student/uploadResume', async ({ userId, fileName }) => {
  const extracted = await api.apiUploadResume(userId, fileName)
  return extracted
})

export const fetchAssessmentResult = createAsyncThunk('student/fetchAssessmentResult', async (userId) => {
  return await api.apiGetAssessmentResult(userId)
})

export const submitAssessment = createAsyncThunk('student/submitAssessment', async ({ userId, answers }) => {
  return await api.apiSubmitAssessment(userId, answers)
})

export const fetchSkillGap = createAsyncThunk('student/fetchSkillGap', async (userId) => {
  return await api.apiGetSkillGap(userId)
})

export const fetchCourses = createAsyncThunk('student/fetchCourses', async () => {
  return await api.apiGetCourses()
})

export const fetchLearningProgress = createAsyncThunk('student/fetchLearningProgress', async (userId) => {
  return await api.apiGetLearningProgress(userId)
})

export const updateLearningProgress = createAsyncThunk('student/updateLearningProgress', async ({ userId, courseId, status }) => {
  return await api.apiUpdateLearningProgress(userId, courseId, status)
})

export const fetchInternships = createAsyncThunk('student/fetchInternships', async (filters) => {
  return await api.apiGetInternships(filters)
})

export const fetchJobs = createAsyncThunk('student/fetchJobs', async (filters) => {
  return await api.apiGetJobs(filters)
})

export const fetchRecommendations = createAsyncThunk('student/fetchRecommendations', async (userId) => {
  return await api.apiGetRecommendations(userId)
})

export const applyToOpportunity = createAsyncThunk('student/apply', async ({ userId, type, refId }, { rejectWithValue }) => {
  try { return await api.apiApply(userId, type, refId) } catch (e) { return rejectWithValue(e.message) }
})

export const fetchApplications = createAsyncThunk('student/fetchApplications', async (userId) => {
  return await api.apiGetApplications(userId)
})

export const fetchCertificates = createAsyncThunk('student/fetchCertificates', async (userId) => {
  return await api.apiGetCertificates(userId)
})

export const uploadCertificate = createAsyncThunk('student/uploadCertificate', async ({ userId, name, issuer }) => {
  return await api.apiUploadCertificate(userId, name, issuer)
})

export const fetchPortfolio = createAsyncThunk('student/fetchPortfolio', async (userId) => {
  return await api.apiGetPortfolio(userId)
})

const initialState = {
  profile: null,
  assessmentResult: null,
  skillGap: [],
  courses: [],
  learningProgress: {},
  internships: [],
  jobs: [],
  recommendations: { internships: [], jobs: [] },
  applications: [],
  certificates: [],
  portfolio: null,
  loading: {},
  error: null,
  lastApplyError: null
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearApplyError(state) { state.lastApplyError = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.fulfilled, (state, action) => { state.profile = action.payload })
      .addCase(updateStudentProfile.fulfilled, (state, action) => { state.profile = action.payload })
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.technicalSkills = action.payload.technicalSkills
          state.profile.projects = [...(state.profile.projects || []), ...action.payload.projects]
          state.profile.certifications = [...(state.profile.certifications || []), ...action.payload.certifications]
          state.profile.resumeFileName = action.payload.resumeFileName
          state.profile.profileCompletion = Math.min(100, (state.profile.profileCompletion || 0) + 15)
        }
      })
      .addCase(fetchAssessmentResult.fulfilled, (state, action) => { state.assessmentResult = action.payload })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.assessmentResult = action.payload
        if (state.profile) state.profile.skillReadiness = action.payload.overallScore
      })
      .addCase(fetchSkillGap.fulfilled, (state, action) => { state.skillGap = action.payload })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.courses = action.payload })
      .addCase(fetchLearningProgress.fulfilled, (state, action) => { state.learningProgress = action.payload })
      .addCase(updateLearningProgress.fulfilled, (state, action) => { state.learningProgress = action.payload })
      .addCase(fetchInternships.fulfilled, (state, action) => { state.internships = action.payload })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.jobs = action.payload })
      .addCase(fetchRecommendations.fulfilled, (state, action) => { state.recommendations = action.payload })
      .addCase(applyToOpportunity.fulfilled, (state, action) => { state.applications.unshift(action.payload); state.lastApplyError = null })
      .addCase(applyToOpportunity.rejected, (state, action) => { state.lastApplyError = action.payload })
      .addCase(fetchApplications.fulfilled, (state, action) => { state.applications = action.payload })
      .addCase(fetchCertificates.fulfilled, (state, action) => { state.certificates = action.payload })
      .addCase(uploadCertificate.fulfilled, (state, action) => { state.certificates.push(action.payload) })
      .addCase(fetchPortfolio.fulfilled, (state, action) => { state.portfolio = action.payload })
  }
})

export const { clearApplyError } = studentSlice.actions
export default studentSlice.reducer
