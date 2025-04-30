from typing import Optional
from app.core.config import settings

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    # Define an empty type to avoid type checking errors
    class Client:
        pass


def get_supabase_client() -> Optional[Client]:
    """Get the Supabase client instance.
    
    This function checks if the configuration is set to use Supabase and if the supabase library is imported. If both
    conditions are met, it returns a configured Supabase client. Otherwise, it returns None.
    
    Returns:
        Optional[Client]: A configured Supabase client instance or None if the conditions are not met.
    """
    if not SUPABASE_AVAILABLE:
        return None
        
    if settings.DATABASE_TYPE != "supabase":
        return None
        
    if not settings.SUPABASE_URL or not settings.SUPABASE_API_KEY:
        return None
        
    # Create and return the Supabase client
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_API_KEY
    )
    

# Optionally: Provide a pre-initialized client instance
supabase_client = get_supabase_client() if SUPABASE_AVAILABLE else None 