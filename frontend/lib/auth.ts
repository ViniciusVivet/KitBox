export type AuthInfo = { token: string; email: string; name?: string }

const KEY = "kb_auth"

export const auth = {
  get(): AuthInfo | null {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null } catch { return null }
  },
  set(v: AuthInfo) {
    try { localStorage.setItem(KEY, JSON.stringify(v)) } catch {}
  },
  clear() {
    try { localStorage.removeItem(KEY) } catch {}
  }
}

export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5238"
