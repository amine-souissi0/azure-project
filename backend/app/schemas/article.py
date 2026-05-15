import uuid
from datetime import datetime

from pydantic import BaseModel


class ArticleCreate(BaseModel):
    slug: str
    title_en: str
    title_ar: str | None = None
    title_fr: str | None = None
    body_en: str
    body_ar: str | None = None
    body_fr: str | None = None
    excerpt_en: str | None = None
    excerpt_ar: str | None = None
    excerpt_fr: str | None = None
    category: str
    read_time_minutes: int = 5
    published: bool = False


class ArticleUpdate(BaseModel):
    title_en: str | None = None
    title_ar: str | None = None
    title_fr: str | None = None
    body_en: str | None = None
    body_ar: str | None = None
    body_fr: str | None = None
    excerpt_en: str | None = None
    category: str | None = None
    published: bool | None = None
    read_time_minutes: int | None = None


class ArticleOut(BaseModel):
    id: uuid.UUID
    slug: str
    title_en: str
    title_ar: str | None
    title_fr: str | None
    body_en: str
    body_ar: str | None
    body_fr: str | None
    excerpt_en: str | None
    excerpt_ar: str | None
    excerpt_fr: str | None
    category: str
    read_time_minutes: int
    published: bool
    created_at: datetime
    updated_at: datetime | None

    model_config = {"from_attributes": True}


class ArticleList(BaseModel):
    id: uuid.UUID
    slug: str
    title_en: str
    title_ar: str | None
    title_fr: str | None
    excerpt_en: str | None
    excerpt_ar: str | None
    excerpt_fr: str | None
    category: str
    read_time_minutes: int
    created_at: datetime

    model_config = {"from_attributes": True}
