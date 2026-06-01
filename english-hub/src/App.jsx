import { useState } from 'react'
import { useAuth }      from './hooks/useAuth'
import { useProgress }  from './hooks/useProgress'
import { useStudyLog }  from './hooks/useStudyLog'
import Auth             from './components/Auth'
import Sidebar          from './components/Sidebar'
import MobileNav        from './components/MobileNav'
import HomePage         from './components/pages/HomePage'
import StudyPage        from './components/pages/StudyPage'
import IslandsPage      from './components/pages/IslandsPage'
import PhrasalPage      from './components/pages/PhrasalPage'
import ProgressPage     from './components/pages/ProgressPage'
import TrackerPage      from './components/pages/TrackerPage'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { progress, toggleMastered, masteredCount, update } = useProgress(user?.id)
  const { logs, stats, addLog, studiedDates }                = useStudyLog(user?.id)
  const [page,         setPage]         = useState('home')
  const [islandFilter, setIslandFilter] = useState('all')

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-stone-400 text-sm animate-pulse">Loading...</div>
    </div>
  )

  if (!user) return <Auth signIn={signIn} signUp={signUp} />

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden" style={{fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <Sidebar page={page} setPage={setPage} streak={stats.streak} signOut={signOut} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
        {/* Mobile top header */}
        <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-bold text-stone-800 text-sm">English Hub</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-amber-700">Day {stats.streak}</span>
          </div>
        </div>

        {page === 'home'     && <HomePage     progress={progress} masteredCount={masteredCount} setPage={setPage} setIslandFilter={setIslandFilter} />}
        {page === 'study'    && <StudyPage    progress={progress} toggleMastered={toggleMastered} update={update} />}
        {page === 'islands'  && <IslandsPage  islandFilter={islandFilter} setIslandFilter={setIslandFilter} progress={progress} toggleMastered={toggleMastered} />}
        {page === 'phrasal'  && <PhrasalPage  progress={progress} toggleMastered={toggleMastered} />}
        {page === 'progress' && <ProgressPage progress={progress} masteredCount={masteredCount} stats={stats} />}
        {page === 'tracker'  && <TrackerPage  stats={stats} logs={logs} addLog={addLog} studiedDates={studiedDates} />}
      </main>

      <MobileNav page={page} setPage={setPage} />
    </div>
  )
}
