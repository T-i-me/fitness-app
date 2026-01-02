import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import * as Icons from 'lucide-react';
import axios from 'axios';
import { getUserProfile } from '../mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIFeatures = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [restDaySuggestion, setRestDaySuggestion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [exerciseName, setExerciseName] = useState('');

  useEffect(() => {
    const profile = getUserProfile();
    setUser(profile);
  }, []);

  const handleGetRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai/workout-recommendations`, {
        user_id: user.id
      });
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get AI recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRestDaySuggestion = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai/rest-day-suggestion`, {
        user_id: user.id
      });
      setRestDaySuggestion(response.data);
    } catch (error) {
      console.error('Error getting rest day suggestion:', error);
      alert('Failed to get rest day suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormCheck = async () => {
    if (!selectedImage || !exerciseName) {
      alert('Please select an image and enter exercise name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai/form-check`, {
        exercise_name: exerciseName,
        image_base64: selectedImage
      });
      setFormAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing form:', error);
      alert('Failed to analyze form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
              <div className="p-2 bg-purple-600 rounded-lg">
                <Icons.Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Features</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* AI Workout Recommendations */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Workout Recommendations</h3>
              <p className="text-gray-600">Get personalized workout plans based on your progress</p>
            </div>
            <Button 
              onClick={handleGetRecommendations} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Icons.Sparkles className="w-4 h-4 mr-2" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>

          {recommendations.length > 0 && (
            <div className="space-y-4 mt-6">
              {recommendations.map((rec, idx) => (
                <Card key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{rec.name}</h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <Badge variant="outline">{rec.difficulty}</Badge>
                        <div className="flex items-center gap-1">
                          <Icons.Clock className="w-4 h-4" />
                          {rec.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.rationale}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Exercises:</p>
                    {rec.exercises.map((ex, i) => (
                      <div key={i} className="text-sm text-gray-700">
                        • {ex.name} - {ex.sets}x{ex.reps}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Rest Day Suggestion */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Rest Day Suggestion</h3>
              <p className="text-gray-600">AI-powered recovery recommendations</p>
            </div>
            <Button 
              onClick={handleGetRestDaySuggestion} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Icons.Brain className="w-4 h-4 mr-2" />
                  Check Recovery
                </>
              )}
            </Button>
          </div>

          {restDaySuggestion && (
            <Card className={`p-4 mt-6 ${
              restDaySuggestion.should_rest 
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {restDaySuggestion.should_rest ? (
                  <Icons.AlertCircle className="w-6 h-6 text-orange-600" />
                ) : (
                  <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {restDaySuggestion.should_rest ? 'Time for a Rest Day' : 'You\'re Good to Go!'}
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">{restDaySuggestion.reasoning}</p>
                </div>
              </div>
              
              {restDaySuggestion.should_rest && restDaySuggestion.recovery_tips && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Recovery Tips:</p>
                  <ul className="space-y-1">
                    {restDaySuggestion.recovery_tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {restDaySuggestion.light_activities && restDaySuggestion.light_activities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Light Activities:</p>
                  <ul className="space-y-1">
                    {restDaySuggestion.light_activities.map((activity, i) => (
                      <li key={i} className="text-sm text-gray-700">• {activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </Card>

        {/* Form Checker */}
        <Card className="p-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Form Checker</h3>
          <p className="text-gray-600 mb-6">Upload an image of your exercise for AI feedback</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Name
              </label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g., Push-up, Squat, Deadlift"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Exercise Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <Button 
              onClick={handleFormCheck} 
              disabled={loading || !selectedImage || !exerciseName}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Form...
                </>
              ) : (
                <>
                  <Icons.Camera className="w-4 h-4 mr-2" />
                  Analyze Form
                </>
              )}
            </Button>
          </div>

          {formAnalysis && (
            <Card className="p-4 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Form Analysis</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">{formAnalysis.score}</span>
                  <span className="text-sm text-gray-600">/ 10</span>
                </div>
              </div>
              
              <Progress value={formAnalysis.score * 10} className="h-2 mb-4" />

              {formAnalysis.strengths && formAnalysis.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                    Strengths:
                  </p>
                  <ul className="space-y-1">
                    {formAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formAnalysis.improvements && formAnalysis.improvements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Icons.AlertTriangle className="w-4 h-4 text-orange-600" />
                    Improvements:
                  </p>
                  <ul className="space-y-1">
                    {formAnalysis.improvements.map((improvement, i) => (
                      <li key={i} className="text-sm text-gray-700">• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formAnalysis.safety_concerns && formAnalysis.safety_concerns.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                    <Icons.AlertOctagon className="w-4 h-4" />
                    Safety Concerns:
                  </p>
                  <ul className="space-y-1">
                    {formAnalysis.safety_concerns.map((concern, i) => (
                      <li key={i} className="text-sm text-red-700">• {concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formAnalysis.tips && formAnalysis.tips.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Icons.Lightbulb className="w-4 h-4 text-blue-600" />
                    Tips:
                  </p>
                  <ul className="space-y-1">
                    {formAnalysis.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;