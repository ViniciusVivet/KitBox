"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
  imageUrl?: string
}

type CartContextValue = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  remove: (id: string) => void
  clear: () => void
  totalQty: number
  totalPrice: number
  open: boolean
  setOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const KEY = "kitbox_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  function add(item: Omit<CartItem, "qty">, qty: number = 1) {
    setItems(prev => {
      const i = prev.findIndex(x => x.id === item.id)
      if (i >= 0) {
        const copy = [...prev]
        copy[i] = { ...copy[i], qty: copy[i].qty + qty }
        return copy
      }
      return [...prev, { ...item, qty }]
    })
    // Removido: setOpen(true)  -> agora o carrinho só abre pelo botão/ícone
  }
  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }
  function clear() {
    setItems([])
  }

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items])

  const value: CartContextValue = { items, add, remove, clear, totalQty, totalPrice, open, setOpen }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>")
  return ctx
}
