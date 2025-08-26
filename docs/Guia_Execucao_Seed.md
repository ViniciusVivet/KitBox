# Guia de Execução - KitBox

## Pré-requisitos
- .NET 9.0 SDK
- Node.js 18+
- Docker Desktop

## Passos

### 1. Subir MongoDB (sem autenticação)
```powershell
docker run -d `
  --name kitbox-mongo `
  -p 27017:27017 `
  -v kitbox_mongo_data:/data/db `
  mongo:6
```

### 2. Subir Mongo Express (opcional)
```powershell
docker run -d `
  --name kitbox-mongo-express `
  --link kitbox-mongo:mongo `
  -p 8081:8081 `
  -e ME_CONFIG_MONGODB_SERVER=kitbox-mongo `
  -e ME_CONFIG_BASICAUTH=false `
  mongo-express:1.0.2-20
```

Acesse: [http://localhost:8081](http://localhost:8081)

### 3. Rodar Backend (API)
```powershell
cd backend/src/KitBox.Api
dotnet clean
dotnet build
dotnet run
```

### 4. Rodar Frontend
```powershell
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

### 5. Popular Banco de Dados (Seed)
Use o script em PowerShell para cadastrar produtos iniciais (ex.: `scripts/seed_products.ps1`).

---
## Observações
- O backend expõe a API em `http://localhost:5238`
- O frontend se conecta à API via `NEXT_PUBLIC_API_URL` em `.env.local`