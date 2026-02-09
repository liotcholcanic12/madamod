from pydantic import BaseModel
from datetime import date
from typing import Optional, List

# Class schemas
class ClassBase(BaseModel):
    name: str
    year: str = "2024"
    is_active: bool = True

class ClassCreate(ClassBase):
    pass

class Class(ClassBase):
    id: int
    created_date: Optional[date] = None
    
    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    description: str
    max_points: int = 10
    is_required: bool = False
    order_number: int = 0

class TaskCreate(TaskBase):
    class_id: int

class Task(TaskBase):
    id: int
    class_id: int
    
    class Config:
        from_attributes = True

# Student schemas
class StudentBase(BaseModel):
    name: str

class StudentCreate(StudentBase):
    class_id: int

class Student(StudentBase):
    id: int
    class_id: int
    
    class Config:
        from_attributes = True

# Mentor schemas
class MentorBase(BaseModel):
    name: str
    email: str

class MentorCreate(MentorBase):
    pass

class Mentor(MentorBase):
    id: int
    
    class Config:
        from_attributes = True

# Task Completion schemas
class TaskCompletionBase(BaseModel):
    points_earned: int
    mentor_signature: str
    notes: Optional[str] = None

class TaskCompletionCreate(TaskCompletionBase):
    student_id: int
    task_id: int
    mentor_id: int

class TaskCompletion(TaskCompletionBase):
    id: int
    student_id: int
    task_id: int
    mentor_id: int
    date_completed: date
    
    class Config:
        from_attributes = True