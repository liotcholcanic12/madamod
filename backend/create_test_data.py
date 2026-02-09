import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import Base, Class, Task, Student, Mentor
from datetime import date

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Create a test class
test_class = Class(
    name="Grade 5A - Summer 2024",
    year="2024",
    is_active=True,
    created_date=date.today()
)
db.add(test_class)
db.commit()
db.refresh(test_class)

# Create tasks
tasks_data = [
    {"description": "Read 5 books", "max_points": 20, "is_required": True},
    {"description": "Complete math workbook", "max_points": 15, "is_required": True},
    {"description": "Science project", "max_points": 25, "is_required": False},
    {"description": "Write summer journal", "max_points": 10, "is_required": False},
]

for i, task_data in enumerate(tasks_data):
    task = Task(
        class_id=test_class.id,
        order_number=i,
        **task_data
    )
    db.add(task)

# Create students
students = ["Ahmed Mohamed", "Sarah Johnson", "Michael Chen", "Emma Wilson"]
for student_name in students:
    student = Student(name=student_name, class_id=test_class.id)
    db.add(student)

# Create mentor
mentor = Mentor(name="Mr. Smith", email="smith@school.edu")
db.add(mentor)

db.commit()
db.close()

print("✅ Test data created!")
print(f"Class ID: {test_class.id}")
print(f"Tasks: {len(tasks_data)}")
print(f"Students: {len(students)}")