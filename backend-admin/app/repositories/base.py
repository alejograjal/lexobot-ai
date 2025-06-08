from sqlalchemy import exists
from app.db.models import BaseModel
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Generic, TypeVar, Type, List, Optional, Callable, Any

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], relationships: List[str] = None):
        self.model = model
        self.relationships = relationships or []

    async def execute_in_transaction(
        self,
        db: AsyncSession,
        operations: List[Callable[[AsyncSession], Any]]
    ) -> List[Any]:
        results = []
        for operation in operations:
            result = await operation(db)
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
        objs = [self.model(**obj) for obj in objects]
        db.add_all(objs)
        await db.flush()
        return objs

    async def bulk_update(self, db: AsyncSession, objects: List[dict]) -> List[ModelType]:
        results = []
        for obj_data in objects:
            obj_id = obj_data.pop('id', None)
            if obj_id:
                obj = await self.get_by_id(db, obj_id)
                if obj:
                    for key, value in obj_data.items():
                        setattr(obj, key, value)
                    results.append(obj)
        await db.flush()
        return results

    async def create(self, db: AsyncSession, obj_in: dict) -> ModelType:
        obj = self.model(**obj_in)
        db.add(obj)
        await db.flush()
        return obj

    async def update(self, db: AsyncSession, id: int, obj_in: dict) -> Optional[ModelType]:
        obj = await self.get_by_id(db, id)
        if obj:
            for key, value in obj_in.items():
                setattr(obj, key, value)
            await db.flush()
            return obj
        return None

    async def remove(self, db: AsyncSession, id: int) -> bool:
        """Physically remove an object from the database."""
        obj = await self.get_by_id(db, id, include_inactive=True)
        if obj:
            await db.delete(obj)
            await db.flush()
            return True
        return False
    
    async def delete(self, db: AsyncSession, id: int) -> bool:
        obj = await self.get_by_id(db, id)
        if obj:
            obj.is_active = False
            await db.flush()
            return True
        return False
