from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional

# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        username = value.strip()
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if not username.replace("_", "").isalnum():
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return username

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        password = value.strip()
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return password


class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def validate_login_username(cls, value: str) -> str:
        username = value.strip()
        if not username:
            raise ValueError("Username is required")
        return username

    @field_validator("password")
    @classmethod
    def validate_login_password(cls, value: str) -> str:
        password = value.strip()
        if not password:
            raise ValueError("Password is required")
        return password

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class AuthResponse(Token):
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None


# CheckIn Schemas
class CheckInCreate(BaseModel):
    mood: int = Field(..., ge=1, le=5)
    energy: int = Field(..., ge=1, le=5)
    emotions: List[str]
    notes: Optional[str] = None

class CheckInResponse(CheckInCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Reflection Schemas
class ReflectionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    mood: str
    tags: Optional[List[str]] = []

class ReflectionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    mood: Optional[str] = None
    tags: Optional[List[str]] = None

class ReflectionResponse(ReflectionCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
