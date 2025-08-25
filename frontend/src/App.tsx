import { useEffect, useMemo, useState } from "react"

type Product = {
  id: string
  name: string
  description?: string
  category: string
  price: number
  quantity: number
  createdAtUtc: string
}

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5238"

export default function App() {
  // Estado de lista
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 12

  // Filtros
  const [q, setQ] = useState("")
  const [category, setCategory] = useState("")

  // UI
  const [loading, setLoading] = useState(false)

  // URL de busca
  const listUrl = useMemo(() => {
    const u = new URL(API + "/products")
    u.searchParams.set("page", String(page))
    u.searchParams.set("pageSize", String(pageSize))
    if (q.trim()) u.searchParams.set("name", q.trim())
    if (category.trim()) u.searchParams.set("category", category.trim())
    return u.toString()
  }, [page, pageSize, q, category])

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch(listUrl)
      const data = await res.json()
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      // silencia para não travar a renderização
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUrl])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Categorias “fake” só para navegação rápida (pode adaptar às suas reais)
  const categories = ["acessorios", "Ice", "correntes", "anéis", "pulseiras", "colar"]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/70 header-blur">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <a className="inline-flex items-center gap-2" href="#">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold">K</div>
              <span className="text-xl font-semibold">KitBox</span>
            </a>

            {/* Busca grande */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  placeholder="Buscar produtos, categorias, etc."
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchList() }}
                />
                <button className="btn" onClick={() => { setPage(1); fetchList(); }}>
                  Buscar
                </button>
              </div>
            </div>

            {/* Ações (mock) */}
            <nav className="hidden md:flex items-center gap-2">
              <a className="btn-alt" href="#">Entrar</a>
              <a className="btn" href="#">Criar conta</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs border border-indigo-100">
                <span>Marketplace</span> <span>•</span> <span>Joias & Acessórios</span>
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
                Seu próximo brilho está aqui ✨
              </h1>
              <p className="mt-3 text-gray-600">
                Pesquise, compare e gerencie produtos em um só lugar. Interface rápida, limpa e pronta para demo.
              </p>
              <div className="mt-6 flex gap-3">
                <a className="btn" href="#produtos">Ver produtos</a>
                <button className="btn-alt" onClick={() => { setQ(""); setCategory(""); setPage(1); fetchList(); }}>
                  Limpar filtros
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">Conectado em: <strong>{API}</strong></p>
            </div>

            {/* “Banner” ilustrativo sem imagens externas */}
            <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="aspect-[16/10] w-full rounded-2xl prod-img grid place-items-center">
                <div className="text-center">
                  <div className="text-7xl">💎</div>
                  <p className="mt-2 text-gray-600">Coleções exclusivas, preços justos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de categorias */}
      <section className="border-y border-gray-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((c) => (
              <button
                key={c}
                className={"badge " + (category === c ? "!bg-indigo-100 !text-indigo-800" : "")}
                onClick={() => { setCategory(c === category ? "" : c); setPage(1); }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos */}
      <main id="produtos" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold">Produtos</h2>
            <p className="text-gray-500 text-sm">
              {loading ? "Carregando..." : `${total} item(ns)`}
            </p>
          </div>
          <div className="text-sm text-gray-500">Página {page} de {totalPages}</div>
        </div>

        {/* Grid */}
        {items.length === 0 && !loading && (
          <div className="card">
            <p className="text-gray-600">Nenhum produto encontrado.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <article key={p.id} className="prod">
              <div className="aspect-[4/3] prod-img" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium line-clamp-2">{p.name}</h3>
                  <span className="badge">{p.category}</span>
                </div>
                {p.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                  <button
                    className="btn-alt"
                    onClick={() => alert(`Qtd em estoque: ${p.quantity}`)}
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Paginação */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="btn-alt"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <button
            className="btn-alt"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Próxima
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} KitBox. Demo técnica.</p>
            <div className="flex items-center gap-3">
              <a className="hover:text-gray-700" href="#">Sobre</a>
              <a className="hover:text-gray-700" href="#">Contato</a>
              <a className="hover:text-gray-700" href="#">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
