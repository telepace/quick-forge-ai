from sqlmodel import Session, create_engine, select
import logging

from app import crud
from app.core.config import settings
from app.models import User, UserCreate
from app.core.db_factory import create_db_engine

# Get the logger
logger = logging.getLogger("app.db")

# Use db_factory to create the engine
engine = create_db_engine()


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def print_db_connection_info():
    """Print database connection information.
    
    This function retrieves and logs the database connection details, ensuring that sensitive information such as passwords
    is obscured for security reasons. It also provides additional configuration details specific to different database
    types, such as Supabase.
    """
    url = str(settings.SQLALCHEMY_DATABASE_URI)
    
    # Hide password information for security
    safe_url = url
    if "@" in url:
        # Find the username and password part and replace the password with ****
        userpass_part = url.split("@")[0]
        if ":" in userpass_part:
            username = userpass_part.split("://")[1].split(":")[0]
            safe_url = url.replace(userpass_part, f"{url.split('://')[0]}://{username}:****")
    
    # Print related configuration information
    logger.info("-" * 50)
    logger.info("Database Connection Information:")
    logger.info(f"Database URL: {safe_url}")
    logger.info(f"Database Type: {settings.DATABASE_TYPE}")
    
    if settings.DATABASE_TYPE == "supabase":
        logger.info(f"Supabase Pool Mode: {settings.SUPABASE_DB_POOL_MODE}")
        logger.info(f"Supabase Port: {settings.SUPABASE_DB_PORT or (6543 if settings.SUPABASE_DB_POOL_MODE == 'transaction' else 5432)}")
    
    logger.info("-" * 50)


def init_db(session: Session) -> None:
    # Print database connection information
    """Initialize the database by setting up initial data.
    
    This function performs several tasks to initialize the database: 1. Prints the database connection information. 2.
    Checks if a superuser with the email specified in settings exists. 3. If the superuser does not exist, it creates a new
    superuser with the credentials provided in settings.
    
    Args:
        session (Session): The database session to use for operations.
    """
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
