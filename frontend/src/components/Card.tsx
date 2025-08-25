import React from "react"

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}
export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-5 border-b border-slate-200">{children}</div>
}
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-5">{children}</div>
}
