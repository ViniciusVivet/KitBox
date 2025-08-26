"use client"

import { useCart } from "./CartContext"
import { useEffect } from "react"

function fmtBRL(v:number){
  try{ return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) }catch{ return `R$ ${v}` }
}

export default function CartDrawer(){
  const { open, setOpen, items, totalPrice, remove, clear } = useCart()

  // Fecha com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent){ if (e.key === "Escape") setOpen(false) }
    if (open) {
      window.addEventListener("keydown", onKey)
      return () => window.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen])

  return (
    <div
      style={{
        position:"fixed", inset:0, zIndex:50,
        pointerEvents: open ? "auto" : "none"
      }}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div
        onClick={()=>setOpen(false)}
        style={{
          position:"absolute", inset:0,
          background:"rgba(0,0,0,.5)",
          opacity: open ? 1 : 0,
          transition:"opacity .25s ease"
        }}
      />
      {/* painel */}
      <aside
        role="dialog"
        aria-modal="true"
        style={{
          position:"absolute", right:0, top:0, bottom:0,
          width:360, maxWidth:"85vw",
          background:"linear-gradient(180deg,rgba(15,23,42,.95),rgba(2,6,23,.95))",
          borderLeft:"1px solid rgba(255,255,255,.08)",
          boxShadow:"-12px 0 40px rgba(0,0,0,.35)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          opacity: open ? 1 : 0,
          transition:"transform .25s ease, opacity .25s ease"
        }}
      >
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <strong>Carrinho</strong>
          <button onClick={()=>setOpen(false)} style={{ background:"transparent", color:"#94a3b8", border:"none", cursor:"pointer", fontSize:18, lineHeight:1 }} aria-label="Fechar carrinho">×</button>
        </div>

        <div style={{padding:16, display:"grid", gap:12, maxHeight:"calc(100% - 150px)", overflow:"auto"}}>
          {items.length===0 ? (
            <p style={{color:"#94a3b8"}}>Seu carrinho está vazio.</p>
          ): items.map(it=>(
            <div key={it.id} style={{display:"grid", gridTemplateColumns:"72px 1fr auto", gap:10, alignItems:"center", border:"1px solid rgba(255,255,255,.08)", padding:8, borderRadius:12}}>
              <img src={it.imageUrl ?? "/placeholder.svg"} alt={it.name} style={{width:72, height:52, objectFit:"cover", borderRadius:8}} />
              <div>
                <div style={{fontWeight:600}}>{it.name}</div>
                <div style={{fontSize:12, color:"#94a3b8"}}>Qtd: {it.qty}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700}}>{fmtBRL(it.price*it.qty)}</div>
                <button onClick={()=>remove(it.id)} style={{border:"none", background:"transparent", color:"#94a3b8", cursor:"pointer", fontSize:12, marginTop:6}}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:16, borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
            <span style={{color:"#94a3b8"}}>Total</span>
            <strong>{fmtBRL(totalPrice)}</strong>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={clear} style={{flex:1, padding:"10px 12px", borderRadius:12, border:"1px solid rgba(255,255,255,.12)", background:"rgba(15,23,42,.5)", color:"#e2e8f0"}}>Limpar</button>
            <button style={{flex:1, padding:"10px 12px", borderRadius:12, border:"none", color:"#0b1020", fontWeight:700,
              background:"linear-gradient(90deg,#6366f1,#22d3ee)"}}>Finalizar</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
