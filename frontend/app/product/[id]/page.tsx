import getProduct from "../../../lib/get-product"
import ProductActions from "./product-actions"

function fmtBRL(v: number){
  try { return v.toLocaleString("pt-BR",{style:"currency", currency:"BRL"}) } catch { return `R$ ${v}` }
}

export default async function Page({ params }: { params: { id: string } }){
  const product = await getProduct(params.id)
  if (!product) {
    return <div style={{maxWidth:1000, margin:"40px auto", padding:"16px"}}>Produto não encontrado.</div>
  }
  return (
    <div style={{maxWidth:1000, margin:"40px auto", padding:"16px", display:"grid", gap:20, gridTemplateColumns:"1fr 1.1fr"}}>
      <div>
        <img src={product.imageUrl ?? "/placeholder.svg"} alt={product.name} style={{width:"100%", borderRadius:14, border:"1px solid rgba(255,255,255,.08)"}} />
      </div>
      <div style={{border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:16, background:"rgba(15,23,42,.6)"}}>
        <h1 style={{marginTop:0}}>{product.name}</h1>
        <div style={{color:"#94a3b8", marginBottom:12}}>{product.description || "-"}</div>
        <div style={{fontSize:24, fontWeight:800, marginBottom:16}}>{fmtBRL(product.price.value)}</div>
        <ProductActions product={product} />
      </div>
    </div>
  )
}
