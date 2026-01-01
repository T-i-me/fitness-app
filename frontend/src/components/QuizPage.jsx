import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { quizQuestions, saveQuizAnswers } from '../mockData';
import * as Icons from 'lucide-react';

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      saveQuizAnswers(newAnswers);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[quizQuestions[currentQuestion - 1].id] || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GetFit Pro</h1>
          <p className="text-gray-600">AI Fitness Tracker & Workout Plan Generator</p>
          <div className="flex items-center justify-center gap-8 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Icons.Users className="w-4 h-4" />
              <span>100k+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8★ Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Shield className="w-4 h-4" />
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.question}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option) => {
              const IconComponent = Icons[option.icon];
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    selectedOption === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedOption === option.value ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        selectedOption === option.value ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className={`text-lg font-medium ${
                      selectedOption === option.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentQuestion === 0}
            className="px-8"
          >
            <Icons.ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Complete' : 'Next'}
            <Icons.ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;