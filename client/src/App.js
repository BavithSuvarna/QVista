// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar'; // New Navbar
import UserCheckIn from './UserCheckIn';
import QueueDisplay from './QueueDisplay';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar at top */}

        <Routes>
          <Route path="/" element={<UserCheckIn />} />
          <Route path="/queue" element={<QueueDisplay />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/panel"
            element={isAdminLoggedIn ? <AdminPanel /> : <Navigate to="/admin" />}
          />
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          style={{
            position: 'fixed',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
        />
      </div>
    </Router>
  );
}

export default App;
