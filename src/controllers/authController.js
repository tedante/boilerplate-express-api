const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res, next) => {
  const { username, password, role } = req.body;
  try {
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    err.statusCode = 422;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).populate('role');
    if (user && (await user.matchPassword(password))) {
      res.json({ token: generateToken(user._id) });
    } else {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};