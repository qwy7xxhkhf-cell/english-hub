import { useState } from 'react'
import { useAudio } from '../../hooks/useAudio'

const REPEAT_OPTIONS = [1, 2, 3, 5]

export default function AudioPlayer({ audio, compact }) {
  const { play, stop, playing, repsLeft } = useAudio()
  const [reps, setReps] = useState(1)

  function toggle() {
    if (playing) { stop(); return }
    if (!audio) return
    play(audio, reps)
  }

  if (compact) {
    return (
      <button onClick={toggle}
        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
          playing
            ? 'bg-emerald-100 text-emerald-700 animate-pulse'
            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
        }`}>
        {playing ? `🔊 ×${repsLeft}` : '▶ Play'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Play/Stop button */}
      <button onClick={toggle}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all ${
          playing
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
        }`}>
        <span>{playing ? '⏹' : '▶'}</span>
        <span>{playing ? `Playing ×${repsLeft}` : 'Play'}</span>
      </button>

      {/* Repeat selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-stone-400">Repeat:</span>
        {REPEAT_OPTIONS.map(n => (
          <button key={n} onClick={() => setReps(n)}
            className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
              reps === n
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}>
            {n}×
          </button>
        ))}
      </div>
    </div>
  )
}
