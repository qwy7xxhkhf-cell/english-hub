import { useState, useRef } from 'react'
const REPS = [1, 2, 3, 5]

function speakText(text, times, onDone) {
  if (!window.speechSynthesis) { onDone?.(); return }
  let count = 0
  const go = () => {
    if (count >= times) { onDone?.(); return }
    const utt  = new SpeechSynthesisUtterance(text)
    utt.lang   = 'en-US'; utt.rate = 0.88
    const voices = window.speechSynthesis.getVoices()
    const best = voices.find(v=>v.name.includes('Samantha')||v.name.includes('Daniel')||v.name.includes('Google US'))
      || voices.find(v=>v.lang.startsWith('en')&&!v.name.includes('Compact'))
    if (best) utt.voice = best
    utt.onend = () => { count++; count < times ? setTimeout(go, 700) : onDone?.() }
    utt.onerror = () => onDone?.()
    window.speechSynthesis.speak(utt)
  }
  go()
}

export default function AudioPlayer({ text, compact }) {
  const [playing, setPlaying] = useState(false)
  const [reps, setReps]       = useState(1)

  function toggle() {
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); return }
    if (!text) return
    setPlaying(true)
    speakText(text, reps, () => setPlaying(false))
  }

  if (compact) return (
    <button onClick={toggle}
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all flex-shrink-0"
      style={{
        background: playing ? 'var(--sage-l)' : 'var(--deep)',
        color: playing ? 'var(--sage)' : 'white'
      }}>
      <span>{playing ? '🔊' : '▶'}</span>
      <span>{playing ? 'Playing' : 'Play'}</span>
    </button>
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={toggle}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all"
        style={{
          background: playing ? 'var(--sage-l)' : 'var(--deep)',
          color: playing ? 'var(--sage)' : 'white',
          border: playing ? '1px solid var(--sage)' : 'none'
        }}>
        <span>{playing ? '⏹' : '▶'}</span>
        <span>{playing ? 'Playing...' : 'Play'}</span>
      </button>
      <div className="flex items-center gap-1">
        <span className="text-xs" style={{color:'var(--sub)'}}>Repeat:</span>
        {REPS.map(n => (
          <button key={n} onClick={() => setReps(n)}
            className="w-7 h-7 rounded-full text-xs font-bold transition-all"
            style={{
              background: reps===n ? 'var(--deep)' : 'var(--sage-l)',
              color: reps===n ? 'white' : 'var(--sage)'
            }}>
            {n}×
          </button>
        ))}
      </div>
    </div>
  )
}
