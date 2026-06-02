import { VERBS } from '../../data/phrasalVerbs'
import { ISLAND_NAMES, SENTENCES } from '../../data/islands'

const ISLAND_META = {
  'Lifestyle Island':           { emoji:'🌿', bg:'var(--card-1)', accent:'var(--sage)'  },
  'Work & Study Island':        { emoji:'💻', bg:'var(--card-3)', accent:'#6b5f8a'      },
  'Mindset Island':             { emoji:'🧠', bg:'var(--card-3)', accent:'#6b5f8a'      },
  'Coffee Shop Island':         { emoji:'☕', bg:'var(--card-2)', accent:'var(--terra)' },
  'Hobbies & Interests Island': { emoji:'🎨', bg:'var(--card-2)', accent:'var(--terra)' },
  'Family Island':              { emoji:'👨‍👩‍👧', bg:'var(--card-5)', accent:'#a05050'      },
  'Small Talk Island':          { emoji:'💬', bg:'#e4eff0',       accent:'#4a6f78'      },
  'Feeling Island':             { emoji:'💭', bg:'var(--card-5)', accent:'#a05050'      },
  "Girl's Talk Island":         { emoji:'👯', bg:'var(--card-3)', accent:'#6b5f8a'      },
  'Travel Island':              { emoji:'✈️', bg:'#e4eff0',       accent:'#4a6f78'      },
  'Foodie Island':              { emoji:'🍜', bg:'var(--card-2)', accent:'var(--terra)' },
  'Couple Daily Life Island':   { emoji:'💑', bg:'var(--card-5)', accent:'#a05050'      },
  'Shopping Island':            { emoji:'🛍️', bg:'var(--card-4)', accent:'#7a6a50'      },
}

function getVerbOfDay() {
  const d = Math.floor(Math.abs(new Date() - new Date('2026-01-01')) / 86400000) % 100
  return VERBS[((d % 100) + 100) % 100]
}

export default function HomePage({ progress, masteredCount, setPage, setIslandFilter }) {
  const today = new Date().toLocaleDateString('zh-TW',{weekday:'long',month:'long',day:'numeric'})
  const hour  = new Date().getHours()
  const greet = hour<12 ? '早安 ☀️' : hour<18 ? '午安 🌤️' : '晚安 🌙'
  const verb  = getVerbOfDay()

  const goIsland = (name) => { setIslandFilter(name); setPage('islands') }

  const islandCounts = {}
  ISLAND_NAMES.forEach(n => { islandCounts[n] = 0 })
  SENTENCES.forEach(s => { if (islandCounts[s.island]!==undefined) islandCounts[s.island]++ })

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-xs mb-1" style={{color:'var(--sub)'}}>{today}</p>
        <h1 className="text-3xl font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{greet}</h1>
        <p className="text-sm mt-1" style={{color:'var(--sub)'}}>你今天學了什麼？Keep building your English world 🌍</p>
      </div>

      {/* Stats — Pinterest cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {[
          {e:'📚', n:SENTENCES.length.toLocaleString(), l:'Total Sentences', bg:'var(--card-1)', c:'var(--sage)'},
          {e:'✅', n:masteredCount,                     l:'Mastered',        bg:'var(--card-2)', c:'var(--terra)'},
          {e:'🏝️', n:ISLAND_NAMES.length,               l:'Islands',         bg:'var(--card-3)', c:'#6b5f8a'},
          {e:'💬', n:'100',                             l:'Phrasal Verbs',   bg:'var(--card-4)', c:'#7a6a50'},
        ].map(s=>(
          <div key={s.l} className="rounded-2xl p-4 text-center transition-all hover:shadow-md"
            style={{background:s.bg,border:'1px solid rgba(61,53,48,.06)'}}>
            <div className="text-2xl mb-1">{s.e}</div>
            <div className="text-xl font-bold" style={{color:s.c,fontFamily:'Georgia,serif'}}>{s.n}</div>
            <div className="text-xs mt-0.5" style={{color:'var(--sub)'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Islands — masonry-style grid */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>🏝️ My Islands</h2>
          <button onClick={()=>goIsland('all')} className="text-xs font-medium transition-colors"
            style={{color:'var(--sage)'}}
            onMouseEnter={e=>e.currentTarget.style.color='var(--deep)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--sage)'}>
            全部 →
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {ISLAND_NAMES.map(name => {
            const m = ISLAND_META[name] || {emoji:'📍', bg:'var(--card-4)', accent:'var(--sub)'}
            return (
              <button key={name} onClick={()=>goIsland(name)}
                className="rounded-2xl p-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{background:m.bg,border:'1px solid rgba(61,53,48,.06)'}}>
                <div className="text-xl mb-1">{m.emoji}</div>
                <div className="font-semibold text-xs leading-tight" style={{color:m.accent}}>
                  {name.replace(' Island','')}
                </div>
                <div className="text-xs mt-0.5" style={{color:'var(--sub)'}}>{islandCounts[name]} 句</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Verb of the day */}
      {verb && (
        <div className="rounded-2xl p-5 text-white" style={{background:'var(--deep)'}}>
          <p className="text-xs font-bold tracking-wider mb-2" style={{color:'rgba(232,237,233,.7)'}}>
            💬 PHRASAL VERB OF THE DAY
          </p>
          <div className="flex items-baseline gap-3 mb-2 flex-wrap">
            <span className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>{verb.verb}</span>
            <span className="text-base" style={{color:'rgba(232,237,233,.6)'}}>{verb.chinese}</span>
          </div>
          <p className="text-sm mb-4 leading-relaxed" style={{color:'rgba(255,255,255,.5)',fontStyle:'italic'}}>
            "{verb.memory.slice(0,90)}..."
          </p>
          <button onClick={()=>setPage('phrasal')}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-full transition-colors"
            style={{background:'rgba(255,255,255,.12)',color:'white'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.2)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}>
            See all 10 examples →
          </button>
        </div>
      )}
    </div>
  )
}
