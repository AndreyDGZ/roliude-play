# Arquitetura Inicial do Sistema — Rolliude Play

Este documento detalha o desenho da arquitetura técnica da plataforma **Rolliude Play** para o MVP (Sprint 0 a Sprint 3), destacando os fluxos de dados, componentes de front-end, back-end, banco de dados e a estratégia de streaming/armazenamento de mídia.

---

## 1. Visão Geral da Arquitetura (Diagrama)

```mermaid
graph TD
    %% Usuários e Clientes
    subgraph Clientes [" Camada de Apresentação (Client Side) "]
        User["Usuário / Navegador Web"]
    end

    %% Frontend
    subgraph FrontendApp [" Frontend (SPA) - Vercel / Netlify / Railway "]
        ReactApp["React 19 + TypeScript (Vite)"]
        Router["React Router DOM (SPA Navigation)"]
        HTML5Player["Player de Vídeo Nativo (<video>)"]
    end

    %% Provedores Externos / Auth
    subgraph ExternalServices [" Serviços Externos "]
        GoogleOAuth["Google Cloud OAuth 2.0 (Login Social)"]
        CloudflareR2["Cloudflare R2 / Backblaze B2 (Object Storage S3)"]
    end

    %% Backend e Banco de Dados (Railway)
    subgraph RailwayCloud [" Infraestrutura de Backend (Railway) "]
        subgraph BackendAPI [" API REST (Node.js + Express) "]
            AuthModule["Módulo de Autenticação (JWT / Passport)"]
            CatalogModule["Módulo de Catálogo & Curadoria"]
            MediaService["Serviço de Mídia & Metadados"]
            PrismaORM["Prisma ORM"]
        end

        subgraph Database [" Banco de Dados "]
            PostgreSQL[(PostgreSQL 15+)]
        end
    end

    %% Fluxos e Relações
    User -->|Acessa WebApp| ReactApp
    ReactApp --> Router
    ReactApp -->|Reproduz Filme via URL Direta| HTML5Player

    %% Fluxo de Vídeo Direto (CDN/Storage)
    HTML5Player -.->|Streaming Direto de Vídeo MP4| CloudflareR2

    %% Fluxo de Autenticação Social
    ReactApp <-->|Fluxo OAuth 2.0| GoogleOAuth
    GoogleOAuth -->|Token / Perfil Google| AuthModule

    %% Chamadas de API
    ReactApp <-->|Requisições REST JSON| BackendAPI
    BackendAPI --> PrismaORM
    PrismaORM <-->|Queries SQL / Migrations| PostgreSQL

    %% Upload / Registro
    BackendAPI -.->|Cadastro / Gestão de URLs de Mídia| CloudflareR2
```

---

## 2. Descrição dos Componentes e Camadas

### 2.1. Front-end (Cliente)
- **Tecnologia:** React 19, TypeScript, Vite.
- **Roteamento:** `react-router-dom` gerenciando as páginas (Home, Catálogo, Detalhes do Filme, Login, Cadastro).
- **Player de Vídeo:** Tag nativa `<video>` do HTML5.
  - **Decisão Arquitetural:** Como as obras do MVP são de **domínio público**, o streaming é feito via requisição direta (`GET`) para a URL pública do arquivo MP4 no Object Storage, sem overhead de DRM ou chaves criptográficas neste momento.

### 2.2. Back-end (API REST)
- **Tecnologia:** Node.js + Express com TypeScript.
- **Hospedagem:** Railway (container Docker Node.js).
- **Módulos Principais:**
  - **Auth:** Gerenciamento de sessões com JWT e integração com Google OAuth 2.0.
  - **Catálogo & Filmes:** Endpoints de listagem de filmes, filtros por gênero, detalhes de obras e informações regionais.
  - **Mídia:** Armazenamento das URLs públicas dos vídeos e metadados no banco.

### 2.3. Banco de Dados
- **Tecnologia:** PostgreSQL hospedado e gerenciado via Railway.
- **Camada de Acesso (ORM):** Prisma ORM (facilita migrations automatizadas, tipagem estática ponta a ponta e integridade referencial).

### 2.4. Armazenamento de Mídia (Object Storage)
- **Serviço:** Cloudflare R2 ou Backblaze B2 (compatível com API S3 da AWS).
- **Motivo de Escolha:** Custo zero de tráfego de saída (*egress free* no R2) ou muito baixo, ideal para servir arquivos pesados de filmes sem onerar o servidor principal da API no Railway.

---

## 3. Fluxo de Execução Central (Assistir Filme)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Usuário
    participant Front as Frontend (React)
    participant Back as Backend (Express API)
    participant DB as PostgreSQL
    participant Storage as Cloudflare R2 (S3)

    Usuario->>Front: Clica em um filme no Catálogo
    Front->>Back: GET /api/filmes/:id
    Back->>DB: Consulta metadados do filme (incluindo video_url)
    DB-->>Back: Retorna dados do filme
    Back-->>Front: Retorna JSON com metadados + video_url pública
    Front->>Usuario: Renderiza página de detalhes com o Player de Vídeo
    Usuario->>Front: Clica no Play
    Front->>Storage: Requisição de streaming do arquivo de vídeo (Range Requests)
    Storage-->>Front: Envio contínuo dos pacotes de mídia
    Front-->>Usuario: Reprodução fluida do filme
```
