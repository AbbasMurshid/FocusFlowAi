# 🚀 FocusFlow AI - AI-Powered Productivity Platform

A comprehensive productivity web application powered by AI (Google Gemini API with gemini-1.5-flash) to help you manage tasks, track focus sessions, set goals, and boost your productivity.

## 🌐 Live Demo

**Try it now:** [https://focusflowai-quo0.onrender.com](https://focusflowai-quo0.onrender.com)

> **Note:** The app is hosted on Render's free tier, which spins down after 15 minutes of inactivity. First load may take 30-60 seconds. Please be patient!

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 Core Features
- **Task Management** - Create, organize, and track tasks with priorities and deadlines
- **Focus Timer** - Pomodoro-style timer to track focused work sessions
- **Notes System** - Create and manage notes with rich text support
- **Goal Tracking** - Set goals with milestones and track progress
- **Habit Tracker** - Build and track daily/weekly habits with streak tracking
- **Analytics Dashboard** - View productivity statistics and insights
- **AI Assistant** - AI-powered task suggestions and scheduling (powered by Google Gemini)

### 🎨 UI/UX Highlights
- **Modern Glassmorphism Design** - Beautiful blur effects and transparent cards
- **Smooth Animations** - Powered by Framer Motion
- **Gradient Accents** - Purple & Aqua color scheme
- **Fully Mobile Responsive** - Optimized for all devices and screen sizes
- **Dark Theme** - Beautiful dark mode interface
- **Premium Components** - Custom-designed UI elements

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **Email Verification** - Verify user accounts via email
- **Password Reset** - Forgot password functionality with email tokens
- **Multi-Factor Authentication (MFA)** - Optional 2FA with TOTP
- **Protected API Routes** - Server-side route protection
- **Account Management** - Delete or reset account data

## 📋 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Toast notifications
- **Heroicons** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB Atlas** - Cloud database (Free tier)
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### AI Integration
- **Google Gemini API** - Fast AI inference
- **gemini-1.5-flash** - Optimized for speed and quality
- **gemini-1.5-pro** - Advanced model for complex tasks

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Step 1: Clone & Install
```bash
cd FocusFlow-AI
npm install
```

### Step 2: Environment Variables
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection (replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/focusflow?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random

# JWT Expiration
JWT_EXPIRES_IN=7d

# Google Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Resend Email API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_your_resend_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier (0.5 GB storage)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Databases" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `focusflow`

### Step 4: Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste into `.env.local`

### Step 5: Setup Email Service (Resend)

The app uses **Resend** for sending verification emails and password reset links.

1. **Create Resend Account**
   - Go to [Resend.com](https://resend.com)
   - Sign up for a free account (100 emails/day on free tier)

2. **Get API Key**
   - Go to [API Keys](https://resend.com/api-keys)
   - Click "Create API Key"
   - Give it a name (e.g., "FocusFlow Production")
   - Copy the API key (starts with `re_`)
   - Add to `.env.local` as `RESEND_API_KEY`

3. **Setup Domain (Optional but Recommended)**
   - **For Testing**: Use the default `onboarding@resend.dev` domain
   - **For Production**:
     - Go to Domains → Add Domain
     - Add your domain (e.g., `yourdomain.com`)
     - Add DNS records (SPF, DKIM)
     - Verify domain
     - Update email sender in `lib/mail.ts`

4. **Email Features Enabled**
   - ✅ Email verification on signup
   - ✅ Password reset emails
   - ✅ Resend verification code option

> **Note**: Without Resend API key, email features will fail gracefully but users won't receive verification emails. The app will still function for tasks, notes, goals, and habits.

### Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel (Recommended - Free Tier Available)

Vercel is the best platform for Next.js applications with automatic deployments and excellent performance.

#### Prerequisites
- GitHub account with your code pushed
- Vercel account (sign up at [vercel.com](https://vercel.com))
- All required API keys ready (MongoDB, Gemini, Resend)

#### Step-by-Step Deployment

1. **Prepare Your Repository**
   
   Your code should already be on GitHub. If not:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Click "Import" next to your `FocusFlowAi` repository
   - If not connected, authorize Vercel to access your GitHub account

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - Click "Deploy" (it will fail first time - that's okay!)

4. **Add Environment Variables**
   
   After first deployment fails, go to:
   - Project Settings → Environment Variables
   - Add each variable from your `.env.local` file:

   | Variable Name | Value | Notes |
   |---------------|-------|-------|
   | `MONGODB_URI` | Your MongoDB connection string | From MongoDB Atlas |
   | `JWT_SECRET` | Your JWT secret key | Use a strong random string (32+ chars) |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration time |
   | `GEMINI_API_KEY` | Your Gemini API key | From Google AI Studio |
   | `RESEND_API_KEY` | Your Resend API key | From Resend dashboard |
   | `NEXT_PUBLIC_APP_URL` | Your Vercel domain | e.g., `https://yourapp.vercel.app` |

   **Important**: 
   - Make sure to add variables to **Production**, **Preview**, and **Development** environments
   - Click "Save" after adding all variables

5. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete (~2-3 minutes)

6. **Verify Deployment**
   - Visit your Vercel URL (e.g., `https://yourapp.vercel.app`)
   - Test signup/login functionality
   - Verify email verification works
   - Create a test task, note, or habit

7. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Wait for DNS propagation (~24 hours)

#### Automatic Deployments

Every push to your `main` branch will automatically trigger a new deployment on Vercel!

---

### Alternative: Deploy to Render (Free Tier Available)

Render is a good alternative if you prefer a different platform or need more control.

#### Step-by-Step for Render

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `FocusFlowAi` repository

3. **Configure Service**
   - **Name**: `focusflow-ai` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**
   
   In the "Environment" section, add:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   GEMINI_API_KEY=your_gemini_key
   RESEND_API_KEY=re_your_resend_key
   NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment (~5-10 minutes)
   - Render will provide your app URL

6. **Update App URL**
   - Copy your Render URL (e.g., `https://focusflow-ai.onrender.com`)
   - Update `NEXT_PUBLIC_APP_URL` in environment variables
   - Trigger manual redeploy

#### Important Notes for Render
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for production use

---

### Post-Deployment Checklist

After deploying to either platform:

- [ ] Test user registration with email verification
- [ ] Test login/logout functionality
- [ ] Verify email delivery (check spam folder)
- [ ] Test password reset flow
- [ ] Create test data (tasks, notes, goals, habits)
- [ ] Test AI features (task assistant, schedule, coach)
- [ ] Verify analytics dashboard loads
- [ ] Test MFA setup (if enabled)
- [ ] Check mobile responsiveness
- [ ] Monitor for any console errors

### Troubleshooting Deployment Issues

**Build Fails**
- Check all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Verify no TypeScript errors locally: `npm run build`

**Email Not Sending**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for email logs
- Ensure domain is verified (for production)

**Database Connection Issues**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MongoDB connection string format
- Ensure database user has correct permissions

**AI Features Not Working**
- Verify `GEMINI_API_KEY` is valid
- Check Google AI Studio quota limits
- Review API error logs in Vercel/Render dashboard

## 📁 Project Structure

```
FocusFlow-AI/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── tasks/       # Task CRUD operations
│   │   ├── notes/       # Notes management
│   │   ├── goals/       # Goal tracking
│   │   ├── focus/       # Focus sessions
│   │   └── ai/          # AI endpoints (Gemini)
│   ├── auth/            # Auth pages (login/register)
│   ├── dashboard/       # Main dashboard
│   ├── tasks/           # Tasks page
│   ├── focus/           # Focus timer page
│   ├── notes/           # Notes page
│   ├── goals/           # Goals page
│   ├── analytics/       # Analytics page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   ├── Sidebar.tsx
│   └── TaskCard.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── lib/                 # Utilities
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # Auth utilities
│   ├── groq.ts         # Gemini AI functions (legacy filename)
│   └── middleware.ts   # API middleware
├── models/              # Mongoose models
│   ├── User.ts
│   ├── Task.ts
│   ├── Note.ts
│   ├── Goal.ts
│   └── FocusSession.ts
├── types/               # TypeScript types
│   └── global.d.ts
├── public/              # Static assets
├── .env.local.example   # Environment template
├── next.config.js       # Next.js config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/resend-code` - Resend verification code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PATCH /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PATCH /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `PATCH /api/habits/[id]` - Update habit / Mark complete
- `DELETE /api/habits/[id]` - Archive habit

### Focus Sessions
- `GET /api/focus` - Get focus sessions
- `POST /api/focus` - Create focus session

### AI Features
- `POST /api/ai/task-assistant` - Get AI task suggestions
- `POST /api/ai/schedule` - Generate AI schedule
- `POST /api/ai/coach` - Get AI coaching/motivation

### User Settings
- `PATCH /api/user/settings` - Update user preferences
- `GET /api/user/export` - Export user data
- `POST /api/user/reset` - Reset all user data
- `DELETE /api/user/delete` - Delete user account
- `POST /api/user/mfa/setup` - Setup MFA
- `POST /api/user/mfa/verify` - Verify MFA code
- `POST /api/user/mfa/disable` - Disable MFA


## 🤖 AI Capabilities

The app integrates Google Gemini AI (gemini-1.5-flash) for:

1. **Task Assistant** - AI-powered task suggestions and prioritization
2. **Smart Scheduling** - Generate optimized daily schedules based on tasks
3. **Productivity Coaching** - Get personalized motivation and guidance
4. **Intelligent Insights** - Analyze your productivity patterns


## 🎨 Design System

### Colors
- **Primary**: `#6C5CE7` (Purple)
- **Accent**: `#00CEC9` (Aqua)
- **Background**: `#0F0F17` (Dark)
- **Cards**: Glassmorphism with blur

### Typography
- **Headings**: Poppins
- **Body**: Inter

### Components
- Glassmorphism cards
- Gradient buttons
- Smooth animations
- Rounded corners (2xl)
- Soft shadows

## 📊 Database Schema

### User
```typescript
{
  email: string
  password: string (hashed)
  name: string
  preferences: {
    theme: string
    notifications: boolean
    focusDuration: number
    breakDuration: number
  }
  mfaSecret?: string
  mfaEnabled: boolean
  isVerified: boolean
  xp: number
  level: number
  badges: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Habit
```typescript
{
  userId: ObjectId
  title: string
  description?: string
  frequency: 'daily' | 'weekly' | 'custom'
  customDays?: number[]
  reminderTime?: string
  streak: number
  completedDates: Date[]
  category: string
  archived: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Task
```typescript
{
  userId: ObjectId
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  deadline: Date
  aiSuggestions: string[]
  tags: string[]
  estimatedTime: number
  actualTime: number
}
```

## 🔒 Security Best Practices

✅ JWT with HTTP-only cookies  
✅ Password hashing with bcrypt (salt rounds: 10)  
✅ Environment variables for secrets  
✅ MongoDB injection prevention  
✅ Input validation  
✅ Protected API routes  
✅ CORS configuration  

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify username/password
- Ensure IP whitelist includes 0.0.0.0/0
- Check network connectivity

### Google Gemini API Errors
- Verify API key is correct
- Check API quota at [Google AI Studio](https://aistudio.google.com)
- Monitor rate limits
- Review error messages

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## 🌟 Acknowledgments

- **Google Gemini** for blazing-fast AI inference
- **Vercel** for seamless deployment
- **MongoDB** for reliable database
- **Next.js** team for amazing framework
- **Tailwind CSS** for utility-first styling

---

**Built with ❤️ using Next.js, MongoDB, and Google Gemini AI**

🚀 **Start your productivity journey today!**
