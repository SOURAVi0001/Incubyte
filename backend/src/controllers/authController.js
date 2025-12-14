const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
      return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '30d'
      });
};

const register = async (req, res) => {
      try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                  return res.status(400).json({ message: 'Please add all fields' });
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                  return res.status(400).json({ message: 'User already exists' });
            }

            const user = await User.create({
                  username,
                  email,
                  password
            });

            if (user) {
                  res.status(201).json({
                        user: {
                              id: user._id,
                              username: user.username,
                              email: user.email,
                              role: user.role
                        },
                        token: generateToken(user._id)
                  });
            } else {
                  res.status(400).json({ message: 'Invalid user data' });
            }
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
      }
};

const login = async (req, res) => {
      try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (user && (await user.matchPassword(password))) {
                  res.json({
                        user: {
                              id: user._id,
                              username: user.username,
                              email: user.email,
                              role: user.role
                        },
                        token: generateToken(user._id)
                  });
            } else {
                  res.status(400).json({ message: 'Invalid credentials' });
            }
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
      }
};

module.exports = {
      register,
      login
};
