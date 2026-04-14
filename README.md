# secure-rbac-task-manager

Production-ready full-stack RBAC Task Manager built with Express + MongoDB + React (Vite). It includes JWT authentication, role-based authorization, request validation, Swagger documentation, Docker support, and seed data for demo/submission.

## Features

- JWT login with 1-hour token expiry
- RBAC enforcement (`admin` can delete tasks, users cannot access others' tasks)
- Validation with consistent error format:
  - `{ "success": false, "errors": ["message"] }`
- Secure defaults (`helmet`, `cors`, `morgan`, `express-rate-limit`)
- Swagger docs with request/response examples and auth support
- Tailwind-based responsive frontend with loading states and toast-style feedback

## Folder Tree

```text
secure-rbac-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── package.json
├── screenshots/
│   └── README.md
├── docker-compose.yml
├── secure-rbac-task-manager.postman_collection.json
└── README.md
```

## Setup Commands

```bash
git clone https://github.com/adarsh9056/secure-rbac-task-manager.git
cd secure-rbac-task-manager

cd backend
npm install
cp .env.example .env

cd ../frontend
npm install
cp .env.example .env
```

## Environment Variables

`backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secure-rbac-task-manager
JWT_SECRET=your_super_secure_jwt_secret
```

`frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

## Run Locally

### Backend (dev)

```bash
cd backend
npm run dev
```

### Backend (prod mode)

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

## Seed Sample Users

```bash
cd backend
npm run seed
```

Seeded users:
- Admin: `admin@example.com` / `Admin123`
- User: `user@example.com` / `User123`

## Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:5001` (or `http://127.0.0.1:5000` if free)
- Swagger: `http://127.0.0.1:5001/api-docs`

## API Routes

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Tasks
- `POST /api/v1/tasks`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id` (admin only)

## Swagger / Postman Testing

- Swagger: open `/api-docs`, click **Authorize**, use `Bearer <token>`
- Postman: import `secure-rbac-task-manager.postman_collection.json`

## Docker

```bash
docker compose up --build
```

Services:
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Screenshots (Submission)

Use `screenshots/README.md` as checklist and add PNG/JPG captures there.

## Scalability Notes

- Redis for caching, distributed rate limiting, and token/session strategies
- Docker + orchestration (Kubernetes / ECS)
- Microservices split (auth service, task service, notifications)
- Horizontal scaling with load balancing (Nginx / ALB)
