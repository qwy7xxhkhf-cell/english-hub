import { BUY_URL } from '../license'

export function SettingsModal({ open, onClose, user, activated, onActivate, onSignOut }) {
  if (!open) return null

  const Row = ({ children }) => (
    <div className="rounded-2xl p-4 mb-3" style={{ background:'white', border:'1px solid rgba(61,53,48,.07)' }}>
      {children}
    </div>
  )

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background:'rgba(45,40,36,.45)', backdropFilter:'blur(3px)' }} />
      <div className="relative w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 pb-8"
        style={{ background:'var(--cream)', boxShadow:'0 -12px 50px rgba(0,0,0,.22)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color:'var(--deep)', fontFamily:'Georgia,serif' }}>⚙️ 設定</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color:'var(--sub)' }}>×</button>
        </div>

        {/* Account */}
        <Row>
          <div className="text-xs font-semibold mb-1" style={{ color:'var(--sub)' }}>帳戶</div>
          <div className="text-sm font-medium break-all" style={{ color:'var(--deep)' }}>
            {user?.email || user?.name || user?.id || '已登入'}
          </div>
        </Row>

        {/* Activation */}
        <Row>
          <div className="text-xs font-semibold mb-2" style={{ color:'var(--sub)' }}>啟用狀態</div>
          <div className="text-sm font-medium mb-3" style={{ color: activated ? 'var(--sage)' : 'var(--terra)' }}>
            {activated ? '✅ 已啟用 — 已解鎖全部內容' : '🔑 未啟用 — 只可用免費內容'}
          </div>
          <button onClick={() => { onClose?.(); onActivate?.() }}
            className="w-full rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95"
            style={{ background:'var(--deep)', color:'white' }}>
            {activated ? '重新輸入啟用碼' : '輸入啟用碼'}
          </button>
          {activated && (
            <div className="text-xs mt-2 text-center" style={{ color:'var(--sub)' }}>
              已綁定你嘅帳戶，任何裝置登入都會自動解鎖
            </div>
          )}
          {!activated && (
            <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
              className="block text-center text-xs mt-2 underline" style={{ color:'var(--terra)' }}>
              仲未有啟用碼？按此購買 →
            </a>
          )}
        </Row>

        {/* About */}
        <Row>
          <div className="text-xs font-semibold mb-1" style={{ color:'var(--sub)' }}>關於</div>
          <div className="text-sm" style={{ color:'var(--deep)' }}>English Hub</div>
          <div className="text-xs mt-0.5" style={{ color:'var(--sub)' }}>softmark_2026 · v1.0</div>
        </Row>

        <button onClick={onSignOut}
          className="w-full rounded-xl py-2.5 text-sm font-medium mt-1"
          style={{ background:'rgba(184,105,74,.1)', color:'var(--terra)', border:'1px solid rgba(184,105,74,.2)' }}>
          登出帳戶
        </button>
      </div>
    </div>
  )
}
