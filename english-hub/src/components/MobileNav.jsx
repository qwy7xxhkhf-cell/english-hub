const NAV = [
  { id:'home',    icon:'🏠', label:'Home'    },
  { id:'study',   icon:'🎯', label:'Study'   },
  { id:'islands', icon:'🏝️', label:'Islands' },
  { id:'phrasal', icon:'💬', label:'Verbs'   },
  { id:'tracker', icon:'📔', label:'Tracker' },
]

export default function MobileNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-stone-200 flex z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className={`flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 transition-all relative ${
            page === n.id ? 'text-emerald-700' : 'text-stone-400'
          }`}>
          {page === n.id && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full"/>
          )}
          <span className={`text-xl ${page === n.id ? 'scale-110' : ''} transition-transform`}>{n.icon}</span>
          <span className={`text-xs font-medium ${page === n.id ? 'text-emerald-700' : ''}`}>{n.label}</span>
        </button>
      ))}
    </nav>
  )
}
