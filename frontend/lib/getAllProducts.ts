export default async function getAllProducts() {
  const res = await fetch("http://localhost:5238/products?page=1&pageSize=20", {
    cache: "no-store"
  })
  const data = await res.json()
  return data.items.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    slug: p.id,
    path: "/product/" + p.id,
    images: [{ url: "/placeholder.png" }], // depois substituímos pelas suas imagens reais
    price: { value: p.price, currencyCode: "BRL" },
  }))
}
