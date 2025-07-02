import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QueueDisplay = () => {
  const [queue, setQueue] = useState([]);
  const [notArrived, setNotArrived] = useState([]);

  const fetchQueue = async () => {
    try {
      const res = await axios.get('https://qserver-ispi.onrender.com/api/queue');
      setQueue(res.data.queue || []);
      setNotArrived(res.data.notArrived || []);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const rejoin = async (id) => {
    try {
      await axios.post(`https://qserver-ispi.onrender.com/api/queue/rejoin/${id}`);
      fetchQueue();
    } catch (err) {
      console.error('Error rejoining:', err);
    }
  };

  const exit = async (id) => {
    try {
      await axios.delete(`https://qserver-ispi.onrender.com/api/queue/exit/${id}`);
      fetchQueue();
    } catch (err) {
      console.error('Error exiting:', err);
    }
  };

  const clearNotArrived = async () => {
    const confirm = window.confirm('Are you sure you want to clear the Not Arrived list?');
    if (!confirm) return;
    try {
      await axios.post('https://qserver-ispi.onrender.com/api/queue/clear-not-arrived');
      fetchQueue();
    } catch (err) {
      console.error('Error clearing not arrived list:', err);
    }
  };

  const displayQueue = queue.filter(user => user.status === 'waiting' || user.status === 'called');

  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true'; // ✅ new check

  return (
    <div className="content" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#003366', marginBottom: '30px' }}>Queue Display</h2>

      {displayQueue.length === 0 ? (
        <p style={{ fontSize: '18px', color: '#003366' }}>Queue Empty.</p>
      ) : (
        <>
          <h3 style={{ color: '#003366' }}>🟢 Active Queue</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {displayQueue.map((user, idx) => (
              <li key={user._id} style={{
                backgroundColor: '#fff',
                margin: '10px auto',
                padding: '15px 20px',
                borderRadius: '10px',
                maxWidth: '400px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '16px',
                color: '#003366'
              }}>
                {idx + 1}. {user.name} — <strong>{user.status}</strong>
              </li>
            ))}
          </ul>
        </>
      )}

      {notArrived.length > 0 && (
        <>
          <h3 style={{ color: '#cc0000', marginTop: '30px' }}>⏰ Not Arrived On Time</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notArrived.map((user) => {
              const currentUserId = localStorage.getItem('userId');
              const isUser = currentUserId === user._id;
              return (
                <li key={user._id} style={{
                  backgroundColor: '#fff',
                  margin: '10px auto',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  maxWidth: '500px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: '16px',
                  color: '#cc0000',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{user.name}</span>
                  {isUser && (
                    <div>
                      <button
                        onClick={() => rejoin(user._id)}
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}>
                        Join Again
                      </button>
                      <button
                        onClick={() => exit(user._id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          padding: '6px 10px',
                          cursor: 'pointer'
                        }}>
                        Exit
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {isAdmin && displayQueue.length === 0 && notArrived.length > 0 && (
        <button
          onClick={clearNotArrived}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#ff6600',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
          Clear Not Arrived List
        </button>
      )}
    </div>
  );
};

export default QueueDisplay;
