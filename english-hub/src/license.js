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
  'EH-24YN-WF4F',
  'EH-2BCJ-YBNZ',
  'EH-4DJJ-TYVC',
  'EH-5PTM-NXVW',
  'EH-5UMF-UY2A',
  'EH-7CRS-5M9F',
  'EH-7D6W-9F92',
  'EH-7GW8-RQGN',
  'EH-82YF-QBJU',
  'EH-8MAX-7YSA',
  'EH-9968-EPNS',
  'EH-9N3F-D5V5',
  'EH-A3B5-BWD3',
  'EH-BAUG-HTPH',
  'EH-C6NE-DRB9',
  'EH-CZ97-CZ8J',
  'EH-D2VP-CE6Q',
  'EH-E36Z-U7TM',
  'EH-EPB5-8E95',
  'EH-EQYX-RP2S',
  'EH-EYEM-226Q',
  'EH-FVKS-EZW5',
  'EH-GZJN-253K',
  'EH-H5GR-3Y7U',
  'EH-HR7B-3U2Z',
  'EH-JMRQ-7GXX',
  'EH-JYNR-RC9A',
  'EH-KBCQ-K3ES',
  'EH-KHGJ-76VH',
  'EH-KMAR-M24W',
  'EH-KQFK-FNJM',
  'EH-NQYS-R2UR',
  'EH-PECM-EDJM',
  'EH-Q2EY-CZM9',
  'EH-QAXS-V4Z6',
  'EH-R367-4A3R',
  'EH-RBMV-FBT7',
  'EH-RNGX-F6AY',
  'EH-SQXJ-3M6R',
  'EH-V5SS-GZUN',
  'EH-V637-TF26',
  'EH-VRF2-FAUE',
  'EH-W778-FYWZ',
  'EH-X7DT-XA7V',
  'EH-XG62-DZ3Q',
  'EH-XG7X-9GK9',
  'EH-Y3QK-2RJU',
  'EH-Y4QG-M65U',
  'EH-YAMZ-PGD4',
  'EH-YRYG-7TVM',
  // 👉 賣多一個就加多一行
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
