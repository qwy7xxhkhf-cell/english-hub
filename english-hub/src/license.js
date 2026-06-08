// ════════════════════════════════════════════════════════════
//  English Hub — 啟用碼 (方案 B：驗證喺 Supabase，綁定帳戶)
//  啟用碼清單而家存喺 Supabase 嘅 license_codes 表，
//  唔再放喺呢度（安全、單次使用、跨裝置）。
//  賣多個碼 → 去 Supabase SQL Editor 加：
//    insert into public.license_codes (code) values ('EH-XXXX-XXXX');
// ════════════════════════════════════════════════════════════
import { supabase } from './lib/supabase'

// ── 邊啲頁面要付費（premium）──────────────────────────────
export const PREMIUM_PAGES = ['study', 'phrasal', 'chunks', 'slang', 'islands', 'progress']

// ── 買啟用碼嘅連結（你嘅 Ko-fi / Etsy listing）──────────────
export const BUY_URL = 'https://ko-fi.com/mindtheenglish'   // ← 改成你嘅真實連結

// ── 驗證 + 啟用：call Supabase 嘅 redeem_code() ──────────────
//    回傳 { ok: boolean, message: string }
//    成功時：個碼喺 Supabase 標記為「由呢個帳戶用咗」+ 帳戶設為 premium
export async function activate(rawCode) {
  const code = (rawCode || '').trim()
  if (!code) return { ok: false, message: '請輸入啟用碼' }

  const { data, error } = await supabase.rpc('redeem_code', { p_code: code })
  if (error) return { ok: false, message: '啟用失敗，請檢查網絡後再試' }
  return data || { ok: false, message: '啟用失敗，請稍後再試' }
}
