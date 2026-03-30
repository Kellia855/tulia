from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import engine, Base
from app.routes import auth, checkins, reflections, vocab, resources


load_dotenv()


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TULIA API",
    description="Emotional Literacy Platform for University Students",
    version="1.0.0"
)

# CORS configuration
default_origin = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
extra_origins = os.getenv("FRONTEND_URLS", "")
origins = {
    default_origin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}

if extra_origins:
    for origin in extra_origins.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned:
            origins.add(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(origins),
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(checkins.router, prefix="/api/checkins", tags=["Check-ins"])
app.include_router(reflections.router, prefix="/api/reflections", tags=["Reflections"])
app.include_router(vocab.router, prefix="/api/vocab", tags=["Vocabulary"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TULIA API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
