from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional


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


class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        password = value.strip()
        if len(password) < 6:
            raise ValueError("New password must be at least 6 characters long")
        return password

class UserResponse(UserBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class AuthResponse(Token):
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None


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



class LearningGuideResponse(BaseModel):
    id: int
    category: str
    body_signals: List[str]
    likely_triggers: List[str]
    signal_meaning: str
    underlying_needs: List[str]
    helpful_reactions: List[str]
    unhelpful_reactions: List[str]
    healthy_next_step: str
    reflection_prompt: str
    created_at: datetime

    class Config:
        from_attributes = True



class QuizScenarioResponse(BaseModel):
    id: int
    scenario_id: str
    title: str
    situation: str
    options: List[str]
    correct_emotion: str
    explanation: str
    created_at: datetime

    class Config:
        from_attributes = True



class DiscriminationExerciseResponse(BaseModel):
    id: int
    left_emotion: str
    right_emotion: str
    key_difference: str
    quick_check: str
    created_at: datetime

    class Config:
        from_attributes = True



class BodySignalActivityResponse(BaseModel):
    id: int
    signal: str
    correct_emotions: List[str]
    incorrect_emotions: List[str]
    created_at: datetime

    class Config:
        from_attributes = True



class ReflectionPromptActivityResponse(BaseModel):
    id: int
    prompt: str
    hints: List[str]
    key_points: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Resource Schemas
class HelplineResourceResponse(BaseModel):
    id: int
    name: str
    action: str
    description: str
    resource_type: str
    countries: List[str]
    available_24_7: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DigitalResourceResponse(BaseModel):
    id: int
    title: str
    url: str
    description: str
    accessibility: List[str]
    relevant_regions: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class SupportGroupResponse(BaseModel):
    id: int
    name: str
    url: Optional[str]
    focus: str
    format: str
    countries: List[str]
    language: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

