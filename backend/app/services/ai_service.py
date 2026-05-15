from groq import AsyncGroq
import redis.asyncio as aioredis

from app.core.config import settings
from app.schemas.qa import ChatMessage, QAResponse

# ── System prompt ──────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are an Islamic finance educator for a modern Muslim audience. \
Your role is to provide clear, honest, and practical educational guidance.

Scope — you help with:
- Understanding riba (interest/usury) and why it is prohibited
- Halal financial alternatives: murabaha, musharaka, ijara, takaful, sukuk
- Everyday finance: bank accounts, credit cards, mortgages, investments
- Sadaqah, zakat, charitable giving, and Eid al-Adha qurbani
- Ethical spending and halal lifestyle decisions

Guardrails — you must:
1. Provide educational information only — never issue personal fatwas or binding rulings
2. Avoid all political discussions, sectarian debates, and extremist content
3. When asked for a binding personal ruling, refer the user to a qualified Islamic scholar
4. Keep answers concise and accessible (150–300 words unless the topic genuinely requires more)
5. Be warm, non-judgmental, and encouraging — never preachy or condescending
6. Respond in the same language as the user (Arabic, French, or English)
7. If asked about anything outside your scope, politely redirect to relevant topics
8. Always close with a gentle reminder to consult a scholar for serious personal decisions

Tone: calm, trustworthy, modern — like a knowledgeable friend, not a preacher."""

DISCLAIMERS = {
    "en": "This assistant provides educational guidance only and is not a substitute for qualified scholarly advice.",
    "ar": "يقدم هذا المساعد توجيهاً تعليمياً فقط وليس بديلاً عن المشورة العلمية المتخصصة.",
    "fr": "Cet assistant fournit des conseils éducatifs uniquement et ne remplace pas l'avis d'un érudit qualifié.",
}

# Limit conversation history to avoid large token usage
MAX_HISTORY_MESSAGES = 20  # 10 exchanges


class AIService:
    def __init__(self):
        self._client: AsyncGroq | None = None
        self._redis: aioredis.Redis | None = None

    def _get_client(self) -> AsyncGroq:
        if not self._client:
            self._client = AsyncGroq(api_key=settings.groq_api_key)
        return self._client

    async def _get_redis(self) -> aioredis.Redis:
        if not self._redis:
            self._redis = await aioredis.from_url(settings.redis_url, decode_responses=True)
        return self._redis

    async def check_rate_limit(self, identifier: str, limit: int) -> bool:
        """Returns True if the identifier is within their daily question limit."""
        if not settings.groq_api_key:
            return True  # dev mode — no key configured, allow through

        try:
            redis = await self._get_redis()
            key = f"qa:{identifier}"
            count = await redis.get(key)

            if count and int(count) >= limit:
                return False

            pipe = redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, 86400)  # resets every 24h
            await pipe.execute()
            return True
        except Exception:
            return True  # fail open — don't block users if Redis is unavailable

    async def answer(
        self,
        question: str,
        lang: str = "en",
        history: list[ChatMessage] | None = None,
    ) -> QAResponse:
        if not settings.groq_api_key:
            return QAResponse(
                answer="The AI advisor is not configured yet. Add GROQ_API_KEY to your .env file.",
                disclaimer=DISCLAIMERS.get(lang, DISCLAIMERS["en"]),
            )

        # Build message list: system + trimmed history + current question
        messages: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            for msg in history[-MAX_HISTORY_MESSAGES:]:
                messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": question})

        try:
            response = await self._get_client().chat.completions.create(
                model=settings.groq_model,
                messages=messages,
                max_tokens=600,
                temperature=0.7,
            )
        except Exception as e:
            return QAResponse(
                answer=f"I'm having trouble connecting to the AI service right now. Please try again in a moment.",
                disclaimer=DISCLAIMERS.get(lang, DISCLAIMERS["en"]),
            )

        answer_text = response.choices[0].message.content or ""

        return QAResponse(
            answer=answer_text,
            disclaimer=DISCLAIMERS.get(lang, DISCLAIMERS["en"]),
        )
