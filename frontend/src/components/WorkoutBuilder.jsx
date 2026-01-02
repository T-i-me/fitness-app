import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import * as Icons from 'lucide-react';
import { getUserProfile } from '../mockData';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkoutBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('30');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [workoutType, setWorkoutType] = useState('Strength');
  const [scheduledFor, setScheduledFor] = useState('');
  const [exercises, setExercises] = useState([{
    name: '',
    sets: 3,
    reps: '10'
  }]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: '10' }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSaveWorkout = async () => {
    // Validation
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive"
      });
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = getUserProfile();
      const workoutData = {
        name: workoutName,
        duration: `${duration} min`,
        difficulty,
        type: workoutType,
        exercises: validExercises,
        scheduledFor
      };

      await axios.post(`${API}/users/${user.id}/workouts`, workoutData);
      
      toast({
        title: "Success!",
        description: "Custom workout created successfully"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive"
      });
    }
  };

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
                <Icons.Plus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Custom Workout Builder</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Workout Info */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Workout Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name" className="text-gray-700 font-medium mb-2 block">
                Workout Name *
              </Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Upper Body Blast"
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-gray-700 font-medium mb-2 block">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="10"
                  max="120"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block">
                  Difficulty
                </Label>
                <div className="flex gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? 'default' : 'outline'}
                      onClick={() => setDifficulty(level)}
                      className={difficulty === level ? 'bg-blue-600' : ''}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">
                  Workout Type
                </Label>
                <div className="flex gap-2">
                  {['Strength', 'Cardio', 'Mixed'].map((type) => (
                    <Button
                      key={type}
                      variant={workoutType === type ? 'default' : 'outline'}
                      onClick={() => setWorkoutType(type)}
                      className={workoutType === type ? 'bg-blue-600' : ''}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="scheduled-for" className="text-gray-700 font-medium mb-2 block">
                  Schedule For (optional)
                </Label>
                <Input
                  id="scheduled-for"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  placeholder="e.g., Monday, Tuesday"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Exercises */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Exercises</h3>
            <Button onClick={addExercise} className="bg-green-600 hover:bg-green-700">
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <Card key={index} className="p-4 bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-sm text-gray-700 mb-1 block">
                        Exercise Name *
                      </Label>
                      <Input
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        placeholder="e.g., Push-ups"
                        className="h-10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm text-gray-700 mb-1 block">Sets</Label>
                        <Input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-700 mb-1 block">Reps</Label>
                        <Input
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                          placeholder="e.g., 10 or 30s"
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={exercises.length === 1}
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icons.Dumbbell className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{workoutName || 'Untitled Workout'}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Icons.Clock className="w-4 h-4" />
                <span>{duration} min</span>
              </div>
              <Badge variant="outline">{difficulty}</Badge>
              <Badge variant="outline">{workoutType}</Badge>
            </div>
            <div className="text-sm text-gray-600">
              {exercises.filter(ex => ex.name.trim()).length} exercise(s)
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveWorkout}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Icons.Save className="w-4 h-4 mr-2" />
            Save Workout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;