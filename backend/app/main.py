from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.analytics import analytics_router
# Import models to ensure they're loaded
from app.core import models

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the analytics router with a prefix (e.g., "/api")
app.include_router(analytics_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chrome Extension Analytics API!"}
