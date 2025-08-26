"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { auth, type AuthInfo } from "../../lib/auth"

export default function AuthClient(){
  const [info, setInfo] = useState<AuthInfo | null>(null)

  useEffect(() => { setInfo(auth.get()) }, [])

  function logout(){
    auth.clear()
    setInfo(null)
    // força refresh do header
    if (typeof window !== "undefined") window.location.href = "/"
  }

  if (!info) {
    return (
      <nav style={{display:"flex", gap:10}}>
        <a href="/login" style={linkStyle}>Entrar</a>
        <a href="/signup" style={{...linkStyle, background:"linear-gradient(90deg,#6366f1,#22d3ee)", border:"none", color:"#0b1020", fontWeight:700}}>Cadastrar</a>
      </nav>
    )
  }

  return (
    <div style={{display:"flex", alignItems:"center", gap:10}}>
      <span style={{opacity:.85}}>Olá, <strong>{info.name || info.email}</strong></span>
      <button onClick={logout} style={linkStyle}>Sair</button>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  padding:"8px 12px",
  borderRadius:10,
  border:"1px solid rgba(255,255,255,.08)",
  color:"#e2e8f0",
  textDecoration:"none",
  background:"rgba(15,23,42,.4)",
  cursor:"pointer"
}
