import { PREMIUM_PAGES } from '../license'

const NAV = [
  { id:'home',     icon:'🏠', label:'Dashboard'        },
  { id:'study',    icon:'🎯', label:'Study Mode'       },
  { id:'islands',  icon:'🏝️', label:'Island Sentences' },
  { id:'phrasal',  icon:'💬', label:'Phrasal Verbs'    },
  { id:'chunks',   icon:'🧩', label:'Chunks & Collocations' },
  { id:'vocab',    icon:'📚', label:'Vocabulary'       },
  { id:'slang',    icon:'🔥', label:'Slang Dictionary' },
  { id:'scenario', icon:'🎭', label:'Scenario Practice'},
  { id:'progress', icon:'📊', label:'Progress'         },
  { id:'tracker',  icon:'📔', label:'Tracker'          },
]

export default function Sidebar({ page, setPage, streak, signOut, activated, onActivate, onSettings }) {
  return (
    <aside className="w-52 flex-shrink-0 hidden md:flex flex-col py-5 px-3 h-screen sticky top-0 overflow-y-auto"
      style={{background:'var(--cream)',borderRight:'1px solid var(--line)'}}>
      <div className="px-3 mb-4">
        <div className="text-base font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>📚 English Hub</div>
        <div className="text-xs mt-0.5" style={{color:'var(--sub)'}}>softmark_2026</div>
      </div>
      <nav className="space-y-0.5 flex-1">
        {NAV.map(n => {
          const lockedItem = PREMIUM_PAGES.includes(n.id) && !activated
          return (
            <button key={n.id} onClick={() => setPage(n.id)}
              className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2.5"
              style={page===n.id?{background:'var(--deep)',color:'white',fontWeight:600}:{color:'var(--sub)'}}
              onMouseEnter={e=>{ if(page!==n.id) e.currentTarget.style.background='var(--sage-l)' }}
              onMouseLeave={e=>{ if(page!==n.id) e.currentTarget.style.background='' }}>
              <span>{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              {lockedItem && <span className="text-xs opacity-60">🔒</span>}
            </button>
          )
        })}
      </nav>
      <div className="mt-3 space-y-2">
        {/* Activation */}
        <button onClick={onActivate}
          className="w-full rounded-2xl p-3 text-left transition-all"
          style={activated
            ? {background:'rgba(90,122,114,.12)',border:'1px solid rgba(90,122,114,.2)'}
            : {background:'var(--deep)',color:'white'}}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{activated?'✅':'🔑'}</span>
            <div>
              <div className="text-xs font-bold" style={{color:activated?'var(--sage)':'white'}}>
                {activated?'已啟用':'輸入啟用碼'}
              </div>
              <div className="text-xs" style={{color:activated?'var(--sub)':'rgba(255,255,255,.7)'}}>
                {activated?'已解鎖全部內容':'解鎖全部進階內容'}
              </div>
            </div>
          </div>
        </button>

        <div className="rounded-2xl p-3" style={{background:'var(--terra-l)',border:'1px solid rgba(184,105,74,.15)'}}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <div>
              <div className="text-xs font-bold" style={{color:'var(--terra)'}}>Day {streak} streak!</div>
              <div className="text-xs" style={{color:'var(--sub)'}}>Keep going ✨</div>
            </div>
          </div>
        </div>
        <button onClick={onSettings} className="w-full text-xs py-1.5 flex items-center justify-center gap-1.5"
          style={{color:'var(--sub)'}}>
          <span>⚙️</span> 設定
        </button>
      </div>
    </aside>
  )
}
