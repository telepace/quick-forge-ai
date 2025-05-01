import logging
from typing import Any
from typing import Any as AnyType

from sqlmodel import create_engine

from app.core.config import settings

# Get the logger
logger = logging.getLogger("app.db_factory")


def get_engine_args() -> dict[str, Any]:
    """Returns engine arguments based on the database type.

    This function generates connection arguments tailored to different database types, particularly Supabase. It sets
    specific options and parameters depending on the pool mode and environment settings.

    Returns:
        dict[str, Any]: A dictionary containing the connection arguments for the engine.
    """
    connect_args = {}

    # Supabase specific connection arguments
    if settings.DATABASE_TYPE == "supabase":
        # Add parameters for the Supabase connection pool
        connect_args["options"] = "-c search_path=public -c statement_timeout=60000"

        # Add other parameters based on the pool mode (pool_mode)
        pool_mode = getattr(settings, "SUPABASE_DB_POOL_MODE", "session")
        if pool_mode == "session":
            # Optimization parameters for session mode
            connect_args["keepalives"] = "1"
            connect_args["keepalives_idle"] = "30"
            connect_args["keepalives_interval"] = "10"
            connect_args["keepalives_count"] = "5"
        elif pool_mode == "transaction":
            # Transaction mode does not support prepare statements
            connect_args["prepare_threshold"] = "0"  # Disable prepare statements

    # Additional parameters can be added based on the environment
    if settings.ENVIRONMENT == "local":
        # Parameters that may be needed in the development environment
        pass

    return {"connect_args": connect_args}


def get_db_url() -> str:
    """
    Gets the database URL based on the configuration and automatically handles port issues
    """
    # First, get the base URL
    """Gets the database URL based on the configuration and automatically handles port issues.

    This function retrieves the base database URL from the settings and checks if it is intended for Supabase. If so, it
    ensures that the correct port is specified in the URL. The default port is selected based on the connection pool mode:
    6543 for "transaction" mode and 5432 for "session" or any other mode.

    Returns:
        str: The database URL with the correctly configured port if applicable.
    """
    url = str(settings.SQLALCHEMY_DATABASE_URI)

    # For Supabase, ensure the port matches the connection pool mode
    if settings.DATABASE_TYPE == "supabase" and not settings.SUPABASE_DB_PORT:
        # If no port is specified, automatically select based on the connection pool mode
        pool_mode = getattr(settings, "SUPABASE_DB_POOL_MODE", "session")
        default_port = 6543 if pool_mode == "transaction" else 5432

        # Replace the port in the URL
        # Find the host part
        host_part = url.split("@")[1].split("/")[0]
        if ":" in host_part:
            # There is a port number, replace it
            old_host = host_part
            new_host = f"{host_part.split(':')[0]}:{default_port}"
            url = url.replace(old_host, new_host)
            logger.info(
                f"Automatically selected port: {default_port} based on connection pool mode ({pool_mode})"
            )

    return url


def create_db_engine() -> AnyType:
    """Creates and returns a configured database engine.

    This function retrieves the necessary arguments for creating the database engine, configures connection pooling
    parameters, constructs the database URL, and then creates and returns the engine.

    Returns:
        sqlalchemy.engine.Engine: The configured database engine.
    """
    engine_args = get_engine_args()

    # Add connection pool configuration
    engine_args.update(
        {
            "pool_pre_ping": True,  # Ping before connection to ensure connection is usable
            "pool_recycle": 300,  # Maximum lifetime of a connection in the pool (seconds)
            "pool_size": 5,  # Connection pool size
            "max_overflow": 10,  # Number of additional connections allowed to be created when the pool overflows
        }
    )

    # Get the correct database URL
    url = get_db_url()

    # 返回任意类型，不要指定具体类型
    return create_engine(url, **engine_args)


# Create engine instance
engine = create_db_engine()
