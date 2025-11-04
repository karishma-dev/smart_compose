
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.smart_compose import router as smart_compose_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for sub-projects
app.include_router(smart_compose_router, prefix="/smart-compose")
# Future: add text summarizer and other routers here


# uvicorn app:app --reload --host 127.0.0.1 --port 8000