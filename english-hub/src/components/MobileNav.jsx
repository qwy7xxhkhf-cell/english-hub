const NAV = [
  { id:'home',     icon:'🏠', label:'Home'    },
  { id:'study',    icon:'🎯', label:'Study'   },
  { id:'vocab',    icon:'📚', label:'Vocab'   },
  { id:'slang',    icon:'🔥', label:'Slang'   },
  { id:'scenario', icon:'🎭', label:'Scene'   },
]

export default function MobileNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex z-50 md:hidden"
      style={{background:'rgba(250,246,241,.95)',backdropFilter:'blur(16px)',
              borderTop:'1px solid rgba(61,53,48,.08)',paddingBottom:'env(safe-area-inset-bottom)'}}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative">
          {page === n.id && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
              style={{background:'var(--terra)'}}/>
          )}
          <span className={`text-xl ${page===n.id?'scale-110':''} transition-transform`}>{n.icon}</span>
          <span className="text-xs font-medium"
            style={{color:page===n.id?'var(--terra)':'var(--sub)'}}>{n.label}</span>
        </button>
      ))}
    </nav>
  )
}
