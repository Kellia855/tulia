from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import engine, Base
from app.routes import auth, checkins, reflections, vocab


load_dotenv()


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TULIA API",
    description="Emotional Literacy Platform for University Students",
    version="1.0.0"
)

# CORS configuration
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(checkins.router, prefix="/api/checkins", tags=["Check-ins"])
app.include_router(reflections.router, prefix="/api/reflections", tags=["Reflections"])
app.include_router(vocab.router, prefix="/api/vocab", tags=["Vocabulary"])

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
