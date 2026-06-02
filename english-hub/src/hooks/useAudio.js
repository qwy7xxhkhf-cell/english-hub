import { useState, useRef, useCallback } from 'react'

// Pick the best available English voice
function getBestVoice() {
  const voices = window.speechSynthesis?.getVoices() || []
  if (!voices.length) return null

  // Preferred voices (most natural sounding)
  const preferred = [
    'Samantha',        // iOS - natural US female
    'Daniel',          // iOS - natural UK male
    'Karen',           // iOS - Australian
    'Google US English', // Chrome - good quality
    'Microsoft Aria',  // Edge - very natural
    'Microsoft Jenny', // Edge
    'Alex',            // macOS
  ]
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name))
    if (v) return v
  }
  // Prefer non-compact en-US voices
  const enUS = voices.filter(v => v.lang.startsWith('en') && !v.name.includes('Compact'))
  if (enUS.length) return enUS[0]

  return voices.find(v => v.lang.startsWith('en')) || null
}

export function useAudio() {
  const [playing,  setPlaying]  = useState(false)
  const [repsLeft, setRepsLeft] = useState(0)
  const activeRef = useRef(false)
  const countRef  = useRef(0)

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
    activeRef.current = true
    countRef.current  = 0
    setPlaying(true)
    setRepsLeft(times)

    const next = () => {
      if (!activeRef.current || countRef.current >= times) {
        setPlaying(false); setRepsLeft(0); return
      }
      const utt    = new SpeechSynthesisUtterance(text)
      utt.lang     = 'en-US'
      utt.rate     = 0.88   // slightly slower = clearer
      utt.pitch    = 1.0
      utt.volume   = 1.0
      const voice  = getBestVoice()
      if (voice) utt.voice = voice

      utt.onend  = () => {
        countRef.current++
        setRepsLeft(times - countRef.current)
        if (countRef.current < times && activeRef.current) {
          setTimeout(next, 700)
        } else {
          setPlaying(false); setRepsLeft(0)
        }
      }
      utt.onerror = () => { setPlaying(false); setRepsLeft(0) }
      window.speechSynthesis.speak(utt)
    }
    next()
  }, [])

  return { play, stop, playing, repsLeft }
}
