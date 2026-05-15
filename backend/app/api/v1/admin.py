from fastapi import APIRouter
from sqlalchemy import func, select

from app.api.deps import AdminUser, DB
from app.models.article import Article
from app.models.donation import Donation
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def dashboard_stats(admin: AdminUser, db: DB):
    user_count = await db.execute(select(func.count()).select_from(User))
    article_count = await db.execute(
        select(func.count()).select_from(Article).where(Article.published.is_(True))
    )
    donation_total = await db.execute(
        select(func.sum(Donation.amount)).where(Donation.status == "completed")
    )

    return {
        "users": user_count.scalar() or 0,
        "published_articles": article_count.scalar() or 0,
        "total_donations_cents": donation_total.scalar() or 0,
    }
