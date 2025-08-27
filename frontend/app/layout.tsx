import React from "react"
import Link from "next/link";
import { CartProvider } from "../components/cart/CartContext"
import CartButton from "../components/cart/CartButton"
// IMPORTAÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢O DIRETA (client component pode ser usado aqui)
import CartDrawer from "../components/cart/CartDrawer"
import AuthClient from "../components/auth/AuthClient"

export const metadata = {
  title: "KitBox",
  description: "CatÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡logo de produtos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{
        margin: 0,
        background: "linear-gradient(180deg,#0b1020,#0e132a 40%,#0b1020)",
        color: "#e2e8f0",
        fontFamily: "Inter, system-ui, Arial, sans-serif"
      }}>
<CartProvider>
          <header style={{
            position:"sticky", top:0, zIndex:20,
            background:"rgba(2,6,23,.7)", backdropFilter:"saturate(180%) blur(8px)",
            borderBottom:"1px solid rgba(255,255,255,.06)"
          }}>
            <div style={{maxWidth:1200, margin:"0 auto", padding:"12px 16px", display:"flex", alignItems:"center", gap:12, justifyContent:"space-between"}}>
              <a href="/" style={{display:"flex", alignItems:"center", gap:10, color:"#e2e8f0", textDecoration:"none"}}>
                <span style={{
                  width:32,height:32,borderRadius:10,
                  background:"conic-gradient(from 0deg,#22d3ee,#6366f1)",
                  boxShadow:"0 10px 30px rgba(99,102,241,.35), inset 0 0 30px rgba(34,211,238,.45)"
                }} />
                <strong>KitBox</strong>
              </a>

              <AuthClient />
              <div style={{display:"flex",alignItems:"center",gap:8}}>
  <CartButton />
  <Link
    href="/dashboard"
    title="Visão gerencial de estoque"
    aria-label="Abrir dashboard"
    style={{
      position:"relative",
      padding:"10px 14px",
      borderRadius:"12px",
      border:"1px solid rgba(255,255,255,.09)",
      background:"rgba(15,23,42,.5)",
      color:"#e2e8f0",
      cursor:"pointer",
      textDecoration:"none",
      display:"inline-flex",
      alignItems:"center",
      gap:"8px",
      marginLeft:"8px"
    }}
  >
    <span role="img" aria-hidden="true">📊</span>
    <span>Estoque de vendas</span>
  </Link>
</div>
            </div>
          </header>

          {children}
          {/* Render fixo, mas fechado por padrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o; abre ao clicar no botÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

