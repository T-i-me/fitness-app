import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import Dashboard from './components/Dashboard';
import ExerciseLibrary from './components/ExerciseLibrary';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import WorkoutDetail from './components/WorkoutDetail';
import { Toaster } from './components/ui/sonner';
import { getQuizAnswers } from './mockData';

function ProtectedRoute({ children }) {
  const hasCompletedQuiz = getQuizAnswers();
  return hasCompletedQuiz ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<QuizPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <ExerciseLibrary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workout-detail"
          element={
            <ProtectedRoute>
              <WorkoutDetail />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
