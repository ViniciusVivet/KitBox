import React from "react"

type Props = {
  open: boolean
  title?: string
  onClose?: () => void
  children: React.ReactNode
}

export default function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-xl card">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn-alt" onClick={onClose}>Fechar</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
