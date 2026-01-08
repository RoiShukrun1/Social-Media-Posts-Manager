# Quick Start Guide

## Backend Server Status

**Running**: ✅ http://localhost:3000  
**Database**: ✅ 25,000 posts loaded  
**All Endpoints**: ✅ Working

---

## Quick Test Commands

```bash
# Health check
curl http://localhost:3000/health

# Get stats
curl http://localhost:3000/api/stats

# List posts
curl "http://localhost:3000/api/posts?page=1&limit=5"

# Get single post
curl http://localhost:3000/api/posts/1

# Update post (NEW!)
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"likes": 2000, "tags": ["#updated"]}'

# Delete post
curl -X DELETE http://localhost:3000/api/posts/25000
```

---

## Common API Calls

### Load Posts with Filters
```typescript
fetch('/api/posts?search=innovation&category=Technology&page=1&limit=20')
```

### Get Statistics
```typescript
fetch('/api/stats')
```

### Edit Post
```typescript
fetch('/api/posts/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Updated content',
    category: 'Technology',
    tags: ['#new', '#tags']
  })
})
```

---

## Files to Reference

1. **API_ENDPOINTS.md** - Complete API documentation
2. **BACKEND_COMPLETE.md** - Full backend status
3. **backend/README.md** - Setup and usage

---

## Next Steps

Ready for Phase 3: Frontend Development

```bash
# When ready to build frontend:
mkdir frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then connect to the backend API at http://localhost:3000

---

**Backend Server**: Terminal 6 (running in background)  
**To stop**: Find process and kill, or restart terminal

