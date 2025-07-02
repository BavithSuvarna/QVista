import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const formatIST = (isoDateString) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const callNext = async () => {
    try {
      const res = await axios.post('https://qserver-ispi.onrender.com/api/queue/call-next');

      if (res.data.empty) {
        setCurrentUser({ empty: true });
      } else if (res.data && res.data._id) {
        setCurrentUser(res.data);
        toast.success('👋 Called next person!');
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      toast.error('❌ Failed to call next!');
    }
  };

  const markServed = async () => {
    if (!currentUser || !currentUser._id) return;
    try {
      await axios.post(`https://qserver-ispi.onrender.com/api/queue/mark-served/${currentUser._id}`);
      setCurrentUser(null);
      toast.success('✅ Marked as served!');
    } catch (error) {
      toast.error('❌ Failed to mark as served!');
    }
  };

  const markNotArrived = async () => {
    if (!currentUser || !currentUser._id) return;
    try {
      await axios.post(`https://qserver-ispi.onrender.com/api/queue/not-arrived/${currentUser._id}`);
      setCurrentUser(null);
      toast.info('⏰ Moved to Not Arrived!');
    } catch (error) {
      toast.error('❌ Failed to move to Not Arrived!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn'); // ✅ logout logic
    window.location.href = '/admin';
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px', minHeight: '50vh' }}>
      <h2> Admin Panel</h2>

      <div style={{ marginBottom: '30px' }}>
        <button onClick={handleLogout} style={btnStyle('#336699')}> Logout</button>
        <button onClick={callNext} style={btnStyle('#007bff')}>📣 Call Next</button>
        <button onClick={markServed} disabled={!currentUser?._id} style={btnStyle(currentUser?._id ? '#28a745' : '#ccc', !currentUser?._id)}>✅ Served</button>
        <button onClick={markNotArrived} disabled={!currentUser?._id} style={btnStyle(currentUser?._id ? '#dc3545' : '#ccc', !currentUser?._id)}>⏰ Not Arrived</button>
      </div>

      <p style={{ fontSize: '18px' }}>
        {currentUser?.empty
          ? ' Queue is empty!'
          : currentUser?.name
          ? `Now Serving: ${currentUser.name} (${currentUser.phone})`
          : 'Click "Call Next" to start serving.'}
      </p>

      {currentUser?.joinedAt && (
        <p style={{ color: '#666', marginTop: '10px' }}>
          Joined At: {formatIST(currentUser.joinedAt)}
        </p>
      )}
    </div>
  );
};

const btnStyle = (bg, disabled = false) => ({
  marginRight: '10px',
  backgroundColor: bg,
  color: '#fff',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
});

export default AdminPanel;
