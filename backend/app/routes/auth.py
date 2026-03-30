from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta, datetime

from app.database import get_db
from app.models import User, CheckIn, Reflection
from app.schemas import AuthResponse, UserCreate, UserLogin, UserResponse, PasswordChange
from app.auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_user_by_username,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user
)

router = APIRouter()


def build_auth_response(user: User) -> AuthResponse:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=user,
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user or check if already used"""
    
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    

    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        hashed_password=hashed_password
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )

    return build_auth_response(new_user)


@router.post("/login", response_model=AuthResponse)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):

    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login timestamp
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)

    return build_auth_response(user)


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
   
    return current_user


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_change: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change the current user's password"""
    
    # Verify current password is correct
    from app.auth import verify_password
    if not verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Check if new password is different from current password
    if verify_password(password_change.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(password_change.new_password)
    db.add(current_user)
    db.commit()
    
    return {"message": "Password changed successfully"}
