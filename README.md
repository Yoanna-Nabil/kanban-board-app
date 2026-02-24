#  Kanban Board Application  
### Advanced Frontend Assessment – Production-Ready Implementation

A modern Kanban board built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **React Query (TanStack v5)**, **Zustand**, **Material UI v7**, and **dnd-kit**.

---

##  Quick Start

```bash
cd kanban-app
npm run start:all
```

### Default Ports
| Service | Port |
|----------|--------|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |

> ⚠ If port 3000 is busy, Next.js automatically switches to 3001.

---

#  Implemented Features

##  Core Board
- 4 Columns: Backlog, In Progress, Review, Done  
- Dynamic task counter  
- Responsive layout  

##  Task Management
- Create / Edit / Delete tasks  
- Column selector in modal  
- Real‑time updates  

##  Search & Filtering
- Title + description search  
- Zustand manages UI search state  

##  Pagination
- 6 tasks per column page  
- Auto reset on search  

##  Drag & Drop (dnd-kit)
- Column ↔ Task drop detection  
- DragOverlay preview  
- Column highlight on hover  

##  Data & Performance
- React Query caching  
- 5‑minute staleTime  
- Automatic refetch on mutation  
- Axios API layer  

##  UI
- Material UI v7  
- Custom theme  

---

#  Project Structure

```
src/
├── app/
├── components/
├── hooks/
├── services/
├── store/
├── providers/
└── types/
```

---

#  API

```
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

---

#  Stack

- Next.js 16
- React 19
- TypeScript
- React Query v5
- Zustand
- dnd-kit
- Material UI
- Axios
- JSON Server

---

#  ENV

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

#  Start

```bash
npm run start:all
```

Visit → http://localhost:3000

---

**Status:** Production Ready 