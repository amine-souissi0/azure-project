from typing import Literal

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class QARequest(BaseModel):
    question: str
    lang: str = "en"
    history: list[ChatMessage] = []  # up to last N exchanges from the client


class QAResponse(BaseModel):
    answer: str
    disclaimer: str
