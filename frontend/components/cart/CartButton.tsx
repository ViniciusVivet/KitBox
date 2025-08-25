"use client"

import { useCart } from "./CartContext"

export default function CartButton(){
  const { totalQty, setOpen } = useCart()
  return (
    <button
      onClick={() => setOpen(true)}
      style={{
        position:"relative", padding:"10px 14px", borderRadius:12,
        border:"1px solid rgba(255,255,255,.09)", background:"rgba(15,23,42,.5)",
        color:"#e2e8f0", cursor:"pointer"
      }}
      aria-label="Abrir carrinho"
    >
      🛒 Carrinho
      {totalQty > 0 && (
        <span style={{
          position:"absolute", top:-6, right:-6, background:"#22d3ee",
          color:"#0b1020", borderRadius:999, fontSize:12, padding:"2px 6px",
          fontWeight:700, border:"1px solid rgba(0,0,0,.2)"
        }}>{totalQty}</span>
      )}
    </button>
  )
}



