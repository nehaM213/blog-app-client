import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogView from './components/ViewBlog';
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/blogs" element={token ? <BlogList /> : <Navigate to="/login" />} />
        <Route path="/blogs/new" element={token ? <BlogForm /> : <Navigate to="/login" />} />
        <Route path="/blogs/edit/:id" element={token ? <BlogForm /> : <Navigate to="/login" />} />
        <Route path="/blogs/view/:id" element={<BlogView />} />
      </Routes>
    </Router>
  );
}

export default App;
