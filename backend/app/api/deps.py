from collections.abc import Generator
from typing import Annotated, Any, TypeVar

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db_factory import engine
from app.models import TokenPayload, User

# 定义类型变量
SupabaseClient = TypeVar("SupabaseClient")

try:
    from app.core.supabase_service import get_supabase_client

    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

    def get_supabase_client() -> Any | None:
        return None


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_supabase() -> Generator[SupabaseClient | None, None, None]:
    """Provides a Supabase client instance (if available).

    This function checks if the SUPABASE_AVAILABLE flag is set to True. If it is, it initializes and yields a Supabase
    client instance; otherwise, it yields None.

    Yields:
        SupabaseClient | None: A Supabase client instance if available, otherwise None.
    """
    client = get_supabase_client() if SUPABASE_AVAILABLE else None
    yield client


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
SupabaseDep = Annotated[Any | None, Depends(get_supabase)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
