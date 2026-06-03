import { SENTENCES, ISLAND_NAMES } from '../../data/islands'
import { VERBS } from '../../data/phrasalVerbs'
import { SLANG } from '../../data/internetSlang'
import { VOCABULARY } from '../../data/vocabulary'

const LEVEL_COLOR = { A1:'#d1fae5', A2:'#dbeafe', B1:'#fef3c7', B2:'#fce7f3' }
const LEVEL_TEXT  = { A1:'#065f46', A2:'#1e40af', B1:'#92400e', B2:'#9d174d' }

export default function ProgressPage({ progress, masteredCount, stats }) {
  // Grand total across all content
  const totalIsland   = SENTENCES.length
  const totalPhrsal   = VERBS.reduce((a,v)=>a+v.sentences.length, 0)
  const totalSlang    = SLANG.reduce((a,w)=>a+w.sentences.length, 0)
  const totalVocab    = VOCABULARY.reduce((a,v)=>a+v.sentences.length, 0)
  const grandTotal    = totalIsland + totalPhrsal + totalSlang + totalVocab

  // Mastered per category
  const masteredPhrsal  = VERBS.reduce((a,v,vi)=>a+v.sentences.filter((_,si)=>progress[`verb_${vi}_${si}`]?.mastered).length,0)
  const masteredSlang   = SLANG.reduce((a,w,wi)=>a+w.sentences.filter((_,si)=>progress[`slang_${w.zh}_${si}`]?.mastered).length,0)
  const masteredVocab   = VOCABULARY.reduce((a,v,vi)=>a+v.sentences.filter((_,si)=>progress[`vocab_${v.word}_${si}`]?.mastered).length,0)
  const masteredIsland  = masteredCount - masteredPhrsal - masteredSlang - masteredVocab

  // Island breakdown
  const islandProgress = ISLAND_NAMES.map(name => {
    const total   = SENTENCES.filter(s=>s.island===name).length
    const mastered = SENTENCES.filter((s,i)=>s.island===name&&progress[`sentence_${i}`]?.mastered).length
    return { name, total, mastered, pct: total>0?Math.round(mastered/total*100):0 }
  })

  // Vocab by level
  const vocabByLevel = ['A1','A2','B1','B2'].map(lv => {
    const words = VOCABULARY.filter(v=>v.level===lv)
    const totalSents = words.reduce((a,v)=>a+v.sentences.length,0)
    const masteredSents = words.reduce((a,v,wi)=>a+v.sentences.filter((_,si)=>
      progress[`vocab_${v.word}_${si}`]?.mastered).length,0)
    return { lv, words:words.length, totalSents, masteredSents }
  })

  const pct = n => grandTotal>0?Math.round(n/grandTotal*100):0

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>
        📊 My Progress
      </h1>

      {/* Grand total stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {[
          {e:'📚', n:grandTotal.toLocaleString(), l:'Total Sentences',  bg:'var(--card-1)', c:'var(--sage)'},
          {e:'✅', n:masteredCount,                l:'Mastered',         bg:'var(--card-2)', c:'var(--terra)'},
          {e:'🔥', n:`Day ${stats.streak}`,        l:`Best: ${stats.bestStreak}`, bg:'var(--card-3)', c:'#6b5f8a'},
          {e:'📈', n:`${pct(masteredCount)}%`,     l:'Completion',       bg:'var(--card-4)', c:'#7a6a50'},
        ].map(s=>(
          <div key={s.l} className="rounded-2xl p-4 text-center"
            style={{background:s.bg,border:'1px solid rgba(61,53,48,.06)'}}>
            <div className="text-2xl mb-1">{s.e}</div>
            <div className="text-xl font-bold" style={{color:s.c,fontFamily:'Georgia,serif'}}>{s.n}</div>
            <div className="text-xs mt-0.5" style={{color:'var(--sub)'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Content breakdown */}
      <div className="rounded-2xl p-5 mb-6" style={{background:'white',border:'1px solid var(--line)'}}>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{color:'var(--sub)'}}>Content Breakdown</h2>
        <div className="space-y-4">
          {[
            {label:'🏝️ Island Sentences', total:totalIsland,  mastered:masteredIsland>0?masteredIsland:0, color:'var(--sage)'},
            {label:'💬 Phrasal Verbs',    total:totalPhrsal,  mastered:masteredPhrsal,  color:'var(--terra)'},
            {label:'🔥 Slang Dictionary', total:totalSlang,   mastered:masteredSlang,   color:'#6b5f8a'},
            {label:'📚 Vocabulary',       total:totalVocab,   mastered:masteredVocab,   color:'#7a6a50'},
          ].map(row=>(
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{color:'var(--warm)'}}>{row.label}</span>
                <span className="text-xs" style={{color:'var(--sub)'}}>
                  {row.mastered}/{row.total} · {row.total>0?Math.round(row.mastered/row.total*100):0}%
                </span>
              </div>
              <div className="h-2 rounded-full" style={{background:'var(--line)'}}>
                <div className="h-2 rounded-full transition-all"
                  style={{width:`${row.total>0?Math.round(row.mastered/row.total*100):0}%`,background:row.color}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary by level */}
      <div className="rounded-2xl p-5 mb-6" style={{background:'white',border:'1px solid var(--line)'}}>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{color:'var(--sub)'}}>Vocabulary by Level</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {vocabByLevel.map(({lv,words,totalSents,masteredSents})=>(
            <div key={lv} className="rounded-xl p-3 text-center"
              style={{background:LEVEL_COLOR[lv]||'var(--card-1)'}}>
              <div className="text-lg font-bold mb-0.5" style={{color:LEVEL_TEXT[lv]||'var(--deep)',fontFamily:'Georgia,serif'}}>{lv}</div>
              <div className="text-xs font-semibold mb-1" style={{color:LEVEL_TEXT[lv]}}>{words} words</div>
              <div className="text-xs" style={{color:LEVEL_TEXT[lv],opacity:.7}}>{masteredSents}/{totalSents} mastered</div>
              <div className="mt-2 h-1.5 rounded-full" style={{background:'rgba(0,0,0,.08)'}}>
                <div className="h-1.5 rounded-full transition-all"
                  style={{width:`${totalSents>0?Math.round(masteredSents/totalSents*100):0}%`,background:LEVEL_TEXT[lv]}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Island completion */}
      <div className="rounded-2xl p-5" style={{background:'white',border:'1px solid var(--line)'}}>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{color:'var(--sub)'}}>Island Completion</h2>
        <div className="space-y-2">
          {islandProgress.map(({name,total,mastered,pct})=>(
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs w-40 truncate flex-shrink-0" style={{color:'var(--warm)'}}>
                {name.replace(' Island','')}
              </span>
              <div className="flex-1 h-2 rounded-full" style={{background:'var(--line)'}}>
                <div className="h-2 rounded-full transition-all" style={{width:`${pct}%`,background:'var(--sage)'}}/>
              </div>
              <span className="text-xs w-20 text-right flex-shrink-0" style={{color:'var(--sub)'}}>
                {mastered}/{total} · {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
