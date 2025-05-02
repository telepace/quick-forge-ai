"""
Type stub definitions for posthog module
"""

from typing import Any

# Define the types for posthog functions that we use


def capture(
    distinct_id: str,  # noqa: ARG001
    event: str,  # noqa: ARG001
    properties: dict[str, Any] | None = None,  # noqa: ARG001
    context: dict[str, Any] | None = None,  # noqa: ARG001
) -> None:
    """Type stub for posthog.capture"""
    pass


def identify(
    distinct_id: str,  # noqa: ARG001
    properties: dict[str, Any] | None = None,  # noqa: ARG001
) -> None:
    """Type stub for posthog.identify"""
    pass
