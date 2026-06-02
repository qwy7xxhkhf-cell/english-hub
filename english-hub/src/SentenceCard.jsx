import { useState } from 'react'
import AudioPlayer from './AudioPlayer'

const LEVEL_STYLE = {
  A1:{bg:'#d1fae5',color:'#065f46'},
  A2:{bg:'#dbeafe',color:'#1e40af'},
  B1:{bg:'#fef3c7',color:'#92400e'},
  B2:{bg:'#fce7f3',color:'#9d174d'}
}

export default function SentenceCard({ s, mastered, onToggle, showIsland }) {
  const [show, setShow] = useState(false)
  const lv = LEVEL_STYLE[s.level] || {bg:'var(--sage-l)',color:'var(--sage)'}

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{
        background: mastered ? 'var(--card-1)' : 'white',
        border: mastered ? '1px solid rgba(90,122,114,.25)' : '1px solid rgba(61,53,48,.07)'
      }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <AudioPlayer text={s.en} compact />
        <div className="flex items-center gap-1.5 flex-wrap">
          {showIsland && <span className="text-xs" style={{color:'var(--sub)'}}>{s.island?.replace(' Island','')}</span>}
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{background:lv.bg,color:lv.color}}>{s.level}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium leading-relaxed" style={{color:'var(--warm)'}}>{s.en}</p>
        {!show
          ? <button onClick={()=>setShow(true)} className="text-xs mt-1 transition-colors"
              style={{color:'var(--sub)'}}
              onMouseEnter={e=>e.currentTarget.style.color='var(--terra)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--sub)'}>
              顯示中文 →
            </button>
          : <p className="text-sm mt-1 leading-relaxed" style={{color:'var(--sub)'}}>{s.zh}</p>}
      </div>
      <div className="flex items-center justify-between pt-2" style={{borderTop:'1px solid rgba(61,53,48,.07)'}}>
        <span className="text-xs truncate" style={{color:'var(--sub)'}}>{s.subtitle}</span>
        <button onClick={()=>onToggle(`s_${s.id}`)}
          className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap"
          style={{
            background: mastered ? 'var(--sage-l)' : 'rgba(61,53,48,.05)',
            color: mastered ? 'var(--sage)' : 'var(--sub)'
          }}>
          {mastered ? '✅ Mastered' : '☐ Master'}
        </button>
      </div>
    </div>
  )
}
