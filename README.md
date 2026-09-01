# Rolliude Play

Rolliude Play é uma plataforma web brasileira de streaming voltada à valorização do cinema brasileiro e regional. Focada no acesso e reprodução integral de obras cinematográficas de domínio público na fase inicial (MVP).

---

## 1. Estrutura do Repositório

```
rolliude-play/
├── frontend/          # Aplicação web em React + Vite + TypeScript
├── backend/           # API REST em Node.js + Express + Prisma
├── docs/              # Documentação de planejamento e especificações
├── tests/             # Testes integrados e de ponta a ponta
├── .github/           # Templates de Issues/PRs e Workflows de CI/CD
├── docker-compose.yml # Ambiente local padronizado (Front, Back e DB)
└── README.md
```

---

## 2. Stack Técnica por Módulo

### `rolliude-play-frontend` — Plataforma Web (React + Vite)

| Tecnologia | Versão | Papel |
|---|---|---|
| **React** | `19` | Framework de interface (UI) |
| **TypeScript** | `5.7` | Tipagem estática (*strict*) |
| **Vite** | `6.x` | Ferramenta de build e dev server rápido |
| **React Router DOM** | `7.x` | Roteamento de páginas e navegação SPA |
| **Lucide React** | `1.x` | Conjunto de ícones da interface |
| **HTML5 Video Player** | *Nativo* | Reprodução de vídeos/filmes de domínio público |
| **Fetch API / Axios** | *Nativo / a definir* | Comunicação HTTP com a API REST |

---

### `rolliude-play-backend` — API REST (Node.js / Express / Prisma)

| Tecnologia | Versão | Papel |
|---|---|---|
| **Node.js** | `≥ 20` | Runtime JavaScript/TypeScript |
| **Express** | `5.x` | Framework HTTP / roteador de endpoints |
| **TypeScript** | `5.9` | Tipagem estática no backend |
| **Prisma** | `7.x` | ORM e gerenciamento de migrations do banco de dados |
| **PostgreSQL** | `15+` | Banco de dados relacional principal |
| **@aws-sdk/client-s3** | `3.x` | SDK para integração com Object Storage S3-compatible |
| **Passport.js / Google OAuth 2.0** *(Sprint 2)* | `^0.7 / ^2.0` | Autenticação social via conta Google |
| **jsonwebtoken (JWT) + bcrypt** *(Sprint 2)* | `^9.0 / ^5.1` | Autenticação tradicional e hash de senhas |
| **CORS & Dotenv** | `2.8 / 17.x` | Configurações de segurança e variáveis de ambiente |

---

### `Infraestrutura, DevOps & Serviços Cloud`

| Serviço / Ferramenta | Versão / Tipo | Papel |
|---|---|---|
| **Docker & Docker Compose** | `Compose 3.8` | Padronização do ambiente local (front, back, db) |
| **GitHub Actions** | `CI v4` | Integração Contínua (lint, typecheck e build em PRs) |
| **Railway** | *PaaS Gerenciado* | Hospedagem do backend e banco PostgreSQL de produção |
| **Cloudflare R2 / Backblaze B2** | *Object Storage (S3)* | Armazenamento e entrega direta dos arquivos de vídeo |
| **Vercel / Netlify / Railway** | *Static Hosting* | Hospedagem da aplicação frontend |

---

## 3. Como Executar Localmente

### Usando Docker (Recomendado)

1. Certifique-se de que possui o Docker e o Docker Compose instalados.
2. Na raiz do projeto, execute:
   ```bash
   docker compose up --build
   ```
3. O Frontend estará disponível em `http://localhost:5173`.
4. O Backend estará disponível em `http://localhost:3000`. A rota de health check é `http://localhost:3000/api/health`.

### Executando Manualmente

#### Backend
1. Entre na pasta `backend/`.
2. Copie `.env.example` para `.env` e ajuste as variáveis.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode as migrations do Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

#### Frontend
1. Entre na pasta `frontend/`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto:
   ```bash
   npm run dev
   ```

---

## 4. CI / CD

Configurado via GitHub Actions em `.github/workflows/ci.yml`. O CI executa automaticamente a verificação de tipos e compilação do frontend e do backend a cada Pull Request direcionado para as branches `main` e `develop`.
