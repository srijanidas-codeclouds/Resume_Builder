import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UserProvider, { UserContext } from './context/UserContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
// import EditingResume from './components/EditingResume.jsx';
import { Toaster } from 'react-hot-toast';
import EditResume from './components/EditResume.jsx';
import ViewTemplate from './components/ViewTemplate.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

const AppRoutes = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // Wait until auth check finishes

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* If user logged in, redirect away from signin/signup */}
      <Route
        path="/signin"
        element={user ? <Navigate to="/dashboard" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/signin" /> : <SignUp />}
      />

      {/* Protect dashboard */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/signin" />}
      />
      <Route
        path='/resume/:resumeId'
        element={<EditResume /> }
      />
      <Route path="/templates" element={<ViewTemplate />} />
      <Route path='/verify/:token' element={<VerifyEmail />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
      <Toaster toastOptions={{
        className:"",
        style:{
          fontSize: '13px',
        }
      }}>
      </Toaster>
    </UserProvider>
  );
};

export default App;
