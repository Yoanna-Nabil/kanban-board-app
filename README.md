
#  Kanban Board Application — Production Frontend Assessment

A fully‑functional, production‑ready Kanban Board built with modern frontend technologies including **Next.js 16**, **React 19**, **TypeScript**, **React Query**, **Zustand**, **Material UI**, and **dnd‑kit** for drag‑and‑drop.

---

##  Live Deployment

**Vercel Live App:**  
 https://kanban-board-app-eosin-two.vercel.app

---

##  Quick Start (Local Development)

```bash
git clone <your-repo-link>
cd kanban-board-app
npm install
npm run start:all
```

App runs on:

- Frontend → http://localhost:3000  
- API → http://localhost:4000  

---

##  Features Implemented

###  Core Board Features
-  4 Columns — **TO DO / IN PROGRESS / IN REVIEW / DONE**
-  Drag & Drop between columns (dnd‑kit)
-  Column task counters
-  Pagination inside columns
-  Responsive layout

###  Task Management
-  Create task
-  Edit task
-  Delete task
-  Move tasks across columns
-  Modal forms with validation

###  Search & Filtering
-  Search by title
-  Search by description
-  Real‑time filtering

###  State & Data Handling
-  React Query (server state + caching)
-  Zustand (UI state like search)
-  Optimized mutations
-  Loading & error handling

---

##  UX Enhancements Added

- Dynamic total tasks counter
- Styled search input
- Responsive header layout
- Improved drag overlay UX
- Pointer + Touch sensors support

---

##  Project Architecture

```
kanban-board-app/
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── Column.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskModal.tsx
│   │   ├── SearchBar.tsx
│   │   └── KanbanBoard.tsx
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── types/
│
├── db/db.json
├── public/
└── package.json
```

---

##  API Configuration

### Local JSON Server
```bash
npm run api
```

Endpoint:
```
http://localhost:4000/tasks
```

---

### Production (MockAPI)

Environment Variable:

```
NEXT_PUBLIC_API_URL=https://699daa9b83e60a406a47128f.mockapi.io/api/v1
```
---

##  API Endpoints

```
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

---

##  Drag & Drop Implementation

Library: **@dnd-kit**

Features:

- Pointer sensor
- Touch sensor
- Drag overlay preview
- Column collision detection
- Cross‑column moves

---

##  Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 16 | Framework |
| React 19 | UI |
| TypeScript | Type safety |
| Material UI | UI components |
| dnd-kit | Drag & Drop |
| React Query | Server State |
| Zustand | Client State |
| Axios | API calls |
| JSON Server | Local API |
| MockAPI | Cloud API |
| Vercel | Deployment |

---

##  Project Status

| Feature | Status |
|--------|--------|
| CRUD |
| Drag & Drop | 
| Search |
| Pagination | 
| Deployment | 
| Responsive | 

---

##  Ready to Use

Run locally:

```bash
npm run start:all
```

Or open:

https://kanban-board-app-eosin-two.vercel.app