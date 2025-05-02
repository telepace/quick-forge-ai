from typing import Any

import posthog

from app.core.config import settings


class PostHogTracker:
    @staticmethod
    def capture_event(
        event_name: str,
        user_id: str | None = None,
        properties: dict[str, Any] | None = None,
        context: dict[str, Any] | None = None,
    ) -> None:
        """捕获 PostHog 事件"""
        if not settings.posthog_enabled:
            return

        posthog.capture(
            distinct_id=user_id or "anonymous",
            event=event_name,
            properties=properties or {},
            context=context or {},
        )

    @staticmethod
    def identify_user(
        user_id: str,
        properties: dict[str, Any] | None = None,
    ) -> None:
        """标识用户"""
        if not settings.posthog_enabled:
            return

        posthog.identify(
            distinct_id=user_id,
            properties=properties or {},
        )
