"use client"

import { useCart } from "./cart/CartContext"

type P = {
  id: string
  name: string
  description?: string
  path: string
  imageUrl?: string
  price: { value:number, currencyCode:string }
}

function fmtBRL(v: number){
  try { return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) } catch { return `R$ ${v}` }
}

export default function ProductsGrid({ products }: { products: P[] }){
  const { add } = useCart()
  return (
    <div className="products">
      {products.map(p=>(
        <div key={p.id} className="card">
          <a href={p.path}>
            <img className="thumb" src={p.imageUrl ?? "/placeholder.svg"} alt={p.name} />
          </a>
          <div className="content">
            <h3 className="title">{p.name}</h3>
            <p className="desc">{p.description || "-"}</p>
            <div className="meta">
              <span className="badge">Novo</span>
              <span className="price">{fmtBRL(p.price.value)}</span>
            </div>
            <div style={{marginTop:10, display:"flex", gap:8}}>
              <a href={p.path} style={{
                flex:1, textAlign:"center", padding:"10px 12px", borderRadius:12,
                border:"1px solid rgba(255,255,255,.12)", color:"#e2e8f0", textDecoration:"none",
                background:"rgba(15,23,42,.5)"
              }}>Detalhes</a>
              <button onClick={() => add({ id:p.id, name:p.name, price:p.price.value, imageUrl:p.imageUrl }, 1)} style={{
                flex:1, padding:"10px 12px", borderRadius:12, border:"none", color:"#0b1020", fontWeight:700,
                background:"linear-gradient(90deg,#6366f1,#22d3ee)", cursor:"pointer"
              }}>Adicionar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
