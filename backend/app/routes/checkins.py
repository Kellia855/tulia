from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, CheckIn
from app.schemas import CheckInCreate, CheckInResponse
from app.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
def create_checkin(
    checkin: CheckInCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new check-in"""
    new_checkin = CheckIn(
        user_id=current_user.id,
        mood=checkin.mood,
        energy=checkin.energy,
        emotions=checkin.emotions,
        notes=checkin.notes
    )
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)
    return new_checkin


@router.get("/", response_model=List[CheckInResponse])
def get_checkins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all check-ins for the current user"""
    checkins = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id
    ).order_by(CheckIn.created_at.desc()).offset(skip).limit(limit).all()
    return checkins


@router.get("/{checkin_id}", response_model=CheckInResponse)
def get_checkin(
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific check-in"""
    checkin = db.query(CheckIn).filter(
        CheckIn.id == checkin_id,
        CheckIn.user_id == current_user.id
    ).first()
    
    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check-in not found"
        )
    return checkin


@router.delete("/{checkin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checkin(
    checkin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a check-in"""
    checkin = db.query(CheckIn).filter(
        CheckIn.id == checkin_id,
        CheckIn.user_id == current_user.id
    ).first()
    
    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Check-in not found"
        )
    
    db.delete(checkin)
    db.commit()
    return None
