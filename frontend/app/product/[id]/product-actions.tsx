"use client"

import { useCart } from "../../../components/cart/CartContext"

export default function ProductActions({ product }: { product: { id:string, name:string, price:{value:number}, imageUrl?:string } }){
  const { add } = useCart()
  return (
    <button
      onClick={() => add({ id: product.id, name: product.name, price: product.price.value, imageUrl: product.imageUrl }, 1)}
      style={{
        padding:"12px 14px", borderRadius:12, border:"none", cursor:"pointer",
        color:"#0b1020", fontWeight:700, background:"linear-gradient(90deg,#6366f1,#22d3ee)"
      }}
    >
      Adicionar ao carrinho
    </button>
  )
}
