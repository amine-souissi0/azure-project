import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    lang_pref: str = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    role: str
    lang_pref: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenPair(BaseModel):
    access_token: str
    token_type: str = "bearer"
