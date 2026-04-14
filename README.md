# secure-rbac-task-manager

A full-stack RBAC task manager built with Node.js, Express, MongoDB, and React (Vite). It includes JWT authentication, role-based authorization, secure middleware defaults, API validation, Swagger docs, and Docker support.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth/Security: JWT, bcryptjs, helmet, cors, morgan, express-rate-limit
- Validation: express-validator
- API Docs: Swagger UI (`/api-docs`)
- Frontend: React + Vite + React Router

## Project Structure

```text
secure-rbac-task-manager/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    server.js
    package.json
    .env.example
    Dockerfile
  frontend/
    src/
      components/
      pages/
    package.json
  docker-compose.yml
  secure-rbac-task-manager.postman_collection.json
```

## Setup Instructions

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd secure-rbac-task-manager
```

### 2) Install backend dependencies

```bash
cd backend
npm install
cp .env.example .env
```

### 3) Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secure-rbac-task-manager
JWT_SECRET=your_super_secure_jwt_secret
```

## Run the Project

### Backend

```bash
cd backend
npm run dev
```

Backend default URL: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Routes

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Tasks

- `POST /api/v1/tasks` (authenticated)
- `GET /api/v1/tasks` (authenticated)
- `GET /api/v1/tasks/:id` (authenticated)
- `PUT /api/v1/tasks/:id` (authenticated)
- `DELETE /api/v1/tasks/:id` (admin only)

## Swagger API Docs

- URL: `http://localhost:5000/api-docs`

## Postman Testing

Import:

- `secure-rbac-task-manager.postman_collection.json`

Then:

1. Run **Auth - Register**
2. Run **Auth - Login**
3. Copy token into `token` variable
4. Test task CRUD requests

## Docker

Run backend + MongoDB with Docker Compose:

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Services:

- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Scalability Notes

This project can be scaled for production with:

- **Redis** for token blacklisting, caching task queries, and rate-limit store
- **Docker + orchestration** (Kubernetes/ECS) for portable deployments
- **Microservices** split (Auth service, Task service, Notification service)
- **Load balancing** with Nginx/ALB to distribute traffic across multiple instances
