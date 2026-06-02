import { useState, useRef } from 'react'

const REPS = [1, 2, 3, 5]

function speakText(text, times, onDone) {
  if (!window.speechSynthesis) { onDone?.(); return }
  let count = 0
  const go = () => {
    if (count >= times) { onDone?.(); return }
    const utt  = new SpeechSynthesisUtterance(text)
    utt.lang   = 'en-US'
    utt.rate   = 0.85
    utt.onend  = () => { count++; count < times ? setTimeout(go, 700) : onDone?.() }
    utt.onerror = () => onDone?.()
    window.speechSynthesis.speak(utt)
  }
  go()
}

export default function AudioPlayer({ text, compact }) {
  const [playing, setPlaying] = useState(false)
  const [reps,    setReps]    = useState(1)
  const activeRef = useRef(true)

  function toggle() {
    if (playing) {
      window.speechSynthesis?.cancel()
      setPlaying(false)
      return
    }
    if (!text) return
    setPlaying(true)
    activeRef.current = true
    speakText(text, reps, () => setPlaying(false))
  }

  if (compact) return (
    <button onClick={toggle}
      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all flex-shrink-0
        ${playing ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-800 hover:bg-emerald-700 text-white'}`}>
      <span>{playing ? '🔊' : '▶'}</span>
      <span>{playing ? 'Playing' : 'Play'}</span>
    </button>
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={toggle}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all
          ${playing ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-emerald-800 hover:bg-emerald-700 text-white'}`}>
        <span>{playing ? '⏹' : '▶'}</span>
        <span>{playing ? 'Playing...' : 'Play'}</span>
      </button>
      <div className="flex items-center gap-1">
        <span className="text-xs text-stone-400">Repeat:</span>
        {REPS.map(n => (
          <button key={n} onClick={() => setReps(n)}
            className={`w-7 h-7 rounded-full text-xs font-bold transition-all
              ${reps === n ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
            {n}×
          </button>
        ))}
      </div>
    </div>
  )
}
