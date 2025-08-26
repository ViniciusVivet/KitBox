# KitBox — Desafio Técnico (E-commerce)
**Autor:** Douglas Vinicius Alves da Silva

Projeto full-stack de e-commerce minimalista criado para um teste técnico.  
Stack utilizada: **.NET 9 (Web API) + MongoDB + Next.js 15 + Tailwind + JWT + FluentValidation + Swagger**.

> Desenvolvido em 6 dias como desafio técnico, demonstrando domínio prático em backend, frontend e integração com banco de dados real.

---

## 🚀 Como rodar localmente

### 1) Pré-requisitos
- Docker Desktop (recomendado) **ou** MongoDB local
- .NET SDK 9
- Node.js 20 (LTS) + npm

### 2) Subir MongoDB (Docker)
```powershell
docker run -d --name kitbox-mongo -p 27017:27017 -v kitbox_mongo_data:/data/db mongo:6
# (Opcional) Painel: Mongo Express (sem login)
docker run -d --name kitbox-mongo-express --link kitbox-mongo:mongo -p 8081:8081 -e ME_CONFIG_MONGODB_SERVER=kitbox-mongo -e ME_CONFIG_BASICAUTH=false mongo-express:1.0.2-20
```

### 3) Backend (.NET API)
```powershell
cd backend/src/KitBox.Api
copy appsettings.Development.json.example appsettings.Development.json
dotnet run
# Swagger: http://localhost:5238/swagger
# Health:  http://localhost:5238/health
```

### 4) Frontend (Next.js)
```powershell
cd frontend
copy .env.example .env.local
# evitar ERESOLVE de peers:
echo legacy-peer-deps=true> .npmrc
npm install
npm run dev
# http://localhost:3000
```

---

## 🧭 Endpoints principais (API)
- `GET /health`
- `GET /products` — filtros: `?name=&category=&page=1&pageSize=12&sortBy=name|price|quantity|createdAtUtc&sortDir=asc|desc`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /auth/register`, `POST /auth/login` — JWT

Swagger disponível em **`/swagger`**.

---

## 🏗️ Arquitetura
- **KitBox.Domain** — modelos/contratos
- **KitBox.Infrastructure** — persistência (Mongo) + seed
- **KitBox.Api** — controllers, validação, DI, CORS, Auth, Swagger
- **Frontend** — Next.js + Tailwind

**Decisões técnicas:**
- **MongoDB**: rápido e flexível para prototipagem
- **Seed automático**: catálogo inicial para não depender de inserts manuais
- **FluentValidation**: validações centralizadas e claras
- **Swagger**: documentação viva da API
- **Next.js**: performance e DX

---

## 🛠️ Troubleshooting
- Porta **27017** em uso → parar instância antiga ou containers duplicados
- **npm ERESOLVE** → `.npmrc` com `legacy-peer-deps=true`
- **CORS**: liberado para `http://localhost:3000`

---

## 🙋 Sobre mim
Sou **Douglas Vinicius Alves da Silva**, 25 anos, da Zona Leste de São Paulo.  
Estou em **transição de carreira para tecnologia**, e este projeto foi construído para demonstrar minha dedicação, capacidade de aprendizado rápido e compromisso em entregar resultados mesmo sob prazos desafiadores.

> Obrigado pela oportunidade de mostrar meu trabalho.  
> Caso tivesse mais dias, evoluiria em: testes unitários, CI/CD e deploy em cloud.
