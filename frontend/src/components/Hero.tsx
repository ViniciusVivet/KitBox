import React from "react"

export default function Hero() {
  return (
    <section className="hero">
      <div className="container py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" /> novidades chegam toda semana
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Joias & acessórios com <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">vibe urbana</span>
            </h1>
            <p className="text-slate-600">
              Explore correntes, pingentes, anéis e muito mais. Qualidade, estilo e preço justo — tudo em um só lugar.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#produtos" className="btn">Explorar agora</a>
              <a href="#categorias" className="btn-alt">Categorias</a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
            <img
              alt="Chains"
              className="w-full h-[280px] md:h-[360px] object-cover"
              src="https://images.unsplash.com/photo-1617038260897-3c266f4f6b6a?q=80&w=1400&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
