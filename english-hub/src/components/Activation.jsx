import { useState } from 'react'
import { activate, BUY_URL } from '../license'

// ── 輸入啟用碼彈窗 ──────────────────────────────────────────
export function ActivationModal({ open, onClose, onActivated }) {
  const [code, setCode]     = useState('')
  const [status, setStatus] = useState(null)   // { ok, message }
  const [busy, setBusy]     = useState(false)

  if (!open) return null

  const submit = async () => {
    if (busy) return
    setBusy(true); setStatus(null)
    const r = await activate(code)
    setStatus(r); setBusy(false)
    if (r.ok) { onActivated?.(); setTimeout(() => onClose?.(), 1000) }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(45,40,36,.45)', backdropFilter: 'blur(3px)' }} />
      <div className="relative w-full max-w-sm rounded-3xl p-6"
        style={{ background: 'var(--cream)', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🔑</div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--deep)', fontFamily: 'Georgia,serif' }}>輸入啟用碼</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--sub)' }}>解鎖全部進階內容</p>
        </div>

        <input
          value={code}
          onChange={e => { setCode(e.target.value); setStatus(null) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="例如 EH-XXXX-XXXX"
          autoFocus
          className="w-full text-center tracking-wider rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2"
          style={{ background: 'white', border: '1px solid rgba(61,53,48,.12)', color: 'var(--deep)' }}
        />

        {status && (
          <div className="text-sm text-center mt-3 font-medium"
            style={{ color: status.ok ? 'var(--sage)' : 'var(--terra)' }}>
            {status.message}
          </div>
        )}

        <button onClick={submit} disabled={busy}
          className="w-full mt-4 rounded-xl py-3 text-sm font-bold transition-all active:scale-95 disabled:opacity-60"
          style={{ background: 'var(--deep)', color: 'white' }}>
          {busy ? '驗證中…' : '啟用'}
        </button>

        <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
          className="block text-center text-xs mt-4 font-medium underline"
          style={{ color: 'var(--terra)' }}>
          仲未有啟用碼？按此購買 →
        </a>

        <button onClick={onClose}
          className="block w-full text-center text-xs mt-2" style={{ color: 'var(--sub)' }}>
          稍後再說
        </button>
      </div>
    </div>
  )
}

// ── 付費內容上鎖畫面 ────────────────────────────────────────
export function Paywall({ title, onUnlock }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
        style={{ background: 'var(--card-4, #efe2d2)' }}>🔒</div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--deep)', fontFamily: 'Georgia,serif' }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--sub)' }}>
        呢個係付費內容。輸入啟用碼即可<strong>永久解鎖</strong> Phrasal Verbs、Chunks、Island Sentences、Slang 同 Progress 等全部進階功能。
      </p>
      <button onClick={onUnlock}
        className="w-full max-w-xs rounded-xl py-3 text-sm font-bold transition-all active:scale-95 mb-3"
        style={{ background: 'var(--deep)', color: 'white' }}>
        🔑 我有啟用碼
      </button>
      <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
        className="w-full max-w-xs rounded-xl py-3 text-sm font-bold transition-all active:scale-95 text-center"
        style={{ background: 'white', border: '1px solid rgba(61,53,48,.12)', color: 'var(--terra)' }}>
        🛒 購買啟用碼
      </a>
      <p className="text-xs mt-5" style={{ color: 'var(--sub)' }}>
        免費版可使用：Home · Study · Vocabulary · Scenario · Tracker
      </p>
    </div>
  )
}
