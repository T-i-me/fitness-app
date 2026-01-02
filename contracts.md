# GetFit Pro - Full Stack Implementation Contracts

## Overview
Complete fitness tracking app with AI-powered features, custom workout builder, and progress tracking.

## API Contracts

### User Management
- **POST /api/users** - Create new user profile
- **GET /api/users/:user_id** - Get user profile
- **PUT /api/users/:user_id** - Update user profile
- **POST /api/users/:user_id/reset-progress** - Reset user's workout progress and stats

### Workout Plans
- **POST /api/users/:user_id/workouts** - Create custom workout plan
- **GET /api/users/:user_id/workouts** - Get all workout plans for user
- **PUT /api/workouts/:workout_id/complete** - Mark workout as completed
- **DELETE /api/workouts/:workout_id** - Delete workout plan

### Workout Logging
- **GET /api/users/:user_id/workout-logs** - Get workout history

### AI Features
- **POST /api/ai/workout-recommendations** - Get AI-generated workout recommendations based on user data
  - Request: `{ user_id: string }`
  - Response: `{ recommendations: [{ name, duration, difficulty, exercises, rationale }] }`

- **POST /api/ai/form-check** - Analyze exercise form from image
  - Request: `{ exercise_name: string, image_base64: string }`
  - Response: `{ score, strengths, improvements, safety_concerns, tips }`

- **POST /api/ai/rest-day-suggestion** - Get smart rest day recommendations
  - Request: `{ user_id: string }`
  - Response: `{ should_rest, reasoning, recovery_tips, light_activities }`

## Frontend Routes
- `/` - Quiz page (7-question fitness assessment)
- `/dashboard` - Main dashboard with workout plans and stats
- `/exercises` - Exercise library with search and filters
- `/progress` - Progress tracking with charts and workout history
- `/profile` - User profile settings
- `/workout-detail` - Detailed workout session view
- `/ai-features` - AI-powered features page
- `/workout-builder` - Custom workout builder

## Features Implemented

### Core Features
1. **7-Question Fitness Quiz** - Collects user preferences for personalized plans
2. **Dashboard** - Overview of stats, streaks, workout plans, and quick actions
3. **Workout Plans** - Pre-defined and custom workout plans with exercise details
4. **Exercise Library** - Browse and search exercises by category/difficulty
5. **Progress Tracking** - View workout history, streaks, and activity charts
6. **Profile Management** - Update user info and preferences

### Advanced AI Features
1. **AI Workout Recommendations** - GPT-5.2 generates personalized workout plans based on:
   - User's fitness goal
   - Current fitness level
   - Workout history
   - Progress patterns

2. **AI Form Checker** - Upload exercise photo for AI analysis:
   - Form quality score (1-10)
   - Strengths and areas for improvement
   - Safety concerns
   - Specific tips for better form

3. **Smart Rest Day Suggestions** - AI determines if user needs rest based on:
   - Current workout streak
   - Recent workout frequency
   - Fitness level
   - Provides recovery tips and light activities

4. **Custom Workout Builder** - Create personalized workouts:
   - Name, duration, difficulty, type
   - Add multiple exercises with sets/reps
   - Schedule for specific days
   - Preview before saving

5. **Reset Progress** - Fully functional reset button in profile:
   - Resets workout count and streak
   - Clears workout logs
   - Confirmation dialog before reset

## Database Collections

### users
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "currentStreak": "number",
  "longestStreak": "number",
  "totalWorkouts": "number",
  "joinDate": "string",
  "fitnessGoal": "string",
  "fitnessLevel": "string"
}
```

### workout_plans
```json
{
  "id": "string",
  "user_id": "string",
  "name": "string",
  "duration": "string",
  "difficulty": "string",
  "type": "string",
  "exercises": [{ "name": "string", "sets": "number", "reps": "string" }],
  "completed": "boolean",
  "scheduledFor": "string",
  "createdAt": "string"
}
```

### workout_logs
```json
{
  "id": "string",
  "user_id": "string",
  "workout_id": "string",
  "workout_name": "string",
  "duration": "string",
  "completedAt": "string"
}
```

## AI Integration

### Technology Stack
- **AI Service**: OpenAI GPT-5.2 via Emergent LLM Key
- **Library**: emergentintegrations (custom LLM wrapper)
- **Features**: Text generation + Vision (form analysis)

### AI Service Functions (backend/ai_service.py)
1. `get_ai_workout_recommendations(user_data, progress_data)` - Generates 3 personalized workouts
2. `analyze_exercise_form(image_base64, exercise_name)` - Vision-based form analysis
3. `get_rest_day_suggestion(user_data, recent_workouts)` - Smart recovery recommendations

## Mock Data (Frontend Only)
- Initial workout plans in `mockData.js`
- Exercise library with 8 sample exercises
- User profile with mock stats
- Quiz questions and answers stored in localStorage

## Backend Integration Notes
- All AI features connected to backend endpoints
- Custom workout builder saves to database via API
- Reset progress calls backend API with localStorage fallback
- Workout completion updates both database and user stats

## Testing Requirements
1. Test quiz flow completion
2. Test dashboard displays stats correctly
3. Test custom workout builder creates and saves workouts
4. Test AI workout recommendations generation
5. Test AI form checker with image upload
6. Test rest day suggestion
7. Test reset progress functionality
8. Test workout completion and logging
9. Test exercise library search and filters
10. Test profile update functionality
