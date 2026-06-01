import { useState } from 'react'
import AudioPlayer from './AudioPlayer'

const LEVEL = { A1:'bg-green-100 text-green-700', A2:'bg-sky-100 text-sky-700', B1:'bg-amber-100 text-amber-700', B2:'bg-rose-100 text-rose-700' }

export default function SentenceCard({ s, mastered, onToggle, showIsland }) {
  const [show, setShow] = useState(false)
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${mastered?'bg-emerald-50/60 border-emerald-300':'bg-white border-stone-200 hover:shadow-md'}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <AudioPlayer audio={s.audio} compact />
        <div className="flex items-center gap-1.5 flex-wrap">
          {showIsland && <span className="text-xs text-stone-400">{s.island?.replace(' Island','')}</span>}
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LEVEL[s.level]||'bg-stone-100 text-stone-600'}`}>{s.level}</span>
        </div>
      </div>
      <div>
        <p className="text-stone-800 text-sm font-medium leading-relaxed">{s.en}</p>
        {!show
          ? <button onClick={()=>setShow(true)} className="text-xs text-stone-400 hover:text-emerald-600 mt-1 transition-colors">顯示中文 →</button>
          : <p className="text-stone-500 text-sm mt-1 leading-relaxed">{s.zh}</p>}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <span className="text-xs text-stone-400 truncate">{s.subtitle}</span>
        <button onClick={()=>onToggle(`s_${s.id}`)}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${mastered?'bg-emerald-100 text-emerald-700':'bg-stone-100 text-stone-500 hover:bg-emerald-100 hover:text-emerald-700'}`}>
          {mastered?'✅ Mastered':'☐ Master'}
        </button>
      </div>
    </div>
  )
}
