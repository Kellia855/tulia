# TULIA - Emotional Literacy Platform

A safe, anonymous emotional wellness platform for university students.

## Features

✨ **Anonymous & Stigma-Free** - Username-based authentication (no email required)  
🎯 **Emotional Check-ins** - Track mood, energy, and specific emotions  
📝 **Personal Reflections** - Private journaling space  
📚 **Vocabulary Builder** - Develop emotional granularity  
🌙 **Dark Mode** - Automatic theme switching  
🔒 **Secure** - JWT authentication, encrypted passwords

## Project Structure

```
tulia360/
├── src/              # React frontend (Vite + TypeScript)
└── backend/          # FastAPI backend (Python)
```

## Quick Start

### Frontend

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
# Opens at http://localhost:8000
```

## First Time Usage

1. Start the backend first
2. Then start the frontend
3. Navigate to http://localhost:5173
4. Click "Create Account" to register
5. Choose a username (no email needed!)

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

## API Documentation

Once backend is running, visit:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc

## Deployment

**Frontend:** Vercel, Netlify  
**Backend:** Railway, Render  
**Database:** PostgreSQL (Railway, Supabase)

See [backend/README.md](backend/README.md) for detailed backend setup.

## Privacy & Security

- No email addresses required
- All passwords are hashed with bcrypt
- JWT tokens for secure authentication
- User data is completely isolated
- Anonymous usernames protect identity
