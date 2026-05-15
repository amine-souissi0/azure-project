import uuid
from datetime import datetime

from pydantic import BaseModel


class CampaignOut(BaseModel):
    id: uuid.UUID
    slug: str
    name_en: str
    name_ar: str | None
    name_fr: str | None
    description_en: str | None
    goal_amount: int
    raised_amount: int
    currency: str
    active: bool
    ends_at: datetime | None

    model_config = {"from_attributes": True}


class DonationCreate(BaseModel):
    campaign_id: uuid.UUID
    amount: int  # in cents
    currency: str = "USD"
    donor_name: str | None = None
    donor_email: str | None = None


class DonationOut(BaseModel):
    id: uuid.UUID
    campaign_id: uuid.UUID
    amount: int
    currency: str
    donor_name: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CheckoutSession(BaseModel):
    checkout_url: str
    session_id: str
