from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/class/{class_id}", response_model=List[schemas.Task])
def get_class_tasks(class_id: int, db: Session = Depends(get_db)):
    return crud.get_tasks_by_class(db, class_id=class_id)

@router.post("/", response_model=schemas.Task)
def create_task(task_data: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task_data)