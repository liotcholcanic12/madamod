from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
from datetime import date

app = FastAPI()

# Simple CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def get_db():
    conn = sqlite3.connect('school_tasks.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            year TEXT DEFAULT '2024',
            is_active BOOLEAN DEFAULT 1,
            created_date DATE
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Models
class ClassCreate(BaseModel):
    name: str
    year: str = "2024"

class ClassResponse(BaseModel):
    id: int
    name: str
    year: str
    is_active: bool = True
    created_date: date = None

# Routes
@app.get("/")
def read_root():
    return {"message": "School Task Tracker API is running!"}

@app.get("/classes/", response_model=List[ClassResponse])
def get_classes():
    conn = get_db()
    classes = conn.execute('SELECT * FROM classes').fetchall()
    conn.close()
    return [dict(cls) for cls in classes]

@app.post("/classes/", response_model=ClassResponse)
def create_class(class_data: ClassCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO classes (name, year, created_date) VALUES (?, ?, ?)',
        (class_data.name, class_data.year, date.today())
    )
    conn.commit()
    class_id = cursor.lastrowid
    conn.close()
    
    return {
        "id": class_id,
        "name": class_data.name,
        "year": class_data.year,
        "is_active": True,
        "created_date": date.today()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)