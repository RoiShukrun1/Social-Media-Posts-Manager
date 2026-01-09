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

2. Run database migration and import data:

```bash
npm run db:migrate
```

This will:
- Create the database schema (authors, posts, tags, post_tags tables)
- Import data from `../data/social_media_posts_data_clean.csv`
- Set up indexes for optimal query performance

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
│   ├── db/
│   │   ├── database.ts       # Database connection
│   │   ├── schema.ts          # Table creation
│   │   └── migrate.ts         # Migration runner
│   ├── models/
│   │   ├── postModel.ts       # Post queries
│   │   ├── authorModel.ts     # Author queries
│   │   ├── tagModel.ts        # Tag queries
│   │   └── statsModel.ts      # Statistics queries
│   ├── routes/
│   │   ├── posts.ts           # Post endpoints
│   │   ├── authors.ts         # Author endpoints
│   │   ├── tags.ts            # Tag endpoints
│   │   └── stats.ts           # Stats endpoints
│   ├── services/
│   │   └── importService.ts   # CSV import logic
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── server.ts              # Express app
├── data/
│   └── posts.db               # SQLite database (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - Type safety
- **Express** - Web framework
- **better-sqlite3** - Fast SQLite driver
- **Zod** - Schema validation
- **csv-parse** - CSV parsing
- **cors** - CORS middleware

