# 🏫 ONG Wilson Aquino — Sistema de Gestão

Aplicação full-stack desenvolvida do zero para gerenciar as operações de uma ONG voltada à educação e saúde. O sistema oferece um painel administrativo completo com dashboard interativo, gráficos em tempo real, controle de voluntários, projetos, doações e eventos — tudo com autenticação JWT, validação robusta e exportação de relatórios em CSV/JSON.

O **frontend** foi construído com **React 18 + TypeScript + Tailwind CSS**, utilizando **Zustand** para estado global, **React Hook Form + Zod** para formulários tipados e **Recharts** para visualização de dados. O **backend** é uma API RESTful em **Node.js + Express + TypeScript**, com persistência em JSON, controle de concorrência via mutex e sistema de backups integrado.

A aplicação está em produção com deploy automatizado: frontend no **GitHub Pages** via GitHub Actions e backend no **Render**.

🔗 **Acesse a aplicação:** [https://clayton79.github.io/ONG-Wilson-Aquino/](https://clayton79.github.io/ONG-Wilson-Aquino/)
🔗 **API em produção:** [https://ong-wilson-aquino-api.onrender.com](https://ong-wilson-aquino-api.onrender.com)

> **Credenciais de teste:** `admin@wilsonaquino.org` / `admin123`

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Screenshots](#-screenshots)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação Local](#-instalação-local)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Credenciais Padrão](#-credenciais-padrão)
- [Documentação da API](#-documentação-da-api)
  - [Autenticação](#autenticação)
  - [Voluntários](#voluntários)
  - [Projetos](#projetos)
  - [Doações](#doações)
  - [Eventos](#eventos)
  - [Dashboard](#dashboard)
  - [Relatórios](#relatórios)
  - [Backups](#backups)
  - [Health Check](#health-check)
- [Modelos de Dados](#-modelos-de-dados)
- [Frontend — Páginas](#-frontend--páginas)
- [Deploy](#-deploy)
- [Licença](#-licença)

---

## 🌟 Visão Geral

O sistema permite gerenciar todos os aspectos operacionais de uma ONG:

| Módulo | Descrição |
|--------|-----------|
| **Dashboard** | Painel com KPIs, gráficos de doações/mês, voluntários/mês, projetos por status |
| **Voluntários** | Cadastro completo com CPF, endereço, habilidades, disponibilidade |
| **Projetos** | Gestão com status (planejamento → ativo → concluído), orçamento, metas |
| **Doações** | Registro financeiro e material, vinculação a projetos, recibos |
| **Eventos** | Agendamento, controle de participantes, check-in |
| **Relatórios** | Geração em JSON e CSV (voluntários, doações, projetos, eventos) |
| **Backups** | Criação e restauração de backups dos dados |
| **Configurações** | Gerenciamento de perfil e preferências do sistema |

### Papéis de Usuário

| Papel | Permissões |
|-------|-----------|
| `admin` | Acesso total: CRUD de todos os recursos, relatórios, backups, configurações |
| `volunteer` | Visualizar dados, participar de eventos |
| `donor` | Visualizar dados, registrar doações |
| `visitor` | Visualizar dados públicos |

---

## 🛠 Tecnologias

### Backend

| Tecnologia | Uso |
|-----------|-----|
| **Node.js 18+** | Runtime |
| **Express 4** | Framework HTTP |
| **TypeScript** | Tipagem estática (ES2022, strict mode) |
| **Zod** | Validação de schemas |
| **JSON Web Token** | Autenticação (Bearer token, 24h expiração) |
| **bcryptjs** | Hash de senhas (10 salt rounds) |
| **UUID v4** | Geração de IDs únicos |
| **JSON File Store** | Persistência em arquivos JSON com controle de concorrência (mutex) |

### Frontend

| Tecnologia | Uso |
|-----------|-----|
| **React 18** | UI Library |
| **TypeScript** | Tipagem estática |
| **Vite 5** | Build tool e dev server |
| **React Router v6** | Roteamento SPA |
| **Tailwind CSS 3** | Estilização utility-first |
| **Zustand** | Gerenciamento de estado global |
| **React Hook Form + Zod** | Formulários com validação |
| **Recharts** | Gráficos e visualizações |
| **Lucide React** | Ícones |

### Infraestrutura

| Serviço | Uso |
|---------|-----|
| **GitHub Pages** | Hospedagem do frontend |
| **Render** | Hospedagem do backend (plano free) |
| **GitHub Actions** | CI/CD para deploy automático do frontend |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────┐
│           GitHub Pages (Frontend)       │
│    React SPA + Tailwind + Zustand       │
│    https://clayton79.github.io/         │
│            ONG-Wilson-Aquino/           │
└───────────────┬─────────────────────────┘
                │ HTTPS (fetch)
                ▼
┌─────────────────────────────────────────┐
│         Render (Backend API)            │
│    Express + TypeScript + JWT           │
│    https://ong-wilson-aquino-api        │
│              .onrender.com              │
├─────────────────────────────────────────┤
│  Controllers → Services → Repositories  │
│         ↓           ↓                   │
│   Zod Validation   JSON File Store      │
│                    (./data/*.json)       │
└─────────────────────────────────────────┘
```

### Estrutura do Projeto

```
ONG-Wilson-Aquino/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuração centralizada
│   │   ├── controllers/     # Lógica de requisição/resposta
│   │   ├── middlewares/     # Auth, validação, error handler
│   │   ├── models/          # Tipos, interfaces, schemas Zod
│   │   ├── repositories/   # Acesso a dados (JSON files)
│   │   ├── routes/          # Definição de rotas Express
│   │   ├── services/        # Lógica de negócio
│   │   ├── utils/           # FileStore, JWT, password, seed, pagination
│   │   └── index.ts         # Entry point do servidor
│   ├── data/                # Arquivos JSON (banco de dados)
│   ├── backups/             # Backups automáticos
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layouts/     # AppLayout (sidebar), AuthLayout
│   │   │   └── router/      # Rotas + ProtectedRoute
│   │   ├── pages/           # Páginas por módulo
│   │   │   ├── auth/        # Login, Register, Recover
│   │   │   ├── dashboard/   # Dashboard com gráficos
│   │   │   ├── volunteers/  # Lista + Formulário
│   │   │   ├── projects/    # Lista + Formulário
│   │   │   ├── donations/   # Lista + Formulário
│   │   │   ├── events/      # Lista + Formulário
│   │   │   ├── reports/     # Geração de relatórios
│   │   │   └── settings/    # Configurações do sistema
│   │   ├── shared/
│   │   │   ├── components/  # UI reutilizável (Button, Card, Modal...)
│   │   │   ├── services/    # API client + funções tipadas
│   │   │   ├── stores/      # Zustand (authStore)
│   │   │   └── types/       # Tipos compartilhados
│   │   └── widgets/         # Sidebar, Logo
│   ├── package.json
│   └── vite.config.ts
├── .github/workflows/       # CI/CD GitHub Actions
├── render.yaml              # Blueprint de deploy Render
└── README.md
```

---

## 🚀 Instalação Local

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9

### 1. Clone o repositório

```bash
git clone https://github.com/Clayton79/ONG-Wilson-Aquino.git
cd ONG-Wilson-Aquino
```

### 2. Backend

```bash
cd backend
npm install
npm run seed     # Popula dados iniciais (4 usuários, 8 voluntários, 5 projetos, 8 doações, 5 eventos)
npm run dev      # Inicia em http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev      # Inicia em http://localhost:5173
```

O Vite está configurado com proxy reverso: todas as chamadas para `/api` são redirecionadas para `http://localhost:3001`.

### Scripts Disponíveis

#### Backend

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `tsx watch src/index.ts` | Dev server com hot-reload |
| `build` | `tsc && npm run seed:prod` | Compila TypeScript + seed |
| `start` | `node dist/index.js` | Inicia versão de produção |
| `seed` | `tsx src/utils/seed.ts` | Popula dados iniciais (dev) |
| `seed:prod` | `node dist/utils/seed.js` | Popula dados iniciais (prod) |
| `lint` | `eslint src --ext .ts` | Verifica código |
| `format` | `prettier --write "src/**/*.ts"` | Formata código |

#### Frontend

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `vite` | Dev server com HMR |
| `build` | `tsc && vite build` | Build de produção |
| `preview` | `vite preview` | Preview do build |
| `lint` | `eslint . --ext ts,tsx` | Verifica código |
| `format` | `prettier --write "src/**/*.{ts,tsx}"` | Formata código |

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta do servidor |
| `JWT_SECRET` | `default-secret-change-me` | Chave secreta para tokens JWT |
| `JWT_EXPIRES_IN` | `24h` | Tempo de expiração do token |
| `DATA_DIR` | `./data` | Diretório dos arquivos JSON |
| `BACKUP_DIR` | `./backups` | Diretório de backups |
| `CORS_ORIGIN` | `http://localhost:5173` | Origens CORS permitidas (separar por vírgula) |
| `NODE_ENV` | `development` | Ambiente (development/production) |

---

## 🔑 Credenciais Padrão

Após executar `npm run seed`, os seguintes usuários são criados:

| Papel | Email | Senha |
|-------|-------|-------|
| **Admin** | `admin@wilsonaquino.org` | `admin123` |
| **Voluntário** | `maria@email.com` | `voluntario123` |
| **Doador** | `joao@email.com` | `doador123` |
| **Visitante** | `ana@email.com` | `visitante123` |

---

## 📖 Documentação da API

A API do sistema está disponível em `https://ong-wilson-aquino-api.onrender.com/api`. Todas as respostas seguem um formato padronizado com os campos `success`, `data` e `message`. Em caso de erro, a resposta inclui o campo `errors` com detalhes de validação.

Com exceção das rotas de autenticação e do health check, todas as requisições exigem um token JWT enviado no header `Authorization: Bearer <token>`.

As rotas de listagem suportam paginação com os parâmetros `page`, `limit`, `search`, `sortBy` e `sortOrder`, retornando os dados junto com metadados de total de registros e número de páginas.

---

### Autenticação

O módulo de autenticação permite que usuários façam login, se registrem e gerenciem seus perfis. Ao enviar email e senha para a rota de login, o sistema retorna um token JWT válido por 24 horas, além dos dados completos do usuário (nome, email, papel, telefone e status). O registro cria um novo usuário no sistema — é necessário informar nome (mínimo 2 caracteres), email válido e senha (mínimo 6 caracteres); opcionalmente pode-se definir o papel (`admin`, `volunteer`, `donor` ou `visitor`) e telefone. Há também uma rota para solicitar recuperação de senha via email. Usuários autenticados podem consultar e atualizar seu próprio perfil (nome, telefone e avatar).

---

### Voluntários

O gerenciamento de voluntários oferece operações completas de CRUD. Qualquer usuário autenticado pode listar e consultar voluntários, mas apenas administradores podem criar, editar ou excluir registros. O cadastro de um voluntário inclui dados pessoais (nome, email, telefone, CPF, data de nascimento), endereço completo (rua, cidade, UF com 2 caracteres e CEP), além de habilidades (um array de áreas como "educação", "saúde", "informática"), disponibilidade e observações opcionais. A listagem suporta busca textual e ordenação por qualquer campo.

---

### Projetos

O módulo de projetos permite acompanhar todo o ciclo de vida de cada iniciativa da ONG. Cada projeto possui nome, descrição detalhada, coordenador responsável, categoria, datas de início e término, orçamento planejado versus valor efetivamente arrecadado, metas definidas como lista de objetivos, localização, número de beneficiários e uma lista de voluntários vinculados. O status do projeto pode ser `planning` (planejamento), `active` (ativo), `paused` (pausado), `completed` (concluído) ou `cancelled` (cancelado). A listagem é acessível a todos os autenticados, enquanto criação, edição e exclusão são restritas a administradores.

---

### Doações

O sistema controla dois tipos de doação: financeira e material. Doações financeiras registram valor em reais, número de recibo e podem ser vinculadas a um projeto específico. Doações materiais registram uma lista de itens doados (por exemplo, "500 cadernos", "1000 lápis"). Ambas incluem dados do doador (nome e ID), descrição, data e observações opcionais. A listagem aceita filtros adicionais por tipo (`financial` ou `material`) e por intervalo de datas (`startDate` e `endDate`). Qualquer usuário autenticado pode consultar doações, mas o registro pode ser feito por administradores ou doadores. Somente administradores podem editar ou excluir doações existentes.

---

### Eventos

Eventos representam atividades programadas pela ONG, como mutirões, palestras ou workshops. Cada evento possui nome, descrição, data e horários de início e término, local, categoria, número máximo de participantes e pode ser vinculado a um projeto. O status progride entre `scheduled` (agendado), `in_progress` (em andamento), `completed` (concluído) e `cancelled` (cancelado). Existe uma rota dedicada que retorna os próximos eventos ordenados por data. Administradores e voluntários podem adicionar participantes a um evento; somente administradores podem remover participantes ou gerenciar (criar, editar, excluir) os eventos em si.

---

### Dashboard

O painel de controle oferece uma visão consolidada de toda a operação da ONG através de uma única rota. A resposta inclui contadores gerais (total e ativos de voluntários, total de doações com soma dos valores financeiros, projetos ativos versus total, eventos próximos), listas dos registros mais recentes (últimas doações, últimos voluntários cadastrados e próximos eventos), além de dados mensais para gráficos: valores de doações por mês e quantidade de novos voluntários por mês. Também retorna a distribuição de projetos por status (quantos em planejamento, ativos e concluídos). Qualquer usuário autenticado tem acesso ao dashboard.

---

### Relatórios

O módulo de relatórios permite a geração de relatórios para cada entidade do sistema: voluntários, doações, projetos e eventos. Os relatórios podem ser exportados em dois formatos — JSON para consumo programático ou CSV para download e análise em planilhas. É possível filtrar os dados por período usando parâmetros de data inicial e final. Somente administradores têm acesso à geração de relatórios.

---

### Backups

O sistema de backups permite que administradores criem cópias de segurança de todos os dados armazenados. Cada backup copia os arquivos JSON do banco de dados para um diretório com timestamp, permitindo rastrear o momento exato de cada cópia. É possível listar todos os backups disponíveis e restaurar os dados a partir de qualquer backup específico, sobrescrevendo os dados atuais com o estado salvo anteriormente.

---

### Health Check

A rota de verificação de saúde (`GET /health`) está disponível sem autenticação e retorna o status do servidor junto com o timestamp atual. Ela é utilizada pelo Render para monitorar se o serviço está ativo e responsivo.

---

## 📊 Modelos de Dados

### User

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome completo |
| `email` | string | ✅ | Email (único) |
| `password` | string | ✅ | Hash bcrypt |
| `role` | enum | ✅ | `admin`, `volunteer`, `donor`, `visitor` |
| `phone` | string | — | Telefone |
| `avatar` | string | — | URL do avatar |
| `isActive` | boolean | ✅ | Status ativo |
| `createdAt` | string (ISO) | ✅ | Data de criação |
| `updatedAt` | string (ISO) | ✅ | Data de atualização |

### Volunteer

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome completo |
| `email` | string | ✅ | Email |
| `phone` | string | ✅ | Telefone |
| `cpf` | string | ✅ | CPF |
| `birthDate` | string | ✅ | Data de nascimento |
| `address` | string | ✅ | Endereço |
| `city` | string | ✅ | Cidade |
| `state` | string (2) | ✅ | UF |
| `zipCode` | string | ✅ | CEP |
| `skills` | string[] | ✅ | Habilidades |
| `availability` | string | ✅ | Disponibilidade |
| `notes` | string | — | Observações |
| `isActive` | boolean | ✅ | Status ativo |

### Project

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome do projeto |
| `description` | string | ✅ | Descrição detalhada |
| `status` | enum | ✅ | `planning`, `active`, `paused`, `completed`, `cancelled` |
| `startDate` | string | ✅ | Data de início |
| `endDate` | string | — | Data de término |
| `budget` | number | — | Orçamento (R$) |
| `raised` | number | — | Valor arrecadado (R$) |
| `coordinator` | string | ✅ | Nome do coordenador |
| `volunteerIds` | string[] | ✅ | IDs dos voluntários vinculados |
| `goals` | string[] | ✅ | Metas do projeto |
| `category` | string | ✅ | Categoria |
| `location` | string | — | Localização |
| `beneficiaries` | number | — | Número de beneficiários |

### Donation

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `donorId` | string | ✅ | ID do doador |
| `donorName` | string | ✅ | Nome do doador |
| `type` | enum | ✅ | `financial`, `material` |
| `amount` | number | — | Valor (R$) — para doações financeiras |
| `description` | string | ✅ | Descrição |
| `items` | string[] | — | Itens doados — para doações materiais |
| `date` | string | ✅ | Data da doação |
| `projectId` | string | — | Projeto vinculado |
| `projectName` | string | — | Nome do projeto vinculado |
| `receiptNumber` | string | — | Número do recibo |

### OngEvent

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome do evento |
| `description` | string | ✅ | Descrição |
| `status` | enum | ✅ | `scheduled`, `in_progress`, `completed`, `cancelled` |
| `date` | string | ✅ | Data |
| `startTime` | string | ✅ | Hora de início |
| `endTime` | string | ✅ | Hora de término |
| `location` | string | ✅ | Local |
| `maxParticipants` | number | — | Máximo de participantes |
| `participantIds` | string[] | ✅ | IDs dos participantes |
| `category` | string | ✅ | Categoria |
| `projectId` | string | — | Projeto vinculado |

---

## 🖥 Frontend — Páginas

| Rota | Página | Acesso |
|------|--------|--------|
| `/login` | Login | Público |
| `/register` | Cadastro | Público |
| `/recover` | Recuperar senha | Público |
| `/dashboard` | Painel principal com KPIs e gráficos | Autenticado |
| `/volunteers` | Lista de voluntários | Autenticado |
| `/volunteers/new` | Cadastrar voluntário | Admin |
| `/volunteers/:id/edit` | Editar voluntário | Admin |
| `/projects` | Lista de projetos | Autenticado |
| `/projects/new` | Cadastrar projeto | Admin |
| `/projects/:id/edit` | Editar projeto | Admin |
| `/donations` | Lista de doações | Autenticado |
| `/donations/new` | Registrar doação | Admin, Donor |
| `/donations/:id/edit` | Editar doação | Admin |
| `/events` | Lista de eventos | Autenticado |
| `/events/new` | Cadastrar evento | Admin |
| `/events/:id/edit` | Editar evento | Admin |
| `/reports` | Geração de relatórios (JSON/CSV) | Admin |
| `/settings` | Configurações do sistema | Admin |

---

## 🚢 Deploy

### Frontend (GitHub Pages)

O deploy é automático via **GitHub Actions** ao fazer push na branch `main`:

1. Instala dependências (`npm ci`)
2. Compila TypeScript e builda com Vite (`npm run build`)
3. Faz upload do artefato (`frontend/dist/`)
4. Deploya para GitHub Pages

**URL:** `https://clayton79.github.io/ONG-Wilson-Aquino/`

### Backend (Render)

O deploy é automático via **Render Blueprint** (`render.yaml`):

| Configuração | Valor |
|-------------|-------|
| Runtime | Node.js 20 |
| Plano | Free |
| Região | Oregon |
| Root Dir | `backend/` |
| Build | `npm install && npm run build` |
| Start | `npm start` |
| Health Check | `/health` |

**URL:** `https://ong-wilson-aquino-api.onrender.com`

**Variáveis de ambiente no Render:**
- `NODE_ENV=production`
- `JWT_SECRET` (gerado automaticamente)
- `CORS_ORIGIN=https://clayton79.github.io`

> ⚠️ **Nota:** No plano free do Render, o serviço entra em standby após 15 minutos sem tráfego. A primeira requisição após o standby pode levar ~1 minuto para responder.

> ⚠️ **Nota:** O sistema usa arquivos JSON para persistência. No plano free do Render, o filesystem é efêmero — os dados são resetados a cada novo deploy ou restart. O seed é executado automaticamente durante o build.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ para a ONG Wilson Aquino — Educação & Saúde.
