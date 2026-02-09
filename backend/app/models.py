from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean, Text
from sqlalchemy.orm import relationship
from .database import Base

class Class(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    year = Column(String(20), default="2024")
    is_active = Column(Boolean, default=True)
    created_date = Column(Date)
    
    # Relationships
    tasks = relationship("Task", back_populates="class_ref")
    students = relationship("Student", back_populates="class_ref")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"))
    description = Column(Text, nullable=False)
    max_points = Column(Integer, default=10)
    is_required = Column(Boolean, default=False)
    order_number = Column(Integer, default=0)
    
    # Relationships
    class_ref = relationship("Class", back_populates="tasks")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"))
    
    # Relationships
    class_ref = relationship("Class", back_populates="students")

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    
    # Relationships
    approved_tasks = relationship("TaskCompletion", back_populates="mentor")

class TaskCompletion(Base):
    __tablename__ = "task_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))
    mentor_id = Column(Integer, ForeignKey("mentors.id"))
    points_earned = Column(Integer)
    date_completed = Column(Date)
    mentor_signature = Column(String(100))
    notes = Column(Text)
    
    # Relationships
    mentor = relationship("Mentor", back_populates="approved_tasks")