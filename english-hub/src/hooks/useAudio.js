import { useState, useRef, useCallback } from 'react'

// iOS only lets speechSynthesis run after it's been "unlocked" inside a real
// user gesture. We prime it once on the first tap.
let _unlocked = false

// Warm up the voice list (iOS/Chrome load voices async)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  try {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
  } catch {}
}

function getBestVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  if (!voices.length) return null
  const preferred = ['Samantha','Daniel','Karen','Google US English','Microsoft Aria','Microsoft Jenny','Alex']
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name))
    if (v) return v
  }
  const enUS = voices.filter(v => v.lang.startsWith('en') && !v.name.includes('Compact'))
  if (enUS.length) return enUS[0]
  return voices.find(v => v.lang.startsWith('en')) || null
}

export function useAudio() {
  const [playing,  setPlaying]  = useState(false)
  const [repsLeft, setRepsLeft] = useState(0)
  const activeRef = useRef(false)
  const countRef  = useRef(0)

  // Call this inside a user gesture (tap) to enable audio on iOS
  const unlock = useCallback(() => {
    if (_unlocked || !window.speechSynthesis) return
    try {
      window.speechSynthesis.resume()
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      window.speechSynthesis.speak(u)
      _unlocked = true
    } catch {}
  }, [])

  const stop = useCallback(() => {
    activeRef.current = false
    window.speechSynthesis?.cancel()
    setPlaying(false)
    setRepsLeft(0)
    countRef.current = 0
  }, [])

  const play = useCallback((text, times = 1) => {
    if (!text || !window.speechSynthesis) return
    activeRef.current = false
    window.speechSynthesis.cancel()
    window.speechSynthesis.resume()   // iOS sometimes leaves engine paused
    activeRef.current = true
    countRef.current  = 0
    setPlaying(true)
    setRepsLeft(times)

    const next = () => {
      if (!activeRef.current || countRef.current >= times) {
        setPlaying(false); setRepsLeft(0); return
      }
      try { window.speechSynthesis.resume() } catch {}
      const utt  = new SpeechSynthesisUtterance(text)
      utt.lang   = 'en-US'
      utt.rate   = 0.88
      utt.pitch  = 1.0
      utt.volume = 1.0
      const voice = getBestVoice()
      if (voice) utt.voice = voice
      utt.onend = () => {
        countRef.current++
        setRepsLeft(times - countRef.current)
        if (countRef.current < times && activeRef.current) setTimeout(next, 700)
        else { setPlaying(false); setRepsLeft(0) }
      }
      utt.onerror = () => { setPlaying(false); setRepsLeft(0) }
      window.speechSynthesis.speak(utt)
    }
    next()
  }, [])

  return { play, stop, unlock, playing, repsLeft }
}
