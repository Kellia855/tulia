
# TULIA - Emotional Literacy Platform

A safe and reliable emotional wellness platform for university students.

## What is TULIA?

TULIA is a web application designed to help university students develop **emotional intelligence** and **emotional literacy**. It provides a judgment-free space for students to:

- **Understand their emotions** - Learn to recognize and name feelings beyond just "good" or "bad"
- **Track emotional patterns** - Visualize how your moods change over time
- **Reflect on experiences** - Process emotions through private journaling
- **Build emotional vocabulary** - Expand your ability to describe complex feelings
- **Access resources** - Get evidence-based guidance for emotional wellness

### The Problem It Solves

Many university students struggle with:
- **Emotional avoidance** - Not knowing how to process or name their feelings
- **Stigma** - Feeling ashamed to seek help or talk about mental health
- **Poor emotional awareness** - Difficulty recognizing triggers and patterns
- **Isolation** - Believing their struggles are unique or abnormal

TULIA removes barriers by offering:
- **Stigma-free space** - Safe to explore emotions without judgment
- **Data-driven insights** - Visual patterns help you understand yourself
- **Actionable guidance** - Evidence-based resources and community support

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Try the Live App](#try-the-live-app) Start here!
- [Using the App](#using-the-app)
- [Development Setup](#development-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Privacy & Security](#privacy--security)

## Features

**User authentication** - Username-based authentication (no email required)  
**Emotional Check-ins** - Track mood, energy, and specific emotions  
**Personal Reflections** - Private journaling space  
**Dashboard** - Visualize emotional patterns and progress  
**Vocabulary Builder** - Develop emotional granularity  
**Resources** - Curated emotional wellness resources    
**Secure** - JWT authentication, encrypted passwords
**Account Management** - Create, update, and delete user accounts

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Radix UI components
- Motion (animations)
- Recharts (data visualization)

**Backend:**
- FastAPI (Python)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL
- JWT authentication
- Pydantic validation

## Project Structure

```
tulia/
├── src/              # React frontend (Vite + TypeScript)
├── backend/          # FastAPI backend (Python)
└── README.md         # This file
```

## Try the Live App 

**No setup required!** Test the deployed application at:

### [https://tulia-dpza.onrender.com](https://tulia-dpza.onrender.com)

1. Click **"Create Account"**
2. Enter a username (no email needed!)
3. Set a password
4. Start tracking your emotions!

## Using the App

### How to Use

- **Dashboard** - View your emotional patterns and progress over time
- **Check-in** - Log your current mood, energy levels, and specific emotions
- **Reflections** - Write private journal entries to process experiences
- **Vocabulary** - Build your emotional intelligence vocabulary with curated terms
- **Resources** - Access evidence-based guidance and emotional wellness resources
- **Account Settings** - Manage your profile, change password, view account info

### Navigation Guide

- Use the **left sidebar** (or hamburger menu on mobile) to navigate between features
- Click your **username** in the top-right for account settings
- Toggle **dark/light theme** with the moon icon

---

## Development Setup

### Prerequisites
- Node.js 16+
- Python 3.9+
- Git

### Running Locally

0. **Clone the repository:**
   ```bash
   git clone https://github.com/Kellia855/tulia.git
   cd tulia
   ```

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && pip install -r requirements.txt && cd ..
   ```

2. **Start the backend** (Terminal 1):
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8001
   ```
   Backend API will be at: http://localhost:8001

3. **Start the frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend will open at: http://localhost:5173

4. **Access the app:**
   - Navigate to http://localhost:5173
   - Create an account with any username
   - Start using TULIA locally!

5. **Database:**
   - Local development uses SQLite (`backend/tulia.db`)
   - Data persists between sessions
   - To reset: delete `backend/tulia.db` and restart backend

### Windows Quick Start

If your VS Code terminal occasionally loses Node.js on PATH, use:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

This script refreshes PATH, activates `.venv`, installs dependencies and starts Vite.

## API Documentation

Once backend is running, visit:
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

See [backend/README.md](backend/README.md) for detailed backend setup.

## Deployment

**Frontend:** Render 
**Backend:** Render  
**Database:** PostgreSQL on Render (production) or SQLite (local development)

### Environment Variables

#### Frontend (`.env` in root)
```env
VITE_API_URL=http://localhost:8001/api
```

For production, update with your backend URL (e.g., `https://your-backend.onrender.com/api`).

#### Backend (`backend/.env`)

Create `.env` file in the `backend/` directory:
```env
# Database
DATABASE_URL=sqlite:///./tulia.db              # Local development
# DATABASE_URL=postgresql://user:pass@host/db  # Production

# Security
SECRET_KEY=<generate-secure-key>               # Required - see below
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:5173             # Local development
# FRONTEND_URL=https://your-frontend.com       # Production
```

**Generating SECRET_KEY:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

Copy the output and set it in `.env` (locally) and your deployment platform.


**Production Setup :**
- Set all environment variables in your deployment dashboard
- Ensure `SECRET_KEY` matches between local development and production
- Use PostgreSQL database for production

## Privacy & Security

- No email addresses required
- All passwords are hashed with bcrypt
- JWT tokens for secure authentication (requires matching SECRET_KEY across environments)
- User data is completely isolated
- `.env` files are never committed to version control


## Author
Kellia Kamikazi - k.kamikazi@alustudent.com