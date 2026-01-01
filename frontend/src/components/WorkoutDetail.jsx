import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import * as Icons from 'lucide-react';
import { logWorkout } from '../mockData';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

const WorkoutDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plan } = location.state || {};
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  if (!plan) {
    navigate('/dashboard');
    return null;
  }

  const handleExerciseToggle = (exerciseIndex) => {
    if (completedExercises.includes(exerciseIndex)) {
      setCompletedExercises(completedExercises.filter(i => i !== exerciseIndex));
    } else {
      setCompletedExercises([...completedExercises, exerciseIndex]);
    }
  };

  const handleCompleteWorkout = () => {
    logWorkout(plan);
    toast({
      title: "Workout Completed! 🎉",
      description: "Great job! Keep up the amazing work.",
    });
    navigate('/dashboard');
  };

  const progress = (completedExercises.length / plan.exercises.length) * 100;

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
                <Icons.Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{plan.difficulty}</Badge>
              <Badge className="bg-blue-100 text-blue-700">{plan.duration}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">Workout Progress</h3>
              <p className="text-blue-100">{completedExercises.length} of {plan.exercises.length} exercises completed</p>
            </div>
            <div className="text-4xl font-bold">{Math.round(progress)}%</div>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        {/* Start Workout Button */}
        {!isWorkoutStarted && (
          <Card className="p-8 mb-6 bg-white border-0 shadow-lg text-center">
            <Icons.Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
            <p className="text-gray-600 mb-6">Your {plan.duration} workout is ready. Let's get moving!</p>
            <Button 
              onClick={() => setIsWorkoutStarted(true)}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              <Icons.Play className="w-5 h-5 mr-2" />
              Start Workout
            </Button>
          </Card>
        )}

        {/* Exercise List */}
        {isWorkoutStarted && (
          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Exercises</h3>
            {plan.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.includes(index);
              return (
                <Card 
                  key={index} 
                  className={`p-6 bg-white border-0 shadow-lg transition-all duration-200 ${
                    isCompleted ? 'bg-green-50 border-2 border-green-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => handleExerciseToggle(index)}
                      className="mt-1 w-6 h-6"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-xl font-bold ${
                          isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
                        }`}>
                          {index + 1}. {exercise.name}
                        </h4>
                        {isCompleted && (
                          <Badge className="bg-green-600">
                            <Icons.CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Icons.Repeat className="w-4 h-4" />
                          <span className="font-medium">{exercise.sets} sets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icons.Activity className="w-4 h-4" />
                          <span className="font-medium">{exercise.reps} reps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Complete Workout Button */}
        {isWorkoutStarted && completedExercises.length === plan.exercises.length && (
          <Card className="p-8 bg-gradient-to-r from-green-500 to-green-600 border-0 text-white text-center">
            <Icons.Trophy className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">Amazing Work!</h3>
            <p className="text-green-100 mb-6">You've completed all exercises. Ready to finish?</p>
            <Button 
              onClick={handleCompleteWorkout}
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6"
            >
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              Complete Workout
            </Button>
          </Card>
        )}

        {/* Tips Card */}
        {isWorkoutStarted && (
          <Card className="p-6 bg-blue-50 border-0 mt-6">
            <div className="flex items-start gap-3">
              <Icons.Lightbulb className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-2">Pro Tips</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Focus on proper form over speed</li>
                  <li>• Rest 60-90 seconds between sets</li>
                  <li>• Stay hydrated throughout your workout</li>
                  <li>• Listen to your body and adjust as needed</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;