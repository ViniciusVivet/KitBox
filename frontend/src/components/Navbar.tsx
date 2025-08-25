import React from "react"
import { IconCart, IconHeart, IconSearch, IconUser } from "./Icons"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  onNewProduct: () => void
}

export default function Navbar({ search, onSearchChange, onNewProduct }: Props) {
  return (
    <nav className="navbar">
      <div className="container py-3 flex items-center gap-4">
        <a className="flex items-center gap-2 select-none" href="#">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 grid place-items-center text-white font-extrabold">K</div>
          <span className="font-bold tracking-tight">KitBox</span>
        </a>

        <div className="flex-1">
          <div className="relative">
            <input
              className="input rounded-2xl pl-11"
              placeholder="Buscar produtos (ex.: corrente, pingente, anel...)"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="btn-alt" title="Favoritos"><IconHeart/></button>
          <button className="btn-alt" title="Carrinho"><IconCart/></button>
          <button className="btn-alt" title="Perfil"><IconUser/></button>
          <button className="btn" onClick={onNewProduct}>+ Novo</button>
        </div>
      </div>
    </nav>
  )
}
