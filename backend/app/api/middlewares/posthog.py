import time

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.core.config import settings
from app.utils import PostHogTracker


class PostHogMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        start_time = time.time()

        # Process the request
        response = await call_next(request)

        if settings.posthog_enabled:
            # Get the user ID if there is authentication
            user_id = None
            try:
                user = getattr(request.state, "user", None)
                if user and hasattr(user, "id"):
                    user_id = str(user.id)
            except Exception:
                pass

            # Capture API events
            path = request.url.path
            if path.startswith(settings.API_V1_STR):
                PostHogTracker.capture_event(
                    event_name="api_request",
                    user_id=user_id or "anonymous",
                    properties={
                        "path": path,
                        "method": request.method,
                        "status_code": response.status_code,
                        "duration_ms": (time.time() - start_time) * 1000,
                    },
                )

        return response
