# Social Media Posts API - Complete Endpoint Reference

## Base URL

```
http://localhost:3000
```

## Health Check

### `GET /health`

Check if the server is running.

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2026-01-08T14:15:54.790Z"
}
```

---

## Posts Endpoints

### `GET /api/posts`

List posts with comprehensive filtering, sorting, and pagination.

**Query Parameters**:
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Results per page (default: 20) | `?limit=50` |
| `sortBy` | string | Sort field: `date`, `likes`, `comments`, `shares`, `engagement_rate` | `?sortBy=likes` |
| `order` | string | Sort order: `ASC` or `DESC` (default: DESC) | `?order=ASC` |
| `search` | string | Search in post text and author name | `?search=innovation` |
| `category` | string | Filter by category | `?category=Technology` |
| `tag` | string | Filter by tag | `?tag=#tech` |
| `authorId` | number | Filter by author ID | `?authorId=123` |
| `dateFrom` | string | Start date (inclusive) | `?dateFrom=2024-01-01` |
| `dateTo` | string | End date (inclusive) | `?dateTo=2024-12-31` |
| `minLikes` | number | Minimum likes | `?minLikes=1000` |
| `minEngagement` | number | Minimum engagement rate | `?minEngagement=5.0` |

**Example Requests**:

```bash
# Basic listing
GET /api/posts?page=1&limit=20

# Search with filters
GET /api/posts?search=AI&category=Technology&sortBy=likes&order=DESC

# Date range filter
GET /api/posts?dateFrom=2024-01-01&dateTo=2024-12-31

# Complex query
GET /api/posts?category=Marketing&minLikes=2000&minEngagement=8.0&sortBy=date&order=DESC
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "Post content...",
      "date": "2024-07-28 15:20:48",
      "likes": 864,
      "comments": 132,
      "shares": 290,
      "category": "Company News",
      "location": "Austin, TX",
      "engagement_rate": 1.54,
      "author": {
        "id": 1,
        "first_name": "Robert",
        "last_name": "Johnson",
        "email": "robert.johnson@digitaldynamics.com",
        "company": "Digital Dynamics",
        "job_title": "Growth Hacker",
        "follower_count": 12680,
        "verified": false
      },
      "tags": ["#growth", "#innovation"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25000,
    "totalPages": 1250
  }
}
```

---

### `GET /api/posts/:id`

Get a single post by ID with full details.

**Example**:

```bash
GET /api/posts/1
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Post content...",
    "date": "2024-07-28 15:20:48",
    "likes": 864,
    "comments": 132,
    "shares": 290,
    "image_svg": "<svg>...</svg>",
    "category": "Company News",
    "location": "Austin, TX",
    "engagement_rate": 1.54,
    "created_at": "2026-01-08 14:15:17",
    "updated_at": "2026-01-08 14:15:17",
    "author": { ... },
    "tags": ["#growth", "#innovation"]
  }
}
```

**Error (404)**:

```json
{
  "success": false,
  "error": "Post not found"
}
```

---

### `POST /api/posts`

Create a new post.

**Request Body**:

```json
{
  "author_id": 1,
  "text": "New post content",
  "date": "2024-12-01 10:00:00",
  "likes": 0,
  "comments": 0,
  "shares": 0,
  "image_svg": "<svg>...</svg>",
  "category": "Technology",
  "location": "San Francisco, CA",
  "engagement_rate": 0,
  "tags": ["#tech", "#innovation"]
}
```

**Required Fields**: `author_id`, `text`, `date`, `category`, `location`

**Optional Fields**: `likes`, `comments`, `shares`, `image_svg`, `engagement_rate`, `tags`

**Response (201)**:

```json
{
  "success": true,
  "data": {
    "id": 25001,
    ...
  }
}
```

---

### `PUT /api/posts/:id` ⭐ NEW

Update an existing post (partial updates supported).

**Request Body** (all fields optional):

```json
{
  "text": "Updated content",
  "category": "Technology",
  "likes": 1000,
  "tags": ["#updated", "#tech"]
}
```

**Examples**:

```bash
# Full update
PUT /api/posts/1
{
  "text": "Updated!",
  "category": "Technology",
  "likes": 1000,
  "tags": ["#new", "#tags"]
}

# Partial update (only likes)
PUT /api/posts/1
{ "likes": 5000 }

# Update tags only
PUT /api/posts/1
{ "tags": ["#tech", "#AI"] }
```

