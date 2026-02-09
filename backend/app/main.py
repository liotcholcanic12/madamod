from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import classes, tasks, students, mentors

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="School Task Tracker API",
    description="API for tracking student summer tasks",
    version="1.0.0"
)

# Simple CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow everything for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(classes.router)
app.include_router(tasks.router)
app.include_router(students.router)
app.include_router(mentors.router)

@app.get("/")
def read_root():
    return {"message": "School Task Tracker API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}