export type UiProduct = {
  id: string
  name: string
  description?: string
  slug: string
  path: string
  price: { value: number, currencyCode: string }
  imageUrl?: string
}

export default async function getAllProducts(): Promise<UiProduct[]> {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5238"
  const url = `${api}/products?page=1&pageSize=20`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  const items = Array.isArray(data?.items) ? data.items : []
  return items.map((p: any) => ({
    id: String(p.id ?? ""),
    name: String(p.name ?? "Sem nome"),
    description: p.description ?? "",
    slug: String(p.id ?? ""),
    path: "/product/" + String(p.id ?? ""),
    price: { value: Number(p.price ?? 0), currencyCode: "BRL" },
    imageUrl: "/placeholder.svg",
  }))
}
