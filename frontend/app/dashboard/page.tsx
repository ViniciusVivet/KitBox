"use client";

import React from "react";

/** ==== Pequena lib de gráfico de pizza (SVG) sem depender de libs ==== */
function PieChart({
  data,
  size = 260,
  stroke = 0
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  stroke?: number;
}) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const R = size / 2;
  const CX = R, CY = R;

  let acc = 0;
  const toXY = (pct: number) => {
    const ang = 2 * Math.PI * pct - Math.PI / 2; // começa no topo
    return { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {data.map((d, i) => {
          const start = acc / total;
          acc += d.value;
          const end = acc / total;

          // arco grande?
          const largeArc = end - start > 0.5 ? 1 : 0;

          // pontos
          const P0 = toXY(start);
          const P1 = toXY(end);

          // path (setor)
          const dPath = [
            `M ${CX} ${CY}`,
            `L ${P0.x} ${P0.y}`,
            `A ${R} ${R} 0 ${largeArc} 1 ${P1.x} ${P1.y}`,
            "Z"
          ].join(" ");

          return (
            <path
              key={i}
              d={dPath}
              fill={d.color}
              stroke={stroke ? "#0f172a" : "none"}
              strokeWidth={stroke}
            />
          );
        })}
      </svg>

      {/* Legenda */}
      <div>
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: d.color, display: "inline-block" }} />
              <span style={{ color: "#e2e8f0" }}>
                {d.label} <span style={{ color: "#94a3b8" }}>({d.value} • {pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // ===== MOCKS (depois plugamos nas rotas da API) =====
  const resumo = {
    produtosEmEstoque: 128,
    vendasMes: "R$ 12.430",
    esgotados: 5
  };

  const categorias = [
    { nome: "Aros",      qtd: 12,  color: "#38bdf8" },
    { nome: "Colares",   qtd: 24,  color: "#22d3ee" },
    { nome: "Pulseiras", qtd: 18,  color: "#a78bfa" },
    { nome: "Brincos",   qtd: 9,   color: "#f472b6" },
    { nome: "Anéis",     qtd: 22,  color: "#34d399" },
    { nome: "Diversos",  qtd: 7,   color: "#fbbf24" }
  ];
  const totalCat = categorias.reduce((acc, c) => acc + c.qtd, 0);

  const baixoEstoque = [
    { n: "Colar Dourado",  c: "Colares",   q: 3, p: "R$ 150" },
    { n: "Pulseira Prata", c: "Pulseiras", q: 4, p: "R$ 120" },
    { n: "Argola Média",   c: "Brincos",   q: 5, p: "R$ 90"  },
    { n: "Anel Fino",      c: "Anéis",     q: 6, p: "R$ 80"  },
    { n: "Argola Grande",  c: "Brincos",   q: 7, p: "R$ 110" }
  ];

  // ===== Estilos inline de “bolsas/cards” + centralização dura =====
  const center: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
  const h2Style: React.CSSProperties = { textAlign: "center", margin: 0, color: "#e2e8f0", fontSize: 20, fontWeight: 700 };

  const cardShell: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,.15)",
    background: "rgba(2,6,23,.55)",
    backdropFilter: "saturate(160%) blur(8px)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,.25)"
  };

  const smallCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,.12)",
    background: "rgba(2,6,23,.35)",
    borderRadius: 12,
    padding: 16,
    textAlign: "center"
  };

  const subtle: React.CSSProperties = { color: "#94a3b8", fontSize: 12, marginTop: 6 };
  const bigNumber = (color: string): React.CSSProperties => ({
    color,
    fontSize: 34,
    fontWeight: 800,
    marginTop: 6
  });

  const grid = (cols: number, gap = 16): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0b1020,#0e132a 40%,#0b1020)", color: "#e2e8f0" }}>
      {/* Título */}
      <header style={{ borderBottom: "1px solid rgba(148,163,184,.12)", background: "rgba(2,6,23,.6)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ ...center, padding: "18px 24px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>📊 Estoque de Vendas</h1>
          <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>Painel gerencial</div>
        </div>
      </header>

      {/* ===== BLOCO 1 — Resumo (em cards) ===== */}
      <section style={{ ...center, padding: "24px 24px 16px" }}>
        <div style={cardShell}>
          <h2 style={h2Style}>Resumo</h2>
          <div style={{ height: 16 }} />

          <div style={grid(3, 16)}>
            <article style={smallCard}>
              <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>Produtos em estoque</div>
              <div style={bigNumber("#34d399")}>{resumo.produtosEmEstoque}</div>
              <div style={subtle}>Atualizado há 2h</div>
            </article>

            <article style={smallCard}>
              <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>Vendas do mês</div>
              <div style={bigNumber("#38bdf8")}>{resumo.vendasMes}</div>
              <div style={subtle}>+18% vs mês anterior</div>
            </article>

            <article style={smallCard}>
              <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>Itens esgotados</div>
              <div style={bigNumber("#f472b6")}>{resumo.esgotados}</div>
              <div style={subtle}>Repor com urgência</div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== BLOCO 2 — Produtos por categoria (cards lado a lado + pizza) ===== */}
      <section style={{ ...center, padding: "8px 24px 16px" }}>
        <div style={cardShell}>
          <h2 style={h2Style}>Produtos por categoria</h2>
          <div style={{ height: 16 }} />

          {/* Grid de cards lado a lado */}
          <div style={grid(3, 16)}>
            {categorias.map((c) => {
              const pct = totalCat ? Math.round((c.qtd / totalCat) * 100) : 0;
              return (
                <div key={c.nome} style={{ ...smallCard, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>{c.nome}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>{pct}%</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{c.qtd}</div>
                  <div style={{ height: 8 }} />
                  <div style={{ width: "100%", height: 8, background: "rgba(148,163,184,.15)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: 8, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ height: 24 }} />

          {/* Pizza */}
          <PieChart
            data={categorias.map((c) => ({ label: c.nome, value: c.qtd, color: c.color }))}
            size={260}
            stroke={0}
          />

          <div style={{ marginTop: 10, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
            * Dados de exemplo — em seguida conectamos aos endpoints da API.
          </div>
        </div>
      </section>

      {/* ===== BLOCO 3 — Baixo estoque (tabela dentro de card) ===== */}
      <section style={{ ...center, padding: "8px 24px 32px" }}>
        <div style={cardShell}>
          <h2 style={h2Style}>Baixo estoque (top 10)</h2>
          <div style={{ height: 16 }} />

          <div style={{
            border: "1px solid rgba(148,163,184,.15)",
            borderRadius: 12,
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "separate" }}>
              <thead style={{ background: "rgba(30,41,59,.7)", color: "#cbd5e1" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 14px" }}>Produto</th>
                  <th style={{ textAlign: "left", padding: "12px 14px" }}>Categoria</th>
                  <th style={{ textAlign: "right", padding: "12px 14px" }}>Qtd</th>
                  <th style={{ textAlign: "right", padding: "12px 14px" }}>Preço</th>
                </tr>
              </thead>
              <tbody>
                {baixoEstoque.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(148,163,184,.12)", background: i % 2 ? "rgba(2,6,23,.35)" : "transparent" }}>
                    <td style={{ padding: "10px 14px" }}>{r.n}</td>
                    <td style={{ padding: "10px 14px" }}>{r.c}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{r.q}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{r.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
            * Exemplo — depois filtramos por quantidade &le; 10 na API.
          </div>
        </div>
      </section>

      <footer style={{ ...center, padding: "0 24px 36px", textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
        KitBox • Dashboard • v0.4
      </footer>
    </main>
  );
}