from sqlalchemy import exists
from app.db.models import BaseModel
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Generic, TypeVar, Type, List, Optional, Callable, Any

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], relationships: List[str] = None):
        self.model = model
        self.relationships = relationships or []

    @asynccontextmanager
    async def transaction(self, db: AsyncSession):
        """
        Context manager for database transactions.
        Handles commit/rollback automatically.
        
        Usage:
            async with repo.transaction(db) as session:
                await session.execute(...)
        """
        try:
            async with db.begin():
                yield db
        except Exception as e:
            await db.rollback()
            raise e

    async def execute_in_transaction(
        self,
        db: AsyncSession,
        operations: List[Callable[[AsyncSession], Any]]
    ) -> List[Any]:
        """
        Execute multiple database operations in a single transaction.
        
        Args:
            db: Database session
            operations: List of async callables that perform db operations
            
        Returns:
            List of results from operations
        """
        results = []
        async with self.transaction(db) as session:
            for operation in operations:
                result = await operation(session)
                results.append(result)
        return results

    async def exists(self, db: AsyncSession, id: int) -> bool:
        stmt = select(exists().where(
            (self.model.id == id) & 
            (self.model.is_active == True)
        ))
        result = await db.execute(stmt)
        return result.scalar()

    async def get_by_id(self, db: AsyncSession, id: int, include_inactive: bool = False) -> Optional[ModelType]:
        stmt = select(self.model).where(self.model.id == id)
        
        for relationship in self.relationships:
            stmt = stmt.options(selectinload(getattr(self.model, relationship)))
        
        if not include_inactive:
            stmt = stmt.where(self.model.is_active == True)
            
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession, include_inactive: bool = False) -> List[ModelType]:
        stmt = select(self.model)
        if not include_inactive:
            stmt = stmt.where(self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def bulk_create(self, db: AsyncSession, objects: List[dict]) -> List[ModelType]:
        """Bulk create objects in a single transaction"""
        async with self.transaction(db) as session:
            objs = [self.model(**obj) for obj in objects]
            session.add_all(objs)
            await session.flush()
            return objs

    async def bulk_update(self, db: AsyncSession, objects: List[dict]) -> List[ModelType]:
        """Bulk update objects in a single transaction"""
        async with self.transaction(db) as session:
            results = []
            for obj_data in objects:
                obj_id = obj_data.pop('id', None)
                if obj_id:
                    obj = await self.get_by_id(session, obj_id)
                    if obj:
                        for key, value in obj_data.items():
                            setattr(obj, key, value)
                        results.append(obj)
            await session.flush()
            return results

    async def create(self, db: AsyncSession, obj_in: dict) -> ModelType:
        async with self.transaction(db) as session:
            obj = self.model(**obj_in)
            session.add(obj)
            await session.flush()
            return obj

    async def update(self, db: AsyncSession, id: int, obj_in: dict) -> Optional[ModelType]:
        async with self.transaction(db) as session:
            obj = await self.get_by_id(session, id)
            if obj:
                for key, value in obj_in.items():
                    setattr(obj, key, value)
                await session.flush()
                return obj
        return None

    async def remove(self, db: AsyncSession, id: int) -> bool:
        """Physically remove an object from the database."""
        async with self.transaction(db) as session:
            obj = await self.get_by_id(session, id, include_inactive=True)
            if obj:
                await session.delete(obj)
                await session.flush()
                return True
        return False
    
    async def delete(self, db: AsyncSession, id: int) -> bool:
        async with self.transaction(db) as session:
            obj = await self.get_by_id(session, id)
            if obj:
                obj.is_active = False
                await session.flush()
                return True
        return False
    
