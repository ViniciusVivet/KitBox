"use client"

import { FormEvent, useState } from "react"
import { API, auth } from "../../lib/auth"

export default function Page(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent){
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const j = await res.json().catch(()=>null)
        throw new Error(j?.message || "Falha no login")
      }
      const data = await res.json()
      if (!data?.token) throw new Error("Token não recebido")
      auth.set({ token: data.token, email: data.email, name: data.name })
      window.location.href = "/"
    } catch (err:any) {
      setError(err.message || "Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:"20px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(15,23,42,.6)"}}>
      <h1 style={{marginTop:0}}>Entrar</h1>
      {error && <div style={{marginBottom:10, color:"#fecaca"}}>{error}</div>}
      <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
               style={input}/>
        <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)}
               style={input}/>
        <button disabled={loading} style={btn}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  )
}

const input: React.CSSProperties = {
  padding:"12px", borderRadius:10, border:"1px solid rgba(255,255,255,.12)",
  background:"rgba(15,23,42,.5)", color:"#e2e8f0", outline:"none"
}
const btn: React.CSSProperties = {
  padding:"12px", borderRadius:10, border:"none", cursor:"pointer",
  color:"#0b1020", fontWeight:700, background:"linear-gradient(90deg,#6366f1,#22d3ee)"
}
