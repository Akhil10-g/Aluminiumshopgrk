# Aluminium Shop Backend

Node.js + Express + MongoDB backend for Projects management with admin authentication.

## Setup

1. Install dependencies:
   npm install
2. Copy env file:
   copy .env.example .env
3. Update values in `.env`
4. Run server:
   npm run dev

## API Endpoints

### Auth
- `POST /api/auth/login` - Admin login (returns JWT)

### Projects
- `POST /api/projects` - Create project (protected, multipart/form-data with `images`)
- `GET /api/projects` - Get all projects
  - Query: `company`, `sort=latest|oldest`, `page`, `limit`
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project (protected, can upload new `images`)
- `DELETE /api/projects/:id` - Delete project (protected)

## Notes

- Uploaded files are served from `/uploads`
- Default admin is auto-seeded from `.env` values (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
