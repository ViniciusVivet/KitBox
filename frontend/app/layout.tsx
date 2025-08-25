import React from "react"
import { CartProvider } from "../components/cart/CartContext"
import CartButton from "../components/cart/CartButton"
import CartDrawer from "../components/cart/CartDrawer" // <<< import direto (client component)

export const metadata = {
  title: "KitBox",
  description: "Catálogo de produtos",
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

              <nav style={{display:"flex", gap:10}}>
                <a href="/" style={linkStyle}>Home</a>
                <a href="/login" style={linkStyle}>Entrar</a>
                <a href="/signup" style={linkStyle}>Cadastrar</a>
              </nav>

              <CartButton />
            </div>
          </header>

          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

const linkStyle: React.CSSProperties = {
  padding:"8px 12px",
  borderRadius:10,
  border:"1px solid rgba(255,255,255,.08)",
  color:"#e2e8f0",
  textDecoration:"none",
  background:"rgba(15,23,42,.4)"
}
