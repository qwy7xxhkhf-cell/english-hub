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
import ChunksPage       from './components/pages/ChunksPage'
import VocabPage        from './components/pages/VocabPage'
import SlangPage        from './components/pages/SlangPage'
import ScenarioPage     from './components/pages/ScenarioPage'
import ProgressPage     from './components/pages/ProgressPage'
import TrackerPage      from './components/pages/TrackerPage'
import { PREMIUM_PAGES, isActivated } from './license'
import { ActivationModal, Paywall }   from './components/Activation'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { progress, toggleMastered, masteredCount } = useProgress(user?.id)
  const { logs, stats, addLog, studiedDates }        = useStudyLog(user?.id)
  const [page,         setPage]         = useState('home')
  const [islandFilter, setIslandFilter] = useState('all')
  const [activated,    setActivated]    = useState(isActivated())
  const [showActivate, setShowActivate] = useState(false)
  const locked = PREMIUM_PAGES.includes(page) && !activated
  const premiumTitle = { study:'Study Mode', phrasal:'Phrasal Verbs', chunks:'Chunks & Collocations',
    slang:'Slang Dictionary', islands:'Island Sentences', progress:'Progress' }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'var(--cream)'}}>
      <div className="text-sm animate-pulse" style={{color:'var(--sub)'}}>Loading...</div>
    </div>
  )

  if (!user) return <Auth signIn={signIn} signUp={signUp} />

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'var(--cream)'}}>
      <Sidebar page={page} setPage={setPage} streak={stats.streak} signOut={signOut}
        activated={activated} onActivate={()=>setShowActivate(true)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
        <div className="md:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
          style={{background:'rgba(250,246,241,.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(61,53,48,.08)'}}>
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-bold text-sm" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>English Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowActivate(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{background:activated?'rgba(90,122,114,.12)':'rgba(184,105,74,.1)',
                border:`1px solid ${activated?'rgba(90,122,114,.25)':'rgba(184,105,74,.2)'}`}}>
              <span className="text-xs">{activated?'✅':'🔑'}</span>
              <span className="text-[10px] font-bold" style={{color:activated?'var(--sage)':'var(--terra)'}}>
                {activated?'已啟用':'啟用'}
              </span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{background:'var(--terra-l)',border:'1px solid rgba(184,105,74,.2)'}}>
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold" style={{color:'var(--terra)'}}>Day {stats.streak}</span>
            </div>
          </div>
        </div>

        {locked ? (
          <Paywall title={premiumTitle[page] || '進階內容'} onUnlock={()=>setShowActivate(true)} />
        ) : (<>
        {page==='home'     && <HomePage      progress={progress} masteredCount={masteredCount} setPage={setPage} setIslandFilter={setIslandFilter}/>}
        {page==='study'    && <StudyPage     progress={progress} toggleMastered={toggleMastered}/>}
        {page==='islands'  && <IslandsPage   islandFilter={islandFilter} setIslandFilter={setIslandFilter} progress={progress} toggleMastered={toggleMastered}/>}
        {page==='phrasal'  && <PhrasalPage   progress={progress} toggleMastered={toggleMastered}/>}
        {page==='chunks'   && <ChunksPage    progress={progress} toggleMastered={toggleMastered}/>}
        {page==='vocab'    && <VocabPage     progress={progress} toggleMastered={toggleMastered}/>}
        {page==='slang'    && <SlangPage     progress={progress} toggleMastered={toggleMastered}/>}
        {page==='scenario' && <ScenarioPage  progress={progress} toggleMastered={toggleMastered}/>}
        {page==='progress' && <ProgressPage  progress={progress} masteredCount={masteredCount} stats={stats}/>}
        {page==='tracker'  && <TrackerPage   stats={stats} logs={logs} addLog={addLog} studiedDates={studiedDates}/>}
        </>)}
      </main>

      <MobileNav page={page} setPage={setPage} />

      <ActivationModal
        open={showActivate}
        onClose={()=>setShowActivate(false)}
        onActivated={()=>setActivated(true)}
      />
    </div>
  )
}
