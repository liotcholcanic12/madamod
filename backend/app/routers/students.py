from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/class/{class_id}", response_model=List[schemas.Student])
def get_class_students(class_id: int, db: Session = Depends(get_db)):
    return crud.get_students_by_class(db, class_id=class_id)

@router.post("/", response_model=schemas.Student)
def create_student(student_data: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db, student_data)