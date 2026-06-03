import { useState } from 'react'
import { useAudio } from '../../hooks/useAudio'

const SCENARIOS = [
  {
    id:'job_interview', emoji:'💼', title:'Job Interview', zh:'求職面試',
    color:'var(--card-3)', accent:'#6b5f8a',
    context:'You are in a job interview. The interviewer is asking you questions.',
    contextZh:'你正在進行求職面試，面試官在問你問題。',
    phrases:[
      {situation:'面試官問：Tell me about yourself',en:'I have three years of experience in marketing, with a focus on social media and content creation. I am passionate about building brands that connect with real people.',zh:'我有三年的行銷工作經驗，專注於社交媒體和內容創作。我熱衷於打造能與真實用戶建立連結的品牌。'},
      {situation:'面試官問：What is your greatest strength?',en:'My greatest strength is my ability to stay calm under pressure and find creative solutions when things do not go as planned.',zh:'我最大的優點是能在壓力下保持冷靜，並在事情不如預期時找到創意解決方案。'},
      {situation:'面試官問：Why do you want this job?',en:'I am drawn to this role because it combines my love for problem-solving with the chance to grow within a company that values innovation.',zh:'我被這個職位吸引，是因為它結合了我對解決問題的熱愛，以及在一家重視創新的公司成長的機會。'},
      {situation:'面試官問：Where do you see yourself in five years?',en:'In five years, I see myself taking on more leadership responsibilities while continuing to develop my expertise in this field.',zh:'五年後，我希望自己能承擔更多領導責任，同時繼續深化在這個領域的專業知識。'},
      {situation:'面試官問：Do you have any questions for us?',en:'Yes — could you tell me more about the team culture and what a typical day looks like in this role?',zh:'有的——能告訴我更多關於團隊文化，以及這個職位典型的一天是什麼樣的嗎？'},
      {situation:'面試官問：What is your biggest weakness?',en:'I tend to be a perfectionist, which sometimes slows me down. But I have been working on setting clear time limits for tasks to balance quality and efficiency.',zh:'我有時會過於追求完美，這可能會讓我速度變慢。但我一直在努力為任務設定明確的時間限制，以平衡品質和效率。'},
      {situation:'談薪資',en:'Based on my research and experience, I was hoping for a salary in the range of X. However, I am open to discussing the full compensation package.',zh:'根據我的研究和工作經驗，我希望薪資範圍在X左右。不過，我願意討論整體薪酬方案。'},
      {situation:'結束面試',en:'Thank you so much for your time. I am very excited about this opportunity and look forward to hearing from you.',zh:'非常感謝您抽出時間。我對這個機會感到非常興奮，期待您的回覆。'},
    ]
  },
  {
    id:'doctor', emoji:'🏥', title:'At the Doctor', zh:'看醫生',
    color:'var(--card-1)', accent:'var(--sage)',
    context:'You are at a medical appointment describing your symptoms.',
    contextZh:'你在醫療預約中描述你的症狀。',
    phrases:[
      {situation:'描述症狀',en:'I have had a persistent headache for three days and I also feel nauseous.',zh:'我已經頭痛了三天，而且感覺噁心。'},
      {situation:'描述疼痛',en:'It is a sharp pain on the right side of my stomach. It started yesterday evening.',zh:'是我胃部右側的劇烈疼痛，昨天晚上開始的。'},
      {situation:'說明過敏',en:'I am allergic to penicillin. Please make note of that before prescribing anything.',zh:'我對青黴素過敏，在開處方前請注意這點。'},
      {situation:'詢問病情',en:'Could you explain what this diagnosis means and what the treatment options are?',zh:'您能解釋一下這個診斷是什麼意思，以及有哪些治療選項嗎？'},
      {situation:'詢問藥物',en:'How often should I take this medication, and are there any side effects I should watch for?',zh:'我應該多久服用一次這種藥物，有什麼副作用需要注意嗎？'},
      {situation:'請假信',en:'My doctor has advised me to rest for three days. Could you process the sick leave paperwork for me?',zh:'我的醫生建議我休息三天，請問能幫我辦理病假手續嗎？'},
      {situation:'預約複診',en:'When should I come back for a follow-up appointment?',zh:'我什麼時候應該回來複診？'},
      {situation:'詢問結果',en:'I had blood tests done last week. Are the results in yet?',zh:'我上週做了血液檢查，結果出來了嗎？'},
    ]
  },
  {
    id:'first_date', emoji:'🌹', title:'First Date', zh:'第一次約會',
    color:'var(--card-5)', accent:'#a05050',
    context:'You are on a first date getting to know someone new.',
    contextZh:'你在和一個新認識的人第一次約會。',
    phrases:[
      {situation:'打破沉默',en:'So, have you been to this area before? I only discovered this café a few weeks ago.',zh:'你以前來過這一帶嗎？我幾週前才發現這家咖啡廳。'},
      {situation:'詢問喜好',en:'What do you usually do on weekends? Are you more of an indoor or outdoor person?',zh:'你週末通常做什麼？你是比較喜歡室內還是戶外活動的人？'},
      {situation:'分享興趣',en:'I am really into photography lately — I love capturing moments that feel alive.',zh:'我最近很喜歡攝影——我喜歡捕捉感覺有生命力的瞬間。'},
      {situation:'稱讚對方',en:'I really enjoyed talking to you today. You have such an interesting perspective on things.',zh:'我今天真的很享受和你說話，你對事情有非常獨特的看法。'},
      {situation:'提議下次',en:'This has been really lovely. Would you like to do this again sometime?',zh:'今天真的很愉快，你願意找時間再約嗎？'},
      {situation:'保持輕鬆',en:'I have to be honest — I am a bit nervous but in a good way.',zh:'我必須說實話——我有點緊張，但是是那種好的緊張。'},
      {situation:'問對方想法',en:'What are you looking for right now? I think it is better to be upfront.',zh:'你現在在找什麼樣的關係？我覺得坦誠比較好。'},
      {situation:'道別',en:'I had a really good time. Text me when you get home safely?',zh:'我今天玩得很開心，到家後傳個訊息給我好嗎？'},
    ]
  },
  {
    id:'complain', emoji:'😤', title:'Complaining Politely', zh:'優雅地投訴',
    color:'var(--card-2)', accent:'var(--terra)',
    context:'You need to complain about a product or service professionally.',
    contextZh:'你需要專業地投訴一個產品或服務。',
    phrases:[
      {situation:'說明問題',en:'I would like to raise a concern about the service I received last Tuesday. It did not meet expectations.',zh:'我想提出一個關於上週二收到的服務的問題，它沒有達到預期。'},
      {situation:'要求解決',en:'I would appreciate it if you could look into this and let me know what steps will be taken.',zh:'如果您能調查此事並告知將採取哪些措施，我將不勝感激。'},
      {situation:'退款要求',en:'Under the circumstances, I believe a full refund is the appropriate resolution.',zh:'在這種情況下，我認為全額退款是適當的解決方案。'},
      {situation:'升級投訴',en:'I would like to speak with a manager, please. I do not feel this has been handled properly.',zh:'我想和經理說話，我覺得這件事處理得不太妥當。'},
      {situation:'保持冷靜',en:'I understand this may not be your fault personally, but I need this resolved as soon as possible.',zh:'我明白這可能不是你個人的問題，但我需要盡快解決這個問題。'},
      {situation:'確認解決',en:'Thank you for handling this. Could I get written confirmation of the resolution?',zh:'謝謝您處理這件事，我可以得到書面確認解決方案嗎？'},
      {situation:'在餐廳',en:'Excuse me, I ordered the grilled salmon but this appears to be the fried version. Could you check on that?',zh:'對不起，我點的是烤三文魚，但這看起來是炸的，能幫我確認一下嗎？'},
      {situation:'結束通話',en:'I appreciate your help with this today. I will wait for your follow-up email.',zh:'感謝您今天的幫助，我會等待您的後續電子郵件。'},
    ]
  },
  {
    id:'making_friends', emoji:'🤝', title:'Making New Friends', zh:'結交新朋友',
    color:'var(--card-4)', accent:'#7a6a50',
    context:'You are at a social event trying to meet new people.',
    contextZh:'你在一個社交活動中試著認識新朋友。',
    phrases:[
      {situation:'打招呼',en:'Hey! Are you here with the group from the design meetup?',zh:'嘿！你是和設計聚會的那群人一起來的嗎？'},
      {situation:'找話題',en:'How do you know the host? I just moved here recently and I am still meeting people.',zh:'你怎麼認識主辦人的？我最近才搬來這裡，還在認識新朋友。'},
      {situation:'交換資訊',en:'I would love to keep in touch. Could I add you on Instagram?',zh:'我很想保持聯繫，我可以加你的 Instagram 嗎？'},
      {situation:'邀請出去',en:'A few of us are heading to a bar nearby after this — you should come!',zh:'我們幾個人之後要去附近的酒吧——你應該一起來！'},
      {situation:'共同點',en:'Oh, you are into photography too? We should go on a photo walk sometime.',zh:'哦，你也喜歡攝影？我們應該找時間一起去街拍。'},
      {situation:'結束對話',en:'It was so nice meeting you. Let's definitely grab coffee soon.',zh:'很高興認識你，我們一定要找時間喝咖啡。'},
      {situation:'重新聯繫',en:'Hey! We met at Sarah's party last month. How have you been?',zh:'嘿！我們上個月在 Sarah 的派對見過，你最近怎樣？'},
      {situation:'提議活動',en:'Have you tried that new climbing gym? A few of us are going Saturday — want to join?',zh:'你試過那家新的攀岩館嗎？我們幾個人星期六要去——想一起嗎？'},
    ]
  },
  {
    id:'negotiating', emoji:'🤝', title:'Negotiating at Work', zh:'工作談判',
    color:'var(--card-3)', accent:'#6b5f8a',
    context:'You are negotiating a raise, deadline, or project scope at work.',
    contextZh:'你在工作中談判薪資、截止日期或項目範圍。',
    phrases:[
      {situation:'要求加薪',en:'Based on my contributions this year and market research, I would like to discuss a salary adjustment.',zh:'根據我今年的貢獻和市場研究，我想討論薪資調整的問題。'},
      {situation:'談判截止日',en:'Given the current workload, I think a two-week extension would allow us to deliver a much higher quality result.',zh:'鑒於目前的工作量，我認為延長兩週可以讓我們提供更高品質的結果。'},
      {situation:'說明立場',en:'I want to find a solution that works for everyone. Here is what I can commit to.',zh:'我想找到一個對大家都有效的解決方案，以下是我可以承諾的。'},
      {situation:'提出方案',en:'What if we prioritise the core features for the first release and save the rest for phase two?',zh:'如果我們在第一個版本中優先考慮核心功能，將其餘部分留給第二階段，怎麼樣？'},
      {situation:'表達底線',en:'I am willing to be flexible on the timeline, but the budget is fixed. That is not something I can move on.',zh:'我願意在時間表上靈活，但預算是固定的，這一點我無法讓步。'},
      {situation:'達成共識',en:'I think we have found a middle ground. Let me summarise what we agreed on.',zh:'我認為我們找到了一個中間點，讓我總結一下我們達成的共識。'},
      {situation:'延期交貨',en:'I want to be transparent — we have hit an unexpected obstacle. Can we meet to discuss options?',zh:'我想坦誠相告——我們遇到了意想不到的障礙，我們能開會討論選項嗎？'},
      {situation:'拒絕不合理要求',en:'I appreciate the urgency, but taking on this project would compromise the quality of existing commitments.',zh:'我理解緊迫性，但接手這個項目會影響現有承諾的品質。'},
    ]
  },
]

const REPS = [1, 2, 3, 5]

function ScenarioPractice({ scenario, onClose, progress, toggleMastered }) {
  const [mode,     setMode]     = useState('recall')
  const [idx,      setIdx]      = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reps,     setReps]     = useState(1)
  const { play, playing }       = useAudio()

  const current  = scenario.phrases[idx]
  const key      = `scenario_${scenario.id}_${idx}`
  const mastered = progress[key]?.mastered

  const [stats, setStats] = useState({p:0,r:0,m:0})
  function inc(f){ setStats(s=>({...s,[f]:s[f]+1})) }

  useMemo(()=>{
    if(mode==='shadow'&&current?.en) setTimeout(()=>play(current.en,reps),300)
  // eslint-disable-next-line
  },[idx,mode])

  function next(){ setIdx(i=>(i+1)%scenario.phrases.length); setRevealed(false) }
  function prev(){ setIdx(i=>(i-1+scenario.phrases.length)%scenario.phrases.length); setRevealed(false) }
  function reveal(){ setRevealed(true); inc('p'); if(current?.en) play(current.en,reps) }
  function handleMaster(){ toggleMastered(key); if(!mastered) inc('m') }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:'var(--cream)'}}>
      <div className="px-4 py-3 flex items-center justify-between"
        style={{background:'white',borderBottom:'1px solid var(--line)'}}>
        <button onClick={onClose} className="text-sm font-medium" style={{color:'var(--sage)'}}>
          ‹ 返回情景列表
        </button>
        <div className="flex gap-4 text-center">
          {[{n:stats.p,l:'練習'},{n:stats.m,l:'掌握'}].map(x=>(
            <div key={x.l}>
              <div className="text-base font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{x.n}</div>
              <div className="text-xs" style={{color:'var(--sub)'}}>{x.l}</div>
            </div>
          ))}
        </div>
        <span className="text-xs" style={{color:'var(--sub)'}}>{idx+1}/{scenario.phrases.length}</span>
      </div>

      <div className="px-4 py-2 flex items-center gap-2" style={{background:'white',borderBottom:'1px solid var(--line)'}}>
        <div className="flex rounded-lg p-0.5 gap-0.5" style={{background:'var(--sage-l)'}}>
          {[['recall','💬 Recall'],['shadow','🎧 Shadow']].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setRevealed(false);setIdx(0)}}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={mode===m?{background:'white',color:'var(--deep)'}:{color:'var(--sub)'}}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {REPS.map(n=>(
            <button key={n} onClick={()=>setReps(n)}
              className="w-7 h-7 rounded-full text-xs font-bold"
              style={{background:reps===n?'var(--deep)':'var(--sage-l)',color:reps===n?'white':'var(--sage)'}}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{scenario.emoji}</span>
            <span className="font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{scenario.title}</span>
            <span className="text-sm" style={{color:'var(--sub)'}}>{scenario.zh}</span>
          </div>

          {/* Situation */}
          <div className="rounded-xl px-4 py-2 mb-4 text-sm font-medium" style={{background:scenario.color,color:scenario.accent}}>
            📍 {current.situation}
          </div>

          {mode==='recall' ? (
            <div>
              <div className="rounded-2xl p-6 mb-4" style={{background:'white',border:'2px solid var(--line)'}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--sub)'}}>中文提示</p>
                <p className="text-xl leading-relaxed" style={{color:'var(--warm)'}}>{current.zh}</p>
              </div>
              {!revealed ? (
                <button onClick={reveal} className="w-full py-4 rounded-2xl font-medium text-sm text-white"
                  style={{background:'var(--deep)'}}>
                  點擊顯示英文 + 播放
                </button>
              ) : (
                <div>
                  <div className="rounded-2xl p-6 mb-4" style={{background:'var(--sage-l)',border:'2px solid rgba(90,122,114,.2)'}}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--sage)'}}>English</p>
                    <p className="text-lg leading-relaxed font-medium" style={{color:'var(--warm)'}}>{current.en}</p>
                  </div>
                  {playing && <div className="text-center text-sm mb-3 animate-pulse" style={{color:'var(--sage)'}}>🔊 Playing...</div>}
                  <button onClick={()=>play(current.en,reps)} className="w-full py-2 rounded-xl text-sm mb-3"
                    style={{border:'1px solid var(--line)',color:'var(--sub)'}}>🔁 Replay ×{reps}</button>
                  <div className="flex gap-2">
                    <button onClick={handleMaster} className="flex-1 py-3 rounded-xl text-sm font-medium"
                      style={{background:mastered?'var(--sage-l)':'rgba(61,53,48,.05)',color:mastered?'var(--sage)':'var(--sub)'}}>
                      {mastered?'✅ Mastered':'☐ Master'}
                    </button>
                    <button onClick={next} className="flex-grow flex-1 py-3 rounded-xl text-sm font-medium text-white"
                      style={{background:'var(--deep)'}}>下一句 →</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="rounded-2xl p-6 mb-4" style={{background:'white',border:'2px solid var(--line)'}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{color:'var(--sub)'}}>🎧 Listen & Repeat</p>
                <p className="text-lg font-medium leading-relaxed mb-2" style={{color:'var(--warm)'}}>{current.en}</p>
                <p style={{color:'var(--sub)',fontSize:'14px'}}>{current.zh}</p>
              </div>
              <div className="text-center py-3 rounded-xl mb-4"
                style={{background:playing?'var(--sage-l)':'rgba(61,53,48,.05)',color:playing?'var(--sage)':'var(--sub)'}}>
                {playing ? <span className="animate-pulse">🔊 Playing...</span> : 'Audio complete — now repeat aloud'}
              </div>
              <button onClick={()=>play(current.en,reps)} className="w-full py-2.5 rounded-xl text-sm mb-3"
                style={{border:'1px solid var(--line)',color:'var(--sub)'}}>🔁 Replay ×{reps}</button>
              <div className="flex gap-2">
                <button onClick={handleMaster} className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{background:mastered?'var(--sage-l)':'rgba(61,53,48,.05)',color:mastered?'var(--sage)':'var(--sub)'}}>
                  {mastered?'✅':'☐'} Master
                </button>
                <button onClick={next} className="flex-1 flex-grow py-3 rounded-xl text-sm font-medium text-white"
                  style={{background:'var(--deep)'}}>Next →</button>
              </div>
            </div>
          )}
          <button onClick={prev} className="w-full mt-3 py-2 text-xs" style={{color:'var(--sub)'}}>← Previous</button>
        </div>
      </div>
    </div>
  )
}

export default function ScenarioPage({ progress, toggleMastered }) {
  const [active, setActive] = useState(null)

  return (
    <>
      <div className="p-5 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>🎭 Scenario Practice</h1>
          <p className="text-sm" style={{color:'var(--sub)'}}>練習真實生活情景的英文表達 · Recall & Shadow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map(s => {
            const masteredCount = s.phrases.filter((_,i)=>progress[`scenario_${s.id}_${i}`]?.mastered).length
            return (
              <button key={s.id} onClick={()=>setActive(s)}
                className="text-left rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{background:'white',border:'1px solid var(--line)'}}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{color:'var(--deep)',fontFamily:'Georgia,serif'}}>{s.title}</h3>
                      <span className="text-xs" style={{color:'var(--sub)'}}>{s.zh}</span>
                    </div>
                    <p className="text-xs mb-3" style={{color:'var(--sub)'}}>{s.contextZh}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{background:s.color,color:s.accent}}>
                        {s.phrases.length} phrases
                      </span>
                      <span className="text-xs" style={{color:'var(--sage)'}}>
                        {masteredCount}/{s.phrases.length} mastered
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full" style={{background:'var(--line)'}}>
                      <div className="h-1.5 rounded-full transition-all"
                        style={{width:`${(masteredCount/s.phrases.length)*100}%`,background:'var(--sage)'}}/>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl p-5" style={{background:'var(--card-2)',border:'1px solid rgba(184,105,74,.12)'}}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--terra)'}}>即將加入</p>
          <div className="flex flex-wrap gap-2">
            {['✈️ Airport Check-in','🍽️ Ordering at Restaurant','🏨 Hotel Check-in','📞 Phone Calls','💊 At the Pharmacy','🎉 Making a Toast'].map(s=>(
              <span key={s} className="text-xs px-3 py-1 rounded-full" style={{background:'rgba(184,105,74,.08)',color:'var(--terra)'}}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <ScenarioPractice scenario={active} onClose={()=>setActive(null)} progress={progress} toggleMastered={toggleMastered} />
      )}
    </>
  )
}
