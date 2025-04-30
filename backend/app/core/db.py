from sqlmodel import Session, create_engine, select
import logging

from app import crud
from app.core.config import settings
from app.models import User, UserCreate
from app.core.db_factory import create_db_engine

# 获取logger
logger = logging.getLogger("app.db")

# 使用db_factory创建引擎
engine = create_db_engine()


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def print_db_connection_info():
    """打印数据库连接信息"""
    url = str(settings.SQLALCHEMY_DATABASE_URI)
    
    # 屏蔽密码信息，保证安全
    safe_url = url
    if "@" in url:
        # 找到用户名密码部分并替换密码为 ****
        userpass_part = url.split("@")[0]
        if ":" in userpass_part:
            username = userpass_part.split("://")[1].split(":")[0]
            safe_url = url.replace(userpass_part, f"{url.split('://')[0]}://{username}:****")
    
    # 打印相关配置信息
    logger.info("-" * 50)
    logger.info("数据库连接信息:")
    logger.info(f"Database URL: {safe_url}")
    logger.info(f"Database Type: {settings.DATABASE_TYPE}")
    
    if settings.DATABASE_TYPE == "supabase":
        logger.info(f"Supabase Pool Mode: {settings.SUPABASE_DB_POOL_MODE}")
        logger.info(f"Supabase Port: {settings.SUPABASE_DB_PORT or (6543 if settings.SUPABASE_DB_POOL_MODE == 'transaction' else 5432)}")
    
    logger.info("-" * 50)


def init_db(session: Session) -> None:
    # 打印数据库连接信息
    print_db_connection_info()
    
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
