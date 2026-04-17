# 🚀 Collaborative Document Store

Production-ready collaborative wiki backend built with **Node.js, TypeScript, MongoDB, Docker**, and a minimal **React frontend**.

---

## ⚡ Quick Start (Your Style)

```bash
git https://github.com/karthikgarikina/collaborative-document-store-with-MongoDB
cd collaborative-document-store-with-MongoDB
docker compose up --build
```

---

## 🌐 Access

- Frontend → http://localhost:4173  
- Backend → http://localhost:4000/api  
- Health → http://localhost:4000/api/health  

---

## 🧠 What This Project Covers

- ✅ Optimistic Concurrency Control (OCC)
- ✅ MongoDB Advanced Schema Design
- ✅ Full-text Search + Tag Filtering
- ✅ Aggregation Pipelines (Analytics)
- ✅ Schema Migration (Lazy + Batch)
- ✅ Dockerized Full Stack Setup

---

## 🏗️ Architecture

```
Frontend → Backend API → MongoDB
                  ↓
        OCC + Search + Analytics
                  ↓
          Migration Script
```

---

## 📦 Core Features

### 📝 Documents
- Create, Read, Update, Delete
- Version-based updates (OCC)

### 🔍 Search
- Full-text search (`title`, `content`)
- Tag filtering (`tags=...`)
- Sorted by relevance

### 📊 Analytics
- Most edited documents
- Tag co-occurrence

### 🔄 Migration
- Lazy migration (on read)
- Background batch migration script

---

## ⚙️ Important APIs

### Create
```
POST /api/documents
```

### Get
```
GET /api/documents/:slug
```

### Update (OCC)
```
PUT /api/documents/:slug
```

### Search
```
GET /api/search?q=term&tags=tag1,tag2
```

### Analytics
```
GET /api/analytics/most-edited
GET /api/analytics/tag-cooccurrence
```

---

## 🐳 Docker Commands

### Start
```bash
docker compose up --build
```

### Stop
```bash
docker compose down
```

### Reset DB
```bash
docker compose down -v
docker compose up --build
```

---

## 🔧 Environment Variables

Create `.env` from `.env.example`:

```
MONGO_URI=mongodb://mongo:27017
DATABASE_NAME=collab_docs
PORT=4000
```

---

## 🧪 Migration Script

Run manually:

```bash
node scripts/migrate_author_schema.js
```

---

## 💡 Key Concept (IMPORTANT)

### Optimistic Concurrency Control

- Each document has `version`
- Update only if version matches
- Else → `409 Conflict`

👉 Prevents data loss in multi-user editing

---
## Video Demo
https://www.youtube.com/watch?v=wltHaWRjr9Q
---
## 🎯 Final Note

This is a **mini Notion/Confluence backend** demonstrating:

- Real-world backend architecture
- Scalable MongoDB design
- Conflict-safe collaboration

---

🔥 Built in production style — clean, modular, and scalable.
