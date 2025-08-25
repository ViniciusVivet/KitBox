import React from "react"
import { IconStar } from "./Icons"

type Product = {
  id: string
  name: string
  description?: string
  category: string
  price: number
  quantity: number
  createdAtUtc: string
}
type Props = {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const img = pickImage(product)
  const rating = (product.name.length % 5) + 1

  return (
    <div className="card overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img src={img} alt={product.name} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
          <span className="badge">{product.category}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className={i < rating ? "text-amber-400" : "text-slate-300"} />
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-lg font-bold">
              {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div className="text-xs text-slate-500">Estoque: {product.quantity}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn-alt" onClick={() => onEdit(product)}>Editar</button>
            <button className="btn-alt" onClick={() => onDelete(product.id)}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function pickImage(p: Product) {
  const q = encodeURIComponent(`${p.category} jewelry`)
  // imagens abertas do Unsplash para dev
  return `https://source.unsplash.com/640x480/?${q}`
}
