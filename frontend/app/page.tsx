import "./page.css"
import getAllProducts from "../lib/get-all-products"
import ProductsGrid from "../components/ProductsGrid"

export default async function Page(){
  const products = await getAllProducts()

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="topbar">
            <a className="brand" href="/">
              <span className="logo" />
              <div>
                <strong>KitBox</strong><br/>
                <small style={{opacity:.65}}>Acessórios & Joias</small>
              </div>
            </a>

            <div className="search">
              <span className="icon">🔎</span>
              <input placeholder="Busque por produtos, categorias..." />
            </div>

            <div className="actions">
              <a href="/login" className="btn" style={{textDecoration:"none"}}>Entrar</a>
              <a href="/signup" className="btn primary" style={{textDecoration:"none"}}>Cadastrar</a>
            </div>
          </div>

          <div className="heroText">
            <h1>Encontre seu brilho</h1>
            <p>Peças minimalistas, elegantes e com preço justo.</p>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="wrap">
          {products.length === 0 ? (
            <div className="empty">Nenhum produto disponível no momento.</div>
          ) : (
            <ProductsGrid products={products} />
          )}
        </div>
      </section>
    </>
  )
}



