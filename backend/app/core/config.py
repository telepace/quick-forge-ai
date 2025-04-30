import os
import secrets
import warnings
import logging
from typing import Annotated, Any, Literal, ClassVar

from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self

# 设置logger
logger = logging.getLogger("app.config")

def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    # 使用 ClassVar 标识这不是模型字段
    env_file_path: ClassVar[str] = os.environ.get("ENV_FILE", "../.env")
    
    model_config = SettingsConfigDict(
        # 使用动态的环境文件路径
        env_file=env_file_path,
        env_ignore_empty=True,
        extra="ignore",
    )
    
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    PROJECT_NAME: str = "Quick Forge AI"
    SENTRY_DSN: HttpUrl | None = None

    # Database configuration
    DATABASE_TYPE: Literal["postgres", "supabase"] = "postgres"
    
    # Supabase configuration - 这些在使用 postgres 数据库类型时不会被使用
    SUPABASE_URL: str | None = None
    SUPABASE_API_KEY: str | None = None
    SUPABASE_JWT_SECRET: str | None = None
    
    # When using Supabase, we can still use the PostgreSQL connection directly
    SUPABASE_DB_HOST: str | None = None
    SUPABASE_DB_PORT: int | None = None
    SUPABASE_DB_USER: str | None = None
    SUPABASE_DB_PASSWORD: str | None = None
    SUPABASE_DB_NAME: str | None = None
    # 连接池模式配置 - 支持 session 和 transaction 两种模式
    SUPABASE_DB_POOL_MODE: Literal["session", "transaction"] = "session"

    # Direct PostgreSQL connection settings
    # 设置默认值连接到本地数据库
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "postgres"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        # 根据数据库类型返回不同的连接 URI
        if self.DATABASE_TYPE == "supabase" and self.SUPABASE_DB_HOST:
            # 使用 Supabase 的 PostgreSQL 连接（直接连接）
            # 根据连接池模式选择端口
            port = self.SUPABASE_DB_PORT or (
                6543 if self.SUPABASE_DB_POOL_MODE == "transaction" else 5432
            )
            
            # 记录使用的端口
            logger.debug(f"使用 {self.SUPABASE_DB_POOL_MODE} 模式连接 Supabase，端口: {port}")
            
            return MultiHostUrl.build(
                scheme="postgresql+psycopg",
                username=self.SUPABASE_DB_USER or "",
                password=self.SUPABASE_DB_PASSWORD or "",
                host=self.SUPABASE_DB_HOST,
                port=port,
                path=self.SUPABASE_DB_NAME or "",
            )
        else:
            # 使用标准 PostgreSQL 连接
            return MultiHostUrl.build(
                scheme="postgresql+psycopg",
                username=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD,
                host=self.POSTGRES_SERVER,
                port=self.POSTGRES_PORT,
                path=self.POSTGRES_DB,
            )

    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: EmailStr | None = None
    EMAILS_FROM_NAME: EmailStr | None = None

    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.PROJECT_NAME
        return self

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48

    @computed_field  # type: ignore[prop-decorator]
    @property
    def emails_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)

    EMAIL_TEST_USER: EmailStr = "test@example.com"
    FIRST_SUPERUSER: EmailStr = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "quickforgeai":
            message = (
                f'The value of {var_name} is "quickforgeai", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY)
        # 根据数据库类型检查相应密码
        if self.DATABASE_TYPE == "postgres":
            self._check_default_secret("POSTGRES_PASSWORD", self.POSTGRES_PASSWORD)
        elif self.DATABASE_TYPE == "supabase" and self.SUPABASE_DB_PASSWORD:
            self._check_default_secret("SUPABASE_DB_PASSWORD", self.SUPABASE_DB_PASSWORD)
        
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD
        )
        
        # 记录数据库配置信息
        if self.DATABASE_TYPE == "supabase":
            logger.info(f"使用 Supabase 连接池模式: {self.SUPABASE_DB_POOL_MODE}")
            
            # 检查端口与连接池模式是否匹配
            if self.SUPABASE_DB_PORT:
                expected_port = 6543 if self.SUPABASE_DB_POOL_MODE == "transaction" else 5432
                if self.SUPABASE_DB_PORT != expected_port:
                    logger.warning(
                        f"Supabase 端口 ({self.SUPABASE_DB_PORT}) 与连接池模式 ({self.SUPABASE_DB_POOL_MODE}) 不匹配。"
                        f"建议为 {self.SUPABASE_DB_POOL_MODE} 模式使用端口 {expected_port}"
                    )

        return self


settings = Settings()
