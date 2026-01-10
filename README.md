# Social Media Posts Management System

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

## Design Decisions & Assignment Clarifications

### Data Cleaning Approach

**Missing Data Handling**: Preserved NULL values for fields with missing data in the original CSV (such as `location`, `image_svg`, `bio`, etc.) rather than generating synthetic data. The only exception is `total_engagements`, which was calculated as `likes + comments` when missing or incorrect, as this could be reliably derived from existing data.

**Data Integrity Priority**: Modified only data that posed security risks or violated data integrity:

- Removed SQL injection patterns (`'; --`, `'OR'1'='1`)
- Fixed malformed email addresses (double `@@` symbols, consecutive dots like `..com`)
- Sanitized control characters (`\n`, `\t`, `\r`, `\x00`)
- Preserved all other original content, including typos in names/text, to maintain data authenticity

### Database Architecture

**Normalized Schema**: Separated the database into 4 tables (Authors, Posts, Tags, PostTags) to follow database normalization best practices:

- **Authors ↔ Posts**: One-to-many relationship prevents author data duplication
- **Posts ↔ Tags**: Many-to-many relationship with junction table `PostTags`
- **Trade-off Note**: This normalization approach improves data integrity but adds JOIN overhead. In high-traffic production systems with millions of posts, denormalization (embedding tags as JSON) might be preferred for read performance, though it sacrifices update flexibility and storage efficiency.

**No ORM Framework**: Implemented direct SQL queries using `better-sqlite3` rather than an ORM like Prisma or TypeORM. This decision was made to Maintain full control over query optimization and Avoid adding heavy dependencies for this project's scope.

### UI/UX Decisions

**Filter Input Types**: The Figma design shows all filters as text inputs, which was preserved in the implementation. However, added real-time inline validation to provide immediate feedback for:

- Invalid date formats (expects `dd/mm/yyyy`)
- Invalid category names (case-insensitive matching against 7 valid categories)
- Invalid sort type (date, likes, comments, shares, engagement rate)
- Date range logic errors (start date after end date)

**Search Functionality**: The "free search" filter searches across multiple fields:

- Post text content
- Author first name
- Author last name

**Sort Order**: The Figma design doesn't specify ascending vs. descending sort order, so I implemented Descending order by default.

### Engagement Rate Calculation

**Formula for New Posts**: Since the assignment didn't specify an engagement rate formula, For new posts i created one based on the existing CSV data patterns. The calculated formula is:

```
engagement_rate = (total_engagements / author_follower_count) × 100
where: total_engagements = likes + comments
```

### Technical Choices & Assumptions

**Pagination**: Default page size of 20 posts per page, matching common industry practices for list views. This balances Initial load performance, User scrolling experience and Database query efficiency.

**Author Uniqueness**: Authors are identified by email address.

**Image Format**: Only raster images (PNG, JPG, etc.) are supported via base64 encoding. The original CSV contained "SVG" references, but the implementation stores any image format as data URLs.

**Single-User System**: No authentication or multi-user support. All operations assume a single trusted user.

### Additional Features

- Click-to-expand post details (full text view)
- Designed Modal interface for creating and editing posts
- Drag-and-drop image upload (in addition to file picker)
- Real-time validation feedback
- Toast notifications for user actions

## Process Phases

### Phase 1: Data Cleaning ✅

- [x] Python cleaning script
- [x] 12 issue categories fixed
- [x] Quality report generated
- [x] Clean CSV output

### Phase 2: Backend API ✅

- [x] Normalized SQLite schema
- [x] Data import on startup
- [x] 8 REST API endpoints
- [x] Advanced filtering
- [x] Sorting and pagination
- [x] Validation with Zod
- [x] Error handling
- [x] Graceful database shutdown

### Phase 3: Frontend ✅

- [x] React + TypeScript + Tailwind
- [x] Exact design as the figma with further features
- [x] Search functionality
- [x] Create/Edit/Delete modals
- [x] Image uploader with drag-and-drop
- [x] Pagination
- [x] Loading states
- [x] Empty states
- [x] Responsive design
- [x] Accessibility

## Data Cleaning

The original dataset had **11 types of data quality issues** affecting thousands of rows:

### Issues Fixed

1. **Column Headers** - Trailing spaces removed
2. **Date Formats** - 3 formats normalized to ISO 8601
3. **Numeric Quotes** - 7,409 values cleaned
4. **Boolean Values** - 6 variations standardized
5. **Email Corruption** - 1,269 emails fixed (@@, ..)
6. **SQL Injection** - 1,253 malicious patterns removed
7. **Engagement Calculation** - 4,966 incorrect values fixed
8. **Extra Commas** - 1,228 text fields cleaned
9. **Missing Images** - 10,015 null values standardized
10. **Duplicate Tags** - 11,469 duplicates removed
11. **JSON Format** - 25,000 arrays standardized

See [scripts/CSV_CLEANING_PROCESS.md](scripts/CSV_CLEANING_PROCESS.md) for details.

## Architecture

### Tech Stack

**Data Processing**:

- Python 3 + pandas
- Data cleaning and normalization
- CSV processing

**Backend**:

- Node.js + TypeScript
- Express.js (REST API)
- SQLite3 with better-sqlite3
- Zod (validation)
- [backend/README.md](backend/README.md) - Backend setup and API details

**Frontend**:

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (data fetching)
- Axios (HTTP client)
- [frontend/README.md](frontend/README.md) - Frontend setup and components

## Project Structure

