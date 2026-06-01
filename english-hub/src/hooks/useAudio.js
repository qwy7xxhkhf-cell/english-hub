import { useState, useRef, useCallback } from 'react'

export function useAudio() {
  const audioRef   = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [repsLeft, setRepsLeft] = useState(0)
  const repsRef    = useRef(0)
  const urlRef     = useRef('')

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
    setRepsLeft(0)
    repsRef.current = 0
  }, [])

  const playOnce = useCallback((url) => {
    return new Promise((resolve) => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const a = new Audio(url)
      audioRef.current = a
      setPlaying(true)
      a.onended = () => { setPlaying(false); resolve() }
      a.onerror = () => { setPlaying(false); resolve() }
      a.play().catch(() => { setPlaying(false); resolve() })
    })
  }, [])

  const play = useCallback(async (url, times = 1) => {
    stop()
    urlRef.current = url
    repsRef.current = times
    setRepsLeft(times)

    for (let i = 0; i < times; i++) {
      if (urlRef.current !== url) break  // stopped externally
      setRepsLeft(times - i)
      await playOnce(url)
      if (i < times - 1) {
        await new Promise(r => setTimeout(r, 600)) // pause between reps
      }
    }
    setRepsLeft(0)
  }, [stop, playOnce])

  return { play, stop, playing, repsLeft }
}
