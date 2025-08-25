import { useEffect, useMemo, useRef, useState } from "react"
import { Toaster, toast } from "react-hot-toast"

type Product = {
  id: string
  name: string
  description?: string
  category: string
  price: number
  quantity: number
  createdAtUtc: string
}

type ValidationError = {
  PropertyName: string
  ErrorMessage: string
}

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5238"

export default function App() {
  // lista/paginação/sort
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [sortBy, setSortBy] = useState<"name" | "category" | "price" | "quantity" | "createdAtUtc">("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(false)

  // filtros
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")

  // formulário
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
      toast.error("Falha ao carregar produtos.")
    } finally {
      setLoading(false)
    }
  }

  // Debounce dos filtros (400ms)
  const debounceRef = useRef<number | null>(null)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      setPage(1)
      fetchList()
    }, 400)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, category, sortBy, sortDir])

  // Carrega inicial (sem esperar debounce)
  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          toast.error("Erros de validação.")
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
      toast.error("Erro de rede ao salvar.")
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
    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Produto excluído!")
        fetchList()
      } else {
        toast.error("Falha ao excluir.")
      }
    } catch {
      toast.error("Erro de rede ao excluir.")
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // helpers de sort por coluna
  function toggleSort(by: typeof sortBy) {
    if (sortBy === by) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(by)
      setSortDir("asc")
    }
  }
  function sortIcon(by: typeof sortBy) {
    if (sortBy !== by) return "↕"
    return sortDir === "asc" ? "↑" : "↓"
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">KitBox - Produtos</h1>
          <p className="text-sm text-gray-500">API: {API}</p>
        </header>

        {/* filtros */}
        <section className="card mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="input"
              placeholder="Buscar por nome"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Categoria"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <select
              className="input"
              value={`${sortBy}:${sortDir}`}
              onChange={e => {
                const [by, dir] = e.target.value.split(":") as [typeof sortBy, typeof sortDir]
                setSortBy(by)
                setSortDir(dir)
              }}
            >
              <option value="name:asc">Nome ↑</option>
              <option value="name:desc">Nome ↓</option>
              <option value="category:asc">Categoria ↑</option>
              <option value="category:desc">Categoria ↓</option>
              <option value="price:asc">Preço ↑</option>
              <option value="price:desc">Preço ↓</option>
              <option value="quantity:asc">Qtd ↑</option>
              <option value="quantity:desc">Qtd ↓</option>
              <option value="createdAtUtc:desc">Mais recente</option>
              <option value="createdAtUtc:asc">Mais antigo</option>
            </select>
            <div className="flex gap-2">
              <button
                className="btn w-full md:w-auto"
                onClick={() => { setPage(1); fetchList() }}
              >
                Atualizar
              </button>
              {(name || category) && (
                <button
                  className="btn-alt w-full md:w-auto"
                  onClick={() => { setName(""); setCategory(""); setPage(1) }}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {loading ? "Carregando..." : `Total: ${total} item(ns)`}
          </p>
        </section>

        {/* form */}
        <section className="card mb-4">
          <h2 className="text-lg font-medium mb-2">
            {editingId ? "Editar produto" : "Novo produto"}
          </h2>

          {globalError && (
            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {globalError}
            </div>
          )}

          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                className={`input w-full ${fieldErrors.name ? "border-red-400" : ""}`}
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
                className={`input w-full ${fieldErrors.category ? "border-red-400" : ""}`}
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
                className={`input w-full ${fieldErrors.description ? "border-red-400" : ""}`}
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
                className={`input w-full ${fieldErrors.price ? "border-red-400" : ""}`}
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
                className={`input w-full ${fieldErrors.quantity ? "border-red-400" : ""}`}
                placeholder="Quantidade"
                value={Number.isFinite(form.quantity) ? form.quantity : 0}
                onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                onBlur={() => clearErrorsFor("quantity")}
              />
              <FieldErrors errors={fieldErrors.quantity} />
            </div>

            <div className="flex gap-2 mt-1">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? (editingId ? "Salvando..." : "Adicionando...") : (editingId ? "Salvar alterações" : "Adicionar")}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-alt"
                  onClick={() => { setEditingId(null); setForm({ ...empty }); setFieldErrors({}); setGlobalError(null) }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* tabela */}
        <section className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <ThButton active={sortBy === "name"} onClick={() => toggleSort("name")}>Nome {sortIcon("name")}</ThButton>
                  <ThButton active={sortBy === "category"} onClick={() => toggleSort("category")}>Categoria {sortIcon("category")}</ThButton>
                  <ThButton active={sortBy === "price"} onClick={() => toggleSort("price")}>Preço {sortIcon("price")}</ThButton>
                  <ThButton active={sortBy === "quantity"} onClick={() => toggleSort("quantity")}>Qtd {sortIcon("quantity")}</ThButton>
                  <Th> Ações </Th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-3 text-gray-500">Carregando...</td>
                  </tr>
                )}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-3 text-gray-500">Sem produtos.</td>
                  </tr>
                )}
                {!loading && items.map(p => (
                  <tr key={p.id} className="border-t">
                    <Td>{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Td>
                    <Td>{p.quantity}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="btn-alt" onClick={() => startEdit(p)}>Editar</button>
                        <button className="btn-alt" onClick={() => remove(p.id)}>Excluir</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* paginação */}
          <div className="flex gap-2 items-center mt-3">
            <button className="btn-alt" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
            <span className="text-sm">Página {page} de {totalPages}</span>
            <button className="btn-alt" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Próxima</button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 border-b border-gray-200">{children}</th>
}
function ThButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <th className="px-3 py-2 border-b border-gray-200">
      <button
        type="button"
        className={"text-left " + (active ? "underline underline-offset-4" : "")}
        onClick={onClick}
      >
        {children}
      </button>
    </th>
  )
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>
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

/** Mapeia nomes do FluentValidation -> chaves do nosso form */
function normalizeProp(prop: string) {
  const p = prop.toLowerCase()
  if (p.includes("name")) return "name"
  if (p.includes("category")) return "category"
  if (p.includes("price")) return "price"
  if (p.includes("quantity")) return "quantity"
  if (p.includes("description")) return "description"
  return prop
}
