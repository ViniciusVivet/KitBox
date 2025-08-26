# KitBox.Api — Documentação

API em .NET 9 para o teste técnico.  
Conta com CRUD de **Produtos**, validação com **FluentValidation**, **Swagger**, e repositórios **MongoDB** (padrão) ou **InMemory** (fallback).

## Requisitos
- .NET SDK 9
- Docker Desktop (para MongoDB)
- PowerShell (para scripts de seed)

## Como rodar (com MongoDB via Docker)

1) Subir MongoDB e Mongo Express (sem auth, local):
\\\powershell
# na raiz do repo
# sobe mongo e painel (http://localhost:8081)
docker stop kitbox-mongo kitbox-mongo-express 2>
docker rm   kitbox-mongo kitbox-mongo-express 2>
docker volume rm kitbox_mongo_data 2>

docker run -d --name kitbox-mongo -p 27017:27017 -v kitbox_mongo_data:/data/db mongo:6

docker run -d --name kitbox-mongo-express --link kitbox-mongo:mongo -p 8081:8081 -e ME_CONFIG_MONGODB_SERVER=kitbox-mongo -e ME_CONFIG_BASICAUTH=false mongo-express:1.0.2-20
\\\

2) Conferir conexão no \ppsettings.Development.json\:
\\\json
{
  "ConnectionStrings": { "Mongo": "mongodb://localhost:27017" },
  "Mongo": { "Database": "kitbox" },
  "Jwt": {
    "Key": "SUA-CHAVE-SUPER-SECRETA-AQUI-TROCAR-DEPOIS",
    "Issuer": "kitbox-api",
    "Audience": "kitbox-ui"
  }
}
\\\

3) Rodar a API:
\\\powershell
cd backend\src\KitBox.Api
dotnet clean
dotnet build
dotnet run
# http://localhost:5238
\\\

4) Swagger:
- **http://localhost:5238/swagger**

## Endpoints principais

### Saúde
- \GET /health\ → \{ status: "ok", utc: "..." }\

### Produtos (CRUD + busca)
- \GET /products?name=&category=&page=&pageSize=&sortBy=&sortDir=\

Parâmetros:
- \
ame\ (string; opcional)
- \category\ (string; opcional)
- \page\ (int; padrão 1)
- \pageSize\ (int; padrão 10)
- \sortBy\ (name|category|price|quantity|createdatutc; padrão \
ame\)
- \sortDir\ (asc|desc; padrão \sc\)

Resposta:
\\\json
{ "total": 123, "page": 1, "pageSize": 10, "items": [ ... ] }
\\\

- \GET /products/{id}\ → retorna 404 se não encontrar
- \POST /products\ → cria novo
- \PUT /products/{id}\ → atualiza
- \DELETE /products/{id}\ → remove

### DTO de entrada (\ProductInputDto\)
\\\json
{
  "name": "string (1..200)",
  "description": "string (1..2000)",
  "category": "string (1..100)",
  "price": 0,
  "quantity": 0
}
\\\

Validações (FluentValidation):
- \
ame\, \description\, \category\ obrigatórios com limites de tamanho
- \price >= 0\, \quantity >= 0\

### Modelo de domínio (\Product\)
\\\json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "price": 0,
  "quantity": 0,
  "createdAtUtc": "2025-01-01T00:00:00Z"
}
\\\

## Seed de produtos
Na raiz do projeto há o script:
- \scripts/seed-products.ps1\

Uso:
\\\powershell
# idempotente (só cria faltantes)
.\scripts\seed-products.ps1

# apagar todos e recriar do zero
.\scripts\seed-products.ps1 -ClearFirst
\\\

## Decisões arquiteturais (resumo)
- **Camadas**: \Domain\ (entidades + contratos), \Infrastructure\ (repositórios Mongo/InMemory), \Api\ (Web API + DI + validação).
- **Repositório**: Interface \IProductRepository\ com implementações \MongoProductRepository\ e \InMemoryProductRepository\.
- **DI**: por padrão registrado \MongoProductRepository\ (ajustável no \Program.cs\).
- **Validação**: \FluentValidation\ com \ProductInputValidator\.
- **Swagger**: habilitado em Dev para inspeção e testes.

---
