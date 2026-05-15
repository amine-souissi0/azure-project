from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    database_url_sync: str
    redis_url: str = "redis://localhost:6379"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    frontend_url: str = "http://localhost:5173"
    environment: str = "development"
    debug: bool = True

    qa_daily_limit_anonymous: int = 5
    qa_daily_limit_user: int = 20


settings = Settings()
