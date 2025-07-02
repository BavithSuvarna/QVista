const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Allow CORS for both localhost and production frontend
const allowedOrigins = [
  'http://localhost:3000',        // local dev
  'https://qvista.vercel.app'  // your deployed frontend domain (replace this!)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/queue', require('./routes/queue'));

const PORT = process.env.PORT || 5000;
app.get('/ping', (req, res) => {
  res.send('Server is alive');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
