# Social Media Posts Manager - Frontend

React + TypeScript + Tailwind CSS frontend for managing social media posts.

## Features

- 📊 Real-time statistics dashboard
- 🔍 Advanced filtering and search (debounced)
- 📅 Date range filtering (dd/mm/yyyy)
- 🔤 Category filtering (case-insensitive)
- 📈 Sort by multiple metrics (desc order by defalut)
- ➕ Create new posts with inline validation
- 🖼️ Image uploader with drag-and-drop and preview (max 5MB)
- 👤 Create authors dynamically (free text fields on the post modal)
- ✏️ Edit existing posts and author details
- 🗑️ Delete posts with confirmation
- 👁️ Expand posts to view full text (click on card)
- ⌨️ Enter key support for filters
- ♿ Full accessibility (ARIA labels, keyboard navigation)
- 📱 Fully responsive design (mobile/tablet/desktop)
- ⚡ Fast and optimized with React Query
- 🎨 System fonts (no Google Fonts)
- 🏗️ Clean architecture with custom hooks

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
├── api.ts                    # API client (axios + endpoints)
├── App.tsx                   # Main application
├── main.tsx                  # Entry point
├── index.css                 # Global styles
├── components/               # React components
│   ├── Filters.tsx           # Filter controls
│   ├── forms/                # Form components (5 files)
│   │   ├── AuthorFormSection.tsx
│   │   ├── PostFormSection.tsx
│   │   ├── PostModalActions.tsx
│   │   ├── TagSelection.tsx
│   │   └── ImageUploader.tsx
│   ├── modals/              # Modal components (3 files)
│   │   ├── PostModal.tsx           # Create/edit post modal
│   │   ├── PostViewModal.tsx       # Expanded post view
│   │   └── DeleteModal.tsx         # Delete confirmation
│   └── ui/                  # UI components (6 files)
│       ├── StatsHeader.tsx         # Statistics dashboard
│       ├── PostCard.tsx            # Post display card
│       ├── Pagination.tsx          # Pagination controls
│       ├── LoadingSkeleton.tsx     # Loading state
│       ├── EmptyState.tsx          # Empty state display
│       └── ToastProvider.tsx       # Toast notifications
├── constants/               # App constants
│   ├── categories.ts               # Post categories
│   └── config.ts                   # Configuration values
├── hooks/                   # Custom React hooks (5 files)
│   ├── usePostManagement.ts        # CRUD operations hook
│   ├── useFilters.ts               # Filter state management
│   ├── useModals.ts                # Modal state management
│   ├── useBodyScrollLock.ts        # Scroll locking for modals
│   └── useEscapeKey.ts             # ESC key handler
├── types/                   # TypeScript types
│   ├── index.ts                    # Main types
│   ├── errors.ts                   # Error handling types
│   └── events.ts                   # Event types
└── utils/                   # Utility functions
    └── formatters.ts               # Date/number formatters
```

## Features in Detail

### Filtering

- Search by post text or author name (debounced, 500ms)
- Filter by category (7 categories)
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

All API calls are in `src/api.ts` with proper error handling:

### Endpoints Used

**Posts**:

- `GET /api/posts` - List posts with filters (search, category, dateFrom, dateTo, sortBy, order, page, limit)
- `POST /api/posts` - Create new post with Zod validation
- `PUT /api/posts/:id` - Update existing post
- `DELETE /api/posts/:id` - Delete post

**Authors**:

- `POST /api/authors` - Create new author with Zod validation
- `PUT /api/authors/:id` - Update author with Zod validation

**Tags & Stats**:

- `GET /api/tags` - List all tags (sorted alphabetically)
- `GET /api/stats` - Dashboard statistics (totalPosts, totalLikes, totalComments, avgEngagementRate)

### Error Handling

- Proper error extraction from API responses
- Detailed validation error messages
- User-friendly toast notifications
