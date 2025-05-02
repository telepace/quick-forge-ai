from typing import Any, TypeVar

from app.core.config import settings

# 定义类型变量
SupabaseClient = TypeVar("SupabaseClient")

try:
    import supabase

    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False


def get_supabase_client() -> Any | None:
    """
    Get the Supabase client instance

    If the configuration is set to use Supabase and the supabase library is imported, it returns a configured client
    Otherwise, it returns None
    """
    if not SUPABASE_AVAILABLE:
        return None

    if settings.DATABASE_TYPE != "supabase":
        return None

    if not settings.SUPABASE_URL or not settings.SUPABASE_API_KEY:
        return None

    # Validate if the Supabase URL format is correct
    url = settings.SUPABASE_URL
    if not url.startswith(("http://", "https://")):
        # If the URL set in the environment variable is not in the correct format, try using the default value
        url = "https://your-project.supabase.co"
        print(
            f"Warning: SUPABASE_URL format is incorrect, it needs to start with http:// or https://. Using default value: {url}"
        )

    # Create and return the Supabase client
    try:
        client = supabase.create_client(  # type: ignore[attr-defined]
            url, settings.SUPABASE_API_KEY
        )
        return client
    except Exception as e:
        print(f"Error creating Supabase client: {e}")
        return None


# Optionally: Provide a pre-initialized client instance
supabase_client = get_supabase_client() if SUPABASE_AVAILABLE else None
