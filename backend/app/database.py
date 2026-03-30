from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()


db_path = os.path.join(os.path.dirname(__file__), "..", "tulia.db")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")


if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    try:
        import psycopg 

        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
            "postgresql://", "postgresql+psycopg://", 1
        )
    except ImportError:
        pass

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
