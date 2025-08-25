export default function Page(){
  return (
    <div style={{maxWidth:420, margin:"40px auto", padding:"20px", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, background:"rgba(15,23,42,.6)"}}>
      <h1 style={{marginTop:0}}>Cadastrar</h1>
      <p style={{color:"#94a3b8"}}>Tela demonstrativa. Integração real pode ser feita depois.</p>
      <form style={{display:"grid", gap:10}}>
        <input placeholder="Nome" style={input}/>
        <input placeholder="Email" style={input}/>
        <input type="password" placeholder="Senha" style={input}/>
        <button style={btn}>Criar conta</button>
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
