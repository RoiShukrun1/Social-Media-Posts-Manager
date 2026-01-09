# Social Media Posts Management System - Backend

Backend API for the Social Media Posts Management System, built with Node.js, TypeScript, Express, and SQLite.

## Features

- RESTful API with comprehensive endpoints
- Normalized SQLite database schema
- Automated CSV data import
- Filtering, sorting, and pagination
- Full CRUD operations for posts
- Statistics and analytics endpoints
- Type-safe with TypeScript and Zod validation

## Prerequisites

- Node.js 18+ (works with Node 25)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The server will **automatically** on first startup:

- Create the database schema
- Import all 25,000 posts from `../data/social_media_posts_data_clean.csv` (if database is empty)
- Set up indexes for optimal query performance
- Start on `http://localhost:3000`

**First-time startup takes ~10-15 seconds** to import 25,000 posts.

> **Manual Database Reset**: Run `npm run db:migrate` if you need to reset/rebuild the database

## Usage

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Posts

- `GET /api/posts` - List posts with filtering, sorting, and pagination

  - Query params:
    - `page` (default: 1)
    - `limit` (default: 20)
    - `sortBy` (date | likes | comments | shares | engagement_rate)
    - `order` (ASC | DESC, default: DESC)
    - `category` (filter by category)
    - `search` (search in post text and author name)
    - `dateFrom` (YYYY-MM-DD format, filter by date range start)
    - `dateTo` (YYYY-MM-DD format, filter by date range end)

- `POST /api/posts` - Create new post

  - Body: `{ author_id, text, date, likes?, comments?, shares?, image_svg?, category, location?, engagement_rate?, tags? }`

- `PUT /api/posts/:id` - Update post

  - Body: `{ text?, category?, date?, likes?, comments?, shares?, image_svg?, location?, engagement_rate?, tags? }`
  - All fields optional - only updates provided fields

- `DELETE /api/posts/:id` - Delete post

### Authors

- `POST /api/authors` - Create new author

  - Body: `{ first_name, last_name, email, company?, job_title?, bio?, follower_count?, verified? }`

- `PUT /api/authors/:id` - Update author
  - Body: `{ first_name?, last_name?, email?, company?, job_title?, bio? }`
  - All fields optional - only updates provided fields

### Tags

- `GET /api/tags` - List all tags (alphabetically sorted)

### Statistics

- `GET /api/stats` - Get dashboard statistics
  - Returns: `totalPosts`, `totalLikes`, `totalComments`, `avgEngagementRate`

## Database Schema

```
┌─────────────────┐
│     Authors     │
├─────────────────┤
│ id (PK)         │
│ first_name      │
│ last_name       │
│ email (UNIQUE)  │
│ company         │
│ job_title       │
│ bio             │
│ follower_count  │
│ verified        │
└─────────────────┘
        │
        │ 1:N
        │
┌─────────────────┐      ┌─────────────────┐
│      Posts      │ N:M  │      Tags       │
├─────────────────┤──────├─────────────────┤
│ id (PK)         │      │ id (PK)         │
│ author_id (FK)  │      │ name (UNIQUE)   │
│ text            │      └─────────────────┘
│ date            │              │
│ likes           │              │
│ comments        │      ┌───────────────┐
│ shares          │      │   PostTags    │
│ image_svg       │      ├───────────────┤
│ category        │      │ post_id (FK)  │
│ location        │      │ tag_id (FK)   │
│ created_at      │      └───────────────┘
│ updated_at      │
└─────────────────┘
```

## Project Structure

```
backend/
├── src/
│   ├── config.ts              # Environment configuration
│   ├── constants.ts           # Application constants
│   ├── types.ts               # TypeScript interfaces
│   ├── server.ts              # Express app
│   ├── db/
│   │   ├── database.ts        # Database connection
│   │   ├── schema.ts          # Table creation
│   │   ├── migrate.ts         # Migration runner
│   │   └── import.ts          # CSV import logic
│   ├── models/
│   │   ├── postModel.ts       # Post queries (with N+1 optimization)
│   │   ├── authorModel.ts     # Author queries
│   │   ├── tagModel.ts        # Tag queries
│   │   └── statsModel.ts      # Statistics queries
│   ├── routes/
│   │   ├── posts.ts           # Post endpoints (Zod validation)
│   │   ├── authors.ts         # Author endpoints (Zod validation)
│   │   ├── tags.ts            # Tag endpoints
│   │   └── stats.ts           # Stats endpoints
│   └── utils/
│       └── errorHandler.ts    # Error handling utilities
├── data/
│   └── posts.db               # SQLite database (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features

- **Auto-initialization**: Database schema created automatically on server startup
- **Graceful Shutdown**: Properly closes database connections on SIGINT/SIGTERM signals
- **SQL Injection Protection**: Safe parameterized queries with whitelisted sort fields
- **Zod Validation**: Type-safe request validation for all endpoints
- **N+1 Query Optimization**: Batch tag fetching for optimal performance
- **Type Safety**: Full TypeScript implementation with strict types

## Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - Type safety
- **Express** - Web framework
- **better-sqlite3** - Fast SQLite driver
- **Zod** - Schema validation
- **csv-parse** - CSV parsing
- **cors** - CORS middleware
