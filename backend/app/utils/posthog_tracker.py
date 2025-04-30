from fastapi import Request
from app.core.config import settings
import posthog
from typing import Any, Dict, Optional

class PostHogTracker:
    @staticmethod
    def capture_event(
        event_name: str,
        user_id: Optional[str] = None,
        properties: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """捕获 PostHog 事件"""
        if not settings.posthog_enabled:
            return
            
        posthog.capture(
            distinct_id=user_id,
            event=event_name,
            properties=properties or {},
            context=context or {},
        )
        
    @staticmethod
    def identify_user(
        user_id: str,
        properties: Optional[Dict[str, Any]] = None,
    ) -> None:
        """标识用户"""
        if not settings.posthog_enabled:
            return
            
        posthog.identify(
            distinct_id=user_id,
            properties=properties or {},
        ) 