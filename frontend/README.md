# Frontend — KitBox (Next.js)

Este frontend foi feito para o **teste técnico** e segue o design minimalista com foco nas telas de **Home**, **Login** e **Cadastro**.
Ele consome a API em \http://localhost:5238\ (configurável via variável de ambiente).

## Requisitos
- Node.js 20+
- NPM 10+
- Backend rodando em \http://localhost:5238\

## Variáveis de Ambiente
Crie o arquivo \.env.local\ na pasta \rontend\ com:

\\\env
NEXT_PUBLIC_API_URL=http://localhost:5238
\\\

> Se preferir um exemplo, veja \rontend/.env.example\.

## Instalação e Execução

\\\bash
# na raiz do repo
cd frontend

# instalar deps (modo compatível com peers)
echo legacy-peer-deps=true > .npmrc
npm install

# subir em dev (Turbopack)
npm run dev
# http://localhost:3000
\\\

## Páginas
- **Home**: lista de produtos (paginação e ordenação via API).
- **/login**: formulário de login (fluxo básico).
- **/signup**: formulário de cadastro.

## Integração com a API
A URL é lida de \process.env.NEXT_PUBLIC_API_URL\.  
Ao rodar o backend local, a URL padrão \http://localhost:5238\ funciona.

## Estrutura resumida
- \pp/\: rotas (Next.js App Router)
- \components/\: componentes (inclui \components/auth\)
- \lib/\: utilitários (ex.: \lib/auth.ts\)

---
Qualquer dúvida, abra uma issue.
