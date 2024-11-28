const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 1000, 
  max: 60, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;