**Response (200)**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Post updated successfully"
}
```

**Errors**:

- **404**: Post not found
- **400**: Validation error (e.g., empty text)

---

### `DELETE /api/posts/:id`

Delete a post.

**Example**:

```bash
DELETE /api/posts/1
```

**Response (200)**:

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error (404)**:

```json
{
  "success": false,
  "error": "Post not found"
}
```

---

## Authors Endpoints

### `GET /api/authors`

List all authors.

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Robert",
      "last_name": "Johnson",
      "email": "robert.johnson@digitaldynamics.com",
      "company": "Digital Dynamics",
      "job_title": "Growth Hacker",
      "bio": "Passionate Growth Hacker at Digital Dynamics. Love what I do!",
      "follower_count": 12680,
      "verified": false
    }
  ]
}
```

---

### `GET /api/authors/:id`

Get a single author by ID.

**Example**:

```bash
GET /api/authors/1
```

---

## Tags Endpoints

### `GET /api/tags`

List all tags.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `withCounts` | boolean | Include post counts for each tag |

**Examples**:

```bash
# Simple list
GET /api/tags

# With post counts
GET /api/tags?withCounts=true
```

**Response (with counts)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "#growth",
      "created_at": "2026-01-08 14:15:17",
      "post_count": 8720
    },
    {
      "id": 2,
      "name": "#innovation",
      "created_at": "2026-01-08 14:15:17",
      "post_count": 8708
    }
  ]
}
```

---

## Statistics Endpoint

### `GET /api/stats`

Get dashboard statistics and analytics.

**Response**:

```json
{
  "success": true,
  "data": {
    "totalPosts": 25000,
    "totalAuthors": 3991,
    "totalTags": 8,
    "totalLikes": 62356383,
    "totalComments": 15089311,
    "totalShares": 9976818,
    "avgEngagementRate": 8.05,
    "postsByCategory": [
      { "category": "Technology", "count": 4268 },
      { "category": "Industry Insights", "count": 4218 },
      { "category": "Company News", "count": 4196 },
      { "category": "Marketing", "count": 4172 },
      { "category": "Product", "count": 4097 },
      { "category": "Business", "count": 4049 }
    ],
    "topAuthors": [
      {
        "id": 332,
        "first_name": "Daniel",
        "last_name": "Taylor",
        "post_count": 17,
        "total_likes": 43104
      }
    ],
    "topTags": [
      { "name": "#growth", "count": 8720 },
      { "name": "#innovation", "count": 8708 },
      { "name": "#tech", "count": 8686 }
    ],
    "recentPosts": 170
  }
}
```

---

## Error Responses

All endpoints follow consistent error format:

### 400 - Bad Request / Validation Error

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "message": "String must contain at least 1 character(s)",
      "path": ["text"]
    }
  ]
}
```

### 404 - Not Found

```json
{
  "success": false,
  "error": "Post not found"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## CRUD Operations Summary

| Operation  | Endpoint         | Method | Description               |
| ---------- | ---------------- | ------ | ------------------------- |
| **Create** | `/api/posts`     | POST   | Create new post           |
| **Read**   | `/api/posts`     | GET    | List all posts (filtered) |
| **Read**   | `/api/posts/:id` | GET    | Get single post           |
| **Update** | `/api/posts/:id` | PUT    | Update post (partial) ⭐  |
| **Delete** | `/api/posts/:id` | DELETE | Delete post               |

---

## Quick Reference

### Most Common Use Cases

#### 1. Load posts for main page

```bash
GET /api/posts?page=1&limit=20&sortBy=date&order=DESC
```

#### 2. Search posts

```bash
GET /api/posts?search=innovation&page=1&limit=20
```

#### 3. Filter by category

```bash
GET /api/posts?category=Technology
```

#### 4. Get statistics for dashboard

```bash
GET /api/stats
```

#### 5. Edit a post

```bash
PUT /api/posts/1
{ "text": "Updated content", "likes": 1500 }
```

#### 6. Delete a post

```bash
DELETE /api/posts/1
```

---

## Authentication

⚠️ **Note**: Currently, no authentication is implemented. This is suitable for development/demo purposes only. Production deployment should add:

- JWT authentication
- Role-based access control
- Rate limiting
- API keys

---

## Rate Limiting

Currently not implemented. Consider adding for production.

---

## CORS

CORS is enabled for all origins. Configure appropriately for production.

---

**Server Status**: ✅ Running at http://localhost:3000  
**Documentation**: Up to date as of 2026-01-08  
**Total Endpoints**: 9 (1 health check + 8 API endpoints)
