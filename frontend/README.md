# Social Media Posts Manager - Frontend

React + TypeScript + Tailwind CSS frontend for managing social media posts.

## Features

- 📊 Real-time statistics dashboard
- 🔍 Advanced filtering and search
- 🏷️ Filter by tags and categories
- 📅 Date range filtering
- ➕ Create new posts
- ✏️ Edit existing posts
- 🗑️ Delete posts with confirmation
- 📱 Fully responsive design
- ⚡ Fast and optimized with React Query

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Design System

### Colors

- Primary: `#4299e1` (blue)
- Secondary: `#48bb78` (green)
- Background: `#f5f7fa`

### Spacing

- Uses 8px grid system: 8px, 16px, 24px, 32px

### Shadows

- Card: `0 2px 8px rgba(0,0,0,0.08)`
- Card Hover: `0 8px 24px rgba(0,0,0,0.12)`

### Border Radius

- Cards: 12px
- Buttons: 8px

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── StatsHeader.tsx # Statistics dashboard
│   ├── Filters.tsx     # Filter controls
│   ├── PostCard.tsx    # Post display card
│   ├── PostModal.tsx   # Create/edit post modal
│   ├── DeleteModal.tsx # Delete confirmation
│   ├── Pagination.tsx  # Pagination controls
│   ├── LoadingSkeleton.tsx # Loading state
│   └── EmptyState.tsx  # Empty state display
├── services/
│   └── api.ts          # API client
├── types/
│   └── index.ts        # TypeScript types
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features in Detail

### Filtering

- Search by post text or author name
- Filter by category (10 categories)
- Filter by tags (11 tags with post counts)
- Date range filtering (from/to dates)
- Sort by: date, likes, comments, shares, engagement rate
- Sort order: ascending or descending

### CRUD Operations

- **Create**: Add new posts with all fields
- **Read**: View posts with full details
- **Update**: Edit any post field including tags
- **Delete**: Delete with confirmation modal

### Real-time Updates

- React Query automatically refetches data
- Optimistic updates for better UX
- Automatic cache invalidation

## API Integration

Connects to backend API at http://localhost:3000/api

Endpoints used:
- `GET /api/posts` - List posts with filters
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/authors` - List authors
- `GET /api/tags` - List tags
- `GET /api/stats` - Get statistics
