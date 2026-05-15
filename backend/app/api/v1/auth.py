from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DB
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import TokenPair, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate, db: DB):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=body.email,
        name=body.name,
        hashed_password=hash_password(body.password),
        lang_pref=body.lang_pref,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenPair)
async def login(body: UserLogin, response: Response, db: DB):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not user.hashed_password or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.environment != "development",
        samesite="lax",
        max_age=60 * 60 * 24 * settings.refresh_token_expire_days,
    )

    return TokenPair(access_token=access_token)


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser):
    return user


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}
