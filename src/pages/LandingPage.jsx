import { Link } from 'react-router-dom'
import { GraduationCap, Building2, Landmark, ArrowRight, Sparkles, ClipboardCheck, BookOpen, Target, Rocket, Trophy } from 'lucide-react'

const ecosystem = [
  { icon: GraduationCap, title: 'STUDENTS', desc: 'Discover skills, learning paths, internships and jobs.', color: 'text-teal-500 bg-teal-50' },
  { icon: Building2, title: 'INDUSTRY', desc: 'Find verified, skill-matched talent and publish opportunities.', color: 'text-blue-500 bg-blue-50' },
  { icon: Landmark, title: 'ACADEMIA', desc: 'Connect with industry for internships, FDPs, projects, R&D and collaboration.', color: 'text-warn-500 bg-orange-50' }
]

const workflow = [
  { icon: ClipboardCheck, label: 'ASSESS' },
  { icon: BookOpen, label: 'LEARN' },
  { icon: Sparkles, label: 'MATCH' },
  { icon: Target, label: 'INTERN' },
  { icon: Trophy, label: 'GET PLACED' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center"><Sparkles size={18} /></div>
          <span className="font-bold text-lg tracking-tight">SkillBridge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto text-center px-6 pt-16 pb-20">
        <span className="badge-green mb-6 inline-flex">Smart India Hackathon 2026</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Skill<span className="text-teal-400">Bridge</span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bridging the Skill Gap. Connecting Talent.<br />Building the Future.
        </p>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto">
          A unified platform connecting students, industry and academia for skill development, internships and placements.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get Started <ArrowRight size={18} />
          </Link>
          <a href="#ecosystem" className="btn-outline border-white/20 text-white hover:bg-white/10 px-6 py-3 text-base">
            Explore Platform
          </a>
          <Link to="/login" className="btn-outline border-white/20 text-white hover:bg-white/10 px-6 py-3 text-base">
            Login
          </Link>
        </div>
      </section>

      <section id="ecosystem" className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-6">
        {ecosystem.map((e) => (
          <div key={e.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${e.color}`}>
              <e.icon size={22} />
            </div>
            <h3 className="font-bold tracking-wide">{e.title}</h3>
            <p className="text-sm text-slate-400 mt-2">{e.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-center text-slate-400 text-sm mb-6 tracking-widest">ONE PLATFORM THAT CONNECTS</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-1">
            {workflow.map((w, i) => (
              <div key={w.label} className="flex items-center gap-3 sm:gap-1">
                <div className="flex flex-col items-center gap-2 px-3">
                  <div className="h-11 w-11 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-400">
                    <w.icon size={18} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-slate-300">{w.label}</span>
                </div>
                {i < workflow.length - 1 && <ArrowRight className="text-slate-600 hidden sm:block" size={18} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Rocket size={18} className="text-teal-400" />
          <p className="text-sm font-semibold text-teal-400 tracking-widest">NOT JUST A JOB PORTAL</p>
        </div>
        <p className="text-slate-300 leading-relaxed">
          SkillBridge connects the complete ecosystem — skill assessment, skill gap analysis, personalized learning,
          internships, jobs, industry training, faculty opportunities, mentorship, live projects, research
          collaboration, verified digital portfolios and institution analytics — all through one platform.
        </p>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © 2026 SkillBridge • Academia–Industry Collaboration Portal • Built for Smart India Hackathon
      </footer>
    </div>
  )
}
