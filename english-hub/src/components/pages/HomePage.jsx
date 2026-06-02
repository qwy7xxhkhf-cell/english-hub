import { VERBS } from '../../data/phrasalVerbs'
import { ISLAND_NAMES, SENTENCES } from '../../data/islands'

const ISLAND_META = {
  'Lifestyle Island':              { emoji:'🌿', color:'bg-emerald-50  border-emerald-200 text-emerald-800'  },
  'Work & Study Island':           { emoji:'💻', color:'bg-sky-50      border-sky-200     text-sky-800'      },
  'Mindset Island':                { emoji:'🧠', color:'bg-violet-50   border-violet-200  text-violet-800'   },
  'Coffee Shop Island':            { emoji:'☕', color:'bg-amber-50    border-amber-200   text-amber-800'    },
  'Hobbies & Interests Island':    { emoji:'🎨', color:'bg-orange-50   border-orange-200  text-orange-800'   },
  'Family Island':                 { emoji:'👨‍👩‍👧', color:'bg-rose-50     border-rose-200    text-rose-800'     },
  'Small Talk Island':             { emoji:'💬', color:'bg-cyan-50     border-cyan-200    text-cyan-800'     },
  'Feeling Island':                { emoji:'💭', color:'bg-pink-50     border-pink-200    text-pink-800'     },
  "Girl's Talk Island":            { emoji:'👯', color:'bg-fuchsia-50  border-fuchsia-200 text-fuchsia-800'  },
  'Travel Island':                 { emoji:'✈️', color:'bg-blue-50     border-blue-200    text-blue-800'     },
  'Foodie Island':                 { emoji:'🍜', color:'bg-yellow-50   border-yellow-200  text-yellow-800'   },
  'Couple Daily Life Island':      { emoji:'💑', color:'bg-red-50      border-red-200     text-red-800'      },
  'Shopping Island':               { emoji:'🛍️', color:'bg-purple-50   border-purple-200  text-purple-800'   },
}

function getVerbOfDay() {
  const dayNum = Math.floor(Math.abs(new Date() - new Date('2026-01-01')) / 86400000) % 100
  return VERBS[((dayNum % 100) + 100) % 100]
}

export default function HomePage({ progress, masteredCount, setPage, setIslandFilter }) {
  const today = new Date().toLocaleDateString('zh-TW',{weekday:'long',month:'long',day:'numeric'})
  const hour  = new Date().getHours()
  const greet = hour<12 ? '早安 ☀️' : hour<18 ? '午安 🌤️' : '晚安 🌙'
  const verb  = getVerbOfDay()

  const goIsland = (name) => { setIslandFilter(name); setPage('islands') }

  // Count sentences per island
  const islandCounts = {}
  ISLAND_NAMES.forEach(n => { islandCounts[n] = 0 })
  SENTENCES.forEach(s => { if (islandCounts[s.island] !== undefined) islandCounts[s.island]++ })

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <p className="text-stone-400 text-xs mb-1">{today}</p>
        <h1 className="text-3xl font-bold text-stone-800" style={{fontFamily:'Georgia,serif'}}>{greet}</h1>
        <p className="text-stone-500 text-sm mt-1">你今天學了什麼？Keep building your English world 🌍</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {[
          {e:'📚', n:SENTENCES.length.toLocaleString(), l:'Total Sentences'},
          {e:'✅', n:masteredCount,                     l:'Mastered'},
          {e:'🏝️', n:ISLAND_NAMES.length,               l:'Islands'},
          {e:'💬', n:'100',                             l:'Phrasal Verbs'},
        ].map(s=>(
          <div key={s.l} className="bg-white border border-stone-200 rounded-xl p-4 text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl mb-1">{s.e}</div>
            <div className="text-xl font-bold text-stone-800">{s.n}</div>
            <div className="text-xs text-stone-400 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Islands */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-700" style={{fontFamily:'Georgia,serif'}}>🏝️ My Islands</h2>
          <button onClick={()=>goIsland('all')} className="text-xs text-emerald-700 hover:text-emerald-900 font-medium">全部 →</button>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {ISLAND_NAMES.map(name => {
            const m   = ISLAND_META[name] || {emoji:'📍',color:'bg-stone-50 border-stone-200 text-stone-700'}
            const cnt = islandCounts[name] || 0
            const mc  = Object.entries(progress).filter(([k,v])=>v.mastered&&k.startsWith('s_')).length
            return (
              <button key={name} onClick={()=>goIsland(name)}
                className={`border rounded-xl p-3 text-left hover:shadow-md transition-all ${m.color}`}>
                <div className="text-xl mb-1">{m.emoji}</div>
                <div className="font-semibold text-xs leading-tight">{name.replace(' Island','')}</div>
                <div className="text-xs opacity-60 mt-0.5">{cnt} sentences</div>
                <div className="mt-1.5 h-1 rounded-full bg-white/40">
                  <div className="h-1 rounded-full bg-current opacity-40" style={{width:'0%'}}/>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Verb of the day */}
      {verb && (
        <div className="bg-gradient-to-br from-stone-900 to-emerald-900 rounded-2xl p-5 text-white">
          <p className="text-xs text-emerald-300 font-semibold tracking-wider mb-2">💬 PHRASAL VERB OF THE DAY</p>
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <span className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>{verb.verb}</span>
            <span className="text-emerald-300 text-base">{verb.chinese}</span>
          </div>
          <p className="text-stone-300 text-sm italic leading-relaxed mb-4 line-clamp-2">"{verb.memory.slice(0,100)}..."</p>
          <button onClick={()=>setPage('phrasal')}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs px-4 py-2 rounded-full transition-colors">
            See all 10 examples →
          </button>
        </div>
      )}
    </div>
  )
}
