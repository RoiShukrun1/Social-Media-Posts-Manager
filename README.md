# 📊 Social Media Posts Management System

A full-stack application for managing social media posts with data cleaning, RESTful API, and beautiful React UI.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

## 🌟 Features

- **📁 25,000+ Posts**: Real social media data cleaned and normalized
- **🔍 Advanced Search**: Search by text, author, category, tags, date range
- **📊 Real-time Stats**: Dashboard with engagement metrics
- **✨ Full CRUD**: Create, Read, Update, Delete operations
- **🎨 Beautiful UI**: Modern design with Tailwind CSS
- **⚡ Fast & Responsive**: Optimized performance with React Query
- **🎯 Type-Safe**: Full TypeScript implementation

## 📸 Screenshots

### Dashboard
![Dashboard with stats and post listing]

### Create/Edit Post
![Modal form for creating/editing posts]

### Filters
![Advanced filtering options]

## 🏗 Architecture

### Tech Stack

**Frontend**:
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (data fetching)
- Axios (HTTP client)

**Backend**:
- Node.js + TypeScript
- Express.js (REST API)
- SQLite3 with better-sqlite3
- Zod (validation)

**Data Processing**:
- Python 3 + pandas
- Data cleaning and normalization
- CSV processing

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.14+ (for data cleaning)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-media-posts-manager
```

### 2. Data Cleaning (One-time setup)

```bash
cd scripts
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python clean_csv.py
```

This will:
- Clean all 25,000 rows
- Fix 12 data quality issues
- Generate `data/social_media_posts_data_clean.csv`
- Create `data/data_quality_report.json`

### 3. Backend Setup

```bash
cd backend
npm install
npm run db:migrate  # Creates database and imports data
npm run dev         # Starts server on http://localhost:3000
```

The backend will:
- Create SQLite database
- Import all 25,000 posts
- Start Express server
- Enable CORS for frontend

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts dev server on http://localhost:5173
```

The frontend will open automatically in your browser.

## 📁 Project Structure

```
social-media-posts-manager/
├── scripts/                      # Data cleaning scripts
│   ├── clean_csv.py             # Main cleaning script
│   ├── requirements.txt         # Python dependencies
│   └── CSV_CLEANING_PROCESS.md  # Cleaning documentation
├── data/
│   ├── social_media_posts_data.csv        # Original corrupted data
│   ├── social_media_posts_data_clean.csv  # Cleaned data
│   └── data_quality_report.json           # Quality report
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts      # SQLite connection
│   │   │   ├── schema.ts        # Database schema
│   │   │   └── migrate.ts       # Migration script
│   │   ├── models/              # Data models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── types/               # TypeScript types
│   │   └── server.ts            # Express server
│   ├── data/
│   │   └── posts.db             # SQLite database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API client
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx              # Main app
│   │   └── main.tsx             # Entry point
│   ├── tailwind.config.js       # Tailwind config
│   └── package.json
└── README.md
```

## 📡 API Endpoints

### Posts
- `GET /api/posts` - List posts (with filters, sorting, pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Authors
- `GET /api/authors` - List all authors
- `GET /api/authors/:id` - Get single author

### Tags
- `GET /api/tags?withCounts=true` - List tags with post counts

### Stats
- `GET /api/stats` - Get dashboard statistics

See [API_ENDPOINTS.md](API_ENDPOINTS.md) for detailed documentation.

## 🧹 Data Cleaning

The original dataset had **12 types of data quality issues** affecting thousands of rows:

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
12. **Data Validation** - Range checks applied

See [scripts/CSV_CLEANING_PROCESS.md](scripts/CSV_CLEANING_PROCESS.md) for details.

## 🎨 Design System

### Colors
- **Primary**: `#4299e1` (Blue)
- **Secondary**: `#48bb78` (Green)
- **Background**: `#f5f7fa` (Light Gray)

### Spacing
- 8px grid system: 8px, 16px, 24px, 32px

### Components
- Cards: 12px border radius, subtle shadows
- Buttons: 8px border radius, smooth transitions
- All interactive elements: hover effects

### Icons (Emojis)
✏️ Edit | 🗑️ Delete | ➕ Add | 👍 Likes | 💬 Comments | 📊 Shares

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run dev

# In another terminal
curl http://localhost:3000/health
curl http://localhost:3000/api/stats
curl "http://localhost:3000/api/posts?limit=5"
```

### Frontend Testing
1. Start both servers (backend + frontend)
2. Open http://localhost:5173
3. Test features:
   - View posts with pagination
   - Search and filter
   - Create new post
   - Edit existing post
   - Delete post
   - Check responsive design

## 📊 Database Statistics

- **25,000** Posts
- **3,991** Unique Authors
- **11** Tags
- **10** Categories
- **~500MB** Total data size

## 🎯 Features Implemented

### Phase 1: Data Cleaning ✅
- [x] Python cleaning script
- [x] 12 issue categories fixed
- [x] Quality report generated
- [x] Clean CSV output

### Phase 2: Backend API ✅
- [x] Normalized SQLite schema
- [x] Data import on startup
- [x] 9 REST API endpoints
- [x] Advanced filtering
- [x] Sorting and pagination
- [x] Validation with Zod
- [x] Error handling

### Phase 3: Frontend ✅
- [x] React + TypeScript + Tailwind
- [x] Dashboard with stats
- [x] Post listing with filters
- [x] Search functionality
- [x] Create/Edit/Delete modals
- [x] Pagination
- [x] Loading states
- [x] Empty states
- [x] Responsive design
- [x] Accessibility

## 🔧 Configuration

### Backend Port
Default: `3000`
Change in: `backend/src/server.ts`

### Frontend Port
Default: `5173`
Change in: `frontend/vite.config.ts`

### Database Location
Default: `backend/data/posts.db`
Change in: `backend/src/db/database.ts`

## 📝 Documentation

- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Complete API reference
- [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) - Backend implementation details
- [FRONTEND_COMPLETE.md](FRONTEND_COMPLETE.md) - Frontend implementation details
- [scripts/CSV_CLEANING_PROCESS.md](scripts/CSV_CLEANING_PROCESS.md) - Data cleaning process
- [QUICK_START.md](QUICK_START.md) - Quick start guide

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run db:migrate
npm run dev
```

### Frontend build errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database issues
```bash
cd backend
rm data/posts.db
npm run db:migrate
```

## 🤝 Contributing

This is a portfolio/demo project. Feel free to fork and modify for your own use.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Created as part of a full-stack development exercise.

## 🎉 Acknowledgments

- Figma design provided by the exercise specification
- Sample data includes 25,000 realistic social media posts
- Built with modern web technologies and best practices

---

**Made with ❤️ using React, TypeScript, Node.js, and SQLite**
