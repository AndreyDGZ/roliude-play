# Rolliude Play

Rolliude Play é uma plataforma web brasileira de streaming voltada à valorização do cinema brasileiro e regional. Focada no acesso a filmes de domínio público na Sprint inicial.

## Estrutura do Projeto

- `frontend/`: Aplicação React (Vite, TypeScript).
- `backend/`: API Node.js (Express, TypeScript, Prisma).
- `docs/`: Documentação de planejamento.

## Como Executar Localmente

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
3. Instale as dependências: `npm install`.
4. Rode as migrations do Prisma: `npx prisma migrate dev`.
5. Inicie o servidor: `npm run dev`.

#### Frontend
1. Entre na pasta `frontend/`.
2. Instale as dependências: `npm install`.
3. Inicie o projeto: `npm run dev`.

## CI / CD
Configurado via GitHub Actions. O CI roda verificação de tipos e compilação do front e do back a cada Pull Request nas branches `main` e `develop`.
