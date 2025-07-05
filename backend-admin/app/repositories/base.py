from app.db.models import BaseModel
from sqlalchemy import exists, and_
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import InstrumentedAttribute
from typing import Generic, TypeVar, Type, List, Optional, Callable, Any

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], relationships: List[str] = None):
        self.model = model
        self.relationships = relationships or []

    def parse_relationship(self, model: Type[ModelType], rel_path: str):
        parts = rel_path.split(".")

        attr = getattr(model, parts[0])
        if not isinstance(attr, InstrumentedAttribute):
            raise ValueError(f"{parts[0]} is not a valid relationship on {model}")

        loader = selectinload(attr)
        current_loader = loader
        current_model = attr.property.mapper.class_

        for part in parts[1:]:
            attr = getattr(current_model, part)
            if not isinstance(attr, InstrumentedAttribute):
                raise ValueError(f"{part} is not a valid relationship on {current_model}")
            current_loader = current_loader.selectinload(attr)
            current_model = attr.property.mapper.class_

        return loader

    def _add_relationships_to_query(self, stmt):
        for relationship in self.relationships:
            stmt = stmt.options(self.parse_relationship(self.model, relationship))
        return stmt
    
    async def _load_relationships(self, db: AsyncSession, obj: ModelType) -> ModelType:
        if not self.relationships or not obj:
            return obj
    
        if obj not in db:
            db.add(obj)
        
        for relationship in self.relationships:
            parts = relationship.split('.')
            current = obj
            for part in parts:
                if current is not None:
                    await db.refresh(current, attribute_names=[part])
                    current = getattr(current, part, None)

        return obj

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
        stmt = self._add_relationships_to_query(stmt)
        
        if not include_inactive:
            stmt = stmt.where(self.model.is_active == True)
            
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession, include_inactive: bool = False) -> List[ModelType]:
        stmt = select(self.model)
        stmt = self._add_relationships_to_query(stmt)

        if not include_inactive:
            stmt = stmt.where(self.model.is_active == True)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_all_by_ids(self, db: AsyncSession, ids: List[int]) -> List[ModelType]:
        stmt = select(self.model).where(
            and_(
                self.model.is_active == True,
                self.model.id.in_(ids))
            )
        stmt = self._add_relationships_to_query(stmt)

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
        await db.refresh(obj)
        return await self._load_relationships(db, obj)

    async def update(self, db: AsyncSession, id: int, obj_in: dict) -> Optional[ModelType]:
        obj = await self.get_by_id(db, id)
        if obj:
            for key, value in obj_in.items():
                setattr(obj, key, value)

            await db.flush()
            await db.refresh(obj)

            return await self._load_relationships(db, obj)
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
