from typing import Dict, Any
from sqlmodel import create_engine
import logging
from app.core.config import settings

# 获取logger
logger = logging.getLogger("app.db_factory")

def get_engine_args() -> Dict[str, Any]:
    """根据数据库类型返回引擎参数"""
    connect_args = {}
    
    # Supabase 特定的连接参数
    if settings.DATABASE_TYPE == "supabase":
        # 为Supabase连接池添加参数
        connect_args["options"] = f"-c search_path=public -c statement_timeout=60000"
        
        # 根据连接池模式(pool_mode)添加其他参数
        pool_mode = getattr(settings, "SUPABASE_DB_POOL_MODE", "session")
        if pool_mode == "session":
            # session模式下的优化参数
            connect_args["keepalives"] = 1
            connect_args["keepalives_idle"] = 30
            connect_args["keepalives_interval"] = 10
            connect_args["keepalives_count"] = 5
        elif pool_mode == "transaction":
            # transaction模式下不支持prepare语句
            connect_args["prepare_threshold"] = 0  # 禁用prepare语句
    
    # 可以根据环境添加其他参数
    if settings.ENVIRONMENT == "local":
        # 开发环境可能需要的参数
        pass
    
    return {"connect_args": connect_args}


def get_db_url() -> str:
    """
    根据配置获取数据库URL，并自动处理端口问题
    """
    # 先获取基础URL
    url = str(settings.SQLALCHEMY_DATABASE_URI)
    
    # 对于Supabase，确保端口与连接池模式匹配
    if settings.DATABASE_TYPE == "supabase" and not settings.SUPABASE_DB_PORT:
        # 如果未指定端口，根据连接池模式自动选择
        pool_mode = getattr(settings, "SUPABASE_DB_POOL_MODE", "session")
        default_port = 6543 if pool_mode == "transaction" else 5432
        
        # 替换URL中的端口
        # 找到主机部分
        host_part = url.split("@")[1].split("/")[0]
        if ":" in host_part:
            # 有端口号，替换它
            old_host = host_part
            new_host = f"{host_part.split(':')[0]}:{default_port}"
            url = url.replace(old_host, new_host)
            logger.info(f"自动根据连接池模式({pool_mode})选择端口: {default_port}")
    
    return url


def create_db_engine():
    """创建并返回数据库引擎"""
    engine_args = get_engine_args()
    
    # 添加连接池配置
    engine_args.update({
        "pool_pre_ping": True,  # 连接前ping确保连接可用
        "pool_recycle": 300,    # 连接在池中最大生存时间(秒)
        "pool_size": 5,         # 连接池大小
        "max_overflow": 10      # 连接池溢出时允许创建的额外连接数
    })
    
    # 获取正确的数据库URL
    url = get_db_url()
    
    return create_engine(
        url,
        **engine_args
    )


# 创建引擎实例
engine = create_db_engine() 