import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import * as Icons from 'lucide-react';
import { getUserProfile, workoutPlans, logWorkout } from '../mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState(workoutPlans);

  useEffect(() => {
    const profile = getUserProfile();
    setUser(profile);
  }, []);

  const handleStartWorkout = (plan) => {
    navigate('/workout-detail', { state: { plan } });
  };

  const handleCompleteWorkout = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      logWorkout(plan);
      setPlans(plans.map(p => 
        p.id === planId ? { ...p, completed: true } : p
      ));
      setUser(prev => ({
        ...prev,
        totalWorkouts: prev.totalWorkouts + 1,
        currentStreak: prev.currentStreak + 1
      }));
    }
  };

  if (!user) return null;

  const weeklyGoal = 4;
  const completedThisWeek = plans.filter(p => p.completed).length;
  const weeklyProgress = (completedThisWeek / weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Icons.Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">GetFit Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/exercises')}>
                <Icons.Book className="w-4 h-4 mr-2" />
                Exercises
              </Button>
              <Button variant="ghost" onClick={() => navigate('/progress')}>
                <Icons.TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                <Icons.User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">Ready to crush your fitness goals today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-0">
            <div className="flex items-center justify-between mb-2">
              <Icons.Flame className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-600">Active</Badge>
            </div>
            <div className="text-3xl font-bold text-orange-900">{user.currentStreak}</div>
            <div className="text-sm text-orange-700 font-medium">Day Streak</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center justify-between mb-2">
              <Icons.Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900">{user.totalWorkouts}</div>
            <div className="text-sm text-blue-700 font-medium">Total Workouts</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center justify-between mb-2">
              <Icons.Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-900">{user.longestStreak}</div>
            <div className="text-sm text-purple-700 font-medium">Longest Streak</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center justify-between mb-2">
              <Icons.Calendar className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900">{completedThisWeek}/{weeklyGoal}</div>
            <div className="text-sm text-green-700 font-medium">Weekly Goal</div>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
            <span className="text-sm font-medium text-blue-600">{Math.round(weeklyProgress)}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">Keep going! {weeklyGoal - completedThisWeek} workouts left to hit your weekly goal.</p>
        </Card>

        {/* Today's Workouts */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Workout Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6 bg-white hover:shadow-xl transition-shadow duration-200 border-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={plan.completed ? "secondary" : "default"} className={plan.completed ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                    {plan.completed ? 'Completed' : plan.scheduledFor}
                  </Badge>
                  <Badge variant="outline">{plan.difficulty}</Badge>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Icons.Clock className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Dumbbell className="w-4 h-4" />
                    <span>{plan.exercises.length} exercises</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {plan.exercises.slice(0, 3).map((ex, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      • {ex.name} - {ex.sets}x{ex.reps}
                    </div>
                  ))}
                  {plan.exercises.length > 3 && (
                    <div className="text-sm text-gray-500">+ {plan.exercises.length - 3} more exercises</div>
                  )}
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => handleStartWorkout(plan)}
                  disabled={plan.completed}
                >
                  {plan.completed ? (
                    <>
                      <Icons.CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Icons.Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need a new workout plan?</h3>
              <p className="text-blue-100">Retake the quiz to get a personalized plan</p>
            </div>
            <Button onClick={() => navigate('/')} variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Icons.RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;