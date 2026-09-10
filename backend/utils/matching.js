// Skill overlap + eligibility + interest scoring, ported 1:1 from
// src/services/mockApi.js's computeMatch() so the frontend's displayed
// match percentages don't shift when swapping from the mock API to
// this real backend.

function computeMatch(studentProfile, opportunity) {
  const studentSkillMap = {}
  ;(studentProfile.technicalSkills || []).forEach((s) => { studentSkillMap[s.name] = s.level })

  const required = opportunity.requiredSkills || []
  const matched = []
  const missing = []
  let skillScoreSum = 0

  required.forEach((skill) => {
    const level = studentSkillMap[skill]
    if (level && level >= 50) {
      matched.push({ name: skill, level })
      skillScoreSum += Math.min(level, 100)
    } else if (level) {
      missing.push({ name: skill, level })
      skillScoreSum += level * 0.5
    } else {
      missing.push({ name: skill, level: 0 })
    }
  })

  const skillCoverage = required.length ? skillScoreSum / (required.length * 100) : 0

  const cgpaOk = !opportunity.minCgpa || (Number(studentProfile.cgpa) >= opportunity.minCgpa)
  const eligibilityScore = cgpaOk ? 1 : 0.6

  const interestBoost = (studentProfile.preferredRoles || []).some((r) =>
    opportunity.title?.toLowerCase().includes(r.toLowerCase().split(' ')[0])
  ) ? 0.08 : 0

  const rawScore = (skillCoverage * 0.75 + eligibilityScore * 0.2 + interestBoost) * 100
  const matchPercent = Math.max(5, Math.min(99, Math.round(rawScore)))

  return { matchPercent, matched, missing, eligibilityOk: cgpaOk }
}

module.exports = { computeMatch }
