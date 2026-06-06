import { useState } from 'react'

// Bottom bar: 5 core + More
const BAR = [
  { id:'home',    icon:'🏠', label:'Home'  },
  { id:'study',   icon:'🎯', label:'Study' },
  { id:'vocab',   icon:'📚', label:'Vocab' },
  { id:'slang',   icon:'🔥', label:'Slang' },
  { id:'tracker', icon:'📔', label:'Track' },
]

// Full launcher shown in the "More" sheet (everything, incl. sidebar-only items)
const ALL = [
  { id:'home',     icon:'🏠', label:'Home'             },
  { id:'study',    icon:'🎯', label:'Study Mode'       },
  { id:'islands',  icon:'🏝️', label:'Island Sentences' },
  { id:'phrasal',  icon:'💬', label:'Phrasal Verbs'    },
  { id:'chunks',   icon:'🧩', label:'Chunks'           },
  { id:'vocab',    icon:'📚', label:'Vocabulary'       },
  { id:'slang',    icon:'🔥', label:'Slang'            },
  { id:'scenario', icon:'🎭', label:'Scenario'         },
  { id:'progress', icon:'📊', label:'Progress'         },
  { id:'tracker',  icon:'📔', label:'Tracker'          },
]

export default function MobileNav({ page, setPage }) {
  const [open, setOpen] = useState(false)
  const go = (id) => { setPage(id); setOpen(false) }
  // Highlight "More" whenever the current page isn't one of the bar items
  const moreActive = !BAR.some(n => n.id === page)

  return (
    <>
      {/* ── "More" full-section sheet ── */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0"
            style={{ background:'rgba(45,40,36,.35)', backdropFilter:'blur(2px)' }} />
          <div className="absolute left-0 right-0 bottom-0 rounded-t-3xl px-5 pt-3 pb-28"
            style={{ background:'var(--cream)', boxShadow:'0 -12px 40px rgba(0,0,0,.18)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4"
              style={{ background:'rgba(61,53,48,.15)' }} />
            <div className="text-base font-bold mb-3"
              style={{ color:'var(--deep)', fontFamily:'Georgia,serif' }}>All Sections</div>
            <div className="grid grid-cols-3 gap-3">
              {ALL.map(n => {
                const on = page === n.id
                return (
                  <button key={n.id} onClick={() => go(n.id)}
                    className="rounded-2xl py-4 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    style={on
                      ? { background:'var(--deep)' }
                      : { background:'white', border:'1px solid rgba(61,53,48,.06)' }}>
                    <span className="text-2xl">{n.icon}</span>
                    <span className="text-[11px] font-medium leading-tight text-center px-1"
                      style={{ color: on ? 'white' : 'var(--sub)' }}>{n.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 flex z-50 md:hidden"
        style={{ background:'rgba(250,246,241,.95)', backdropFilter:'blur(16px)',
                 borderTop:'1px solid rgba(61,53,48,.08)', paddingBottom:'env(safe-area-inset-bottom)' }}>
        {BAR.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative">
            {page === n.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                style={{ background:'var(--terra)' }} />
            )}
            <span className={`text-lg ${page===n.id?'scale-110':''} transition-transform`}>{n.icon}</span>
            <span className="text-[10px] font-medium"
              style={{ color: page===n.id ? 'var(--terra)' : 'var(--sub)' }}>{n.label}</span>
          </button>
        ))}

        {/* More */}
        <button onClick={() => setOpen(o => !o)}
          className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative">
          {(moreActive || open) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
              style={{ background:'var(--terra)' }} />
          )}
          <span className={`text-lg ${(moreActive||open)?'scale-110':''} transition-transform`}>🗂️</span>
          <span className="text-[10px] font-medium"
            style={{ color: (moreActive||open) ? 'var(--terra)' : 'var(--sub)' }}>More</span>
        </button>
      </nav>
    </>
  )
}
