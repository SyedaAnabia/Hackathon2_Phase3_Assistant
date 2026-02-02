from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime
from typing import Optional
from ..models.user import User, UserCreate
from ..database.session import get_session


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    from ..utils.jwt import verify_password
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user_from_token(token: str = None) -> Optional[dict]:
    """Decode and verify a JWT token, returning the user payload."""
    if token is None:
        return None

    from ..utils.jwt import verify_token
    payload = verify_token(token)

    if payload is None:
        return None

    user_id: str = payload.get("sub")
    email: str = payload.get("email")

    if user_id is None or email is None:
        return None

    return {
        "user_id": user_id,
        "email": email
    }


def create_access_token_for_user(user_id: str, email: str):
    """Create a JWT access token for a user."""
    from ..utils.jwt import create_access_token
    from datetime import timedelta
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_id, "email": email},
        expires_delta=access_token_expires
    )
    return access_token