# TULIA Backend API

FastAPI backend for the TULIA Emotional Literacy Platform.

## Features

- **Username/Password Authentication** (JWT tokens)
- **User Registration & Login**
- **Emotional Check-ins** (mood, energy, emotions tracking)
- **Personal Reflections** (journaling)
- **Secure & Anonymous** - No email required

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Generate a secure SECRET_KEY:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8001
```

Server will start at: `http://localhost:8001`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins` - Get all check-ins
- `GET /api/checkins/{id}` - Get specific check-in
- `DELETE /api/checkins/{id}` - Delete check-in

### Reflections
- `POST /api/reflections` - Create reflection
- `GET /api/reflections` - Get all reflections
- `GET /api/reflections/{id}` - Get specific reflection
- `PUT /api/reflections/{id}` - Update reflection
- `DELETE /api/reflections/{id}` - Delete reflection

## Database

Default: SQLite (`tulia.db`)

For PostgreSQL, update DATABASE_URL in `.env`:
```
DATABASE_URL=postgresql+psycopg://user:password@localhost/tulia
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- OAuth2 with Bearer tokens
- All user data is isolated by user_id

## Project Structure

```
backend/
├── app/
│   ├── routes/
│   │   ├── auth.py          # Auth endpoints
│   │   ├── checkins.py      # Check-in endpoints
│   │   └── reflections.py   # Reflection endpoints
│   ├── auth.py              # Auth utilities (JWT, password)
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   └── schemas.py           # Pydantic schemas
├── main.py                  # FastAPI app
├── requirements.txt
└── .env
```
