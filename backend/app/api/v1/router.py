from fastapi import APIRouter

from .admin import router as admin_router
from .articles import router as articles_router
from .auth import router as auth_router
from .donations import router as donations_router
from .qa import router as qa_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(articles_router)
api_router.include_router(donations_router)
api_router.include_router(qa_router)
api_router.include_router(admin_router)
