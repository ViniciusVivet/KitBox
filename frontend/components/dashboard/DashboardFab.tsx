"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardFab() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    try { setLogged(!!localStorage.getItem("token")); } catch {}
  }, []);

  if (!logged) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 120, // ajuste a distância do carrinho se quiser
        zIndex: 9999
      }}
    >
      <Link
        href="/dashboard"
        title="Visão gerencial de estoque"
        aria-label="Abrir dashboard"
        style={{
          position: "relative",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,.09)",
          background: "rgba(15,23,42,.5)",
          color: "#e2e8f0",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span role="img" aria-hidden="true">📊</span>
        <span>Estoque de vendas</span>
      </Link>
    </div>
  );
}