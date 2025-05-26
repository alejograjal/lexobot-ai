from app.db.models import BaseModel
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Generic, TypeVar, Type, List, Optional

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], relationships: List[str] = None):
        self.model = model
        self.relationships = relationships or []

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

    async def create(self, db: AsyncSession, obj_in: dict) -> ModelType:
        obj = self.model(**obj_in)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, id: int, obj_in: dict) -> Optional[ModelType]:
        obj = await self.get_by_id(db, id)
        if obj:
            for key, value in obj_in.items():
                setattr(obj, key, value)
            await db.commit()
            await db.refresh(obj)
        return obj

    async def remove(self, db: AsyncSession, id: int) -> bool:
        obj = self.get_by_id(db, id)
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False
    
    async def delete(self, db: AsyncSession, id: int) -> bool:
        obj = self.get_by_id(db, id)
        if obj:
            obj.is_active = False
            db.commit()
            db.refresh(obj)
            return True
        return False