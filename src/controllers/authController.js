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
    const user = new User({ username, password, 
      role: (await Role.findOne({ name: role }))._id
     });
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
    const isMatch = await user.matchPassword(password);
    
    if (user && isMatch) {
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