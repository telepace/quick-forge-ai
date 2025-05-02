# 尝试导入posthog，如果无法导入则使用空的替代
try:
    import posthog

    POSTHOG_AVAILABLE = True
except ImportError:
    print("Warning: posthog not found, PostHog integration will be disabled")
    POSTHOG_AVAILABLE = False

# 尝试导入sentry_sdk，如果无法导入则使用空的替代
try:
    import sentry_sdk

    SENTRY_AVAILABLE = True
except ImportError:
    print("Warning: sentry_sdk not found, Sentry integration will be disabled")
    SENTRY_AVAILABLE = False

from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.api.middlewares.posthog import PostHogMiddleware
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


# 只有当sentry_sdk可用时才初始化Sentry
if SENTRY_AVAILABLE and settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

# Initialize PostHog
if POSTHOG_AVAILABLE and settings.posthog_enabled:
    posthog.api_key = settings.POSTHOG_API_KEY
    posthog.host = settings.POSTHOG_HOST

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add PostHog middleware
if POSTHOG_AVAILABLE and settings.posthog_enabled:
    app.add_middleware(PostHogMiddleware)

app.include_router(api_router, prefix=settings.API_V1_STR)
