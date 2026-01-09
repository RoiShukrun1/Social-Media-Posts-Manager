# Social Media Posts Manager - Frontend

React + TypeScript + Tailwind CSS frontend for managing social media posts.

## Features

- 📊 Real-time statistics dashboard
- 🔍 Advanced filtering and search (debounced)
- 📅 Date range filtering (dd/mm/yyyy)
- 🔤 Category filtering (case-insensitive)
- 📈 Sort by multiple metrics
- ➕ Create new posts with inline validation
- 👤 Create authors dynamically (free text fields)
- ✏️ Edit existing posts and author details
- 🗑️ Delete posts with confirmation
- 👁️ Expand posts to view full text (click on card)
- ⌨️ Enter key support for filters
- ♿ Full accessibility (ARIA labels, keyboard navigation)
- 📱 Fully responsive design (mobile/tablet/desktop)
- ⚡ Fast and optimized with React Query
- 🎨 System fonts (no Google Fonts)

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
│   ├── PostViewModal.tsx # Expanded post view
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

- Search by post text or author name (debounced, 500ms)
- Filter by category (10 categories)
- Date range filtering (dd/mm/yyyy format)
- Sort by: date, likes, comments, shares, engagement rate
- Sort order: ascending or descending
- Enter key triggers filter application

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

- `GET /api/posts` - List posts with filters (search, category, dateFrom, dateTo, sortBy, order, page, limit)
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update existing post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/authors` - Create new author
- `PUT /api/authors/:id` - Update author
- `GET /api/tags` - List all tags
- `GET /api/stats` - Get dashboard statistics (4 metrics)
