from app.core import settings
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DATABASE_URL = settings.POSTGRESQL_DATABASE_URL

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    """Dependency for getting async DB session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()  
        except:
            await session.rollback()
            raise