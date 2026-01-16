import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Article from './pages/Article';
import Write from './pages/Write';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Admin from './pages/Admin';
import Contributors from './pages/Contributors';
import ContributorProfile from './pages/ContributorProfile';

const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/write" element={<Write />} />
              <Route path="/write/:id" element={<Write />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/tags" element={<Search />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contributors" element={<Contributors />} />
              <Route path="/contributor/:id" element={<ContributorProfile />} />
            </Routes>
          </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
