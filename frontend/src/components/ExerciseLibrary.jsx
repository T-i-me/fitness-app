import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import * as Icons from 'lucide-react';
import { exercises } from '../mockData';

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Cardio'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
                <Icons.Book className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Category:</span>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Difficulty:</span>
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={selectedDifficulty === difficulty ? 'bg-blue-600' : ''}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {filteredExercises.length} Exercise{filteredExercises.length !== 1 ? 's' : ''} Found
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="p-6 bg-white hover:shadow-xl transition-all duration-200 hover:scale-105 border-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icons.Dumbbell className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {exercise.difficulty}
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Icons.Target className="w-4 h-4 text-blue-600" />
                    <span>{exercise.muscleGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Icons.Package className="w-4 h-4 text-blue-600" />
                    <span>{exercise.equipment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Icons.Activity className="w-4 h-4 text-blue-600" />
                    <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  </div>
                </div>

                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {exercise.category}
                </Badge>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <Icons.Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No exercises found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;