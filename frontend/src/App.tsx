import { useEffect, useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  quantity: number
  createdAtUtc: string
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5238'

export default function App() {
  // lista/paginação
  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [loading, setLoading] = useState(false)

  // filtros
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  // formulário (create/update)
  const empty = { name: '', description: '', category: '', price: 0, quantity: 0 }
  const [form, setForm] = useState({ ...empty })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const qp = useMemo(() => {
    const u = new URL(API + '/products')
    u.searchParams.set('page', String(page))
    u.searchParams.set('pageSize', String(pageSize))
    if (name.trim()) u.searchParams.set('name', name.trim())
    if (category.trim()) u.searchParams.set('category', category.trim())
    return u.toString()
  }, [page, pageSize, name, category])

  async function fetchList() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(qp)
      const data = await res.json()
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setError('Falha ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qp])

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const body = JSON.stringify(form)
    const headers = { 'Content-Type': 'application/json; charset=utf-8' }

    try {
      if (editingId) {
        const res = await fetch(`${API}/products/${editingId}`, { method: 'PUT', headers, body })
        if (!res.ok) throw new Error('PUT fail')
      } else {
        const res = await fetch(`${API}/products`, { method: 'POST', headers, body })
        if (!res.ok) throw new Error('POST fail')
      }
      setForm({ ...empty })
      setEditingId(null)
      fetchList()
    } catch {
      setError('Erro ao salvar (verifique campos).')
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remove(id: string) {
    if (!confirm('Excluir este produto?')) return
    await fetch(`${API}/products/${id}`, { method: 'DELETE' })
    fetchList()
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>KitBox - Produtos</h1>
      <p style={{ color: '#555', marginTop: 0 }}>MVP CRUD (Mongo via Docker)  API: {API}</p>

      {/* filtros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 16 }}>
        <input placeholder='Buscar por nome' value={name} onChange={e => setName(e.target.value)} />
        <input placeholder='Categoria' value={category} onChange={e => setCategory(e.target.value)} />
        <button onClick={() => { setPage(1); fetchList() }}>Filtrar</button>
      </div>

      {/* form */}
      <form onSubmit={submitForm} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>{editingId ? 'Editar produto' : 'Novo produto'}</h2>
        {error && <div style={{ background: '#fee', border: '1px solid #f99', padding: 8, marginBottom: 8 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input required placeholder='Nome' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input required placeholder='Categoria' value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input placeholder='Descrição' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input type='number' step='0.01' placeholder='Preço' value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <input type='number' placeholder='Quantidade' value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type='submit'>{editingId ? 'Salvar alterações' : 'Adicionar'}</button>
          {editingId && <button type='button' onClick={() => { setEditingId(null); setForm({ ...empty }) }}>Cancelar</button>}
        </div>
      </form>

      {/* tabela */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#f7f7f7' }}>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Nome</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Categoria</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Preço</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Qtd</th>
              <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ padding: 8 }}>Carregando…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 8 }}>Sem produtos.</td></tr>
            )}
            {!loading && items.map(p => (
              <tr key={p.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.name}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.category}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{p.quantity}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(p)}>Editar</button>
                  <button onClick={() => remove(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginação */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Próxima</button>
      </div>
    </div>
  )
}
