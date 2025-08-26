export type UiProduct = {
  id: string
  name: string
  description?: string
  price: { value: number, currencyCode: string }
  imageUrl?: string
}

export default async function getProduct(id: string): Promise<UiProduct | null> {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5238"
  const res = await fetch(`${api}/products/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const p = await res.json()
  if (!p?.id) return null
  return {
    id: String(p.id),
    name: String(p.name ?? "Sem nome"),
    description: p.description ?? "",
    price: { value: Number(p.price ?? 0), currencyCode: "BRL" },
    imageUrl: "/placeholder.svg",
  }
}
