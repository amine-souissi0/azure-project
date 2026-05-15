from fastapi import APIRouter, HTTPException, Request

from app.api.deps import DB, OptionalUser
from app.core.config import settings
from app.schemas.qa import QARequest, QAResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/qa", tags=["qa"])
ai_service = AIService()


@router.post("/ask", response_model=QAResponse)
async def ask(body: QARequest, request: Request, user: OptionalUser, db: DB):
    question = body.question.strip()

    if not question:
        raise HTTPException(status_code=422, detail="Question cannot be empty")
    if len(question) > 1000:
        raise HTTPException(status_code=422, detail="Question too long (max 1000 chars)")

    # Rate limit by user ID for authenticated users, by IP for anonymous
    identifier = str(user.id) if user else (request.client.host if request.client else "unknown")
    limit = settings.qa_daily_limit_user if user else settings.qa_daily_limit_anonymous

    within_limit = await ai_service.check_rate_limit(identifier, limit)
    if not within_limit:
        raise HTTPException(
            status_code=429,
            detail="Daily question limit reached. Register for more questions.",
        )

    return await ai_service.answer(
        question=question,
        lang=body.lang,
        history=body.history,
    )
