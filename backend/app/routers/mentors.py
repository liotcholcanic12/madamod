from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/mentors", tags=["mentors"])

@router.post("/", response_model=schemas.Mentor)
def create_mentor(mentor_data: schemas.MentorCreate, db: Session = Depends(get_db)):
    db_mentor = crud.get_mentor_by_email(db, email=mentor_data.email)
    if db_mentor:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_mentor(db, mentor_data)

@router.post("/login")
def mentor_login(email: str, db: Session = Depends(get_db)):
    mentor = crud.get_mentor_by_email(db, email=email)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return {"id": mentor.id, "name": mentor.name}