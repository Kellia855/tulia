from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Reflection
from app.schemas import ReflectionCreate, ReflectionUpdate, ReflectionResponse
from app.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ReflectionResponse, status_code=status.HTTP_201_CREATED)
def create_reflection(
    reflection: ReflectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    new_reflection = Reflection(
        user_id=current_user.id,
        title=reflection.title,
        content=reflection.content,
        mood=reflection.mood,
        tags=reflection.tags or []
    )
    db.add(new_reflection)
    db.commit()
    db.refresh(new_reflection)
    return new_reflection


@router.get("/", response_model=List[ReflectionResponse])
def get_reflections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    reflections = db.query(Reflection).filter(
        Reflection.user_id == current_user.id
    ).order_by(Reflection.created_at.desc()).offset(skip).limit(limit).all()
    return reflections


@router.get("/{reflection_id}", response_model=ReflectionResponse)
def get_reflection(
    reflection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    reflection = db.query(Reflection).filter(
        Reflection.id == reflection_id,
        Reflection.user_id == current_user.id
    ).first()
    
    if not reflection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reflection not found"
        )
    return reflection


@router.put("/{reflection_id}", response_model=ReflectionResponse)
def update_reflection(
    reflection_id: int,
    reflection_update: ReflectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    reflection = db.query(Reflection).filter(
        Reflection.id == reflection_id,
        Reflection.user_id == current_user.id
    ).first()
    
    if not reflection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reflection not found"
        )
    
    
    if reflection_update.title is not None:
        reflection.title = reflection_update.title
    if reflection_update.content is not None:
        reflection.content = reflection_update.content
    if reflection_update.mood is not None:
        reflection.mood = reflection_update.mood
    if reflection_update.tags is not None:
        reflection.tags = reflection_update.tags
    
    db.commit()
    db.refresh(reflection)
    return reflection


@router.delete("/{reflection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reflection(
    reflection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    reflection = db.query(Reflection).filter(
        Reflection.id == reflection_id,
        Reflection.user_id == current_user.id
    ).first()
    
    if not reflection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reflection not found"
        )
    
    db.delete(reflection)
    db.commit()
    return None
