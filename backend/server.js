const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
const sweetsRoutes = require('./src/routes/sweetsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/', (req, res) => {
      res.send('Sweet Shop API is running');
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
      mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop')
            .then(() => {
                  console.log('Connected to MongoDB');
                  app.listen(PORT, () => {
                        console.log(`Server running on port ${PORT}`);
                  });
            })
            .catch((err) => {
                  console.error('Database connection error:', err);
            });
}

module.exports = app;
