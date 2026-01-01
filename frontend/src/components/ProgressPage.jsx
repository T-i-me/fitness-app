import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import * as Icons from 'lucide-react';
import { getUserProfile, getWorkoutLog, progressData } from '../mockData';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);

  useEffect(() => {
    const profile = getUserProfile();
    setUser(profile);
    const log = getWorkoutLog();
    setWorkoutLog(log);
  }, []);

  if (!user) return null;

  const totalDuration = progressData.reduce((sum, day) => sum + day.duration, 0);
  const averageDuration = Math.round(totalDuration / progressData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <Icons.ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-2 bg-blue-600 rounded-lg">
                <Icons.TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Icons.Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">{user.totalWorkouts}</div>
                <div className="text-sm text-blue-700 font-medium">Total Workouts</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Icons.Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-900">{totalDuration}</div>
                <div className="text-sm text-purple-700 font-medium">Total Minutes</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <Icons.TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-900">{averageDuration}</div>
                <div className="text-sm text-green-700 font-medium">Avg Duration</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Streak Info */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-orange-50 to-orange-100 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-600 rounded-lg">
                <Icons.Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-orange-900">{user.currentStreak} Day Streak!</h3>
                <p className="text-orange-700">Your longest streak: {user.longestStreak} days</p>
              </div>
            </div>
            <Badge className="bg-orange-600 text-white text-lg px-4 py-2">On Fire!</Badge>
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-6 mb-8 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Workout Activity</h3>
          <div className="space-y-4">
            {progressData.map((day, idx) => {
              const maxDuration = Math.max(...progressData.map(d => d.duration));
              const barWidth = (day.duration / maxDuration) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-600">{day.duration} min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Workouts */}
        <Card className="p-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h3>
          {workoutLog.length > 0 ? (
            <div className="space-y-4">
              {workoutLog.slice(-5).reverse().map((workout, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icons.CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{workout.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.completedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{workout.duration}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icons.Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No workouts logged yet. Start exercising to see your progress!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;