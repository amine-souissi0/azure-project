from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.api.deps import AdminUser, DB
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleList, ArticleOut, ArticleUpdate

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/", response_model=list[ArticleList])
async def list_articles(
    db: DB,
    category: str | None = Query(None),
    limit: int = Query(10, le=50),
    offset: int = Query(0),
):
    q = select(Article).where(Article.published.is_(True))
    if category:
        q = q.where(Article.category == category)
    q = q.order_by(Article.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{slug}", response_model=ArticleOut)
async def get_article(slug: str, db: DB):
    result = await db.execute(
        select(Article).where(Article.slug == slug, Article.published.is_(True))
    )
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("/", response_model=ArticleOut, status_code=status.HTTP_201_CREATED)
async def create_article(body: ArticleCreate, admin: AdminUser, db: DB):
    existing = await db.execute(select(Article).where(Article.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Slug already exists")

    article = Article(**body.model_dump(), author_id=admin.id)
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article


@router.patch("/{article_id}", response_model=ArticleOut)
async def update_article(article_id: str, body: ArticleUpdate, admin: AdminUser, db: DB):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(article, field, value)

    await db.commit()
    await db.refresh(article)
    return article


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: str, admin: AdminUser, db: DB):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.delete(article)
    await db.commit()
