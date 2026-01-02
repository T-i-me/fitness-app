from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import base64
from ai_service import get_ai_workout_recommendations, analyze_exercise_form, get_rest_day_suggestion


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# User Profile Models
class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    currentStreak: int = 0
    longestStreak: int = 0
    totalWorkouts: int = 0
    joinDate: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    fitnessGoal: Optional[str] = None
    fitnessLevel: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    fitnessGoal: Optional[str] = None
    fitnessLevel: Optional[str] = None

# Workout Models
class Exercise(BaseModel):
    name: str
    sets: int
    reps: str

class WorkoutPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    duration: str
    difficulty: str
    type: str
    exercises: List[Exercise]
    completed: bool = False
    scheduledFor: Optional[str] = None
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CreateWorkoutPlan(BaseModel):
    name: str
    duration: str
    difficulty: str
    type: str
    exercises: List[Exercise]
    scheduledFor: Optional[str] = None

class WorkoutLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    workout_id: str
    workout_name: str
    duration: str
    completedAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# AI Models
class AIRecommendationRequest(BaseModel):
    user_id: str

class FormCheckRequest(BaseModel):
    exercise_name: str
    image_base64: str

class RestDayRequest(BaseModel):
    user_id: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# User Profile Endpoints
@api_router.post("/users", response_model=UserProfile)
async def create_user(user: UserProfile):
    doc = user.model_dump()
    await db.users.insert_one(doc)
    return user

@api_router.get("/users/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)

@api_router.put("/users/{user_id}", response_model=UserProfile)
async def update_user(user_id: str, update: UserProfileUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    return UserProfile(**user)

@api_router.post("/users/{user_id}/reset-progress")
async def reset_user_progress(user_id: str):
    """Reset user's workout progress including streak and workout count"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "currentStreak": 0,
            "totalWorkouts": 0
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Also delete all workout logs for this user
    await db.workout_logs.delete_many({"user_id": user_id})
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    return {"message": "Progress reset successfully", "user": UserProfile(**user)}

# Workout Plan Endpoints
@api_router.post("/users/{user_id}/workouts", response_model=WorkoutPlan)
async def create_workout_plan(user_id: str, workout: CreateWorkoutPlan):
    workout_plan = WorkoutPlan(
        user_id=user_id,
        **workout.model_dump()
    )
    doc = workout_plan.model_dump()
    await db.workout_plans.insert_one(doc)
    return workout_plan

@api_router.get("/users/{user_id}/workouts", response_model=List[WorkoutPlan])
async def get_user_workouts(user_id: str):
    workouts = await db.workout_plans.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    return [WorkoutPlan(**w) for w in workouts]

@api_router.put("/workouts/{workout_id}/complete")
async def complete_workout(workout_id: str):
    result = await db.workout_plans.update_one(
        {"id": workout_id},
        {"$set": {"completed": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    # Get workout details to log it
    workout = await db.workout_plans.find_one({"id": workout_id}, {"_id": 0})
    if workout:
        # Create workout log
        log = WorkoutLog(
            user_id=workout['user_id'],
            workout_id=workout_id,
            workout_name=workout['name'],
            duration=workout['duration']
        )
        await db.workout_logs.insert_one(log.model_dump())
        
        # Update user stats
        await db.users.update_one(
            {"id": workout['user_id']},
            {
                "$inc": {
                    "totalWorkouts": 1,
                    "currentStreak": 1
                }
            }
        )
    
    return {"message": "Workout completed", "workout": workout}

@api_router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str):
    result = await db.workout_plans.delete_one({"id": workout_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted"}

# Workout Log Endpoints
@api_router.get("/users/{user_id}/workout-logs", response_model=List[WorkoutLog])
async def get_workout_logs(user_id: str):
    logs = await db.workout_logs.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    return [WorkoutLog(**log) for log in logs]

# AI-Powered Endpoints
@api_router.post("/ai/workout-recommendations")
async def get_workout_recommendations(request: AIRecommendationRequest):
    """Get AI-powered workout recommendations"""
    # Get user data
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get recent workout logs
    logs = await db.workout_logs.find({"user_id": request.user_id}, {"_id": 0}).to_list(10)
    
    recommendations = await get_ai_workout_recommendations(user, logs)
    return recommendations

@api_router.post("/ai/form-check")
async def check_exercise_form(request: FormCheckRequest):
    """Analyze exercise form from image"""
    if not request.image_base64:
        raise HTTPException(status_code=400, detail="Image is required")
    
    analysis = await analyze_exercise_form(request.image_base64, request.exercise_name)
    return analysis

@api_router.post("/ai/rest-day-suggestion")
async def get_rest_suggestion(request: RestDayRequest):
    """Get smart rest day suggestion"""
    # Get user data
    user = await db.users.find_one({"id": request.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get recent workouts
    logs = await db.workout_logs.find({"user_id": request.user_id}, {"_id": 0}).sort("completedAt", -1).to_list(7)
    
    suggestion = await get_rest_day_suggestion(user, logs)
    return suggestion

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()