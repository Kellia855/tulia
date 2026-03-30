from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    

    checkins = relationship("CheckIn", back_populates="user", cascade="all, delete-orphan")
    reflections = relationship("Reflection", back_populates="user", cascade="all, delete-orphan")


class CheckIn(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood = Column(Integer, nullable=False)  
    energy = Column(Integer, nullable=False)  
    emotions = Column(JSON, nullable=False)  
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    
    user = relationship("User", back_populates="checkins")


class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    mood = Column(String(50), nullable=False)
    tags = Column(JSON, nullable=True)  # List of tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    
    user = relationship("User", back_populates="reflections")


class LearningGuide(Base):
    __tablename__ = "learning_guides"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), unique=True, index=True, nullable=False)
    body_signals = Column(JSON, nullable=False)  
    likely_triggers = Column(JSON, nullable=False)  
    signal_meaning = Column(Text, nullable=False)
    underlying_needs = Column(JSON, nullable=False)  
    helpful_reactions = Column(JSON, nullable=False)  
    unhelpful_reactions = Column(JSON, nullable=False) 
    healthy_next_step = Column(Text, nullable=False)
    reflection_prompt = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class QuizScenario(Base):
    __tablename__ = "quiz_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    situation = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  
    correct_emotion = Column(String(100), nullable=False)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DiscriminationExercise(Base):
    __tablename__ = "discrimination_exercises"

    id = Column(Integer, primary_key=True, index=True)
    left_emotion = Column(String(100), nullable=False)
    right_emotion = Column(String(100), nullable=False)
    key_difference = Column(Text, nullable=False)
    quick_check = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class BodySignalActivity(Base):
    __tablename__ = "body_signal_activities"

    id = Column(Integer, primary_key=True, index=True)
    signal = Column(Text, nullable=False, unique=True)
    correct_emotions = Column(JSON, nullable=False)  
    incorrect_emotions = Column(JSON, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)


class ReflectionPromptActivity(Base):
    __tablename__ = "reflection_prompt_activities"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text, nullable=False, unique=True)
    hints = Column(JSON, nullable=False)  
    key_points = Column(JSON, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)


class HelplineResource(Base):
    __tablename__ = "helpline_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    action = Column(String(500), nullable=False)  
    description = Column(Text, nullable=False)
    resource_type = Column(String(50), nullable=False) 
    countries = Column(JSON, nullable=False)  
    available_24_7 = Column(Text, nullable=True)  
    created_at = Column(DateTime, default=datetime.utcnow)


class DigitalResource(Base):
    __tablename__ = "digital_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    accessibility = Column(JSON, nullable=False)  
    relevant_regions = Column(JSON, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)


class SupportGroup(Base):
    __tablename__ = "support_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    url = Column(String(500), nullable=True)
    focus = Column(Text, nullable=False) 
    format = Column(String(100), nullable=False)  
    countries = Column(JSON, nullable=False)  
    language = Column(JSON, nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow)

