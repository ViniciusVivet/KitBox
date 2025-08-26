# Decisões Arquiteturais - KitBox

## 1. Arquitetura do Projeto
- **Backend**: ASP.NET Core 9 (API REST)
- **Frontend**: Next.js 15 (React)
- **Banco**: MongoDB (Docker)

Separação em camadas:
- **KitBox.Domain**: entidades e contratos (ex.: `IProductRepository`)
- **KitBox.Infrastructure**: implementação dos repositórios (Mongo + InMemory)
- **KitBox.Api**: controllers, validações e configuração

## 2. Persistência
- Optou-se por MongoDB para refletir o teste técnico solicitado.
- Configuração inicial sem autenticação (para simplicidade local).
- Produto é armazenado com os campos:
  - `name`, `description`, `category`, `price`, `quantity`.

## 3. Frontend
- Construído em Next.js.
- `.env.local` define `NEXT_PUBLIC_API_URL`.
- Interface simples para cadastro e listagem de produtos.

## 4. Validação
- Usado FluentValidation no backend para validar DTOs.
- Campos obrigatórios: `name`, `description`, `category`, `price`, `quantity`.

## 5. Swagger
- Swagger configurado no backend para explorar endpoints REST.
- Disponível em `http://localhost:5238/swagger`.

## 6. Extras
- Seed inicial de produtos (PowerShell).
- Mongo Express para inspeção visual do banco.
- `.gitignore` ajustado para evitar rastreamento de bin/obj e node_modules.

---
Essas decisões visaram atender o escopo do desafio em tempo limitado (6 dias).