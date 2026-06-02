import { useState, useRef, useCallback } from 'react'

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
      const utt  = new SpeechSynthesisUtterance(text)
      utt.lang   = 'en-US'
      utt.rate   = 0.85
      utt.pitch  = 1.0
      utt.volume = 1.0
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
