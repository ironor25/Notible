
#  Notible — Collaborative Sketching & Note Canvas

**Notible** is a real-time sketching and note-taking platform where users can draw, annotate, and share ideas visually.  
Built using **Next.js**, **TypeScript**, **WebSockets**, and the **Canvas API**, it supports freehand pencil strokes, rectangles, lines, and circles — all rendered dynamically with real-time sync across clients.

---

##  Tech Stack

| Layer | Technologies Used |
|--------|--------------------|
| **Frontend** | Next.js (App Router), TypeScript, Canvas API, WebSockets |
| **Backend** | Node.js, Express, TypeScript, WebSockets |
| **Database** | PostgreSQL (Dockerized) |
| **Build System** | TurboRepo + pnpm monorepo |
| **Containerization** | Docker |
| **Real-Time Communication** | Native WebSockets |
| **Data Layer (Planned)** | Redux Toolkit for global shape state management |

---

##  Project Structure

```
Notible/
│
├── apps/
│   ├── http-backend/         # Express + WebSocket server
│   ├── web/                  # Next.js frontend (Canvas + Toolbar + AI Integration)
│
├── packages/
│   ├── ui/                   # Shared components (buttons, toolbar, etc.)
│   ├── utils/                # Shared utility functions
│
├── turbo.json                # Turborepo configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
Make sure you have installed:
- **Node.js** (>=18)
- **pnpm** (preferred package manager)
- **Docker** (for PostgreSQL)

Install pnpm globally:
```bash
npm install -g pnpm
```

---

### 2️⃣ Install Dependencies
Each folder (frontend, backend, shared packages) requires dependencies.  
From the project root, run:

```bash
pnpm install
```

or individually:
```bash
cd apps/web && pnpm install
cd apps/http-backend && pnpm install
```

---

### 3️⃣ Run PostgreSQL with Docker

Start your PostgreSQL container with:
```bash
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 -v docker_db_storage:/var/lib/postgresql/data postgres
```

This command will:
- Start a Postgres container on port **5432**
- Use password `password`
- Persist data in a Docker volume `docker_db_storage`

---

### 4️⃣ Environment Variables

Create a `.env` file inside your `apps/http-backend` and `apps/web` folders:

#### apps/http-backend/.env
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
PORT=8080
```

#### apps/web/.env
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

---

### 5️⃣ Start Development

Start all apps with:
```bash
pnpm dev
```

Turborepo will run both frontend and backend concurrently.

Or run individually:
```bash
cd apps/web && pnpm dev
cd apps/http-backend && pnpm dev
```

---

## Features

-  **Freehand Drawing (Pencil Tool)**  
  Smooth pencil strokes captured via Canvas API.

-  **Shape Tools**  
  Draw rectangles, circles, and lines precisely.

-  **Real-Time Collaboration**  
  Uses WebSockets for broadcasting shapes across connected users.

-  **AI Integration (Coming Soon)**  
  Generate diagrams or notes from text prompts.

-  **Zooming and Panning**  
  Ctrl + scroll for zoom, toolbar toggle for panning.

-  **Redux-Powered State (WIP)**  
  Persistent global shape storage for sync across UI, AI, and WebSocket.

---

##  Development Notes

- Each app uses its own `pnpm install` — this is crucial in a **Turborepo** setup.
- Database runs in Docker — no manual PostgreSQL setup needed.
- Canvas rendering logic is centralized; shapes broadcast via WebSocket messages.
- Backend listens for messages like:
  ```json
  {
    "type": "chat",
    "message": "{\"tool\": \"rectangle\", ...}",
    "roomId": "notible"
  }
  ```

---

## 🧑‍💻 Author

**Deepak Yadav**  
