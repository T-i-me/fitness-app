import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import * as Icons from 'lucide-react';
import { getUserProfile, saveUserProfile } from '../mockData';
import { useToast } from '../hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const profile = getUserProfile();
    setUser(profile);
    setFormData(profile);
  }, []);

  const handleSave = () => {
    saveUserProfile(formData);
    setUser(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <div className="p-2 bg-blue-600 rounded-lg">
                <Icons.User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="p-8 mb-6 bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-700">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? (
                <>
                  <Icons.Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Icons.Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="h-12"
              />
            </div>
          </div>
        </Card>

        {/* Fitness Stats */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Fitness Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <Icons.Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{user.currentStreak}</div>
              <div className="text-sm text-orange-700">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Icons.Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{user.totalWorkouts}</div>
              <div className="text-sm text-blue-700">Total Workouts</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Icons.Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{user.longestStreak}</div>
              <div className="text-sm text-purple-700">Longest Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Icons.Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{user.fitnessLevel}</div>
              <div className="text-sm text-green-700">Fitness Level</div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icons.Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Daily Reminders</div>
                  <div className="text-sm text-gray-600">Get notified about your workouts</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icons.Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-600">Switch to dark theme</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Coming Soon</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icons.Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Language</div>
                  <div className="text-sm text-gray-600">Choose your language</div>
                </div>
              </div>
              <Badge variant="outline">English</Badge>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 bg-white border-0 shadow-lg border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200">
              <Icons.RefreshCw className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200">
              <Icons.Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;