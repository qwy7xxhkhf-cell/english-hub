const NAV = [
  { id:'home',    icon:'🏠', label:'Dashboard'       },
  { id:'islands', icon:'🏝️', label:'Island Sentences' },
  { id:'phrasal', icon:'💬', label:'Phrasal Verbs'    },
  { id:'progress',icon:'📊', label:'Progress'         },
  { id:'tracker', icon:'📔', label:'Study Tracker'    },
]

export default function Sidebar({ page, setPage, streak, signOut }) {
  return (
    <aside className="w-52 flex-shrink-0 bg-stone-100/90 border-r border-stone-200 hidden md:flex flex-col py-5 px-3 h-screen sticky top-0">
      <div className="px-2 mb-6">
        <div className="text-base font-bold text-stone-800">📚 English Hub</div>
        <div className="text-xs text-stone-400 mt-0.5">softmark_2026</div>
      </div>

      <nav className="space-y-0.5 flex-1">
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${page===n.id?'bg-emerald-800 text-white font-semibold':'text-stone-600 hover:bg-stone-200'}`}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>

      <div className="space-y-2 mt-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-xs font-bold text-amber-800">Day {streak} streak!</div>
              <div className="text-xs text-amber-600">Keep going ✨</div>
            </div>
          </div>
        </div>
        <button onClick={signOut} className="w-full text-xs text-stone-400 hover:text-stone-600 py-1 transition-colors">
          登出
        </button>
      </div>
    </aside>
  )
}
