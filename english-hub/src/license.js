// ════════════════════════════════════════════════════════════
//  English Hub — 啟用碼 (Activation / License) 系統
//  改呢個檔案就可以調整：邊啲內容收費、邊度買、有效嘅啟用碼
// ════════════════════════════════════════════════════════════

// ── 1) 邊啲頁面要付費（premium）──────────────────────────────
//    冇啟用碼嘅用戶，入呢啲頁會見到 Paywall。
//    想免費就由呢度刪走；想加鎖就加返。
export const PREMIUM_PAGES = ['study', 'phrasal', 'chunks', 'slang', 'islands', 'progress']

// ── 2) 買啟用碼嘅連結（你嘅 Ko-fi / Etsy listing）──────────────
export const BUY_URL = 'https://ko-fi.com/softmark2026'   // ← 改成你嘅真實連結

// ── 3) 有效啟用碼清單（手動模式 · 今日就用得）───────────────────
//    買家畀錢後，你喺 Ko-fi/Etsy 手動 message 一個碼畀佢。
//    理想做法：一個買家一個碼，賣出就喺度加多行。
//    大小寫唔分（系統會自動轉大寫比對）。
const VALID_CODES = [
  'EH-EARLYBIRD-2026',
  'EH-WELCOME-92QD',
  'EH-THANKS-8F3K',
  'EH-SOFTMARK-7K2P',
  'EH-HELLO-4M9X',
  // 👉 賣多一個就加多一行，例如：'EH-A1B2-C3D4',
]

const KEY = 'eh_license_v1'

// ── 狀態讀取 ──────────────────────────────────────────────
export function getLicense() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}
export function isActivated() {
  return !!getLicense()?.code
}
export function deactivate() {
  localStorage.removeItem(KEY)
}

// ── 驗證 + 啟用 ───────────────────────────────────────────
//    回傳 { ok: boolean, message: string }
export async function activate(rawCode) {
  const code = (rawCode || '').trim().toUpperCase()
  if (!code) return { ok: false, message: '請輸入啟用碼' }

  // ===== 模式 A：手動碼清單（目前使用）=====
  let valid = VALID_CODES.map(c => c.toUpperCase()).includes(code)

  // ===== 模式 B：Lemon Squeezy 自動驗證（之後想自助賣就解除註解）=====
  //   買家喺 Lemon Squeezy 付款 → 自動收到唯一 license key → 喺度輸入。
  //   （Lemon Squeezy 驗證係公開 endpoint，前端可直接 call。）
  // try {
  //   const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
  //     method: 'POST',
  //     headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams({ license_key: code }),
  //   })
  //   const data = await res.json()
  //   valid = data?.valid === true
  // } catch { valid = false }

  if (!valid) return { ok: false, message: '啟用碼無效，請檢查後再試' }

  localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }))
  return { ok: true, message: '啟用成功 🎉 已解鎖全部內容' }
}
