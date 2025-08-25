import React from "react"

type Props = {
  value: string
  onChange: (v: string) => void
  items: string[]
}
export default function CategoryTabs({ value, onChange, items }: Props) {
  return (
    <div id="categorias" className="container">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["", ...items].map(cat => {
          const active = value === cat
          const label = cat || "Todos"
          return (
            <button
              key={label}
              className={`pill ${active ? "pill-active" : ""}`}
              onClick={() => onChange(cat)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
