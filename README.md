# CUFA Pernambuco — Sistema de Gestão

Sistema web para gerenciamento das operações da **CUFA Pernambuco** (Central Única das Favelas). Permite o controle de voluntários, doadores, doações, projetos e eventos por meio de um painel administrativo com dashboard interativo, relatórios exportáveis e área pública institucional.

## Tecnologias

| Camada | Stack |
|--------|-------|
| **Frontend** | React 18 · TypeScript · Tailwind CSS · Zustand · React Hook Form · Zod · Recharts |
| **Backend** | Node.js · Express · TypeScript · JWT · Zod · JSON file storage |
| **Deploy** | GitHub Pages (frontend) · Render (backend) |

## API

**Base URL:** `https://ong-wilson-aquino-api.onrender.com/api`

| Módulo | Endpoints principais |
|--------|---------------------|
| Auth | `POST /auth/login` · `POST /auth/register` · `POST /auth/recover` · `GET /auth/profile` |
| Voluntários | `GET /volunteers` · `POST /volunteers` · `PUT /volunteers/:id` · `DELETE /volunteers/:id` |
| Doadores | `GET /donors` · `GET /donors/active` · `POST /donors` · `PUT /donors/:id` · `DELETE /donors/:id` |
| Doações | `GET /donations` · `POST /donations` · `PUT /donations/:id` · `DELETE /donations/:id` |
| Projetos | `GET /projects` · `POST /projects` · `PUT /projects/:id` · `DELETE /projects/:id` |
| Eventos | `GET /events` · `GET /events/upcoming` · `POST /events` · `PUT /events/:id` · `DELETE /events/:id` |
| Dashboard | `GET /dashboard/summary` |
| Relatórios | `GET /reports/:type` (volunteers, donors, donations, projects, events) |
| Backups | `GET /backups` · `POST /backups` · `POST /backups/restore/:backupName` |
| Público | `GET /public/projects` · `GET /public/events` |
