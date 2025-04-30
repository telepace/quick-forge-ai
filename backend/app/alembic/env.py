import os
import sys
from logging.config import fileConfig
from pathlib import Path
import logging

from alembic import context
from sqlalchemy import engine_from_config, pool

# 添加项目根目录到 Python 路径
# 获取当前文件的目录
script_dir = Path(__file__).resolve().parent
# 添加项目根目录到 Python 路径，确保能正确导入本项目的模块
backend_dir = script_dir.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# 获取logger
logger = logging.getLogger("alembic.env")

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# target_metadata = None

# 使用显式导入，而不是从 app.models 导入
from sqlmodel import SQLModel  # noqa
# 然后导入所有模型，确保它们被注册到 SQLModel.metadata
from app.models import User, Item  # noqa
from app.core.config import settings  # noqa
from app.core.db_factory import get_engine_args  # noqa

target_metadata = SQLModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_url():
    return str(settings.SQLALCHEMY_DATABASE_URI)


def print_db_info():
    """打印数据库连接信息。
    
    这个函数会从配置中获取数据库URL，并屏蔽其中的密码信息以确保安全。然后，它会打印出数据库连接的相关配置信息，
    包括数据库类型、主机地址、端口、用户名和数据库名称等。如果数据库类型是Supabase，还会额外打印出Supabase特定的配置。 最后，如果存在连接参数，也会一并打印出来。
    """
    url = get_url()
    
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
        logger.info(f"Supabase Host: {settings.SUPABASE_DB_HOST}")
        logger.info(f"Supabase Port: {settings.SUPABASE_DB_PORT}")
        logger.info(f"Supabase User: {settings.SUPABASE_DB_USER}")
        logger.info(f"Supabase Database: {settings.SUPABASE_DB_NAME}")
    else:
        logger.info(f"Postgres Host: {settings.POSTGRES_SERVER}")
        logger.info(f"Postgres Port: {settings.POSTGRES_PORT}")
        logger.info(f"Postgres User: {settings.POSTGRES_USER}")
        logger.info(f"Postgres Database: {settings.POSTGRES_DB}")
    
    # 打印连接参数
    engine_args = get_engine_args()
    if engine_args and "connect_args" in engine_args:
        logger.info("Connection Arguments:")
        for key, value in engine_args["connect_args"].items():
            logger.info(f"  - {key}: {value}")
    
    logger.info("-" * 50)


def run_migrations_offline():
    """Run migrations in 'offline' mode.
    
    This function configures the Alembic migration context with just a database URL, rather than creating an engine.
    Although using an engine is also acceptable, skipping its creation means that no DBAPI needs to be available. Calls to
    `context.execute()` within this function will emit the given SQL string to the script output.
    """
    url = get_url()
    
    # 打印数据库连接信息
    print_db_info()
    
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    # 打印数据库连接信息
    """Run migrations in 'online' mode.
    
    This function sets up an SQLAlchemy engine and connection to execute database migrations. It first prints the database
    connection information, then configures the database URL, retrieves engine-specific arguments, creates a NullPool engine
    with the appropriate connection arguments, and finally runs the migrations within a transaction context.
    """
    print_db_info()
    
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = get_url()
    
    # 获取数据库引擎特定的参数
    engine_args = get_engine_args()
    
    # 创建引擎 - 直接传递 connect_args 而不是通过 configuration
    if engine_args and "connect_args" in engine_args:
        connect_args = engine_args["connect_args"]
    else:
        connect_args = {}
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args,  # 直接传递 connect_args
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
