// Mock data for frontend-only implementation
// This will be replaced with actual API calls later

export const quizQuestions = [
  {
    id: 1,
    question: "What is your fitness goal?",
    options: [
      { value: "lose_weight", label: "Lose weight", icon: "Flame" },
      { value: "build_muscle", label: "Build muscle", icon: "Dumbbell" },
      { value: "get_fit", label: "Get fit & toned", icon: "Zap" },
      { value: "improve_health", label: "Improve overall health", icon: "Heart" }
    ]
  },
  {
    id: 2,
    question: "What's your current fitness level?",
    options: [
      { value: "beginner", label: "Beginner", icon: "Star" },
      { value: "intermediate", label: "Intermediate", icon: "TrendingUp" },
      { value: "advanced", label: "Advanced", icon: "Award" }
    ]
  },
  {
    id: 3,
    question: "How many days per week can you workout?",
    options: [
      { value: "2-3", label: "2-3 days", icon: "Calendar" },
      { value: "4-5", label: "4-5 days", icon: "CalendarDays" },
      { value: "6-7", label: "6-7 days", icon: "CalendarCheck" }
    ]
  },
  {
    id: 4,
    question: "What equipment do you have access to?",
    options: [
      { value: "none", label: "No equipment (bodyweight)", icon: "User" },
      { value: "basic", label: "Basic (dumbbells, bands)", icon: "Dumbbell" },
      { value: "full_gym", label: "Full gym access", icon: "Building2" }
    ]
  },
  {
    id: 5,
    question: "How long can each workout session be?",
    options: [
      { value: "20-30", label: "20-30 minutes", icon: "Clock" },
      { value: "30-45", label: "30-45 minutes", icon: "Clock3" },
      { value: "45-60", label: "45-60 minutes", icon: "Clock4" },
      { value: "60+", label: "60+ minutes", icon: "Clock9" }
    ]
  },
  {
    id: 6,
    question: "Do you have any injuries or limitations?",
    options: [
      { value: "none", label: "No limitations", icon: "CheckCircle" },
      { value: "minor", label: "Minor limitations", icon: "AlertCircle" },
      { value: "significant", label: "Significant limitations", icon: "AlertTriangle" }
    ]
  },
  {
    id: 7,
    question: "What's your preferred workout style?",
    options: [
      { value: "strength", label: "Strength training", icon: "Dumbbell" },
      { value: "cardio", label: "Cardio focused", icon: "Activity" },
      { value: "mixed", label: "Mixed/Balanced", icon: "Zap" },
      { value: "flexibility", label: "Flexibility/Yoga", icon: "Wind" }
    ]
  }
];

export const exercises = [
  {
    id: 1,
    name: "Push-ups",
    category: "Chest",
    difficulty: "Beginner",
    equipment: "None",
    muscleGroup: "Upper Body",
    description: "Classic bodyweight exercise for chest, shoulders, and triceps",
    sets: 3,
    reps: "10-15"
  },
  {
    id: 2,
    name: "Squats",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    muscleGroup: "Lower Body",
    description: "Fundamental lower body exercise targeting quads, glutes, and core",
    sets: 3,
    reps: "12-15"
  },
  {
    id: 3,
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "None",
    muscleGroup: "Core",
    description: "Isometric core exercise for stability and strength",
    sets: 3,
    reps: "30-60s"
  },
  {
    id: 4,
    name: "Dumbbell Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    muscleGroup: "Upper Body",
    description: "Build chest strength and size with controlled pressing motion",
    sets: 4,
    reps: "8-12"
  },
  {
    id: 5,
    name: "Deadlifts",
    category: "Back",
    difficulty: "Advanced",
    equipment: "Barbell",
    muscleGroup: "Full Body",
    description: "Compound lift targeting posterior chain and full body strength",
    sets: 4,
    reps: "6-8"
  },
  {
    id: 6,
    name: "Burpees",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "None",
    muscleGroup: "Full Body",
    description: "High-intensity full body exercise for cardio and strength",
    sets: 3,
    reps: "10-15"
  },
  {
    id: 7,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Intermediate",
    equipment: "Pull-up Bar",
    muscleGroup: "Upper Body",
    description: "Vertical pulling exercise for back and biceps development",
    sets: 3,
    reps: "6-10"
  },
  {
    id: 8,
    name: "Lunges",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "None",
    muscleGroup: "Lower Body",
    description: "Unilateral leg exercise for balance and strength",
    sets: 3,
    reps: "10-12 each"
  }
];

