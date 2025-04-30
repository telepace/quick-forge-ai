from typing import Optional
from app.core.config import settings

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    # 定义一个空的类型，以避免类型检查错误
    class Client:
        pass


def get_supabase_client() -> Optional[Client]:
    """
    获取 Supabase 客户端实例
    
    如果配置为使用 Supabase 并且导入了 supabase 库，则返回一个配置好的客户端
    否则返回 None
    """
    if not SUPABASE_AVAILABLE:
        return None
        
    if settings.DATABASE_TYPE != "supabase":
        return None
        
    if not settings.SUPABASE_URL or not settings.SUPABASE_API_KEY:
        return None
        
    # 创建并返回 Supabase 客户端
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_API_KEY
    )
    

# 可选：提供预初始化的客户端实例
supabase_client = get_supabase_client() if SUPABASE_AVAILABLE else None 