# Checklist para rodar local

## 1) Pré-requisitos
- Docker Desktop
- Node.js 20+ e NPM 10+
- .NET SDK 9

## 2) Subir MongoDB (Docker)
\\\powershell
# na raiz do repo
docker stop kitbox-mongo kitbox-mongo-express 2>
docker rm   kitbox-mongo kitbox-mongo-express 2>
docker volume rm kitbox_mongo_data 2>

docker run -d --name kitbox-mongo -p 27017:27017 -v kitbox_mongo_data:/data/db mongo:6
docker run -d --name kitbox-mongo-express --link kitbox-mongo:mongo -p 8081:8081 -e ME_CONFIG_MONGODB_SERVER=kitbox-mongo -e ME_CONFIG_BASICAUTH=false mongo-express:1.0.2-20
# painel: http://localhost:8081
\\\

## 3) Backend
\\\powershell
cd backend\src\KitBox.Api
dotnet clean
dotnet build
dotnet run
# API em http://localhost:5238
# Swagger em http://localhost:5238/swagger
\\\

## 4) Seed de produtos
\\\powershell
# idempotente
.\scripts\seed-products.ps1

# para resetar e recriar tudo:
.\scripts\seed-products.ps1 -ClearFirst
\\\

## 5) Frontend
\\\powershell
cd frontend
echo legacy-peer-deps=true > .npmrc
npm install
npm run dev
# http://localhost:3000
\\\

## 6) Testes rápidos
- Abra http://localhost:3000 → Home deve listar produtos.
- Login/Signup (fluxo básico).
- API: http://localhost:5238/health e http://localhost:5238/swagger

Pronto! :)
