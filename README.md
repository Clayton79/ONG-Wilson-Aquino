# CUFA Pernambuco — Sistema de Gestão

Sistema web completo para gerenciamento das operações da **CUFA Pernambuco** (Central Única das Favelas). Inclui painel administrativo com dashboard, controle de voluntários, doadores, doações, projetos e eventos, além de área pública institucional.

| | Tecnologia |
|---|---|
| **Frontend** | React 18 · TypeScript · Tailwind CSS · Zustand · React Hook Form · Zod · Recharts |
| **Backend** | Node.js · Express · TypeScript · JWT · Zod · JSON file storage |
| **Deploy** | GitHub Pages (frontend) · Render (backend) |

🔗 **Aplicação:** [https://clayton79.github.io/Cufa-Pernambuco-Oficial/](https://clayton79.github.io/Cufa-Pernambuco-Oficial/)

**Base URL da API:** `https://ong-wilson-aquino-api.onrender.com/api`

---

## Documentação da API

## Autenticação

Todas as rotas (exceto login, registro, recuperação e endpoints públicos) exigem o header:

```
Authorization: Bearer <token>
```

### Roles (perfis)

| Role | Descrição |
|------|-----------|
| `admin` | Acesso total — CRUD completo em todos os módulos |
| `volunteer` | Leitura + participar de eventos |
| `donor` | Leitura + registrar doações |
| `visitor` | Apenas leitura |

---

## Paginação

Endpoints de listagem (`GET`) aceitam os seguintes query params:

| Param | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `page` | number | 1 | Página atual |
| `limit` | number | 10 | Itens por página (máx. 100) |
| `search` | string | — | Busca textual nos registros |
| `sortBy` | string | — | Campo para ordenação |
| `sortOrder` | `asc` \| `desc` | `asc` | Direção da ordenação |

**Resposta paginada:**
```json
{
  "success": true,
  "data": [],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

## Endpoints

### 1. Auth (`/api/auth`)

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/auth/login` | Público | Login — retorna token JWT |
| `POST` | `/auth/register` | Público | Registrar novo usuário |
| `POST` | `/auth/recover` | Público | Recuperar senha |
| `GET` | `/auth/profile` | Autenticado | Obter perfil do usuário logado |
| `PUT` | `/auth/profile` | Autenticado | Atualizar perfil do usuário logado |

**POST /auth/login**
```json
{
  "email": "string (email)",
  "password": "string (min 6)"
}
```

**POST /auth/register**
```json
{
  "name": "string (min 2)",
  "email": "string (email)",
  "password": "string (min 6)",
  "role": "admin | volunteer | donor | visitor (opcional, padrão: visitor)",
  "phone": "string (opcional)"
}
```

**POST /auth/recover**
```json
{
  "email": "string (email)"
}
```

---

### 2. Voluntários (`/api/volunteers`)

> Requer autenticação. Criar/editar/excluir requer role `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/volunteers` | Autenticado | Listar voluntários (paginado) |
| `GET` | `/volunteers/:id` | Autenticado | Buscar voluntário por ID |
| `POST` | `/volunteers` | Admin | Criar voluntário |
| `PUT` | `/volunteers/:id` | Admin | Atualizar voluntário |
| `DELETE` | `/volunteers/:id` | Admin | Remover voluntário |

**POST / PUT body:**
```json
{
  "name": "string (min 2)",
  "email": "string (email)",
  "phone": "string (min 10)",
  "cpf": "string (11-14 chars)",
  "birthDate": "string (data)",
  "address": "string (min 5)",
  "city": "string (min 2)",
  "state": "string (2 chars — sigla UF)",
  "zipCode": "string (min 8)",
  "skills": ["string"] ,
  "availability": "string",
  "notes": "string (opcional)",
  "isActive": "boolean (opcional, padrão: true)"
}
```

---

### 3. Doadores (`/api/donors`)

> Requer autenticação. Criar/editar/excluir requer role `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/donors` | Autenticado | Listar doadores (paginado) |
| `GET` | `/donors/active` | Autenticado | Listar apenas doadores ativos |
| `GET` | `/donors/:id` | Autenticado | Buscar doador por ID |
| `POST` | `/donors` | Admin | Criar doador |
| `PUT` | `/donors/:id` | Admin | Atualizar doador |
| `DELETE` | `/donors/:id` | Admin | Remover doador |

**POST / PUT body:**
```json
{
  "name": "string (min 2)",
  "email": "string (email)",
  "phone": "string (min 10)",
  "type": "individual | company",
  "cpf": "string (opcional)",
  "cnpj": "string (opcional)",
  "address": "string (opcional)",
  "city": "string (opcional)",
  "state": "string (opcional)",
  "notes": "string (opcional)",
  "isActive": "boolean (opcional, padrão: true)"
}
```

---

### 4. Doações (`/api/donations`)

> Requer autenticação. Criar requer role `admin` ou `donor`. Editar/excluir requer `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/donations` | Autenticado | Listar doações (paginado) |
| `GET` | `/donations/:id` | Autenticado | Buscar doação por ID |
| `POST` | `/donations` | Admin / Donor | Registrar doação |
| `PUT` | `/donations/:id` | Admin | Atualizar doação |
| `DELETE` | `/donations/:id` | Admin | Remover doação |

**Tipos de doação (DonationType):** `food`, `clothing`, `financial`, `material`, `other`

**POST / PUT body:**
```json
{
  "donorId": "string",
  "donorName": "string",
  "type": "food | clothing | financial | material | other",
  "amount": "number (positivo, opcional)",
  "description": "string",
  "items": ["string"] ,
  "date": "string (data)",
  "projectId": "string (opcional)",
  "projectName": "string (opcional)",
  "receiptNumber": "string (opcional)",
  "notes": "string (opcional)"
}
```

---

### 5. Projetos (`/api/projects`)

> Requer autenticação. Criar/editar/excluir requer role `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/projects` | Autenticado | Listar projetos (paginado) |
| `GET` | `/projects/:id` | Autenticado | Buscar projeto por ID |
| `POST` | `/projects` | Admin | Criar projeto |
| `PUT` | `/projects/:id` | Admin | Atualizar projeto |
| `DELETE` | `/projects/:id` | Admin | Remover projeto |

**Status do projeto (ProjectStatus):** `planning`, `active`, `paused`, `completed`, `cancelled`

**POST / PUT body:**
```json
{
  "name": "string (min 2)",
  "description": "string (min 10)",
  "status": "planning | active | paused | completed | cancelled",
  "startDate": "string (data)",
  "endDate": "string (opcional)",
  "budget": "number (positivo, opcional)",
  "raised": "number (opcional)",
  "coordinator": "string (min 2)",
  "volunteerIds": ["string"],
  "goals": ["string"],
  "category": "string",
  "location": "string (opcional)",
  "beneficiaries": "number (inteiro positivo, opcional)",
  "notes": "string (opcional)"
}
```

---

### 6. Eventos (`/api/events`)

> Requer autenticação. Criar/editar/excluir requer role `admin`. Participar requer `admin` ou `volunteer`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/events` | Autenticado | Listar eventos (paginado) |
| `GET` | `/events/upcoming` | Autenticado | Próximos eventos futuros |
| `GET` | `/events/:id` | Autenticado | Buscar evento por ID |
| `POST` | `/events` | Admin | Criar evento |
| `PUT` | `/events/:id` | Admin | Atualizar evento |
| `DELETE` | `/events/:id` | Admin | Remover evento |
| `POST` | `/events/:id/participants` | Admin / Volunteer | Adicionar participante |
| `DELETE` | `/events/:id/participants/:volunteerId` | Admin | Remover participante |

**Status do evento (EventStatus):** `scheduled`, `in_progress`, `completed`, `cancelled`

**POST / PUT body:**
```json
{
  "name": "string (min 2)",
  "description": "string (min 10)",
  "status": "scheduled | in_progress | completed | cancelled",
  "date": "string (data)",
  "startTime": "string (horário)",
  "endTime": "string (horário)",
  "location": "string (min 2)",
  "maxParticipants": "number (inteiro positivo, opcional)",
  "participantIds": ["string"],
  "projectId": "string (opcional)",
  "projectName": "string (opcional)",
  "category": "string",
  "notes": "string (opcional)"
}
```

---

### 7. Dashboard (`/api/dashboard`)

> Requer autenticação.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/dashboard/summary` | Autenticado | Resumo geral do painel |

**Resposta inclui:** totais de voluntários, doadores, doações, projetos e eventos; doações recentes; voluntários recentes; próximos eventos; gráficos (doações por mês, por tipo, voluntários por mês, projetos por status).

---

### 8. Relatórios (`/api/reports`)

> Requer autenticação + role `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/reports/:type` | Admin | Gerar relatório |

**Tipos disponíveis:** `volunteers`, `donors`, `donations`, `projects`, `events`

**Query params opcionais:**

| Param | Descrição |
|-------|-----------|
| `format` | `json` (padrão) ou `csv` |
| `startDate` | Filtrar a partir de (ISO date) |
| `endDate` | Filtrar até (ISO date) |

---

### 9. Backups (`/api/backups`)

> Requer autenticação + role `admin`.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/backups` | Admin | Listar backups existentes |
| `POST` | `/backups` | Admin | Criar novo backup |
| `POST` | `/backups/restore/:backupName` | Admin | Restaurar backup específico |

---

### 10. Endpoints Públicos (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/public/projects` | Listar projetos (paginado, sem auth) |
| `GET` | `/public/events` | Listar eventos (paginado, sem auth) |

Esses endpoints aceitam os mesmos query params de paginação.

---

## Respostas padrão

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

**Erro de validação:**
```json
{
  "success": false,
  "error": "Dados inválidos",
  "details": [
    { "field": "email", "message": "Email inválido" }
  ]
}
