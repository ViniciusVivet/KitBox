import React from "react"

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200">
      <div className="container py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} KitBox — todos os direitos reservados.</div>
        <div className="flex items-center gap-4">
          <a className="hover:underline" href="#">Privacidade</a>
          <a className="hover:underline" href="#">Termos</a>
          <a className="hover:underline" href="#">Contato</a>
        </div>
      </div>
    </footer>
  )
}
