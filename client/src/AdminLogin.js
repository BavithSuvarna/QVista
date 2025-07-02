import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ✅ Read credentials securely from environment variables
const USERNAME = process.env.REACT_APP_ADMIN_USERNAME;
const PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true'); // ✅ store flag
      navigate('/admin/panel');
    } else {
      toast.error('❌ Invalid credentials');
    }
  };

  return (
    <div className='content' style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#003366', marginBottom: '30px' }}> Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: '12px',
            marginBottom: '20px',
            width: '280px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            marginBottom: '30px',
            width: '280px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
