import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

export default function SkillRadar({ data, dataKey = 'value', height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <Radar name="Score" dataKey={dataKey} stroke="#14b8a6" fill="#2dd4bf" fillOpacity={0.45} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
