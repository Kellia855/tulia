from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# User Schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

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
