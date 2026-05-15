import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    name_en: Mapped[str] = mapped_column(String, nullable=False)
    name_ar: Mapped[str | None] = mapped_column(String, nullable=True)
    name_fr: Mapped[str | None] = mapped_column(String, nullable=True)
    description_en: Mapped[str | None] = mapped_column(String, nullable=True)
    goal_amount: Mapped[int] = mapped_column(Integer, nullable=False)  # in cents
    raised_amount: Mapped[int] = mapped_column(Integer, default=0)    # in cents
    currency: Mapped[str] = mapped_column(String, default="USD")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    donations = relationship("Donation", back_populates="campaign", lazy="noload")


class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    campaign_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False)  # in cents
    currency: Mapped[str] = mapped_column(String, default="USD")
    donor_name: Mapped[str | None] = mapped_column(String, nullable=True)
    donor_email: Mapped[str | None] = mapped_column(String, nullable=True)
    payment_ref: Mapped[str | None] = mapped_column(String, nullable=True, unique=True)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending | completed | failed
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="donations", lazy="noload")
    campaign = relationship("Campaign", back_populates="donations", lazy="noload")