```
social-media-posts-manager/
├── package.json                 # Root scripts for unified dev experience
├── scripts/                     # Data cleaning scripts
│   ├── clean_csv.py             # Main cleaning script
│   ├── requirements.txt         # Python dependencies
│   └── CSV_CLEANING_PROCESS.md  # Cleaning documentation
├── data/
│   ├── social_media_posts_data.csv        # Original corrupted data
│   ├── social_media_posts_data_clean.csv  # Cleaned data
│   └── data_quality_report.json           # Quality report
├── backend/
│   ├── src/
│   │   ├── config.ts            # Environment configuration
│   │   ├── constants.ts         # Application constants
│   │   ├── types.ts             # TypeScript types
│   │   ├── server.ts            # Express server
│   │   ├── db/
│   │   │   ├── database.ts      # SQLite connection
│   │   │   ├── schema.ts        # Database schema
│   │   │   ├── migrate.ts       # Migration script
│   │   │   └── import.ts        # CSV import logic
│   │   ├── models/              # Data models (4 files)
│   │   ├── routes/              # API routes (4 files)
│   │   └── utils/               # Utility functions
│   ├── data/
│   │   └── posts.db             # SQLite database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.ts               # API client
│   │   ├── App.tsx              # Main app
│   │   ├── main.tsx             # Entry point
│   │   ├── components/          # React components
│   │   │   ├── forms/           # Form components (5 files)
│   │   │   ├── modals/          # Modal components (3 files)
│   │   │   └── ui/              # UI components (6 files)
│   │   ├── constants/           # App constants (2 files)
│   │   ├── hooks/               # Custom hooks (5 files)
│   │   │   ├── usePostManagement.ts   # CRUD operations on posts
│   │   │   ├── useFilters.ts          # Filter state management
│   │   │   ├── useModals.ts           # Modal state management
│   │   │   ├── useBodyScrollLock.ts   # Scroll locking
│   │   │   └── useEscapeKey.ts        # ESC key handler
│   │   ├── types/               # TypeScript types (3 files)
│   │   └── utils/               # Utility functions
│   ├── tailwind.config.js       # Tailwind config
│   └── package.json
└── README.md
```

### Database Schema

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
│ engagement_rate │      └───────────────┘
└─────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+ (for data cleaning)
- npm or yarn

### Option 1: Quick Start (Recommended)

**From the project root**, run everything with single commands:

```bash
# 1. Clone repository
git clone <repository-url>
cd social-media-posts-manager

# 2. Install all dependencies (backend + frontend)
npm run install:all

# 3. Run both servers concurrently in one terminal
npm run dev
```

That's it! The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Option 2: Manual Setup (Step-by-Step)

If you prefer to run services separately on 2 or 3 terminals:

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-media-posts-manager
```

#### 2. Data Cleaning (One-time setup)

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python clean_csv.py
cd ..
```

This will:

- Clean all 25,000 rows
- Fix 11 data quality issues
- Generate `data/social_media_posts_data_clean.csv`
- Create `data/data_quality_report.json`

#### 3. Backend Setup

```bash
cd backend
npm install
npm run dev         # Starts server on http://localhost:3000
```

The backend will **automatically** on first startup:

- Create SQLite database schema
- Import all 25,000 posts from the cleaned CSV
- Start Express server on http://localhost:3000
- Enable CORS for frontend

> **Note**: Database initialization happens only once. If you need to reset the database, run `npm run db:migrate`

**First-time startup:** Process of importing 25,000 posts. You'll see:

```
Initializing database...
✓ Database schema created
Database is empty. Importing data from CSV...
  ✓ Loaded 25000 rows from CSV
  ✓ Created 3991 authors
  ✓ Created 25000 posts
  ✓ Created 11 tags
  ✓ Created [X] post-tag relationships
✓ Data import completed
✓ Database initialized
Server running on http://localhost:3000
```

#### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts dev server on http://localhost:5173
```

The frontend will open automatically in your browser.

## Available Scripts

All scripts can be run from the project root:

### Development

```bash
npm run dev              # Run both backend + frontend concurrently
npm run dev:backend      # Run only backend server
npm run dev:frontend     # Run only frontend server
```

### Installation

```bash
npm run install:all      # Install dependencies for backend + frontend
npm run install:backend  # Install only backend dependencies
npm run install:frontend # Install only frontend dependencies
```

### Production Build

```bash
npm run build            # Build both backend + frontend
npm run start            # Start both in production mode
```

### Data Management

```bash
npm run clean-data       # Re-run CSV cleaning script
npm run db:reset         # Reset and rebuild database
```

## API Endpoints

### Posts

- `GET /api/posts` - List posts with filters, sorting, and pagination
  - Query params: `search`, `category`, `dateFrom`, `dateTo`, `sortBy`, `order`, `page`, `limit`
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update existing post
- `DELETE /api/posts/:id` - Delete post

### Authors

- `POST /api/authors` - Create new author
- `PUT /api/authors/:id` - Update author details

### Tags

- `GET /api/tags` - List all tags (alphabetically sorted)

### Stats

- `GET /api/stats` - Dashboard statistics
  - Returns: `totalPosts`, `totalLikes`, `totalComments`, `avgEngagementRate`

**Base URL**: `http://localhost:3000/api`

All endpoints return JSON with `{ success: boolean, data: any }` format.

## Configuration

### Backend Port

Default: `3000`
Change in: `backend/src/server.ts`

### Frontend Port

Default: `5173`
Change in: `frontend/vite.config.ts`

### Database Location

Default: `backend/data/posts.db`
Change in: `backend/src/db/database.ts`

## Documentation

- [scripts/CSV_CLEANING_PROCESS.md](scripts/CSV_CLEANING_PROCESS.md) - Data cleaning process
- [backend/README.md](backend/README.md) - Backend setup and API details
- [frontend/README.md](frontend/README.md) - Frontend setup and components
- [humaz assignment presentation.mp4](humaz%20assignment%20presentation.mp4) - Presentation video

## Author

Roi Shukrun
