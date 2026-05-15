import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

VALID_CATEGORIES = ("riba", "halal_finance", "sadaqah", "eid", "tips", "general")


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)

    title_en: Mapped[str] = mapped_column(String, nullable=False)
    title_ar: Mapped[str | None] = mapped_column(String, nullable=True)
    title_fr: Mapped[str | None] = mapped_column(String, nullable=True)

    body_en: Mapped[str] = mapped_column(Text, nullable=False)
    body_ar: Mapped[str | None] = mapped_column(Text, nullable=True)
    body_fr: Mapped[str | None] = mapped_column(Text, nullable=True)

    excerpt_en: Mapped[str | None] = mapped_column(String(500), nullable=True)
    excerpt_ar: Mapped[str | None] = mapped_column(String(500), nullable=True)
    excerpt_fr: Mapped[str | None] = mapped_column(String(500), nullable=True)

    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    read_time_minutes: Mapped[int] = mapped_column(Integer, default=5)

    author_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    author = relationship("User", back_populates="articles", lazy="noload")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )
