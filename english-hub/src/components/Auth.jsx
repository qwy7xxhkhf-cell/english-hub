import { useState } from 'react'

export default function Auth({ signIn, signUp }) {
  const [mode,  setMode]  = useState('login')
  const [email, setEmail] = useState('')
  const [pw,    setPw]    = useState('')
  const [err,   setErr]   = useState('')
  const [ok,    setOk]    = useState('')
  const [busy,  setBusy]  = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr(''); setOk('')
    const { error } = mode === 'login' ? await signIn(email, pw) : await signUp(email, pw)
    setBusy(false)
    if (error) setErr(error.message)
    else if (mode === 'signup') setOk('✅ 確認郵件已發送，請查收信箱！')
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-stone-800" style={{fontFamily:'Georgia,serif'}}>English Hub</h1>
          <p className="text-stone-500 text-sm mt-1">你的英語學習空間</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <div className="flex gap-2 mb-6">
            {['login','signup'].map(m => (
              <button key={m} onClick={()=>{setMode(m);setErr('');setOk('')}}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode===m?'bg-emerald-800 text-white':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {m==='login'?'登入':'建立帳號'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1.5">密碼</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required minLength={6}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="至少6個字" />
            </div>
            {err && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
            {ok  && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{ok}</p>}
            <button type="submit" disabled={busy}
              className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
              {busy ? '請等等...' : mode==='login' ? '登入' : '建立帳號'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
