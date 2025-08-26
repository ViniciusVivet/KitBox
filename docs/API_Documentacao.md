# Documentação da API KitBox

Esta documentação descreve os endpoints principais da API KitBox.

## Base URL
```
http://localhost:5238
```

## Autenticação
Atualmente, o projeto não possui autenticação configurada (Mongo sem auth).

## Endpoints

### Health Check
**GET /health**
- Retorna status da API.

### Produtos
**GET /products**
- Lista paginada de produtos.

Parâmetros:
- `page` (int)
- `pageSize` (int)
- `sortBy` (string)
- `sortDir` (asc|desc)

**POST /products**
- Cria um produto.

Exemplo JSON:
```json
{
  "name": "Colar Minimalista de Prata",
  "description": "Prata 925",
  "category": "Colares",
  "price": 129.90,
  "quantity": 20
}
```

**GET /products/{id}**
- Retorna produto por ID.

**PUT /products/{id}**
- Atualiza produto.

**DELETE /products/{id}**
- Remove produto.

---
A documentação completa dos endpoints pode ser acessada em:
```
http://localhost:5238/swagger
```