import { useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { Navbar, Button, Badge } from "flowbite-react"
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon
} from "@heroicons/react/24/outline"

type Product = {
  id: string
  name: string
  description?: string
  category: string
  price: number
  quantity: number
  createdAtUtc: string
}

type ValidationError = { PropertyName: string; ErrorMessage: string }

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5238"

export default function App() {
  // listagem / paginação / ordenação
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [sortBy, setSortBy] =
    useState<"name" | "category" | "price" | "quantity" | "createdAtUtc">("createdAtUtc")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(false)

  // filtros
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")

  // form (CRUD inline simples)
  const empty = { name: "", description: "", category: "", price: 0, quantity: 0 }
  const [form, setForm] = useState({ ...empty })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // erros
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  // monta URL de listagem
  const listUrl = useMemo(() => {
    const u = new URL(API + "/products")
    u.searchParams.set("page", String(page))
    u.searchParams.set("pageSize", String(pageSize))
    u.searchParams.set("sortBy", sortBy)
    u.searchParams.set("sortDir", sortDir)
    if (name.trim()) u.searchParams.set("name", name.trim())
    if (category.trim()) u.searchParams.set("category", category.trim())
    return u.toString()
  }, [page, pageSize, name, category, sortBy, sortDir])

  async function fetchList() {
    setLoading(true)
    setGlobalError(null)
    try {
      const res = await fetch(listUrl)
      const data = await res.json()
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setGlobalError("Falha ao carregar produtos.")
    } finally {
      setLoading(false)
    }
  }

  // debounce filtros
  const debounceRef = useRef<number | null>(null)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      setPage(1)
      fetchList()
    }, 350)
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, category, sortBy, sortDir])

  useEffect(() => { fetchList() }, []) // initial

  function clearErrorsFor(field: keyof typeof form) {
    if (fieldErrors[field]) {
      const copy = { ...fieldErrors }
      delete copy[field]
      setFieldErrors(copy)
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)
    setFieldErrors({})
    setSaving(true)

    const body = JSON.stringify(form)
    const headers = { "Content-Type": "application/json; charset=utf-8" }

    try {
      let res: Response
      if (editingId) {
        res = await fetch(`${API}/products/${editingId}`, { method: "PUT", headers, body })
      } else {
        res = await fetch(`${API}/products`, { method: "POST", headers, body })
      }

      if (!res.ok) {
        if (res.status === 400) {
          const errs: ValidationError[] = await res.json()
          const map: Record<string, string[]> = {}
          errs.forEach(e => {
            const key = normalizeProp(e.PropertyName)
            if (!map[key]) map[key] = []
            map[key].push(e.ErrorMessage)
          })
          setFieldErrors(map)
          toast.error("Revise os campos destacados.")
        } else {
          setGlobalError("Erro ao salvar. Tente novamente.")
          toast.error("Erro ao salvar produto.")
        }
        return
      }

      setForm({ ...empty })
      setEditingId(null)
      toast.success(editingId ? "Produto atualizado!" : "Produto criado!")
      fetchList()
    } catch {
      setGlobalError("Erro de rede ao salvar.")
      toast.error("Erro de rede.")
    } finally {
      setSaving(false)
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description ?? "",
      category: p.category,
      price: p.price,
      quantity: p.quantity,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function remove(id: string) {
    if (!confirm("Excluir este produto?")) return
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Produto excluído.")
      fetchList()
    } else {
      toast.error("Falha ao excluir.")
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  function toggleSort(by: typeof sortBy) {
    if (sortBy === by) setSortDir(d => (d === "asc" ? "desc" : "asc"))
    else { setSortBy(by); setSortDir("asc") }
  }

  // imagem “fake” bonita só pra ter cara de marketplace
  const imageFor = (p: Product) =>
    `https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&mark=${encodeURIComponent(p.category)}`
  
  return (
    <div className="min-h-dvh bg-gray-50">
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <Navbar fluid rounded className="border-b">
        <Navbar.Brand href="#">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-500 to-neon mr-2" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            KitBox
          </span>
        </Navbar.Brand>

        <div className="flex-1 px-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="Buscar produtos, marcas e mais…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Button color="light"><HeartIcon className="h-5 w-5" /></Button>
          <Button color="light" className="relative">
            <ShoppingCartIcon className="h-5 w-5" />
            <Badge color="info" className="absolute -top-2 -right-2">0</Badge>
          </Button>
          <Button color="light"><UserIcon className="h-5 w-5" /></Button>
        </div>
      </Navbar>

      {/* HERO */}
      <section className="bg-hero-gradient">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white/70 backdrop-blur border p-6 md:p-10 shadow">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Encontre o acessório perfeito com <span className="text-brand-600">um clique</span>.
            </h1>
            <p className="text-gray-600 mt-2">
              Colares, pulseiras, anéis e mais — organizado e rápido.
            </p>

            {/* filtros rápidos */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["acessorios", "Ice", "ouro", "prata"].map(c => (
                <button
                  key={c}
                  className={"px-3 py-1.5 rounded-full text-sm border " +
                    (category === c ? "bg-brand-600 text-white border-brand-600"
                                    : "bg-white hover:bg-gray-50")}
                  onClick={() => setCategory(category === c ? "" : c)}
                >
                  {c}
                </button>
              ))}
              {category && (
                <button className="px-3 py-1.5 rounded-full text-sm border bg-white" onClick={() => setCategory("")}>
                  Limpar categoria
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LISTA + CONTROLES */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <p className="text-sm text-gray-600">
            {loading ? "Carregando…" : `${total} produto(s) encontrados`}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Ordenar:</span>
            <select
              className="input border-gray-300 rounded-lg px-3 py-2"
              value={`${sortBy}:${sortDir}`}
              onChange={(e) => {
                const [by, dir] = e.target.value.split(":") as [typeof sortBy, typeof sortDir]
                setSortBy(by); setSortDir(dir)
              }}
            >
              <option value="createdAtUtc:desc">Mais recentes</option>
              <option value="name:asc">Nome ↑</option>
              <option value="name:desc">Nome ↓</option>
              <option value="price:asc">Preço ↑</option>
              <option value="price:desc">Preço ↓</option>
              <option value="quantity:desc">Estoque ↓</option>
            </select>
            <Button color="light" onClick={() => { setPage(1); fetchList() }}>Atualizar</Button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => (
            <article key={p.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={imageFor(p)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium line-clamp-2">{p.name}</h3>
                  <span className="text-brand-700 font-semibold">
                    {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>

                <div className="mt-3 flex gap-2">
                  <Button className="flex-1" onClick={() => toast.success("Adicionado ao carrinho!")}>
                    Comprar
                  </Button>
                  <Button color="light" onClick={() => startEdit(p)}>Editar</Button>
                  <Button color="failure" onClick={() => remove(p.id)}>Excluir</Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* paginação */}
        <div className="flex gap-2 items-center mt-6 justify-center">
          <Button color="light" disabled={page<=1} onClick={()=>setPage(p => Math.max(1, p-1))}>Anterior</Button>
          <span className="text-sm">Página {page} de {Math.max(1, Math.ceil(total / pageSize))}</span>
          <Button color="light" disabled={page>=Math.ceil(total/pageSize)} onClick={()=>setPage(p => p+1)}>Próxima</Button>
        </div>

        {/* GERENCIAR (form) */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Admin rápido</h2>

          {globalError && (
            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {globalError}
            </div>
          )}

          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 border rounded-2xl">
            <div>
              <input
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
                placeholder="Nome *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onBlur={() => clearErrorsFor("name")}
                required
              />
              <FieldErrors errors={fieldErrors.name} />
            </div>

            <div>
              <input
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${fieldErrors.category ? "border-red-400" : "border-gray-300"}`}
                placeholder="Categoria *"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                onBlur={() => clearErrorsFor("category")}
                required
              />
              <FieldErrors errors={fieldErrors.category} />
            </div>

            <div className="md:col-span-2">
              <input
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${fieldErrors.description ? "border-red-400" : "border-gray-300"}`}
                placeholder="Descrição"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                onBlur={() => clearErrorsFor("description")}
              />
              <FieldErrors errors={fieldErrors.description} />
            </div>

            <div>
              <input
                type="number"
                step="0.01"
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${fieldErrors.price ? "border-red-400" : "border-gray-300"}`}
                placeholder="Preço"
                value={Number.isFinite(form.price) ? form.price : 0}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                onBlur={() => clearErrorsFor("price")}
              />
              <FieldErrors errors={fieldErrors.price} />
            </div>

            <div>
              <input
                type="number"
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${fieldErrors.quantity ? "border-red-400" : "border-gray-300"}`}
                placeholder="Quantidade"
                value={Number.isFinite(form.quantity) ? form.quantity : 0}
                onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                onBlur={() => clearErrorsFor("quantity")}
              />
              <FieldErrors errors={fieldErrors.quantity} />
            </div>

            <div className="flex gap-2 mt-1">
              <Button type="submit" isProcessing={saving}>
                {editingId ? "Salvar alterações" : "Adicionar"}
              </Button>
              {editingId && (
                <Button
                  color="light"
                  type="button"
                  onClick={() => { setEditingId(null); setForm({ ...empty }); setFieldErrors({}); setGlobalError(null) }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null
  return (
    <ul className="mt-1 space-y-0.5">
      {errors.map((e, i) => (
        <li key={i} className="text-xs text-red-600">{e}</li>
      ))}
    </ul>
  )
}

function normalizeProp(prop: string) {
  const p = prop.toLowerCase()
  if (p.includes("name")) return "name"
  if (p.includes("category")) return "category"
  if (p.includes("price")) return "price"
  if (p.includes("quantity")) return "quantity"
  if (p.includes("description")) return "description"
  return prop
}