export const mockUser = {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  currentStreak: 5,
  longestStreak: 12,
  totalWorkouts: 47,
  joinDate: "2025-01-01",
  fitnessGoal: "build_muscle",
  fitnessLevel: "intermediate"
};

export const workoutPlans = [
  {
    id: 1,
    name: "Upper Body Blast",
    duration: "45 min",
    difficulty: "Intermediate",
    type: "Strength",
    exercises: [
      { name: "Push-ups", sets: 4, reps: 12 },
      { name: "Dumbbell Rows", sets: 4, reps: 10 },
      { name: "Shoulder Press", sets: 3, reps: 12 },
      { name: "Bicep Curls", sets: 3, reps: 15 },
      { name: "Tricep Dips", sets: 3, reps: 12 }
    ],
    completed: false,
    scheduledFor: "Monday"
  },
  {
    id: 2,
    name: "Lower Body Power",
    duration: "40 min",
    difficulty: "Intermediate",
    type: "Strength",
    exercises: [
      { name: "Squats", sets: 4, reps: 12 },
      { name: "Lunges", sets: 3, reps: 12 },
      { name: "Leg Press", sets: 4, reps: 10 },
      { name: "Calf Raises", sets: 3, reps: 15 },
      { name: "Leg Curls", sets: 3, reps: 12 }
    ],
    completed: false,
    scheduledFor: "Wednesday"
  },
  {
    id: 3,
    name: "Cardio & Core",
    duration: "30 min",
    difficulty: "Beginner",
    type: "Cardio",
    exercises: [
      { name: "Burpees", sets: 3, reps: 10 },
      { name: "Mountain Climbers", sets: 3, reps: 20 },
      { name: "Plank", sets: 3, reps: "60s" },
      { name: "Russian Twists", sets: 3, reps: 20 },
      { name: "Jumping Jacks", sets: 3, reps: 30 }
    ],
    completed: true,
    scheduledFor: "Friday"
  }
];

export const progressData = [
  { date: "2025-01-01", workouts: 1, duration: 30 },
  { date: "2025-01-03", workouts: 1, duration: 45 },
  { date: "2025-01-05", workouts: 1, duration: 40 },
  { date: "2025-01-08", workouts: 1, duration: 35 },
  { date: "2025-01-10", workouts: 1, duration: 45 },
  { date: "2025-01-12", workouts: 1, duration: 50 },
  { date: "2025-01-15", workouts: 1, duration: 40 }
];

// Store quiz answers in localStorage
export const saveQuizAnswers = (answers) => {
  localStorage.setItem('quizAnswers', JSON.stringify(answers));
};

export const getQuizAnswers = () => {
  const answers = localStorage.getItem('quizAnswers');
  return answers ? JSON.parse(answers) : null;
};

export const saveUserProfile = (user) => {
  localStorage.setItem('userProfile', JSON.stringify(user));
};

export const getUserProfile = () => {
  const user = localStorage.getItem('userProfile');
  return user ? JSON.parse(user) : mockUser;
};

export const logWorkout = (workout) => {
  const workouts = JSON.parse(localStorage.getItem('workoutLog') || '[]');
  workouts.push({
    ...workout,
    completedAt: new Date().toISOString()
  });
  localStorage.setItem('workoutLog', JSON.stringify(workouts));
};

export const getWorkoutLog = () => {
  return JSON.parse(localStorage.getItem('workoutLog') || '[]');
};