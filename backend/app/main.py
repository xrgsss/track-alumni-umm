from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api import auth, alumni, admin, export

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Alumni Tracking System API")

# Rate limiting configuration
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(alumni.router, prefix="/alumni", tags=["Alumni"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(export.router, prefix="/export", tags=["Export"])

@app.get("/")
def root():
    return {"message": "Welcome to Alumni Tracking System API"}
