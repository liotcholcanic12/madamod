from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

# Class CRUD
def get_class(db: Session, class_id: int):
    return db.query(models.Class).filter(models.Class.id == class_id).first()

def get_classes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Class).offset(skip).limit(limit).all()

def create_class(db: Session, class_data: schemas.ClassCreate):
    db_class = models.Class(**class_data.dict(), created_date=date.today())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

# Task CRUD
def get_tasks_by_class(db: Session, class_id: int):
    return db.query(models.Task).filter(models.Task.class_id == class_id).all()

def create_task(db: Session, task_data: schemas.TaskCreate):
    db_task = models.Task(**task_data.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Student CRUD
def get_students_by_class(db: Session, class_id: int):
    return db.query(models.Student).filter(models.Student.class_id == class_id).all()

def create_student(db: Session, student_data: schemas.StudentCreate):
    db_student = models.Student(**student_data.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# Mentor CRUD
def get_mentor_by_email(db: Session, email: str):
    return db.query(models.Mentor).filter(models.Mentor.email == email).first()

def create_mentor(db: Session, mentor_data: schemas.MentorCreate):
    db_mentor = models.Mentor(**mentor_data.dict())
    db.add(db_mentor)
    db.commit()
    db.refresh(db_mentor)
    return db_mentor

# Task Completion CRUD
def create_task_completion(db: Session, completion_data: schemas.TaskCompletionCreate):
    db_completion = models.TaskCompletion(
        **completion_data.dict(),
        date_completed=date.today()
    )
    db.add(db_completion)
    db.commit()
    db.refresh(db_completion)
    return db_completion

def get_completions_by_student(db: Session, student_id: int):
    return db.query(models.TaskCompletion).filter(
        models.TaskCompletion.student_id == student_id
    ).all()