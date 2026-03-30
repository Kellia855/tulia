
# TULIA - Emotional Literacy Platform

A safe, anonymous emotional wellness platform for university students.

**Design:** https://www.figma.com/design/YkfJm8q6AWd3BQccQHXBKZ/Emotional-Literacy-Tool

## Features

✨ **Anonymous & Stigma-Free** - Username-based authentication (no email required)  
🎯 **Emotional Check-ins** - Track mood, energy, and specific emotions  
📝 **Personal Reflections** - Private journaling space  
📚 **Vocabulary Builder** - Develop emotional granularity  
🌙 **Dark Mode** - Automatic theme switching  
🔒 **Secure** - JWT authentication, encrypted passwords

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

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.9+
- Git

### Frontend Setup

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
# Opens at http://localhost:8001
```

### Windows Quick Start

If your VS Code terminal occasionally loses Node.js on PATH, use:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

This script refreshes PATH, activates `.venv`, installs dependencies, and starts Vite.

## First Time Usage

1. Start the backend first (`python -m uvicorn main:app --reload`)
2. Then start the frontend (`npm run dev`)
3. Navigate to http://localhost:5173
4. Click "Create Account" to register
5. Choose a username (no email needed!)

## API Documentation

Once backend is running, visit:
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

See [backend/README.md](backend/README.md) for detailed backend setup.

## Deployment

**Frontend:** Vercel, Netlify  
**Backend:** Railway, Render  
**Database:** PostgreSQL (Railway, Supabase)

### Environment Variables

Create `.env` file in root:
```
VITE_API_URL=http://localhost:8001/api
```

For production, update with your backend URL.

## Privacy & Security

- No email addresses required
- All passwords are hashed with bcrypt
- JWT tokens for secure authentication
- User data is completely isolated


## License

MIT License - See LICENSE file for details
  