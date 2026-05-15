from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import select

from app.api.deps import DB
from app.models.donation import Campaign, Donation
from app.schemas.donation import CampaignOut, CheckoutSession, DonationCreate

router = APIRouter(prefix="/donations", tags=["donations"])


@router.get("/campaigns", response_model=list[CampaignOut])
async def list_campaigns(db: DB):
    result = await db.execute(select(Campaign).where(Campaign.active.is_(True)))
    return result.scalars().all()


@router.get("/campaigns/{slug}", response_model=CampaignOut)
async def get_campaign(slug: str, db: DB):
    result = await db.execute(select(Campaign).where(Campaign.slug == slug))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.post("/checkout", response_model=CheckoutSession)
async def create_checkout(body: DonationCreate, db: DB):
    result = await db.execute(select(Campaign).where(Campaign.id == body.campaign_id))
    campaign = result.scalar_one_or_none()
    if not campaign or not campaign.active:
        raise HTTPException(status_code=404, detail="Campaign not found or inactive")

    donation = Donation(
        campaign_id=body.campaign_id,
        amount=body.amount,
        currency=body.currency,
        donor_name=body.donor_name,
        donor_email=body.donor_email,
        status="pending",
    )
    db.add(donation)
    await db.commit()
    await db.refresh(donation)

    # Wire up stripe.checkout.sessions.create here with donation.id as client_reference_id
    # Return real Stripe URL once configured
    return CheckoutSession(
        checkout_url=f"https://checkout.stripe.com/placeholder?ref={donation.id}",
        session_id=str(donation.id),
    )


@router.post("/webhook")
async def stripe_webhook(request: Request, db: DB):
    """
    Verify Stripe signature, then update donation status and increment
    campaign.raised_amount on payment_intent.succeeded events.
    """
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    # import stripe
    # event = stripe.Webhook.construct_event(payload, sig, settings.stripe_webhook_secret)
    # Handle event.type == "checkout.session.completed" here

    return {"received": True}
