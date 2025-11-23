# 📚 FocusFlow AI - API Documentation

Complete API reference for all endpoints in the FocusFlow AI application.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

## Authentication

All authenticated endpoints require a valid JWT token, which can be sent via:
- **HTTP-only Cookie**: `token` (automatically set on login)
- **Authorization Header**: `Authorization: Bearer <token>`

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "65abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "focusDuration": 25,
      "breakDuration": 5
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- `400`: Missing required fields
- `409`: User already exists

---

### Login User
**POST** `/api/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "65abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {...}
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- `400`: Missing credentials
- `401`: Invalid email or password

---

### Logout User
**POST** `/api/auth/logout`

Clear authentication cookie.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### Get Current User
**GET** `/api/auth/me`

Get the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "65abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {...},
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `401`: Authentication required

---

## ✅ Task Endpoints

### Get All Tasks
**GET** `/api/tasks`

Retrieve all tasks for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (`todo`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)

**Example:**
```
GET /api/tasks?status=todo&priority=high
```

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "65abc456...",
      "userId": "65abc123...",
      "title": "Complete project proposal",
      "description": "Finish the Q1 project proposal",
      "status": "in-progress",
      "priority": "high",
      "deadline": "2024-02-01T00:00:00.000Z",
      "aiSuggestions": [],
      "tags": ["work", "urgent"],
      "estimatedTime": 120,
      "actualTime": 60,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

---

### Create Task
**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Finish the Q1 project proposal",
  "priority": "high",
  "deadline": "2024-02-01",
  "tags": ["work", "urgent"],
  "estimatedTime": 120
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "65abc456...",
    "title": "Complete project proposal",
    "status": "todo",
    "priority": "high",
    ...
  }
}
```

**Errors:**
- `400`: Title is required
- `401`: Authentication required

---

### Update Task
**PATCH** `/api/tasks/[id]`

Update an existing task.

**Request Body (partial update):**
```json
{
  "status": "completed",
  "actualTime": 90
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {...}
}
```

**Errors:**
- `404`: Task not found
- `401`: Authentication required

---

### Delete Task
**DELETE** `/api/tasks/[id]`

Delete a task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- `404`: Task not found
- `401`: Authentication required

---

## 🤖 AI Endpoints

### Generate Task Plan
**POST** `/api/ai/plan`

Use AI to generate a structured task plan.

**Request Body:**
```json
{
  "tasks": [
    "Complete project proposal",
    "Review code changes",
    "Update documentation"
  ]
}
```

**Response (200):**
```json
{
  "message": "Task plan generated successfully",
  "plan": "[{\"task\":\"Complete project proposal\",\"priority\":\"high\",...}]"
}
```

---

### Generate Daily Schedule
**POST** `/api/ai/schedule`

Generate an optimized daily schedule.

**Request Body:**
```json
{
  "tasks": ["Task 1", "Task 2"],
  "workingHours": {
    "start": "09:00",
    "end": "17:00"
  },
  "preferences": {
    "focusDuration": 25,
    "breakDuration": 5
  }
}
```

**Response (200):**
```json
{
  "message": "Daily schedule generated successfully",
  "schedule": "[{\"time\":\"09:00\",\"activity\":\"...\"}]"
}
```

---

### Summarize Note
**POST** `/api/ai/summary`

Generate AI summary of note content.

**Request Body:**
```json
{
  "content": "Long note content here..."
}
```

**Response (200):**
```json
{
  "message": "Summary generated successfully",
  "summary": "Main points:\n1. ...\n2. ...\n\nAction items:\n- ..."
}
```

---

### Get Motivation
**POST** `/api/ai/motivation`

Get AI-powered motivation and tips.

**Request Body:**
```json
{
  "context": "Feeling overwhelmed with tasks",
  "mood": "stressed"
}
```

**Response (200):**
```json
{
  "message": "Motivation generated successfully",
  "motivation": "Remember: progress over perfection!..."
}
```

---

## 📝 Notes Endpoints

### Get All Notes
**GET** `/api/notes`

Retrieve all notes for the authenticated user.

**Response (200):**
```json
{
  "notes": [
    {
      "_id": "65abc789...",
      "userId": "65abc123...",
      "title": "Meeting Notes",
      "content": "Discussed Q1 goals...",
      "summary": "",
      "tags": ["work", "meeting"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Create Note
**POST** `/api/notes`

Create a new note.

**Request Body:**
```json
{
  "title": "Meeting Notes",
  "content": "Discussed Q1 goals and objectives...",
  "tags": ["work", "meeting"]
}
```

**Response (201):**
```json
{
  "message": "Note created successfully",
  "note": {...}
}
```

**Errors:**
- `400`: Title and content are required

---

## 🎯 Goals Endpoints

### Get All Goals
**GET** `/api/goals`

Retrieve all goals for the authenticated user.

**Response (200):**
```json
{
  "goals": [
    {
      "_id": "65abcabc...",
      "userId": "65abc123...",
      "title": "Learn Spanish",
      "description": "Become conversationally fluent",
      "targetDate": "2024-06-01T00:00:00.000Z",
      "progress": 30,
      "milestones": [
        {
          "title": "Complete beginner course",
          "completed": true,
          "completedAt": "2024-01-10T00:00:00.000Z"
        }
      ],
      "category": "learning",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Create Goal
**POST** `/api/goals`

Create a new goal.

**Request Body:**
```json
{
  "title": "Learn Spanish",
  "description": "Become conversationally fluent",
  "targetDate": "2024-06-01",
  "category": "learning",
  "milestones": [
    {
      "title": "Complete beginner course",
      "completed": false
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Goal created successfully",
  "goal": {...}
}
```

---

## ⏱️ Focus Session Endpoints

### Get Focus Sessions
**GET** `/api/focus`

Retrieve focus sessions.

**Query Parameters:**
- `limit` (optional): Number of sessions to return (default: 50)

**Response (200):**
```json
{
  "sessions": [
    {
      "_id": "65abcdef...",
      "userId": "65abc123...",
      "taskId": "65abc456...",
      "duration": 25,
      "completedDuration": 25,
      "type": "focus",
      "startedAt": "2024-01-15T10:00:00.000Z",
      "completedAt": "2024-01-15T10:25:00.000Z",
      "interrupted": false,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Create Focus Session
**POST** `/api/focus`

Start a new focus session.

**Request Body:**
```json
{
  "taskId": "65abc456...", // optional
  "duration": 25,
  "type": "focus" // "focus" | "short-break" | "long-break"
}
```

**Response (201):**
```json
{
  "message": "Focus session started",
  "session": {...}
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:
- Consider using rate limiting middleware
- Groq API has its own rate limits (check Groq documentation)

---

## Data Models

### Task Status Values
- `todo` - Not started
- `in-progress` - Currently working on
- `completed` - Finished

### Task Priority Values
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority / Urgent

### Focus Session Types
- `focus` - Work/focus session (default: 25 min)
- `short-break` - Short break (default: 5 min)
- `long-break` - Long break (default: 15 min)

### Goal Categories
- `personal` - Personal goals
- `work` - Work-related goals
- `health` - Health & fitness
- `learning` - Learning & education
- `financial` - Financial goals

---

## Example API Calls

### Using fetch (JavaScript)
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});
const data = await response.json();
```

### Using curl
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get tasks (with token)
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Need Help?

- Check main README.md for setup instructions
- Review DEPLOYMENT.md for deployment guide
- Ensure environment variables are set correctly
- Verify MongoDB and Groq API connectivity

---

**Happy building! 🚀**
