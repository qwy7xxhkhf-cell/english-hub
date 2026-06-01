import { useState } from 'react'
import { useAuth }      from './hooks/useAuth'
import { useProgress }  from './hooks/useProgress'
import { useStudyLog }  from './hooks/useStudyLog'
import Auth             from './components/Auth'
import Sidebar          from './components/Sidebar'
import HomePage         from './components/pages/HomePage'
import IslandsPage      from './components/pages/IslandsPage'
import PhrasalPage      from './components/pages/PhrasalPage'
import ProgressPage     from './components/pages/ProgressPage'
import TrackerPage      from './components/pages/TrackerPage'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { progress, toggleMastered, masteredCount } = useProgress(user?.id)
  const { logs, stats, addLog, studiedDates }        = useStudyLog(user?.id)
  const [page,         setPage]         = useState('home')
  const [islandFilter, setIslandFilter] = useState('all')

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-stone-400 text-sm animate-pulse">Loading...</div>
    </div>
  )

  if (!user) return <Auth signIn={signIn} signUp={signUp} />

  const nav = { page, setPage, islandFilter, setIslandFilter }

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden" style={{fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <Sidebar page={page} setPage={setPage} streak={stats.streak} signOut={signOut} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {page === 'home'     && <HomePage     progress={progress} masteredCount={masteredCount} setPage={setPage} setIslandFilter={setIslandFilter} />}
        {page === 'islands'  && <IslandsPage  islandFilter={islandFilter} setIslandFilter={setIslandFilter} progress={progress} toggleMastered={toggleMastered} />}
        {page === 'phrasal'  && <PhrasalPage  progress={progress} toggleMastered={toggleMastered} />}
        {page === 'progress' && <ProgressPage progress={progress} masteredCount={masteredCount} stats={stats} />}
        {page === 'tracker'  && <TrackerPage  stats={stats} logs={logs} addLog={addLog} studiedDates={studiedDates} />}
      </main>
    </div>
  )
}
